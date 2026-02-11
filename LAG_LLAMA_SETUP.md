# 🚀 Lag-Llama Integration Guide

Your application is now configured to use **Lag-Llama**, the first open-source foundation model for time-series forecasting!

## ✅ What's Been Set Up

1. **Lag-Llama Inference Server** (`lag-llama-server/`)
   - Flask-based API server
   - OpenAI-compatible endpoints
   - Ready for development testing

2. **Environment Configuration** (`.env.local`)
   - Configured to use local Lag-Llama server
   - No API key needed for local development

3. **Next.js App Integration**
   - Already compatible (no code changes needed!)
   - Uses the server via HTTP API

## 🏃 Quick Start (2 Options)

### Option 1: Development Mode (Quick Test)

Uses a simplified forecasting algorithm for immediate testing.

```bash
# 1. Navigate to server directory
cd /Users/arushigupta/Desktop/any-horizon-forecaster/lag-llama-server

# 2. Set up Python environment
./setup.sh

# 3. Start server
source venv/bin/activate
python server.py
```

Server will run on `http://localhost:8000`

✅ Your Next.js app is already configured to use it!

### Option 2: Production Mode (Actual Lag-Llama Model)

Download and use the real Lag-Llama model from HuggingFace.

```bash
# 1. Set up environment (if not done)
cd /Users/arushigupta/Desktop/any-horizon-forecaster/lag-llama-server
./setup.sh
source venv/bin/activate

# 2. Download Lag-Llama model (~300MB)
huggingface-cli download time-series-foundation-models/Lag-Llama lag-llama.ckpt --local-dir .

# 3. Update server.py
# Uncomment line: load_model()

# 4. Start server
python server.py
```

## 🧪 Testing the Setup

### 1. Test Server Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy", "model": "lag-llama"}
```

### 2. Test Your App

1. Keep Lag-Llama server running (Terminal 1)
2. Keep Next.js dev server running (Terminal 2)
3. Visit `http://localhost:3000`
4. Upload a sample CSV (e.g., `temperature-10s.csv`)
5. Click "Generate Forecast"

## 📁 Project Structure

```
any-horizon-forecaster/
├── .env.local                    # ✅ Configured for Lag-Llama
├── app/                          # Next.js application
├── components/                   # React components
├── lib/                          # Core library
└── lag-llama-server/            # ✨ NEW: Lag-Llama inference server
    ├── server.py                # Flask API server
    ├── requirements.txt         # Python dependencies
    ├── setup.sh                 # Setup script
    └── README.md                # Server documentation
```

## 🔧 Configuration

Current configuration in `.env.local`:

```env
LLM_BASE_URL=http://localhost:8000/v1/chat/completions
LLM_API_KEY=not-needed-for-local
LLM_MODEL_NAME=lag-llama
```

### Switch Back to OpenAI

Edit `.env.local`:

```env
# LLM_BASE_URL=http://localhost:8000/v1/chat/completions  # Comment out
LLM_BASE_URL=https://api.openai.com/v1/chat/completions   # Uncomment
LLM_API_KEY=your-openai-key-here                          # Add your key
LLM_MODEL_NAME=gpt-4-turbo-preview
```

## 🎯 Why Lag-Llama?

✅ **Specialized for Time-Series**: Built specifically for forecasting
✅ **Open-Source**: Free to use, no API costs
✅ **Zero-Shot**: Works on any frequency, any horizon
✅ **Probabilistic**: Provides uncertainty estimates (P10/P50/P90)
✅ **Foundation Model**: Pre-trained on diverse datasets

## 📊 Lag-Llama Features

- **Any Frequency**: Works with second to daily data
- **Any Horizon**: Forecast any number of steps ahead
- **Uncertainty Quantification**: P10, P50, P90 predictions
- **Context-Aware**: Uses historical patterns
- **Fine-Tunable**: Can be fine-tuned on your data

## 🚀 Running Both Servers

You need 2 terminal windows:

**Terminal 1 - Lag-Llama Server:**
```bash
cd /Users/arushigupta/Desktop/any-horizon-forecaster/lag-llama-server
source venv/bin/activate
python server.py
```

**Terminal 2 - Next.js App:**
```bash
cd /Users/arushigupta/Desktop/any-horizon-forecaster
npm run dev
```

Visit: `http://localhost:3000`

## 🐛 Troubleshooting

### Port 8000 already in use
```bash
lsof -ti:8000 | xargs kill -9
```

### Python dependencies issues
```bash
cd lag-llama-server
rm -rf venv
./setup.sh
```

### Server not responding
Check if it's running:
```bash
curl http://localhost:8000/health
```

### Next.js can't connect to server
1. Ensure Lag-Llama server is running
2. Check `.env.local` has correct URL
3. Restart Next.js dev server

## 📚 Additional Resources

- **Lag-Llama Paper**: https://arxiv.org/abs/2310.08278
- **GitHub Repo**: https://github.com/time-series-foundation-models/lag-llama
- **HuggingFace Model**: https://huggingface.co/time-series-foundation-models/Lag-Llama
- **Demo Colab**: https://colab.research.google.com/drive/1DRAzLUPxsd-0r8b-o4nlyFXrjw_ZajJJ

## 🎓 Next Steps

1. ✅ **Test Development Mode**: Start server, test forecasting
2. 🔄 **Download Real Model**: Use actual Lag-Llama weights
3. 🎯 **Fine-Tune**: Train on your specific data
4. 🚀 **Deploy**: Deploy both servers to production

## 💡 Pro Tips

- **Context Length**: Lag-Llama works best with 32-1024 historical points
- **Fine-Tuning**: For best results, fine-tune on your domain
- **GPU**: Use GPU for faster inference (update PyTorch installation)
- **Batching**: Process multiple forecasts in parallel

---

**Your app is ready to use Lag-Llama!** 🎉

Start the Lag-Llama server and begin forecasting with a state-of-the-art time-series foundation model.
