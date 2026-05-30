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

const metrics = summary.metrics || {};
const rootGroup = summary.root_group || {};
const checks = rootGroup.checks || {};

const metricRows = Object.entries(metrics)
  .map(([name, metric]) => {
    if (!metric || typeof metric !== 'object') {
      return '';
    }

    const rows = Object.entries(metric)
      .filter(([k]) => !['thresholds', 'type'].includes(k))
      .map(([key, value]) => {
        let displayValue = value;
        if (typeof value === 'number') {
          displayValue = value.toFixed(2);
        } else if (typeof value === 'object') {
          displayValue = JSON.stringify(value);
        }
        return `<tr><td>${key}</td><td>${displayValue}</td></tr>`;
      })
      .join('');

    return rows ? `
      <details>
        <summary><strong>${name}</strong></summary>
        <table>
          <thead><tr><th>Metric</th><th>Value</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </details>
    ` : '';
  })
  .filter(row => row)
  .join('\n');

const checkRows = Object.entries(checks)
  .map(([name, check]) => {
    if (!check || typeof check !== 'object') return '';
    const passes = check.passes || 0;
    const fails = check.fails || 0;
    const total = passes + fails;
    const rate = total > 0 ? ((passes / total) * 100).toFixed(1) : '0';
    return `<tr><td>${name}</td><td>${passes}/${total} (${rate}%)</td></tr>`;
  })
  .join('');

const thresholdRows = Object.entries(metrics)
  .map(([name, metric]) => {
    if (!metric || !metric.thresholds || typeof metric.thresholds !== 'object') {
      return '';
    }
    return Object.entries(metric.thresholds)
      .map(([threshold, passed]) => `<tr><td>${name}: ${threshold}</td><td>${passed ? '✓ Pass' : '✗ Fail'}</td></tr>`)
      .join('');
  })
  .join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>K6 Summary Report</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); padding: 32px; }
    h1 { color: #1f4e79; margin-top: 0; border-bottom: 3px solid #667eea; padding-bottom: 12px; }
    h2 { color: #2d5f99; margin-top: 28px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; background: white; }
    table th, table td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
    table th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600; }
    table tr:nth-child(even) { background: #f9fafb; }
    table tr:hover { background: #eff6ff; }
    details { margin-bottom: 16px; background: #f9fafb; padding: 16px; border: 2px solid #e5e7eb; border-radius: 8px; }
    details[open] { background: #eff6ff; border-color: #667eea; }
    summary { font-weight: 600; cursor: pointer; color: #2d5f99; user-select: none; }
    summary:hover { color: #667eea; }
    .section { margin-bottom: 32px; }
    .summary-table td:first-child { width: 240px; font-weight: 500; }
    .pass { color: #10b981; }
    .fail { color: #ef4444; }
    .meta { color: #6b7280; font-size: 14px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 K6 Performance Test Report</h1>
    <p class="meta">Generated from <code>${summaryFile}</code></p>

    <section class="section">
      <h2>✓ Checks</h2>
      <table class="summary-table">
        <thead><tr><th>Check Name</th><th>Pass Rate</th></tr></thead>
        <tbody>${checkRows ? checkRows : '<tr><td colspan="2">No checks recorded</td></tr>'}</tbody>
      </table>
    </section>

    <section class="section">
      <h2>⚙️ Thresholds</h2>
      <table class="summary-table">
        <thead><tr><th>Threshold</th><th>Status</th></tr></thead>
        <tbody>${thresholdRows ? thresholdRows : '<tr><td colspan="2">No thresholds recorded</td></tr>'}</tbody>
      </table>
    </section>

    <section class="section">
      <h2>📈 Metrics</h2>
      ${metricRows ? metricRows : '<p>No metrics available</p>'}
    </section>
  </div>
</body>
</html>`;

const outputPath = path.resolve(process.cwd(), outputFile);
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Generated HTML report: ${outputPath}`);
