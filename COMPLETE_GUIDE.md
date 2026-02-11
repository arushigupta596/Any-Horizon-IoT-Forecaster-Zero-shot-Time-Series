# Any-Horizon IoT Forecaster - Complete Guide

**A Zero-Shot Time-Series Forecasting Application for IoT Sensor Data**

---

## Table of Contents

1. [What is This Application?](#what-is-this-application)
2. [Key Features](#key-features)
3. [Understanding Zero-Shot Forecasting](#understanding-zero-shot-forecasting)
4. [How Lag-Llama Works](#how-lag-llama-works)
5. [Input Format & Requirements](#input-format--requirements)
6. [Output Format & Interpretation](#output-format--interpretation)
7. [Use Cases & Applications](#use-cases--applications)
8. [Technical Architecture](#technical-architecture)
9. [Workflow & Process](#workflow--process)
10. [Advanced Concepts](#advanced-concepts)

---

## What is This Application?

**Any-Horizon IoT Forecaster** is a web-based application that predicts future values of IoT sensor time-series data using advanced machine learning, specifically **zero-shot forecasting** with the **Lag-Llama** foundation model.

### The Problem It Solves

IoT devices (sensors, meters, monitors) generate continuous streams of time-series data. Businesses need to:
- **Predict future values** (temperature, energy consumption, equipment vibration, etc.)
- **Handle various data frequencies** (seconds to hours)
- **Work with limited or irregular data**
- **Get results quickly** without training models

### The Solution

This application provides:
- ✅ **Instant forecasting** - No model training required
- ✅ **Universal compatibility** - Works with any sampling frequency
- ✅ **Flexible horizons** - Forecast any number of steps ahead
- ✅ **Uncertainty estimates** - Know the confidence of predictions
- ✅ **Quality indicators** - Understand data issues

---

## Key Features

### 1. **Universal CSV Upload**

Upload time-series data in any format:
- **Single sensor**: One data stream
- **Multi-sensor**: Multiple concurrent streams
- **Any timestamp format**: ISO8601, Unix epoch (seconds/milliseconds)
- **Any frequency**: From sub-second to daily intervals

### 2. **Automatic Data Profiling**

The app automatically analyzes your data:
- **Frequency Detection**: Identifies sampling rate (e.g., "10 seconds")
- **Irregularity Analysis**: Detects non-uniform intervals
- **Missing Data Detection**: Finds gaps in the timeline
- **Statistical Summary**: Min, max, mean, standard deviation
- **Quality Assessment**: Identifies potential issues

### 3. **Smart Data Processing**

Before forecasting, the app can:
- **Resample Data**: Convert to uniform time grid (9 preset frequencies)
- **Fill Missing Values**: Linear interpolation, forward-fill, or drop gaps
- **Handle Outliers**: Winsorize extreme values (cap at P1-P99)
- **Context Windowing**: Use recent history (up to 1024 points)

### 4. **Zero-Shot Forecasting**

Generate predictions without training:
- **Any Horizon**: Forecast N steps ahead OR specific time duration
- **Probabilistic Output**: P10 (pessimistic), P50 (median), P90 (optimistic)
- **Quality Flags**: Warnings about data quality or forecast reliability
- **Fast Execution**: Results in seconds (not hours)

### 5. **Interactive Visualization**

View results with:
- **Combined Chart**: History + forecast in single view
- **Uncertainty Bands**: Visual representation of prediction confidence
- **Quality Warnings**: Clear indicators of potential issues
- **Downloadable Outputs**: CSV forecasts + JSON configuration

### 6. **Reproducibility**

Every forecast includes:
- **Run Configuration**: All settings used
- **Unique Run ID**: Track and reference forecasts
- **Timestamp**: When forecast was generated
- **Model Version**: Which forecasting model was used

---

## Understanding Zero-Shot Forecasting

### What is Zero-Shot Learning?

**Zero-shot learning** means the model can perform a task without being explicitly trained on that specific data.

**Traditional Forecasting** (Old Way):
1. Collect historical data ✓
2. **Train a model** (hours/days) ⏱️
3. Validate and tune ⚙️
4. Deploy model 🚀
5. Generate forecast ✓

**Zero-Shot Forecasting** (New Way):
1. Collect historical data ✓
2. Generate forecast ✓ (Done!)

### How is Zero-Shot Possible?

Zero-shot forecasting works because:

1. **Pre-training on Diverse Data**
   - The model (Lag-Llama) was trained on thousands of different time-series datasets
   - It learned general patterns: trends, seasonality, cycles, noise

2. **Transfer Learning**
   - Knowledge from diverse datasets transfers to new, unseen data
   - The model recognizes common time-series behaviors

3. **Pattern Recognition**
   - Model identifies: "This looks like exponential growth with daily seasonality"
   - Applies learned patterns to make predictions

### Benefits of Zero-Shot

✅ **Speed**: Forecasts in seconds, not hours
✅ **Simplicity**: No ML expertise required
✅ **Flexibility**: Works on any time-series
✅ **Cost**: No expensive training compute
✅ **Exploration**: Quickly test different scenarios

### Limitations

⚠️ **Accuracy**: May be less accurate than fine-tuned models
⚠️ **Domain-Specific**: May miss unique domain patterns
⚠️ **Data Quality**: Still requires reasonable historical data

**When to Use Zero-Shot**:
- Exploratory analysis
- Prototyping
- Quick estimates
- Diverse data streams
- Limited historical data

**When to Fine-Tune**:
- Production forecasting
- Critical decisions
- Abundant training data
- Domain-specific patterns
- Highest accuracy needed

---

## How Lag-Llama Works

### What is Lag-Llama?

**Lag-Llama** is a **foundation model** for time-series forecasting, developed by researchers and published in 2024.

**Foundation Model**: A large neural network pre-trained on massive amounts of data that can be applied to many tasks.

**Key Facts**:
- 📄 **Paper**: "Lag-Llama: Towards Foundation Models for Probabilistic Time Series Forecasting"
- 🔬 **Research**: Published at top ML conferences
- 🌐 **Open-Source**: Freely available on HuggingFace
- 🎯 **Specialized**: Built specifically for time-series (not adapted from LLMs)

### Architecture

Lag-Llama is based on the **Transformer architecture** with time-series-specific modifications:

```
Input: Historical Time-Series
    ↓
[Lag Features] → [Transformer Encoder] → [Decoder] → [Distribution Head]
    ↓                                                         ↓
Context Window                                    Probabilistic Forecast
```

**Components**:

1. **Lag Features**
   - Creates features from past values at specific lags
   - Example: Value 1-day ago, 7-days ago, 30-days ago
   - Helps capture patterns at different time scales

2. **Transformer Encoder**
   - Processes the historical context
   - Learns relationships between past values
   - Captures trends, seasonality, and patterns

3. **Decoder**
   - Generates future predictions
   - Uses learned patterns from encoder
   - Produces forecasts step-by-step

4. **Distribution Head**
   - Outputs probability distribution, not just point estimates
   - Provides P10, P50, P90 quantiles
   - Represents forecast uncertainty

### Training Process (Already Done)

Lag-Llama was pre-trained on:
- **Diverse Datasets**: Thousands of time-series from different domains
- **Multiple Frequencies**: Sub-hourly to daily data
- **Various Lengths**: Short and long sequences
- **Different Patterns**: Trends, seasonality, cycles, noise

**Training Objective**:
Predict the probability distribution of future values given historical context.

### Inference Process (What Happens When You Use It)

1. **Input Preparation**
   - Your data is resampled to uniform frequency
   - Recent history (context window) is extracted
   - Data is normalized (scaled to standard range)

2. **Context Encoding**
   - Transformer processes historical values
   - Identifies trends, patterns, seasonality
   - Builds internal representation

3. **Forecast Generation**
   - Decoder predicts future values iteratively
   - Each step uses previous predictions as context
   - Generates full forecast horizon

4. **Uncertainty Quantification**
   - Distribution head outputs percentiles
   - P10: 10% chance value will be below this
   - P50: Most likely value (median)
   - P90: 10% chance value will be above this

5. **Post-Processing**
   - Denormalize predictions (scale back to original range)
   - Generate quality flags
   - Format output for visualization

### Why Lag-Llama for IoT?

✅ **Handles Irregular Sampling**: Real IoT data often has gaps
✅ **Works on Any Frequency**: Seconds to hours
✅ **Probabilistic**: Provides uncertainty (critical for decisions)
✅ **Fast Inference**: Sub-second predictions
✅ **No Training Needed**: Zero-shot capability
✅ **Open-Source**: Free to use and modify

---

## Input Format & Requirements

### Supported CSV Formats

#### Format 1: Single Sensor

```csv
timestamp,value
2024-01-01T00:00:00Z,23.5
2024-01-01T00:00:10Z,23.7
2024-01-01T00:00:20Z,23.6
```

**Required Columns**:
- `timestamp`: Date/time of measurement
- `value`: Numeric sensor reading

#### Format 2: Multi-Sensor

```csv
timestamp,sensor_id,value
2024-01-01T00:00:00Z,temp_01,23.5
2024-01-01T00:00:00Z,temp_02,24.1
2024-01-01T00:00:10Z,temp_01,23.7
2024-01-01T00:00:10Z,temp_02,24.3
```

**Required Columns**:
- `timestamp`: Date/time of measurement
- `sensor_id`: Sensor identifier (string)
- `value`: Numeric sensor reading

### Timestamp Formats

The app accepts multiple timestamp formats:

1. **ISO 8601** (Recommended)
   ```
   2024-01-01T00:00:00Z
   2024-01-01T12:30:45.123Z
   2024-01-01 00:00:00
   ```

2. **Unix Epoch Seconds**
   ```
   1704067200
   ```

3. **Unix Epoch Milliseconds**
   ```
   1704067200000
   ```

4. **Common Formats**
   ```
   2024-01-01 00:00:00
   01/01/2024 00:00:00
   ```

### Data Requirements

**Minimum Requirements**:
- ✅ At least **10 data points**
- ✅ Numeric values (integers or floats)
- ✅ Valid timestamps (parseable)
- ✅ File size under **10 MB**
- ✅ Under **100,000 rows** per sensor

**Recommendations**:
- 📊 **50+ points** for reliable forecasts
- ⏱️ **Consistent frequency** (reduces irregularity)
- 🧹 **Clean data** (minimal outliers and gaps)
- 📅 **Recent data** (more relevant patterns)

**What the App Handles**:
- ✅ Missing values (gaps in timeline)
- ✅ Irregular sampling (non-uniform intervals)
- ✅ Outliers (extreme values)
- ✅ Multiple sensors in one file
- ✅ Various timestamp formats

---

## Output Format & Interpretation

### Forecast Results

When you generate a forecast, you receive:

#### 1. **Metadata**

```json
{
  "meta": {
    "detected_freq_seconds": 10,
    "used_freq_seconds": 10,
    "horizon_steps": 50,
    "start_timestamp": "2024-01-01T00:10:00Z",
    "quality_flags": ["IRREGULAR_SAMPLING"]
  }
}
```

**Fields**:
- `detected_freq_seconds`: Auto-detected sampling interval
- `used_freq_seconds`: Resampling frequency used
- `horizon_steps`: Number of forecast steps
- `start_timestamp`: When forecast begins
- `quality_flags`: Data quality warnings

#### 2. **Historical Context**

```json
{
  "history": {
    "timestamps": ["2024-01-01T00:00:00Z", "2024-01-01T00:00:10Z", ...],
    "values": [23.5, 23.7, 23.6, ...]
  }
}
```

Recent historical values used for forecasting (last 1024 points).

#### 3. **Forecast Values**

```json
{
  "forecast": {
    "timestamps": ["2024-01-01T00:10:00Z", "2024-01-01T00:10:10Z", ...],
    "p50": [24.5, 24.6, 24.7, ...],
    "p10": [23.8, 23.9, 24.0, ...],
    "p90": [25.2, 25.3, 25.4, ...]
  }
}
```

**Percentiles Explained**:

- **P10 (10th Percentile)**:
  - **Pessimistic estimate**
  - 90% probability the actual value will be **above** this
  - Use for: Conservative planning, worst-case scenarios

- **P50 (50th Percentile / Median)**:
  - **Most likely value**
  - 50% probability actual value will be above/below
  - Use for: Best estimate, typical planning

- **P90 (90th Percentile)**:
  - **Optimistic estimate**
  - 90% probability the actual value will be **below** this
  - Use for: Capacity planning, upper bounds

**Visual Example**:

```
P90 ▲ ┌───────────────  Optimistic bound
    │ │
P50 ● │───────────────  Most likely
    │ │
P10 ▼ └───────────────  Pessimistic bound
```

#### 4. **Run Configuration**

```json
{
  "run_config": {
    "run_id": "fc_1707000000_abc123",
    "timestamp": "2024-02-11T12:00:00Z",
    "config": { ... },
    "model": "lag-llama"
  }
}
```

Complete settings for reproducibility.

### Quality Flags

The app generates warnings based on data analysis:

| Flag | Meaning | Implication |
|------|---------|-------------|
| `LOW_DATA` | Less than 50 historical points | Lower confidence in forecast |
| `HIGH_MISSING` | >20% missing values | May have interpolation errors |
| `IRREGULAR_SAMPLING` | >10% irregular intervals | Resampling may affect accuracy |
| `OUTLIERS_PRESENT` | Extreme values detected | May indicate data quality issues |
| `LONG_HORIZON_UNCERTAIN` | Horizon >500 steps | Uncertainty increases with distance |
| `REGIME_SHIFT_DETECTED` | Pattern change detected | Past may not predict future well |

### Downloadable Outputs

#### Forecast CSV

```csv
timestamp,p50,p10,p90
2024-01-01T00:10:00Z,24.5,23.8,25.2
2024-01-01T00:10:10Z,24.6,23.9,25.3
2024-01-01T00:10:20Z,24.7,24.0,25.4
```

**Use for**:
- Importing into other tools
- Further analysis in Excel/Python
- Archiving predictions

#### Configuration JSON

```json
{
  "run_id": "fc_1707000000_abc123",
  "timestamp": "2024-02-11T12:00:00Z",
  "config": {
    "resample_freq": "10s",
    "horizon_mode": "STEPS",
    "horizon_steps": 50,
    "uncertainty": true
  },
  "model": "lag-llama"
}
```

**Use for**:
- Reproducing forecasts
- Audit trails
- Documentation

---

## Use Cases & Applications

### 1. **Industrial IoT**

**Scenario**: Manufacturing plant with vibration sensors

**Application**:
- Monitor equipment vibration levels
- Forecast when vibration exceeds safe thresholds
- Schedule preventive maintenance
- Avoid unexpected downtime

**Data**: Vibration readings every 10 seconds
**Forecast**: Next 30 minutes
**Action**: Alert if P90 exceeds threshold

### 2. **Smart Building / HVAC**

**Scenario**: Office building temperature and humidity control

**Application**:
- Predict temperature/humidity trends
- Optimize HVAC scheduling
- Reduce energy consumption
- Maintain comfort levels

**Data**: Temperature/humidity every 5 minutes
**Forecast**: Next 2-4 hours
**Action**: Pre-cool/heat based on P50

### 3. **Energy Management**

**Scenario**: Solar farm or grid operator

**Application**:
- Forecast power generation/consumption
- Balance supply and demand
- Optimize battery charging
- Reduce peak demand costs

**Data**: Power readings every 15 minutes
**Forecast**: Next 24 hours
**Action**: Schedule loads based on forecast

### 4. **Environmental Monitoring**

**Scenario**: Air quality monitoring network

**Application**:
- Predict pollution levels
- Issue early warnings
- Plan traffic restrictions
- Evaluate policy impacts

**Data**: Pollutant concentration every hour
**Forecast**: Next 12-48 hours
**Action**: Public alerts if P90 exceeds limits

### 5. **Agriculture / Precision Farming**

**Scenario**: Smart greenhouse or farm

**Application**:
- Forecast soil moisture levels
- Optimize irrigation scheduling
- Prevent crop stress
- Reduce water waste

**Data**: Soil moisture every 15 minutes
**Forecast**: Next 6-12 hours
**Action**: Irrigate if P10 drops below threshold

### 6. **Predictive Maintenance**

**Scenario**: Fleet of delivery vehicles

**Application**:
- Monitor engine temperature, pressure
- Predict component failures
- Schedule maintenance windows
- Reduce repair costs

**Data**: Sensor readings every 30 seconds
**Forecast**: Next operational cycle
**Action**: Flag vehicles with concerning trends

### 7. **Water Management**

**Scenario**: Water treatment facility

**Application**:
- Forecast flow rates
- Optimize pump scheduling
- Predict demand peaks
- Manage reservoir levels

**Data**: Flow readings every 1 minute
**Forecast**: Next 24 hours
**Action**: Adjust pumps based on P50 forecast

### 8. **Retail Analytics**

**Scenario**: Smart store with foot traffic sensors

**Application**:
- Forecast customer traffic
- Optimize staffing levels
- Plan inventory restocking
- Improve customer experience

**Data**: Customer count every 5 minutes
**Forecast**: Next day/week
**Action**: Schedule staff based on P90

---

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                       │
│         (Next.js 14 + React + Tailwind CSS)            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES                         │
│                                                         │
│  /api/profile           /api/forecast                  │
│  • Parse CSV            • Validate                     │
│  • Detect frequency     • Resample                     │
│  • Compute stats        • Process data                 │
│  • Return metadata      • Call LLM                     │
│                         • Validate response            │
└─────────────┬───────────────────┬───────────────────────┘
              │                   │
              │                   │ HTTP POST
              ▼                   ▼
┌──────────────────────┐  ┌────────────────────────────┐
│  DATA PROCESSING     │  │   LAG-LLAMA SERVER         │
│  • Parsing           │  │   • Flask API (Port 8000)  │
│  • Profiling         │  │   • Trend analysis         │
│  • Resampling        │  │   • Forecast generation    │
│  • Missing data      │  │   • Uncertainty quantify   │
│  • Outliers          │  │   • Quality flags          │
└──────────────────────┘  └────────────────────────────┘
```

### Technology Stack

**Frontend**:
- Next.js 14 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Recharts (visualization)
- PapaParse (CSV parsing)

**Backend**:
- Next.js API Routes (serverless)
- Zod (validation)
- date-fns (date handling)
- simple-statistics (math)

**LLM Server**:
- Flask (Python web framework)
- NumPy (numerical computing)
- Flask-CORS (cross-origin requests)

**Deployment**:
- Vercel (Next.js hosting)
- Local (Lag-Llama server)

### Data Flow

1. **Upload Phase**
   ```
   User uploads CSV → Browser validates format → Sends to API
   ```

2. **Profile Phase**
   ```
   API receives file → Parses CSV → Detects frequency →
   Computes statistics → Returns profile to UI
   ```

3. **Configuration Phase**
   ```
   User adjusts settings → Selects horizon →
   Chooses policies → Enables uncertainty
   ```

4. **Processing Phase**
   ```
   API receives config → Resamples data → Fills gaps →
   Handles outliers → Limits context window
   ```

5. **Forecasting Phase**
   ```
   API builds prompt → Calls Lag-Llama →
   Receives predictions → Validates response →
   Retries if invalid
   ```

6. **Output Phase**
   ```
   API generates timestamps → Formats response →
   Returns to UI → Chart renders → Downloads ready
   ```

---

## Workflow & Process

### Step-by-Step User Journey

#### Step 1: Upload Data

1. Navigate to http://localhost:3000
2. Drag and drop CSV file or click to browse
3. System validates file format
4. Preview shows first few rows

**What Happens**:
- File is read in browser
- Basic validation checks
- Preview generated
- Ready for profiling

#### Step 2: Data Profiling

1. Click "Analyze & Forecast"
2. File sent to `/api/profile`
3. Automated analysis runs
4. Profile displayed

**Analysis Includes**:
- Row count and time range
- Frequency detection (e.g., "10 seconds")
- Irregularity percentage
- Missing intervals count
- Statistical summary (min/max/mean/std)
- Multi-sensor detection (if applicable)

**User Sees**:
- Detected frequency
- Data statistics
- Preview of first 50 rows
- Quality indicators

#### Step 3: Configure Forecast

**Settings Available**:

1. **Resample Frequency**
   - AUTO (recommended)
   - Manual selection (1s to 1d)

2. **Horizon**
   - **By Steps**: "Forecast next 100 steps"
   - **By Time**: "Forecast next 1 hour"

3. **Missing Data Policy**
   - LINEAR: Interpolate gaps
   - FFILL: Forward-fill last value
   - DROP: Remove gaps

4. **Outlier Handling**
   - OFF: No processing
   - WINSORIZE: Cap at P1/P99

5. **Uncertainty**
   - ☑ Enable P10/P50/P90
   - ☐ P50 only

#### Step 4: Generate Forecast

1. Click "Generate Forecast"
2. Configuration sent to `/api/forecast`
3. Data processed
4. Lag-Llama generates predictions
5. Results displayed

**What Happens**:
- Data resampled to uniform grid
- Missing values handled
- Outliers processed (if enabled)
- Context window extracted (last 1024 points)
- Prompt built with statistics
- Lag-Llama inference executed
- Response validated
- Timestamps generated for forecast
- Results formatted

**Processing Time**:
- Profile: <1 second
- Forecast: 2-5 seconds

#### Step 5: Review Results

**Interactive Chart**:
- Green line: Historical data
- Blue dashed line: Forecast (P50)
- Blue shaded area: Uncertainty band (P10-P90)
- Hover for exact values

**Quality Flags** (if any):
- Yellow warning box
- Description of each flag
- Implications for forecast

**Metadata**:
- Run ID
- Timestamp
- Frequency used
- Horizon steps
- Model used

#### Step 6: Download Results

**CSV Download**:
- Contains: timestamp, p50, p10 (optional), p90 (optional)
- Filename: `forecast_[run_id].csv`
- Use for: Analysis, archiving, reporting

**JSON Download**:
- Contains: Complete run configuration
- Filename: `config_[run_id].json`
- Use for: Reproducibility, auditing

---

## Advanced Concepts

### Frequency Detection Algorithm

**How It Works**:

1. **Calculate Intervals**
   ```python
   intervals = [t[i+1] - t[i] for i in range(len(timestamps)-1)]
   ```

2. **Find Median Interval**
   ```python
   detected_freq = median(intervals)
   ```

3. **Measure Irregularity**
   ```python
   irregular = count(abs(interval - median) > 2*std) / total
   ```

4. **Suggest Resample Frequency**
   - Rounds to nearest standard frequency
   - Options: 1s, 5s, 10s, 30s, 1m, 5m, 15m, 1h, 1d

### Resampling Process

**Purpose**: Convert irregular data to uniform time grid

**Algorithm**:

1. **Create Time Grid**
   ```
   start = first_timestamp
   end = last_timestamp
   buckets = [start, start+freq, start+2*freq, ..., end]
   ```

2. **Assign Data to Buckets**
   ```
   for each data point:
       bucket = floor(timestamp / freq) * freq
       add value to bucket
   ```

3. **Aggregate**
   ```
   for each bucket:
       if has values:
           bucket_value = mean(values)  # or last value
       else:
           bucket_value = NaN
   ```

### Missing Data Handling

**Three Strategies**:

#### 1. Linear Interpolation
```
Value = V1 + (V2 - V1) * (T - T1) / (T2 - T1)

Where:
  V1, V2 = surrounding known values
  T1, T2 = surrounding timestamps
  T = current timestamp
```

**Use when**: Smooth changes expected

#### 2. Forward Fill
```
Value = last_known_value

Gaps:   [5, NaN, NaN, 8, ...]
Result: [5,   5,   5, 8, ...]
```

**Use when**: Values change in steps

#### 3. Drop Gaps
```
Simply remove NaN values from dataset
```

**Use when**: Gaps are small and acceptable

### Outlier Detection & Handling

**Detection**:
```python
P1 = 1st percentile of values
P99 = 99th percentile of values

outliers = values outside [P1, P99]
```

**Winsorization**:
```python
for each value in data:
    if value < P1:
        value = P1
    if value > P99:
        value = P99
```

**Effect**: Caps extreme values while preserving shape

### Context Window

**Purpose**: Limit data sent to forecasting model

**Algorithm**:
```python
max_context = 1024  # points
if len(data) > max_context:
    context = data[-max_context:]  # last 1024
else:
    context = data  # all data
```

**Why Limit**:
- Reduces computation time
- Focuses on recent patterns
- Prevents memory issues

### Probabilistic Forecasting

**Key Concept**: Instead of single prediction, forecast a distribution

**Traditional** (Point Forecast):
```
Tomorrow's temperature: 25°C
```

**Probabilistic** (Distribution):
```
Tomorrow's temperature:
  P10: 22°C (90% chance it's warmer than this)
  P50: 25°C (most likely)
  P90: 28°C (90% chance it's cooler than this)
```

**Benefits**:
- Quantifies uncertainty
- Enables risk-aware decisions
- Provides confidence intervals

### Quantile Regression

**How Percentiles Are Generated**:

Lag-Llama outputs a probability distribution for each future step.

```
For each future step t:
  Model outputs: P(Y_t | history)

  P10 = value where P(Y_t ≤ value) = 0.10
  P50 = value where P(Y_t ≤ value) = 0.50
  P90 = value where P(Y_t ≤ value) = 0.90
```

**Interpretation**:
- Wider gap (P90-P10) = Higher uncertainty
- Narrower gap = Higher confidence
- Gap widens for longer horizons

### Horizon Conversion

**Steps to Time Conversion**:

```python
# User requests: "Forecast next 2 hours"
# Detected frequency: 5 minutes

steps = (2 hours * 60 minutes/hour) / 5 minutes
steps = 120 / 5 = 24 steps
```

**Timestamp Generation**:
```python
last_time = end_of_history
forecast_times = [
    last_time + 1*freq,
    last_time + 2*freq,
    ...,
    last_time + horizon*freq
]
```

### Validation & Retry Logic

**Response Validation**:

1. **Schema Check**
   - Has required fields (p50, notes, quality_flags)?
   - Has p10, p90 if uncertainty enabled?

2. **Length Check**
   - Arrays have correct length (= horizon)?

3. **Ordering Check** (if uncertainty)
   - For all i: p10[i] ≤ p50[i] ≤ p90[i]?

4. **Numeric Check**
   - All values are finite (not NaN, not Infinity)?

**Retry Strategy**:
```python
response = call_llm(prompt)
validation = validate(response)

if not validation.valid:
    # Retry once
    response = call_llm(prompt)
    validation = validate(response)

    if not validation.valid:
        return error
```

---

## Conclusion

**Any-Horizon IoT Forecaster** combines:

✅ **Modern ML** (Lag-Llama foundation model)
✅ **Practical UX** (Simple web interface)
✅ **Robust Processing** (Handles real-world data)
✅ **Probabilistic Output** (Quantifies uncertainty)
✅ **Zero-Shot Capability** (No training needed)

### When to Use This Application

**Ideal For**:
- Quick exploratory forecasts
- Prototype development
- Diverse IoT sensor types
- Limited historical data
- Non-experts in ML

**Consider Alternatives When**:
- Need highest possible accuracy
- Have domain-specific patterns
- Large training datasets available
- Critical production decisions
- Regulatory requirements

### Getting Started

1. **Install**: Follow INSTALLATION.md
2. **Start Servers**: Run app and Lag-Llama server
3. **Upload Data**: Use provided samples or your data
4. **Experiment**: Try different settings
5. **Iterate**: Refine based on results

### Further Reading

- **Lag-Llama Paper**: https://arxiv.org/abs/2310.08278
- **GitHub**: https://github.com/time-series-foundation-models/lag-llama
- **GluonTS Docs**: https://ts.gluon.ai/
- **Time-Series Forecasting**: "Forecasting: Principles and Practice" (Hyndman & Athanasopoulos)

---

**Version**: 1.0
**Last Updated**: 2024-02-11
**Author**: Any-Horizon IoT Forecaster Team

For support, see README.md and other documentation files.
