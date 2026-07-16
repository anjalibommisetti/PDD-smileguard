const fs = require('fs');
const path = require('path');

const SKIP_FILES = [
  'index.tsx', 'dashboard.tsx', 'doctor-portal.tsx', 'admin-portal.tsx',
  'scan.tsx', 'assessment.tsx', 'role-selection.tsx', 'forgot-password.tsx',
  'history.tsx', 'profile.tsx', 'report.tsx', 'results.tsx', 'dentists.tsx', 'chatbot.tsx'
];

const ROUTES_DIR = path.join(__dirname, 'src', 'routes');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        results.push(filePath);
      }
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

  // Replace lucide-react
  if (content.includes('lucide-react') && !content.includes('lucide-react-native')) {
    content = content.replace(/['"]lucide-react['"]/g, '"lucide-react-native"');
    modified = true;
  }

  // Inject twrnc
  if (!content.includes("import tw from 'twrnc'")) {
    content = `import tw from 'twrnc';\n` + content;
    modified = true;
  }

  // Force all RN imports by stripping existing and adding a clean one
  content = content.replace(/import\s+\{[^}]+\}\s+from\s+['"]react-native['"];?/g, '');
  content = `import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, Image, StyleSheet, SafeAreaView, Pressable } from "react-native";\n` + content;
  modified = true;

  // HTML to React Native tags (safe replacements)
  const tagsMap = {
    'div': 'View',
    'main': 'View',
    'section': 'View',
    'header': 'View',
    'footer': 'View',
    'aside': 'View',
    'nav': 'View',
    'table': 'View',
    'thead': 'View',
    'tbody': 'View',
    'tr': 'View',
    'td': 'View',
    'span': 'Text',
    'p': 'Text',
    'h1': 'Text',
    'h2': 'Text',
    'h3': 'Text',
    'h4': 'Text',
    'h5': 'Text',
    'h6': 'Text',
    'th': 'Text',
    'button': 'TouchableOpacity',
  };

  for (const [html, rn] of Object.entries(tagsMap)) {
    const openRegex = new RegExp(`<${html}(?=[\\s>])`, 'g');
    if (openRegex.test(content)) {
      content = content.replace(openRegex, `<${rn}`);
      modified = true;
    }
    const closeRegex = new RegExp(`</${html}>`, 'g');
    if (closeRegex.test(content)) {
      content = content.replace(closeRegex, `</${rn}>`);
      modified = true;
    }
  }

  if (content.includes('<input')) {
    content = content.replace(/<input/g, '<TextInput');
    modified = true;
  }
  if (content.includes('onClick=')) {
    content = content.replace(/onClick=/g, 'onPress=');
    modified = true;
  }

  content = content.replace(/className="([^"]+)"/g, (match, p1) => {
    modified = true;
    return `style={tw\`${p1}\`}`;
  });

  content = content.replace(/className=\{\`([^\`]+)\`\}/g, (match, p1) => {
    modified = true;
    return `style={tw\`${p1}\`}`;
  });

  content = content.replace(/className=\{[^}]+\}/g, (match) => {
    modified = true;
    return ``; 
  });

  const lucideImportsMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+["']lucide-react-native["']/);
  if (lucideImportsMatch) {
    const icons = lucideImportsMatch[1].split(',').map(i => i.trim()).filter(Boolean);
    icons.forEach(icon => {
      const iconRegex = new RegExp(`<${icon}\\s+[^>]*>`, 'g');
      content = content.replace(iconRegex, (match) => {
        let fixed = match.replace(/style=\{[^}]+\}/g, '');
        if (!fixed.includes('size=')) {
          if (fixed.endsWith('/>')) fixed = fixed.replace('/>', ` size={20} color="#64748b" />`);
          else if (fixed.endsWith('>')) fixed = fixed.replace('>', ` size={20} color="#64748b">`);
        }
        return fixed;
      });
    });
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Converted Safely: ${fileName}`);
  }
});
