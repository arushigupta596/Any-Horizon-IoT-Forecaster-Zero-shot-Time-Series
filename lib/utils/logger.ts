// Logging utilities

export interface LogEntry {
  run_id: string;
  timestamp: string;
  endpoint: string;
  duration_ms: number;
  data_points: number;
  horizon: number;
  success: boolean;
  error?: string;
}

export function logRequest(entry: LogEntry) {
  if (process.env.ENABLE_REQUEST_LOGGING === 'true') {
    console.log(
      JSON.stringify({
        level: entry.success ? 'info' : 'error',
        ...entry,
      })
    );
  }
}
