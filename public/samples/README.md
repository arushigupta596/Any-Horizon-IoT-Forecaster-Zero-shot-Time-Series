# Sample Datasets

This directory contains sample IoT time-series datasets for testing the Any-Horizon Forecaster.

## Available Datasets

### 1. **temperature-10s.csv** ⏱️ 10-second intervals
- **Description**: Temperature sensor readings from industrial equipment
- **Rows**: 50 data points
- **Frequency**: 10 seconds
- **Value Range**: 23.5°C - 28.5°C
- **Use Case**: High-frequency temperature monitoring
- **Pattern**: Gradual increasing trend

**Sample:**
```csv
timestamp,value
2024-01-01T00:00:00Z,23.5
2024-01-01T00:00:10Z,23.7
```

---

### 2. **pressure-sensor-1min.csv** ⏱️ 1-minute intervals
- **Description**: Atmospheric pressure monitoring
- **Rows**: 61 data points
- **Frequency**: 1 minute
- **Value Range**: 101.2 - 105.1 kPa
- **Use Case**: Weather station or industrial pressure monitoring
- **Pattern**: Steady upward trend with minor fluctuations

**Sample:**
```csv
timestamp,value
2024-02-01T00:00:00Z,101.3
2024-02-01T00:01:00Z,101.2
```

---

### 3. **humidity-5min.csv** ⏱️ 5-minute intervals
- **Description**: Relative humidity measurements
- **Rows**: 49 data points
- **Frequency**: 5 minutes
- **Value Range**: 65.2% - 77.1%
- **Use Case**: HVAC monitoring, greenhouse automation
- **Pattern**: Gradual increase during morning hours

**Sample:**
```csv
timestamp,value
2024-02-01T08:00:00Z,65.2
2024-02-01T08:05:00Z,65.8
```

---

### 4. **power-consumption-hourly.csv** ⏱️ 1-hour intervals
- **Description**: Building power consumption
- **Rows**: 48 data points (2 days)
- **Frequency**: 1 hour
- **Value Range**: 1,080 - 2,750 kWh
- **Use Case**: Energy management, demand forecasting
- **Pattern**: Daily cycle with peaks during business hours

**Sample:**
```csv
timestamp,value
2024-02-01T00:00:00Z,1250.5
2024-02-01T01:00:00Z,1180.2
```

---

### 5. **vibration-irregular.csv** ⚠️ Irregular intervals
- **Description**: Machine vibration sensor with irregular sampling
- **Rows**: 40 data points
- **Frequency**: Irregular (5-30 second gaps)
- **Value Range**: 2.3 - 5.0 mm/s
- **Use Case**: Testing irregular sampling handling
- **Pattern**: Increasing vibration over time
- **Special**: Demonstrates app's ability to handle non-uniform timestamps

**Sample:**
```csv
timestamp,value
2024-02-01T10:00:00Z,2.3
2024-02-01T10:00:05Z,2.5
2024-02-01T10:00:12Z,2.4
```

---

### 6. **water-flow-epoch.csv** 🕐 Epoch timestamps
- **Description**: Water flow rate in pipeline
- **Rows**: 50 data points
- **Frequency**: 60 seconds
- **Value Range**: 125.3 - 244.2 L/min
- **Use Case**: Testing epoch timestamp parsing
- **Pattern**: Linear increase
- **Special**: Uses Unix epoch seconds instead of ISO format

**Sample:**
```csv
timestamp,value
1706774400,125.3
1706774460,127.8
```

---

### 7. **multi-sensor-energy.csv** 🔌 Multi-sensor dataset
- **Description**: Energy consumption from multiple power grids
- **Rows**: 22 entries (2 sensors)
- **Frequency**: 1 minute
- **Sensors**: grid_01, grid_02
- **Value Range**: 245 - 347 kW
- **Use Case**: Testing multi-sensor support
- **Pattern**: Both sensors show increasing consumption

**Sample:**
```csv
timestamp,sensor_id,value
2024-01-01T00:00:00Z,grid_01,245.3
2024-01-01T00:00:00Z,grid_02,312.1
```

---

