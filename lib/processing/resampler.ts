// Resampling utilities
import type { ResampleFreq, ResampleConfig } from '../types';

export function resample(
  data: Array<{ timestamp: Date; value: number }>,
  config: ResampleConfig
): Array<{ timestamp: Date; value: number }> {
  const freqSeconds = parseFreqToSeconds(config.freq);
  if (!freqSeconds) throw new Error('Invalid frequency');

  // Create time grid
  const start = data[0].timestamp;
  const end = data[data.length - 1].timestamp;
  const buckets = createTimeBuckets(start, end, freqSeconds);

  // Assign data to buckets
  const bucketMap = new Map<number, number[]>();

  data.forEach(({ timestamp, value }) => {
    const bucketTime =
      Math.floor(timestamp.getTime() / (freqSeconds * 1000)) *
      freqSeconds *
      1000;
    if (!bucketMap.has(bucketTime)) bucketMap.set(bucketTime, []);
    bucketMap.get(bucketTime)!.push(value);
  });

  // Aggregate
  return buckets.map((bucketTime) => {
    const values = bucketMap.get(bucketTime) || [];
    const value =
      values.length > 0
        ? config.aggregation === 'mean'
          ? values.reduce((a, b) => a + b, 0) / values.length
          : values[values.length - 1]
        : NaN;

    return {
      timestamp: new Date(bucketTime),
      value,
    };
  });
}

export function parseFreqToSeconds(freq: ResampleFreq): number | null {
  const map: Record<string, number> = {
    '1s': 1,
    '5s': 5,
    '10s': 10,
    '30s': 30,
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1h': 3600,
    '1d': 86400,
  };
  return map[freq] || null;
}

function createTimeBuckets(
  start: Date,
  end: Date,
  freqSeconds: number
): number[] {
  const buckets: number[] = [];
  let current =
    Math.floor(start.getTime() / (freqSeconds * 1000)) * freqSeconds * 1000;
  const endTime = end.getTime();

  while (current <= endTime) {
    buckets.push(current);
    current += freqSeconds * 1000;
  }

  return buckets;
}
