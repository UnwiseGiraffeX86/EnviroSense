"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Send, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  MoreVertical,
  Phone,
  Video,
  Search
} from "lucide-react";

type Consultation = {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  status: 'pending' | 'active' | 'closed';
  ai_summary: string;
  risk_score: number;
  created_at: string;
  patient_name?: string; // Joined manually
  patient_email?: string;
};

type ChatMessage = {
  id: string;
  consultation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function TriagePage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const supabase = createBrowserClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // );

  // 1. Init & Fetch Consultations
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      await fetchConsultations();
    };
    init();

    // Realtime Consultations Subscription
    const channel = supabase
      .channel('consultations_room')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'consultations' },
        () => fetchConsultations() // Refresh list on any change
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Fetch Messages when Consultation Selected
  useEffect(() => {
    if (!selectedId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('consultation_id', selectedId)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };
    fetchMessages();

    // Realtime Chat Subscription
    const channel = supabase
      .channel(`chat:${selectedId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages', 
          filter: `consultation_id=eq.${selectedId}` 
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      // Fetch pending AND active (for this doctor)
      const { data: consData, error } = await supabase
        .from('consultations')
        .select('*')
        .or(`status.eq.pending,status.eq.active`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Manual Join for Profiles
      if (consData && consData.length > 0) {
        const userIds = Array.from(new Set(consData.map(c => c.patient_id)));
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        
        const profileMap = new Map(profiles?.map(p => [p.id, p]));

        const merged = consData.map(c => ({
          ...c,
          patient_name: profileMap.get(c.patient_id)?.full_name || "Unknown",
          patient_email: profileMap.get(c.patient_id)?.email
        }));
        setConsultations(merged);
      } else {
        setConsultations([]);
      }
    } catch (err) {
      console.error("Error fetching consultations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptCase = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      const { error } = await supabase
        .from('consultations')
        .update({ 
          status: 'active', 
          doctor_id: user.id 
        })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh immediately
      await fetchConsultations();
    } catch (err) {
      console.error("Error accepting case:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedId || !currentUser) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          consultation_id: selectedId,
          sender_id: currentUser.id,
          content: newMessage
        });

      if (error) throw error;
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const selectedConsultation = consultations.find(c => c.id === selectedId);

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 max-w-7xl mx-auto">
      
      {/* LEFT COLUMN: INBOX */}
      <div className="w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-[#1E293B] flex items-center gap-2">
            <AlertCircle size={20} className="text-[#0077B6]" />
            Triage Queue
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : consultations.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No active or pending cases.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {consultations.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                    selectedId === c.id ? 'bg-blue-50/50 border-l-4 border-[#0077B6]' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <User size={16} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-[#1E293B]">{c.patient_name}</h3>
                        <span className="text-xs text-slate-500">{new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                    {c.status === 'pending' ? (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full uppercase">Pending</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Active</span>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 p-2 rounded-lg mb-3">
                    <p className="text-xs text-slate-600 line-clamp-2">
                      <span className="font-semibold text-slate-700">AI Summary:</span> {c.ai_summary || "No summary available."}
                    </p>
                  </div>

                  {c.status === 'pending' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptCase(c.id);
                      }}
                      className="w-full py-1.5 bg-[#0077B6] text-white text-xs font-medium rounded-md hover:bg-[#005f92] transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 size={14} /> Accept Case
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: LIVE CHANNEL */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {selectedConsultation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#0077B6] text-white flex items-center justify-center font-bold">
                    {selectedConsultation.patient_name?.charAt(0)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h2 className="font-bold text-[#1E293B]">Live with {selectedConsultation.patient_name}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    Risk Score: <span className="font-semibold text-red-500">{selectedConsultation.risk_score}/10</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-[#0077B6] hover:bg-blue-50 rounded-full transition-colors">
                  <Phone size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-[#0077B6] hover:bg-blue-50 rounded-full transition-colors">
                  <Video size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-[#0077B6] hover:bg-blue-50 rounded-full transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              {/* AI Summary System Message */}
              <div className="flex justify-center">
                <div className="bg-slate-100 text-slate-500 text-xs px-4 py-2 rounded-full flex items-center gap-2">
                  <AlertCircle size={12} />
                  AI Summary: {selectedConsultation.ai_summary}
                </div>
              </div>

              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                      isMe 
                        ? 'bg-[#0077B6] text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                    }`}>
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${selectedConsultation.patient_name}...`}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6]"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-[#0077B6] text-white rounded-xl hover:bg-[#005f92] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-slate-300" />
            </div>
            <p className="text-lg font-medium text-slate-500">Select a consultation</p>
            <p className="text-sm">Choose a pending request or active case to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
