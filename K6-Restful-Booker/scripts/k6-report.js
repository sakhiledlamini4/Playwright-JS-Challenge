import fs from 'fs';
import path from 'path';

const [summaryFile = 'summary.json', outputFile = 'summary.html'] = process.argv.slice(2);
const summaryPath = path.resolve(process.cwd(), summaryFile);

if (!fs.existsSync(summaryPath)) {
  console.error(`Summary file not found: ${summaryPath}`);
  process.exit(1);
}

const summaryRaw = fs.readFileSync(summaryPath, 'utf8');
let summary;

try {
  summary = JSON.parse(summaryRaw);
} catch (error) {
  console.error(`Failed to parse summary JSON: ${error.message}`);
  process.exit(1);
}

const metrics = summary.metrics || summary;
const checks = summary.root?.checks || summary.checks || {};
const thresholds = summary.root?.thresholds || summary.thresholds || {};

const metricRows = Object.entries(metrics)
  .map(([name, metric]) => {
    const values = metric.values || metric.value || {};
    const rows = Object.entries(values)
      .map(([key, value]) => `<tr><td>${key}</td><td>${typeof value === 'number' ? value.toFixed(2) : value}</td></tr>`)
      .join('');

    return `
      <details>
        <summary><strong>${name}</strong> (${metric.type || 'metric'})</summary>
        <table>
          <thead><tr><th>Value</th><th>Metric</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </details>
    `;
  })
  .join('\n');

const checkRows = Object.entries(checks)
  .map(([name, value]) => `<tr><td>${name}</td><td>${typeof value === 'number' ? value.toFixed(2) : value}</td></tr>`)
  .join('');

const thresholdRows = Object.entries(thresholds)
  .map(([name, value]) => {
    const display = Array.isArray(value) ? value.join(', ') : value;
    return `<tr><td>${name}</td><td>${display}</td></tr>`;
  })
  .join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>K6 Summary Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; background: #f7f7f7; color: #222; }
    h1, h2 { color: #1f4e79; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    table th, table td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
    table th { background: #eef2ff; }
    details { margin-bottom: 16px; background: #fff; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; }
    summary { font-weight: bold; cursor: pointer; }
    .section { margin-bottom: 28px; }
    .summary-table td:first-child { width: 240px; }
  </style>
</head>
<body>
  <h1>K6 Summary Report</h1>
  <p>Generated from <code>${summaryFile}</code></p>

  <section class="section">
    <h2>Checks</h2>
    <table class="summary-table">
      <thead><tr><th>Check</th><th>Value</th></tr></thead>
      <tbody>${checkRows || '<tr><td colspan="2">No checks recorded</td></tr>'}</tbody>
    </table>
  </section>

  <section class="section">
    <h2>Thresholds</h2>
    <table class="summary-table">
      <thead><tr><th>Threshold</th><th>Condition</th></tr></thead>
      <tbody>${thresholdRows || '<tr><td colspan="2">No thresholds recorded</td></tr>'}</tbody>
    </table>
  </section>

  <section class="section">
    <h2>Metrics</h2>
    ${metricRows || '<p>No metrics available</p>'}
  </section>
</body>
</html>`;

const outputPath = path.resolve(process.cwd(), outputFile);
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Generated HTML report: ${outputPath}`);
