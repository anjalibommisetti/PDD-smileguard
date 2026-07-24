import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PhoneShellProps {
  children: React.ReactNode;
  showNav?: boolean;
  isDarkMode?: boolean;
}

export const PhoneShell = ({ children, showNav = true, isDarkMode: customDark }: PhoneShellProps) => {
  const { width } = useWindowDimensions();
  const [dark, setDark] = useState<boolean>(customDark ?? false);

  useEffect(() => {
    if (customDark !== undefined) {
      setDark(customDark);
    } else {
      AsyncStorage.getItem("@smileguard_dark_mode").then((val) => {
        if (val !== null) setDark(val === "true");
      });
    }
  }, [customDark]);

  const bgRoot = dark ? "#0F172A" : Platform.OS === "web" ? "#E2E8F0" : "#F8FAFC";
  const bgContainer = dark ? "#0F172A" : "#F8FAFC";

  return (
    <View style={[styles.root, { backgroundColor: bgRoot }]}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bgContainer }, Platform.OS === "web" && styles.webSafeArea]}>
        <View style={[styles.container, { backgroundColor: bgContainer }]}>{children}</View>
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
    maxWidth: "100%",
    height: "100%",
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
