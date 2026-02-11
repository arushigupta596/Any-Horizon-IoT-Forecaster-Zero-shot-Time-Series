// Forecast API route
import { NextRequest, NextResponse } from 'next/server';
import { ForecastRequestSchema } from '@/lib/validators';
import { resample, parseFreqToSeconds } from '@/lib/processing/resampler';
import { handleMissing } from '@/lib/processing/missing-handler';
import { handleOutliers } from '@/lib/processing/outlier-handler';
import { callLangLlama } from '@/lib/llm/llm-client';
import { validateLLMResponse } from '@/lib/llm/response-validator';
import { buildPrompt } from '@/lib/llm/prompt-builder';
import { convertTimeToSteps, generateRunId } from '@/lib/utils/time-utils';
import { logRequest } from '@/lib/utils/logger';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const run_id = generateRunId();

  try {
    const body = await req.json();
    const config = ForecastRequestSchema.parse(body);

    // Convert horizon if needed
    let horizonSteps = config.horizon_steps || 0;
    if (config.horizon_mode === 'TIME' && config.horizon_time) {
      const freqSeconds = parseFreqToSeconds(config.resample_freq) || 60;
      horizonSteps = convertTimeToSteps(config.horizon_time, freqSeconds);
    }

    // Enforce max horizon
    const MAX_HORIZON = parseInt(process.env.MAX_HORIZON_STEPS || '2000');
    if (horizonSteps > MAX_HORIZON) {
      return NextResponse.json(
        {
          success: false,
          error: `Horizon exceeds maximum of ${MAX_HORIZON} steps`,
        },
        { status: 400 }
      );
    }

    // Parse timestamps
    const data = config.data.map((d) => ({
      timestamp: new Date(d.timestamp),
      value: d.value,
    }));

    // Resample
    const resampled = resample(data, {
      freq: config.resample_freq,
      aggregation: 'mean',
    });

    // Handle missing
    const filled = handleMissing(resampled, config.missing_policy);

    // Handle outliers
    const cleaned = handleOutliers(filled, config.outlier_policy);

    // Limit context window
    const contextLimit = 1024;
    const context = cleaned.slice(-contextLimit);

    if (context.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient data after processing (need at least 10 points)',
        },
        { status: 400 }
      );
    }

    // Build prompt
    const prompt = buildPrompt({
      history: context,
      horizon: horizonSteps,
      uncertainty: config.uncertainty,
    });

    // Call LLM
    let llmResponse = await callLangLlama(prompt, config.uncertainty);

    // Validate and retry once if needed
    let validated = validateLLMResponse(
      llmResponse,
      horizonSteps,
      config.uncertainty
    );

    if (!validated.valid) {
      console.warn('LLM response invalid, retrying...', validated.errors);
      const retryResponse = await callLangLlama(prompt, config.uncertainty);
      validated = validateLLMResponse(
        retryResponse,
        horizonSteps,
        config.uncertainty
      );

      if (!validated.valid) {
        logRequest({
          run_id,
          timestamp: new Date().toISOString(),
          endpoint: '/api/forecast',
          duration_ms: Date.now() - startTime,
          data_points: context.length,
          horizon: horizonSteps,
          success: false,
          error: 'LLM validation failed after retry',
        });

        return NextResponse.json(
          {
            success: false,
            error: 'LLM returned invalid response after retry',
            details: validated.errors,
          },
          { status: 500 }
        );
      }
    }

    // Generate forecast timestamps
    const lastTimestamp = cleaned[cleaned.length - 1].timestamp;
    const freqMs = (parseFreqToSeconds(config.resample_freq) || 60) * 1000;
    const forecastTimestamps = Array.from(
      { length: horizonSteps },
      (_, i) => new Date(lastTimestamp.getTime() + (i + 1) * freqMs).toISOString()
    );

    // Build response
    const result = {
      meta: {
        detected_freq_seconds: parseFreqToSeconds(config.resample_freq) || 60,
        used_freq_seconds: parseFreqToSeconds(config.resample_freq) || 60,
        horizon_steps: horizonSteps,
        start_timestamp: forecastTimestamps[0],
        quality_flags: validated.data!.quality_flags,
      },
      history: {
        timestamps: context.map((d) => d.timestamp.toISOString()),
        values: context.map((d) => d.value),
      },
      forecast: {
        timestamps: forecastTimestamps,
        p50: validated.data!.p50,
        ...(config.uncertainty && {
          p10: validated.data!.p10,
          p90: validated.data!.p90,
        }),
      },
      run_config: {
        run_id,
        timestamp: new Date().toISOString(),
        config: config,
        model: process.env.LLM_MODEL_NAME || 'lang-llama',
      },
    };

    logRequest({
      run_id,
      timestamp: new Date().toISOString(),
      endpoint: '/api/forecast',
      duration_ms: Date.now() - startTime,
      data_points: context.length,
      horizon: horizonSteps,
      success: true,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Forecast API error:', error);

    logRequest({
      run_id,
      timestamp: new Date().toISOString(),
      endpoint: '/api/forecast',
      duration_ms: Date.now() - startTime,
      data_points: 0,
      horizon: 0,
      success: false,
      error: error.message,
    });

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
