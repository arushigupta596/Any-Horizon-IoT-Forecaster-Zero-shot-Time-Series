'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ForecastChart } from '@/components/forecast/ForecastChart';
import { DownloadButtons } from '@/components/forecast/DownloadButtons';
import { QualityFlags } from '@/components/forecast/QualityFlags';
import { Loader2, ArrowLeft, TrendingUp } from 'lucide-react';
import type { DataProfile, ForecastResult, ResampleFreq, MissingPolicy, OutlierPolicy } from '@/lib/types';

export default function ForecastPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DataProfile | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);

  // Configuration
  const [resampleFreq, setResampleFreq] = useState<ResampleFreq>('AUTO');
  const [missingPolicy, setMissingPolicy] = useState<MissingPolicy>('LINEAR');
  const [outlierPolicy, setOutlierPolicy] = useState<OutlierPolicy>('OFF');
  const [horizonMode, setHorizonMode] = useState<'STEPS' | 'TIME'>('STEPS');
  const [horizonSteps, setHorizonSteps] = useState(100);
  const [horizonTimeValue, setHorizonTimeValue] = useState(1);
  const [horizonTimeUnit, setHorizonTimeUnit] = useState<'min' | 'hour' | 'day'>('hour');
  const [uncertainty, setUncertainty] = useState(true);

  // Results
  const [isForecasting, setIsForecasting] = useState(false);
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('dataProfile');
    const storedFile = sessionStorage.getItem('uploadedFile');

    if (!storedProfile || !storedFile) {
      router.push('/');
      return;
    }

    setProfile(JSON.parse(storedProfile));
    setFileData(storedFile);

    // Set default resample freq
    const parsedProfile = JSON.parse(storedProfile) as DataProfile;
    setResampleFreq(parsedProfile.frequency.suggested_resample_freq as ResampleFreq);
  }, [router]);

  const handleForecast = async () => {
    if (!profile || !fileData) return;

    setIsForecasting(true);
    setError(null);
    setResult(null);

    try {
      // Parse file data from base64
      const base64Data = fileData.split(',')[1];
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([bytes]);
      const text = await blob.text();

      // Parse CSV to get data points
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',');
      const dataPoints = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          timestamp: values[0],
          value: parseFloat(values[headers.indexOf('value')]),
        };
      });

      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: dataPoints,
          resample_freq: resampleFreq,
          missing_policy: missingPolicy,
          outlier_policy: outlierPolicy,
          horizon_mode: horizonMode,
          horizon_steps: horizonMode === 'STEPS' ? horizonSteps : undefined,
          horizon_time: horizonMode === 'TIME' ? {
            value: horizonTimeValue,
            unit: horizonTimeUnit,
          } : undefined,
          uncertainty,
        }),
      });

      const apiResult = await response.json();

      if (!apiResult.success) {
        setError(apiResult.error);
        setIsForecasting(false);
        return;
      }

      setResult(apiResult.result);
      setIsForecasting(false);
    } catch (err: any) {
      setError(err.message || 'Failed to generate forecast');
      setIsForecasting(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </Button>

          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Configure Forecast
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Data Info */}
              <div className="pb-4 border-b">
                <h3 className="text-sm font-semibold mb-2">Data Summary</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Points:</span> {profile.row_count}</p>
                  <p><span className="font-medium">Frequency:</span> {profile.frequency.detected_freq_seconds}s</p>
                  <p><span className="font-medium">Range:</span> {new Date(profile.time_range.start).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Resample Frequency */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resample Frequency
                </label>
                <select
                  value={resampleFreq}
                  onChange={(e) => setResampleFreq(e.target.value as ResampleFreq)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="AUTO">Auto ({profile.frequency.suggested_resample_freq})</option>
                  <option value="1s">1 second</option>
                  <option value="5s">5 seconds</option>
                  <option value="10s">10 seconds</option>
                  <option value="30s">30 seconds</option>
                  <option value="1m">1 minute</option>
                  <option value="5m">5 minutes</option>
                  <option value="15m">15 minutes</option>
                  <option value="1h">1 hour</option>
                  <option value="1d">1 day</option>
                </select>
              </div>

              {/* Horizon */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Forecast Horizon
                </label>
                <div className="space-y-2">
                  <select
                    value={horizonMode}
                    onChange={(e) => setHorizonMode(e.target.value as 'STEPS' | 'TIME')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="STEPS">By Steps</option>
                    <option value="TIME">By Time</option>
                  </select>

                  {horizonMode === 'STEPS' ? (
                    <input
                      type="number"
                      value={horizonSteps}
                      onChange={(e) => setHorizonSteps(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      min="1"
                      max="2000"
                    />
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={horizonTimeValue}
                        onChange={(e) => setHorizonTimeValue(parseInt(e.target.value))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        min="1"
                      />
                      <select
                        value={horizonTimeUnit}
                        onChange={(e) => setHorizonTimeUnit(e.target.value as any)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="min">Minutes</option>
                        <option value="hour">Hours</option>
                        <option value="day">Days</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Missing Data Policy */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Missing Data
                </label>
                <select
                  value={missingPolicy}
                  onChange={(e) => setMissingPolicy(e.target.value as MissingPolicy)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="LINEAR">Linear Interpolation</option>
                  <option value="FFILL">Forward Fill</option>
                  <option value="DROP">Drop Gaps</option>
                </select>
              </div>

              {/* Outlier Policy */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Outlier Handling
                </label>
                <select
                  value={outlierPolicy}
                  onChange={(e) => setOutlierPolicy(e.target.value as OutlierPolicy)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="OFF">Off</option>
                  <option value="WINSORIZE_P1_P99">Winsorize (P1-P99)</option>
                </select>
              </div>

              {/* Uncertainty */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="uncertainty"
                  checked={uncertainty}
                  onChange={(e) => setUncertainty(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="uncertainty" className="text-sm font-medium">
                  Include Uncertainty (P10/P90)
                </label>
              </div>

              <Button
                onClick={handleForecast}
                disabled={isForecasting}
                className="w-full"
                size="lg"
              >
                {isForecasting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Forecast'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {result && (
              <>
                <QualityFlags flags={result.meta.quality_flags} />

                <Card>
                  <CardHeader>
                    <CardTitle>Forecast Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ForecastChart
                      history={result.history}
                      forecast={result.forecast}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Download Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DownloadButtons
                      forecast={result.forecast}
                      runConfig={result.run_config}
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {!result && !error && !isForecasting && (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Configure settings and click "Generate Forecast" to begin</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
