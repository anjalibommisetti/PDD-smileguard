import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  Calendar as CalendarIcon,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  Activity,
  User,
  Menu,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import ScanScreen from "./scan";
import ResultsScreen from "./results";
import DentistsScreen from "./dentists";
import ReportScreen from "./report";
import ChatbotScreen from "./chatbot";
import ProfileScreen from "./profile";
import HistoryScreen from "./history";
import AssessmentScreen from "./assessment";

// --- Sub-components for Patient Dashboard Main View ---
function PatientDashboardMain({ setActiveTab }: { setActiveTab: (t: string) => void }) {
  const [userName, setUserName] = useState("User");
  const [initials, setInitials] = useState("U");
  const [riskLevel, setRiskLevel] = useState("Low");
  const [riskScore, setRiskScore] = useState<number>(0);
  const [patientName, setPatientName] = useState("");
  const [assessedAt, setAssessedAt] = useState("");
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      const userId = user?.id;

      if (user) {
        const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
        setUserName(fullName);
        setInitials(
          fullName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        );

        let { data: assessment } = await supabase
          .from("assessments")
          .select("score, level, patient_name, created_at, answers")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (assessment) {
          setRiskScore(assessment.score ?? 0);
          setRiskLevel(assessment.level ?? "Low");
          setPatientName(assessment.patient_name || "");
          setAssessedAt(
            new Date(assessment.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          );
        }

        let { data: recent } = await supabase
          .from("assessments")
          .select("id, score, level, patient_name, created_at, answers")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(3);

        if (recent && recent.length > 0) {
          setActivities(
            recent.map((r: any) => {
              const isScan = r.patient_name?.startsWith("[Scan]");
              const scanClass = r.answers?.predictedClass || r.level;
              return {
                id: r.id,
                level: r.level,
                score: r.score,
                title: isScan
                  ? `Teeth Scan — ${scanClass} (${r.score ?? 0}%)`
                  : `Risk Assessment — ${r.level ?? "Unknown"} (${r.score ?? 0}%)`,
                subtitle: isScan
                  ? r.patient_name.replace("[Scan] ", "")
                  : r.patient_name || "Anonymous",
                time: new Date(r.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                }),
              };
            }),
          );
        }
      }
    } catch (err) {}
  };

  const getRiskColor = (level: string) => {
    if (level === "High") return "text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
    if (level === "Medium")
      return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "text-green-500 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
  };
  const getRiskBarColor = (level: string) => {
    if (level === "High") return "bg-red-500";
    if (level === "Medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {userName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Here is a summary of your oral health.
          </p>
        </div>
        <button
          onClick={() => setActiveTab("Assessment")}
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-bold shadow-md transition-colors flex items-center gap-2 text-base sm:text-lg"
        >
          <FileText className="w-5 h-5 sm:w-6 sm:h-6" /> Take Risk Assessment
        </button>
      </div>

      {/* Main Risk Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">
            Current Oral Health Status
          </p>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white">{riskScore}%</h2>
            <span className={`px-4 py-1 rounded-full text-sm font-bold ${getRiskColor(riskLevel)}`}>
              {riskLevel} Risk
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Last assessed on {assessedAt || "Never"}
          </p>
        </div>
        <div className="flex-1 w-full relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${getRiskBarColor(riskLevel)} transition-all duration-1000`}
            style={{ width: `${riskScore}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" /> Recent Predictions
          </h3>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-slate-500 text-base">No recent activity.</p>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getRiskColor(act.level)}`}
                    >
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {act.title}
                      </h4>
                      <p className="text-xs text-slate-500">{act.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 font-medium">{act.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-500" /> Notifications & Reminders
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 rounded-xl">
              <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">
                  Upcoming Dental Appointment
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Tomorrow at 10:00 AM with Dr. Sarah Smith.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
              <FileText className="w-6 h-6 text-slate-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  New Report Available
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your latest scan report is ready to download.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PatientPortal() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: "Landing" }] });
  };

  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Assessment", label: "Take Assessment", icon: FileText },
    { id: "Scan", label: "Upload Scan", icon: UploadCloud },
    { id: "History", label: "Predictions", icon: Activity },
    { id: "Appointments", label: "Appointments", icon: CalendarIcon },
    { id: "Report", label: "Reports", icon: FileText },
    { id: "Chatbot", label: "Chat Assistant", icon: MessageCircle },
    { id: "Notifications", label: "Notifications", icon: Bell },
    { id: "Settings", label: "Settings", icon: Settings },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${sidebarOpen ? "w-64" : "w-20"}`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <span className="font-bold text-lg text-slate-900 dark:text-white truncate">
                  SmileGuard
                </span>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <div className="mb-4">
              {sidebarOpen && (
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Patient Portal
                </p>
              )}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                    activeTab === item.id
                      ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon
                    className={`w-5 h-5 shrink-0 ${activeTab === item.id ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`}
                  />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">
          {/* Top Navbar */}
          <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Patient User</p>
                  <p className="text-xs text-slate-500">Premium Plan</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                  <span className="text-teal-700 dark:text-teal-300 font-bold text-sm">PU</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic View Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {activeTab === "Dashboard" && <PatientDashboardMain setActiveTab={setActiveTab} />}

            {activeTab === "Assessment" && (
              <div className="flex-1 w-full h-full">
                <AssessmentScreen />
              </div>
            )}

            {activeTab === "Scan" && (
              <div className="flex-1 w-full h-full">
                <ScanScreen />
              </div>
            )}

            {activeTab === "History" && (
              <div className="flex-1 w-full h-full">
                <HistoryScreen />
              </div>
            )}

            {activeTab === "Appointments" && (
              <div className="flex-1 w-full h-full">
                <DentistsScreen />
              </div>
            )}

            {activeTab === "Report" && (
              <div className="flex-1 w-full h-full">
                <ReportScreen />
              </div>
            )}

            {activeTab === "Chatbot" && (
              <div className="flex-1 w-full h-full p-4 md:p-8">
                <div className="w-full h-full min-h-[600px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <ChatbotScreen />
                </div>
              </div>
            )}

            {activeTab === "Settings" && (
              <div className="flex-1 w-full h-full">
                <ProfileScreen />
              </div>
            )}
          </div>
        </main>
      </div>
    </View>
  );
}
