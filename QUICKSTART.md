# Quick Start Guide

Get the Any-Horizon IoT Forecaster running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- An LLM API key (OpenAI, or compatible endpoint)
- Terminal/command line access

## Installation

### 1. Clone or Download

If you haven't already, navigate to the project directory:

```bash
cd any-horizon-forecaster
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (~2-3 minutes).

### 3. Configure Environment

Create your environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your preferred text editor:

```env
# Required: Your LLM credentials
LLM_BASE_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=sk-your-api-key-here
LLM_MODEL_NAME=gpt-4-turbo-preview

# Optional: Keep defaults
LLM_TEMPERATURE=0
MAX_HORIZON_STEPS=2000
MAX_ROWS_PER_SENSOR=100000
ENABLE_REQUEST_LOGGING=true
```

**Using OpenAI:**
- Get API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Use URL: `https://api.openai.com/v1/chat/completions`
- Model: `gpt-4-turbo-preview` or `gpt-4`

**Using Other Providers:**
- Update `LLM_BASE_URL` to your endpoint
- Update `LLM_MODEL_NAME` to your model identifier
- Ensure endpoint is OpenAI-compatible

### 4. Start Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.5s
```

### 5. Open Application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## First Forecast

### Step 1: Upload Sample Data

1. Click the upload zone or drag a CSV file
2. Try the sample: `/public/samples/temperature-10s.csv`

### Step 2: Configure Settings

The app will auto-detect:
- Sampling frequency (10 seconds)
- Data statistics
- Suggested resample frequency

Adjust if needed:
- **Resample Frequency**: AUTO (recommended)
- **Forecast Horizon**: 50 steps
- **Missing Data**: Linear Interpolation
- **Outlier Handling**: Off
- **Uncertainty**: ✓ Enabled

### Step 3: Generate Forecast

Click "Generate Forecast" and wait ~5-10 seconds.

### Step 4: Review Results

- View interactive chart with history + forecast
- Check quality flags (if any)
- Download CSV and configuration JSON

## Troubleshooting

### "LLM configuration missing"

**Problem**: Environment variables not loaded

**Solution**:
```bash
# Stop the server (Ctrl+C)
# Verify .env.local exists and has correct values
cat .env.local

# Restart server
npm run dev
```

### "Module not found" errors

**Problem**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 3000 already in use

**Problem**: Another app using port 3000

**Solution**:
```bash
# Use different port
PORT=3001 npm run dev
```

### "Invalid timestamp" parsing errors

**Problem**: CSV format not recognized

**Solution**: Ensure CSV has these columns:
- `timestamp` (required) - ISO 8601, epoch seconds, or epoch ms
- `value` (required) - numeric
- `sensor_id` (optional) - for multi-sensor data

Example:
```csv
timestamp,value
2024-01-01T00:00:00Z,23.5
2024-01-01T00:00:10Z,23.7
```

## Next Steps

### Deploy to Vercel

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions.

Quick deploy:
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Try Different Datasets

Create your own CSV:
```csv
timestamp,value
2024-01-01T00:00:00Z,100
2024-01-01T00:01:00Z,105
2024-01-01T00:02:00Z,103
...
```

Upload and forecast!

### Customize Configuration

Edit files in:
- `/lib/` - Core functionality
- `/components/` - UI components
- `/app/` - Pages and API routes

### Run Tests

```bash
npm test
```

## API Testing (Optional)

Test the API directly:

### Profile Endpoint

```bash
curl -X POST http://localhost:3000/api/profile \
  -F "file=@public/samples/temperature-10s.csv"
```

### Forecast Endpoint

```bash
curl -X POST http://localhost:3000/api/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"timestamp": "2024-01-01T00:00:00Z", "value": 23.5},
      {"timestamp": "2024-01-01T00:00:10Z", "value": 23.7}
    ],
    "resample_freq": "10s",
    "missing_policy": "LINEAR",
    "outlier_policy": "OFF",
    "horizon_mode": "STEPS",
    "horizon_steps": 10,
    "uncertainty": true
  }'
```

## Production Build (Local)

Test production build locally:

```bash
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## Getting Help

- Check [README.md](README.md) for full documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- Check console logs for error messages
- Verify CSV format matches examples

## Common Use Cases

### IoT Temperature Monitoring
- Upload sensor readings (any frequency)
- Forecast next hour/day
- Download predictions for alerting

### Energy Consumption
- Upload power meter data
- Predict usage patterns
- Optimize scheduling

### Industrial Equipment
- Upload vibration/pressure data
- Detect anomalies via quality flags
- Forecast maintenance windows

---

**You're all set!** Start uploading data and generating forecasts. 🚀
