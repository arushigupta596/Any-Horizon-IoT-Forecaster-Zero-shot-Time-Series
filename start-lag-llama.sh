#!/bin/bash

echo "========================================="
echo "   Starting Lag-Llama Server"
echo "========================================="
echo ""

cd "$(dirname "$0")/lag-llama-server"

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Running setup..."
    ./setup.sh
fi

# Activate virtual environment
source venv/bin/activate

echo ""
echo "Starting Lag-Llama inference server on http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start server
python server.py
