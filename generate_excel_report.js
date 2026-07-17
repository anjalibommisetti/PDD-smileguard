const path = require('path');
const fs = require('fs');

let exceljs;
try {
  exceljs = require('./App-PDD/node_modules/exceljs');
} catch (err) {
  console.error('❌ Error: Could not load exceljs from App-PDD/node_modules/exceljs');
  process.exit(1);
}

async function createExcelReport() {
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Load Test Results');

  // Page setup
  worksheet.views = [{ showGridLines: true }];

  // Define column widths for layout
  worksheet.columns = [
    { key: 'A', width: 4 },
    { key: 'B', width: 28 },
    { key: 'C', width: 20 },
    { key: 'D', width: 15 },
    { key: 'E', width: 20 },
    { key: 'F', width: 12 }
  ];

  // 1. Title Banner
  worksheet.mergeCells('B2:E3');
  const titleCell = worksheet.getCell('B2');
  titleCell.value = 'SMILEGUARD LOAD TEST REPORT';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E3A8A' } // Deep Navy Blue
  };

  // Border style
  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
  };

  // Section Headers helper
  function writeSectionHeader(rowNum, title) {
    worksheet.mergeCells(`B${rowNum}:E${rowNum}`);
    const cell = worksheet.getCell(`B${rowNum}`);
    cell.value = title;
    cell.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF1E3A8A' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEBF5FF' } // Very light blue
    };
    cell.alignment = { vertical: 'middle' };
    
    // Add bottom border to the section header
    for (let col = 2; col <= 5; col++) {
      worksheet.getRow(rowNum).getCell(col).border = {
        bottom: { style: 'medium', color: { argb: 'FF3B82F6' } }
      };
    }
  }

  // Row styling helper
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
            fgColor: { argb: 'FF3B82F6' } // Blue Accent
          };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
      }
    });
  }

  // --- 2. Test Configuration Section ---
  writeSectionHeader(5, '1. Test Configuration');
  
  const configHeader = worksheet.getRow(6);
  configHeader.getCell(2).value = 'Parameter';
  configHeader.getCell(3).value = 'Value';
  configHeader.getCell(4).value = 'Setting';
  configHeader.getCell(5).value = 'Status';
  styleTableRow(configHeader, true);

  const configRows = [
    ['Target URL', 'http://127.0.0.1:8000/', 'FastAPI Endpoint', 'Active'],
    ['HTTP Method', 'GET', 'Request Protocol', 'Completed'],
    ['Concurrency (VUs)', 100, 'Simulated Users', 'Active'],
    ['Duration (Target)', '60 seconds', 'Test Length', 'Completed'],
    ['Actual Duration', '60.05 seconds', 'Test Length', 'Completed'],
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

  // --- 3. Performance Summary Section ---
  writeSectionHeader(15, '2. Performance Metrics Summary');

  const summaryHeader = worksheet.getRow(16);
  summaryHeader.getCell(2).value = 'Metric';
  summaryHeader.getCell(3).value = 'Result';
  summaryHeader.getCell(4).value = 'Unit';
  summaryHeader.getCell(5).value = 'Status / Assessment';
  styleTableRow(summaryHeader, true);

  const summaryRows = [
    ['Total Requests Sent', 107384, 'requests', 'Completed'],
    ['Successful Requests (2xx)', 107384, 'requests', '100.00% Success Rate (Optimal)'],
    ['Failed Requests (non-2xx)', 0, 'requests', '0.00% Error Rate (Optimal)'],
    ['Connection Errors', 0, 'errors', '0.00% Error Rate (Optimal)'],
    ['Throughput (RPS)', 1788.24, 'req/sec', 'Excellent (High Capacity)']
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
      row.getCell(5).font = { bold: true, color: { argb: 'FF15803D' } }; // Green text
    }
    styleTableRow(row);
  });

  // --- 4. Latency Statistics Section ---
  writeSectionHeader(24, '3. Latency Statistics (Successful Requests)');

  const latencyHeader = worksheet.getRow(25);
  latencyHeader.getCell(2).value = 'Percentile / Metric';
  latencyHeader.getCell(3).value = 'Latency';
  latencyHeader.getCell(4).value = 'Unit';
  latencyHeader.getCell(5).value = 'Description';
  styleTableRow(latencyHeader, true);

  const latencyRows = [
    ['Minimum Latency', 26.5, 'ms', 'Fastest response received'],
    ['Average Latency (Mean)', 54.8, 'ms', 'Average response time'],
    ['Median Latency (p50)', 53.0, 'ms', '50% of requests completed within this time'],
    ['90th Percentile (p90)', 74.9, 'ms', '90% of requests completed within this time'],
    ['95th Percentile (p95)', 82.1, 'ms', '95% of requests completed within this time'],
    ['99th Percentile (p99)', 93.8, 'ms', '99% of requests completed within this time'],
    ['Maximum Latency', 161.5, 'ms', 'Slowest response received']
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

  // --- 5. Status Code Breakdown Section ---
  writeSectionHeader(35, '4. HTTP Response Status Code Breakdown');

  const statusHeader = worksheet.getRow(36);
  statusHeader.getCell(2).value = 'Status Code';
  statusHeader.getCell(3).value = 'Count';
  statusHeader.getCell(4).value = 'Percentage';
  statusHeader.getCell(5).value = 'Status Description';
  styleTableRow(statusHeader, true);

  const statusRows = [
    ['200 (OK)', 107384, '100.00%', 'Request succeeded and server returned payload']
  ];

  statusRows.forEach((r, idx) => {
    const row = worksheet.getRow(37 + idx);
    row.getCell(2).value = r[0];
    row.getCell(3).value = r[1];
    row.getCell(4).value = r[2];
    row.getCell(5).value = r[3];
    row.getCell(2).alignment = { horizontal: 'center' };
    row.getCell(3).alignment = { horizontal: 'right' };
    row.getCell(4).alignment = { horizontal: 'right' };
    styleTableRow(row);
  });

  // Save the report
  const excelPath = path.resolve(__dirname, 'load_test_report.xlsx');
  await workbook.xlsx.writeFile(excelPath);
  console.log(`\n✅ Excel load test report written successfully to -> ${excelPath}`);
}

createExcelReport().catch(console.error);
