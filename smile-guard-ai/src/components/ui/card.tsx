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
import { Card as PaperCard, Title, Paragraph } from "react-native-paper";

const Card = ({ children, style }: any) => (
  <PaperCard style={[styles.card, style]}>{children}</PaperCard>
);

const CardHeader = ({ children, style }: any) => (
  <View style={[styles.header, style]}>{children}</View>
);

const CardTitle = ({ children, style }: any) => (
  <Title style={[styles.title, style]}>{children}</Title>
);

const CardDescription = ({ children, style }: any) => (
  <Paragraph style={[styles.description, style]}>{children}</Paragraph>
);

const CardContent = ({ children, style }: any) => (
  <PaperCard.Content style={[styles.content, style]}>{children}</PaperCard.Content>
);

const CardFooter = ({ children, style }: any) => (
  <PaperCard.Actions style={[styles.footer, style]}>{children}</PaperCard.Actions>
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },
  description: {
    fontSize: 14,
    color: "#64748B",
  },
  content: {
    padding: 16,
  },
  footer: {
    justifyContent: "flex-end",
    padding: 8,
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
