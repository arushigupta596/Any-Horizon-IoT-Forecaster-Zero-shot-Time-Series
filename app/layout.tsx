import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Any-Horizon IoT Forecaster',
  description: 'Zero-shot time-series forecasting for IoT sensor data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
