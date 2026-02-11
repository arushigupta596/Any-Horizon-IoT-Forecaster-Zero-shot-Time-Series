// LLM prompt building utilities
import { mean, min, max, standardDeviation } from 'simple-statistics';

export interface PromptConfig {
  history: Array<{ timestamp: Date; value: number }>;
  horizon: number;
  uncertainty: boolean;
}

export function buildPrompt(config: PromptConfig): string {
  const stats = calculateContextStats(config.history);
  const lastValues = config.history
    .slice(-50)
    .map((d) => d.value.toFixed(2))
    .join(', ');

  return `You are a time-series forecasting expert. Generate a ${config.horizon}-step forecast for the following IoT sensor data.

**Context Statistics:**
- Data points: ${config.history.length}
- Time range: ${config.history[0].timestamp.toISOString()} to ${config.history[config.history.length - 1].timestamp.toISOString()}
- Min: ${stats.min.toFixed(2)}, Max: ${stats.max.toFixed(2)}, Mean: ${stats.mean.toFixed(2)}, Std: ${stats.std.toFixed(2)}
- Trend: ${stats.trend}

**Last 50 values:**
${lastValues}

**Task:**
Forecast the next ${config.horizon} values.${config.uncertainty ? ' Provide P10, P50, and P90 quantiles.' : ' Provide point predictions (P50).'}

**Output Format (strict JSON only):**
{
  "p50": [/* ${config.horizon} numbers */],
  ${config.uncertainty ? '"p10": [/* ' + config.horizon + ' numbers */],\n  "p90": [/* ' + config.horizon + ' numbers */],' : ''}
  "notes": "Brief reasoning (1 sentence)",
  "quality_flags": [/* array of applicable flags from: LOW_DATA, HIGH_MISSING, IRREGULAR_SAMPLING, OUTLIERS_PRESENT, LONG_HORIZON_UNCERTAIN, REGIME_SHIFT_DETECTED */]
}

Ensure:
${config.uncertainty ? '- p10[i] <= p50[i] <= p90[i] for all i\n' : ''}- All arrays have exactly ${config.horizon} elements
- Values are realistic given the context

Return ONLY valid JSON, no markdown or explanations.`;
}

function calculateContextStats(data: Array<{ value: number }>) {
  const values = data.map((d) => d.value).filter((v) => !isNaN(v));

  if (values.length === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      std: 0,
      trend: 'unknown',
    };
  }

  const meanVal = mean(values);
  const stdVal = values.length > 1 ? standardDeviation(values) : 0;

  // Simple trend detection
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  const firstMean = mean(firstHalf);
  const secondMean = mean(secondHalf);

  let trend = 'stable';
  if (secondMean > firstMean * 1.1) trend = 'increasing';
  else if (secondMean < firstMean * 0.9) trend = 'decreasing';

  return {
    min: min(values),
    max: max(values),
    mean: meanVal,
    std: stdVal,
    trend,
  };
}
