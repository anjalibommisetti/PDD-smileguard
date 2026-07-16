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

const Alert = ({ children, variant, style }: any) => {
  return (
    <View
      style={[styles.alert, variant === "destructive" ? styles.destructive : styles.default, style]}
    >
      {children}
    </View>
  );
};

const AlertTitle = ({ children, style }: any) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const AlertDescription = ({ children, style }: any) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  alert: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
    marginVertical: 8,
  },
  default: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
  },
  destructive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#64748B",
  },
});

export { Alert, AlertTitle, AlertDescription };
