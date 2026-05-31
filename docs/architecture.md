# Performance Engineering Framework Architecture

## Overview

This document describes the architecture of the Production-Grade Performance Engineering Framework, which combines Playwright UI/API testing with k6 performance testing, integrated with observability and CI/CD.

---

## System Architecture

### High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Developer Environment"
        DEV["Developer"]
        CODE["Source Code"]
    end

    subgraph "Version Control"
        GIT["GitHub Repository"]
    end

    subgraph "CI/CD Pipeline"
        GHA["GitHub Actions"]
        PW["Playwright Tests"]
        K6["K6 Tests"]
    end

    subgraph "Testing Infrastructure"
        DOCKER["Docker Compose"]
        K6_CLI["K6 CLI"]
        PW_CLI["Playwright CLI"]
    end

    subgraph "Observability Stack"
        INFLUX["InfluxDB"]
        GRAFANA["Grafana"]
    end

    subgraph "Reporting"
        REPORTS["HTML Reports"]
        K6_REPORT["K6 Reporter"]
        PW_REPORT["Monocart Reporter"]
    end

    subgraph "Target Systems"
        API["Restful Booker API"]
        UI["Sauce Demo App"]
    end

    DEV -->|Push Code| GIT
    GIT -->|Trigger| GHA
    GHA -->|Run| PW
    GHA -->|Run| K6
    K6 -->|Publish Metrics| INFLUX
    GRAFANA -->|Query| INFLUX
    PW -->|Generate| PW_REPORT
    K6 -->|Generate| K6_REPORT
    PW_REPORT -->|Store| REPORTS
    K6_REPORT -->|Store| REPORTS
    PW -->|Test| API
    PW -->|Test| UI
    K6_CLI -->|Stress| API
```

---

## Test Execution Pipeline

### Performance Testing Pipeline

```mermaid
graph LR
    START["Start"] -->|Checkout| CHECKOUT["Checkout Code"]
    CHECKOUT -->|Setup| SETUP["Setup Environment"]
    SETUP -->|Smoke| SMOKE["Smoke Test<br/>1 VU, 1 min"]
    SMOKE -->|Check| SMOKE_CHECK{Smoke<br/>Pass?}
    SMOKE_CHECK -->|No| FAIL1["❌ Fail"]
    SMOKE_CHECK -->|Yes| LOAD["Load Test<br/>Ramp to 50 VU"]
    LOAD -->|Check| LOAD_CHECK{Load<br/>Pass?}
    LOAD_CHECK -->|No| FAIL2["❌ Fail"]
    LOAD_CHECK -->|Yes| GATES["Validate Gates"]
    GATES -->|Check| GATES_CHECK{Gates<br/>Pass?}
    GATES_CHECK -->|No| FAIL3["❌ Fail Pipeline"]
    GATES_CHECK -->|Yes| PUBLISH["Publish Reports"]
    PUBLISH --> SUCCESS["✅ Success"]
    FAIL1 --> NOTIFY["Notify Team"]
    FAIL2 --> NOTIFY
    FAIL3 --> NOTIFY
    NOTIFY --> END["End"]
    SUCCESS --> END
```

---

## Project Structure

```mermaid
graph TD
    ROOT["project-root"]
    
    ROOT -->|UI & API| PW["playwright/"]
    PW -->|API Tests| PW_RB["restful-booker/"]
    PW -->|UI Tests| PW_SD["sauce-demo/"]
    PW_RB -->|Tests| PW_RB_TESTS["tests/"]
    PW_RB -->|Config| PW_RB_CONFIG["config/"]
    PW_RB -->|Helpers| PW_RB_FUNC["functions/"]
    PW_RB -->|Data| PW_RB_DATA["test-data/"]
    
    ROOT -->|Performance| K6["k6/"]
    K6 -->|Smoke| K6_SMOKE["smoke/"]
    K6 -->|Load| K6_LOAD["load/"]
    K6 -->|Stress| K6_STRESS["stress/"]
    K6 -->|Spike| K6_SPIKE["spike/"]
    K6 -->|Soak| K6_SOAK["soak/"]
    K6 -->|Scenarios| K6_SCEN["scenarios/"]
    K6 -->|Helpers| K6_HELP["helpers/"]
    K6 -->|Config| K6_CONF["config/"]
    K6 -->|Metrics| K6_MET["metrics/"]
    K6 -->|Data| K6_DATA["data/"]
    
    ROOT -->|Reports| REPORTS["reports/"]
    ROOT -->|Docs| DOCS["docs/"]
    ROOT -->|Observability| DASH["dashboards/"]
    ROOT -->|Docker| DOCKER_F["docker/"]
    ROOT -->|CI/CD| CI["github/workflows/"]
