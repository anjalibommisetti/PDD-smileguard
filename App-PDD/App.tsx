import "./src/styles.css";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import * as Updates from "expo-updates";
import { enableScreens } from "react-native-screens";
import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Disable native screens on web to prevent aria-hidden and focus warnings
if (Platform.OS === "web") {
  enableScreens(false);

  // Inject Tailwind CSS for web rendering
  if (typeof document !== "undefined") {
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
  }
}
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./src/lib/supabase";
import { useEffect, useState, useRef } from "react";
import { createNavigationContainerRef } from "@react-navigation/native";

// IndexScreen removed — app starts on Login
import SignupScreen from "./src/routes/signup";
import LoginScreen from "./src/routes/login";
import DashboardScreen from "./src/routes/dashboard";
import AssessmentScreen from "./src/routes/assessment";
import ResultsScreen from "./src/routes/results";
import ReportScreen from "./src/routes/report";
import ProfileScreen from "./src/routes/profile";
import HistoryScreen from "./src/routes/history";
import DentistsScreen from "./src/routes/dentists";
import AlertsScreen from "./src/routes/alerts";
import ScanScreen from "./src/routes/scan";
import AnalyticsDashboard from "./src/routes/analytics";
import ForgotPasswordScreen from "./src/routes/forgot-password";

const Stack = createNativeStackNavigator();

// ─── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen({ onDismiss }: { onDismiss: () => void }) {
  const scale = React.useRef(new Animated.Value(0.7)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const btnOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      // Button fades in after logo animates
      Animated.timing(btnOpacity, { toValue: 1, duration: 500, useNativeDriver: true, delay: 200 }),
    ]).start();
  }, []);

  return (
    <View style={splash.container}>
      <Animated.View style={[splash.logoBox, { transform: [{ scale }], opacity }]}>
        <Text style={splash.tooth}>🦷</Text>
        <Text style={splash.appName}>SmileGuard</Text>
        <Text style={splash.tagline}>AI Dental Care</Text>
      </Animated.View>

      <View style={splash.dotsRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[splash.dot, { opacity: 0.3 + i * 0.3 }]} />
        ))}
      </View>

      {/* Next Button — only way to proceed */}
      <Animated.View style={[splash.nextBtnWrap, { opacity: btnOpacity }]}>
        <TouchableOpacity style={splash.nextBtn} onPress={onDismiss} activeOpacity={0.85}>
          <Text style={splash.nextBtnText}>Get Started</Text>
          <Text style={splash.nextArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const splash = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D4B42",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  logoBox: { alignItems: "center", gap: 12 },
  tooth: { fontSize: 72 },
  appName: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  dotsRow: { flexDirection: "row", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#86F1D4" },
  nextBtnWrap: { position: "absolute", bottom: 60 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#86F1D4",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 8,
    shadowColor: "#86F1D4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0D4B42",
    letterSpacing: 0.5,
  },
  nextArrow: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0D4B42",
  },
});

export const navigationRef = createNavigationContainerRef<any>();

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string>("Login");
  const [isRecovery, setIsRecovery] = useState(false);
  useEffect(() => {
    // NO auto-dismiss — user must click "Get Started" button
  }, []);

  // Check for OTA Updates on App Start
  useEffect(() => {
    async function checkForUpdates() {
      if (Platform.OS === 'web' || !Updates.isEnabled) return;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.log("Error checking for updates:", e);
      }
    }
    checkForUpdates();
  }, []);

  useEffect(() => {
    let didFinish = false;

    // Safety timeout — if session check takes >5s, stop loading anyway
    const safetyTimer = setTimeout(() => {
      if (!didFinish) {
        didFinish = true;
        setLoading(false);
      }
    }, 5000);

    // 1. Read session from localStorage (no network call needed)
    const checkSession = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (currentSession) {
          setInitialRoute("Dashboard");

          setTimeout(() => {
            if (navigationRef.isReady()) {
              navigationRef.navigate("Dashboard");
            }
          }, 200);
        } else {
          setInitialRoute("Login");
          setTimeout(() => {
            if (navigationRef.isReady()) {
              navigationRef.navigate("Login");
            }
          }, 200);
        }

        // Set session AFTER initialRoute is determined so Navigator mounts correctly
        setSession(currentSession ?? null);
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        if (!didFinish) {
          didFinish = true;
          clearTimeout(safetyTimer);
          setLoading(false);
        }
      }
    };
    checkSession();

    // 2. Listen for auth state changes (login / logout events)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
        setInitialRoute("ForgotPassword");
        setShowSplash(false); // Auto-dismiss splash screen
        if (navigationRef.isReady()) {
          navigationRef.navigate("ForgotPassword", { step: 3 });
        }
      } else if (newSession && !isRecovery) {
          setInitialRoute("Dashboard");

        // Force navigation to the correct route after React Navigation hot-swaps screens
        setTimeout(() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate("Dashboard");
          }
        }, 100);
      } else if (!newSession) {
        setInitialRoute("Login");
        setTimeout(() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate("Login");
          }
        }, 100);
      }
      setSession(newSession ?? null);
    });

    return () => {
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  if (showSplash)
    return (
      <SplashScreen
        onDismiss={() => {
          setShowSplash(false);
        }}
      />
    );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8FBFB",
        }}
      >
        <ActivityIndicator size="large" color="#157A6E" />
        <Text style={{ marginTop: 12, color: "#64748B" }}>Loading SmileGuard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider
      style={[
        { flex: 1 },
        Platform.OS === "web" && ({ width: "100vw", height: "100vh" } as any),
      ]}
    >
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#F8FBFB" },
          }}
          initialRouteName={initialRoute}
        >
          {session ? (
            // Protected Screens
            <>
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="Assessment" component={AssessmentScreen} />
              <Stack.Screen name="Scan" component={ScanScreen} />
              <Stack.Screen name="Results" component={ResultsScreen} />
              <Stack.Screen name="Report" component={ReportScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="Dentists" component={DentistsScreen} />
              <Stack.Screen name="Alerts" component={AlertsScreen} />
              <Stack.Screen name="Analytics" component={AnalyticsDashboard} />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                initialParams={{ step: isRecovery ? 3 : 1 }}
              />
            </>
          ) : (
            // Auth Screens — Landing is now the entry point
            <>
                            <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                initialParams={{ step: isRecovery ? 3 : 1 }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
