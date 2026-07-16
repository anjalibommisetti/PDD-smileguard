import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import * as React from "react";

const Badge = ({ children, variant, style, textStyle }: any) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondary;
      case "destructive":
        return styles.destructive;
      case "outline":
        return styles.outline;
      default:
        return styles.default;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outlineText;
      default:
        return styles.defaultText;
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle(), style]}>
      <Text style={[getTextStyle(), textStyle]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  default: {
    backgroundColor: "#157A6E",
  },
  secondary: {
    backgroundColor: "#F1F5F9",
  },
  destructive: {
    backgroundColor: "#EF4444",
  },
  outline: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "transparent",
  },
  defaultText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  outlineText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0F172A",
  },
});

export { Badge };
