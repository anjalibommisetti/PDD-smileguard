import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  back?: string;
  onBack?: () => void;
}

export const ScreenHeader = ({
  title,
  subtitle,
  showBack = false,
  back,
  onBack,
}: ScreenHeaderProps) => {
  const navigation = useNavigation<any>();

  const shouldShowBack = showBack || !!back || !!onBack;

  return (
    <View style={styles.header}>
      {shouldShowBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (onBack) {
              onBack();
            } else if (back) {
              navigation.navigate(back, { tab: back });
            } else {
              navigation.goBack();
            }
          }}
        >
          <Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {/* Invisible placeholder for alignment if back button exists */}
      {shouldShowBack && <View style={styles.backButton} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centers title container by default
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 1, // Ensure button is clickable above titleContainer if needed
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
});
