// LLM response validation utilities
import { LLMResponseSchema } from '../validators';
import type { LLMResponse } from '../types';

export interface ValidationResult {
  valid: boolean;
  data?: LLMResponse;
  errors?: string[];
}

export function validateLLMResponse(
  response: any,
  expectedLength: number,
  uncertainty: boolean
): ValidationResult {
  const errors: string[] = [];

  // Schema validation
  const parsed = LLMResponseSchema.safeParse(response);
  if (!parsed.success) {
    return {
      valid: false,
      errors: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
    };
  }

  const data = parsed.data;

  // Length validation
  if (data.p50.length !== expectedLength) {
    errors.push(`p50 length ${data.p50.length} != expected ${expectedLength}`);
  }

  if (uncertainty) {
    if (!data.p10 || data.p10.length !== expectedLength) {
      errors.push(`p10 missing or wrong length`);
    }
    if (!data.p90 || data.p90.length !== expectedLength) {
      errors.push(`p90 missing or wrong length`);
    }

    // Quantile ordering
    if (data.p10 && data.p90) {
      for (let i = 0; i < Math.min(expectedLength, data.p50.length); i++) {
        if (!(data.p10[i] <= data.p50[i] && data.p50[i] <= data.p90[i])) {
          errors.push(`Quantile violation at index ${i}: p10=${data.p10[i]}, p50=${data.p50[i]}, p90=${data.p90[i]}`);
          break;
        }
      }
    }
  }

  // Numeric validation
  const allValues = [...data.p50, ...(data.p10 || []), ...(data.p90 || [])];

  if (allValues.some((v) => !isFinite(v))) {
    errors.push('Non-finite values detected');
  }

  return errors.length === 0 ? { valid: true, data } : { valid: false, errors };
}
