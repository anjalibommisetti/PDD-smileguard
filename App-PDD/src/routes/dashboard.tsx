import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
} from "react-native";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  Menu,
  User,
} from "lucide-react-native";

import ScanScreen from "./scan";
import ResultsScreen from "./results";
import DentistsScreen from "./dentists";
import ReportScreen from "./report";
import ProfileScreen from "./profile";
import HistoryScreen from "./history";
import AssessmentScreen from "./assessment";

function PatientDashboardMain({ setActiveTab, isDarkMode }: { setActiveTab: (t: string) => void; isDarkMode?: boolean }) {
  const [userName, setUserName] = useState("User");
  const [initials, setInitials] = useState("U");
  const [riskLevel, setRiskLevel] = useState("Low");
  const [riskScore, setRiskScore] = useState<number>(0);
  const [patientName, setPatientName] = useState("");
  const [assessedAt, setAssessedAt] = useState("");
  const [activities, setActivities] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const fetchDashboardData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      const userId = user?.id;

      if (user) {
        const emailPrefix = user.email ? user.email.split("@")[0] : "";
        let metaName = user.user_metadata?.full_name || user.user_metadata?.name;
        let displayName = "";

        if (emailPrefix.toLowerCase().includes("anjali")) {
          displayName = "Anjali Bommisetty";
          await AsyncStorage.setItem("user_full_name", "Anjali Bommisetty");
        } else if (metaName && metaName.toLowerCase() !== "venu") {
          displayName = metaName;
        } else {
          const storedName = await AsyncStorage.getItem("user_full_name");
          if (storedName && storedName.toLowerCase() !== "venu") {
            displayName = storedName;
          } else if (emailPrefix) {
            const clean = emailPrefix.replace(/[0-9_]/g, " ").trim();
            displayName = clean
              ? clean
                  .split(" ")
                  .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")
              : emailPrefix;
          } else {
            displayName = "Anjali Bommisetty";
          }
        }

        setUserName(displayName);
        const nameParts = displayName.split(" ").filter(Boolean);
        const calcInitials =
          nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[1][0]}`
            : displayName.substring(0, 2);
        setInitials(calcInitials.toUpperCase() || "U");

        let { data: assessment } = await supabase
          .from("assessments")
          .select("score, level, patient_name, created_at, answers")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (assessment) {
          const rawScore = assessment.score ?? 0;
          const computedLvl = rawScore >= 70 ? "High" : rawScore >= 35 ? "Medium" : "Low";
          const finalLvl = (assessment.level === "Low" && rawScore >= 35) ? "Medium" : (assessment.level || computedLvl);

          setRiskScore(rawScore);
          setRiskLevel(finalLvl);
          setPatientName(assessment.patient_name || displayName);
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
              const displaySub = isScan
                ? r.patient_name.replace("[Scan] ", "")
                : r.patient_name && !r.patient_name.includes("@")
                  ? r.patient_name
                  : displayName;
              return {
                id: r.id,
                level: r.level,
                score: r.score,
                title: isScan
                  ? `Teeth Scan — ${scanClass} (${r.score ?? 0}%)`
                  : `Risk Assessment — ${r.level ?? "Unknown"} (${r.score ?? 0}%)`,
                subtitle: displaySub,
                time: new Date(r.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                }),
                isScan,
                imageUrl: r.answers?.imageUrl,
              };
            }),
          );
        }
      }
    } catch (err) {}
  };

  const getRiskColor = (level: string) => {
    if (level === "High") return { text: "#EF4444", bg: "rgba(239,68,68,0.15)" };
    if (level === "Medium") return { text: "#F59E0B", bg: "rgba(245,158,11,0.15)" };
    return { text: "#10B981", bg: "rgba(16,185,129,0.15)" };
  };
  const getRiskBarColor = (level: string) => {
    if (level === "High") return "#EF4444";
    if (level === "Medium") return "#F59E0B";
    return "#10B981";
  };

  const cardBg = isDarkMode ? "#1E293B" : "#FFFFFF";
  const titleColor = isDarkMode ? "#F8FAFC" : "#0F172A";
  const subTextColor = isDarkMode ? "#94A3B8" : "#64748B";
  const borderColor = isDarkMode ? "#334155" : "#E2E8F0";

  return (
    <ScrollView style={[styles.dashboardContainer, { backgroundColor: isDarkMode ? "#0B0F17" : "#F8FAFC" }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.welcomeTextContainer}>
          <Text style={[styles.welcomeTitle, { color: titleColor }]}>Welcome back, {userName}</Text>
          <Text style={[styles.welcomeSubtitle, { color: subTextColor }]}>Here is a summary of your oral health.</Text>
        </View>
      </View>

      {/* Main Risk Card */}
      <View style={[styles.card, { backgroundColor: cardBg, borderColor, borderWidth: isDarkMode ? 1 : 0 }]}>
        <View style={styles.riskCardContent}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardSectionTitle, { color: subTextColor }]}>CURRENT ORAL HEALTH STATUS</Text>
            <View style={styles.riskScoreRow}>
              <Text style={[styles.riskScoreText, { color: titleColor }]}>{riskScore}%</Text>
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(riskLevel).bg }]}>
                <Text style={[styles.riskBadgeText, { color: getRiskColor(riskLevel).text }]}>
                  {riskLevel} Risk
                </Text>
              </View>
            </View>
            <Text style={[styles.assessedText, { color: subTextColor }]}>Last assessed on {assessedAt || "Never"}</Text>
          </View>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[styles.progressBarFill, { width: `${riskScore}%`, backgroundColor: getRiskBarColor(riskLevel) }]}
          />
        </View>
      </View>

      <View style={styles.twoColGrid}>
        {/* Recent Activity */}
        <View style={[styles.card, { flex: 1, backgroundColor: cardBg, borderColor, borderWidth: isDarkMode ? 1 : 0 }]}>
          <View style={styles.cardHeader}>
            <Activity size={24} color="#3B82F6" />
            <Text style={[styles.cardTitle, { color: titleColor }]}>Recent Predictions</Text>
          </View>
          {activities.length === 0 ? (
            <Text style={[styles.emptyText, { color: subTextColor }]}>No recent activity.</Text>
          ) : (
            activities.map((act) => (
              <View key={act.id} style={[styles.activityItem, { borderBottomColor: borderColor }]}>
                <View style={styles.activityRow}>
                  <View style={[styles.activityIconBg, { backgroundColor: getRiskColor(act.level).bg, overflow: "hidden" }]}>
                    {act.isScan && act.imageUrl ? (
                      <Image source={{ uri: act.imageUrl }} style={{ width: 40, height: 40 }} />
                    ) : (
                      <Activity size={20} color={getRiskColor(act.level).text} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.activityTitle, { color: titleColor }]}>{act.title}</Text>
                    <Text style={[styles.activitySubtitle, { color: subTextColor }]}>{act.subtitle}</Text>
                  </View>
                  <Text style={[styles.activityTime, { color: subTextColor }]}>{act.time}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default function PatientPortal() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(Platform.OS === "web"); // default open on web, closed on mobile
  const [isDarkMode, setIsDarkMode] = useState(false);

  const checkTheme = async () => {
    const val = await AsyncStorage.getItem("@smileguard_dark_mode");
    if (val !== null) setIsDarkMode(val === "true");
  };

  useEffect(() => {
    checkTheme();
    const interval = setInterval(checkTheme, 400);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkTheme();
      if (route?.params?.tab) {
        setActiveTab(route.params.tab);
        navigation.setParams({ tab: undefined });
      }
    }, [route?.params?.tab])
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Assessment", label: "Take Assessment", icon: FileText },
    { id: "Scan", label: "Upload Scan", icon: UploadCloud },
    { id: "History", label: "Predictions", icon: Activity },
    { id: "Profile", label: "Profile", icon: User },
  ];

  const bgWrapper = isDarkMode ? "#0B0F17" : "#F8FAFC";
  const bgSidebar = isDarkMode ? "#0F172A" : "#FFFFFF";
  const bgTopBar = isDarkMode ? "#0F172A" : "#FFFFFF";
  const borderColor = isDarkMode ? "#1E293B" : "#E2E8F0";
  const titleColor = isDarkMode ? "#F8FAFC" : "#0F172A";
  const subTextColor = isDarkMode ? "#94A3B8" : "#64748B";

  return (
    <SafeAreaView style={[styles.mainWrapper, { backgroundColor: bgWrapper }]}>
      <View style={styles.layoutRow}>
        {/* Sidebar */}
        {sidebarOpen && Platform.OS === "web" && (
          <View style={[styles.sidebar, { backgroundColor: bgSidebar, borderColor }]}>
            <View style={[styles.sidebarHeader, { borderColor }]}>
              <View style={styles.logoBadge}>
                <Activity size={20} color="#fff" />
              </View>
              <Text style={[styles.sidebarTitle, { color: titleColor }]}>SmileGuard</Text>
            </View>

            <ScrollView style={styles.navMenu}>
              <Text style={[styles.navSectionLabel, { color: subTextColor }]}>PATIENT PORTAL</Text>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.navItem,
                      isActive && { backgroundColor: isDarkMode ? "#1E293B" : "#F0FDFA" },
                    ]}
                    onPress={() => {
                      setActiveTab(item.id);
                      if (Platform.OS !== "web") setSidebarOpen(false);
                    }}
                  >
                    <item.icon size={20} color={isActive ? (isDarkMode ? "#38BDF8" : "#0D9488") : subTextColor} />
                    <Text style={[
                      styles.navItemText,
                      { color: isActive ? (isDarkMode ? "#38BDF8" : "#0D9488") : subTextColor, fontWeight: isActive ? "bold" : "500" }
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={[styles.sidebarFooter, { borderColor }]}>
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <LogOut size={20} color="#DC2626" />
                <Text style={styles.logoutBtnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Content Area */}
        <View style={[styles.contentArea, { backgroundColor: bgWrapper }]}>
          <View style={[styles.topBar, { backgroundColor: bgTopBar, borderColor }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {Platform.OS === "web" && (
                <TouchableOpacity style={styles.menuBtn} onPress={() => setSidebarOpen(!sidebarOpen)}>
                  <Menu size={24} color={subTextColor} />
                </TouchableOpacity>
              )}
              <Text style={[styles.topBarTitle, { color: titleColor }]}>{activeTab}</Text>
            </View>
            <View style={styles.topBarRight}>
              <TouchableOpacity onPress={() => navigation.navigate("Alerts")}>
                <Bell size={24} color={subTextColor} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mainView}>
            {activeTab === "Dashboard" && <PatientDashboardMain setActiveTab={setActiveTab} isDarkMode={isDarkMode} />}
            {activeTab === "Assessment" && <AssessmentScreen />}
            {activeTab === "Scan" && <ScanScreen />}
            {activeTab === "History" && <HistoryScreen />}
            {activeTab === "Profile" && <ProfileScreen />}
          </View>

          {/* Bottom Navigation for Mobile */}
          {Platform.OS !== "web" && (
            <View style={[styles.bottomNav, { backgroundColor: bgSidebar, borderColor }]}>
              <TouchableOpacity style={styles.bottomNavItem} onPress={() => setActiveTab("Dashboard")}>
                <LayoutDashboard size={22} color={activeTab === "Dashboard" ? (isDarkMode ? "#38BDF8" : "#0D9488") : subTextColor} />
                <Text style={[styles.bottomNavText, { color: subTextColor }, activeTab === "Dashboard" && { color: isDarkMode ? "#38BDF8" : "#0D9488", fontWeight: "bold" }]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomNavItem} onPress={() => setActiveTab("Assessment")}>
                <FileText size={22} color={activeTab === "Assessment" ? (isDarkMode ? "#38BDF8" : "#0D9488") : subTextColor} />
                <Text style={[styles.bottomNavText, { color: subTextColor }, activeTab === "Assessment" && { color: isDarkMode ? "#38BDF8" : "#0D9488", fontWeight: "bold" }]}>Assessment</Text>
              </TouchableOpacity>
              
              <View style={styles.scanBtnContainer}>
                <TouchableOpacity style={styles.scanBtn} onPress={() => setActiveTab("Scan")}>
                  <UploadCloud size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.bottomNavItem} onPress={() => setActiveTab("History")}>
                <Activity size={22} color={activeTab === "History" ? (isDarkMode ? "#38BDF8" : "#0D9488") : subTextColor} />
                <Text style={[styles.bottomNavText, { color: subTextColor }, activeTab === "History" && { color: isDarkMode ? "#38BDF8" : "#0D9488", fontWeight: "bold" }]}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomNavItem} onPress={() => setActiveTab("Profile")}>
                <User size={22} color={activeTab === "Profile" ? (isDarkMode ? "#38BDF8" : "#0D9488") : subTextColor} />
                <Text style={[styles.bottomNavText, { color: subTextColor }, activeTab === "Profile" && { color: isDarkMode ? "#38BDF8" : "#0D9488", fontWeight: "bold" }]}>Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: "#F8FAFC", paddingTop: Platform.OS !== "web" ? 35 : 0 },
  layoutRow: { flex: 1, flexDirection: "row" },
  
  // Sidebar
  sidebar: {
    width: 250,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderColor: "#E2E8F0",
    ...(Platform.OS !== "web" ? { position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 50, elevation: 5 } : {}),
  },
  sidebarHeader: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  logoBadge: {
    backgroundColor: "#0D9488",
    padding: 6,
    borderRadius: 8,
  },
  sidebarTitle: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  navMenu: { flex: 1, padding: 12 },
  navSectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#94A3B8",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  navItemActive: { backgroundColor: "#F0FDFA" },
  navItemText: { fontSize: 15, color: "#64748B", fontWeight: "500" },
  navItemTextActive: { color: "#0D9488", fontWeight: "bold" },
  sidebarFooter: { padding: 16, borderTopWidth: 1, borderColor: "#E2E8F0" },
  logoutBtn: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  logoutBtnText: { color: "#DC2626", fontSize: 15, fontWeight: "600" },

  // Content Area
  contentArea: { flex: 1, backgroundColor: "#F8FAFC" },
  topBar: {
    height: 64,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  menuBtn: { padding: 8, marginRight: 8 },
  topBarTitle: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  topBarRight: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#0F766E", fontWeight: "bold" },
  mainView: { flex: 1 },

  // Dashboard Tab
  dashboardContainer: { padding: 16, flex: 1 },
  headerRow: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "space-between",
    alignItems: Platform.OS === "web" ? "center" : "flex-start",
    marginBottom: 24,
    gap: 16,
  },
  welcomeTextContainer: { flex: 1 },
  welcomeTitle: { fontSize: 24, fontWeight: "bold", color: "#0F172A", marginBottom: 4 },
  welcomeSubtitle: { fontSize: 16, color: "#64748B" },
  primaryBtn: {
    backgroundColor: "#0D9488",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
    overflow: "hidden",
  },
  riskCardContent: { padding: 24 },
  cardSectionTitle: { fontSize: 12, fontWeight: "bold", color: "#64748B", marginBottom: 12 },
  riskScoreRow: { flexDirection: "row", alignItems: "baseline", gap: 16, marginBottom: 12 },
  riskScoreText: { fontSize: 48, fontWeight: "900", color: "#0F172A" },
  riskBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  riskBadgeText: { fontWeight: "bold", fontSize: 14 },
  assessedText: { fontSize: 14, color: "#64748B" },
  progressBarBg: { height: 16, backgroundColor: "#F1F5F9", width: "100%" },
  progressBarFill: { height: "100%", borderRadius: 8 },

  twoColGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: 24,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, padding: 20, borderBottomWidth: 1, borderColor: "#F1F5F9" },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  emptyText: { padding: 20, color: "#64748B" },
  
  activityItem: { padding: 16, borderBottomWidth: 1, borderColor: "#F1F5F9" },
  activityRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  activityIconBg: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  activityTitle: { fontWeight: "bold", color: "#0F172A", fontSize: 14, marginBottom: 2 },
  activitySubtitle: { color: "#64748B", fontSize: 12 },
  activityTime: { color: "#94A3B8", fontSize: 12, fontWeight: "500" },

  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    margin: 16,
    marginTop: 0,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    borderRadius: 12,
  },
  reminderTitle: { fontWeight: "bold", color: "#1E3A8A", fontSize: 14, marginBottom: 4 },
  reminderSubtitle: { color: "#1D4ED8", fontSize: 12 },

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bottomNavText: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "500",
  },
  bottomNavTextActive: {
    color: "#0D9488",
    fontWeight: "bold",
  },
  scanBtnContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
    flex: 1,
  },
  scanBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
