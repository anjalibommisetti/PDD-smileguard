import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";

const alerts = [
  {
    icon: "shield",
    title: "High risk detected",
    desc: "Your latest score (78%) requires attention.",
    time: "2h ago",
    tone: "alert",
  },
  {
    icon: "clock",
    title: "Follow-up reminder",
    desc: "Schedule a dental visit within 14 days.",
    time: "Today",
    tone: "warning",
  },
  {
    icon: "bell",
    title: "Brushing reminder",
    desc: "Don't forget your evening brush!",
    time: "8:00 PM",
    tone: "mint",
  },
  {
    icon: "check-circle",
    title: "Health improving",
    desc: "You've maintained your streak for 5 days.",
    time: "Yesterday",
    tone: "success",
  },
  {
    icon: "alert-triangle",
    title: "Low health compliance",
    desc: "Recommendations from last visit not followed.",
    time: "3d ago",
    tone: "warning",
  },
];

export default function AlertsScreen() {
  return (
    <PhoneShell>
      <ScreenHeader title="Alerts" subtitle="Stay on top of your care" />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {alerts.map((a, idx) => {
            const bgTone =
              a.tone === "alert"
                ? "rgba(239, 68, 68, 0.15)"
                : a.tone === "warning"
                  ? "rgba(255, 205, 178, 0.4)"
                  : "rgba(134, 241, 212, 0.4)";
            const fgTone =
              a.tone === "alert" ? "#EF4444" : a.tone === "warning" ? "#7C3AED" : "#0D4B42";

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
    </PhoneShell>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 24,
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
  },
});
