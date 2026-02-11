'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { format } from 'date-fns';

interface ForecastChartProps {
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
}

export function ForecastChart({ history, forecast }: ForecastChartProps) {
  // Combine history and forecast
  const historyData = history.timestamps.map((ts, i) => ({
    timestamp: new Date(ts).getTime(),
    actual: history.values[i],
    type: 'history',
  }));

  const forecastData = forecast.timestamps.map((ts, i) => ({
    timestamp: new Date(ts).getTime(),
    p50: forecast.p50[i],
    p10: forecast.p10?.[i],
    p90: forecast.p90?.[i],
    type: 'forecast',
  }));

  const allData = [...historyData, ...forecastData].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  const formatTimestamp = (ts: number) => {
    return format(new Date(ts), 'MMM dd HH:mm');
  };

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={allData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimestamp}
            type="number"
            domain={['dataMin', 'dataMax']}
            scale="time"
          />
          <YAxis />
          <Tooltip
            labelFormatter={formatTimestamp}
            formatter={(value: number) => value?.toFixed(2)}
          />
          <Legend />

          {/* Uncertainty band */}
          {forecast.p10 && forecast.p90 && (
            <Area
              dataKey="p90"
              stroke="none"
              fill="#3b82f6"
              fillOpacity={0.1}
            />
          )}

          {/* History line */}
          <Line
            dataKey="actual"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="History"
            connectNulls
          />

          {/* Forecast line */}
          <Line
            dataKey="p50"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Forecast (P50)"
            connectNulls
          />

          {/* Lower bound */}
          {forecast.p10 && (
            <Line
              dataKey="p10"
              stroke="#3b82f6"
              strokeWidth={1}
              strokeOpacity={0.5}
              dot={false}
              name="P10"
              connectNulls
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
