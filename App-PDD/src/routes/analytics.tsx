import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Activity, TrendingUp, Users, Target } from "lucide-react-native";

// Mock Data
const monthlyCasesData = [
  { name: "Jan", caries: 40, gingivitis: 24, calculus: 15 },
  { name: "Feb", caries: 30, gingivitis: 13, calculus: 22 },
  { name: "Mar", caries: 20, gingivitis: 98, calculus: 22 },
  { name: "Apr", caries: 27, gingivitis: 39, calculus: 20 },
  { name: "May", caries: 18, gingivitis: 48, calculus: 21 },
  { name: "Jun", caries: 23, gingivitis: 38, calculus: 25 },
];

const riskDistributionData = [
  { name: "Low Risk", percentage: 40, color: "#10B981" },
  { name: "Medium Risk", percentage: 30, color: "#F59E0B" },
  { name: "High Risk", percentage: 30, color: "#EF4444" },
];

const accuracyTrendData = [
  { name: "Week 1", accuracy: 92 },
  { name: "Week 2", accuracy: 94 },
  { name: "Week 3", accuracy: 95 },
  { name: "Week 4", accuracy: 98.5 },
];

export default function AnalyticsDashboard() {
  const stats = [
    { label: "Total Scans (Month)", value: "12,450", icon: Activity, change: "+14%", color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Active Patients", value: "8,234", icon: Users, change: "+5%", color: "#0D9488", bg: "#F0FDFA" },
    { label: "AI Accuracy Avg", value: "98.5%", icon: Target, change: "+2.1%", color: "#10B981", bg: "#ECFDF5" },
    { label: "High Risk Cases", value: "1,240", icon: TrendingUp, change: "-3%", color: "#EF4444", bg: "#FEF2F2" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Platform Analytics</Text>
        <Text style={styles.subtitle}>
          Overview of oral disease statistics, patient trends, and AI accuracy.
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.grid}>
        {stats.map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={styles.statRow}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={[styles.statChange, { color: stat.change.startsWith("+") ? "#10B981" : "#EF4444" }]}>
                  {stat.change}
                </Text>
              </View>
            </View>
            <View style={[styles.iconContainer, { backgroundColor: stat.bg }]}>
              <stat.icon size={22} color={stat.color} />
            </View>
          </View>
        ))}
      </View>

      {/* Monthly Cases */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Disease Distribution</Text>
        <Text style={styles.cardSubtitle}>Relative distribution of detected conditions</Text>
        <View style={styles.chartContainer}>
          {monthlyCasesData.map((data, idx) => {
            const total = data.caries + data.gingivitis + data.calculus;
            return (
              <View key={idx} style={styles.chartRow}>
                <Text style={styles.rowLabel}>{data.name}</Text>
                <View style={styles.rowBarContainer}>
                  <View style={[styles.rowBarSegment, { width: `${(data.caries / total) * 100}%`, backgroundColor: "#EF4444" }]} />
                  <View style={[styles.rowBarSegment, { width: `${(data.gingivitis / total) * 100}%`, backgroundColor: "#F59E0B" }]} />
                  <View style={[styles.rowBarSegment, { width: `${(data.calculus / total) * 100}%`, backgroundColor: "#3B82F6" }]} />
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
            <Text style={styles.legendText}>Caries</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#F59E0B" }]} />
            <Text style={styles.legendText}>Gingivitis</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#3B82F6" }]} />
            <Text style={styles.legendText}>Calculus</Text>
          </View>
        </View>
      </View>

      {/* Risk Category & Accuracy */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Risk Category Distribution</Text>
        <View style={{ gap: 16, marginTop: 12 }}>
          {riskDistributionData.map((item, idx) => (
            <View key={idx}>
              <View style={styles.distributionMeta}>
                <Text style={styles.distributionLabel}>{item.name}</Text>
                <Text style={styles.distributionValue}>{item.percentage}%</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Accuracy Trend */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Prediction Accuracy Trend</Text>
        <View style={{ gap: 12, marginTop: 12 }}>
          {accuracyTrendData.map((item, idx) => (
            <View key={idx} style={styles.trendRow}>
              <Text style={styles.trendName}>{item.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1, justifyContent: "flex-end" }}>
                <View style={[styles.progressBg, { width: 120 }]}>
                  <View style={[styles.progressFill, { width: `${item.accuracy}%`, backgroundColor: "#10B981" }]} />
                </View>
                <Text style={styles.trendValue}>{item.accuracy}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  grid: {
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },
  statChange: {
    fontSize: 12,
    fontWeight: "bold",
  },
  iconContainer: {
    padding: 10,
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 16,
  },
  chartContainer: {
    gap: 12,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowLabel: {
    width: 32,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  rowBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    flexDirection: "row",
    overflow: "hidden",
  },
  rowBarSegment: {
    height: "100%",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  distributionMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  distributionLabel: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  distributionValue: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  progressBg: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trendName: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  trendValue: {
    width: 40,
    textAlign: "right",
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
});
