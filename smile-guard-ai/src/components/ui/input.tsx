import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
  ScrollView,
  Image,
} from "react-native";
import * as React from "react";
import { TextInput as PaperInput } from "react-native-paper";

const Input = React.forwardRef<any, any>(({ style, ...props }, ref) => {
  return (
    <PaperInput
      ref={ref}
      mode="outlined"
      style={[styles.input, style]}
      outlineStyle={styles.outline}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    height: 48,
    backgroundColor: "#FFFFFF",
  },
  outline: {
    borderRadius: 8,
    borderColor: "#E2E8F0",
  },
});

Input.displayName = "Input";

export { Input };
