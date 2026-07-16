import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { PhoneShell } from "../components/PhoneShell";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

// ─── Data ────────────────────────────────────────────────────────────────────

const sections = [
  {
    id: "A",
    title: "Basic Information",
    questions: [
      { id: "q0", text: "Patient Name", type: "text" },
      { id: "q1", text: "Age (in years)", type: "number" },
      { id: "q2", text: "Gender", type: "single", options: ["Male", "Female", "Other"] },
      {
        id: "q3",
        text: "Do you live in an urban or rural area?",
        type: "single",
        options: ["Urban", "Rural"],
      },
      {
        id: "q4",
        text: "Highest level of education",
        type: "single",
        options: ["Primary", "Secondary", "Graduate", "Post-graduate"],
      },
    ],
  },
  {
    id: "B",
    title: "Oral Hygiene Practices",
    questions: [
      {
        id: "q5",
        text: "How many times do you brush your teeth in a day?",
        type: "single",
        options: ["Once", "Twice", "More than twice", "Irregular"],
      },
      {
        id: "q6",
        text: "Do you use fluoridated toothpaste?",
        type: "single",
        options: ["Yes", "No", "Don't know"],
      },
      {
        id: "q7",
        text: "Do you use any of the following? (select all that apply)",
        type: "multi",
        options: ["Dental floss", "Interdental brush", "Mouthwash", "None"],
      },
      {
        id: "q8",
        text: "How often do you clean your tongue?",
        type: "single",
        options: ["Daily", "Occasionally", "Never"],
      },
    ],
  },
  {
    id: "C",
    title: "Dietary Habits",
    questions: [
      {
        id: "q9",
        text: "How often do you consume sugary foods or drinks?",
        type: "single",
        options: ["Rarely", "Once a day", "2–3 times a day", "More than 3 times a day"],
      },
      { id: "q10", text: "Do you eat or drink sweet items between meals?", type: "yesno" },
      { id: "q11", text: "Do you consume sweet drinks before bedtime?", type: "yesno" },
    ],
  },
  {
    id: "D",
    title: "Previous Dental History",
    questions: [
      {
        id: "q12",
        text: "Have you had tooth decay diagnosed?",
        type: "single",
        options: ["Yes", "No", "Not sure"],
      },
      { id: "q13", text: "Have you had gum problems?", type: "yesno" },
      {
        id: "q14",
        text: "Previous dental treatments (select all that apply)",
        type: "multi",
        options: ["Fillings", "Root canal", "Extraction", "Scaling", "None"],
      },
      {
        id: "q15",
        text: "How often do you visit the dentist?",
        type: "single",
        options: ["Only when in pain", "Once a year", "Every 6 months", "Never"],
      },
    ],
  },
  {
    id: "E",
    title: "Current Oral Symptoms",
    questions: [
      { id: "q16", text: "Gum bleeding while brushing?", type: "yesno" },
      { id: "q17", text: "Tooth pain or sensitivity?", type: "yesno" },
      { id: "q18", text: "Loose teeth?", type: "yesno" },
      { id: "q19", text: "Frequent bad breath?", type: "yesno" },
      { id: "q20", text: "Swelling or pus near any tooth?", type: "yesno" },
    ],
  },
  {
    id: "F",
    title: "General Health",
    questions: [
      {
        id: "q21",
        text: "Do you have any of these conditions? (select all that apply)",
        type: "multi",
        options: ["Diabetes", "Asthma", "Thyroid", "Heart disease", "None", "Others"],
      },
      { id: "q22", text: "Are you on long-term medications?", type: "yesno" },
    ],
  },
  {
    id: "G",
    title: "Lifestyle",
    questions: [
      { id: "q23", text: "Do you use tobacco?", type: "yesno" },
      { id: "q24", text: "Do you consume alcohol?", type: "yesno" },
    ],
  },
  {
    id: "H",
    title: "Awareness",
    questions: [
      {
        id: "q25",
        text: "Can dental problems be prevented if detected early?",
        type: "single",
        options: ["Yes", "No", "Not sure"],
      },
      {
        id: "q26",
        text: "Willing to follow preventive advice from the app?",
        type: "single",
        options: ["Yes", "No", "Maybe"],
      },
    ],
  },
  {
    id: "I",
    title: "App Acceptance",
    questions: [
      { id: "q27", text: "Want reminders for brushing and dental visits?", type: "yesno" },
      { id: "q28", text: "Willing to receive personalized dental advice?", type: "yesno" },
      { id: "q29", text: "Comfortable sharing data for risk assessment?", type: "yesno" },
    ],
  },
  {
    id: "J",
    title: "Self-Perceived Oral Health",
    questions: [
      {
        id: "q30",
        text: "How would you rate your overall oral health?",
        type: "single",
        options: ["Very good", "Good", "Fair", "Poor"],
      },
    ],
  },
];

