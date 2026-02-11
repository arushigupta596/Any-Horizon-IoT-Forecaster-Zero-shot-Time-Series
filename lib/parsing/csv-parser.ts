// CSV parsing utilities
import Papa from 'papaparse';
import { parseTimestamp } from './timestamp-parser';
import type { ParsedRow } from '../types';

export interface ParseResult {
  data: ParsedRow[];
  sensors: string[];
  errors: string[];
}

// Parse CSV from string (server-side)
export function parseCSVString(csvString: string): ParseResult {
  const errors: string[] = [];
  const data: ParsedRow[] = [];
  const sensors = new Set<string>();

  const result = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors && result.errors.length > 0) {
    result.errors.forEach((err: any) => {
      errors.push(`Row ${err.row}: ${err.message}`);
    });
  }

  result.data.forEach((row: any, index: number) => {
    try {
      // Parse timestamp
      const timestamp = parseTimestamp(row.timestamp);
      if (!timestamp) {
        errors.push(`Row ${index + 1}: Invalid timestamp "${row.timestamp}"`);
        return;
      }

      // Parse value
      const value = parseFloat(row.value);
      if (isNaN(value)) {
        errors.push(`Row ${index + 1}: Invalid value "${row.value}"`);
        return;
      }

      // Handle sensor_id if present
      const sensor_id = row.sensor_id;
      if (sensor_id) {
        sensors.add(sensor_id);
      }

      data.push({ timestamp, value, sensor_id });
    } catch (e: any) {
      errors.push(`Row ${index + 1}: ${e.message}`);
    }
  });

  // Sort by timestamp
  data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return {
    data,
    sensors: Array.from(sensors),
    errors,
  };
}

// Parse CSV from File object (client-side)
export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvString = e.target?.result as string;
        const result = parseCSVString(csvString);
        resolve(result);
      } catch (error: any) {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}
