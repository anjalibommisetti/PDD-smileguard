import React from "react";
import { View } from "react-native";
import { Users, Search, MoreVertical, Filter, FileText, ChevronRight } from "lucide-react";

export default function PatientsModule() {
  const dummyPatients = [
    {
      id: 1,
      name: "Prathyusha",
      age: 24,
      lastVisit: "15/05/2026",
      status: "Active Treatment",
      risk: "High",
      image: "P",
    },
    {
      id: 2,
      name: "John Doe",
      age: 34,
      lastVisit: "10/05/2026",
      status: "Routine Checkup",
      risk: "Low",
      image: "J",
    },
    {
      id: 3,
      name: "Sarah Smith",
      age: 28,
      lastVisit: "02/05/2026",
      status: "Pending Review",
      risk: "Medium",
      image: "S",
    },
    {
      id: 4,
      name: "Michael Brown",
      age: 45,
      lastVisit: "28/04/2026",
      status: "Completed",
      risk: "Low",
      image: "M",
    },
    {
      id: 5,
      name: "Emily Davis",
      age: 31,
      lastVisit: "20/04/2026",
      status: "Active Treatment",
      risk: "High",
      image: "E",
    },
  ];

  return (
    <div className="p-8 h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Patient Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View, search, and manage your patient directory.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <Users className="w-4 h-4" /> Add New Patient
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or phone number..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Patient</th>
                <th className="px-6 py-4 font-medium">Age</th>
                <th className="px-6 py-4 font-medium">Last Visit</th>
                <th className="px-6 py-4 font-medium">Risk Profile</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {dummyPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      {patient.image}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {patient.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {patient.age} yrs
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.risk === "High"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : patient.risk === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {patient.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{patient.status}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
