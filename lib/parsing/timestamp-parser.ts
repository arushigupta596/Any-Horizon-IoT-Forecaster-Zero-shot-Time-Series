// Timestamp parsing utilities
import { parseISO, parse } from 'date-fns';

export function parseTimestamp(raw: string | number): Date | null {
  // Handle numeric inputs
  if (typeof raw === 'number') {
    // Epoch seconds (10 digits)
    if (raw.toString().length === 10) {
      return new Date(raw * 1000);
    }
    // Epoch milliseconds (13 digits)
    if (raw.toString().length === 13) {
      return new Date(raw);
    }
  }

  // Handle string inputs
  if (typeof raw === 'string') {
    // Epoch seconds (10 digits)
    if (/^\d{10}$/.test(raw)) {
      return new Date(parseInt(raw) * 1000);
    }

    // Epoch milliseconds (13 digits)
    if (/^\d{13}$/.test(raw)) {
      return new Date(parseInt(raw));
    }

    // Try ISO 8601
    try {
      const date = parseISO(raw);
      if (!isNaN(date.getTime())) return date;
    } catch {
      // Continue to next format
    }

    // Try common formats
    const formats = [
      'yyyy-MM-dd HH:mm:ss',
      'MM/dd/yyyy HH:mm:ss',
      'dd/MM/yyyy HH:mm:ss',
      'yyyy-MM-dd',
    ];

    for (const fmt of formats) {
      try {
        const date = parse(raw, fmt, new Date());
        if (!isNaN(date.getTime())) return date;
      } catch {
        // Continue to next format
      }
    }
  }

  return null;
}
