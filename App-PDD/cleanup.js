const fs = require('fs');
const path = require('path');

const SKIP_FILES = [
  'index.tsx', 'dashboard.tsx', 'doctor-portal.tsx', 'admin-portal.tsx',
  'scan.tsx', 'assessment.tsx', 'role-selection.tsx', 'history.tsx', 'profile.tsx', 'report.tsx', 'results.tsx', 'dentists.tsx', 'chatbot.tsx'
];

const ROUTES_DIR = path.join(__dirname, 'src', 'routes');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const allFiles = walk(ROUTES_DIR);

allFiles.forEach(filePath => {
  const fileName = path.basename(filePath);
  if (SKIP_FILES.includes(fileName)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Add ActivityIndicator, Keyboard, Alert if missing
  if (!content.includes('ActivityIndicator')) {
    content = content.replace('Platform, Image, StyleSheet, SafeAreaView, Pressable', 'Platform, Image, StyleSheet, SafeAreaView, Pressable, ActivityIndicator, Keyboard, Alert');
    modified = true;
  }

  // Remove type="..." from TextInput
  if (content.match(/<TextInput[^>]*type=/)) {
    content = content.replace(/(<TextInput[^>]*)type=(?:'[^']*'|"[^"]*"|\{[^}]*\})/g, '$1');
    modified = true;
  }

  // Remove colSpan={...} from View
  if (content.match(/<View[^>]*colSpan=/)) {
    content = content.replace(/(<View[^>]*)colSpan=\{[^}]*\}/g, '$1');
    modified = true;
  }

  // Fix onChange to onChangeText in TextInput
  if (content.includes('onChange={')) {
    // Only in TextInput
    content = content.replace(/(<TextInput[^>]*)onChange=\{/g, '$1onChangeText={');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned up: ${fileName}`);
  }
});
