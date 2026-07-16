import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { supabase } from "../lib/supabase";
import { ArrowLeft } from "lucide-react-native";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(route.params?.step || 1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const startTimer = () => {
    setTimer(120);
    setCanResend(false);
  };

  const handleSendOtp = async () => {
    setMessage("");
    setErrorMsg("");
    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage("An OTP has been sent to your email.");
      setStep(2);
      startTimer();
    }
  };

  const handleResendOtp = async () => {
    setMessage("");
    setErrorMsg("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage("A new OTP has been sent to your email.");
      startTimer();
    }
  };

  const handleVerifyOtp = async () => {
    setMessage("");
    setErrorMsg("");
    if (!otp) {
      setErrorMsg("Please enter the OTP.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "recovery",
    });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else if (data?.session) {
      setMessage("OTP verified successfully. Please enter a new password.");
      setStep(3);
    } else {
      setErrorMsg("Invalid OTP or expired.");
    }
  };

  const handleResetPassword = async () => {
    setMessage("");
    setErrorMsg("");
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      Alert.alert("Success", "Your password has been changed successfully. You can now log in.");
      await supabase.auth.signOut();
      navigation.navigate("Login");
    }
  };

  return (
    <PhoneShell showNav={false}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#64748b" />
        </TouchableOpacity>

        <Text style={styles.title}>
          {step === 1 ? "Reset Password" : step === 2 ? "Verify OTP" : "New Password"}
        </Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? "Enter the email associated with your account and we'll send you an OTP."
            : step === 2
              ? `Enter the 6-digit OTP sent to ${email}`
              : "Enter your new password to secure your account."}
        </Text>

        {errorMsg ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {message ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{message}</Text>
          </View>
        ) : null}

        {step === 1 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#0D4B42" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#0D4B42" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              {canResend ? (
                <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>
                  Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                </Text>
              )}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0D4B42" />
              ) : (
                <Text style={styles.buttonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </>
        )}
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
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 24,
    lineHeight: 22,
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
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
  errorContainer: {
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "500",
  },
  successContainer: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  successText: {
    color: "#16A34A",
    fontSize: 14,
    fontWeight: "500",
  },
  resendContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  resendText: {
    color: "#0D4B42",
    fontWeight: "600",
    fontSize: 14,
  },
  timerText: {
    color: "#64748b",
    fontSize: 14,
  },
});
