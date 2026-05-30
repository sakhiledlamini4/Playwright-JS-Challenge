import path from 'path';
import { generateSummaryReport } from 'k6-html-reporter';

const [summaryFile = 'summary.json', outputDir = 'k6-report'] = process.argv.slice(2);
const summaryPath = path.resolve(process.cwd(), summaryFile);
const outputPath = path.resolve(process.cwd(), outputDir);

generateSummaryReport({ jsonFile: summaryPath, output: outputPath });
console.log(`Generated K6 report at ${outputPath}/report.html`);
