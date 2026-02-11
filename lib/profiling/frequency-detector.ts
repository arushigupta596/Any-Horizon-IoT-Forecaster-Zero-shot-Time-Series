// Frequency detection utilities
import { median, standardDeviation } from 'simple-statistics';
import type { FrequencyProfile } from '../types';

export function detectFrequency(timestamps: Date[]): FrequencyProfile {
  if (timestamps.length < 2) {
    throw new Error('Need at least 2 timestamps');
  }

  // Compute time differences in seconds
  const diffs = timestamps
    .slice(1)
    .map((t, i) => (t.getTime() - timestamps[i].getTime()) / 1000);

  const medianDiff = median(diffs);
  const stdDiff = standardDeviation(diffs);

  // Irregularity: % of diffs beyond 2 std devs
  const irregularCount = diffs.filter(
    (d) => Math.abs(d - medianDiff) > 2 * stdDiff
  ).length;
  const irregularity_pct = (irregularCount / diffs.length) * 100;

  // Missing intervals: expected vs actual count
  const totalTime =
    timestamps[timestamps.length - 1].getTime() - timestamps[0].getTime();
  const expectedIntervals = Math.floor(totalTime / (medianDiff * 1000));
  const missing_intervals = Math.max(0, expectedIntervals - timestamps.length);

  return {
    detected_freq_seconds: medianDiff,
    irregularity_pct,
    missing_intervals,
    suggested_resample_freq: suggestResampleFreq(medianDiff),
  };
}

function suggestResampleFreq(seconds: number): string {
  if (seconds < 2) return '1s';
  if (seconds < 7) return '5s';
  if (seconds < 20) return '10s';
  if (seconds < 45) return '30s';
  if (seconds < 180) return '1m';
  if (seconds < 450) return '5m';
  if (seconds < 1800) return '15m';
  if (seconds < 7200) return '1h';
  return '1d';
}
