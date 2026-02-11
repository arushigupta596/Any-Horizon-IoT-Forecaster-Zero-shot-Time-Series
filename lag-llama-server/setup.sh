#!/bin/bash

echo "========================================="
echo "Lag-Llama Inference Server Setup"
echo "========================================="
echo ""

# Check Python version
python3 --version || { echo "Python 3 not found. Please install Python 3.8+"; exit 1; }

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "To start the server:"
echo "  1. Activate environment: source venv/bin/activate"
echo "  2. Run server: python server.py"
echo ""
echo "To download actual Lag-Llama model:"
echo "  huggingface-cli download time-series-foundation-models/Lag-Llama lag-llama.ckpt --local-dir ."
echo ""
echo "Update your app's .env.local:"
echo "  LLM_BASE_URL=http://localhost:8000/v1/chat/completions"
echo "  LLM_API_KEY=not-needed"
echo "  LLM_MODEL_NAME=lag-llama"
echo ""
