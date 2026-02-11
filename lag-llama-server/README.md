# Lag-Llama Inference Server

OpenAI-compatible API server for Lag-Llama time-series forecasting model.

## Quick Start (Development Mode)

### 1. Install Dependencies

```bash
cd lag-llama-server
pip install -r requirements.txt
```

### 2. Run Server

```bash
python server.py
```

The server will start on `http://localhost:8000`

### 3. Update Your App Configuration

Edit `/Users/arushigupta/Desktop/any-horizon-forecaster/.env.local`:

```env
LLM_BASE_URL=http://localhost:8000/v1/chat/completions
LLM_API_KEY=not-needed-for-local
LLM_MODEL_NAME=lag-llama
```

## Production Setup (with Actual Model)

### 1. Download Lag-Llama Model

```bash
# Install Hugging Face CLI
pip install huggingface_hub[cli]

# Download model checkpoint
huggingface-cli download time-series-foundation-models/Lag-Llama lag-llama.ckpt --local-dir .
```

### 2. Update server.py

Uncomment the `load_model()` call in the `__main__` section.

### 3. Run Server

```bash
python server.py
```

## API Endpoints

### Health Check
```bash
GET http://localhost:8000/health
```

### Chat Completions (Forecasting)
```bash
POST http://localhost:8000/v1/chat/completions
```

Body:
```json
{
  "model": "lag-llama",
  "messages": [
    {
      "role": "user",
      "content": "Forecast prompt with time-series data"
    }
  ]
}
```

### List Models
```bash
GET http://localhost:8000/v1/models
```

## Testing

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy", "model": "lag-llama"}
```

## Current Implementation

**Note**: The current version uses a simplified forecasting algorithm for quick testing.

To use the actual Lag-Llama model:
1. Download the model checkpoint (see Production Setup above)
2. Uncomment `load_model()` in `server.py`
3. Update the `parse_and_forecast()` function to use actual Lag-Llama inference

## Integration with Next.js App

The server provides an OpenAI-compatible API, so your Next.js app can use it directly without code changes:

1. Start this server: `python server.py`
2. Update `.env.local` to point to `http://localhost:8000`
3. Your app will automatically use Lag-Llama for forecasting

## Architecture

```
Next.js App (localhost:3000)
         ↓
    HTTP Request
         ↓
Lag-Llama Server (localhost:8000)
         ↓
   Lag-Llama Model
         ↓
    Forecast Response
```

## Deployment

For production deployment:

1. **Docker**: Create a Dockerfile for the server
2. **Cloud**: Deploy to AWS/GCP/Azure with GPU support
3. **Scaling**: Use multiple instances behind a load balancer

## Troubleshooting

### Port 8000 already in use
```bash
lsof -ti:8000 | xargs kill -9
```

### Model loading errors
Ensure you've downloaded the checkpoint:
```bash
ls -lh lag-llama.ckpt
```

### CUDA errors
Install PyTorch with CUDA support if you have a GPU:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```
