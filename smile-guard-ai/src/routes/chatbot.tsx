import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";

type Message = { id: string; text: string; sender: "user" | "bot" };

export default function ChatbotScreen() {
  const navigation = useNavigation<any>();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I am your SmileGuard AI assistant. How can I help you with your dental health today?",
      sender: "bot",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input.trim(), sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Generate response
    setTimeout(() => {
      let reply = "I'm sorry, I couldn't understand that. Could you please rephrase?";
      const lower = userMsg.text.toLowerCase();

      if (lower.includes("pain") || lower.includes("hurt")) {
        reply =
          "I'm sorry to hear you're in pain. Tooth pain can indicate an infection or cavity. I recommend booking an appointment with a dentist immediately. You can use the 'Book Visit' tool on your dashboard.";
      } else if (lower.includes("brush") || lower.includes("floss")) {
        reply =
          "You should brush your teeth at least twice a day for two minutes each time, using fluoride toothpaste. Don't forget to floss once a day to remove plaque between your teeth!";
      } else if (lower.includes("appointment") || lower.includes("book")) {
        reply =
          "You can book an appointment easily! Just return to the dashboard and click on the 'Book Visit' icon.";
      } else if (lower.includes("risk") || lower.includes("score")) {
        reply =
          "Your risk score is calculated by analyzing your dental scan or assessment answers using our AI model. A score above 60% indicates high risk and requires professional attention.";
      } else if (lower.includes("hello") || lower.includes("hi")) {
        reply = "Hello! How can I assist you with your oral care today?";
      }

      setMessages((prev) => [...prev, { id: Date.now().toString(), text: reply, sender: "bot" }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <PhoneShell>
      <ScreenHeader title="AI Assistant" subtitle="Your dental health advisor" back="Dashboard" />

      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.sender === "user" ? styles.messageRowUser : styles.messageRowBot,
              ]}
            >
              {msg.sender === "bot" && (
                <View style={styles.botAvatar}>
                  <Feather name="cpu" size={14} color="#FFF" />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  msg.sender === "user" ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={[styles.messageText, msg.sender === "user" && styles.messageTextUser]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
          {loading && (
            <View style={[styles.messageRow, styles.messageRowBot]}>
              <View style={styles.botAvatar}>
                <Feather name="cpu" size={14} color="#FFF" />
              </View>
              <View style={[styles.bubble, styles.botBubble, { width: 60, alignItems: "center" }]}>
                <ActivityIndicator size="small" color="#0D4B42" />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything about dental health..."
            placeholderTextColor="#94A3B8"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Feather name="send" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </PhoneShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  chatContainer: { padding: 20, gap: 16, paddingBottom: 40 },
  messageRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: 16 },
  messageRowUser: { justifyContent: "flex-end" },
  messageRowBot: { justifyContent: "flex-start" },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#157A6E",
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: { maxWidth: "80%", padding: 14, borderRadius: 20 },
  userBubble: { backgroundColor: "#157A6E", borderBottomRightRadius: 4 },
  botBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  messageText: { fontSize: 15, lineHeight: 22, color: "#334155" },
  messageTextUser: { color: "#FFFFFF" },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0F172A",
    outlineStyle: "none",
  } as any,
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#157A6E",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 2,
  },
  sendButtonDisabled: { backgroundColor: "#CBD5E1" },
});
