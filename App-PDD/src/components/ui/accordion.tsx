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
import { List } from "react-native-paper";

const Accordion = ({ children }: any) => <List.Section>{children}</List.Section>;

const AccordionItem = ({ children, value }: any) => {
  return <View style={styles.item}>{children}</View>;
};

const AccordionTrigger = ({ children, title }: any) => (
  <List.Accordion title={title || children} titleStyle={styles.triggerText} style={styles.trigger}>
    {children}
  </List.Accordion>
);

const AccordionContent = ({ children }: any) => <View style={styles.content}>{children}</View>;

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  trigger: {
    backgroundColor: "transparent",
    paddingVertical: 4,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  content: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
