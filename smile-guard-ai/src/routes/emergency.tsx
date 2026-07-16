import React from "react";
import { View } from "react-native";
import { ShieldAlert, AlertTriangle, PhoneCall, ArrowRight, CheckCircle2 } from "lucide-react";

export default function EmergencyModule() {
  const alerts = [
    {
      id: 1,
      patient: "Prathyusha",
      issue: "Severe pain in lower right jaw",
      severity: "Critical",
      time: "10 mins ago",
      status: "Unresolved",
    },
    {
      id: 2,
      patient: "Michael Brown",
      issue: "Bleeding after extraction",
      severity: "High",
      time: "45 mins ago",
      status: "In Progress",
    },
    {
      id: 3,
      patient: "Emily Davis",
      issue: "Broken crown",
      severity: "Medium",
      time: "2 hours ago",
      status: "Resolved",
    },
  ];

  return (
    <div className="p-8 h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-500" /> Emergency Alerts
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            High-priority patient issues requiring immediate action.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="font-bold text-red-900 dark:text-red-100">Critical Alerts</h3>
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">1</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="font-bold text-orange-900 dark:text-orange-100">Action Required</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">2</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-bold text-green-900 dark:text-green-100">Resolved Today</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">1</p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white dark:bg-slate-900 p-6 rounded-xl border-l-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              alert.severity === "Critical"
                ? "border-l-red-500 border-t border-r border-b border-slate-200 dark:border-slate-800"
                : alert.severity === "High"
                  ? "border-l-orange-500 border-t border-r border-b border-slate-200 dark:border-slate-800"
                  : "border-l-green-500 border-t border-r border-b border-slate-200 dark:border-slate-800 opacity-70"
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-lg">{alert.patient}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    alert.severity === "Critical"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                      : alert.severity === "High"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="text-xs text-slate-400">{alert.time}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Issue: {alert.issue}</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              {alert.status !== "Resolved" && (
                <>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                    <PhoneCall className="w-4 h-4" /> Call Patient
                  </button>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                    Review <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
              {alert.status === "Resolved" && (
                <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold px-4 py-2">
                  <CheckCircle2 className="w-5 h-5" /> Resolved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
