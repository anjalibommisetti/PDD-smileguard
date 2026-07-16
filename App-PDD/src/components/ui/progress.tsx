import { View, StyleSheet } from "react-native";
import * as React from "react";
import { ProgressBar } from "react-native-paper";

const Progress = ({ value, style, color }: any) => {
  return (
    <ProgressBar
      progress={(value || 0) / 100}
      color={color || "#157A6E"}
      style={[styles.progress, style]}
    />
  );
};

const styles = StyleSheet.create({
  progress: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
});

export { Progress };
