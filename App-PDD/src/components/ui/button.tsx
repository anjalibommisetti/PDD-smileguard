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
import { Button as PaperButton } from "react-native-paper";

const Button = React.forwardRef<any, any>(
  ({ children, variant, size, style, labelStyle, ...props }, ref) => {
    let mode: "text" | "outlined" | "contained" | "elevated" | "contained-tonal" = "contained";
    let buttonColor = undefined;
    let textColor = undefined;

    switch (variant) {
      case "destructive":
        buttonColor = "#EF4444";
        break;
      case "outline":
        mode = "outlined";
        break;
      case "secondary":
        mode = "contained-tonal";
        break;
      case "ghost":
      case "link":
        mode = "text";
        break;
      default:
        mode = "contained";
    }

    return (
      <PaperButton
        ref={ref}
        mode={mode}
        buttonColor={buttonColor}
        textColor={textColor}
        style={[styles.button, style]}
        labelStyle={[styles.label, labelStyle]}
        {...props}
      >
        {children}
      </PaperButton>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});

Button.displayName = "Button";

export { Button };
