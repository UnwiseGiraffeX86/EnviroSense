"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

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
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profile) {
      setRole(profile.role || 'patient');
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
        fetchActiveConsultation(user.id);
      }
    }
    setLoading(false);
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
      
    if (data) setActiveConsultation(data as Consultation);
  };

  const fetchDoctorQueue = async () => {
    const { data } = await supabase
      .from('consultations')
      .select('*, profiles:patient_id(full_name)')
      .eq('status', 'waiting_doctor')
      .order('created_at', { ascending: true });
      
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

  const startConsultation = async () => {
    if (!symptoms.trim() || !user) return;
    setAiAnalyzing(true);

    // 1. Create Consultation
    const { data: consultation, error } = await supabase
      .from('consultations')
      .insert({
        patient_id: user.id,
        initial_symptoms: symptoms,
        status: 'analyzing'
      })
      .select()
      .single();

    if (error) {
      alert("Error starting consultation");
      setAiAnalyzing(false);
      return;
    }

    // 2. Simulate AI Analysis (In a real app, this would be an Edge Function)
    // We'll fetch weather data to make it "real"
    const { data: aqData } = await supabase
      .from('air_quality')
      .select('pm25, pm10')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    const pm25 = aqData?.pm25 || 0;
    let severity = "Low";
    let causes = ["Common Cold", "Allergies"];
    
    if (pm25 > 25 || symptoms.toLowerCase().includes("breath")) {
      severity = "High";
      causes = ["Acute Respiratory Distress", "Pollution Aggravated Asthma"];
    }

    const analysis = {
      severity,
      possible_causes: causes,
      weather_context: { pm25, note: pm25 > 25 ? "High Pollution Detected" : "Air Quality is Good" }
    };

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

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !activeConsultation) return;
    
    await supabase.from('messages').insert({
      consultation_id: activeConsultation.id,
      sender_id: user.id,
      content: newMessage
    });
    
    setNewMessage('');
  };

  // --- RENDER ---

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  // DOCTOR VIEW
  if (role === 'doctor') {
    if (activeConsultation) {
      return (
        <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-400">Active Case</h2>
            <button onClick={() => setActiveConsultation(null)} className="text-sm text-gray-400 hover:text-white">Back to Queue</button>
          </div>
          
          {/* Case Details */}
          <div className="bg-gray-800 p-4 rounded mb-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-gray-300">Patient Symptoms</h3>
              <p>{activeConsultation.initial_symptoms}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-300">AI Analysis</h3>
              <div className="text-sm">
                <p><span className="text-yellow-400">Severity:</span> {activeConsultation.ai_analysis?.severity}</p>
                <p><span className="text-blue-400">Context:</span> {activeConsultation.ai_analysis?.weather_context?.note} (PM2.5: {activeConsultation.ai_analysis?.weather_context?.pm25})</p>
                <p><span className="text-green-400">Possible Causes:</span> {activeConsultation.ai_analysis?.possible_causes?.join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 bg-gray-800 rounded p-4 overflow-y-auto mb-4 space-y-2">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.is_system_message ? 'justify-center' : m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded max-w-[70%] ${m.is_system_message ? 'bg-gray-700 text-xs text-gray-400' : m.sender_id === user?.id ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input 
              className="flex-1 bg-gray-700 rounded p-2 text-white"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="bg-blue-500 px-4 rounded">Send</button>
            <button className="bg-green-600 px-4 rounded" onClick={() => alert("Appointment Scheduled!")}>Schedule Appt</button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-8 bg-gray-900 min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">Doctor Dashboard</h1>
        <h2 className="text-xl mb-4">Incoming Referrals</h2>
        <div className="grid gap-4">
          {doctorQueue.length === 0 ? <p className="text-gray-500">No pending cases.</p> : doctorQueue.map(c => (
            <div key={c.id} className="bg-gray-800 p-4 rounded border border-gray-700 hover:border-blue-500 transition">
              <div className="flex justify-between mb-2">
                <span className="font-bold">{c.profiles?.full_name || 'Patient'}</span>
                <span className={`px-2 rounded text-xs ${c.ai_analysis?.severity === 'High' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                  {c.ai_analysis?.severity} Severity
                </span>
              </div>
              <p className="text-gray-300 mb-2">{c.initial_symptoms}</p>
              <div className="text-sm text-gray-400 mb-4">
                AI Note: {c.ai_analysis?.weather_context?.note}
              </div>
              <button 
                onClick={() => acceptCase(c.id)}
                className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500"
              >
                Accept Case
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PATIENT VIEW
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
      {!activeConsultation ? (
        <div className="max-w-md mx-auto w-full mt-10">
          <h1 className="text-2xl font-bold mb-4 text-center text-blue-400">AI Health Assistant</h1>
          <p className="text-gray-400 mb-6 text-center">Describe your symptoms. Our AI will analyze them and refer you to a doctor if needed.</p>
          
          <textarea 
            className="w-full bg-gray-800 border border-gray-700 rounded p-4 text-white mb-4 h-32"
            placeholder="e.g. I have a severe headache and difficulty breathing..."
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
          />
          
          <button 
            onClick={startConsultation}
            disabled={aiAnalyzing}
            className="w-full bg-blue-600 py-3 rounded font-bold hover:bg-blue-500 disabled:opacity-50"
          >
            {aiAnalyzing ? "AI Analyzing..." : "Analyze Symptoms"}
          </button>
        </div>
      ) : (
        <>
          {/* Status Header */}
          <div className="bg-gray-800 p-4 rounded mb-4 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="font-bold">Consultation #{activeConsultation.id.slice(0,8)}</h2>
              <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded text-sm capitalize">
                {activeConsultation.status.replace('_', ' ')}
              </span>
            </div>
            {activeConsultation.ai_analysis && (
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
                {activeConsultation.initial_symptoms}
              </div>
            </div>
            
            {/* AI Response */}
            <div className="flex justify-start">
              <div className="bg-gray-700 p-2 rounded max-w-[70%] border border-blue-500/30">
                <p className="font-bold text-blue-400 text-xs mb-1">AI Assistant</p>
                I have analyzed your symptoms. Based on current air quality (PM2.5: {activeConsultation.ai_analysis?.weather_context?.pm25}), 
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
          {activeConsultation.status === 'active' ? (
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-gray-700 rounded p-2 text-white"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Message your doctor..."
              />
              <button onClick={sendMessage} className="bg-blue-500 px-4 rounded">Send</button>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-2 bg-gray-800 rounded">
              Waiting for a doctor to accept your case...
            </div>
          )}
        </>
      )}
    </div>
  );
}
