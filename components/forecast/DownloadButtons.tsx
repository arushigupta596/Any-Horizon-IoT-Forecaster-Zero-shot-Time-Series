'use client';

import { Download } from 'lucide-react';
import { Button } from '../ui/button';

interface DownloadButtonsProps {
  forecast: {
    timestamps: string[];
    p50: number[];
    p10?: number[];
    p90?: number[];
  };
  runConfig: any;
}

export function DownloadButtons({ forecast, runConfig }: DownloadButtonsProps) {
  const downloadCSV = () => {
    const headers =
      forecast.p10 && forecast.p90
        ? 'timestamp,p50,p10,p90'
        : 'timestamp,p50';

    const rows = forecast.timestamps.map((ts, i) => {
      const base = `${ts},${forecast.p50[i]}`;
      return forecast.p10 && forecast.p90
        ? `${base},${forecast.p10[i]},${forecast.p90[i]}`
        : base;
    });

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast_${runConfig.run_id}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadConfig = () => {
    const json = JSON.stringify(runConfig, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `config_${runConfig.run_id}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-3">
      <Button onClick={downloadCSV} className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Download Forecast CSV
      </Button>

      <Button
        onClick={downloadConfig}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download Run Config
      </Button>
    </div>
  );
}
