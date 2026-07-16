import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Activity,
  CheckCircle,
  LogOut,
  Menu,
  Search,
  Bell,
  Database,
  Lock,
  BarChart2,
  Settings,
  UserPlus,
  UserCheck,
  UserX,
  FileText,
} from "lucide-react";
import { useNavigation } from "@react-navigation/native";
import { Platform, View, ScrollView } from "react-native";
import { supabase } from "../lib/supabase";
import AnalyticsDashboard from "./analytics";
import AdminMonitoring from "./admin-monitoring";
import AdminSecurity from "./admin-security";
import AdminReports from "./admin-reports";
import AdminNotifications from "./admin-notifications";
import AdminSettings from "./admin-settings";

export default function AdminPortal() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("Admin");
  const [initials, setInitials] = useState("AD");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        let name =
          session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Admin";
        setUserName(name);
        const init = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        setInitials(init);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const TABS = [
    { id: "Dashboard", icon: Activity, label: "Dashboard" },
    { id: "ManageUsers", icon: Users, label: "Manage Users" },
    { id: "ManageDoctors", icon: UserCheck, label: "Manage Doctors" },
    { id: "Analytics", icon: BarChart2, label: "Platform Analytics" },
    { id: "Reports", icon: FileText, label: "Reports" },
    { id: "Monitoring", icon: Database, label: "Database Monitoring" },
    { id: "Security", icon: Lock, label: "Security Management" },
    { id: "Notifications", icon: Bell, label: "Notifications" },
    { id: "ActivityLogs", icon: Activity, label: "Activity Logs" },
    { id: "Settings", icon: Settings, label: "System Settings" },
  ];

  const MOCK_USERS = [
    { id: "1", name: "Dr. Sarah Smith", role: "Doctor", status: "Active", joined: "May 10, 2026" },
    { id: "2", name: "Emily Chen", role: "Patient", status: "Active", joined: "May 12, 2026" },
    {
      id: "3",
      name: "Dr. Michael Jones",
      role: "Doctor",
      status: "Pending Approval",
      joined: "May 14, 2026",
    },
    { id: "4", name: "John Doe", role: "Patient", status: "Active", joined: "May 15, 2026" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <div className="w-full flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="bg-purple-600 p-1.5 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  Admin Portal
                </span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <tab.icon
                    className={`w-5 h-5 ${isActive ? "text-purple-600" : "text-slate-400"}`}
                  />
                  {sidebarOpen && <span>{tab.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-start gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="font-semibold">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Navbar */}
          <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md w-full hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users, logs, or reports..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full border border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-slate-500">Superuser</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold uppercase">
                  {initials}
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic View Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === "Dashboard" && (
              <div className="space-y-6 w-full max-w-[1600px] mx-auto pb-10">
                {/* Enterprise Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      Enterprise Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                      System metrics, security, and platform analytics.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 border border-purple-500/30 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm shadow-purple-900/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-sm font-medium text-purple-100">System Online</span>
                    </div>
                  </div>
                </div>

                {/* Dark Purple Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Total Users",
                      value: "24,892",
                      icon: Users,
                      color: "text-purple-400",
                      bg: "bg-purple-900/30",
                    },
                    {
                      label: "Active Doctors",
                      value: "450",
                      icon: UserCheck,
                      color: "text-blue-400",
                      bg: "bg-blue-900/30",
                    },
                    {
                      label: "Total Predictions",
                      value: "148,291",
                      icon: Activity,
                      color: "text-pink-400",
                      bg: "bg-pink-900/30",
                    },
                    {
                      label: "System Health",
                      value: "99.99%",
                      icon: CheckCircle,
                      color: "text-emerald-400",
                      bg: "bg-emerald-900/30",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform"></div>
                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">
                            {stat.label}
                          </p>
                          <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl border border-slate-700/50 ${stat.bg}`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                  {/* Server load / Analytics fake chart */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-purple-400" /> Platform Analytics & Server
                      Load
                    </h3>
                    <div className="h-64 flex items-end gap-2 justify-between px-4">
                      {/* Generates a fake bar chart */}
                      {[40, 70, 45, 90, 65, 85, 40, 55, 75, 50, 80, 60].map((h, i) => (
                        <div
                          key={i}
                          className="w-full bg-purple-900/20 rounded-t-sm relative group"
                        >
                          <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm transition-all duration-1000 group-hover:opacity-80"
                            style={{ height: `${h}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500 px-4">
                      <span>12 AM</span>
                      <span>4 AM</span>
                      <span>8 AM</span>
                      <span>12 PM</span>
                      <span>4 PM</span>
                      <span>8 PM</span>
                    </div>
                  </div>

                  {/* Database Health & Security */}
                  <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-400" /> Database Monitoring
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                          <span className="text-sm text-slate-300 font-medium">
                            PostgreSQL Cluster
                          </span>
                          <span className="text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded text-xs font-bold border border-emerald-800/50">
                            Optimal
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                          <span className="text-sm text-slate-300 font-medium">
                            Supabase Auth Node
                          </span>
                          <span className="text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded text-xs font-bold border border-emerald-800/50">
                            Optimal
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                          <span className="text-sm text-slate-300 font-medium">
                            AI Endpoint (Render)
                          </span>
                          <span className="text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded text-xs font-bold border border-emerald-800/50">
                            Optimal
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-amber-400" /> Security Management
                      </h3>
                      <div className="p-4 bg-amber-900/10 border border-amber-900/30 rounded-xl flex gap-3">
                        <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-amber-400">Zero Threats Detected</p>
                          <p className="text-xs text-slate-400 mt-1">
                            All encryption protocols are active. Firewall blocking 14 unauthorized
                            attempts/hr.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Log Table */}
                <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-pink-400" /> Live Activity Logs
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            User / IP
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {[
                          {
                            time: "Just now",
                            event: "Admin Login Successful",
                            user: "Admin (192.168.1.1)",
                            status: "Success",
                            color: "emerald",
                          },
                          {
                            time: "2 mins ago",
                            event: "New Patient Registered",
                            user: "prathyusha@demo.com",
                            status: "Success",
                            color: "emerald",
                          },
                          {
                            time: "15 mins ago",
                            event: "AI Prediction Generated",
                            user: "System",
                            status: "Success",
                            color: "emerald",
                          },
                          {
                            time: "1 hour ago",
                            event: "Failed Login Attempt",
                            user: "Unknown (104.28.x.x)",
                            status: "Blocked",
                            color: "red",
                          },
                        ].map((log, i) => (
                          <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {log.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-300">
                              {log.event}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                              {log.user}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs font-semibold rounded-md border border-${log.color}-800/50 bg-${log.color}-900/20 text-${log.color}-400`}
                              >
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === "ManageUsers" || activeTab === "ManageDoctors") && (
              <div className="space-y-6 w-full max-w-[1600px] mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {activeTab === "ManageUsers" ? "Manage Users" : "Manage Doctors"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                      Manage {activeTab === "ManageUsers" ? "Patients" : "Doctors"} and Access
                      Controls.
                    </p>
                  </div>
                  <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700">
                    <UserPlus className="w-4 h-4" /> Add User
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          Name
                        </th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          Role
                        </th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          Joined
                        </th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          Status
                        </th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_USERS.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="p-4 text-slate-900 dark:text-white font-medium">
                            {user.name}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                user.role === "Doctor"
                                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                            {user.joined}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                user.status === "Active"
                                  ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {user.status === "Pending Approval" ? (
                              <div className="flex gap-2">
                                <button className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100">
                                  <UserCheck className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100">
                                  <UserX className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button className="text-purple-600 text-sm font-semibold hover:underline">
                                Edit Access
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "Analytics" && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden w-full h-[800px]">
                <AnalyticsDashboard />
              </div>
            )}

            {activeTab === "Monitoring" && <AdminMonitoring />}
            {activeTab === "ActivityLogs" && <AdminMonitoring />}
            {activeTab === "Security" && <AdminSecurity />}
            {activeTab === "Reports" && <AdminReports />}
            {activeTab === "Notifications" && <AdminNotifications />}
            {activeTab === "Settings" && <AdminSettings />}
          </div>
        </main>
      </div>
    </View>
  );
}
