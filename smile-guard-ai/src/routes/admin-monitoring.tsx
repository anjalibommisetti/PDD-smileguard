import React from "react";
import { View } from "react-native";
import { Activity, Database, Server, Cpu, Clock, AlertTriangle, HardDrive } from "lucide-react";

export default function AdminMonitoring() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Monitoring</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Real-time health tracking and database monitoring.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
          <Activity className="w-4 h-4" /> Run Diagnostics
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "System Uptime",
            value: "99.98%",
            icon: Clock,
            color: "text-emerald-500",
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
          },
          {
            label: "Server Load",
            value: "24%",
            icon: Cpu,
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-900/30",
          },
          {
            label: "Storage Used",
            value: "45 GB",
            icon: HardDrive,
            color: "text-purple-500",
            bg: "bg-purple-100 dark:bg-purple-900/30",
          },
          {
            label: "Active Connections",
            value: "1,240",
            icon: Server,
            color: "text-orange-500",
            bg: "bg-orange-100 dark:bg-orange-900/30",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Database Health */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" /> Database Monitoring
          </h3>
          <div className="space-y-4">
            {[
              {
                name: "PostgreSQL Master Database",
                status: "Healthy",
                ping: "12ms",
                storage: "32% full",
              },
              { name: "Supabase Auth Service", status: "Healthy", ping: "45ms", storage: "N/A" },
              {
                name: "Image Storage Bucket",
                status: "Healthy",
                ping: "28ms",
                storage: "68% full",
              },
              {
                name: "Python AI Endpoint (Render)",
                status: "Warning",
                ping: "140ms",
                storage: "Cold Start Detected",
              },
            ].map((db, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-semibold text-slate-900 dark:text-white">{db.name}</p>
                  <p className="text-xs text-slate-500">
                    Latency: {db.ping} • {db.storage}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    db.status === "Healthy"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {db.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" /> Recent Activity Logs
          </h3>
          <div className="space-y-4 h-[300px] overflow-y-auto pr-2">
            {[
              { log: "Admin authenticated successfully", time: "2 mins ago", type: "info" },
              { log: "New patient registered (Prathyusha)", time: "15 mins ago", type: "info" },
              {
                log: "Failed login attempt from IP 192.168.1.1",
                time: "1 hour ago",
                type: "warning",
              },
              { log: "Database backup completed", time: "3 hours ago", type: "success" },
              {
                log: "API Rate limit approaching for /predict endpoint",
                time: "5 hours ago",
                type: "warning",
              },
              { log: "System updated to v2.1.0", time: "1 day ago", type: "info" },
            ].map((log, i) => (
              <div
                key={i}
                className="flex gap-4 p-3 rounded-lg border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30"
              >
                <div className="mt-0.5">
                  {log.type === "info" && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  {log.type === "warning" && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
                  {log.type === "success" && <div className="w-2 h-2 rounded-full bg-green-500" />}
                </div>
                <div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {log.log}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
