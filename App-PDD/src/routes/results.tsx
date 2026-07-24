import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";

import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

export default function ResultsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params as any;
  const assessmentId = params?.id;

  // Use params passed directly from assessment first (always available immediately)
  const [score, setScore] = useState<number>(params?.score ?? 0);
  const [level, setLevel] = useState<string>(params?.level ?? "Low");
  const [breakdown, setBreakdown] = useState<any[]>(params?.breakdown ?? []);
  const [insight, setInsight] = useState<string>(params?.insight ?? "");
  const [recommendations, setRecommendations] = useState<string[]>(params?.recommendations ?? []);
  const [patientName, setPatientName] = useState<string>(params?.patientName ?? "");
  const [loading, setLoading] = useState(!params?.score); // skip loading if params exist

  useEffect(() => {
    // Only fetch from DB if we have no params (e.g. navigated from History)
    if (!params?.score) {
      fetchResults();
    }
  }, []);

  const fetchResults = async () => {
    try {
      let query: any = supabase.from("assessments").select("*");
      if (assessmentId) {
        query = query.eq("id", assessmentId).single();
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          query = query
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
        } else {
          setLoading(false);
          return;
        }
      }

      const { data } = await query;
      if (data) {
        setScore(data.score ?? 0);
        setLevel(data.level ?? "Low");
        setBreakdown(data.breakdown ?? []);
        setInsight(data.insight ?? "No insight available.");
        setRecommendations(data.recommendations ?? []);
        setPatientName(data.patient_name ?? "");
      }
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PhoneShell showNav={false}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#157A6E" />
          <Text style={{ marginTop: 12, color: "#64748B" }}>Analyzing results...</Text>
        </View>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell showNav={false}>
      <ScreenHeader title="Risk Results" subtitle="Analysis complete" showBack={true} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient name above card */}
        {patientName ? (
          <View style={styles.patientRow}>
            <View style={styles.patientAvatar}>
              <Text style={styles.patientAvatarText}>{patientName.charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.patientLabel}>Assessment for</Text>
              <Text style={styles.patientName}>{patientName}</Text>
            </View>
          </View>
        ) : null}

        {/* Risk hero */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor:
                level === "High" ? "#EF4444" : level === "Medium" ? "#F59E0B" : "#10B981",
            },
          ]}
        >
          <View style={styles.heroTop}>
            <Text style={styles.heroLabel}>Risk Score</Text>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{level}</Text>
            </View>
          </View>
          <View style={styles.scoreWrap}>
            <Text style={styles.scoreMain}>{score}</Text>
            <Text style={styles.scoreUnit}>%</Text>
          </View>
          <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBarFill, { width: `${score}%` }]} />
          </View>
          <View style={styles.heroWarning}>
            <Feather
              name={level === "Low" ? "check-circle" : "alert-triangle"}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.heroWarningText}>
              {level === "High"
                ? "Immediate Attention Required"
                : level === "Medium"
                  ? "Precautionary Measures Needed"
                  : "Maintain Good Hygiene"}
            </Text>
          </View>
        </View>

        {/* Breakdown */}
        {breakdown.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Risk Breakdown</Text>
            <View style={styles.breakdownList}>
              {breakdown.map((b) => (
                <View key={b.label} style={styles.breakdownItem}>
                  <View style={styles.bdTop}>
                    <Text style={styles.bdLabel}>{b.label}</Text>
                    <Text style={styles.bdVal}>{b.value}%</Text>
                  </View>
                  <View style={styles.bdBarBg}>
                    <View
                      style={[
                        styles.bdBarFill,
                        { width: `${b.value}%`, backgroundColor: b.color || "#86F1D4" },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Health Insight */}
        <View style={styles.cardBeige}>
          <View style={styles.insightHeader}>
            <View style={styles.insightIcon}>
              <Feather name="cpu" size={16} color="#157A6E" />
            </View>
            <Text style={styles.cardTitle}>Health Insight</Text>
            <View style={styles.confBadge}>
              <Text style={styles.confText}>92% confidence</Text>
            </View>
          </View>
          <Text style={styles.insightText}>{insight}</Text>
        </View>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recommendations</Text>
            <View style={styles.recList}>
              {recommendations
                .filter(
                  (r) =>
                    !r.toLowerCase().includes("dental visit within 3 months") &&
                    !r.toLowerCase().includes("visit within 3 months") &&
                    !r.toLowerCase().includes("within 3 months")
                )
                .map((r, idx) => {
                const isDentist =
                  r.toLowerCase().includes("dentist") || r.toLowerCase().includes("visit");
                const isBrush =
                  r.toLowerCase().includes("brush") || r.toLowerCase().includes("floss");
                const icon = isDentist ? "calendar" : isBrush ? "sun" : "check-circle";
                const dest = isDentist ? "Dentists" : null;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.recItem}
                    activeOpacity={dest ? 0.7 : 1}
                    onPress={() => dest && navigation.navigate(dest)}
                  >
                    <View style={styles.recIconBox}>
                      <Feather
                        name={icon as any}
                        size={16}
                        color={isDentist ? "#157A6E" : "#10B981"}
                      />
                    </View>
                    <Text style={styles.recText}>{r}</Text>
                    {dest && <Feather name="chevron-right" size={14} color="#CBD5E1" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnSecondary}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Report", { id: assessmentId, score })}
          >
            <Feather name="file-text" size={16} color="#0F172A" />
            <Text style={styles.btnSecondaryText}>Full Report</Text>
          </TouchableOpacity>
        </View>


      </ScrollView>
    </PhoneShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#86F1D4",
    alignItems: "center",
    justifyContent: "center",
  },
  patientAvatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0D4B42",
  },
  patientLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  heroCard: {
    backgroundColor: "#EF4444", // Alert bg approx
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "rgba(255, 255, 255, 0.9)",
  },
  heroBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scoreWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  scoreMain: {
    fontSize: 60,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 64,
  },
  scoreUnit: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  scoreBarBg: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    marginTop: 20,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  heroWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
  },
  heroWarningText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  breakdownList: {
    marginTop: 16,
    gap: 16,
  },
  breakdownItem: {},
  bdTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  bdLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  bdVal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0F172A",
  },
  bdBarBg: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  bdBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  cardBeige: {
    backgroundColor: "#F1F5F9", // Beige approx
    borderRadius: 24,
    padding: 20,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  insightIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confBadge: {
    marginLeft: "auto",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  confText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#10B981",
  },
  insightText: {
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(15, 23, 42, 0.8)",
  },
  recList: {
    marginTop: 12,
    gap: 10,
  },
  recItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  recIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(16,185,129,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  recText: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 16,
    borderRadius: 16,
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  btnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#86F1D4",
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#86F1D4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D4B42",
  },
});
