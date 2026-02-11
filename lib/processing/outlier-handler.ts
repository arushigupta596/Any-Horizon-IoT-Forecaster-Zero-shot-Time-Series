// Outlier handling utilities
import { quantile } from 'simple-statistics';
import type { OutlierPolicy } from '../types';

export function handleOutliers(
  data: Array<{ timestamp: Date; value: number }>,
  policy: OutlierPolicy
): Array<{ timestamp: Date; value: number }> {
  if (policy === 'OFF') return data;

  const values = data.map((d) => d.value).filter((v) => !isNaN(v));
  if (values.length === 0) return data;

  const p1 = quantile(values, 0.01);
  const p99 = quantile(values, 0.99);

  return data.map((d) => ({
    ...d,
    value: isNaN(d.value) ? d.value : Math.max(p1, Math.min(p99, d.value)),
  }));
}
