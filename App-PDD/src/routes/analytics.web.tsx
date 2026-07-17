import { View, Text, ScrollView, Platform, StyleSheet } from "react-native";
import tw from 'twrnc';
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Activity, TrendingUp, Users, Target } from "lucide-react-native";
import { motion } from "framer-motion";

// Mock Data
const monthlyCasesData = [
  { name: "Jan", "Dental Caries (Tooth Decay)": 400, Gingivitis: 240, "Calculus (Tartar Build-up)": 150 },
  { name: "Feb", "Dental Caries (Tooth Decay)": 300, Gingivitis: 139, "Calculus (Tartar Build-up)": 220 },
  { name: "Mar", "Dental Caries (Tooth Decay)": 200, Gingivitis: 980, "Calculus (Tartar Build-up)": 229 },
  { name: "Apr", "Dental Caries (Tooth Decay)": 278, Gingivitis: 390, "Calculus (Tartar Build-up)": 200 },
  { name: "May", "Dental Caries (Tooth Decay)": 189, Gingivitis: 480, "Calculus (Tartar Build-up)": 218 },
  { name: "Jun", "Dental Caries (Tooth Decay)": 239, Gingivitis: 380, "Calculus (Tartar Build-up)": 250 },
];

const riskDistributionData = [
  { name: "Low Risk", value: 400, color: "#10B981" },
  { name: "Medium Risk", value: 300, color: "#F59E0B" },
  { name: "High Risk", value: 300, color: "#EF4444" },
];

const accuracyTrendData = [
  { name: "Week 1", accuracy: 92 },
  { name: "Week 2", accuracy: 94 },
  { name: "Week 3", accuracy: 95 },
  { name: "Week 4", accuracy: 98.5 },
];

function AnalyticsDashboard() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={tw`min-h-screen bg-slate-50 dark:bg-slate-950 font-sans p-4 md:p-8`}>
        {/* Header */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-3xl font-bold text-slate-900 dark:text-white`}>Platform Analytics</Text>
          <Text style={tw`text-slate-600 dark:text-slate-400`}>
            Comprehensive overview of oral disease statistics, patient trends, and AI accuracy.
          </Text>
        </View>

        {/* Stats Overview */}
        <View style={tw`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8`}>
          {[
            {
              label: "Total Scans (Month)",
              value: "12,450",
              icon: Activity,
              change: "+14%",
              color: "text-blue-500",
              bg: "bg-blue-100 dark:bg-blue-900/30",
            },
            {
              label: "Active Patients",
              value: "8,234",
              icon: Users,
              change: "+5%",
              color: "text-teal-500",
              bg: "bg-teal-100 dark:bg-teal-900/30",
            },
            {
              label: "AI Accuracy Avg",
              value: "98.5%",
              icon: Target,
              change: "+2.1%",
              color: "text-green-500",
              bg: "bg-green-100 dark:bg-green-900/30",
            },
            {
              label: "High Risk Cases",
              value: "1,240",
              icon: TrendingUp,
              change: "-3%",
              color: "text-red-500",
              bg: "bg-red-100 dark:bg-red-900/30",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={tw`bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between`}
            >
              <View>
                <Text style={tw`text-sm text-slate-500 font-medium mb-1`}>{stat.label}</Text>
                <View style={tw`flex items-baseline gap-2`}>
                  <Text style={tw`text-2xl font-bold text-slate-900 dark:text-white`}>
                    {stat.value}
                  </Text>
                  <Text
                    style={tw`text-xs font-bold ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                  >
                    {stat.change}
                  </Text>
                </View>
              </View>
              <View style={tw`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon style={tw`w-6 h-6 ${stat.color}`} />
              </View>
            </motion.div>
          ))}
        </View>

        <View style={tw`grid lg:grid-cols-2 gap-8 mb-8`}>
          {/* Monthly Disease Cases (Bar Chart) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={tw`bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm`}
          >
            <Text style={tw`text-lg font-bold text-slate-900 dark:text-white mb-6`}>
              Monthly Disease Cases
            </Text>
            <View style={tw`h-80`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCasesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B" }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend iconType="circle" />
                  <Bar
                    dataKey="Early Childhood Caries"
                    stackId="a"
                    fill="#EF4444"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar dataKey="Gingivitis" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="Calculus" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </View>
          </motion.div>

          {/* Risk Category Distribution (Pie Chart) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={tw`bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm`}
          >
            <Text style={tw`text-lg font-bold text-slate-900 dark:text-white mb-6`}>
              Risk Category Distribution
            </Text>
            <View style={tw`h-80`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                    }}
                  />
                  <Legend iconType="circle" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </View>
          </motion.div>
        </View>

        <View style={tw`grid lg:grid-cols-2 gap-8`}>
          {/* Prediction Accuracy Trend (Line Chart) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={tw`bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm`}
          >
            <Text style={tw`text-lg font-bold text-slate-900 dark:text-white mb-6`}>
              AI Prediction Accuracy Trend
            </Text>
            <View style={tw`h-80`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B" }}
                  />
                  <YAxis
                    domain={["auto", 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B" }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </View>
          </motion.div>

          {/* Patient Activity Trends (Area Chart) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={tw`bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm`}
          >
            <Text style={tw`text-lg font-bold text-slate-900 dark:text-white mb-6`}>
              Patient Activity Trends
            </Text>
            <View style={tw`h-80`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyCasesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B" }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                    }}
                  />
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="Early Childhood Caries"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorScans)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </View>
          </motion.div>
        </View>
      </ScrollView>
    </View>
  );
}

export default AnalyticsDashboard;
