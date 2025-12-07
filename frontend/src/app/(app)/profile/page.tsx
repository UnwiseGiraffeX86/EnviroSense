"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { 
  User, 
  Brain, 
  Wind, 
  Sparkles, 
  Save, 
  X, 
  Check, 
  Activity, 
  MapPin, 
  AlertTriangle 
} from "lucide-react";

// --- Types ---
type Profile = {
  id?: string;
  full_name: string;
  sector: string;
  activity_level: "Sedentary" | "Moderate" | "Active";
  focus_index: number;
  stress_triggers: string[];
  respiratory_conditions: string[];
  inhaler_usage_frequency: number; // 0-10 scale
  pollution_sensitivity: number; // 1-10 scale
};

const SECTORS = ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"];
const TRIGGERS = ["Heat", "Cold", "Humidity", "Pollen", "Dust", "Smoke", "Crowds", "Noise"];
const CONDITIONS = ["Asthma", "Allergies", "COPD", "Bronchitis", "None"];

// --- Components ---

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all relative ${
      active ? "text-[#FAF3DD]" : "text-[#562C2C]/60 hover:text-[#562C2C]"
    }`}
  >
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-[#562C2C] rounded-full"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {label}
    </span>
  </button>
);

const SmartUpdateModal = ({ isOpen, onClose, onApply }: any) => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [proposedChanges, setProposedChanges] = useState<Partial<Profile> | null>(null);

  const handleAnalyze = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch("/api/analyze-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Analysis API Error:", response.status, response.statusText, errorData);
        throw new Error(errorData.error || `Analysis failed with status ${response.status}`);
      }

      const changes = await response.json();
      if (Object.keys(changes).length > 0) {
        setProposedChanges(changes);
      } else {
        alert("No relevant health updates detected in your text. Try describing your symptoms or environment more specifically.");
        setProposedChanges(null);
      }
    } catch (error) {
      console.error("Error analyzing profile:", error);
      alert("An error occurred while analyzing your profile. Please check the console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#562C2C]/20 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#FAF3DD] w-full max-w-lg rounded-3xl shadow-2xl border border-[#562C2C]/10 overflow-hidden"
      >
        <div className="p-6 bg-white/50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-[#562C2C]">
              <Sparkles className="w-5 h-5 text-[#E07A5F]" />
              <h3 className="font-bold text-lg">Smart Update</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#562C2C]/5 rounded-full text-[#562C2C]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!proposedChanges ? (
            <>
              <p className="text-[#562C2C]/70 text-sm mb-4">
                Describe your recent changes naturally. Our AI will update your Digital Twin parameters automatically.
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 'I moved to Sector 4 and I've been feeling a bit of brain fog lately due to the heat.'"
                className="w-full h-32 p-4 rounded-xl bg-white border border-[#562C2C]/10 text-[#562C2C] focus:outline-none focus:ring-2 focus:ring-[#00A36C]/50 resize-none mb-4"
              />
              <button
                onClick={handleAnalyze}
                disabled={!input || isProcessing}
                className="w-full py-3 bg-[#562C2C] text-[#FAF3DD] rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#FAF3DD] border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#00A36C]/10 border border-[#00A36C]/20 rounded-xl p-4">
                <h4 className="text-[#00A36C] font-bold text-sm mb-2 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Proposed Updates
                </h4>
                <ul className="space-y-2">
                  {Object.entries(proposedChanges).map(([key, value]) => (
                    <li key={key} className="flex justify-between text-sm">
                      <span className="text-[#562C2C]/60 capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="text-[#562C2C] font-medium">
                        {Array.isArray(value) ? value.join(", ") : value.toString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setProposedChanges(null)}
                  className="flex-1 py-3 border border-[#562C2C]/10 text-[#562C2C] rounded-xl font-medium hover:bg-[#562C2C]/5"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    onApply(proposedChanges);
                    onClose();
                    setProposedChanges(null);
                    setInput("");
                  }}
                  className="flex-1 py-3 bg-[#00A36C] text-white rounded-xl font-medium shadow-lg shadow-[#00A36C]/20"
                >
                  Confirm Updates
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"identity" | "neuro" | "respiratory">("identity");
  const [loading, setLoading] = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    sector: "Sector 1",
    activity_level: "Moderate",
    focus_index: 10,
    stress_triggers: [],
    respiratory_conditions: [],
    inhaler_usage_frequency: 0,
    pollution_sensitivity: 5
  });

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setProfile({
          ...data,
          // Ensure arrays are initialized
          stress_triggers: data.stress_triggers || [],
          respiratory_conditions: data.respiratory_conditions || [],
          focus_index: data.focus_index || 10,
          inhaler_usage_frequency: data.inhaler_usage_frequency || 0,
          pollution_sensitivity: data.pollution_sensitivity || 5,
          activity_level: data.activity_level || "Moderate"
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Save Profile
  const handleSave = async (updates: Partial<Profile> = profile) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.user.id);

    if (!error) {
      setProfile(prev => ({ ...prev, ...updates }));
      // Optional: Show toast
    } else {
      console.error("Error saving profile:", error);
    }
  };

  const handleSmartUpdate = (updates: Partial<Profile>) => {
    handleSave(updates);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF3DD] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#562C2C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3DD] p-6 pb-24">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#562C2C]">Digital Twin</h1>
          <p className="text-[#562C2C]/60">Calibrate your biometric & environmental baseline</p>
        </div>
        <button 
          onClick={() => setIsAIModalOpen(true)}
          className="bg-white/80 backdrop-blur-sm border border-[#562C2C]/10 text-[#562C2C] px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 font-medium"
        >
          <Sparkles className="w-4 h-4 text-[#E07A5F]" />
          Smart Update
        </button>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-center">
        <div className="bg-white/40 backdrop-blur-md p-1 rounded-full flex gap-1">
          <TabButton 
            active={activeTab === "identity"} 
            onClick={() => setActiveTab("identity")} 
            icon={User} 
            label="Identity" 
          />
          <TabButton 
            active={activeTab === "neuro"} 
            onClick={() => setActiveTab("neuro")} 
            icon={Brain} 
            label="Neuro-Cognitive" 
          />
          <TabButton 
            active={activeTab === "respiratory"} 
            onClick={() => setActiveTab("respiratory")} 
            icon={Wind} 
            label="Respiratory" 
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* --- IDENTITY TAB --- */}
          {activeTab === "identity" && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm">
                <h2 className="text-xl font-bold text-[#562C2C] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" /> Personal Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#562C2C]/50 uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={profile.full_name}
                      onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                      className="w-full p-3 rounded-xl bg-white/50 border border-[#562C2C]/10 text-[#562C2C] focus:outline-none focus:ring-2 focus:ring-[#562C2C]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#562C2C]/50 uppercase mb-1">Sector</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SECTORS.map(sector => (
                        <button
                          key={sector}
                          onClick={() => setProfile({...profile, sector})}
                          className={`p-3 rounded-xl text-sm font-medium transition-all ${
                            profile.sector === sector 
                              ? "bg-[#562C2C] text-[#FAF3DD]" 
                              : "bg-white/50 text-[#562C2C]/60 hover:bg-white"
                          }`}
                        >
                          {sector}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm">
                <h2 className="text-xl font-bold text-[#562C2C] mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Activity Level
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {["Sedentary", "Moderate", "Active"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setProfile({...profile, activity_level: level as any})}
                      className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                        profile.activity_level === level
                          ? "bg-[#00A36C] text-white shadow-lg shadow-[#00A36C]/20"
                          : "bg-white/50 text-[#562C2C]/60 hover:bg-white"
                      }`}
                    >
                      <Activity className={`w-6 h-6 ${profile.activity_level === level ? "animate-pulse" : ""}`} />
                      <span className="text-sm font-medium">{level}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* --- NEURO TAB --- */}
          {activeTab === "neuro" && (
            <motion.div
              key="neuro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm">
                <h2 className="text-xl font-bold text-[#562C2C] mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5" /> Cognitive Baseline
                </h2>
                
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-[#562C2C]">Focus Index (Baseline)</label>
                    <span className="text-[#562C2C] font-bold">{profile.focus_index}/10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="10" 
                    value={profile.focus_index}
                    onChange={(e) => setProfile({...profile, focus_index: parseInt(e.target.value)})}
                    className="w-full accent-[#562C2C] h-2 bg-[#562C2C]/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[#562C2C]/40 mt-1">
                    <span>Brain Fog</span>
                    <span>Sharp</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-[#562C2C]">Pollution Sensitivity</label>
                    <span className="text-[#562C2C] font-bold">{profile.pollution_sensitivity}/10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="10" 
                    value={profile.pollution_sensitivity}
                    onChange={(e) => setProfile({...profile, pollution_sensitivity: parseInt(e.target.value)})}
                    className="w-full accent-[#E07A5F] h-2 bg-[#E07A5F]/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[#562C2C]/40 mt-1">
                    <span>Resilient</span>
                    <span>Sensitive</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm">
                <h2 className="text-xl font-bold text-[#562C2C] mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Stress Triggers
                </h2>
                <div className="flex flex-wrap gap-2">
                  {TRIGGERS.map(trigger => (
                    <button
                      key={trigger}
                      onClick={() => {
                        const newTriggers = profile.stress_triggers.includes(trigger)
                          ? profile.stress_triggers.filter(t => t !== trigger)
                          : [...profile.stress_triggers, trigger];
                        setProfile({...profile, stress_triggers: newTriggers});
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        profile.stress_triggers.includes(trigger)
                          ? "bg-[#E07A5F] text-white"
                          : "bg-white/50 text-[#562C2C]/60 hover:bg-white"
                      }`}
                    >
                      {trigger}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* --- RESPIRATORY TAB --- */}
          {activeTab === "respiratory" && (
            <motion.div
              key="respiratory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm">
                <h2 className="text-xl font-bold text-[#562C2C] mb-4 flex items-center gap-2">
                  <Wind className="w-5 h-5" /> Respiratory Conditions
                </h2>
                <div className="space-y-2">
                  {CONDITIONS.map(condition => (
                    <label key={condition} className="flex items-center gap-3 p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/60 transition-colors">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        profile.respiratory_conditions.includes(condition)
                          ? "bg-[#00A36C] border-[#00A36C]"
                          : "border-[#562C2C]/20"
                      }`}>
                        {profile.respiratory_conditions.includes(condition) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={profile.respiratory_conditions.includes(condition)}
                        onChange={() => {
                          let newConditions;
                          if (condition === "None") {
                            newConditions = ["None"];
                          } else {
                            newConditions = profile.respiratory_conditions.filter(c => c !== "None");
                            if (newConditions.includes(condition)) {
                              newConditions = newConditions.filter(c => c !== condition);
                            } else {
                              newConditions = [...newConditions, condition];
                            }
                          }
                          setProfile({...profile, respiratory_conditions: newConditions});
                        }}
                      />
                      <span className="text-[#562C2C] font-medium">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm">
                <h2 className="text-xl font-bold text-[#562C2C] mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Inhaler Usage
                </h2>
                <div className="mb-2">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-[#562C2C]">Frequency</label>
                    <span className="text-[#562C2C] font-bold">
                      {profile.inhaler_usage_frequency === 0 ? "Never" : 
                       profile.inhaler_usage_frequency < 4 ? "Rarely" :
                       profile.inhaler_usage_frequency < 8 ? "Weekly" : "Daily"}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="10" 
                    value={profile.inhaler_usage_frequency}
                    onChange={(e) => setProfile({...profile, inhaler_usage_frequency: parseInt(e.target.value)})}
                    className="w-full accent-[#562C2C] h-2 bg-[#562C2C]/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[#562C2C]/40 mt-1">
                    <span>Never</span>
                    <span>Daily</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSave()}
          className="w-full mt-8 bg-[#562C2C] text-[#FAF3DD] py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#562C2C]/20 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </motion.button>
      </div>

      {/* Smart Update Modal */}
      <SmartUpdateModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        onApply={handleSmartUpdate}
      />
    </div>
  );
}
