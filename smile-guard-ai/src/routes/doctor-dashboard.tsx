import React, { useState, useEffect } from "react";
import {
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  FileText,
  ChevronRight,
  XCircle,
  Clock,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState("");

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        // Map Supabase columns to our UI structure
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.patient_name || "Unknown Patient",
          phone: item.phone || "",
          age: "N/A", // Not currently stored in assessments table
          lastVisit: new Date(item.created_at).toLocaleDateString("en-IN"),
          risk: item.level || "Low",
          aiDiagnosis: "Predicted Result",
          confidence: item.score || 0,
          status: item.status || "Pending Review",
          answers: item.answers,
        }));
        setPatients(mappedData);
      }
    } catch (err) {
      console.error("Error fetching assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === "All" || p.risk === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const handleApprove = async () => {
    if (selectedPatient) {
      try {
        await supabase
          .from("assessments")
          .update({ status: "Approved" })
          .eq("id", selectedPatient.id);
        alert(`Diagnosis approved for ${selectedPatient.name}`);
        fetchAssessments();
        setSelectedPatient(null);
      } catch (err) {
        console.error("Error approving:", err);
      }
    }
  };

  const handleReject = async () => {
    if (selectedPatient) {
      try {
        await supabase
          .from("assessments")
          .update({ status: "Rejected" })
          .eq("id", selectedPatient.id);
        alert(`Diagnosis rejected for ${selectedPatient.name}`);
        fetchAssessments();
        setSelectedPatient(null);
      } catch (err) {
        console.error("Error rejecting:", err);
      }
    }
  };

  const generatePDF = () => {
    if (!selectedPatient) return;

    // Create a simple printable window for the prescription
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>SmileGuard - Prescription</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
              .header { text-align: center; border-bottom: 2px solid #86F1D4; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; color: #0D4B42; }
              .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
              .prescription-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; min-height: 200px; margin-top: 30px; }
              .footer { margin-top: 50px; text-align: right; border-top: 1px solid #cbd5e1; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">🦷 SmileGuard</div>
              <p>Official Dental Prescription Report</p>
            </div>
            
            <div class="row">
              <div><strong>Patient Name:</strong> ${selectedPatient.name}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN")}</div>
            </div>
            <div class="row">
              <div><strong>Assessed Risk:</strong> ${selectedPatient.risk} (${selectedPatient.confidence}% Score)</div>
            </div>
            
            <div class="prescription-box">
              <h3>Doctor's Prescription & Notes</h3>
              <p>${prescriptionText.replace(/\n/g, "<br/>") || "No specific notes provided."}</p>
            </div>
            
            <div class="footer">
              <p>Doctor's Signature: _______________________</p>
            </div>
            
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      setShowPrescriptionModal(false);
      setPrescriptionText("");
    }
  };

  const handleCall = (patient: any) => {
    window.open(`tel:${patient.phone || '+1234567890'}`);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 w-full max-w-[1600px] mx-auto pb-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Doctor Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, Dr. Smith. Here is your daily overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
            <Activity className="w-4 h-4" /> Start Teleconsultation
          </button>
        </div>
      </div>

      {/* Stats Cards (Dark Blue Theme) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Patients",
            value: "1,248",
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-900/20",
          },
          {
            label: "Pending Appointments",
            value: "12",
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-900/20",
          },
          {
            label: "High-Risk Cases",
            value: "5",
            icon: AlertCircle,
            color: "text-red-400",
            bg: "bg-red-900/20",
          },
          {
            label: "Predictions Reviewed",
            value: "48",
            icon: CheckCircle,
            color: "text-emerald-400",
            bg: "bg-emerald-900/20",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            {i === 2 && (
              <div className="mt-4 text-xs font-medium text-red-400 flex items-center gap-1 relative z-10">
                <AlertCircle className="w-3 h-3" /> Action required immediately
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction Review Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> Prediction Review Panel
              </h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e: any) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                <select
                  value={filterRisk}
                  onChange={(e: any) => setFilterRisk(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Risks</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900/95 backdrop-blur z-10 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Patient Info
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <Activity className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                          <p>Loading records...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                        No patients found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mr-3">
                              {patient.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {patient.name}
                              </div>
                              <div className="text-xs text-slate-500">{patient.lastVisit}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${patient.risk === "High" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : ""}
                            ${patient.risk === "Medium" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : ""}
                            ${patient.risk === "Low" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
                          `}
                          >
                            {patient.risk} Risk
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${patient.confidence > 80 ? "bg-emerald-500" : "bg-amber-500"}`}
                                style={{ width: `${patient.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {patient.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            {patient.status === "Pending Review" && (
                              <Clock className="w-3 h-3 text-amber-500" />
                            )}
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleCall(patient)}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium text-sm flex items-center gap-1 justify-end w-full"
                          >
                            Call <Phone className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => setSelectedPatient(patient)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm flex items-center justify-end w-full gap-1"
                          >
                            Review <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar / Analytics Area */}
        <div className="space-y-6">
          {/* Disease Analytics Charts */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
              <Activity className="w-5 h-5 text-emerald-400" /> Disease Analytics
            </h3>

            {/* Fake Donut Chart */}
            <div className="relative w-48 h-48 mx-auto mb-6 z-10">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-slate-800"
                  strokeWidth="4"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-red-500"
                  strokeWidth="4"
                  strokeDasharray="20 100"
                  strokeDashoffset="0"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-amber-400"
                  strokeWidth="4"
                  strokeDasharray="30 100"
                  strokeDashoffset="-20"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-emerald-400"
                  strokeWidth="4"
                  strokeDasharray="50 100"
                  strokeDashoffset="-50"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">100%</span>
                <span className="text-xs text-slate-400">Total Scans</span>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between text-sm bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-slate-300">Low Risk</span>
                </div>
                <span className="font-bold text-white">50%</span>
              </div>
              <div className="flex items-center justify-between text-sm bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-slate-300">Medium Risk</span>
                </div>
                <span className="font-bold text-white">30%</span>
              </div>
              <div className="flex items-center justify-between text-sm bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-300">High Risk</span>
                </div>
                <span className="font-bold text-white">20%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions / Notifications */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" /> High-Risk Alerts
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400">Critical Patient Alert</p>
                  <p className="text-xs text-slate-400 mt-1">
                    John Doe's recent scan shows 98% probability of severe periodontitis.
                  </p>
                </div>
              </div>
              <div className="p-3 bg-blue-900/20 border border-blue-900/50 rounded-xl flex gap-3">
                <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-400">Upcoming Appointment</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Teleconsultation with Sarah Smith starts in 15 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Review Assessment
              </h2>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm text-slate-500">Patient</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedPatient.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Risk Level</p>
                  <span
                    className={`px-3 py-1 inline-flex text-sm font-bold rounded-full mt-1
                    ${selectedPatient.risk === "High" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : ""}
                    ${selectedPatient.risk === "Medium" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : ""}
                    ${selectedPatient.risk === "Low" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
                  `}
                  >
                    {selectedPatient.risk} Risk ({selectedPatient.confidence}%)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Diagnostic Findings</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    Based on the patient's submitted questionnaire and historical data, the analysis system
                    predicts a {selectedPatient.risk.toLowerCase()} risk of dental complications.
                    {selectedPatient.risk === "High" &&
                      " Immediate clinical evaluation is recommended."}
                  </p>
                </div>
              </div>

              {/* Questionnaire Answers Preview */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                  Questionnaire Highlights
                </h3>
                <div className="space-y-2">
                  {selectedPatient.answers &&
                    Object.entries(selectedPatient.answers)
                      .slice(0, 5)
                      .map(([key, value]: any) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800"
                        >
                          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            {key}
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                  <button className="w-full text-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-2 hover:underline">
                    View Full Medical History & Questionnaire
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowPrescriptionModal(!showPrescriptionModal)}
                  className="flex items-center justify-center w-full gap-2 py-3 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold mb-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  {showPrescriptionModal ? "Cancel Prescription" : "Write Digital Prescription"}
                </button>

                {showPrescriptionModal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <textarea
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                      rows={5}
                      placeholder="Enter prescription details, medications, and clinical notes here. This will be exported as a PDF..."
                      value={prescriptionText}
                      onChange={(e: any) => setPrescriptionText(e.target.value)}
                    />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={handleReject}
                className="px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto text-center"
              >
                Reject Analysis
              </button>

              {showPrescriptionModal ? (
                <button
                  onClick={generatePDF}
                  className="px-6 py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <FileText className="w-5 h-5" /> Generate PDF
                </button>
              ) : (
                <button
                  onClick={handleApprove}
                  className="px-6 py-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <CheckCircle className="w-5 h-5" /> Approve & Verify
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
