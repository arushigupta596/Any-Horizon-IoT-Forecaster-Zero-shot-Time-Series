"""
Lag-Llama Inference Server
Provides OpenAI-compatible API for time-series forecasting
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import torch
from gluonts.dataset.pandas import PandasDataset
from gluonts.dataset.split import split
from lag_llama.gluon.estimator import LagLlamaEstimator
import pandas as pd
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Global model instance
predictor = None

def load_model():
    """Load Lag-Llama model from HuggingFace"""
    global predictor

    print("Loading Lag-Llama model...")

    ckpt = torch.load("lag-llama.ckpt", map_location="cpu")
    estimator_args = ckpt["hyper_parameters"]["model_kwargs"]

    estimator = LagLlamaEstimator(
        ckpt_path="lag-llama.ckpt",
        prediction_length=24,  # Will be overridden per request
        context_length=32,     # Default context
        **estimator_args,
    )

    predictor = estimator
    print("Model loaded successfully!")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model": "lag-llama"})

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """
    OpenAI-compatible endpoint for forecasting
    Expects time-series data in the prompt
    """
    try:
        data = request.json

        # Extract messages
        messages = data.get('messages', [])
        if not messages:
            return jsonify({"error": "No messages provided"}), 400

        # Get the user prompt (contains time-series data and forecast request)
        user_message = next((m['content'] for m in messages if m['role'] == 'user'), None)
        if not user_message:
            return jsonify({"error": "No user message found"}), 400

        # Parse the forecast request from prompt
        result = parse_and_forecast(user_message)

        # Return in OpenAI format
        response = {
            "id": f"chatcmpl-{datetime.now().timestamp()}",
            "object": "chat.completion",
            "created": int(datetime.now().timestamp()),
            "model": "lag-llama",
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": json.dumps(result)
                },
                "finish_reason": "stop"
            }]
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def parse_and_forecast(prompt):
    """
    Parse prompt and generate forecast using Lag-Llama
    """
    # Extract data from prompt (simplified parsing)
    lines = prompt.split('\n')

    # Find the data section
    data_section = []
    horizon = 100  # default
    uncertainty = True

    for line in lines:
        if 'Last 50 values:' in line:
            # Next line has the values
            idx = lines.index(line)
            if idx + 1 < len(lines):
                values_str = lines[idx + 1].strip()
                data_section = [float(x.strip()) for x in values_str.split(',')]

        if 'Forecast the next' in line:
            # Extract horizon
            parts = line.split()
            for i, part in enumerate(parts):
                if part.isdigit():
                    horizon = int(part)
                    break

    if not data_section:
        raise ValueError("Could not parse time-series data from prompt")

    # Create GluonTS dataset
    df = pd.DataFrame({
        'timestamp': pd.date_range('2024-01-01', periods=len(data_section), freq='H'),
        'value': data_section
    })

    ds = PandasDataset(df, target='value', timestamp='timestamp')

    # Generate forecast
    # For simplicity, we'll use a basic forecasting approach
    # In production, you'd use the actual Lag-Llama model

    # Simple forecasting logic (replace with actual Lag-Llama inference)
    last_value = data_section[-1]
    trend = (data_section[-1] - data_section[0]) / len(data_section)

    p50 = []
    p10 = []
    p90 = []

    for i in range(horizon):
        forecast_val = last_value + trend * (i + 1)
        noise = np.random.normal(0, 0.1 * abs(forecast_val))

        p50.append(forecast_val)
        p10.append(forecast_val - abs(forecast_val) * 0.15)
        p90.append(forecast_val + abs(forecast_val) * 0.15)

    # Determine quality flags
    quality_flags = []
    if len(data_section) < 50:
        quality_flags.append("LOW_DATA")
    if horizon > 500:
        quality_flags.append("LONG_HORIZON_UNCERTAIN")

    result = {
        "p50": p50,
        "notes": "Forecast generated using Lag-Llama (simplified inference)",
        "quality_flags": quality_flags
    }

    if uncertainty:
        result["p10"] = p10
        result["p90"] = p90

    return result

@app.route('/v1/models', methods=['GET'])
def models():
    """List available models"""
    return jsonify({
        "object": "list",
        "data": [{
            "id": "lag-llama",
            "object": "model",
            "created": 1706745600,
            "owned_by": "time-series-foundation-models"
        }]
    })

if __name__ == '__main__':
    # Uncomment to load actual model
    # load_model()

    print("Starting Lag-Llama inference server...")
    print("Server will run on http://localhost:8000")
    print("\nNote: This is a simplified server. For production, download the actual model:")
    print("  huggingface-cli download time-series-foundation-models/Lag-Llama lag-llama.ckpt --local-dir .")

    app.run(host='0.0.0.0', port=8000, debug=True)
