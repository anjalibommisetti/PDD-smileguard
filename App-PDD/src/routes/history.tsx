import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Image
} from "react-native";
import React, { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

export default function HistoryScreen() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Refresh every time this screen is focused (navigated to)
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    setItems([]);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const res = await supabase
          .from("assessments")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        
        if (res.data && res.data.length > 0) {
          setItems(
            res.data.map((it: any) => {
              const isScan = (it.patient_name || "").startsWith("[Scan]");
              const isInProgress = it.level === "In Progress";
              const rawScore = it.score ?? 0;
              const finalLvl = rawScore >= 70 ? "High" : rawScore >= 35 ? "Medium" : "Low";

              const tone = isInProgress
                ? "pending"
                : finalLvl === "High"
                  ? "alert"
                  : finalLvl === "Medium"
                    ? "warning"
                    : "success";
              return {
                ...it,
                type: "assessment",
                isScan,
                displayName: isScan
                  ? "Teeth Scan"
                  : "Risk Assessment",
                imageUrl: it.answers?.imageUrl,
                displayDate: new Date(it.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
                displayTime: new Date(it.created_at).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                tone,
              };
            }),
          );
        }
      }
    } catch (err: any) {
      setError("Could not load history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (Platform.OS === "web") {
      if ((window as any).confirm("Are you sure you want to delete this record?")) {
        const { error } = await supabase.from("assessments").delete().eq("id", id);
        if (error) {
          console.error("Delete error:", error.message);
          alert("Could not delete record. Please try again.");
        } else {
          setItems((prev) => prev.filter((i) => i.id !== id));
        }
      }
    } else {
      Alert.alert("Delete Entry", "Are you sure you want to delete this record?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from("assessments").delete().eq("id", id);
            if (error) {
              console.error("Delete error:", error.message);
              Alert.alert("Error", "Could not delete record. Please try again.");
            } else {
              setItems((prev) => prev.filter((i) => i.id !== id));
            }
          },
        },
      ]);
    }
  };

  const toneColors = {
    alert: { bg: "rgba(239,68,68,0.12)", fg: "#EF4444" },
    warning: { bg: "rgba(245,158,11,0.12)", fg: "#D97706" },
    success: { bg: "rgba(16,185,129,0.12)", fg: "#10B981" },
    pending: { bg: "rgba(100,116,139,0.1)", fg: "#64748B" },
  };

  return (
    <PhoneShell>
      <ScreenHeader title="History" subtitle="Your past activity" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.list}>
          {/* Loading */}
          {loading && (
            <View style={styles.centerBox}>
              <Feather name="loader" size={28} color="#86F1D4" />
              <Text style={styles.centerText}>Loading…</Text>
            </View>
          )}

          {/* Error */}
          {!loading && error !== "" && (
            <View style={styles.centerBox}>
              <Feather name="alert-circle" size={28} color="#EF4444" />
              <Text style={[styles.centerText, { color: "#EF4444" }]}>{error}</Text>
              <TouchableOpacity style={styles.actionBtn} onPress={fetchHistory}>
                <Text style={styles.actionBtnText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Empty */}
          {!loading && error === "" && items.length === 0 && (
            <View style={styles.centerBox}>
              <Feather name="inbox" size={36} color="#CBD5E1" />
              <Text style={styles.centerText}>
                No assessments yet.
              </Text>
              <Text style={styles.centerSub}>
                Complete an assessment to see your history here.
              </Text>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  navigation.navigate("Assessment")
                }
              >
                <Text style={styles.actionBtnText}>
                  Start Assessment
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Assessment + Scan Items */}
          {!loading &&
            items.map((it) => {
              const c = toneColors[it.tone as keyof typeof toneColors] || toneColors.success;
              const isCompleted = it.level !== "In Progress";
              return (
                <View key={it.id} style={styles.itemCard}>
                  {/* Left color indicator */}
                  <View style={[styles.indicator, { backgroundColor: c.fg }]} />

                  {/* Icon box or Image */}
                  <View style={[styles.iconBox, { backgroundColor: c.bg, overflow: "hidden" }]}>
                    {it.isScan && it.imageUrl ? (
                      <Image source={{ uri: it.imageUrl }} style={{ width: 48, height: 48 }} />
                    ) : (
                      <Text style={{ fontSize: 20 }}>{it.isScan ? "🦷" : "📋"}</Text>
                    )}
                  </View>

                  {/* Body */}
                  <TouchableOpacity
                    style={styles.itemBody}
                    onPress={() =>
                      isCompleted && navigation.navigate("Results", { id: it.id, score: it.score })
                    }
                    activeOpacity={isCompleted ? 0.7 : 1}
                  >
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {it.displayName}
                    </Text>
                    <Text style={styles.itemDate}>
                      {it.displayDate} · {it.displayTime}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}
                    >
                      <Text style={[styles.scoreText, { color: c.fg }]}>{it.score ?? 0}%</Text>
                      <View style={[styles.badge, { backgroundColor: c.bg }]}>
                        <Text style={[styles.badgeText, { color: c.fg }]}>
                          {!isCompleted ? "⏳ Prediction Risk" : "Prediction Risk"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Delete */}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(it.id, "assessment")}
                  >
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              );
            })}

        </View>
      </ScrollView>
    </PhoneShell>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 30, paddingTop: 8, maxWidth: 800, alignSelf: "center", width: "100%" },
  tabsWrap: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#F1F5F9",
    padding: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabText: { fontSize: 13, fontWeight: "600", color: "#94A3B8" },
  tabTextActive: { color: "#157A6E" },
  list: { gap: 10 },
  centerBox: { alignItems: "center", paddingVertical: 50, gap: 10 },
  centerText: { fontSize: 14, fontWeight: "500", color: "#64748B", textAlign: "center" },
  centerSub: { fontSize: 12, color: "#94A3B8", textAlign: "center", paddingHorizontal: 20 },
  actionBtn: {
    marginTop: 8,
    backgroundColor: "#86F1D4",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionBtnText: { fontSize: 13, fontWeight: "700", color: "#0D4B42" },

  // Item card
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  indicator: { width: 4, height: "100%", minHeight: 80 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  itemBody: { flex: 1, paddingVertical: 14, paddingRight: 4 },
  itemTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  itemSpec: { fontSize: 12, color: "#64748B" },
  itemDate: { fontSize: 11, color: "#94A3B8", marginTop: 2 },
  itemNote: { fontSize: 11, color: "#64748B", fontStyle: "italic", marginTop: 2 },
  scoreText: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: { fontSize: 10, fontWeight: "700" },
  deleteBtn: {
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