### 8. **multi-sensor-factory.csv** 🏭 Multi-sensor factory
- **Description**: Production machine monitoring (3 machines)
- **Rows**: 51 entries (3 sensors)
- **Frequency**: 5 minutes
- **Sensors**: machine_a, machine_b, machine_c
- **Value Range**: 78.5 - 121.4
- **Use Case**: Factory automation, predictive maintenance
- **Pattern**: All machines show upward operational trends

**Sample:**
```csv
timestamp,sensor_id,value
2024-02-01T00:00:00Z,machine_a,85.3
2024-02-01T00:00:00Z,machine_b,92.1
2024-02-01T00:00:00Z,machine_c,78.5
```

---

### 9. **soil-moisture-with-gaps.csv** 🌱 Data with missing intervals
- **Description**: Soil moisture sensor with some missing readings
- **Rows**: 42 data points
- **Frequency**: 15 minutes (with gaps)
- **Value Range**: 45.2% - 71.6%
- **Use Case**: Testing missing data handling
- **Pattern**: Increasing moisture (irrigation cycle)
- **Special**: Contains deliberate gaps to test missing data policies

**Sample:**
```csv
timestamp,value
2024-02-01T06:00:00Z,45.2
2024-02-01T06:15:00Z,45.8
2024-02-01T06:30:00Z,46.3
2024-02-01T07:00:00Z,47.4  # Note: 06:45 missing
```

---

## Testing Scenarios

### Quick Test
Use `temperature-10s.csv` for fastest testing.

### Frequency Detection
- **Fast**: `temperature-10s.csv` (10s)
- **Medium**: `pressure-sensor-1min.csv` (1m)
- **Slow**: `power-consumption-hourly.csv` (1h)

### Irregular Sampling
Use `vibration-irregular.csv` to test frequency detection on irregular data.

### Missing Data
Use `soil-moisture-with-gaps.csv` to test missing data policies (LINEAR/FFILL/DROP).

### Multi-Sensor
- `multi-sensor-energy.csv` - 2 sensors
- `multi-sensor-factory.csv` - 3 sensors

### Different Timestamp Formats
- **ISO 8601**: Most datasets
- **Epoch seconds**: `water-flow-epoch.csv`

### Long Horizon Testing
Use `power-consumption-hourly.csv` for testing time-based horizons (e.g., "forecast next 24 hours").

## How to Use

1. **Upload**: Drag and drop any CSV file to the upload zone
2. **Review Profile**: Check detected frequency and statistics
3. **Configure**: Adjust settings (resampling, horizon, uncertainty)
4. **Generate**: Click "Generate Forecast"
5. **Download**: Get CSV forecast and JSON configuration

## Creating Custom Datasets

Your CSV should have:
- **Required columns**: `timestamp`, `value`
- **Optional column**: `sensor_id` (for multi-sensor)
- **Timestamp formats**: ISO 8601, epoch seconds, or epoch milliseconds
- **Values**: Numeric (integers or floats)

Example:
```csv
timestamp,value
2024-01-01T00:00:00Z,100.5
2024-01-01T00:01:00Z,101.2
2024-01-01T00:02:00Z,102.8
```

## Dataset Statistics

| Dataset | Rows | Frequency | Duration | Pattern |
|---------|------|-----------|----------|---------|
| temperature-10s | 50 | 10s | ~8 min | Increasing |
| pressure-sensor-1min | 61 | 1m | 1 hour | Increasing |
| humidity-5min | 49 | 5m | 4 hours | Increasing |
| power-consumption-hourly | 48 | 1h | 2 days | Daily cycle |
| vibration-irregular | 40 | Irregular | ~8 min | Increasing |
| water-flow-epoch | 50 | 1m | ~50 min | Linear |
| multi-sensor-energy | 22 | 1m | 10 min | Increasing |
| multi-sensor-factory | 51 | 5m | 20 min | Increasing |
| soil-moisture-with-gaps | 42 | 15m | ~12 hours | Increasing |

---

**Total Datasets**: 9
**Total Data Points**: 413+
**Coverage**: Sub-minute to hourly frequencies
**Special Cases**: Irregular, missing data, multi-sensor, epoch timestamps
