import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions,
  useWindowDimensions,
} from "react-native";

interface PhoneShellProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const PhoneShell = ({ children, showNav = true }: PhoneShellProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;

  return (
    <View style={styles.root}>
      <SafeAreaView style={[styles.safeArea, Platform.OS === "web" && styles.webSafeArea]}>
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#E2E8F0" : "#F8FAFC",
    alignItems: "stretch",
    height: Platform.OS === "web" ? "100%" : undefined,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    width: "100%",
  },
  webSafeArea: {
    width: "100%",
    maxWidth: "100%", // Changed to 100% for full desktop layout
    height: "100%", // Critical for web visibility
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
});
