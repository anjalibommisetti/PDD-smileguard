import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

export const BottomNav = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const navItems = [
    { name: "Dashboard", icon: "home", label: "Home" },
    { name: "Assessment", icon: "activity", label: "Checkup" },
    { name: "History", icon: "clock", label: "History" },
    { name: "Profile", icon: "user", label: "Profile" },
  ];

  return (
    <View style={styles.navContainer}>
      {navItems.map((item) => {
        const isActive = route.name === item.name;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.name)}
          >
            <Feather name={item.icon as any} size={24} color={isActive ? "#157A6E" : "#64748B"} />
            <Text style={[styles.navLabel, isActive && styles.activeLabel]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    paddingHorizontal: 10,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  activeLabel: {
    color: "#157A6E",
    fontWeight: "600",
  },
});
