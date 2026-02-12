// LLM client for Lang-Llama or OpenAI
import type { LLMResponse } from '../types';
import { LLMError } from '../types';

export async function callLangLlama(
  prompt: string,
  uncertainty: boolean
): Promise<LLMResponse> {
  const endpoint = process.env.LLM_BASE_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL_NAME || 'gpt-4-turbo-preview';
  const temperature = parseFloat(process.env.LLM_TEMPERATURE || '0');

  if (!endpoint || !apiKey) {
    throw new LLMError('LLM configuration missing (LLM_BASE_URL or LLM_API_KEY)');
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a precise time-series forecasting model. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new LLMError(
        `LLM API error: ${response.status} ${response.statusText}`,
        { errorText }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new LLMError('No content in LLM response');
    }

    try {
      return JSON.parse(content);
    } catch (e) {
      throw new LLMError('LLM returned non-JSON response', { content });
    }
  } catch (error: any) {
    if (error instanceof LLMError) {
      throw error;
    }
    throw new LLMError(`LLM request failed: ${error.message}`);
  }
}
