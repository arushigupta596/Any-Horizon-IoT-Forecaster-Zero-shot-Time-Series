# Any-Horizon IoT Forecaster

Zero-shot time-series forecasting for IoT sensor data with support for any sampling frequency and prediction horizon.

## Features

- **Universal Frequency Support**: Handles any sampling rate (sub-second to daily)
- **Flexible Horizons**: Forecast N steps ahead OR specific time durations
- **Multi-Sensor Support**: Process single or multiple sensor streams
- **Uncertainty Quantification**: Optional prediction intervals (P10/P50/P90)
- **Data Processing**: Automated resampling, missing data handling, and outlier detection
- **Reproducibility**: Downloadable forecast outputs and run configurations

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your LLM credentials:

```env
LLM_BASE_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=your_api_key_here
LLM_MODEL_NAME=gpt-4-turbo-preview
LLM_TEMPERATURE=0
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Deploy from GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure environment variables in the dashboard
6. Click "Deploy"

### Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

- `LLM_BASE_URL` - Your LLM API endpoint
- `LLM_API_KEY` - Your LLM API key
- `LLM_MODEL_NAME` - Model identifier (e.g., `gpt-4-turbo-preview`)
- `LLM_TEMPERATURE` - Temperature setting (default: `0`)
- `MAX_HORIZON_STEPS` - Maximum forecast steps (default: `2000`)
- `MAX_ROWS_PER_SENSOR` - Maximum data rows (default: `100000`)
- `ENABLE_REQUEST_LOGGING` - Enable logging (default: `true`)

## CSV Format

### Single Sensor

```csv
timestamp,value
2024-01-01T00:00:00Z,23.5
2024-01-01T00:00:10Z,23.7
```

### Multi Sensor

```csv
timestamp,sensor_id,value
2024-01-01T00:00:00Z,temp_01,23.5
2024-01-01T00:00:00Z,temp_02,24.1
```

Supported timestamp formats:
- ISO 8601: `2024-01-01T00:00:00Z`
- Epoch seconds: `1704067200`
- Epoch milliseconds: `1704067200000`

## API Endpoints

### POST /api/profile

Analyze uploaded CSV and return data profile.

**Request:**
```typescript
FormData {
  file: File,
  sensor_id?: string
}
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "row_count": 1000,
    "frequency": {
      "detected_freq_seconds": 10,
      "suggested_resample_freq": "10s"
    },
    "statistics": {
      "min": 20.1,
      "max": 30.5,
      "mean": 25.3
    }
  }
}
```

### POST /api/forecast

Generate forecast using configured parameters.

**Request:**
```json
{
  "data": [{"timestamp": "...", "value": 23.5}],
  "resample_freq": "1m",
  "missing_policy": "LINEAR",
  "outlier_policy": "OFF",
  "horizon_mode": "STEPS",
  "horizon_steps": 100,
  "uncertainty": true
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "forecast": {
      "timestamps": ["..."],
      "p50": [23.6, 23.8, ...],
      "p10": [22.1, 22.3, ...],
      "p90": [25.1, 25.3, ...]
    },
    "run_config": {
      "run_id": "fc_...",
      "model": "gpt-4-turbo-preview"
    }
  }
}
```

## Configuration Options

### Resample Frequency
- `AUTO` - Automatically detect optimal frequency
- `1s`, `5s`, `10s`, `30s` - Sub-minute intervals
- `1m`, `5m`, `15m` - Minute intervals
- `1h`, `1d` - Hour/day intervals

### Missing Data Policy
- `LINEAR` - Linear interpolation
- `FFILL` - Forward fill
- `DROP` - Drop gaps

### Outlier Policy
- `OFF` - No outlier handling
- `WINSORIZE_P1_P99` - Cap at 1st and 99th percentiles

### Horizon Mode
- `STEPS` - Forecast N steps ahead
- `TIME` - Forecast X minutes/hours/days ahead

## Sample Datasets

Sample datasets are available in `/public/samples/`:

- `temperature-10s.csv` - Temperature sensor (10s frequency)
- `multi-sensor-energy.csv` - Energy meters (1min frequency, multi-sensor)

## Project Structure

```
any-horizon-forecaster/
├── app/
│   ├── api/
│   │   ├── profile/route.ts      # Data profiling API
│   │   └── forecast/route.ts     # Forecast generation API
│   ├── forecast/page.tsx         # Forecast configuration page
│   └── page.tsx                  # Upload page
├── components/
│   ├── upload/UploadZone.tsx     # File upload component
│   ├── forecast/
│   │   ├── ForecastChart.tsx     # Chart visualization
│   │   ├── DownloadButtons.tsx   # Download controls
│   │   └── QualityFlags.tsx      # Quality warnings
│   └── ui/                       # UI components
├── lib/
│   ├── parsing/                  # CSV & timestamp parsing
│   ├── profiling/                # Frequency detection & stats
│   ├── processing/               # Resampling, missing data, outliers
│   ├── llm/                      # LLM integration
│   └── utils/                    # Utility functions
└── public/samples/               # Sample datasets
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## LLM Requirements