// ─── Scoring ──────────────────────────────────────────────────────────────────

function computeRisk(answers: Record<string, any>) {
  let score = 0;

  // Section B – Oral Hygiene
  score += ({ Twice: 0, "More than twice": 0, Once: 8, Irregular: 15 } as any)[answers.q5] ?? 0;
  score += ({ Yes: 0, No: 8, "Don't know": 4 } as any)[answers.q6] ?? 0;
  const q7 = answers.q7 || [];
  if (q7.includes("None")) score += 6;
  score += ({ Daily: 0, Occasionally: 4, Never: 8 } as any)[answers.q8] ?? 0;

  // Section C – Diet
  score +=
    ({ Rarely: 0, "Once a day": 5, "2–3 times a day": 10, "More than 3 times a day": 15 } as any)[
      answers.q9
    ] ?? 0;
  if (answers.q10 === "Yes") score += 5;
  if (answers.q11 === "Yes") score += 8;

  // Section D – Dental History
  score += ({ Yes: 8, No: 0, "Not sure": 3 } as any)[answers.q12] ?? 0;
  if (answers.q13 === "Yes") score += 8;
  score +=
    ({ "Only when in pain": 10, "Once a year": 3, "Every 6 months": 0, Never: 15 } as any)[
      answers.q15
    ] ?? 0;

  // Section E – Symptoms (highest weight)
  if (answers.q16 === "Yes") score += 10;
  if (answers.q17 === "Yes") score += 10;
  if (answers.q18 === "Yes") score += 12;
  if (answers.q19 === "Yes") score += 6;
  if (answers.q20 === "Yes") score += 15;

  // Section F – Health
  const q21 = answers.q21 || [];
  if (q21.includes("Diabetes")) score += 8;
  if (q21.includes("Heart disease")) score += 5;
  if (answers.q22 === "Yes") score += 4;

  // Section G – Lifestyle
  if (answers.q23 === "Yes") score += 12;
  if (answers.q24 === "Yes") score += 5;

  // Section J – Self-perceived
  score += ({ "Very good": 0, Good: 2, Fair: 8, Poor: 15 } as any)[answers.q30] ?? 0;

  const MAX_RAW = 198; // sum of all worst-case individual scores
  const clipped = Math.round((score / MAX_RAW) * 100);
  const level = clipped >= 60 ? "High" : clipped >= 30 ? "Medium" : "Low";
  const breakdown = [
    {
      label: "Hygiene",
      value: Math.min(
        100,
        Math.round(
          (((({ Twice: 0, "More than twice": 0, Once: 8, Irregular: 15 } as any)[answers.q5] ?? 0) +
            (q7.includes("None") ? 6 : 0)) /
            21) *
            100,
        ),
      ),
      color: "#86F1D4",
    },
    {
      label: "Diet",
      value: Math.min(
        100,
        Math.round(
          ((((
            {
              Rarely: 0,
              "Once a day": 5,
              "2–3 times a day": 10,
              "More than 3 times a day": 15,
            } as any
          )[answers.q9] ?? 0) +
            (answers.q10 === "Yes" ? 5 : 0) +
            (answers.q11 === "Yes" ? 8 : 0)) /
            28) *
            100,
        ),
      ),
      color: "#FFCDB2",
    },
    {
      label: "Symptoms",
      value: Math.min(
        100,
        Math.round(
          (((answers.q16 === "Yes" ? 10 : 0) +
            (answers.q17 === "Yes" ? 10 : 0) +
            (answers.q18 === "Yes" ? 12 : 0) +
            (answers.q19 === "Yes" ? 6 : 0) +
            (answers.q20 === "Yes" ? 15 : 0)) /
            53) *
            100,
        ),
      ),
      color: "#EF4444",
    },
    {
      label: "Lifestyle",
      value: Math.min(
        100,
        Math.round(
          (((answers.q23 === "Yes" ? 12 : 0) + (answers.q24 === "Yes" ? 5 : 0)) / 17) * 100,
        ),
      ),
      color: "#7C3AED",
    },
  ];
  const insight =
    level === "High"
      ? "Your responses indicate significant oral health risk factors. Immediate dental consultation is strongly advised."
      : level === "Medium"
        ? "Moderate risk detected. Improving daily habits and scheduling a dental visit can help prevent progression."
        : "Your oral health indicators are looking good. Keep up with regular hygiene and periodic check-ups.";
  const recommendations =
    level === "High"
      ? [
          "Visit a dentist within the next 2 weeks",
          "Brush twice daily with fluoride toothpaste",
          "Stop tobacco and limit alcohol",
          "Start flossing daily",
        ]
      : level === "Medium"
        ? [
            "Schedule a dental visit within 3 months",
            "Reduce sugary food consumption",
            "Brush twice daily and floss regularly",
            "Consider using mouthwash",
          ]
        : [
            "Maintain your current hygiene routine",
            "Continue 6-monthly dental check-ups",
            "Stay hydrated and limit sugary drinks",
          ];

  return { score: clipped, level, breakdown, insight, recommendations };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssessmentScreen() {
  const navigation = useNavigation<any>();
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null); // tracks Supabase record created at start

  const section = sections[sectionIndex];
  const isLast = sectionIndex === sections.length - 1;

  const setAnswer = (qId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const toggleMulti = (qId: string, option: string) => {
    const current: string[] = answers[qId] || [];
    if (option === "None") {
      setAnswer(qId, current.includes("None") ? [] : ["None"]);
      return;
    }
    const without = current.filter((o) => o !== "None");
    if (without.includes(option)) {
      setAnswer(
        qId,
        without.filter((o) => o !== option),
      );
    } else {
      setAnswer(qId, [...without, option]);
    }
  };

  const isSectionComplete = () => {
    return section.questions.every((q) => {
      if (q.type === "text") return (answers[q.id] || "").trim().length > 0;
      if (q.type === "number") return !!answers[q.id];
      if (q.type === "multi") return (answers[q.id] || []).length > 0;
      return !!answers[q.id];
    });
  };

  const handleNext = async () => {
    if (isLast) {
      // ── Final submit: update or insert the full assessment ──
      setSaving(true);
      try {
        const { score, level, breakdown, insight, recommendations } = computeRisk(answers);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id ?? null;
        const userName =
          answers.q0 ||
          session?.user?.user_metadata?.full_name ||
          session?.user?.email?.split("@")[0] ||
          null;

        const { data, error } = await supabase
          .from("assessments")
          .insert({
            user_id: userId,
            patient_name: userName,
            score,
            level,
            answers,
            created_at: new Date().toISOString(),
          })
          .select("id")
          .single();
        if (error) console.error("Insert error:", error.message);

        const assessmentId = data?.id ?? null;

        navigation.navigate("Results", {
          id: assessmentId,
          score,
          level,
          breakdown,
          insight,
          recommendations,
          patientName: userName,
        });

        // Clear the form after submission so the next assessment is fresh
        setTimeout(() => {
          setSectionIndex(0);
          setAnswers({});
        }, 500);
      } catch (e) {
        console.error("Submit error:", e);
        const { score, level, breakdown, insight, recommendations } = computeRisk(answers);
        navigation.navigate("Results", {
          score,
          level,
          breakdown,
          insight,
          recommendations,
          patientName: answers.q0 || "",
        });

        setTimeout(() => {
          setSectionIndex(0);
          setAnswers({});
        }, 500);
      } finally {
        setSaving(false);
      }
    } else {
      // Moving to next section
      const nextIndex = sectionIndex + 1;
      setSectionIndex(nextIndex);
    }
  };

  return (
    <PhoneShell>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (sectionIndex > 0 ? setSectionIndex((i) => i - 1) : navigation.goBack())}
        >
          <Feather name="arrow-left" size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerLabel}>
            Section {section.id} of {sections.length}
          </Text>
          <Text style={styles.headerTitle}>{section.title}</Text>
        </View>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>{section.id}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${((sectionIndex + 1) / sections.length) * 100}%` as any },
          ]}
        />
      </View>

      {/* Questions */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {section.questions.map((q, qi) => (
          <View key={q.id} style={styles.questionBlock}>
            <Text style={styles.qNum}>
              Q
              {sections.slice(0, sectionIndex).reduce((acc, s) => acc + s.questions.length, 0) +
                qi +
                1}
            </Text>
            <Text style={styles.qText}>{q.text}</Text>

            {q.type === "text" && (
              <TextInput
                style={styles.textInput}
                placeholder="Enter patient name"
                placeholderTextColor="#94A3B8"
                value={answers[q.id] || ""}
                onChangeText={(v) => setAnswer(q.id, v)}
                autoCapitalize="words"
                maxLength={80}
              />
            )}

            {q.type === "number" && (
              <TextInput
                style={styles.numInput}
                keyboardType="numeric"
                placeholder="Enter value"
                placeholderTextColor="#94A3B8"
                value={answers[q.id] || ""}
                onChangeText={(v) => setAnswer(q.id, v)}
                maxLength={3}
              />
            )}

            {q.type === "yesno" && (
              <View style={styles.yesnoRow}>
                {["Yes", "No"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.yesnoBtn,
                      answers[q.id] === opt &&
                        (opt === "Yes" ? styles.yesnoBtnYes : styles.yesnoBtnNo),
                    ]}
                    onPress={() => setAnswer(q.id, opt)}
                  >
                    <Feather
                      name={opt === "Yes" ? "check" : "x"}
                      size={16}
                      color={answers[q.id] === opt ? "#FFFFFF" : "#64748B"}
                    />
                    <Text
                      style={[styles.yesnoBtnText, answers[q.id] === opt && { color: "#FFFFFF" }]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {q.type === "single" && q.options && (
              <View style={styles.optionsList}>
                {q.options.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optionBtn, answers[q.id] === opt && styles.optionBtnActive]}
                    onPress={() => setAnswer(q.id, opt)}
                  >
                    <View style={[styles.radio, answers[q.id] === opt && styles.radioActive]}>
                      {answers[q.id] === opt && <View style={styles.radioDot} />}
                    </View>
                    <Text
                      style={[styles.optionText, answers[q.id] === opt && styles.optionTextActive]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {q.type === "multi" && q.options && (
              <View style={styles.optionsList}>
                {q.options.map((opt) => {
                  const selected = (answers[q.id] || []).includes(opt);
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.optionBtn, selected && styles.optionBtnActive]}
                      onPress={() => toggleMulti(q.id, opt)}
                    >
                      <View style={[styles.checkbox, selected && styles.checkboxActive]}>
                        {selected && <Feather name="check" size={12} color="#FFFFFF" />}
                      </View>
                      <Text style={[styles.optionText, selected && styles.optionTextActive]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ))}

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextBtn, !isSectionComplete() && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!isSectionComplete() || saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#0D4B42" />
          ) : (
            <>
              <Text style={styles.nextBtnText}>
                {isLast ? "Submit Assessment" : "Next Section"}
              </Text>
              <Feather name={isLast ? "check-circle" : "arrow-right"} size={18} color="#0D4B42" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </PhoneShell>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A", marginTop: 2 },
  sectionBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#86F1D4",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionBadgeText: { fontSize: 16, fontWeight: "800", color: "#0D4B42" },
  progressBg: {
    height: 5,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: { height: "100%", backgroundColor: "#157A6E", borderRadius: 3 },
  body: { paddingHorizontal: 20, paddingBottom: 30, gap: 20, paddingTop: 12, maxWidth: 800, alignSelf: "center", width: "100%" },
  questionBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  qNum: {
    fontSize: 10,
    fontWeight: "700",
    color: "#157A6E",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  qText: { fontSize: 14, fontWeight: "600", color: "#0F172A", lineHeight: 20, marginBottom: 14 },
  textInput: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    outlineStyle: "none",
  } as any,
  numInput: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    outlineStyle: "none",
  } as any,
  yesnoRow: { flexDirection: "row", gap: 10 },
  yesnoBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  yesnoBtnYes: { backgroundColor: "#10B981", borderColor: "#10B981" },
  yesnoBtnNo: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  yesnoBtnText: { fontSize: 14, fontWeight: "600", color: "#64748B" },
  optionsList: { gap: 8 },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  optionBtnActive: { borderColor: "#157A6E", backgroundColor: "rgba(21, 122, 110, 0.06)" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#157A6E" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#157A6E" },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: { backgroundColor: "#157A6E", borderColor: "#157A6E" },
  optionText: { fontSize: 14, fontWeight: "500", color: "#64748B", flex: 1 },
  optionTextActive: { color: "#157A6E", fontWeight: "600" },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#86F1D4",
    paddingVertical: 18,
    borderRadius: 18,
    marginTop: 8,
    elevation: 4,
    shadowColor: "#86F1D4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextBtnDisabled: { opacity: 0.4, elevation: 0 },
  nextBtnText: { fontSize: 16, fontWeight: "700", color: "#0D4B42" },
});
