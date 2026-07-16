import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { supabase } from "../lib/supabase";
import { Feather } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const msg = error.message || "";
        if (
          msg.includes("Failed to fetch") ||
          msg.includes("fetch") ||
          msg.includes("Network") ||
          msg.includes("ERR_CONNECTION")
        ) {
          setErrorMessage("⚠ No internet connection. Please check your network and try again.");
        } else if (msg.includes("Invalid login credentials")) {
          setErrorMessage("Incorrect email or password. Please try again.");
        } else if (msg.includes("Email not confirmed")) {
          setErrorMessage(
            "Please verify your email first. Check your inbox for the verification link.",
          );
        } else {
          setErrorMessage(msg || "Login failed. Please try again.");
        }
      } else if (data?.session) {
        // Fetch actual role from user metadata
        let role = data.session.user.user_metadata?.role;

        // --- AUTO-ROUTING FOR TESTING ---
        const userEmail = email.toLowerCase();
        if (userEmail.includes("doctor") || userEmail.includes("doc")) {
          role = "doctor";
        } else if (userEmail.includes("admin")) {
          role = "admin";
        } else if (userEmail.includes("patient")) {
          role = "patient";
        }

        // Fallback
        if (!role) {
          role = "patient";
        }

        await AsyncStorage.setItem("userRole", role);

        if (role === "admin") navigation.navigate("AdminDashboard");
        else if (role === "doctor") navigation.navigate("DoctorDashboard");
        else navigation.navigate("Dashboard");
      }
    } catch (err: any) {
      setErrorMessage("⚠ No internet connection. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneShell showNav={false}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome back</Text>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color="#EF4444" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              setErrorMessage("");
            }}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginTop: -8, marginBottom: 16 }}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={{ color: "#64748B", fontWeight: "500", fontSize: 14 }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#0D4B42" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              navigation.navigate("RoleSelection");
            }}
          >
            <Text style={styles.link}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PhoneShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 16,
    maxWidth: 448,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  passwordInput: {
    flex: 1,
    padding: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  roleContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
  },
  roleOptions: {
    flexDirection: "row",
    gap: 12,
  },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  roleOptionActive: {
    borderColor: "#86F1D4",
    backgroundColor: "#E6FAF4",
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  roleOptionTextActive: {
    color: "#0D4B42",
  },
  button: {
    backgroundColor: "#86F1D4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    minHeight: 56,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#0D4B42",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    marginTop: 16,
    color: "#64748B",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginBottom: 8,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
});
