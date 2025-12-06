"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import SymptomTriage from '@/components/chat/SymptomTriage';
import DoctorDashboard from '@/components/chat/DoctorDashboard';
import ProfileForm from '@/components/chat/ProfileForm';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define types for our data structures
type User = {
  id: string;
  email?: string;
};

type Message = {
  id: string;
  consultation_id: string;
  sender_id: string;
  content: string;
  is_system_message: boolean;
  created_at: string;
};

type Consultation = {
  id: string;
  patient_id: string;
  doctor_id?: string;
  status: string;
  initial_symptoms: string;
  ai_analysis?: {
    severity: string;
    possible_causes: string[];
    medical_specialty?: string;
    weather_context: {
      pm25: number;
      note: string;
    };
  };
  created_at: string;
  profiles?: {
    full_name: string;
  };
};

export default function ChatInterface() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [symptoms, setSymptoms] = useState('');
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [doctorQueue, setDoctorQueue] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (activeConsultation) {
      fetchMessages();
      const channel = supabase
        .channel('realtime-messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `consultation_id=eq.${activeConsultation.id}`
        }, (payload: any) => {
          setMessages(prev => [...prev, payload.new as Message]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeConsultation]);

  // Realtime for Doctor Queue
  useEffect(() => {
    if (role === 'doctor') {
      const channel = supabase
        .channel('public:consultations')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'consultations'
        }, (payload: any) => {
          if (payload.eventType === 'INSERT' && payload.new.status === 'waiting_doctor') {
            fetchNewConsultation(payload.new.id);
          } else if (payload.eventType === 'UPDATE') {
             if (payload.new.status === 'waiting_doctor') {
                fetchNewConsultation(payload.new.id);
             } else if (payload.new.status === 'active' && payload.new.doctor_id !== user?.id) {
                // Remove from queue if taken by another doctor
                setDoctorQueue(prev => prev.filter(c => c.id !== payload.new.id));
             }
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [role, user]);

  const fetchNewConsultation = async (id: string) => {
    const { data } = await supabase
      .from('consultations')
      .select('*, profiles!patient_id(full_name)')
      .eq('id', id)
      .single();
    
    if (data) {
      setDoctorQueue(prev => {
        if (prev.find(c => c.id === data.id)) return prev;
        return [...prev, data as unknown as Consultation];
      });
    }
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
    
    // Fetch role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profile) {
      setRole(profile.role || 'patient');
      
      // Check if profile is complete
      if (!profile.full_name || profile.full_name === 'New User') {
        setShowProfileForm(true);
      }

      if (profile.role === 'doctor') {
        fetchDoctorQueue();
      } else {
        fetchActiveConsultation(user.id);
      }
    } else {
      // Profile doesn't exist (e.g. first time Google login)
      // Create it now
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'New User',
          role: 'patient'
        });
      
      if (!createError) {
        setShowProfileForm(true); // Force them to review/edit
        fetchActiveConsultation(user.id);
      }
    }
    setLoading(false);
  };

  const handleProfileComplete = () => {
    setShowProfileForm(false);
    checkUser(); // Refresh
  };

  const fetchActiveConsultation = async (userId: string) => {
    const { data } = await supabase
      .from('consultations')
      .select('*')
      .eq('patient_id', userId)
      .neq('status', 'closed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (data) {
      setActiveConsultation(data as Consultation);
      if (data.status === 'active') {
        setShowChat(true);
      }
    }
  };

  const fetchDoctorQueue = async () => {
    // Explicitly define the relationship to avoid ambiguity
    // We want to join profiles on patient_id
    const { data, error } = await supabase
      .from('consultations')
      .select('*, profiles!patient_id(full_name)')
      .eq('status', 'waiting_doctor')
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching queue:", error);
    }
    
    if (data) setDoctorQueue(data as unknown as Consultation[]);
  };

  const fetchMessages = async () => {
    if (!activeConsultation) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('consultation_id', activeConsultation.id)
      .order('created_at', { ascending: true });
      
    if (data) setMessages(data as Message[]);
  };

  const startConsultation = async (symptomsText: string) => {
    if (!symptomsText.trim() || !user) return;
    setAiAnalyzing(true);
    setSymptoms(symptomsText);

    // 1. Create Consultation
    const { data: consultation, error } = await supabase
      .from('consultations')
      .insert({
        patient_id: user.id,
        initial_symptoms: symptomsText,
        status: 'analyzing'
      })
      .select()
      .single();

    if (error) {
      alert("Error starting consultation");
      setAiAnalyzing(false);
      return;
    }

    // 2. AI Analysis (Server-side Python)
    let analysis = {
      severity: "Low",
      possible_causes: ["Common Cold"],
      medical_specialty: "General Practitioner",
      weather_context: { pm25: 0, note: "Checking..." }
    };

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomsText })
      });
      const aiResult = await response.json();
      
      // Fetch weather data
      const { data: aqData } = await supabase
        .from('air_quality')
        .select('pm25, pm10')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      const pm25 = aqData?.pm25 || 0;
      
      analysis = {
        severity: aiResult.severity || "Medium",
        possible_causes: aiResult.possible_causes || ["Unknown"],
        medical_specialty: aiResult.medical_specialty || "General Practitioner",
        weather_context: { 
          pm25, 
          note: pm25 > 25 ? "High Pollution Detected" : "Air Quality is Good" 
        }
      };
    } catch (e) {
      console.error("AI Analysis failed", e);
    }

    // 3. Update Consultation with AI Result
    await supabase
      .from('consultations')
      .update({
        status: 'waiting_doctor',
        ai_analysis: analysis
      })
      .eq('id', consultation.id);

    setActiveConsultation({ ...consultation, status: 'waiting_doctor', ai_analysis: analysis } as Consultation);
    setAiAnalyzing(false);
  };

  const acceptCase = async (consultationId: string) => {
    if (!user) return;
    await supabase
      .from('consultations')
      .update({
        status: 'active',
        doctor_id: user.id
      })
      .eq('id', consultationId);
      
    // Add system message
    await supabase.from('messages').insert({
      consultation_id: consultationId,
      sender_id: user.id,
      content: "Doctor has joined the chat.",
      is_system_message: true
    });

    // Refresh
    const { data } = await supabase.from('consultations').select('*').eq('id', consultationId).single();
    setActiveConsultation(data as Consultation);
    setDoctorQueue(prev => prev.filter(c => c.id !== consultationId));
  };

  const sendMessage = async (text: string = newMessage) => {
    if (!text.trim() || !user || !activeConsultation) return;
    
    await supabase.from('messages').insert({
      consultation_id: activeConsultation.id,
      sender_id: user.id,
      content: text
    });
    
    setNewMessage('');
  };

  // --- RENDER ---

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  if (showProfileForm && user) {
    return <ProfileForm userId={user.id} email={user.email || ''} onComplete={handleProfileComplete} />;
  }

  // DOCTOR VIEW
  if (role === 'doctor') {
    return (
      <DoctorDashboard 
        queue={doctorQueue}
        activeCase={activeConsultation}
        onAcceptCase={acceptCase}
        onSelectCase={setActiveConsultation}
        messages={messages}
        onSendMessage={sendMessage}
      />
    );
  }

  // PATIENT VIEW
  return (
    <div className="min-h-screen bg-gray-50">
      {!showChat && (!activeConsultation || activeConsultation.status !== 'active') ? (
        <SymptomTriage 
          onSubmit={startConsultation}
          isAnalyzing={aiAnalyzing}
          analysisResult={activeConsultation?.ai_analysis}
          onStartChat={() => setShowChat(true)}
        />
      ) : (
        <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
          {/* Status Header */}
          <div className="bg-gray-800 p-4 rounded mb-4 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="font-bold">Consultation #{activeConsultation?.id.slice(0,8)}</h2>
              <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded text-sm capitalize">
                {activeConsultation?.status.replace('_', ' ')}
              </span>
            </div>
            {activeConsultation?.ai_analysis && (
              <div className="mt-2 text-sm bg-gray-900 p-2 rounded">
                <p className="text-gray-300">AI Analysis: <span className="text-white">{activeConsultation.ai_analysis.weather_context?.note}</span></p>
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-gray-800 rounded p-4 overflow-y-auto mb-4 space-y-2">
            {/* Initial Symptom Message */}
            <div className="flex justify-end">
              <div className="bg-blue-600 p-2 rounded max-w-[70%]">
                {activeConsultation?.initial_symptoms}
              </div>
            </div>
            
            {/* AI Response */}
            <div className="flex justify-start">
              <div className="bg-gray-700 p-2 rounded max-w-[70%] border border-blue-500/30">
                <p className="font-bold text-blue-400 text-xs mb-1">AI Assistant</p>
                I have analyzed your symptoms. Based on current air quality (PM2.5: {activeConsultation?.ai_analysis?.weather_context?.pm25}), 
                I recommend a consultation. I have forwarded your case to a specialist. Please wait for a doctor to join.
              </div>
            </div>

            {messages.map(m => (
              <div key={m.id} className={`flex ${m.is_system_message ? 'justify-center' : m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded max-w-[70%] ${m.is_system_message ? 'bg-gray-700 text-xs text-gray-400' : m.sender_id === user?.id ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          {activeConsultation?.status === 'active' ? (
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-gray-700 rounded p-2 text-white"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Message your doctor..."
              />
              <button onClick={() => sendMessage()} className="bg-blue-500 px-4 rounded">Send</button>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-2 bg-gray-800 rounded">
              Waiting for a doctor to accept your case...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
