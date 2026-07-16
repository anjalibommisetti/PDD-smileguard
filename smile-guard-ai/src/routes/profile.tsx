import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const badges = [
  { name: "Healthy Habits", icon: "star", tone: "mint" },
  { name: "Risk Reducer", icon: "shield", tone: "peach" },
  { name: "Consistent", icon: "award", tone: "beige" },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [latestScore, setLatestScore] = useState<number | null>(null);
  const [latestLevel, setLatestLevel] = useState<string | null>(null);
  const [riskChange, setRiskChange] = useState<number | null>(null);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [role, setRole] = useState("Patient");

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, []),
  );

  const fetchUser = async () => {
    try {
      // getSession() reads from localStorage — no network hang
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      const storedRole = await AsyncStorage.getItem("userRole");
      if (storedRole === "doctor") {
        setRole("Doctor");
      } else {
        setRole("Patient");
      }

      // Fetch last 2 completed assessments for real stats
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await supabase
          .from("assessments")
          .select("score, level, created_at")
          .eq("user_id", userId)
          .neq("level", "In Progress")
          .order("created_at", { ascending: false })
          .limit(2);
        if (data && data.length > 0) {
          setLatestScore(data[0].score);
          setLatestLevel(data[0].level);
          if (data.length >= 2) {
            setRiskChange(data[0].score - data[1].score);
          }
        }
        const { count } = await supabase
          .from("assessments")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .neq("level", "In Progress");
        setTotalAssessments(count ?? 0);
      }
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    navigation.navigate("Index");
  };

  if (loading) {
    return (
      <PhoneShell>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#157A6E" />
        </View>
      </PhoneShell>
    );
  }

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const riskColor =
    latestLevel === "High" ? "#EF4444" : latestLevel === "Medium" ? "#F59E0B" : "#10B981";
  const riskBg =
    latestLevel === "High"
      ? "rgba(239,68,68,0.1)"
      : latestLevel === "Medium"
        ? "rgba(245,158,11,0.1)"
        : "rgba(16,185,129,0.1)";

  return (
    <PhoneShell>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={{ flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{role}</Text>
              </View>
              {latestLevel && (
                <View style={[styles.roleBadge, { backgroundColor: riskBg }]}>
                  <Text style={[styles.roleText, { color: riskColor }]}>
                    {latestScore}% · {latestLevel} Risk
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakTop}>
            <Feather name="zap" size={28} color="#7C3AED" />
            <View>
              <Text style={styles.streakDays}>5 days</Text>
              <Text style={styles.streakLabel}>Oral care streak</Text>
            </View>
          </View>
          <View style={styles.streakGrid}>
            {Array.from({ length: 7 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.streakDay,
                  i < 5 ? styles.streakDayActive : styles.streakDayInactive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Latest Risk</Text>
            <Text style={[styles.statVal, { color: latestScore !== null ? riskColor : "#CBD5E1" }]}>
              {latestScore !== null ? `${latestScore}%` : "—"}
            </Text>
            <Text
              style={[styles.statDesc, { color: latestScore !== null ? riskColor : "#94A3B8" }]}
            >
              {latestLevel ?? "No data yet"}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Risk change</Text>
            <Text
              style={[
                styles.statVal,
                {
                  color: riskChange === null ? "#CBD5E1" : riskChange > 0 ? "#EF4444" : "#10B981",
                },
              ]}
            >
              {riskChange === null ? "—" : `${riskChange > 0 ? "+" : ""}${riskChange}%`}
            </Text>
            <Text
              style={[
                styles.statDesc,
                {
                  color: riskChange === null ? "#94A3B8" : riskChange > 0 ? "#EF4444" : "#10B981",
                },
              ]}
            >
              {riskChange === null
                ? "No data"
                : riskChange > 0
                  ? "Worsening"
                  : riskChange < 0
                    ? "Improving"
                    : "Stable"}
            </Text>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgesCard}>
          <Text style={styles.badgesTitle}>Badges</Text>
          <View style={styles.badgesGrid}>
            {badges.map((b) => {
              const bg =
                b.tone === "mint"
                  ? "rgba(134, 241, 212, 0.4)"
                  : b.tone === "peach"
                    ? "rgba(255, 205, 178, 0.5)"
                    : "#F1F5F9";
              return (
                <View key={b.name} style={[styles.badgeItem, { backgroundColor: bg }]}>
                  <Feather name={b.icon as any} size={24} color="#0F172A" />
                  <Text style={styles.badgeName}>{b.name}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          <MenuRow
            icon="settings"
            label="Settings"
            onPress={() =>
              Alert.alert(
                "Settings",
                "Notification preferences, language, and theme settings coming soon.",
              )
            }
          />
          <View style={styles.divider} />
          <MenuRow
            icon="shield"
            label="Privacy & data sharing"
            onPress={() =>
              Alert.alert(
                "Privacy & Data Sharing",
                "Your data is stored securely in Supabase.\n\n• Assessment data is linked to your account\n• We do not share data with third parties\n• You can delete your account at any time\n\nFor questions, contact support.",
              )
            }
          />
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuRow} onPress={handleLogout}>
            <View style={styles.menuRowLeft}>
              <Feather name="log-out" size={16} color="#EF4444" />
              <Text style={[styles.menuLabel, { color: "#EF4444" }]}>Log out</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PhoneShell>
  );
}

function MenuRow({ icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.menuRowLeft}>
        <Feather name={icon} size={16} color="#0F172A" />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={16} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#86F1D4",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D4B42",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  userEmail: {
    fontSize: 12,
    color: "#64748B",
  },
  roleBadge: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "rgba(134, 241, 212, 0.4)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0D4B42",
  },
  streakCard: {
    backgroundColor: "#FFCDB2",
    borderRadius: 24,
    padding: 20,
  },
  streakTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  streakDays: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7C3AED",
  },
  streakLabel: {
    fontSize: 12,
    color: "rgba(124, 58, 237, 0.8)",
  },
  streakGrid: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  streakDay: {
    flex: 1,
    height: 32,
    borderRadius: 8,
  },
  streakDayActive: {
    backgroundColor: "#FFFFFF",
  },
  streakDayInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  statVal: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
  },
  statDesc: {
    fontSize: 11,
    fontWeight: "600",
    color: "#10B981",
  },
  badgesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  badgesTitle: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  badgesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  badgeItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    padding: 12,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    color: "#0F172A",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
});
