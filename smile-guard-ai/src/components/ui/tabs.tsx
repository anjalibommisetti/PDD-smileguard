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

const TabsContext = React.createContext<any>(null);

const Tabs = ({ value, onValueChange, children }: any) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <View style={styles.tabs}>{children}</View>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, style }: any) => (
  <View style={[styles.tabsList, style]}>{children}</View>
);

const TabsTrigger = ({ value, children, style }: any) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isActive = selectedValue === value;

  return (
    <TouchableOpacity
      style={[styles.tabsTrigger, isActive && styles.activeTrigger, style]}
      onPress={() => onValueChange?.(value)}
    >
      <Text style={[styles.triggerText, isActive && styles.activeText]}>{children}</Text>
    </TouchableOpacity>
  );
};

const TabsContent = ({ value, children }: any) => {
  const { value: selectedValue } = React.useContext(TabsContext);
  if (selectedValue !== value) return null;
  return <View style={styles.tabsContent}>{children}</View>;
};

const styles = StyleSheet.create({
  tabs: {
    width: "100%",
  },
  tabsList: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 4,
  },
  tabsTrigger: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTrigger: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  triggerText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  activeText: {
    color: "#0F172A",
    fontWeight: "600",
  },
  tabsContent: {
    marginTop: 12,
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };
