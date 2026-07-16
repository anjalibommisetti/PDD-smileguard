import os

profile_path = 'src/routes/profile.tsx'

with open(profile_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Badges section
badges_start = content.find('        {/* Badges */}')
badges_end = content.find('        {/* Menu */}')
if badges_start != -1 and badges_end != -1:
    content = content[:badges_start] + content[badges_end:]

# 2. Add password state
content = content.replace(
    'const [editGender, setEditGender] = useState("");',
    'const [editGender, setEditGender] = useState("");\n  const [editPassword, setEditPassword] = useState("");'
)

content = content.replace(
    'setEditGender(session.user.user_metadata?.gender || "");',
    'setEditGender(session.user.user_metadata?.gender || "");\n        setEditPassword("");'
)

# 3. Update handleSaveProfile to include password conditionally
old_save_call = """      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: editName,
          phone: editPhone,
          dob: editDob,
          gender: editGender,
        },
      });"""

new_save_call = """      const updatePayload: any = {
        data: {
          full_name: editName,
          phone: editPhone,
          dob: editDob,
          gender: editGender,
        },
      };
      if (editPassword.trim().length > 0) {
        updatePayload.password = editPassword.trim();
      }
      const { error } = await supabase.auth.updateUser(updatePayload);"""

content = content.replace(old_save_call, new_save_call)

# 4. Add Password field in Modal JSX
password_jsx = """              <Text style={styles.inputLabel}>Gender</Text>
              <TextInput style={styles.inputField} value={editGender} onChangeText={setEditGender} placeholder="Male / Female / Other" />
              
              <Text style={styles.inputLabel}>New Password (leave blank to keep current)</Text>
              <TextInput style={styles.inputField} value={editPassword} onChangeText={setEditPassword} placeholder="Enter new password" secureTextEntry />"""

content = content.replace(
    '              <Text style={styles.inputLabel}>Gender</Text>\n              <TextInput style={styles.inputField} value={editGender} onChangeText={setEditGender} placeholder="Male / Female / Other" />',
    password_jsx
)

with open(profile_path, 'w', encoding='utf-8') as f:
    f.write(content)
