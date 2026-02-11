'use client';

import { AlertTriangle, Info } from 'lucide-react';
import type { QualityFlag } from '@/lib/types';

interface QualityFlagsProps {
  flags: QualityFlag[];
}

const FLAG_DESCRIPTIONS: Record<QualityFlag, { label: string; severity: 'warning' | 'info' }> = {
  LOW_DATA: { label: 'Limited historical data', severity: 'warning' },
  HIGH_MISSING: { label: 'High percentage of missing values', severity: 'warning' },
  IRREGULAR_SAMPLING: { label: 'Irregular time intervals detected', severity: 'info' },
  OUTLIERS_PRESENT: { label: 'Outliers detected in data', severity: 'info' },
  LONG_HORIZON_UNCERTAIN: { label: 'Long forecast horizon - uncertainty increases', severity: 'info' },
  REGIME_SHIFT_DETECTED: { label: 'Potential regime shift in data', severity: 'warning' },
};

export function QualityFlags({ flags }: QualityFlagsProps) {
  if (flags.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Quality Considerations
      </h3>
      <ul className="space-y-1">
        {flags.map((flag) => {
          const desc = FLAG_DESCRIPTIONS[flag];
          return (
            <li
              key={flag}
              className="text-sm text-yellow-800 flex items-start gap-2"
            >
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{desc.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
