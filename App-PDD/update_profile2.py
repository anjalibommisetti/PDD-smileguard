import os

profile_path = 'src/routes/profile.tsx'

with open(profile_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add editGender state
content = content.replace(
    'const [editDob, setEditDob] = useState("");',
    'const [editDob, setEditDob] = useState("");\n  const [editGender, setEditGender] = useState("");'
)

# Populate editGender
content = content.replace(
    'setEditDob(session.user.user_metadata?.dob || "");',
    'setEditDob(session.user.user_metadata?.dob || "");\n        setEditGender(session.user.user_metadata?.gender || "");'
)

# Update Supabase user data
content = content.replace(
    'dob: editDob,',
    'dob: editDob,\n          gender: editGender,'
)

# Add Gender to the modal JSX
gender_jsx = """              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput style={styles.inputField} value={editDob} onChangeText={setEditDob} placeholder="DD/MM/YYYY" />
              
              <Text style={styles.inputLabel}>Gender</Text>
              <TextInput style={styles.inputField} value={editGender} onChangeText={setEditGender} placeholder="Male / Female / Other" />"""
              
content = content.replace(
    '              <Text style={styles.inputLabel}>Date of Birth</Text>\n              <TextInput style={styles.inputField} value={editDob} onChangeText={setEditDob} placeholder="DD/MM/YYYY" />',
    gender_jsx
)

# Add Profile display of Dob and Gender and Phone
# Instead of just showing email, let's show phone as well
user_info_jsx = """            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.user_metadata?.phone ? <Text style={styles.userEmail}>📞 {user.user_metadata.phone}</Text> : null}
            {user?.user_metadata?.dob || user?.user_metadata?.gender ? <Text style={styles.userEmail}>👤 {user?.user_metadata?.gender ? user.user_metadata.gender + " · " : ""}{user?.user_metadata?.dob || ""}</Text> : null}
"""
content = content.replace(
    '            <Text style={styles.userName}>{fullName}</Text>\n            <Text style={styles.userEmail}>{user?.email}</Text>',
    user_info_jsx
)

with open(profile_path, 'w', encoding='utf-8') as f:
    f.write(content)
