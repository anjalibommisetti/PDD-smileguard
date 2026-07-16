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
import { Dialog as PaperDialog, Portal } from "react-native-paper";

const Dialog = ({ open, onOpenChange, children }: any) => {
  return (
    <Portal>
      <PaperDialog visible={open} onDismiss={() => onOpenChange?.(false)}>
        {children}
      </PaperDialog>
    </Portal>
  );
};

const DialogContent = ({ children }: any) => <PaperDialog.Content>{children}</PaperDialog.Content>;

const DialogHeader = ({ children }: any) => <View style={styles.header}>{children}</View>;

const DialogFooter = ({ children }: any) => <PaperDialog.Actions>{children}</PaperDialog.Actions>;

const DialogTitle = ({ children }: any) => <PaperDialog.Title>{children}</PaperDialog.Title>;

const DialogDescription = ({ children }: any) => <Text style={styles.description}>{children}</Text>;

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
});

export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
