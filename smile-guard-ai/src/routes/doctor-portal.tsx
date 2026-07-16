import React, { useState, useEffect } from "react";
import { Pressable, Text, View, Platform } from "react-native";
import {
  Users,
  Activity,
  Calendar,
  FileText,
  Settings,
  Bell,
  MessageSquare,
  ShieldAlert,
  Search,
  LogOut,
  Menu,
} from "lucide-react";
import { useNavigation } from "@react-navigation/native";

import DoctorDashboard from "./doctor-dashboard";
import AnalyticsDashboard from "./analytics";
import ProfileScreen from "./profile";
import PatientsModule from "./patients";
import AppointmentsModule from "./appointments";
import CommunicationModule from "./communication";
import EmergencyModule from "./emergency";
import ChatbotScreen from "./chatbot";
import { supabase } from "../lib/supabase";

export default function DoctorPortal() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("Doctor");
  const [initials, setInitials] = useState("DR");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        let name =
          session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Doctor";
        // Ensure name includes Dr. prefix for display
        if (!name.toLowerCase().startsWith("dr.") && !name.toLowerCase().startsWith("dr ")) {
          name = `Dr. ${name}`;
        }
        setUserName(name);
        const init = name
          .replace(/^Dr\.\s*/, "")
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
    { id: "Patients", icon: Users, label: "Patients" },
    { id: "MedicalRecords", icon: FileText, label: "Medical Records" },
    { id: "PredictionReviews", icon: Activity, label: "Prediction Reviews" },
    { id: "Appointments", icon: Calendar, label: "Appointments" },
    { id: "Prescriptions", icon: FileText, label: "Prescriptions" },
    { id: "Analytics", icon: Activity, label: "Analytics" },
    { id: "Emergency", icon: ShieldAlert, label: "High-Risk Alerts" },
    { id: "Notifications", icon: Bell, label: "Notifications" },
    { id: "Chat", icon: MessageSquare, label: "Chat" },
    { id: "Settings", icon: Settings, label: "Profile Settings" },
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
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">SmileGuard</span>
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
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <tab.icon
                    className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`}
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
                  placeholder="Search patients, reports, or IDs..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-slate-500">Chief Orthodontist</p>
                </div>
                <Pressable
                  onPress={() => setActiveTab("Settings")}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 9999,
                    backgroundColor: "#bfdbfe",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#1e40af",
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    {initials}
                  </Text>
                </Pressable>
              </div>
            </div>
          </header>

          {/* Dynamic View Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "Dashboard" && <DoctorDashboard />}
            {activeTab === "Patients" && <PatientsModule />}
            {activeTab === "MedicalRecords" && <PatientsModule />}
            {activeTab === "PredictionReviews" && <DoctorDashboard />}
            {activeTab === "Appointments" && <AppointmentsModule />}
            {activeTab === "Prescriptions" && <PatientsModule />}
            {activeTab === "Analytics" && <AnalyticsDashboard />}
            {activeTab === "Emergency" && <EmergencyModule />}
            {activeTab === "Chat" && <ChatbotScreen />}
            {activeTab === "Notifications" && <CommunicationModule />}
            {activeTab === "Settings" && (
              <div className="flex-1 w-full h-full overflow-hidden">
                <ProfileScreen />
              </div>
            )}
          </div>
        </main>
      </div>
    </View>
  );
}
