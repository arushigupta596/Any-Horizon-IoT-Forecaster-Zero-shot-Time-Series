// Profile API route
import { NextRequest, NextResponse } from 'next/server';
import { parseCSVString } from '@/lib/parsing/csv-parser';
import { detectFrequency } from '@/lib/profiling/frequency-detector';
import { calculateStats } from '@/lib/profiling/stats-calculator';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const sensor_id = formData.get('sensor_id') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file as text
    const text = await file.text();

    // Parse CSV
    const { data, sensors, errors } = parseCSVString(text);

    if (errors.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many parsing errors',
          details: errors.slice(0, 10),
        },
        { status: 400 }
      );
    }

    // Filter by sensor if needed
    let filteredData = data;
    if (sensor_id && sensors.length > 1) {
      filteredData = data.filter((d) => d.sensor_id === sensor_id);
    }

    if (filteredData.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient data points (need at least 10)',
        },
        { status: 400 }
      );
    }

    // Detect frequency
    const timestamps = filteredData.map((d) => d.timestamp);
    const frequency = detectFrequency(timestamps);

    // Calculate statistics
    const statistics = calculateStats(filteredData.map((d) => d.value));

    return NextResponse.json({
      success: true,
      profile: {
        row_count: filteredData.length,
        sensors,
        time_range: {
          start: timestamps[0].toISOString(),
          end: timestamps[timestamps.length - 1].toISOString(),
        },
        frequency,
        statistics,
        preview: filteredData.slice(0, 50).map((d) => ({
          timestamp: d.timestamp.toISOString(),
          value: d.value,
        })),
      },
    });
  } catch (error: any) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
