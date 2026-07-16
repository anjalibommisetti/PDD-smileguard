import React from "react";
import { View } from "react-native";
import { Calendar, Clock, MapPin, Video, MoreHorizontal, Plus } from "lucide-react";

export default function AppointmentsModule() {
  const appointments = [
    {
      id: 1,
      patient: "Prathyusha",
      time: "09:00 AM - 09:30 AM",
      type: "Follow-up",
      location: "Clinic Room 1",
      isVirtual: false,
    },
    {
      id: 2,
      patient: "John Doe",
      time: "10:00 AM - 11:00 AM",
      type: "Root Canal Prep",
      location: "Clinic Room 2",
      isVirtual: false,
    },
    {
      id: 3,
      patient: "Sarah Smith",
      time: "11:30 AM - 11:45 AM",
      type: "Consultation",
      location: "Online",
      isVirtual: true,
    },
    {
      id: 4,
      patient: "Michael Brown",
      time: "02:00 PM - 02:45 PM",
      type: "Routine Checkup",
      location: "Clinic Room 1",
      isVirtual: false,
    },
  ];

  return (
    <div className="p-8 h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Appointments Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your daily schedule and upcoming visits.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Appointment
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{app.patient}</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {app.time} • {app.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${app.isVirtual ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}
                >
                  {app.isVirtual ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                  {app.location}
                </div>
                <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm sticky top-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" /> Date Picker
            </h3>
            <div className="w-full h-64 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400">
              [ Interactive Calendar View ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
