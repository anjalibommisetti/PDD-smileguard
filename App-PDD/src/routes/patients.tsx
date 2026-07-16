import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, Image, StyleSheet, SafeAreaView, Pressable, ActivityIndicator, Keyboard, Alert } from "react-native";
import tw from 'twrnc';
import React from "react";

import { Users, Search, MoreVertical, Filter, FileText, ChevronRight } from "lucide-react-native";

export default function PatientsModule() {
  const dummyPatients: any[] = [];

  return (
    <ScrollView style={tw`flex-1 bg-slate-50 dark:bg-slate-950 font-sans`} contentContainerStyle={tw`p-8 pb-20`}>
      <View style={tw`flex justify-between items-center mb-8`}>
        <View>
          <Text style={tw`text-3xl font-bold`}>Patient Management</Text>
          <Text style={tw`text-slate-500 dark:text-slate-400 mt-1`}>
            View, search, and manage your patient directory.
          </Text>
        </View>
        <TouchableOpacity style={tw`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2`}>
          <Users   size={20} color="#64748b" /> Add New Patient
        </TouchableOpacity>
      </View>

      <View style={tw`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden`}>
        <View style={tw`p-4 border-b border-slate-200 dark:border-slate-800 flex gap-4`}>
          <View style={tw`relative flex-1`}>
            <Search   size={20} color="#64748b" />
            <TextInput
              
              placeholder="Search by name, ID, or phone number..."
              style={tw`w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
            />
          </View>
          <TouchableOpacity style={tw`flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors`}>
            <Filter   size={20} color="#64748b" /> Filter
          </TouchableOpacity>
        </View>

        <View style={tw`overflow-x-auto`}>
          <View style={tw`w-full text-left text-sm`}>
            <View style={tw`bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`px-6 py-4 font-medium flex-2`}>Patient</Text>
                <Text style={tw`px-6 py-4 font-medium flex-1`}>Age</Text>
                <Text style={tw`px-6 py-4 font-medium flex-1`}>Last Visit</Text>
                <Text style={tw`px-6 py-4 font-medium flex-1`}>Risk Profile</Text>
                <Text style={tw`px-6 py-4 font-medium flex-1`}>Status</Text>
                <Text style={tw`px-6 py-4 text-right font-medium flex-1`}>Actions</Text>
              </View>
            </View>
            <View style={tw`divide-y divide-slate-200 dark:divide-slate-800`}>
              {dummyPatients.length === 0 ? (
                <View style={tw`p-8 items-center justify-center`}>
                  <Users size={48} color="#CBD5E1" />
                  <Text style={tw`mt-4 text-slate-500 font-medium text-base`}>No patients found</Text>
                  <Text style={tw`mt-1 text-slate-400 text-sm`}>Add a new patient to see them listed here.</Text>
                </View>
              ) : (
                dummyPatients.map((patient) => (
                  <View
                    key={patient.id}
                    style={tw`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex-row items-center justify-between`}
                  >
                    <View style={tw`px-6 py-4 flex-row items-center gap-3 flex-2`}>
                      <View style={tw`w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold`}>
                        <Text style={tw`text-blue-600 font-bold`}>{patient.image}</Text>
                      </View>
                      <Text style={tw`font-medium text-slate-900 dark:text-white`}>
                        {patient.name}
                      </Text>
                    </View>
                    <View style={tw`px-6 py-4 text-slate-600 dark:text-slate-300 flex-1`}>
                      <Text style={tw`text-slate-600`}>{patient.age} yrs</Text>
                    </View>
                    <View style={tw`px-6 py-4 text-slate-600 dark:text-slate-300 flex-1`}>
                      <Text style={tw`text-slate-600`}>{patient.lastVisit}</Text>
                    </View>
                    <View style={tw`px-6 py-4 flex-1`}>
                      <Text
                        style={tw`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.risk === "High"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : patient.risk === "Medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {patient.risk}
                      </Text>
                    </View>
                    <View style={tw`px-6 py-4 text-slate-600 dark:text-slate-300 flex-1`}>
                       <Text style={tw`text-slate-600`}>{patient.status}</Text>
                    </View>
                    <View style={tw`px-6 py-4 items-end flex-1`}>
                      <TouchableOpacity style={tw`p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}>
                        <MoreVertical   size={20} color="#64748b" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
