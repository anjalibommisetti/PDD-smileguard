import React from "react";
import { View } from "react-native";
import { ShieldAlert, Key, Lock, Users, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminSecurity() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Security Management</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage access controls, API keys, and threat detection.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700">
          <ShieldAlert className="w-4 h-4" /> Trigger Lockdown
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* API Keys */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-500" /> API Access Keys
              </h3>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Generate New Key
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "Production Frontend Key",
                  prefix: "pk_live_...",
                  created: "Jan 12, 2026",
                  status: "Active",
                },
                {
                  name: "Python Backend Access",
                  prefix: "sk_live_...",
                  created: "Jan 12, 2026",
                  status: "Active",
                },
                {
                  name: "Development Server",
                  prefix: "pk_test_...",
                  created: "Mar 05, 2026",
                  status: "Active",
                },
                {
                  name: "Legacy Mobile App",
                  prefix: "pk_old_...",
                  created: "Nov 22, 2025",
                  status: "Revoked",
                },
              ].map((key, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 dark:border-slate-800 rounded-lg"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{key.name}</h4>
                    <p className="font-mono text-sm text-slate-500 mt-1">
                      {key.prefix} <Eye className="w-3 h-3 inline ml-1 cursor-pointer" />
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center gap-4">
                    <span className="text-xs text-slate-400">Created {key.created}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        key.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {key.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-500" /> Platform Security Policies
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-lg">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    Enforce Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-sm text-slate-500">
                    Require 2FA for all Doctor and Admin accounts.
                  </p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center p-1 justify-end cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-lg">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    Session Timeout
                  </h4>
                  <p className="text-sm text-slate-500">
                    Automatically log out inactive users after 30 minutes.
                  </p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center p-1 justify-end cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Detection */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm sticky top-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> Threat Detection
            </h3>

            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900 dark:text-green-100">System Secure</h4>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  No active threats detected in the last 24 hours.
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
              Recent Blocks
            </h4>
            <div className="space-y-3">
              {[
                { ip: "192.168.1.1", reason: "Multiple failed logins", time: "2 hrs ago" },
                { ip: "45.22.19.10", reason: "Rate limit exceeded", time: "5 hrs ago" },
                { ip: "Unknown", reason: "Invalid JWT Signature", time: "1 day ago" },
              ].map((threat, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
                      {threat.ip}
                    </span>
                    <span className="text-xs text-slate-400">{threat.time}</span>
                  </div>
                  <p className="text-xs text-red-500">{threat.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
