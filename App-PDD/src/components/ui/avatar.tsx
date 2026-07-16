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
import { Avatar as PaperAvatar } from "react-native-paper";

const Avatar = ({ children, style }: any) => <View style={[styles.avatar, style]}>{children}</View>;

const AvatarImage = ({ source, style }: any) => (
  <PaperAvatar.Image size={40} source={source} style={style} />
);

const AvatarFallback = ({ children, style, textStyle }: any) => (
  <PaperAvatar.Text
    size={40}
    label={typeof children === "string" ? children : ""}
    style={[styles.fallback, style]}
    labelStyle={textStyle}
  />
);

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  fallback: {
    backgroundColor: "#E2E8F0",
  },
});

export { Avatar, AvatarImage, AvatarFallback };