```

---

## Data Flow

### Test Execution Data Flow

```mermaid
graph LR
    TEST["Test Script"] -->|Load| CONFIG["Environment Config"]
    TEST -->|Generate| DATA["Test Data"]
    CONFIG -->|URL| HTTP["HTTP Requests"]
    DATA -->|Payload| HTTP
    HTTP -->|Call| API["REST API"]
    API -->|Response| VALIDATE["Validate Response"]
    VALIDATE -->|Record| METRICS["Custom Metrics"]
    METRICS -->|Store| INFLUX["InfluxDB"]
    INFLUX -->|Query| GRAFANA["Grafana Dashboard"]
    VALIDATE -->|Generate| REPORT["HTML Report"]
```

---

## Component Architecture

### K6 Test Framework Components

```mermaid
graph TB
    subgraph "Test Scripts"
        SMOKE_T["smoke.js"]
        LOAD_T["load.js"]
        STRESS_T["stress.js"]
        SPIKE_T["spike.js"]
        SOAK_T["soak.js"]
    end

    subgraph "Scenarios & Helpers"
        JOURNEY["userJourney.js"]
        APICLIENT["apiClient.js"]
        DATAGENERATOR["dataGenerator.js"]
        VALIDATOR["schemaValidator.js"]
    end

    subgraph "Configuration"
        ENV_CONFIG["environment.js"]
        THRESHOLDS["thresholds.js"]
        GATES["performanceGates.js"]
        METRICS["customMetrics.js"]
    end

    subgraph "Observability"
        INFLUX_OUT["InfluxDB Output"]
        K6_REPORTER["K6 Reporter"]
    end

    SMOKE_T -->|Use| JOURNEY
    LOAD_T -->|Use| JOURNEY
    STRESS_T -->|Use| JOURNEY
    SPIKE_T -->|Use| JOURNEY
    SOAK_T -->|Use| JOURNEY

    JOURNEY -->|Call| APICLIENT
    APICLIENT -->|Get Config| ENV_CONFIG
    JOURNEY -->|Get Data| DATAGENERATOR
    APICLIENT -->|Validate| VALIDATOR
    JOURNEY -->|Record| METRICS

    SMOKE_T -->|Use| THRESHOLDS
    LOAD_T -->|Use| THRESHOLDS
    STRESS_T -->|Use| THRESHOLDS
    SPIKE_T -->|Use| THRESHOLDS
    SOAK_T -->|Use| THRESHOLDS

    METRICS -->|Export| INFLUX_OUT
    SMOKE_T -->|Generate| K6_REPORTER
    LOAD_T -->|Generate| K6_REPORTER
