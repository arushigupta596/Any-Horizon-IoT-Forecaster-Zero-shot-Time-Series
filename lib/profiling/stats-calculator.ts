// Statistics calculation utilities
import { min, max, mean, standardDeviation } from 'simple-statistics';
import type { DataStatistics } from '../types';

export function calculateStats(values: number[]): DataStatistics {
  const validValues = values.filter((v) => !isNaN(v));
  const totalCount = values.length;
  const missingCount = totalCount - validValues.length;

  if (validValues.length === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      std: 0,
      missing_pct: 100,
    };
  }

  return {
    min: min(validValues),
    max: max(validValues),
    mean: mean(validValues),
    std: validValues.length > 1 ? standardDeviation(validValues) : 0,
    missing_pct: (missingCount / totalCount) * 100,
  };
}
