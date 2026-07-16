import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, StyleSheet, Alert } from "react-native";
import tw from 'twrnc';
import React, { useState, useEffect, useRef } from "react";
import { Send, Phone, Video } from "lucide-react-native";
import { supabase } from "../lib/supabase";

export default function CommunicationModule() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const doctorName = "Dr. Sarah Smith"; // In a real app, get this from auth context

  useEffect(() => {
    fetchMessages();
    
    // Live Auto-Polling every 3 seconds
    const interval = setInterval(() => {
      fetchMessages(false); // don't show loading spinner on background polls
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // Fetch messages where the doctor is either sender or receiver
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`receiver.eq."${doctorName}",sender.eq."${doctorName}"`)
        .order("created_at", { ascending: true });
        
      if (data) {
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const newMsg = {
      sender: doctorName,
      receiver: "Patient", // In a real app, tie this to the selected chat
      content: inputText.trim(),
      created_at: new Date().toISOString()
    };
    
    // Optimistic UI update
    setMessages([...messages, newMsg]);
    setInputText("");
    
    // Scroll to bottom
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    const { error } = await supabase.from("messages").insert(newMsg);
    if (error) {
      Alert.alert("Error", "Could not send message. Please ensure the 'messages' table exists in Supabase.");
    }
  };

  return (
    <View style={tw`flex h-full bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800`}>
      <View style={tw`h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-row items-center justify-between px-6`}>
        <View style={tw`flex-row items-center gap-3`}>
          <View style={tw`w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center`}>
            <Text style={tw`text-blue-600 font-bold`}>P</Text>
          </View>
          <View>
            <Text style={tw`font-bold text-slate-900 dark:text-white`}>Patient Chat</Text>
            <Text style={tw`text-xs text-green-500`}>Online (Live Polling Active)</Text>
          </View>
        </View>
        <View style={tw`flex-row items-center gap-3`}>
          <TouchableOpacity style={tw`p-2`}>
            <Phone size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-2`}>
            <Video size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={tw`flex-1 p-6`} 
        contentContainerStyle={tw`pb-6`}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {loading && messages.length === 0 ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
        ) : messages.length === 0 ? (
          <Text style={tw`text-center text-slate-400 mt-10`}>No messages yet. Waiting for patients...</Text>
        ) : (
          messages.map((msg, idx) => {
            const isDoctor = msg.sender === doctorName;
            return (
              <View key={idx} style={tw`flex-row ${isDoctor ? 'justify-end' : 'justify-start'} mb-4`}>
                <View style={tw`max-w-[80%] p-3 rounded-2xl ${isDoctor ? 'bg-blue-600 rounded-tr-none' : 'bg-white dark:bg-slate-800 rounded-tl-none border border-slate-200 dark:border-slate-700'}`}>
                  <Text style={tw`${isDoctor ? 'text-white' : 'text-slate-800 dark:text-slate-200'} text-sm`}>
                    {msg.content}
                  </Text>
                  <Text style={tw`text-xs mt-1 text-right ${isDoctor ? 'text-blue-200' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={tw`p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800`}>
        <View style={tw`flex-row items-center bg-slate-50 dark:bg-slate-800 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700`}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#94A3B8"
            style={[tw`flex-1 dark:text-white`, { outlineStyle: 'none' } as any]}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity 
            onPress={sendMessage}
            style={tw`p-2 bg-blue-600 rounded-full items-center justify-center ml-2`}
          >
            <Send size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
