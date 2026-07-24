import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AlertsScreen() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadDynamicAlerts();
    }, [])
  );

  const loadDynamicAlerts = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      const userId = user?.id;

      // 1. Calculate dynamic streak
      let signupIso = user?.created_at;
      if (!signupIso) {
        signupIso = await AsyncStorage.getItem("@smileguard_signup_date");
      }
      if (!signupIso) {
        signupIso = new Date().toISOString();
        await AsyncStorage.setItem("@smileguard_signup_date", signupIso);
      }
      const signupDate = new Date(signupIso);
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - signupDate.getTime());
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
      const totalWeeks = Math.floor((totalDays - 1) / 7) + 1;

      // User Details
      const storedName = await AsyncStorage.getItem("user_full_name");
      const storedGender = await AsyncStorage.getItem("user_gender");
      const userName = storedName || user?.user_metadata?.full_name || "User";
      const userGender = storedGender || user?.user_metadata?.gender || "Not specified";

      // 2. Fetch Latest Assessment
      let latestAssessment: any = null;
      if (userId) {
        const { data } = await supabase
          .from("assessments")
          .select("score, level, created_at, answers")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        latestAssessment = data;
      }

      const generatedAlerts: any[] = [];

      // Alert 0: Logged In Successfully Notification
      generatedAlerts.push({
        icon: "check-circle",
        title: "Logged In Successfully",
        desc: `Authenticated active session for ${userName} (${user?.email || "User"}). Security session verified.`,
        time: "Just now",
        tone: "mint",
      });

      // Alert 1: Assessment / Risk Status
      if (latestAssessment) {
        const score = latestAssessment.score ?? 0;
        const level = latestAssessment.level || "Low";
        const dateStr = new Date(latestAssessment.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });

        if (level === "High" || score >= 60) {
          generatedAlerts.push({
            icon: "shield-off",
            title: "High Risk Detected",
            desc: `Your latest scan score (${score}/100) indicates attention is required. Follow oral hygiene recommendations carefully.`,
            time: dateStr,
            tone: "alert",
          });
        } else if (level === "Medium" || score >= 30) {
          generatedAlerts.push({
            icon: "alert-circle",
            title: "Moderate Risk Care Notice",
            desc: `Your latest score is ${score}/100. Maintain daily fluoride rinsing and proper brushing techniques.`,
            time: dateStr,
            tone: "warning",
          });
        } else {
          generatedAlerts.push({
            icon: "check-circle",
            title: "Healthy Oral Status",
            desc: `Great job! Your latest scan score is ${score}/100. Keep up the good self-care routine.`,
            time: dateStr,
            tone: "mint",
          });
        }
      } else {
        generatedAlerts.push({
          icon: "camera",
          title: "Initial Scan Recommended",
          desc: "Take your first AI teeth scan to receive a personalized oral health score and advice.",
          time: "New",
          tone: "mint",
        });
      }

      // Alert 2: Dynamic Health Streak
      generatedAlerts.push({
        icon: "activity",
        title: "Health Care Streak",
        desc: `Awesome! You have maintained your health care streak for ${totalDays} ${totalDays === 1 ? "day" : "days"} (${totalWeeks} ${totalWeeks === 1 ? "week" : "weeks"}).`,
        time: "Today",
        tone: "success",
      });

      // Alert 3: Daily Brushing Reminder
      generatedAlerts.push({
        icon: "bell",
        title: "Brushing & Hygiene Reminder",
        desc: "Don't forget your 2-minute morning and evening brushing routine with fluoride toothpaste.",
        time: "8:00 PM",
        tone: "mint",
      });

      // Alert 4: Self-Care & Preventive Habits
      generatedAlerts.push({
        icon: "droplet",
        title: "Hydration & Fluoride Rinse",
        desc: "Drink plenty of water throughout the day and use mouthwash after meals for healthy gums.",
        time: "Daily",
        tone: "warning",
      });

      // Alert 5: Profile Status
      generatedAlerts.push({
        icon: "user",
        title: "Patient Profile Status",
        desc: `Logged in as ${userName} (${userGender}). Profile metadata is synced for reports.`,
        time: "Active",
        tone: "mint",
      });

      setAlerts(generatedAlerts);
    } catch (e) {
      console.log("Error loading dynamic alerts:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneShell>
      <ScreenHeader title="Alerts" subtitle="Stay on top of your oral care" showBack={true} />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#0D4B42" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.list}>
            {alerts.map((a, idx) => {
              const bgTone =
                a.tone === "alert"
                  ? "rgba(239, 68, 68, 0.15)"
                  : a.tone === "warning"
                    ? "rgba(245, 158, 11, 0.2)"
                    : "rgba(134, 241, 212, 0.4)";
              const fgTone =
                a.tone === "alert" ? "#EF4444" : a.tone === "warning" ? "#D97706" : "#0D4B42";

              return (
                <View key={idx} style={styles.card}>
                  <View style={[styles.iconBox, { backgroundColor: bgTone }]}>
                    <Feather name={a.icon as any} size={20} color={fgTone} />
                  </View>
                  <View style={styles.body}>
                    <View style={styles.header}>
                      <Text style={styles.title}>{a.title}</Text>
                      <Text style={styles.time}>{a.time}</Text>
                    </View>
                    <Text style={styles.desc}>{a.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </PhoneShell>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  time: {
    fontSize: 10,
    color: "#64748B",
  },
  desc: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
});
