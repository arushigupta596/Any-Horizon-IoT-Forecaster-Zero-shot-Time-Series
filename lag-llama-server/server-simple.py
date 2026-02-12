"""
Simplified Lag-Llama Inference Server
Provides OpenAI-compatible API for time-series forecasting
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from datetime import datetime
import json
import re

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model": "lag-llama-simplified"})

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
            "id": f"chatcmpl-{int(datetime.now().timestamp())}",
            "object": "chat.completion",
            "created": int(datetime.now().timestamp()),
            "model": "lag-llama-simplified",
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
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

def parse_and_forecast(prompt):
    """
    Parse prompt and generate forecast
    Uses simplified statistical forecasting
    """
    # Extract data from prompt
    lines = prompt.split('\n')

    # Find the data section
    data_section = []
    horizon = 100  # default
    uncertainty = True

    for i, line in enumerate(lines):
        if 'Last 50 values:' in line or 'Last' in line and 'values' in line:
            # Next line has the values
            if i + 1 < len(lines):
                values_str = lines[i + 1].strip()
                try:
                    data_section = [float(x.strip()) for x in values_str.split(',') if x.strip()]
                except:
                    pass

        if 'Forecast the next' in line:
            # Extract horizon
            numbers = re.findall(r'\d+', line)
            if numbers:
                horizon = int(numbers[0])

    if not data_section:
        raise ValueError("Could not parse time-series data from prompt")

    # Simple forecasting using trend and seasonality
    n = len(data_section)

    # Calculate trend
    x = np.arange(n)
    y = np.array(data_section)

    # Linear regression for trend
    if n > 1:
        trend = np.polyfit(x, y, 1)
        trend_fn = np.poly1d(trend)
    else:
        trend_fn = lambda x: data_section[0]

    # Calculate noise level
    if n > 2:
        residuals = y - trend_fn(x)
        noise_std = np.std(residuals)
    else:
        noise_std = np.std(y) if n > 1 else abs(y[0]) * 0.1

    # Generate forecast
    forecast_x = np.arange(n, n + horizon)
    p50 = trend_fn(forecast_x).tolist()

    # Add some realistic variation
    p10 = (trend_fn(forecast_x) - 1.28 * noise_std).tolist()  # ~10th percentile
    p90 = (trend_fn(forecast_x) + 1.28 * noise_std).tolist()  # ~90th percentile

    # Determine quality flags
    quality_flags = []
    if n < 50:
        quality_flags.append("LOW_DATA")
    if horizon > 500:
        quality_flags.append("LONG_HORIZON_UNCERTAIN")
    if noise_std > np.mean(np.abs(y)) * 0.3:
        quality_flags.append("HIGH_MISSING")

    result = {
        "p50": p50,
        "notes": f"Forecast generated using simplified trend analysis (n={n}, horizon={horizon})",
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
            "id": "lag-llama-simplified",
            "object": "model",
            "created": 1706745600,
            "owned_by": "local"
        }]
    })

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8000))

    print("=" * 60)
    print("  Lag-Llama Simplified Inference Server")
    print("=" * 60)
    print()
    print(f"✅ Server starting on http://0.0.0.0:{port}")
    print()
    print("📊 Features:")
    print("  • Trend-based forecasting")
    print("  • Uncertainty quantification")
    print("  • OpenAI-compatible API")
    print()
    print("🔗 Endpoints:")
    print("  • GET  /health")
    print("  • POST /v1/chat/completions")
    print("  • GET  /v1/models")
    print()
    print("Press Ctrl+C to stop")
    print("=" * 60)
    print()

    app.run(host='0.0.0.0', port=port, debug=False)
