import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, Image, StyleSheet, SafeAreaView, Pressable, ActivityIndicator, Keyboard, Alert } from "react-native";
import tw from 'twrnc';

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { supabase } from "../lib/supabase";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignupScreen() {
  console.log("SignupScreen rendered");
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Role specific state removed

  const handleSignup = async () => {
    setErrorMessage("");
    if (!email || !password || !fullName) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    // Removed role-specific validation

    setLoading(true);
    console.log("Attempting signup for:", email.trim());
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      console.error("Signup error:", error);
      setErrorMessage(error.message);
      Alert.alert("Signup Problem", `We encountered an issue during signup:\n\n${error.message}`);
    } else {
      console.log("Signup successful:", data);
      Keyboard?.dismiss?.();

      if (fullName) {
        await AsyncStorage.setItem("user_full_name", fullName);
      }

      Alert.alert("Success", "Registration successful! You can now log in to access your portal.");
      navigation.navigate("Login");
    }
  };

  return (
    <PhoneShell showNav={false}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color="#EF4444" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={(val) => {
              setFullName(val);
              setErrorMessage("");
            }}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
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

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#0D4B42" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Keyboard?.dismiss?.();
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.link}>Already have an account? Login</Text>
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
