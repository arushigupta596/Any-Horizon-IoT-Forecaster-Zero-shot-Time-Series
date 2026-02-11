// Missing data handling utilities
import type { MissingPolicy } from '../types';

export function handleMissing(
  data: Array<{ timestamp: Date; value: number }>,
  policy: MissingPolicy,
  maxGapSeconds: number = 3600
): Array<{ timestamp: Date; value: number }> {
  if (policy === 'DROP') {
    return data.filter((d) => !isNaN(d.value));
  }

  const result = [...data];

  for (let i = 0; i < result.length; i++) {
    if (!isNaN(result[i].value)) continue;

    if (policy === 'FFILL') {
      // Forward fill
      if (i > 0 && !isNaN(result[i - 1].value)) {
        result[i].value = result[i - 1].value;
      }
    } else if (policy === 'LINEAR') {
      // Linear interpolation
      const prevIdx = findPrevValid(result, i);
      const nextIdx = findNextValid(result, i);

      if (prevIdx !== -1 && nextIdx !== -1) {
        const timeDiff =
          result[nextIdx].timestamp.getTime() -
          result[prevIdx].timestamp.getTime();

        if (timeDiff / 1000 <= maxGapSeconds) {
          const ratio =
            (result[i].timestamp.getTime() -
              result[prevIdx].timestamp.getTime()) /
            timeDiff;
          result[i].value =
            result[prevIdx].value +
            ratio * (result[nextIdx].value - result[prevIdx].value);
        }
      }
    }
  }

  return result.filter((d) => !isNaN(d.value));
}

function findPrevValid(
  data: Array<{ value: number }>,
  idx: number
): number {
  for (let i = idx - 1; i >= 0; i--) {
    if (!isNaN(data[i].value)) return i;
  }
  return -1;
}

function findNextValid(
  data: Array<{ value: number }>,
  idx: number
): number {
  for (let i = idx + 1; i < data.length; i++) {
    if (!isNaN(data[i].value)) return i;
  }
  return -1;
}
