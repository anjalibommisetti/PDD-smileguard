import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { User, Stethoscope, ShieldCheck, ArrowLeft } from "lucide-react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RoleSelectionScreen() {
  const navigation = useNavigation<any>();

  const selectRole = async (role: string) => {
    await AsyncStorage.setItem("selectedSignupRole", role);
    navigation.navigate("Signup");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FBFB" }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingVertical: 48,
          maxWidth: 448,
          width: "100%",
          alignSelf: "center",
        }}
      >
        {/* Header */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginBottom: 32,
            padding: 8,
            marginLeft: -8,
            borderRadius: 999,
            alignSelf: "flex-start",
          }}
        >
          <ArrowLeft className="w-6 h-6 text-slate-500" />
        </TouchableOpacity>

        <Text style={{ fontSize: 30, fontWeight: "700", color: "#0f172a", marginBottom: 8 }}>
          Select Your Role
        </Text>
        <Text style={{ fontSize: 16, color: "#64748b", marginBottom: 40 }}>
          Choose how you want to use SmileGuard AI to get started with your account.
        </Text>

        {/* Role Cards */}
        <View style={{ gap: 16 }}>
          <TouchableOpacity
            onPress={() => selectRole("patient")}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: 24,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: "#f1f5f9",
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#eff6ff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User className="w-7 h-7 text-blue-600" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#0f172a", marginBottom: 4 }}>
                Patient
              </Text>
              <Text style={{ fontSize: 14, color: "#64748b" }}>
                Scan your teeth, track oral health, and book appointments.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selectRole("doctor")}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: 24,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: "#f1f5f9",
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#ecfdf5",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stethoscope className="w-7 h-7 text-emerald-600" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#0f172a", marginBottom: 4 }}>
                Doctor
              </Text>
              <Text style={{ fontSize: 14, color: "#64748b" }}>
                Review patient scans, manage appointments, and prescribe.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selectRole("admin")}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: 24,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: "#f1f5f9",
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#faf5ff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck className="w-7 h-7 text-purple-600" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#0f172a", marginBottom: 4 }}>
                Administrator
              </Text>
              <Text style={{ fontSize: 14, color: "#64748b" }}>
                Manage system settings, verify doctors, and view overall metrics.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: "auto", paddingTop: 32, alignItems: "center" }}>
          <Text style={{ color: "#64748b" }}>
            Already have an account?{" "}
            <Text
              onPress={() => navigation.navigate("Login")}
              style={{ color: "#2563eb", fontWeight: "700" }}
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