```

---

## API Client Layer Architecture

### Request/Response Lifecycle

```mermaid
graph TB
    TEST["Test Code"]
    TEST -->|Call| APICLIENT["API Client"]
    
    subgraph "API Client Methods"
        AUTH["authenticate()"]
        CREATE["createBooking()"]
        GET["getBooking()"]
        UPDATE["updateBooking()"]
        DELETE["deleteBooking()"]
    end

    APICLIENT -->|Route| AUTH
    APICLIENT -->|Route| CREATE
    APICLIENT -->|Route| GET
    APICLIENT -->|Route| UPDATE
    APICLIENT -->|Route| DELETE

    subgraph "HTTP Layer"
        HEADERS["Add Headers"]
        ENCODE["Encode Payload"]
        EXECUTE["Execute HTTP"]
    end

    AUTH -->|Prepare| HEADERS
    CREATE -->|Prepare| HEADERS
    GET -->|Prepare| HEADERS
    UPDATE -->|Prepare| HEADERS
    DELETE -->|Prepare| HEADERS

    HEADERS -->|Process| ENCODE
    ENCODE -->|Send| EXECUTE

    subgraph "Response Processing"
        RESPONSE["Receive Response"]
        PARSE["Parse JSON"]
        VALIDATE_SCHEMA["Validate Schema"]
        RECORD_METRICS["Record Metrics"]
    end

    EXECUTE -->|Receive| RESPONSE
    RESPONSE -->|Parse| PARSE
    PARSE -->|Validate| VALIDATE_SCHEMA
    VALIDATE_SCHEMA -->|Record| RECORD_METRICS

    subgraph "Return to Test"
        RETURN["Return Result"]
    end

    RECORD_METRICS -->|Result| RETURN
    RETURN -->|Assertions| TEST
```

---

## Configuration Management

### Environment-Based Configuration

```mermaid
graph TB
    ENV["__ENV.ENV variable"]
    
    ENV -->|dev| DEV_CONFIG["dev.js"]
    ENV -->|staging| STAGING_CONFIG["staging.js"]
    ENV -->|prod| PROD_CONFIG["prod.js"]

    subgraph "Configuration Files"
        DEV_CONFIG -->|Base URL| DEV_URL["https://restful-booker.herokuapp.com"]
        DEV_CONFIG -->|Timeout| DEV_TO["30s"]
        DEV_CONFIG -->|Endpoints| DEV_EP["API Endpoints"]
        DEV_CONFIG -->|Credentials| DEV_CRED["Test Credentials"]
        
        STAGING_CONFIG -->|Base URL| STAGING_URL["https://restful-booker-staging.herokuapp.com"]
        STAGING_CONFIG -->|Timeout| STAGING_TO["30s"]
        
        PROD_CONFIG -->|Base URL| PROD_URL["https://restful-booker.herokuapp.com"]
        PROD_CONFIG -->|Timeout| PROD_TO["30s"]
    end

    subgraph "Environment Selector"
        SELECTOR["environment.js"]
    end

    DEV_CONFIG -->|Import| SELECTOR
    STAGING_CONFIG -->|Import| SELECTOR
    PROD_CONFIG -->|Import| SELECTOR

    SELECTOR -->|Export| SELECTED_CONFIG["Selected Config"]
    SELECTED_CONFIG -->|Use| TESTS["Tests"]
```

---

## Metrics & Observability Architecture

### Metrics Collection and Reporting

```mermaid
graph LR
    subgraph "Test Execution"
        K6_TEST["K6 Tests"]
    end

    subgraph "Metric Types"
        TREND["Trend Metrics<br/>booking_creation_time"]
        COUNTER["Counter Metrics<br/>booking_created_count"]
        RATE["Rate Metrics<br/>booking_failure_rate"]
        GAUGE["Gauge Metrics<br/>concurrent_bookings"]
    end

    subgraph "Collection"
        CUSTOM_METRICS["customMetrics.js"]
    end

    subgraph "Storage & Visualization"
        INFLUX_DB["InfluxDB<br/>Time-Series DB"]
        GRAFANA_DASH["Grafana<br/>Dashboard"]
    end

    subgraph "Reporting"
        K6_REP["K6 Reporter<br/>HTML Reports"]
        SUMMARY["Summary Reports<br/>JSON/Markdown"]
    end

    K6_TEST -->|Record| TREND
    K6_TEST -->|Record| COUNTER
    K6_TEST -->|Record| RATE
    K6_TEST -->|Record| GAUGE

    TREND -->|Aggregate| CUSTOM_METRICS
    COUNTER -->|Aggregate| CUSTOM_METRICS
    RATE -->|Aggregate| CUSTOM_METRICS
    GAUGE -->|Aggregate| CUSTOM_METRICS

    CUSTOM_METRICS -->|Push| INFLUX_DB
    K6_TEST -->|Generate| K6_REP
    INFLUX_DB -->|Query| GRAFANA_DASH
    K6_REP -->|Create| SUMMARY
