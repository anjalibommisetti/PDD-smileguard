import re

app_file = 'src/App.tsx'
# Wait, App.tsx is in the root!
app_file = 'App.tsx'

with open(app_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all setInitialRoute("Landing") with setInitialRoute("Login")
content = content.replace('setInitialRoute("Landing")', 'setInitialRoute("Login")')

# Replace navigationRef.navigate("Landing") with navigationRef.navigate("Login")
content = content.replace('navigationRef.navigate("Landing")', 'navigationRef.navigate("Login")')

# Remove import LandingPage
content = re.sub(r'import LandingPage from "\./src/routes/index";\n', '', content)

# Remove Stack.Screen name="Landing"
content = re.sub(r'<Stack\.Screen name="Landing" component=\{LandingPage\} />\n', '', content)

with open(app_file, 'w', encoding='utf-8') as f:
    f.write(content)
