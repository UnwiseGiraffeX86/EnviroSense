"use client";

import React, { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  User, 
  Calendar, 
  Activity, 
  FileText, 
  Pill, 
  AlertCircle,
  Plus,
  Clock,
  Loader2,
  Play,
  Pause,
  Mic
} from "lucide-react";
import PatientChart from "@/components/doctor/PatientChart";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export default function PatientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("timeline");
  const [patient, setPatient] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        // 2. Fetch Logs
        const { data: patientLogs } = await supabase
          .from('daily_logs')
          .select('*')
          .eq('user_id', id)
          .order('created_at', { ascending: false });

        // 3. Fetch Clinical Notes
        const { data: clinicalNotes } = await supabase
          .from('clinical_notes')
          .select('*')
          .eq('patient_id', id)
          .order('created_at', { ascending: false });

        if (profile) {
          setPatient({
            ...profile,
            age: 45, // Mock
            gender: "Male", // Mock
            sector: profile.sector || "Sector 1",
            risk: "High", // Mock
            conditions: ["Hypertension", "Type 2 Diabetes"], // Mock
            medications: [
              { name: "Metformin", dosage: "500mg", freq: "2x Daily" },
              { name: "Lisinopril", dosage: "10mg", freq: "1x Daily" }
            ],
            vitals: {
              bp: "145/90",
              hr: "82 bpm",
              spo2: "96%",
              weight: "85 kg"
            }
          });
        }
        
        if (patientLogs) setLogs(patientLogs);
        if (clinicalNotes) setNotes(clinicalNotes);

      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    setSubmittingNote(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: newNote, error } = await supabase
        .from('clinical_notes')
        .insert({
          content: newNoteContent,
          patient_id: id,
          doctor_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setNotes([newNote, ...notes]);
      setNewNoteContent("");
      setIsAddingNote(false);
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note. Please try again.");
    } finally {
      setSubmittingNote(false);
    }
  };

  const toggleAudio = (logId: string) => {
    if (playingAudio === logId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(logId);
    }
  };

  // Prepare Chart Data
  const chartData = logs.map(log => ({
    date: new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    focus_level: log.focus_level || 5,
    pollution_exposure: Math.floor(Math.random() * 50) + 10, // Mock PM2.5 if not in DB
    breathing_status: log.breathing_status || 'Normal'
  })).reverse();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#0077B6]" size={32} />
      </div>
    );
  }

  if (!patient) {
    return <div className="p-6">Patient not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Patient Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">{patient.full_name || "Unknown Name"}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Calendar size={14} /> {patient.age} yrs</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span>{patient.sector}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActiveTab('notes');
                setIsAddingNote(true);
              }}
              className="bg-[#0077B6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#023E8A] transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add Clinical Note
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {[
            { id: 'timeline', label: 'Timeline' },
            { id: 'voice_journal', label: 'Voice Journal' },
            { id: 'notes', label: 'Clinical Notes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? "border-[#0077B6] text-[#0077B6]" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <PatientChart data={chartData} />
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-[#1E293B] mb-4">Recent Vitals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Blood Pressure</p>
                    <p className="text-lg font-semibold text-[#1E293B]">{patient.vitals.bp}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Heart Rate</p>
                    <p className="text-lg font-semibold text-[#1E293B]">{patient.vitals.hr}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">SpO2</p>
                    <p className="text-lg font-semibold text-[#1E293B]">{patient.vitals.spo2}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Weight</p>
                    <p className="text-lg font-semibold text-[#1E293B]">{patient.vitals.weight}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voice_journal' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 font-semibold text-[#1E293B] flex items-center gap-2">
                <Mic size={18} className="text-[#0077B6]" /> Voice Logs
              </div>
              <div className="divide-y divide-slate-100">
                {logs.filter(l => l.transcript).length > 0 ? logs.filter(l => l.transcript).map((log) => (
                  <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium text-[#1E293B]">{new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        <p className="text-xs text-slate-500">{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.breathing_status === 'Severe' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {log.breathing_status || 'Normal'}
                      </span>
                    </div>

                    {/* Audio Player UI Mock */}
                    <div className="bg-slate-100 rounded-lg p-3 flex items-center gap-4 mb-4">
                      <button 
                        onClick={() => toggleAudio(log.id)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0077B6] shadow-sm hover:shadow-md transition-all"
                      >
                        {playingAudio === log.id ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <div className="flex-1 h-8 flex items-center gap-1">
                        {/* Fake Waveform */}
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1 rounded-full transition-all duration-300 ${playingAudio === log.id ? 'bg-[#0077B6] animate-pulse' : 'bg-slate-300'}`}
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 font-mono">00:45</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-700 italic leading-relaxed">
                        "{log.transcript}"
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-slate-500">
                    <Mic size={48} className="mx-auto mb-4 text-slate-200" />
                    <p>No voice logs recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-[#1E293B]">Clinical Notes History</h3>
              </div>

              {isAddingNote && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2">
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Enter clinical note..."
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] min-h-[100px] text-sm"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button 
                      onClick={() => {
                        setIsAddingNote(false);
                        setNewNoteContent("");
                      }}
                      className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      disabled={submittingNote}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddNote}
                      disabled={submittingNote || !newNoteContent.trim()}
                      className="px-3 py-1.5 text-sm bg-[#0077B6] text-white rounded-lg hover:bg-[#023E8A] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {submittingNote && <Loader2 size={14} className="animate-spin" />}
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {notes.length > 0 ? notes.map((note) => (
                <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-[#1E293B]">Dr. Popa</span>
                    <span className="text-xs text-slate-500">{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{note.content}</p>
                </div>
              )) : (
                !isAddingNote && (
                  <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No clinical notes found.
                  </div>
                )
              )}
            </div>
          )}

        </div>

        {/* Sidebar Info (1/3) */}
        <div className="space-y-6">
          {/* Conditions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-semibold text-[#1E293B] mb-3 text-sm">Active Conditions</h3>
            <div className="flex flex-wrap gap-2">
              {patient.conditions.map((c: string) => (
                <span key={c} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-semibold text-[#1E293B] mb-3 text-sm flex items-center gap-2">
              <Pill size={16} className="text-purple-500" />
              Current Medications
            </h3>
            <div className="space-y-3">
              {patient.medications.map((med: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-slate-700">{med.name}</p>
                    <p className="text-xs text-slate-500">{med.dosage}</p>
                  </div>
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                    {med.freq}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

