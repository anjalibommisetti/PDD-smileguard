import React from "react";
import { Settings, Save, Globe, Lock, Shield, Database, LayoutTemplate } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Configure global platform settings and preferences.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* General Settings */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" /> General Configuration
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Platform Name
              </label>
              <input
                type="text"
                defaultValue="SmileGuard AI"
                className="md:col-span-2 w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Support Email
              </label>
              <input
                type="email"
                defaultValue="support@smileguard.ai"
                className="md:col-span-2 w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Access Settings */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" /> Access & Security Defaults
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Require Email Verification
                </p>
                <p className="text-sm text-slate-500">
                  Users must verify their email before logging in.
                </p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center p-1 justify-end cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Auto-Approve Doctor Registrations
                </p>
                <p className="text-sm text-slate-500">
                  Bypass manual admin approval for new doctor accounts.
                </p>
              </div>
              <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center p-1 justify-start cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Settings */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-500" /> Prediction Endpoint
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                FastAPI Endpoint URL
              </label>
              <input
                type="text"
                defaultValue="https://smileguard-ai-backend.onrender.com"
                className="md:col-span-2 w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Risk Threshold Warning
              </label>
              <div className="md:col-span-2 flex items-center gap-4">
                <input type="range" min="0" max="100" defaultValue="75" className="flex-1" />
                <span className="font-bold text-slate-900 dark:text-white w-12 text-right">
                  75%
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 italic">
              Any prediction above the risk threshold will automatically trigger a High-Risk Alert
              to assigned doctors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
