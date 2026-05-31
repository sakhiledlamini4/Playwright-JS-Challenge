# Performance Engineering Framework

This repository has been upgraded into a production-grade performance engineering framework with:

- Playwright API and UI testing
- k6 performance testing for smoke, load, stress, spike, and soak scenarios
- Environment-aware configuration (`dev`, `staging`, `prod`)
- Dynamic booking data generation
- API contract validation and schema checks
- Custom k6 metrics and reporting
- Dockerized stack with InfluxDB and Grafana
- GitHub Actions CI/CD pipeline with performance gates
- Executive and architecture documentation

## Folder Structure

```
project-root/
├── .github/workflows/         # GitHub Actions CI/CD
├── dashboards/               # Grafana dashboard provisioning and definitions
├── docs/                     # Architecture and reporting documentation
├── docker/                   # Docker helper files
├── k6/                       # k6 performance tests and config
│   ├── smoke/
│   ├── load/
│   ├── stress/
│   ├── spike/
│   ├── soak/
│   ├── scenarios/
│   ├── data/
│   ├── helpers/
│   ├── config/
│   └── metrics/
├── playwright/                # Playwright test projects
│   ├── restful-booker/
│   └── sauce-demo/
├── reports/                   # Generated HTML reports
├── package.json              # Root scripts and dependency management
├── Dockerfile                # Docker image for performance tests
├── docker-compose.yml        # Docker compose stack
└── README.md                 # Project guide
```

## Setup

### Prerequisites
- Node.js >= 16
- npm
- Docker
- Docker Compose
- k6 CLI

### Install dependencies

```bash
npm install
cd k6 && npm install
cd ../playwright/restful-booker && npm install
cd ../sauce-demo && npm install
```

## Running Playwright Tests

### Restful Booker API Tests

```bash
cd playwright/restful-booker
npm test
```

### Sauce Demo UI Tests

```bash
cd playwright/sauce-demo
npm test
```

### Run Playwright Tests from Root

```bash
npm run playwright:test
```

## Running k6 Performance Tests

### Smoke Test

```bash
cd k6
npm run k6:smoke
```

### Load Test

```bash
npm run k6:load
```

### Stress Test

```bash
npm run k6:stress
```

### Spike Test

```bash
npm run k6:spike
```

### Soak Test

```bash
npm run k6:soak
```

## Environment Configuration

Use the `ENV` environment variable to select configuration:

```bash
ENV=dev k6 run k6/load/load.js
ENV=staging k6 run k6/load/load.js
ENV=prod k6 run k6/load/load.js
```

A shared environment loader is available at `k6/config/environment.js`.

## Docker Stack

### Start the stack

```bash
docker compose up -d
```

### Services
- `influxdb`: Metrics storage
- `grafana`: Visualization dashboard
- `k6`: Optional test runner

### Grafana
Open `http://localhost:3000`
- Username: `admin`
- Password: `password`

### InfluxDB
Open `http://localhost:8086`
- Username: `admin`
- Password: `password`
- Database: `k6`

## GitHub Actions CI/CD

Workflow file: `.github/workflows/performance.yml`

Pipeline steps:
1. Checkout code
2. Install dependencies
3. Run Playwright API and UI tests
4. Run k6 smoke test
5. Run k6 load test
6. Validate performance gates
7. Publish reports

### Performance gates
- P95 < 500ms
- P99 < 1000ms
- Error Rate < 1%
- Check pass rate > 95%

## Observability

### Grafana
- Provisioned dashboards are stored in `dashboards/`
- Visualizes requests/sec, error rate, P95, P99, active users, and booking metrics

### InfluxDB
- k6 metrics are shipped to InfluxDB via `K6_OUT`
- Dashboards query that data for real-time monitoring

## Reports

- Playwright reports: `reports/restful-booker-report/`, `reports/sauce-demo-report/`
- k6 reports: `reports/k6-smoke.html`, `reports/k6-load.html`, `reports/k6-stress.html`, `reports/k6-spike.html`, `reports/k6-soak.html`

## Documentation

- `docs/current-state.md` - Current repository assessment
- `docs/architecture.md` - Architecture and data flow documentation
- `docs/performance-report-template.md` - Executive reporting template

## Key Files

- `k6/config/environment.js` - Environment configuration
- `k6/config/thresholds.js` - Shared thresholds
- `k6/config/performanceGates.js` - Performance gate definitions
- `k6/helpers/apiClient.js` - API abstraction layer
- `k6/data/dataGenerator.js` - Dynamic test data
- `k6/scenarios/userJourney.js` - Reusable user journeys
- `k6/metrics/customMetrics.js` - Custom k6 metrics
- `dashboards/` - Grafana provisioning and dashboards
- `.github/workflows/performance.yml` - CI/CD workflow

## Notes

- Hardcoded API URLs have been removed from k6 tests.
- Environment switching is supported and centralized.
- Custom metrics and contract validation are implemented.
- Docker stack enables observability with Grafana and InfluxDB.
