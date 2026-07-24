import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const badges = [
  { name: "Healthy Habits", icon: "star", tone: "mint" },
  { name: "Risk Reducer", icon: "shield", tone: "peach" },
  { name: "Consistent", icon: "award", tone: "beige" },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [latestScore, setLatestScore] = useState<number | null>(null);
  const [latestLevel, setLatestLevel] = useState<string | null>(null);
  const [riskChange, setRiskChange] = useState<number | null>(null);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [role, setRole] = useState("Patient");

  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);


  const [weeklyStreak, setWeeklyStreak] = useState<number>(1);
  const [daysInCurrentWeek, setDaysInCurrentWeek] = useState<number>(1);
  const [streakEnabled, setStreakEnabled] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, []),
  );

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Photo library access is needed to select a profile picture.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        setProfilePhoto(photoUri);
        await AsyncStorage.setItem("user_profile_photo", photoUri);
      }
    } catch (err) {
      console.log("Image picker error:", err);
    }
  };

  const calculateWeeklyStreak = async (sessionUser?: any) => {
    try {
      const savedEnabled = await AsyncStorage.getItem("@smileguard_streak_enabled");
      if (savedEnabled !== null) {
        setStreakEnabled(savedEnabled === "true");
      }

      let signupIso = sessionUser?.created_at;
      if (!signupIso) {
        signupIso = await AsyncStorage.getItem("@smileguard_signup_date");
      }
      if (!signupIso) {
        signupIso = new Date().toISOString();
        await AsyncStorage.setItem("@smileguard_signup_date", signupIso);
      } else if (sessionUser?.created_at) {
        await AsyncStorage.setItem("@smileguard_signup_date", sessionUser.created_at);
      }

      const signupDate = new Date(signupIso);
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - signupDate.getTime());
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Calculate weeks elapsed since signup date (Week 1, Week 2, ...)
      const weeks = Math.floor(totalDays / 7) + 1;
      const dayOfWeekIndex = (totalDays % 7) + 1; // 1 to 7 days into current week

      setWeeklyStreak(weeks);
      setDaysInCurrentWeek(dayOfWeekIndex);
    } catch (e) {
      console.log("Error calculating streak:", e);
    }
  };

  const handleToggleRemoveStreakCard = async () => {
    const newState = !streakEnabled;
    setStreakEnabled(newState);
    await AsyncStorage.setItem("@smileguard_streak_enabled", newState.toString());
  };

  const fetchUser = async () => {
    try {
      // getSession() reads from localStorage — no network hang
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      setUser(session?.user ?? null);
      calculateWeeklyStreak(session?.user);
      if (session?.user) {
        const localAge = await AsyncStorage.getItem("user_age");
        setEditName(session.user.user_metadata?.full_name || "");
        setEditAge(session.user.user_metadata?.age || localAge || "");
        setEditPhone(session.user.user_metadata?.phone || "");
        setEditDob(session.user.user_metadata?.dob || "");
        setEditGender(session.user.user_metadata?.gender || "");
        setEditPassword("");
      }


      const storedRole = await AsyncStorage.getItem("userRole");
      if (storedRole === "doctor") {
        setRole("Doctor");
      } else {
        setRole("Patient");
      }

      // Fetch last 2 completed assessments for real stats
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await supabase
          .from("assessments")
          .select("score, level, created_at")
          .eq("user_id", userId)
          .neq("level", "In Progress")
          .order("created_at", { ascending: false })
          .limit(2);
        if (data && data.length > 0) {
          setLatestScore(data[0].score);
          setLatestLevel(data[0].level);
          if (data.length >= 2) {
            setRiskChange(data[0].score - data[1].score);
          }
        }
        const { count } = await supabase
          .from("assessments")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .neq("level", "In Progress");
        setTotalAssessments(count ?? 0);
      }
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updatePayload: any = {
        data: {
          full_name: editName,
          age: editAge,
          phone: editPhone,
          dob: editDob,
          gender: editGender,
        },
      };
      if (editPassword.trim().length > 0) {
        updatePayload.password = editPassword.trim();
      }
      const { error } = await supabase.auth.updateUser(updatePayload);
      if (error) throw error;
      if (editName) {
        await AsyncStorage.setItem("user_full_name", editName);
      }
      if (editAge) {
        await AsyncStorage.setItem("user_age", editAge);
      }
      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
      fetchUser();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    navigation.navigate("Index");
  };

  if (loading) {
    return (
      <PhoneShell>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#157A6E" />
        </View>
  
      <Modal visible={isEditing} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput style={styles.inputField} value={editName} onChangeText={setEditName} placeholder="Enter your full name" />
              
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput style={styles.inputField} value={editPhone} onChangeText={setEditPhone} placeholder="e.g. +1 234 567 8900" keyboardType="phone-pad" />
              
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput style={styles.inputField} value={editDob} onChangeText={setEditDob} placeholder="DD/MM/YYYY" />
              
              <Text style={styles.inputLabel}>Gender</Text>
              <TextInput style={styles.inputField} value={editGender} onChangeText={setEditGender} placeholder="Male / Female / Other" />
              
              <Text style={styles.inputLabel}>New Password (leave blank to keep current)</Text>
              <TextInput style={styles.inputField} value={editPassword} onChangeText={setEditPassword} placeholder="Enter new password" secureTextEntry />
              
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </PhoneShell>

    );
  }

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const riskColor =
    latestLevel === "High" ? "#EF4444" : latestLevel === "Medium" ? "#F59E0B" : "#10B981";
  const riskBg =
    latestLevel === "High"
      ? "rgba(239,68,68,0.1)"
      : latestLevel === "Medium"
        ? "rgba(245,158,11,0.1)"
        : "rgba(16,185,129,0.1)";

  return (
    <PhoneShell>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userCard}>
          <TouchableOpacity style={styles.avatar} onPress={pickImage} activeOpacity={0.8}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={{ width: 64, height: 64, borderRadius: 16 }} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
            <View style={styles.cameraIconBadge}>
              <Feather name="camera" size={10} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.user_metadata?.phone ? <Text style={styles.userEmail}>📞 {user.user_metadata.phone}</Text> : null}
            {user?.user_metadata?.age || user?.user_metadata?.dob || user?.user_metadata?.gender ? (
              <Text style={styles.userEmail}>
                👤 {user?.user_metadata?.gender ? user.user_metadata.gender + " · " : ""}
                {user?.user_metadata?.age ? `${user.user_metadata.age} yrs · ` : ""}
                {user?.user_metadata?.dob || ""}
              </Text>
            ) : null}

            <View style={{ flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{role}</Text>
              </View>
              {latestLevel && (
                <View style={[styles.roleBadge, { backgroundColor: riskBg }]}>
                  <Text style={[styles.roleText, { color: riskColor }]}>
                    {latestScore}% · {latestLevel} Risk
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Weekly Streak Maintainer */}
        {streakEnabled && (
          <View style={styles.streakCard}>
            <View style={styles.streakTop}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Feather name="zap" size={28} color="#7C3AED" />
                <View>
                  <Text style={styles.streakDays}>
                    {weeklyStreak} {weeklyStreak === 1 ? "week" : "weeks"}
                  </Text>
                  <Text style={styles.streakLabel}>Weekly oral care streak</Text>
                </View>
              </View>
            </View>

            {/* Streak pills grid for current week */}
            <View style={styles.streakGrid}>
              {Array.from({ length: 7 }).map((_, i) => {
                const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
                const active = i < daysInCurrentWeek;
                return (
                  <View key={i} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                    <View
                      style={[
                        styles.streakDay,
                        active ? styles.streakDayActive : styles.streakDayInactive,
                      ]}
                    />
                    <Text style={styles.dayLabelText}>{dayNames[i]}</Text>
                  </View>
                );
              })}
            </View>

            {/* Status indicator */}
            <View style={[styles.maintainBtn, styles.maintainBtnActive]}>
              <Feather name="check-circle" size={18} color="#7C3AED" />
              <Text style={styles.maintainBtnTextActive}>
                Streak Active · Week {weeklyStreak} (Day {daysInCurrentWeek}/7) 🔥
              </Text>
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Latest Risk</Text>
            <Text style={[styles.statVal, { color: latestScore !== null ? riskColor : "#CBD5E1" }]}>
              {latestScore !== null ? `${latestScore}%` : "—"}
            </Text>
            <Text
              style={[styles.statDesc, { color: latestScore !== null ? riskColor : "#94A3B8" }]}
            >
              {latestLevel ?? "No data yet"}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Risk change</Text>
            <Text
              style={[
                styles.statVal,
                {
                  color: riskChange === null ? "#CBD5E1" : riskChange > 0 ? "#EF4444" : "#10B981",
                },
              ]}
            >
              {riskChange === null ? "—" : `${riskChange > 0 ? "+" : ""}${riskChange}%`}
            </Text>
            <Text
              style={[
                styles.statDesc,
                {
                  color: riskChange === null ? "#94A3B8" : riskChange > 0 ? "#EF4444" : "#10B981",
                },
              ]}
            >
              {riskChange === null
                ? "No data"
                : riskChange > 0
                  ? "Worsening"
                  : riskChange < 0
                    ? "Improving"
                    : "Stable"}
            </Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          <MenuRow
            icon="user"
            label="Edit Profile"
            onPress={() => setIsEditing(true)}
          />
          <View style={styles.divider} />

          <MenuRow
            icon={streakEnabled ? "eye-off" : "zap"}
            label={streakEnabled ? "Hide Weekly Streak Card" : "Show Weekly Streak Card"}
            onPress={handleToggleRemoveStreakCard}
          />
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow} onPress={handleLogout}>
            <View style={styles.menuRowLeft}>
              <Feather name="log-out" size={16} color="#EF4444" />
              <Text style={[styles.menuLabel, { color: "#EF4444" }]}>Log out</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={isEditing} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Profile Photo Picker */}
              <View style={{ alignItems: "center", marginVertical: 12 }}>
                <TouchableOpacity style={styles.photoPickerBox} onPress={pickImage} activeOpacity={0.8}>
                  {profilePhoto ? (
                    <Image source={{ uri: profilePhoto }} style={{ width: 80, height: 80, borderRadius: 20 }} />
                  ) : (
                    <View style={styles.photoPickerPlaceholder}>
                      <Feather name="camera" size={24} color="#0D4B42" />
                    </View>
                  )}
                  <View style={styles.photoEditBadge}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>Change</Text>
                  </View>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>Tap to change Profile Photo</Text>
              </View>

              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput style={styles.inputField} value={editName} onChangeText={setEditName} placeholder="Enter your full name" />
              
              <Text style={styles.inputLabel}>Email (Account Email)</Text>
              <TextInput style={[styles.inputField, { backgroundColor: "#F1F5F9", color: "#64748B" }]} value={user?.email || ""} editable={false} />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput style={styles.inputField} value={editPhone} onChangeText={setEditPhone} placeholder="e.g. +1 234 567 8900" keyboardType="phone-pad" />
              
              <Text style={styles.inputLabel}>Age (Years)</Text>
              <TextInput style={styles.inputField} value={editAge} onChangeText={setEditAge} placeholder="e.g. 24" keyboardType="numeric" />

              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput style={styles.inputField} value={editDob} onChangeText={setEditDob} placeholder="DD/MM/YYYY" />
              
              <Text style={styles.inputLabel}>Gender</Text>
              <TextInput style={styles.inputField} value={editGender} onChangeText={setEditGender} placeholder="Male / Female / Other" />
              
              <Text style={styles.inputLabel}>New Password (leave blank to keep current)</Text>
              <TextInput style={styles.inputField} value={editPassword} onChangeText={setEditPassword} placeholder="Enter new password" secureTextEntry />
              
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </PhoneShell>

  );
}

function MenuRow({ icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.menuRowLeft}>
        <Feather name={icon} size={16} color="#0F172A" />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={16} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#86F1D4",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D4B42",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  userEmail: {
    fontSize: 12,
    color: "#64748B",
  },
  roleBadge: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "rgba(134, 241, 212, 0.4)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0D4B42",
  },
  streakCard: {
    backgroundColor: "#FFCDB2",
    borderRadius: 24,
    padding: 20,
  },
  streakTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  streakDays: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7C3AED",
  },
  streakLabel: {
    fontSize: 12,
    color: "rgba(124, 58, 237, 0.8)",
  },
  streakResetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakResetText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7C3AED",
  },
  streakGrid: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  streakDay: {
    width: "100%",
    height: 32,
    borderRadius: 8,
  },
  dayLabelText: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(124, 58, 237, 0.7)",
  },
  streakDayActive: {
    backgroundColor: "#FFFFFF",
  },
  streakDayInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  maintainBtn: {
    marginTop: 16,
    backgroundColor: "#7C3AED",
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  maintainBtnActive: {
    backgroundColor: "#FFFFFF",
  },
  maintainBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  maintainBtnTextActive: {
    color: "#7C3AED",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  statVal: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
  },
  statDesc: {
    fontSize: 11,
    fontWeight: "600",
    color: "#10B981",
  },
  badgesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  badgesTitle: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  badgesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  badgeItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    padding: 12,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    color: "#0F172A",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "85%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  modalBody: { paddingBottom: 40 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#64748B", marginBottom: 6, marginTop: 12 },
  inputField: { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 14, fontSize: 15, color: "#0F172A", backgroundColor: "#F8FAFC" },
  saveBtn: { backgroundColor: "#0D9488", padding: 16, borderRadius: 16, alignItems: "center", marginTop: 24 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cameraIconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#0D4B42",
    borderRadius: 8,
    padding: 4,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  photoPickerBox: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#E6FFFA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#86F1D4",
  },
  photoPickerPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  photoEditBadge: {
    position: "absolute",
    bottom: -6,
    backgroundColor: "#0D4B42",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
});
