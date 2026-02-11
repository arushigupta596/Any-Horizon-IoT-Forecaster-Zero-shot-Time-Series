// Time utility functions

export function convertTimeToSteps(
  time: { value: number; unit: 'min' | 'hour' | 'day' },
  freqSeconds: number
): number {
  const multipliers = { min: 60, hour: 3600, day: 86400 };
  const totalSeconds = time.value * multipliers[time.unit];
  return Math.ceil(totalSeconds / freqSeconds);
}

export function generateRunId(): string {
  return `fc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