The forecasting model expects responses in this JSON format:

```json
{
  "p50": [/* array of forecasted values */],
  "p10": [/* lower bound (optional) */],
  "p90": [/* upper bound (optional) */],
  "notes": "Brief reasoning",
  "quality_flags": ["LOW_DATA", "IRREGULAR_SAMPLING"]
}
```

Supported quality flags:
- `LOW_DATA` - Limited historical data
- `HIGH_MISSING` - High percentage of missing values
- `IRREGULAR_SAMPLING` - Irregular time intervals
- `OUTLIERS_PRESENT` - Outliers detected
- `LONG_HORIZON_UNCERTAIN` - Long forecast horizon
- `REGIME_SHIFT_DETECTED` - Potential regime shift

## Performance

- **Typical dataset**: Up to 100k rows per sensor
- **API response**: Sub-5s for typical runs (excluding LLM latency)
- **Max horizon**: 2000 steps (configurable)
- **File size limit**: 10MB

## Troubleshooting

### "LLM configuration missing" error
- Verify `LLM_BASE_URL` and `LLM_API_KEY` are set in environment variables
- Check that variables are properly loaded (restart dev server)

### "Horizon exceeds maximum" error
- Reduce forecast horizon or increase `MAX_HORIZON_STEPS` environment variable

### "Insufficient data points" error
- Ensure CSV has at least 10 valid data points
- Check for parsing errors in timestamps or values

### Chart not rendering
- Verify data contains valid timestamps and numeric values
- Check browser console for JavaScript errors

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review sample datasets for format examples

## Roadmap

### Phase 2 Features
- [ ] Streaming ingestion (MQTT/Kafka)
- [ ] Authentication & multi-tenant support
- [ ] Alert rules engine
- [ ] Batch processing
- [ ] Model fine-tuning interface
- [ ] Forecast comparison tools
- [ ] PostgreSQL/Supabase integration

---

Built with Next.js, TypeScript, and Tailwind CSS. Deployed on Vercel.

---

## 🤖 Using Lag-Llama (Time-Series Foundation Model)

This application now supports **Lag-Llama**, the first open-source foundation model specifically designed for time-series forecasting!

### Quick Start with Lag-Llama

**Option 1: Development Mode (Quick Test)**
```bash
# Start Lag-Llama server
./start-lag-llama.sh

# In another terminal, start Next.js
npm run dev
```

**Option 2: Manual Setup**
```bash
# Terminal 1: Lag-Llama Server
cd lag-llama-server
./setup.sh
source venv/bin/activate
python server.py

# Terminal 2: Next.js App
npm run dev
```

The app is pre-configured to use Lag-Llama at `http://localhost:8000`

### Why Lag-Llama?

- ✅ **Specialized for Time-Series**: Purpose-built for forecasting
- ✅ **Open-Source**: No API costs
- ✅ **Zero-Shot**: Works on any data without training
- ✅ **Probabilistic**: Provides uncertainty estimates
- ✅ **State-of-the-Art**: Published research model

📖 **Full Guide**: See [LAG_LLAMA_SETUP.md](LAG_LLAMA_SETUP.md) for detailed instructions

### Switch Between Models

Edit `.env.local` to choose your model:

**Lag-Llama (Local):**
```env
LLM_BASE_URL=http://localhost:8000/v1/chat/completions
LLM_API_KEY=not-needed
LLM_MODEL_NAME=lag-llama
```

**OpenAI:**
```env
LLM_BASE_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=your-api-key-here
LLM_MODEL_NAME=gpt-4-turbo-preview
```

