import os

profile_path = 'src/routes/profile.tsx'

with open(profile_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Modal, TextInput to imports
content = content.replace(
    '  ActivityIndicator,\n} from "react-native";',
    '  ActivityIndicator,\n  Modal,\n  TextInput,\n  KeyboardAvoidingView,\n  Platform,\n} from "react-native";'
)

# Add state variables
state_vars = """
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDob, setEditDob] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
"""
content = content.replace('const [role, setRole] = useState("Patient");', 'const [role, setRole] = useState("Patient");\n' + state_vars)

# Populate state variables when user is fetched
populate_vars = """
      setUser(session?.user ?? null);
      if (session?.user) {
        setEditName(session.user.user_metadata?.full_name || "");
        setEditPhone(session.user.user_metadata?.phone || "");
        setEditDob(session.user.user_metadata?.dob || "");
      }
"""
content = content.replace('setUser(session?.user ?? null);', populate_vars)

# Handle Save Profile
save_profile_fn = """
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: editName,
          phone: editPhone,
          dob: editDob,
        },
      });
      if (error) throw error;
      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
      fetchUser();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };
"""
content = content.replace('const handleLogout = async () => {', save_profile_fn + '\n  const handleLogout = async () => {')

# Add "Edit Profile" menu row
edit_profile_menu = """
          <MenuRow
            icon="user"
            label="Edit Profile"
            onPress={() => setIsEditing(true)}
          />
          <View style={styles.divider} />
"""
content = content.replace('<MenuRow\n            icon="settings"', edit_profile_menu + '          <MenuRow\n            icon="settings"')

# Add Modal JSX before ending PhoneShell
modal_jsx = """
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
              
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </PhoneShell>
"""
content = content.replace('    </PhoneShell>', modal_jsx)

# Add Modal styles at the VERY END by appending to content, replacing the final '});'
last_brace = content.rfind('});')
if last_brace != -1:
    modal_styles = """
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "80%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  modalBody: { paddingBottom: 40 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#64748B", marginBottom: 6, marginTop: 12 },
  inputField: { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 14, fontSize: 15, color: "#0F172A", backgroundColor: "#F8FAFC" },
  saveBtn: { backgroundColor: "#0D9488", padding: 16, borderRadius: 16, alignItems: "center", marginTop: 24 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
"""
    content = content[:last_brace] + modal_styles

with open(profile_path, 'w', encoding='utf-8') as f:
    f.write(content)
