// Core type definitions for Any-Horizon IoT Forecaster

export interface ParsedRow {
  timestamp: Date;
  value: number;
  sensor_id?: string;
}

export interface FrequencyProfile {
  detected_freq_seconds: number;
  irregularity_pct: number;
  missing_intervals: number;
  suggested_resample_freq: string;
}

export interface DataStatistics {
  min: number;
  max: number;
  mean: number;
  std: number;
  missing_pct: number;
}

export interface DataProfile {
  row_count: number;
  sensors: string[];
  time_range: {
    start: string;
    end: string;
  };
  frequency: FrequencyProfile;
  statistics: DataStatistics;
  preview: Array<{ timestamp: string; value: number }>;
}

export type ResampleFreq = '1s' | '5s' | '10s' | '30s' | '1m' | '5m' | '15m' | '1h' | '1d' | 'AUTO';
export type MissingPolicy = 'LINEAR' | 'FFILL' | 'DROP';
export type OutlierPolicy = 'OFF' | 'WINSORIZE_P1_P99';
export type HorizonMode = 'STEPS' | 'TIME';

export interface ResampleConfig {
  freq: ResampleFreq;
  aggregation: 'mean' | 'last';
}

export interface ForecastRequest {
  data: Array<{ timestamp: string; value: number }>;
  sensor_id?: string;
  resample_freq: ResampleFreq;
  missing_policy: MissingPolicy;
  outlier_policy: OutlierPolicy;
  horizon_mode: HorizonMode;
  horizon_steps?: number;
  horizon_time?: { value: number; unit: 'min' | 'hour' | 'day' };
  uncertainty: boolean;
}

export interface LLMResponse {
  p50: number[];
  p10?: number[];
  p90?: number[];
  notes: string;
  quality_flags: QualityFlag[];
}

export type QualityFlag =
  | 'LOW_DATA'
  | 'HIGH_MISSING'
  | 'IRREGULAR_SAMPLING'
  | 'OUTLIERS_PRESENT'
  | 'LONG_HORIZON_UNCERTAIN'
  | 'REGIME_SHIFT_DETECTED';

export interface ForecastResult {
  meta: {
    detected_freq_seconds: number;
    used_freq_seconds: number;
    horizon_steps: number;
    start_timestamp: string;
    quality_flags: QualityFlag[];
  };
  history: {
    timestamps: string[];
    values: number[];
  };
  forecast: {
    timestamps: string[];
    p50: number[];
    p10?: number[];
    p90?: number[];
  };
  run_config: {
    run_id: string;
    timestamp: string;
    config: ForecastRequest;
    model: string;
  };
}

export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ProcessingError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ProcessingError';
  }
}

export class LLMError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'LLMError';
  }
}
