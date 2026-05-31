# Performance Test Report Template

**Generated:** [DATE]  
**Test Environment:** [ENV]  
**Report Period:** [START] - [END]

---

## Executive Summary

### Test Overview

| Metric | Value |
|--------|-------|
| **Test Duration** | [DURATION] |
| **Virtual Users (VUs)** | [VU_COUNT] |
| **Total Requests** | [TOTAL_REQUESTS] |
| **Test Type** | [SMOKE/LOAD/STRESS/SPIKE/SOAK] |
| **Status** | [PASSED/FAILED] |

---

## Performance Results

### Response Time Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **P50 (Median)** | < 200ms | [ACTUAL]ms | ✅/❌ |
| **P90** | < 400ms | [ACTUAL]ms | ✅/❌ |
| **P95 (Critical)** | < 500ms | [ACTUAL]ms | ✅/❌ |
| **P99** | < 1000ms | [ACTUAL]ms | ✅/❌ |
| **Average** | < 300ms | [ACTUAL]ms | ✅/❌ |
| **Max** | N/A | [ACTUAL]ms | ℹ️ |

### Error & Success Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **Error Rate** | < 1% | [ACTUAL]% | ✅/❌ |
| **Success Rate** | > 99% | [ACTUAL]% | ✅/❌ |
| **Check Pass Rate** | > 95% | [ACTUAL]% | ✅/❌ |
| **Failed Requests** | [COUNT] | [ACTUAL] | ℹ️ |

### Throughput Metrics

| Metric | Value |
|--------|-------|
| **Requests/Second** | [VALUE] |
| **Requests/Minute** | [VALUE] |
| **Total Bytes Received** | [VALUE] |
| **Average Bandwidth** | [VALUE]/sec |

### Business Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Booking Creation Time (avg)** | [VALUE]ms | ✅/❌ |
| **Bookings Created** | [COUNT] | ℹ️ |
| **Booking Retrieval Time (avg)** | [VALUE]ms | ✅/❌ |
| **Booking Operations Success Rate** | [RATE]% | ✅/❌ |

---

## Performance by Endpoint

### POST /booking (Create Booking)

| Metric | Value |
|--------|-------|
| Requests | [COUNT] |
| Success Rate | [RATE]% |
| Avg Response Time | [VALUE]ms |
| P95 Response Time | [VALUE]ms |
| Error Rate | [RATE]% |

### GET /booking/{id} (Get Booking)

| Metric | Value |
|--------|-------|
| Requests | [COUNT] |
| Success Rate | [RATE]% |
| Avg Response Time | [VALUE]ms |
| P95 Response Time | [VALUE]ms |
| Error Rate | [RATE]% |

### PUT /booking/{id} (Update Booking)

| Metric | Value |
|--------|-------|
| Requests | [COUNT] |
| Success Rate | [RATE]% |
| Avg Response Time | [VALUE]ms |
| P95 Response Time | [VALUE]ms |
| Error Rate | [RATE]% |

### DELETE /booking/{id} (Delete Booking)

| Metric | Value |
|--------|-------|
| Requests | [COUNT] |
| Success Rate | [RATE]% |
| Avg Response Time | [VALUE]ms |
| P95 Response Time | [VALUE]ms |
| Error Rate | [RATE]% |

---

## Load Profile

### Virtual User Ramp-Up

```
Time    | VUs | Target | Duration
--------|-----|--------|----------
0-1m    | 0→1 | 1 VU   | 1 minute
...     | ... | ...    | ...
Final   | [N] | [N] VU | [DURATION]
```

---

## Key Findings

### ✅ What Went Well

- **Finding 1:** [DESCRIPTION]
- **Finding 2:** [DESCRIPTION]
- **Finding 3:** [DESCRIPTION]

### ⚠️ Areas of Concern

- **Issue 1:** [DESCRIPTION] - Impact: [HIGH/MEDIUM/LOW]
- **Issue 2:** [DESCRIPTION] - Impact: [HIGH/MEDIUM/LOW]

### 🔍 Anomalies Detected

- **Anomaly 1:** [DESCRIPTION] at [TIME]
- **Anomaly 2:** [DESCRIPTION] at [TIME]

---

## Bottlenecks & Recommendations

### Performance Bottlenecks

1. **Bottleneck:** [DESCRIPTION]
   - **Root Cause:** [CAUSE]
   - **Impact:** [IMPACT]
   - **Severity:** [CRITICAL/HIGH/MEDIUM/LOW]

2. **Bottleneck:** [DESCRIPTION]
   - **Root Cause:** [CAUSE]
   - **Impact:** [IMPACT]
   - **Severity:** [CRITICAL/HIGH/MEDIUM/LOW]

### Recommendations

1. **Priority 1:** [ACTION] - Expected Impact: [IMPROVEMENT]%
2. **Priority 2:** [ACTION] - Expected Impact: [IMPROVEMENT]%
3. **Priority 3:** [ACTION] - Expected Impact: [IMPROVEMENT]%

### Technical Recommendations

- Increase cache hit ratio by implementing [STRATEGY]
- Optimize database queries by [ACTION]
- Scale horizontally by adding [RESOURCES]
- Implement load balancing with [SOLUTION]

---

## Comparison with Previous Tests

| Metric | Previous | Current | Change | Trend |
|--------|----------|---------|--------|-------|
| **P95 Response Time** | [VALUE]ms | [VALUE]ms | ±[VALUE]ms | ↗/↘/→ |
| **Error Rate** | [VALUE]% | [VALUE]% | ±[VALUE]% | ↗/↘/→ |
| **Throughput** | [VALUE]/s | [VALUE]/s | ±[VALUE]/s | ↗/↘/→ |
| **Success Rate** | [VALUE]% | [VALUE]% | ±[VALUE]% | ↗/↘/→ |

---

## Performance Gates Validation

### Gate Results

| Gate | Target | Actual | Status |
|------|--------|--------|--------|
| P95 Response Time | < 500ms | [VALUE]ms | ✅/❌ |
| Error Rate | < 1% | [VALUE]% | ✅/❌ |
| Check Pass Rate | > 95% | [VALUE]% | ✅/❌ |
| Throughput | > 10 req/s | [VALUE] req/s | ✅/❌ |

**Overall Gate Status:** ✅ **PASSED** / ❌ **FAILED**

---

## Recommendations for Next Steps

1. **Immediate Actions (24 hours)**
   - [ ] Action 1
   - [ ] Action 2

2. **Short-term Actions (1 week)**
   - [ ] Action 1
   - [ ] Action 2

3. **Long-term Actions (1 month)**
   - [ ] Action 1
   - [ ] Action 2

---

## Appendix

### Test Configuration
- **Test Type:** [TYPE]
- **Environment:** [ENV]
- **API Base URL:** [URL]
- **Node Count:** [COUNT]

### Tools Used
- **Load Testing:** k6
- **Monitoring:** Grafana + InfluxDB
- **Reporting:** k6-reporter

### Test Artifacts
- [Detailed k6 Report](reports/k6-load.html)
- [Grafana Dashboard](http://grafana:3000/)
- [Test Configuration](k6/config/)

---

**Report Prepared By:** [NAME]  
**Approved By:** [NAME]  
**Next Review Date:** [DATE]
