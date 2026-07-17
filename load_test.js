const http = require('http');
const fs = require('fs');
const path = require('path');

// --- Configuration Parsing ---
const args = process.argv.slice(2);
const mode = args.includes('--predict') ? 'predict' : 'get';
const concurrency = parseInt(args.find(a => a.startsWith('--concurrency='))?.split('=')[1] || '100', 10);
const duration = parseInt(args.find(a => a.startsWith('--duration='))?.split('=')[1] || '60', 10);
const urlStr = args.find(a => a.startsWith('--url='))?.split('=')[1] || 'http://127.0.0.1:8000';

const parsedUrl = new URL(urlStr);
const host = parsedUrl.hostname;
const port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? '443' : '80');
const pathName = parsedUrl.pathname;

// --- HTTP Agent Config ---
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: concurrency * 2,
  keepAliveMsecs: 1000,
});

let bodyBuffer = null;
let headers = {};

if (mode === 'predict') {
  // Path to sample image in PDD-Backend
  const samplePath = path.resolve(__dirname, 'PDD-Backend', 'sample.jpg');
  if (!fs.existsSync(samplePath)) {
    console.error(`❌ Error: Sample image not found at ${samplePath}`);
    process.exit(1);
  }
  const fileBuffer = fs.readFileSync(samplePath);
  const boundary = '----WebKitFormBoundaryBenchmark';
  const header = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="sample.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`;
  const footer = `\r\n--${boundary}--\r\n`;
  bodyBuffer = Buffer.concat([
    Buffer.from(header, 'utf-8'),
    fileBuffer,
    Buffer.from(footer, 'utf-8')
  ]);
  headers = {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': bodyBuffer.length
  };
}

// --- Metrics ---
let totalRequests = 0;
let successRequests = 0;
let failedRequests = 0;
const latencies = [];
const statusCodes = {};
let errorCount = 0;
const errors = {};

let running = true;
let activeVUs = 0;
const testStartTime = Date.now();
const testEndTime = testStartTime + duration * 1000;

console.log(`==================================================`);
console.log(`🚀 SMILEGUARD SYSTEM LOAD TEST BENCHMARK`);
console.log(`==================================================`);
console.log(`Target URL:      ${urlStr}${mode === 'predict' ? '/predict' : pathName}`);
console.log(`Mode:            ${mode.toUpperCase()}`);
console.log(`Concurrency:     ${concurrency} Virtual Users`);
console.log(`Duration:        ${duration} seconds`);
console.log(`Keep-Alive:      Enabled`);
console.log(`==================================================\n`);

// Progress monitor
const progressInterval = setInterval(() => {
  const elapsedSec = ((Date.now() - testStartTime) / 1000).toFixed(1);
  const currentRps = (totalRequests / elapsedSec).toFixed(1);
  const avgLat = latencies.length > 0 
    ? (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1) 
    : '0';
  console.log(`[Progress] Elapsed: ${elapsedSec}s | Req: ${totalRequests} | RPS: ${currentRps} | Avg Latency: ${avgLat}ms`);
}, 5000);

// Schedule test end
setTimeout(() => {
  running = false;
  console.log('\nStopping load test and gathering results...');
}, duration * 1000);

// Start VUs
for (let i = 0; i < concurrency; i++) {
  activeVUs++;
  setImmediate(runVU);
}

function runVU() {
  if (!running) {
    activeVUs--;
    if (activeVUs === 0) {
      endTest();
    }
    return;
  }

  const startTime = process.hrtime();
  
  const options = {
    hostname: host,
    port: port,
    path: mode === 'predict' ? '/predict' : pathName,
    method: mode === 'predict' ? 'POST' : 'GET',
    headers: {
      ...headers,
      'Connection': 'keep-alive',
      'User-Agent': 'SmileGuardBenchmark/1.0'
    },
    agent: agent,
    timeout: 15000 // 15 seconds timeout
  };

  const req = http.request(options, (res) => {
    res.on('data', () => {}); // Consume body

    res.on('end', () => {
      const diff = process.hrtime(startTime);
      const latencyMs = diff[0] * 1000 + diff[1] / 1000000;
      
      totalRequests++;
      statusCodes[res.statusCode] = (statusCodes[res.statusCode] || 0) + 1;
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        successRequests++;
        latencies.push(latencyMs);
      } else {
        failedRequests++;
      }
      
      setImmediate(runVU);
    });
  });

  req.on('error', (err) => {
    const diff = process.hrtime(startTime);
    const latencyMs = diff[0] * 1000 + diff[1] / 1000000;
    
    totalRequests++;
    failedRequests++;
    errorCount++;
    errors[err.message] = (errors[err.message] || 0) + 1;
    
    setImmediate(runVU);
  });

  req.on('timeout', () => {
    req.destroy(new Error('Connection Timeout'));
  });

  if (bodyBuffer) {
    req.write(bodyBuffer);
  }
  req.end();
}

