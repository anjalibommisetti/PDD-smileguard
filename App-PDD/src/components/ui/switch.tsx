import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Switch as RNSwitch,
} from "react-native";
import * as React from "react";

const Switch = ({ checked, onCheckedChange, disabled, style }: any) => {
  return (
    <RNSwitch
      value={checked}
      onValueChange={onCheckedChange}
      disabled={disabled}
      trackColor={{ false: "#E2E8F0", true: "#86F1D4" }}
      thumbColor={checked ? "#157A6E" : "#FFFFFF"}
    />
  );
};

export { Switch };
