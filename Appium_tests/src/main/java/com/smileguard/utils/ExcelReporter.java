package com.smileguard.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.File;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ExcelReporter {

    public static class TestCase {
        public String id;
        public String name;
        public String module;
        public String feature;
        public String description;
        public String status;
        public long executionTimeMs;
        public String timestamp;

        public TestCase(String id, String name, String module, String feature, String description, String status, long executionTimeMs, String timestamp) {
            this.id = id;
            this.name = name;
            this.module = module;
            this.feature = feature;
            this.description = description;
            this.status = status;
            this.executionTimeMs = executionTimeMs;
            this.timestamp = timestamp;
        }
    }

    public static void generateReport(List<TestCase> cases, String outputPath) {
        // Filter out non-PASS, duplicates, and sort
        List<TestCase> filteredCases = new ArrayList<>();
        for (TestCase tc : cases) {
            if ("PASS".equalsIgnoreCase(tc.status)) {
                // Duplicate check based on ID
                boolean isDuplicate = false;
                for (TestCase existing : filteredCases) {
                    if (existing.id.equals(tc.id)) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    filteredCases.add(tc);
                }
            }
        }

        // Sort by Module, then Feature, then Test ID
        filteredCases.sort(new Comparator<TestCase>() {
            @Override
            public int compare(TestCase o1, TestCase o2) {
                int c = o1.module.compareTo(o2.module);
                if (c != 0) return c;
                c = o1.feature.compareTo(o2.feature);
                if (c != 0) return c;
                return o1.id.compareTo(o2.id);
            }
        });

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Passed Test Cases");

        // Styling
        Font headerFont = workbook.createFont();
        headerFont.setFontName("Segoe UI");
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        // Header Row
        Row headerRow = sheet.createRow(0);
        String[] columns = {"Test ID", "Test Case Name", "Module", "Feature", "Description", "Status", "Execution Time (ms)", "Timestamp"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        // Data Rows
        Font dataFont = workbook.createFont();
        dataFont.setFontName("Segoe UI");
        dataFont.setFontHeightInPoints((short) 10);

        CellStyle passStyle = workbook.createCellStyle();
        passStyle.setFont(dataFont);
        passStyle.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
        passStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        passStyle.setAlignment(HorizontalAlignment.CENTER);

        CellStyle defaultStyle = workbook.createCellStyle();
        defaultStyle.setFont(dataFont);

        int rowNum = 1;
        for (TestCase tc : filteredCases) {
            Row row = sheet.createRow(rowNum++);
            
            Cell cell0 = row.createCell(0);
            cell0.setCellValue(tc.id);
            cell0.setCellStyle(defaultStyle);
            cell0.getCellStyle().setAlignment(HorizontalAlignment.CENTER);

            Cell cell1 = row.createCell(1);
            cell1.setCellValue(tc.name);
            cell1.setCellStyle(defaultStyle);

            Cell cell2 = row.createCell(2);
            cell2.setCellValue(tc.module);
            cell2.setCellStyle(defaultStyle);

            Cell cell3 = row.createCell(3);
            cell3.setCellValue(tc.feature);
            cell3.setCellStyle(defaultStyle);

            Cell cell4 = row.createCell(4);
            cell4.setCellValue(tc.description);
            cell4.setCellStyle(defaultStyle);

            Cell cell5 = row.createCell(5);
            cell5.setCellValue(tc.status);
            cell5.setCellStyle(passStyle);

            Cell cell6 = row.createCell(6);
            cell6.setCellValue(tc.executionTimeMs);
            cell6.setCellStyle(defaultStyle);
            cell6.getCellStyle().setAlignment(HorizontalAlignment.RIGHT);

            Cell cell7 = row.createCell(7);
            cell7.setCellValue(tc.timestamp);
            cell7.setCellStyle(defaultStyle);
            cell7.getCellStyle().setAlignment(HorizontalAlignment.CENTER);
        }

        // Auto-fit columns
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Ensure output path directory exists
        File file = new File(outputPath);
        File parentDir = file.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }

        try (FileOutputStream fileOut = new FileOutputStream(outputPath)) {
            workbook.write(fileOut);
            System.out.println("✅ Appium report Excel successfully generated at: " + outputPath);
        } catch (IOException e) {
            System.err.println("❌ Failed to write Excel report: " + e.getMessage());
        } finally {
            try {
                workbook.close();
            } catch (IOException e) {
                // ignore
            }
        }
    }
}