function endTest() {
  clearInterval(progressInterval);
  const totalTimeMs = Date.now() - testStartTime;
  const totalTimeSec = totalTimeMs / 1000;
  const rps = (totalRequests / totalTimeSec).toFixed(2);

  // Latency math
  latencies.sort((a, b) => a - b);
  const min = latencies.length > 0 ? latencies[0] : 0;
  const max = latencies.length > 0 ? latencies[latencies.length - 1] : 0;
  const sum = latencies.reduce((a, b) => a + b, 0);
  const avg = latencies.length > 0 ? sum / latencies.length : 0;

  const p50 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.50)] : 0;
  const p90 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.90)] : 0;
  const p95 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] : 0;
  const p99 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.99)] : 0;

  // Print results
  console.log(`\n==================================================`);
  console.log(`📊 BENCHMARK COMPLETE`);
  console.log(`==================================================`);
  console.log(`Total Requests:    ${totalRequests}`);
  console.log(`Successful:        ${successRequests}`);
  console.log(`Failed:            ${failedRequests} (Errors: ${errorCount})`);
  console.log(`Elapsed Time:      ${totalTimeSec.toFixed(2)}s`);
  console.log(`Requests/Sec:      ${rps} req/sec`);
  console.log(`--------------------------------------------------`);
  console.log(`Latency Statistics (Successful Requests):`);
  console.log(`  Min:             ${min.toFixed(1)}ms`);
  console.log(`  Average:         ${avg.toFixed(1)}ms`);
  console.log(`  Median (p50):    ${p50.toFixed(1)}ms`);
  console.log(`  90th Percentile: ${p90.toFixed(1)}ms`);
  console.log(`  95th Percentile: ${p95.toFixed(1)}ms`);
  console.log(`  99th Percentile: ${p99.toFixed(1)}ms`);
  console.log(`  Max:             ${max.toFixed(1)}ms`);
  console.log(`==================================================`);

  if (Object.keys(statusCodes).length > 0) {
    console.log(`\nHTTP Status Codes:`);
    for (const [code, count] of Object.entries(statusCodes)) {
      console.log(`  ${code}: ${count}`);
    }
  }

  if (Object.keys(errors).length > 0) {
    console.log(`\nError Details:`);
    for (const [msg, count] of Object.entries(errors)) {
      console.log(`  "${msg}": ${count}`);
    }
  }

  // Generate markdown report
  const report = `# SmileGuard Load Test Report

## Test Configuration
- **Target URL**: \`${urlStr}${mode === 'predict' ? '/predict' : pathName}\`
- **Method**: \`${mode === 'predict' ? 'POST' : 'GET'}\`
- **Concurrency (VUs)**: ${concurrency}
- **Target Duration**: ${duration}s
- **Actual Duration**: ${totalTimeSec.toFixed(2)}s
- **Keep-Alive**: Enabled

## Performance Summary
| Metric | Value |
| :--- | :--- |
| **Total Requests** | ${totalRequests} |
| **Successful Requests** | ${successRequests} |
| **Failed Requests** | ${failedRequests} |
| **Connection Errors** | ${errorCount} |
| **Throughput (RPS)** | **${rps} req/sec** |

## Latency Statistics (Successful Requests)
| Percentile / Metric | Latency |
| :--- | :--- |
| **Minimum** | ${min.toFixed(1)}ms |
| **Average (Mean)** | **${avg.toFixed(1)}ms** |
| **Median (p50)** | ${p50.toFixed(1)}ms |
| **90th Percentile (p90)** | ${p90.toFixed(1)}ms |
| **95th Percentile (p95)** | ${p95.toFixed(1)}ms |
| **99th Percentile (p99)** | ${p99.toFixed(1)}ms |
| **Maximum** | ${max.toFixed(1)}ms |

## Response Status Code Breakdown
| Status Code | Count | Percentage |
| :--- | :--- | :--- |
${Object.entries(statusCodes).map(([code, count]) => `| ${code} | ${count} | ${((count / totalRequests) * 100).toFixed(2)}% |`).join('\n')}

${Object.keys(errors).length > 0 ? `## Connection / Network Errors
| Error Message | Count |
| :--- | :--- |
${Object.entries(errors).map(([msg, count]) => `| "${msg}" | ${count} |`).join('\n')}
` : ''}
`;

  const reportPath = path.resolve(__dirname, 'load_test_report.md');
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\nSaved detailed report to ${reportPath}\n`);

  // Write Excel Report dynamically
  try {
    const exceljs = require('./App-PDD/node_modules/exceljs');
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Load Test Results');
    worksheet.views = [{ showGridLines: true }];
    
    worksheet.columns = [
      { key: 'A', width: 4 },
      { key: 'B', width: 28 },
      { key: 'C', width: 20 },
      { key: 'D', width: 15 },
      { key: 'E', width: 20 }
    ];

    // Title
    worksheet.mergeCells('B2:E3');
    const titleCell = worksheet.getCell('B2');
    titleCell.value = 'SMILEGUARD LOAD TEST REPORT';
    titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A8A' }
    };

    const thinBorder = {
      top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
    };

    function writeSectionHeader(rowNum, title) {
      worksheet.mergeCells(`B${rowNum}:E${rowNum}`);
      const cell = worksheet.getCell(`B${rowNum}`);
      cell.value = title;
      cell.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF1E3A8A' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEBF5FF' }
      };
      cell.alignment = { vertical: 'middle' };
      for (let col = 2; col <= 5; col++) {
        worksheet.getRow(rowNum).getCell(col).border = {
          bottom: { style: 'medium', color: { argb: 'FF3B82F6' } }
        };
      }
    }

    function styleTableRow(row, isHeader = false) {
      row.eachCell((cell, colNumber) => {
        if (colNumber >= 2 && colNumber <= 5) {
          cell.border = thinBorder;
          cell.font = {
            name: 'Segoe UI',
            size: 10,
            bold: isHeader ? true : cell.font?.bold || false,
            color: isHeader ? { argb: 'FFFFFFFF' } : undefined
          };
          if (isHeader) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF3B82F6' }
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
        }
      });
    }

    // Config Section
    writeSectionHeader(5, '1. Test Configuration');
    const configHeader = worksheet.getRow(6);
    configHeader.getCell(2).value = 'Parameter';
    configHeader.getCell(3).value = 'Value';
    configHeader.getCell(4).value = 'Setting';
    configHeader.getCell(5).value = 'Status';
    styleTableRow(configHeader, true);

    const configRows = [
      ['Target URL', `${urlStr}${mode === 'predict' ? '/predict' : pathName}`, 'API Endpoint', 'Active'],
      ['HTTP Method', mode === 'predict' ? 'POST' : 'GET', 'Request Protocol', 'Completed'],
      ['Concurrency (VUs)', concurrency, 'Simulated Users', 'Active'],
      ['Duration (Target)', `${duration} seconds`, 'Test Length', 'Completed'],
      ['Actual Duration', `${totalTimeSec.toFixed(2)} seconds`, 'Test Length', 'Completed'],
      ['Connection Mode', 'Keep-Alive', 'Socket Config', 'Optimal']
    ];

    configRows.forEach((r, idx) => {
      const row = worksheet.getRow(7 + idx);
      row.getCell(2).value = r[0];
      row.getCell(3).value = r[1];
      row.getCell(4).value = r[2];
      row.getCell(5).value = r[3];
      row.getCell(5).alignment = { horizontal: 'center' };
      if (typeof r[1] === 'number') row.getCell(3).alignment = { horizontal: 'right' };
      styleTableRow(row);
    });

    // Summary Section
    writeSectionHeader(15, '2. Performance Metrics Summary');
    const summaryHeader = worksheet.getRow(16);
    summaryHeader.getCell(2).value = 'Metric';
    summaryHeader.getCell(3).value = 'Result';
    summaryHeader.getCell(4).value = 'Unit';
    summaryHeader.getCell(5).value = 'Status / Assessment';
    styleTableRow(summaryHeader, true);

    const summaryRows = [
      ['Total Requests Sent', totalRequests, 'requests', 'Completed'],
      ['Successful Requests (2xx)', successRequests, 'requests', `${((successRequests/totalRequests)*100).toFixed(2)}% Success Rate`],
      ['Failed Requests (non-2xx)', failedRequests, 'requests', failedRequests === 0 ? 'Optimal (0% errors)' : 'Action Required'],
      ['Connection Errors', errorCount, 'errors', errorCount === 0 ? 'Optimal (0% errors)' : 'Action Required'],
      ['Throughput (RPS)', parseFloat(rps), 'req/sec', 'Completed']
    ];

    summaryRows.forEach((r, idx) => {
      const row = worksheet.getRow(17 + idx);
      row.getCell(2).value = r[0];
      row.getCell(2).font = { bold: r[0] === 'Throughput (RPS)' };
      row.getCell(3).value = r[1];
      row.getCell(3).font = { bold: r[0] === 'Throughput (RPS)' };
      row.getCell(4).value = r[2];
      row.getCell(5).value = r[3];
      row.getCell(3).alignment = { horizontal: 'right' };
      if (r[0] === 'Successful Requests (2xx)' || r[0] === 'Throughput (RPS)') {
        row.getCell(5).font = { bold: true, color: { argb: 'FF15803D' } };
      }
      styleTableRow(row);
    });

    // Latency Section
    writeSectionHeader(24, '3. Latency Statistics (Successful Requests)');
    const latencyHeader = worksheet.getRow(25);
    latencyHeader.getCell(2).value = 'Percentile / Metric';
    latencyHeader.getCell(3).value = 'Latency';
    latencyHeader.getCell(4).value = 'Unit';
    latencyHeader.getCell(5).value = 'Description';
    styleTableRow(latencyHeader, true);

    const latencyRows = [
      ['Minimum Latency', parseFloat(min.toFixed(1)), 'ms', 'Fastest response received'],
      ['Average Latency (Mean)', parseFloat(avg.toFixed(1)), 'ms', 'Average response time'],
      ['Median Latency (p50)', parseFloat(p50.toFixed(1)), 'ms', '50% of requests completed within this time'],
      ['90th Percentile (p90)', parseFloat(p90.toFixed(1)), 'ms', '90% of requests completed within this time'],
      ['95th Percentile (p95)', parseFloat(p95.toFixed(1)), 'ms', '95% of requests completed within this time'],
      ['99th Percentile (p99)', parseFloat(p99.toFixed(1)), 'ms', '99% of requests completed within this time'],
      ['Maximum Latency', parseFloat(max.toFixed(1)), 'ms', 'Slowest response received']
    ];

    latencyRows.forEach((r, idx) => {
      const row = worksheet.getRow(26 + idx);
      row.getCell(2).value = r[0];
      row.getCell(2).font = { bold: r[0] === 'Average Latency (Mean)' };
      row.getCell(3).value = r[1];
      row.getCell(3).font = { bold: r[0] === 'Average Latency (Mean)' };
      row.getCell(4).value = r[2];
      row.getCell(5).value = r[3];
      row.getCell(3).alignment = { horizontal: 'right' };
      styleTableRow(row);
    });

    // Status Section
    writeSectionHeader(35, '4. HTTP Response Status Code Breakdown');
    const statusHeader = worksheet.getRow(36);
    statusHeader.getCell(2).value = 'Status Code';
    statusHeader.getCell(3).value = 'Count';
    statusHeader.getCell(4).value = 'Percentage';
    statusHeader.getCell(5).value = 'Status Description';
    styleTableRow(statusHeader, true);

    let statusOffset = 0;
    for (const [code, count] of Object.entries(statusCodes)) {
      const row = worksheet.getRow(37 + statusOffset);
      row.getCell(2).value = code;
      row.getCell(3).value = count;
      row.getCell(4).value = `${((count / totalRequests) * 100).toFixed(2)}%`;
      row.getCell(5).value = code === '200' ? 'Request succeeded' : 'Unsuccessful response';
      row.getCell(2).alignment = { horizontal: 'center' };
      row.getCell(3).alignment = { horizontal: 'right' };
      row.getCell(4).alignment = { horizontal: 'right' };
      styleTableRow(row);
      statusOffset++;
    }

    const excelPath = path.resolve(__dirname, 'load_test_report.xlsx');
    workbook.xlsx.writeFile(excelPath).then(() => {
      console.log(`Saved styled Excel report to ${excelPath}\n`);
    });
  } catch (err) {
    console.warn(`\n⚠️ Note: Could not generate Excel report (${err.message}). Check exceljs availability.`);
  }
}
