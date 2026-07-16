import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { motion, AnimatePresence } from "framer-motion";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm your SmileGuard Assistant. How can I help you with your oral hygiene today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages([...messages, { text: userMsg, isBot: false }]);
    setInput("");

    // Generate response
    setTimeout(() => {
      let botResponse =
        "I can help you with oral hygiene tips, cavity prevention, and booking appointments.";
      const lower = userMsg.toLowerCase();

      if (lower.includes("brush") || lower.includes("hygiene")) {
        botResponse =
          "For optimal oral hygiene, brush twice a day with fluoride toothpaste for at least two minutes, and don't forget to floss daily!";
      } else if (lower.includes("cavity") || lower.includes("pain")) {
        botResponse =
          "Cavities occur due to plaque acid. To prevent them, reduce sugary foods and maintain good hygiene. If you have pain, please book an appointment with our dentists.";
      } else if (
        lower.includes("appointment") ||
        lower.includes("doctor") ||
        lower.includes("book")
      ) {
        botResponse =
          "You can easily book an appointment by visiting the 'Dentists' section in your dashboard.";
      } else if (lower.includes("disease") || lower.includes("gingivitis")) {
        botResponse =
          "Gingivitis is an early stage of gum disease characterized by red, swollen gums. Using an antibacterial mouthwash and flossing can help reverse it.";
      }

      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
    }, 1000);
  };

  if (Platform.OS !== "web") {
    return null; // For simplicity, floating chatbot is web-only
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        fontFamily: "sans-serif",
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: "absolute",
              bottom: "70px",
              right: "0px",
              width: "320px",
              height: "450px",
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid #E2E8F0",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "#0D4B42",
                padding: "16px",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Feather name="message-square" size={20} color="#86F1D4" />
                <span style={{ fontWeight: "bold" }}>Chat Assistant</span>
              </div>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Feather name="x" size={20} color="white" />
              </TouchableOpacity>
            </div>

            {/* Chat Area */}
            <div
              style={{
                flex: 1,
                padding: "16px",
                overflowY: "auto",
                backgroundColor: "#F8FAFC",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.isBot ? "flex-start" : "flex-end",
                    backgroundColor: msg.isBot ? "#E2E8F0" : "#86F1D4",
                    color: msg.isBot ? "#0F172A" : "#0D4B42",
                    padding: "10px 14px",
                    borderRadius: "16px",
                    borderBottomLeftRadius: msg.isBot ? "4px" : "16px",
                    borderBottomRightRadius: !msg.isBot ? "4px" : "16px",
                    maxWidth: "80%",
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "12px",
                backgroundColor: "#fff",
                borderTop: "1px solid #E2E8F0",
                display: "flex",
                gap: "8px",
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about oral health..."
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "20px",
                  border: "1px solid #E2E8F0",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  backgroundColor: "#0D4B42",
                  color: "#86F1D4",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Feather name="send" size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#0D4B42",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Feather name={isOpen ? "x" : "message-circle"} size={28} color="#86F1D4" />
      </TouchableOpacity>
    </div>
  );
}
