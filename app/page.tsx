'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadZone } from '@/components/upload/UploadZone';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp } from 'lucide-react';
import type { DataProfile } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error);
        setIsProcessing(false);
        return;
      }

      // Store profile in sessionStorage and navigate
      sessionStorage.setItem('dataProfile', JSON.stringify(result.profile));
      sessionStorage.setItem('uploadedFile', await fileToBase64(file));
      router.push('/forecast');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze file');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Any-Horizon IoT Forecaster
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Zero-shot time-series forecasting for any sampling frequency and
            prediction horizon
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Time-Series Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <UploadZone onFileSelect={handleFileSelect} />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleAnalyze}
                disabled={!file || isProcessing}
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze & Forecast'
                )}
              </Button>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold mb-3">Supported Formats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    Single Sensor
                  </p>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    timestamp,value
                  </code>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    Multi Sensor
                  </p>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    timestamp,sensor_id,value
                  </code>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Timestamps: ISO8601, epoch seconds, or epoch milliseconds
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
