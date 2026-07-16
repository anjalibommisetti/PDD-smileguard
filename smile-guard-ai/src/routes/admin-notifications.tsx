import React, { useState } from "react";
import {
  Bell,
  Search,
  Filter,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Smartphone,
} from "lucide-react";

export default function AdminNotifications() {
  const MOCK_NOTIFICATIONS = [
    {
      id: "NOT-001",
      type: "Email",
      recipient: "Dr. Sarah Smith",
      subject: "Welcome to SmileGuard",
      status: "Delivered",
      time: "2 mins ago",
    },
    {
      id: "NOT-002",
      type: "SMS",
      recipient: "+1 (555) 123-4567",
      subject: "Appointment Reminder",
      status: "Delivered",
      time: "15 mins ago",
    },
    {
      id: "NOT-003",
      type: "Push",
      recipient: "All Active Doctors",
      subject: "System Maintenance Alert",
      status: "Pending",
      time: "1 hour ago",
    },
    {
      id: "NOT-004",
      type: "Email",
      recipient: "John Doe",
      subject: "Your Assessment Results",
      status: "Failed",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Notification Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Monitor and manage platform-wide communications.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
          <Bell className="w-4 h-4" /> Send Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Sent (Today)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1,284</h3>
          </div>
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Mail className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Delivery Rate</p>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">99.8%</h3>
          </div>
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Failed Deliveries</p>
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">3</h3>
          </div>
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-900 dark:text-white">Recent Outbound Messages</h3>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Type</th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Recipient
              </th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Subject / Content
              </th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Time</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_NOTIFICATIONS.map((notif) => (
              <tr
                key={notif.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="p-4">
                  <span
                    className={`flex items-center gap-2 text-sm font-semibold ${
                      notif.type === "Email"
                        ? "text-blue-600"
                        : notif.type === "SMS"
                          ? "text-purple-600"
                          : "text-orange-600"
                    }`}
                  >
                    {notif.type === "Email" ? (
                      <Mail className="w-4 h-4" />
                    ) : notif.type === "SMS" ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : (
                      <Smartphone className="w-4 h-4" />
                    )}
                    {notif.type}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-900 dark:text-white font-medium">
                  {notif.recipient}
                </td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{notif.subject}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      notif.status === "Delivered"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : notif.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {notif.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">{notif.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
