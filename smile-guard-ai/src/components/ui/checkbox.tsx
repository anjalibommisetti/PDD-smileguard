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
import { Checkbox as PaperCheckbox } from "react-native-paper";

const Checkbox = ({ checked, onCheckedChange, disabled, style }: any) => {
  return (
    <PaperCheckbox
      status={checked ? "checked" : "unchecked"}
      onPress={() => onCheckedChange?.(!checked)}
      disabled={disabled}
      color="#157A6E"
    />
  );
};

export { Checkbox };