```

---

## CI/CD Integration

### GitHub Actions Workflow

```mermaid
graph TD
    TRIGGER["Code Push"]
    TRIGGER -->|Trigger| CHECKOUT["Checkout Code"]
    
    CHECKOUT -->|Parallel| PW_TEST["Playwright Tests"]
    CHECKOUT -->|Parallel| K6_SETUP["K6 Setup"]
    
    PW_TEST -->|Success| PW_ARTIFACTS["Collect Artifacts"]
    K6_SETUP -->|Run| K6_SMOKE["K6 Smoke Test"]
    
    K6_SMOKE -->|Success| K6_LOAD["K6 Load Test"]
    K6_SMOKE -->|Fail| NOTIFY_FAIL["❌ Notify Failure"]
    
    K6_LOAD -->|Success| GATES_CHECK["Check Gates"]
    K6_LOAD -->|Fail| NOTIFY_FAIL
    
    GATES_CHECK -->|Pass| PUBLISH["Publish Reports"]
    GATES_CHECK -->|Fail| NOTIFY_FAIL
    
    PUBLISH -->|Create| ARTIFACTS["Test Artifacts"]
    ARTIFACTS -->|Success| SUCCESS["✅ Pipeline Success"]
    
    NOTIFY_FAIL --> END["Notify Team"]
    SUCCESS --> END
```

---

## Docker Architecture

### Docker Compose Stack

```mermaid
graph TB
    subgraph "Docker Compose Services"
        K6_CONTAINER["k6 Container<br/>Performance Tests"]
        INFLUX_CONTAINER["InfluxDB Container<br/>Metrics Storage"]
        GRAFANA_CONTAINER["Grafana Container<br/>Visualization"]
    end

    subgraph "Volume Mounts"
        K6_VOL["k6 source code"]
        REPORTS_VOL["reports/"]
        INFLUX_VOL["influxdb-data/"]
        GRAFANA_VOL["grafana-data/"]
    end

    subgraph "Network"
        NET["performance-network<br/>Docker bridge"]
    end

    K6_CONTAINER -->|Mount| K6_VOL
    K6_CONTAINER -->|Mount| REPORTS_VOL
    K6_CONTAINER -->|Push| INFLUX_CONTAINER
    K6_CONTAINER -->|Connect| NET
    
    INFLUX_CONTAINER -->|Mount| INFLUX_VOL
    INFLUX_CONTAINER -->|Connect| NET
    
    GRAFANA_CONTAINER -->|Mount| GRAFANA_VOL
    GRAFANA_CONTAINER -->|Query| INFLUX_CONTAINER
    GRAFANA_CONTAINER -->|Connect| NET

    subgraph "Ports"
        K6_PORT["Not Exposed"]
        INFLUX_PORT["8086"]
        GRAFANA_PORT["3000"]
    end

    K6_CONTAINER -.->|via network| K6_PORT
    INFLUX_CONTAINER -.->|Port| INFLUX_PORT
    GRAFANA_CONTAINER -.->|Port| GRAFANA_PORT
```

---

## Deployment Stages

### Test Execution Stages

```mermaid
graph LR
    STAGE1["Stage 1: Setup<br/>Install Dependencies<br/>Load Configuration"]
    STAGE2["Stage 2: Smoke<br/>1 VU, 1 min<br/>Sanity Check"]
    STAGE3["Stage 3: Load<br/>Ramp to 50 VUs<br/>Typical Load"]
    STAGE4["Stage 4: Analyze<br/>Check Thresholds<br/>Validate Gates"]
    STAGE5["Stage 5: Report<br/>Generate Reports<br/>Publish Results"]

    STAGE1 -->|Pass| STAGE2
    STAGE1 -->|Fail| FAIL1["❌ Abort"]
    
    STAGE2 -->|Pass| STAGE3
    STAGE2 -->|Fail| FAIL2["❌ Abort"]
    
    STAGE3 -->|Pass| STAGE4
    STAGE3 -->|Fail| FAIL3["❌ Abort"]
    
    STAGE4 -->|Pass| STAGE5
    STAGE4 -->|Fail| FAIL4["❌ Fail Build"]
    
    STAGE5 --> SUCCESS["✅ Success"]
