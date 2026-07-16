import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import tw from 'twrnc';
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react-native";
import { supabase } from "../lib/supabase";

export default function AppointmentsModule() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const doctorName = "Dr. Sarah Smith"; // Dummy auth

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("doctor_availability")
        .select("*")
        .eq("dentist_name", doctorName)
        .order("date", { ascending: true });
        
      if (data) setAvailabilities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addSlot = async () => {
    if (!date || !time) return;
    const newSlot = { dentist_name: doctorName, date, time_slot: time };
    
    // Optimistic UI
    setAvailabilities([...availabilities, { ...newSlot, id: Date.now() }]);
    
    const { error } = await supabase.from("doctor_availability").insert(newSlot);
    if (error) {
      alert("Failed to save. Create 'doctor_availability' table in Supabase.");
    } else {
      fetchAvailability();
    }
  };

  const deleteSlot = async (id: number) => {
    setAvailabilities(availabilities.filter(a => a.id !== id));
    await supabase.from("doctor_availability").delete().eq("id", id);
  };

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <View style={tw`p-8 h-full bg-slate-50 dark:bg-slate-950`}>
      <View style={tw`mb-8`}>
        <Text style={tw`text-3xl font-bold dark:text-white`}>Manage Availability</Text>
        <Text style={tw`text-slate-500 mt-1`}>Set your free time slots so patients can book appointments.</Text>
      </View>

      <View style={tw`flex-row gap-8`}>
        {/* Add Slot Form */}
        <View style={tw`w-1/3 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800`}>
          <Text style={tw`font-bold text-lg mb-4 dark:text-white`}>Add Free Time Slot</Text>
          
          <Text style={tw`text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2`}>Date</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94A3B8"
            value={date}
            onChangeText={setDate}
            style={tw`w-full p-3 rounded-lg border border-slate-200 mb-4 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
          />

          <Text style={tw`text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2`}>Time (e.g. 10:00 AM)</Text>
          <TextInput
            placeholder="HH:MM AM/PM"
            placeholderTextColor="#94A3B8"
            value={time}
            onChangeText={setTime}
            style={tw`w-full p-3 rounded-lg border border-slate-200 mb-4 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
          />

          <TouchableOpacity 
            onPress={addSlot}
            style={tw`bg-blue-600 p-3 rounded-lg flex-row justify-center items-center gap-2`}
          >
            <Plus size={18} color="#fff" />
            <Text style={tw`text-white font-bold`}>Add Slot</Text>
          </TouchableOpacity>
        </View>

        {/* Existing Slots List */}
        <View style={tw`flex-1 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800`}>
          <Text style={tw`font-bold text-lg mb-4 dark:text-white`}>Your Free Times</Text>
          <ScrollView>
            {loading ? <ActivityIndicator size="large" color="#3b82f6" /> : availabilities.length === 0 ? (
              <Text style={tw`text-slate-400 italic`}>No free times set. Patients cannot book you yet.</Text>
            ) : (
              availabilities.map((slot) => (
                <View key={slot.id} style={tw`flex-row justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800`}>
                  <View style={tw`flex-row items-center gap-4`}>
                    <Calendar size={20} color="#3b82f6" />
                    <Text style={tw`font-bold dark:text-white text-lg`}>{slot.date}</Text>
                    <Clock size={16} color="#64748b" style={{ marginLeft: 8 }}/>
                    <Text style={tw`text-slate-600 dark:text-slate-400 font-medium`}>{slot.time_slot}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteSlot(slot.id)} style={tw`p-2 bg-red-50 dark:bg-red-900/20 rounded-full`}>
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
