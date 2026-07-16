import { View, StyleSheet } from "react-native";
import * as React from "react";

const Separator = ({ orientation = "horizontal", style }: any) => {
  return (
    <View
      style={[
        styles.separator,
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#E2E8F0",
  },
  horizontal: {
    height: 1,
    width: "100%",
  },
  vertical: {
    height: "100%",
    width: 1,
  },
});

export { Separator };
