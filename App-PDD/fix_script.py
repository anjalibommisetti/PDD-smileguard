import os
import re

# --- Fix login.tsx ---
login_file = 'src/routes/login.tsx'
with open(login_file, 'r', encoding='utf-8') as f:
    login_content = f.read()

login_content = re.sub(r'\} else if \(data\?\.session\) \{[\s\S]*?else navigation\.navigate\("Dashboard"\);\n      \}', 
                       '} else if (data?.session) {\n        navigation.navigate("Dashboard");\n      }', 
                       login_content)
login_content = login_content.replace('navigation.navigate("RoleSelection");', 'navigation.navigate("Signup");')
with open(login_file, 'w', encoding='utf-8') as f:
    f.write(login_content)


# --- Fix signup.tsx ---
signup_file = 'src/routes/signup.tsx'
with open(signup_file, 'r', encoding='utf-8') as f:
    signup_content = f.read()

signup_content = re.sub(r'// Role specific state\n.*?setAdminCode\(""\);\n\n  React\.useEffect\(\(\) => \{\n.*?\}, \[\]\);',
                        '// Role specific state removed',
                        signup_content, flags=re.DOTALL)
signup_content = re.sub(r'if \(role === "doctor" && \(\!specialization \|\| \!licenseNumber\)\) \{[\s\S]*?return;\n    \}',
                        '// Removed role-specific validation',
                        signup_content)
signup_content = re.sub(r'full_name: fullName,\n\s*role: role,\n\s*specialization:.*?,\n\s*license_number:.*?,',
                        'full_name: fullName,',
                        signup_content)
signup_content = signup_content.replace('// Save role so auto-login routes correctly\n      await AsyncStorage.setItem("userRole", role);', 
                                        '// Removed AsyncStorage role save')
signup_content = re.sub(r'<Text style=\{styles\.title\}>\s*\{role === "doctor".*?\n.*?\n.*?\}?\s*</Text>',
                        '<Text style={styles.title}>Create Account</Text>',
                        signup_content, flags=re.DOTALL)
signup_content = re.sub(r'\{role === "doctor" && \(\s*<>[\s\S]*?</>\s*\)\}', '', signup_content)
signup_content = re.sub(r'\{role === "admin" && \(\s*<TextInput[\s\S]*?/>\s*\)\}', '', signup_content)
signup_content = signup_content.replace('placeholder={role === "doctor" ? "Dr. Full Name" : "Full Name"}', 'placeholder="Full Name"')

with open(signup_file, 'w', encoding='utf-8') as f:
    f.write(signup_content)

# --- Fix scan.tsx ---
scan_file = 'src/routes/scan.tsx'
with open(scan_file, 'r', encoding='utf-8') as f:
    scan_content = f.read()

scan_content = scan_content.replace('async function runOfflineAnalysis(uri: string, seed: number): Promise<ReturnType<typeof simulateAIAnalysis>> {',
                                    'async function runOfflineAnalysis(uri: string, seed: number): Promise<ReturnType<typeof simulateAIAnalysis>> {\n  return simulateAIAnalysis(seed);')

preview_code = """
        {imageUri && !result && (
            <View style={s.uploadCard}>
              <Image source={{ uri: imageUri }} style={{ width: "100%", height: 300, borderRadius: 16, marginBottom: 16 }} />
              <TouchableOpacity style={s.cancelCamBtn} onPress={() => { setImageUri(null); setResult(null); setImageFile(null); }}>
                <Text style={s.cancelCamText}>Remove Image</Text>
              </TouchableOpacity>
            </View>
        )}
"""
scan_content = scan_content.replace('        {/* Tips */}', preview_code + '\n        {/* Tips */}')

with open(scan_file, 'w', encoding='utf-8') as f:
    f.write(scan_content)
