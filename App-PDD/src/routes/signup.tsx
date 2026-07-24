import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, Image, StyleSheet, SafeAreaView, Pressable, ActivityIndicator, Keyboard, Alert } from "react-native";
import tw from 'twrnc';

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { supabase } from "../lib/supabase";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

function getPasswordStrength(pass: string) {
  if (!pass) return { score: 0, label: "", color: "#CBD5E1" };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak 🔴", color: "#EF4444", percent: "25%" };
  if (score === 2) return { score: 2, label: "Fair 🟠", color: "#F59E0B", percent: "50%" };
  if (score === 3) return { score: 3, label: "Strong 🟢", color: "#10B981", percent: "75%" };
  return { score: 4, label: "Very Strong 🔥", color: "#059669", percent: "100%" };
}

export default function SignupScreen() {
  console.log("SignupScreen rendered");
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passStrength = getPasswordStrength(password);

  const handleSignup = async () => {
    setErrorMessage("");
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password || !fullName) {
      setErrorMessage("Please fill in all required fields (Name, Email, Password)");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address (e.g. user@saveetha.com or user@gmail.com)");
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

    setLoading(true);
    console.log("Attempting signup for:", trimmedEmail);
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: fullName,
          age: age,
          gender: gender,
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
      if (age) {
        await AsyncStorage.setItem("user_age", age);
      }
      if (gender) {
        await AsyncStorage.setItem("user_gender", gender);
      }

      Alert.alert("Success", "Registration successful! You can now log in to access your portal.");
      navigation.navigate("Login");
    }
  };

  return (
    <PhoneShell showNav={false}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
            placeholder="Age (Years)"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />

          {/* Gender Selector */}
          <View style={styles.genderRow}>
            {["Male", "Female", "Other"].map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderBtn,
                  gender === g && styles.genderBtnActive,
                ]}
                onPress={() => setGender(g)}
              >
                <Text
                  style={[
                    styles.genderBtnText,
                    gender === g && styles.genderBtnTextActive,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email (e.g. name@saveetha.com or name@gmail.com)"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
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

          {/* Password Strength Meter */}
          {password.length > 0 && (
            <View style={styles.strengthWrap}>
              <View style={styles.strengthBg}>
                <View style={[styles.strengthFill, { width: passStrength.percent as any, backgroundColor: passStrength.color }]} />
              </View>
              <Text style={[styles.strengthText, { color: passStrength.color }]}>
                Strength: {passStrength.label}
              </Text>
            </View>
          )}

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
        </ScrollView>
      </View>
    </PhoneShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 10,
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
  strengthWrap: {
    marginTop: -8,
    gap: 4,
  },
  strengthBg: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
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
  genderRow: {
    flexDirection: "row",
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  genderBtnActive: {
    borderColor: "#0D4B42",
    backgroundColor: "rgba(134, 241, 212, 0.3)",
  },
  genderBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  genderBtnTextActive: {
    color: "#0D4B42",
    fontWeight: "700",
  },
});
