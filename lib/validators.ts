// Zod schemas for validation
import { z } from 'zod';

export const ForecastRequestSchema = z.object({
  data: z.array(
    z.object({
      timestamp: z.string(),
      value: z.number(),
    })
  ),
  sensor_id: z.string().optional(),
  resample_freq: z.enum(['AUTO', '1s', '5s', '10s', '30s', '1m', '5m', '15m', '1h', '1d']),
  missing_policy: z.enum(['LINEAR', 'FFILL', 'DROP']),
  outlier_policy: z.enum(['OFF', 'WINSORIZE_P1_P99']),
  horizon_mode: z.enum(['STEPS', 'TIME']),
  horizon_steps: z.number().int().positive().optional(),
  horizon_time: z
    .object({
      value: z.number().positive(),
      unit: z.enum(['min', 'hour', 'day']),
    })
    .optional(),
  uncertainty: z.boolean(),
});

export const LLMResponseSchema = z.object({
  p50: z.array(z.number()),
  p10: z.array(z.number()).optional(),
  p90: z.array(z.number()).optional(),
  notes: z.string(),
  quality_flags: z.array(
    z.enum([
      'LOW_DATA',
      'HIGH_MISSING',
      'IRREGULAR_SAMPLING',
      'OUTLIERS_PRESENT',
      'LONG_HORIZON_UNCERTAIN',
      'REGIME_SHIFT_DETECTED',
    ])
  ),
});

export const FileUploadSchema = z.object({
  name: z.string().max(255),
  size: z.number().max(10 * 1024 * 1024), // 10MB
  type: z.string(),
});

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}
