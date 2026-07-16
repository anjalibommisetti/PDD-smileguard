import { createClient } from "@supabase/supabase-js";

// Works in both Expo (process.env.EXPO_PUBLIC_*) and Vite (falls back to hardcoded)
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://lrxoalxpyomtcqzueqmb.supabase.co";

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeG9hbHhweW9tdGNxenVlcW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Mjk5ODksImV4cCI6MjA5MzAwNTk4OX0.wQVhjAhT4p7hpifSbRlZaES1KjjtR7PiJkDa13MgViY";

// Web-compatible storage adapter using localStorage
const storageAdapter = {
  getItem: (key: string): string | null => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