```

---

## Performance Test Types

### Test Type Characteristics

```mermaid
graph TB
    subgraph "Smoke Test"
        SMOKE_VU["1 Virtual User"]
        SMOKE_DUR["1 Minute Duration"]
        SMOKE_PURPOSE["Sanity Check"]
    end

    subgraph "Load Test"
        LOAD_VU["Ramp to 50 VUs"]
        LOAD_DUR["~7 Minutes"]
        LOAD_PURPOSE["Typical Load Capacity"]
    end

    subgraph "Stress Test"
        STRESS_VU["Ramp from 50 to 500 VUs"]
        STRESS_DUR["~15 Minutes"]
        STRESS_PURPOSE["Breaking Point"]
    end

    subgraph "Spike Test"
        SPIKE_VU["Instant 1000 VUs"]
        SPIKE_DUR["~3 Minutes"]
        SPIKE_PURPOSE["Sudden Traffic Spike"]
    end

    subgraph "Soak Test"
        SOAK_VU["100 VUs"]
        SOAK_DUR["2 Hours"]
        SOAK_PURPOSE["Stability Over Time"]
    end
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Testing** | Playwright | Browser automation, UI tests |
| **API Testing** | Playwright, k6 | API functional & performance tests |
| **Performance Testing** | k6 | Load testing, spike testing, soak testing |
| **Configuration** | JavaScript | Environment-based config management |
| **Data Generation** | Custom JS | Realistic test data generation |
| **Metrics Storage** | InfluxDB | Time-series database for metrics |
| **Visualization** | Grafana | Real-time dashboards |
| **Reporting** | k6-reporter, Monocart | HTML reports |
| **CI/CD** | GitHub Actions | Automated test execution |
| **Containerization** | Docker | Isolated test environment |
| **Version Control** | Git | Source code management |

---

## Security Architecture

```mermaid
graph TB
    SOURCES["Test Sources"]
    SOURCES -->|Encrypt| GIT["GitHub (Private Repo)"]
    GIT -->|Clone| ACTIONS["GitHub Actions"]
    ACTIONS -->|Env Vars| SECRETS["Secrets Store"]
    SECRETS -->|Inject| TESTS["Tests"]
    TESTS -->|TLS| API["HTTPS API"]
    TESTS -->|No Logs| METRICS["Metrics"]
```

---

## Scalability Considerations

### Horizontal Scaling

- **K6 Cloud:** Distribute load across multiple cloud nodes
- **Docker:** Scale containers across Kubernetes cluster
- **Database:** Use InfluxDB Enterprise for high-volume metrics
- **Dashboards:** Multiple Grafana instances for concurrent users

### Performance Optimization

- Implement data retention policies in InfluxDB
- Use caching for frequently accessed metrics
- Compress old reports
- Parallelize test execution

---

## Monitoring & Alerting

### Key Metrics to Monitor

- HTTP response times (P50, P95, P99)
- Error rates by endpoint
- Throughput metrics
- Virtual user behavior
- Resource utilization

### Alert Thresholds

| Condition | Action |
|-----------|--------|
| P95 > 500ms | ⚠️ Warning |
| P95 > 1000ms | ❌ Critical |
| Error Rate > 1% | ❌ Critical |
| Error Rate > 5% | 🔴 Severe |

---

## Future Enhancements

1. **InfluxDB Cloud Integration** - Move to managed service
2. **K6 Cloud** - Distributed load testing
3. **Advanced Analytics** - ML-based anomaly detection
4. **Webhook Notifications** - Slack/Teams integration
5. **Performance Budgeting** - Track against budgets
6. **Tracing Integration** - OpenTelemetry support
7. **Mobile Performance** - Add mobile testing
8. **API Contract Testing** - Enhanced schema validation
