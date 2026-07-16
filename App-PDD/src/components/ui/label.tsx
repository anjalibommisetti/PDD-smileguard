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

const Label = ({ children, style }: any) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
    marginBottom: 4,
  },
});

export { Label };
