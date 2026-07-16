import React from "react";
import { FileText, Download, Filter, Search, Calendar, CheckCircle } from "lucide-react";

export default function AdminReports() {
  const MOCK_REPORTS = [
    {
      id: "REP-001",
      type: "Platform Usage",
      generated: "May 16, 2026",
      format: "PDF",
      status: "Ready",
      size: "2.4 MB",
    },
    {
      id: "REP-002",
      type: "Doctor Performance Analytics",
      generated: "May 15, 2026",
      format: "CSV",
      status: "Ready",
      size: "1.1 MB",
    },
    {
      id: "REP-003",
      type: "Monthly Patient Diagnoses",
      generated: "May 14, 2026",
      format: "PDF",
      status: "Ready",
      size: "4.8 MB",
    },
    {
      id: "REP-004",
      type: "Security & Audit Logs",
      generated: "May 10, 2026",
      format: "CSV",
      status: "Archived",
      size: "12.5 MB",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports Monitoring</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Generate, view, and download platform-wide analytics reports.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
          <FileText className="w-4 h-4" /> Generate New Report
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Report ID & Type
              </th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Generated Date
              </th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Format
              </th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REPORTS.map((report) => (
              <tr
                key={report.id}
                className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="p-4">
                  <p className="font-bold text-slate-900 dark:text-white">{report.type}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">{report.id}</p>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> {report.generated}
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                    {report.format} • {report.size}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`flex items-center gap-1 text-sm font-semibold ${report.status === "Ready" ? "text-green-600" : "text-slate-500"}`}
                  >
                    {report.status === "Ready" && <CheckCircle className="w-4 h-4" />}{" "}
                    {report.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="flex items-center gap-2 justify-end ml-auto text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
