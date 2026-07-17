# SmileGuard Load Test Report

## Test Configuration
- **Target URL**: `http://127.0.0.1:8000/`
- **Method**: `GET`
- **Concurrency (VUs)**: 10
- **Target Duration**: 5s
- **Actual Duration**: 5.01s
- **Keep-Alive**: Enabled

## Performance Summary
| Metric | Value |
| :--- | :--- |
| **Total Requests** | 10323 |
| **Successful Requests** | 10323 |
| **Failed Requests** | 0 |
| **Connection Errors** | 0 |
| **Throughput (RPS)** | **2061.30 req/sec** |

## Latency Statistics (Successful Requests)
| Percentile / Metric | Latency |
| :--- | :--- |
| **Minimum** | 1.4ms |
| **Average (Mean)** | **4.7ms** |
| **Median (p50)** | 4.6ms |
| **90th Percentile (p90)** | 6.6ms |
| **95th Percentile (p95)** | 7.4ms |
| **99th Percentile (p99)** | 12.4ms |
| **Maximum** | 28.7ms |

## Response Status Code Breakdown
| Status Code | Count | Percentage |
| :--- | :--- | :--- |
| 200 | 10323 | 100.00% |


