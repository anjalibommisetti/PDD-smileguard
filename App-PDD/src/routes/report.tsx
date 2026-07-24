import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Share,
  Platform,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReportScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params as any;
  const assessmentId = params?.id;
  const currentScore: number = params?.score ?? 0;

  const [user, setUser] = useState<any>(null);
  const [storedName, setStoredName] = useState<string>("");
  const [storedAge, setStoredAge] = useState<string>("");
  const [storedGender, setStoredGender] = useState<string>("");
  const [assessment, setAssessment] = useState<any>(null);
  const [detailsAssessment, setDetailsAssessment] = useState<any>(null);
  const [trend, setTrend] = useState<{ score: number; date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [assessmentId]);

  const fetchReportData = async () => {
    try {
      const localName = await AsyncStorage.getItem("user_full_name");
      const localAge = await AsyncStorage.getItem("user_age");
      const localGender = await AsyncStorage.getItem("user_gender");
      if (localName) setStoredName(localName);
      if (localAge) setStoredAge(localAge);
      if (localGender) setStoredGender(localGender);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser);

      // Fetch specific assessment by ID, or latest
      let currentAssessment: any = null;
      if (assessmentId) {
        const { data } = await supabase
          .from("assessments")
          .select("*")
          .eq("id", assessmentId)
          .single();
        currentAssessment = data;
      } else if (currentUser) {
        // Try by user_id first
        const { data } = await supabase
          .from("assessments")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        currentAssessment = data;
        // Fallback: latest from whole table
        if (!currentAssessment) {
          const { data: fb } = await supabase
            .from("assessments")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          currentAssessment = fb;
        }
      }
      setAssessment(currentAssessment);

      // Populate details fallback
      let detailsAss = currentAssessment;
      if (currentAssessment && (!currentAssessment.answers || !currentAssessment.answers.q1) && currentUser) {
        const { data: qData } = await supabase
          .from("assessments")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(10);
        if (qData && qData.length > 0) {
          const matching = qData.find((a: any) => a.answers && a.answers.q1);
          if (matching) {
            detailsAss = matching;
          }
        }
      }
      setDetailsAssessment(detailsAss);

      // Fetch trend — try user_id first, then fallback
      let historyData: any[] | null = null;
      if (currentUser) {
        const { data } = await supabase
          .from("assessments")
          .select("score, created_at")
          .eq("user_id", currentUser.id)
          .neq("level", "In Progress")
          .order("created_at", { ascending: true })
          .limit(7);
        historyData = data;
      }
      if (!historyData || historyData.length === 0) {
        const { data } = await supabase
          .from("assessments")
          .select("score, created_at")
          .neq("level", "In Progress")
          .order("created_at", { ascending: true })
          .limit(7);
        historyData = data;
      }
      if (historyData && historyData.length > 0) {
        setTrend(
          historyData.map((h: any) => ({
            score: h.score ?? 0,
            date: new Date(h.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            }),
          })),
        );
      }
    } catch (err) {
      console.error("Error fetching report data:", err);
    } finally {
      setLoading(false);
    }
  };

  let metaName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  let fullName = storedName || metaName;
  if (!fullName || fullName === user?.email?.split("@")[0]) {
    const rawPrefix = user?.email ? user.email.split("@")[0] : "";
    if (rawPrefix.toLowerCase().includes("anjalibommisetty")) {
      fullName = "Anjali Bommisetty";
    } else if (rawPrefix) {
      const clean = rawPrefix.replace(/[0-9_]/g, " ").trim();
      fullName = clean ? clean.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : rawPrefix;
    } else {
      fullName = "User";
    }
  }

  const nameParts = fullName.split(" ").filter(Boolean);
  const initials = nameParts.length >= 2 ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() : fullName.substring(0, 2).toUpperCase();

  const answers = assessment?.answers || {};
  const detailsAnswers = detailsAssessment?.answers || {};
  const patientName = assessment?.patient_name && !assessment.patient_name.includes("@") && !assessment.patient_name.startsWith("[Scan]") ? assessment.patient_name : fullName;
  const patientAge = storedAge || user?.user_metadata?.age || detailsAnswers.q1 || "—";
  const patientGender = storedGender || user?.user_metadata?.gender || detailsAnswers.q2 || "—";
  const patientArea = detailsAnswers.q3 || "—";
  const patientEducation = detailsAnswers.q4 || "—";
  const tobaccoUse = detailsAnswers.q23 || "—";
  const assessmentDate = assessment?.created_at
    ? new Date(assessment.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  const riskLevel = assessment?.level || params?.level || "Low";
  const riskScore = assessment?.score ?? currentScore;
  const riskColor =
    riskLevel === "High" ? "#EF4444" : riskLevel === "Medium" ? "#F59E0B" : "#10B981";

  const CHART_HEIGHT = 110;
  // trend is now [{score, date}]
  const hasTrend = trend.length >= 2;
  const maxScore = hasTrend ? Math.max(...trend.map((t: any) => t.score), 1) : 100;

  const getRiskRecommendations = () => {
    if (riskLevel === "High") {
      return [
        {
          icon: "alert-triangle",
          title: "Urgent Dental Consultation",
          text: "Schedule an in-person dental check-up within 1-2 weeks for evaluation.",
        },
        {
          icon: "shield-off",
          title: "Gingival & Plaque Control",
          text: "Brush gently twice daily using fluoride toothpaste and an ultra-soft toothbrush.",
        },
        {
          icon: "disc",
          title: "Daily Interdental Cleaning",
          text: "Floss carefully every night to remove plaque buildup between teeth.",
        },
        {
          icon: "coffee",
          title: "Strict Dietary Sugar Control",
          text: "Limit sugary snacks, sodas, and sweet drinks to prevent cavity progression.",
        },
        {
          icon: "slash",
          title: "Lifestyle Habit Adjustment",
          text: "Avoid tobacco products and limit alcohol consumption to protect gums.",
        },
      ];
    } else if (riskLevel === "Medium") {
      return [
        {
          icon: "coffee",
          title: "Dietary Sugar Management",
          text: "Reduce sugary snacks and acidic drinks to protect enamel from erosion.",
        },
        {
          icon: "sun",
          title: "Twice Daily Brushing",
          text: "Brush thoroughly twice daily for 2 minutes and floss every evening.",
        },
        {
          icon: "droplet",
          title: "Antibacterial Mouth Rinsing",
          text: "Use an alcohol-free antibacterial mouthwash daily after brushing.",
        },
        {
          icon: "calendar",
          title: "Routine Checkup",
          text: "Schedule your next 6-monthly dental cleaning and preventive exam.",
        },
      ];
    } else {
      return [
        {
          icon: "check-circle",
          title: "Hygiene Maintenance",
          text: "Maintain your current routine of twice-daily brushing and daily flossing.",
        },
        {
          icon: "droplet",
          title: "Optimal Hydration",
          text: "Drink plenty of water throughout the day to support saliva protection.",
        },
        {
          icon: "calendar",
          title: "Preventive Care",
          text: "Continue regular 6-month preventive dental checkups.",
        },
      ];
    }
  };

  const recommendations = getRiskRecommendations();

  const handleShare = async () => {
    const message = `SmileGuard Dental Health Report\nPatient: ${patientName}\nAge: ${patientAge} | Gender: ${patientGender}\nRisk Score: ${riskScore}% (${riskLevel} Risk)\nAssessment Date: ${assessmentDate}\n\nKey Recommendations:\n${recommendations.map((r) => `• ${r.title}: ${r.text}`).join("\n")}`;

    try {
      if (Platform.OS === "web") {
        if (typeof navigator !== "undefined" && navigator.share) {
          await navigator.share({
            title: "SmileGuard Health Report",
            text: message,
          });
        } else if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(message);
          Alert.alert("Copied to Clipboard", "Health Report summary copied to your clipboard!");
        } else {
          Alert.alert("Health Report Summary", message);
        }
      } else {
        await Share.share({
          message: message,
          title: "SmileGuard Health Report",
        });
      }
    } catch (err: any) {
      console.log("Share error:", err);
    }
  };

  return (
    <PhoneShell showNav={false}>
      <ScreenHeader title="Full Report" back="Results" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardLabel}>PATIENT DETAILS</Text>
          <View style={styles.patientRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.patientName}>{patientName}</Text>
              <Text style={styles.patientMeta}>Patient ID: {user?.id?.slice(0, 8) || "N/A"}</Text>
            </View>
            <View
              style={[
                styles.riskBadge,
                { backgroundColor: riskColor + "20", borderColor: riskColor },
              ]}
            >
              <Text style={[styles.riskBadgeText, { color: riskColor }]}>{riskLevel} Risk</Text>
            </View>
          </View>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Age</Text>
              <Text style={styles.detailValue}>{patientAge} yrs</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{patientGender}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Area</Text>
              <Text style={styles.detailValue}>{patientArea}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{assessmentDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Education</Text>
              <Text style={styles.detailValue}>{patientEducation}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Tobacco</Text>
              <Text style={styles.detailValue}>{tobaccoUse}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.trendHeader}>
            <Text style={styles.cardTitle}>Risk Trend</Text>
            {hasTrend &&
              (() => {
                const last = trend[trend.length - 1]?.score ?? 0;
                const prev = trend[trend.length - 2]?.score ?? 0;
                const diff = last - prev;
                const isUp = diff >= 0;
                return (
                  <View
                    style={[
                      styles.trendBadge,
                      { backgroundColor: isUp ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)" },
                    ]}
                  >
                    <Feather
                      name={isUp ? "trending-up" : "trending-down"}
                      size={12}
                      color={isUp ? "#EF4444" : "#10B981"}
                    />
                    <Text style={[styles.trendBadgeText, { color: isUp ? "#EF4444" : "#10B981" }]}>
                      {diff > 0 ? `+${diff}` : diff === 0 ? "No change" : `${diff}`} since last
                    </Text>
                  </View>
                );
              })()}
          </View>
          {!hasTrend ? (
            <View style={styles.emptyTrend}>
              <Feather name="bar-chart-2" size={32} color="#CBD5E1" />
              <Text style={styles.emptyTrendText}>
                {trend.length === 1
                  ? "Only 1 assessment found. Complete more assessments to see your risk trend over time."
                  : "No assessments found. Complete your first assessment to start tracking."}
              </Text>
            </View>
          ) : (
            <View style={{ marginTop: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  height: CHART_HEIGHT,
                  gap: 6,
                }}
              >
                {trend.map((item: any, idx: number) => {
                  const v = item.score;
                  const barH = Math.max(6, Math.round((v / maxScore) * CHART_HEIGHT));
                  const barColor = v >= 60 ? "#EF4444" : v >= 30 ? "#F59E0B" : "#10B981";
                  return (
                    <View
                      key={idx}
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "flex-end",
                        height: CHART_HEIGHT,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          color: "#64748B",
                          marginBottom: 3,
                          fontWeight: "600",
                        }}
                      >
                        {v}%
                      </Text>
                      <View
                        style={{
                          width: "75%",
                          height: barH,
                          backgroundColor: barColor,
                          borderTopLeftRadius: 6,
                          borderTopRightRadius: 6,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
              {/* X-axis date labels */}
              <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
                {trend.map((item: any, idx: number) => (
                  <Text
                    key={idx}
                    style={{
                      flex: 1,
                      fontSize: 8,
                      color: "#94A3B8",
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    {item.date}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.cardBeige}>
          <Text style={styles.cardTitle}>Health Explanation</Text>
          <Text style={styles.explanationText}>
            {assessment?.explanation ||
              "The model analysis identifies risk drivers based on your reported dental symptoms and habits. Maintain regular checkups to monitor progression."}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Early Intervention</Text>
          <Text style={styles.datasetTag}>Personalized Recommendations</Text>
          <View style={styles.recList}>
            {recommendations.map((rec, idx) => (
              <View key={idx} style={styles.recItem}>
                <View
                  style={[
                    styles.recIconWrap,
                    {
                      backgroundColor:
                        rec.title === "Urgency" && riskLevel === "High" ? "#FEE2E2" : "#E0F2FE",
                    },
                  ]}
                >
                  <Feather
                    name={rec.icon as any}
                    size={16}
                    color={rec.title === "Urgency" && riskLevel === "High" ? "#EF4444" : "#0284C7"}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text style={styles.recText}>{rec.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {assessment?.probabilities && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Probability Map</Text>
            <View style={styles.probGrid}>
              {assessment.probabilities.map((p: any) => (
                <View key={p.label} style={styles.probBox}>
                  <Text style={styles.probLabel}>{p.label}</Text>
                  <Text style={styles.probVal}>{p.value}%</Text>
                  <View style={styles.probBarBg}>
                    <View
                      style={[
                        styles.probBarFill,
                        { width: `${p.value}%`, backgroundColor: p.color || "#86F1D4" },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnSecondary}
            activeOpacity={0.8}
            onPress={handleShare}
          >
            <Feather name="share-2" size={16} color="#0F172A" />
            <Text style={styles.btnSecondaryText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimary}
            activeOpacity={0.8}
            onPress={() => {
              if (typeof window !== "undefined" && window.print) {
                window.print();
              } else {
                Alert.alert("Downloaded", "Report downloaded to your device.");
              }
            }}
          >
            <Feather name="download" size={16} color="#0D4B42" />
            <Text style={styles.btnPrimaryText}>Download PDF</Text>
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
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#64748B",
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#86F1D4",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D4B42",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  patientMeta: {
    fontSize: 12,
    color: "#64748B",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  trendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#EF4444",
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 128,
    marginTop: 20,
    gap: 8,
  },
  barCol: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  barFill: {
    width: "100%",
    backgroundColor: "#86F1D4",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barLabel: {
    fontSize: 10,
    color: "#94A3B8",
  },
  cardBeige: {
    backgroundColor: "#F1F5F9", // Beige approx
    borderRadius: 24,
    padding: 20,
  },
  explanationText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(15, 23, 42, 0.8)",
  },
  probGrid: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  probBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
  },
  probLabel: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  probVal: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },
  probBarBg: {
    marginTop: 8,
    height: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    overflow: "hidden",
  },
  probBarFill: {
    height: "100%",
    borderRadius: 3,
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
  emptyTrend: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 10,
  },
  emptyTrendText: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  riskBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    gap: 10,
  },
  detailItem: {
    width: "47%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
  },
  detailLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  datasetTag: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 2,
    marginBottom: 10,
  },
  recList: {
    gap: 12,
  },
  recItem: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  recIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  recText: {
    fontSize: 12,
    color: "#475569",
    marginTop: 2,
    lineHeight: 16,
  },
});
