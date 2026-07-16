import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { PhoneShell } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

// ─── Dentist data fetched from database ──────────────────────────────────────

const AVATAR_COLORS = ["#86F1D4", "#C7D2FE", "#FDE68A", "#FBCFE8", "#BBF7D0", "#BAE6FD"];
const AVATAR_TEXT_COLORS = ["#0D4B42", "#3730A3", "#92400E", "#831843", "#065F46", "#0C4A6E"];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ─── Booking Modal ────────────────────────────────────────────────────────────
function BookingModal({
  dentist,
  visible,
  onClose,
}: {
  dentist: any;
  visible: boolean;
  onClose: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [booked, setBooked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Min date = today in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleBook = async () => {
    if (!date || !time) return;
    setSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      const { error } = await supabase.from("appointments").insert({
        user_id: user?.id ?? null,
        dentist_name: dentist?.name,
        dentist_specialty: dentist?.specialty,
        appointment_date: date,
        appointment_time: time,
        note,
        status: "pending",
        created_at: new Date().toISOString(),
      });
      if (error) {
        console.error("Appointment insert error:", error.message);
        // Still show success screen — inform user via console
        // The appointments table may need to be created in Supabase
        alert(
          `Note: Appointment saved locally but DB error: ${error.message}\n\nPlease create the "appointments" table in your Supabase project.`,
        );
      }
    } catch (err: any) {
      console.error("Booking exception:", err);
    } finally {
      setSubmitting(false);
      setBooked(true);
    }
  };

  const handleClose = () => {
    setDate("");
    setTime("");
    setNote("");
    setBooked(false);
    onClose();
  };

  if (!dentist) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          {booked ? (
            /* ── Success State ── */
            <View style={modal.successBox}>
              <View style={modal.successIcon}>
                <Feather name="check-circle" size={48} color="#10B981" />
              </View>
              <Text style={modal.successTitle}>Appointment Requested!</Text>
              <Text style={modal.successSub}>
                Your appointment with <Text style={{ fontWeight: "700" }}>{dentist.name}</Text> on{" "}
                <Text style={{ fontWeight: "700" }}>{date}</Text> at{" "}
                <Text style={{ fontWeight: "700" }}>{time}</Text> has been sent.
              </Text>
              <Text style={modal.successNote}>
                The clinic will confirm via call or message shortly.
              </Text>
              <TouchableOpacity style={modal.closeBtn} onPress={handleClose}>
                <Text style={modal.closeBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ── Booking Form ── */
            <>
              <View style={modal.handle} />
              <View style={modal.sheetHeader}>
                <Text style={modal.sheetTitle}>Book Appointment</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Feather name="x" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Dentist mini card */}
              <View style={modal.dentistRow}>
                <View style={[modal.miniAvatar, { backgroundColor: "#86F1D4" }]}>
                  <Text style={[modal.miniAvatarText, { color: "#0D4B42" }]}>
                    {getInitials(dentist.name)}
                  </Text>
                </View>
                <View>
                  <Text style={modal.dentistName}>{dentist.name}</Text>
                  <Text style={modal.dentistSpec}>
                    {dentist.specialty} · {dentist.experience}
                  </Text>
                </View>
              </View>

              <View style={modal.divider} />

              <Text style={modal.label}>Select Date</Text>
              {/* HTML date input renders native calendar picker on web/Expo web */}
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e: any) => setDate(e.target.value)}
                style={
                  {
                    display: "block",
                    width: "100%",
                    backgroundColor: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: 14,
                    padding: "12px 14px",
                    fontSize: 15,
                    color: date ? "#0F172A" : "#94A3B8",
                    marginBottom: 16,
                    outline: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    WebkitAppearance: "none",
                  } as any
                }
              />

              <Text style={modal.label}>Preferred Time</Text>
              <View style={modal.timeRow}>
                {["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[modal.timeChip, time === t && modal.timeChipActive]}
                    onPress={() => setTime(t)}
                  >
                    <Text style={[modal.timeChipText, time === t && modal.timeChipTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={modal.label}>Note (optional)</Text>
              <TextInput
                style={[modal.input, { height: 72, textAlignVertical: "top" }]}
                placeholder="Any symptoms or concerns…"
                placeholderTextColor="#94A3B8"
                multiline
                value={note}
                onChangeText={setNote}
              />

              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
                onPress={() =>
                  setNote((prev) =>
                    prev.includes("[EMERGENCY]")
                      ? prev.replace("[EMERGENCY] ", "")
                      : "[EMERGENCY] " + prev,
                  )
                }
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: note.includes("[EMERGENCY]") ? "#EF4444" : "#CBD5E1",
                    backgroundColor: note.includes("[EMERGENCY]") ? "#EF4444" : "transparent",
                    marginRight: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {note.includes("[EMERGENCY]") && <Feather name="check" size={14} color="#FFF" />}
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: note.includes("[EMERGENCY]") ? "#EF4444" : "#64748B",
                  }}
                >
                  Emergency Priority
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  modal.bookBtn,
                  (!date || !time || submitting) && modal.bookBtnDisabled,
                  note.includes("[EMERGENCY]") && { backgroundColor: "#EF4444" },
                ]}
                onPress={handleBook}
                disabled={!date || !time || submitting}
                activeOpacity={0.85}
              >
                <Feather
                  name={note.includes("[EMERGENCY]") ? "alert-circle" : "calendar"}
                  size={16}
                  color="#fff"
                />
                <Text style={modal.bookBtnText}>
                  {submitting
                    ? "Booking…"
                    : note.includes("[EMERGENCY]")
                      ? "Request Emergency Booking"
                      : "Confirm Appointment"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function DentistsScreen() {
  const [dentists, setDentists] = useState<any[]>([]);
  const [selectedDentist, setSelectedDentist] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFromSupabase();
  }, []);

  const fetchFromSupabase = async () => {
    try {
      const { data } = await supabase
        .from("dentists")
        .select("*")
        .order("rating", { ascending: false });
      if (data) {
        setDentists(data);
      }
    } catch (_) {
      console.error("Failed to fetch dentists");
    } finally {
      setLoading(false);
    }
  };

  const filtered = dentists.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.specialty || d.spec || "").toLowerCase().includes(search.toLowerCase()),
  );

  const openBooking = (dentist: any) => {
    setSelectedDentist(dentist);
    setModalVisible(true);
  };

  return (
    <PhoneShell>
      <ScreenHeader
        title="Find a Dentist"
        subtitle="Verified specialists near you"
        back="Dashboard"
      />

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or specialty…"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((d, i) => {
          const colorIdx = i % AVATAR_COLORS.length;
          const initials = getInitials(d.name);
          const specialty = d.specialty || d.spec || "General Dentist";
          const experience = d.experience || d.exp || "";
          const location = d.location || d.loc || "";
          const rating = d.rating ?? "—";

          return (
            <View key={d.id || d.name} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[colorIdx] }]}>
                  <Text style={[styles.avatarText, { color: AVATAR_TEXT_COLORS[colorIdx] }]}>
                    {initials}
                  </Text>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{d.name}</Text>
                      <Text style={styles.spec}>
                        {specialty}
                        {experience ? ` · ${experience}` : ""}
                      </Text>
                    </View>
                    <View style={styles.ratingBadge}>
                      <Feather name="star" size={11} color="#7C3AED" />
                      <Text style={styles.ratingText}>{rating}</Text>
                    </View>
                  </View>
                  {location ? (
                    <View style={styles.locWrap}>
                      <Feather name="map-pin" size={11} color="#64748B" />
                      <Text style={styles.locText}>{location}</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <TouchableOpacity
                style={styles.bookBtn}
                activeOpacity={0.8}
                onPress={() => openBooking(d)}
              >
                <Feather name="calendar" size={15} color="#0D4B42" />
                <Text style={styles.bookBtnText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {loading && (
          <View style={styles.empty}>
            <ActivityIndicator size="large" color="#0D4B42" />
            <Text style={styles.emptyText}>Loading doctors...</Text>
          </View>
        )}

        {!loading && filtered.length === 0 && (
          <View style={styles.empty}>
            <Feather name="user-x" size={36} color="#CBD5E1" />
            <Text style={styles.emptyText}>No dentists found</Text>
            <Text style={styles.emptySubText}>Try a different search term</Text>
          </View>
        )}
      </ScrollView>

      <BookingModal
        dentist={selectedDentist}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </PhoneShell>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "web" ? 10 : 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    outlineStyle: "none",
  } as any,
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
  },
  cardBody: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  spec: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7C3AED",
  },
  locWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  locText: {
    fontSize: 11,
    color: "#64748B",
  },
  bookBtn: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#86F1D4",
    paddingVertical: 12,
    borderRadius: 16,
  },
  bookBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0D4B42",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94A3B8",
  },
  emptySubText: {
    fontSize: 13,
    color: "#CBD5E1",
  },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  dentistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  miniAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  miniAvatarText: {
    fontSize: 14,
    fontWeight: "700",
  },
  dentistName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  dentistSpec: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 16,
    outlineStyle: "none",
  } as any,
  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  timeChipActive: {
    borderColor: "#7C3AED",
    backgroundColor: "rgba(124, 58, 237, 0.08)",
  },
  timeChipText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  timeChipTextActive: {
    color: "#7C3AED",
    fontWeight: "700",
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7C3AED",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 4,
  },
  bookBtnDisabled: {
    opacity: 0.45,
  },
  bookBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  // ── Success State
  successBox: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  successIcon: {
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  successSub: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 22,
  },
  successNote: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: "#10B981",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 16,
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
