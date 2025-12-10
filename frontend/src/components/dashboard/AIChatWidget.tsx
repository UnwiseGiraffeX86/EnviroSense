"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Wind, 
  Database, 
  BrainCircuit,
  Stethoscope,
  Loader2
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  type?: "text" | "risk-card";
  riskData?: {
    level: "Low" | "High";
    advice: string;
    details?: string;
  };
};

const THINKING_STEPS = [
  { id: 1, text: "Scanning EU Air Quality Directives...", icon: Wind },
  { id: 2, text: "Correlating with Sector 1 Sensors...", icon: Database },
  { id: 3, text: "Analyzing Bio-Profile...", icon: BrainCircuit },
];

export function AIChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello. I am your Neuro-Symbolic Health Agent. I'm monitoring your vitals and local environmental data. How are you feeling right now?",
      type: "text"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeConsultationId, setActiveConsultationId] = useState<string | null>(null);
  const [isLiveChat, setIsLiveChat] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // const supabase = createBrowserClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Init: Get User & Restore Session
  useEffect(() => {
    const init = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUserId(user.id);
            
            // Check for existing active/pending consultation
            const { data } = await supabase
                .from('consultations')
                .select('id, status')
                .eq('patient_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            
            if (data) {
                if (data.status === 'pending' || data.status === 'active') {
                    setActiveConsultationId(data.id);
                    if (data.status === 'active') {
                        setIsLiveChat(true);
                        // Fetch history
                        const { data: history } = await supabase
                            .from('chat_messages')
                            .select('*')
                            .eq('consultation_id', data.id)
                            .order('created_at', { ascending: true });
                        
                        if (history) {
                             const historyMsgs: Message[] = history.map((m: any) => ({
                                id: m.id,
                                role: m.sender_id === user.id ? 'user' : 'ai',
                                content: m.content,
                                type: 'text'
                             }));
                             // Append history to initial greeting
                             setMessages(prev => {
                                 const greeting = prev[0];
                                 return [greeting, ...historyMsgs];
                             });
                        }
                    } else {
                        // Pending: Show request sent message
                        setMessages(prev => [...prev, {
                            id: 'pending-msg',
                            role: 'ai',
                            content: "Request sent to Dr. Popa. You will be notified when the consultation begins.",
                            type: 'text'
                        }]);
                        setRequestStatus('sent');
                    }
                }
            }
        }
    };
    init();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, currentStep]);

  // Listen for consultation acceptance
  useEffect(() => {
    if (!activeConsultationId) return;

    const channel = supabase
      .channel(`consultation:${activeConsultationId}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'consultations', 
          filter: `id=eq.${activeConsultationId}` 
        },
        (payload) => {
          if (payload.new.status === 'active') {
            setIsLiveChat(true);
            setMessages(prev => [...prev, {
              id: 'system-connected',
              role: 'ai',
              content: "Dr. Popa has joined the chat.",
              type: 'text'
            }]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConsultationId]);

  // Listen for new messages in live chat
  useEffect(() => {
    if (!isLiveChat || !activeConsultationId || !currentUserId) return;

    const channel = supabase
      .channel(`chat:${activeConsultationId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages', 
          filter: `consultation_id=eq.${activeConsultationId}` 
        },
        (payload) => {
             if (payload.new.sender_id !== currentUserId) {
                setMessages(prev => {
                    // Avoid duplicates
                    if (prev.some(m => m.id === payload.new.id)) return prev;
                    return [...prev, {
                        id: payload.new.id,
                        role: 'ai', 
                        content: payload.new.content,
                        type: 'text'
                    }];
                });
             }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLiveChat, activeConsultationId, currentUserId]);

  const handleRequestDoctor = async (riskData: any) => {
    setRequestStatus('sending');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('consultations')
        .insert({
          patient_id: user.id,
          status: 'pending',
          ai_summary: riskData.details || "No details provided",
          risk_score: riskData.level === 'High' ? 8 : 4
        })
        .select()
        .single();

      if (error) throw error;

      setActiveConsultationId(data.id);
      setRequestStatus('sent');
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "ai",
        content: "Request sent to Dr. Popa. You will be notified when the consultation begins.",
        type: "text"
      }]);
    } catch (err: any) {
      console.error("Error requesting doctor:", err);
      if (typeof err === 'object' && err !== null) {
          console.error("Error message:", err.message);
          console.error("Error code:", err.code);
          console.error("Error details:", err.details);
      }
      setRequestStatus('idle');
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // If in Live Chat mode, send to DB
    if (isLiveChat && activeConsultationId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('chat_messages')
                .insert({
                    consultation_id: activeConsultationId,
                    sender_id: user.id,
                    content: inputValue
                });
            
            if (error) {
                console.error("Error sending message:", error);
                return;
            }
        }
        
        // Optimistic update
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            type: "text"
        }]);
        setInputValue("");
        return;
    }

    // Normal AI Chat Logic
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      type: "text"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);
    setCurrentStep(0);

    // Simulate Thinking Steps
    for (let i = 0; i < THINKING_STEPS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(i + 1);
    }

    // Final Response Delay
    // await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const { data, error } = await supabase.functions.invoke('analyze-risk', {
        body: {
          symptom_description: inputValue,
          user_lat: 44.4268, // Default to Bucharest Sector 1 center if not available
          user_long: 26.1025
        }
      });

      if (error) throw error;

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.regulatory_context || "Analysis Complete.",
        type: "risk-card",
        riskData: {
          level: data.risk_level || "Low",
          advice: data.recommendation || "Monitor symptoms.",
          details: data.analysis || "No specific risks detected."
        }
      };

      setMessages(prev => [...prev, aiResponse]);

    } catch (err: any) {
      console.error("AI Error:", err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "ai",
        content: "I apologize, but I cannot process your request at the moment. The AI service is currently unavailable (Missing Configuration).",
        type: "text"
      }]);
    }

    setIsThinking(false);
    setCurrentStep(0);
  };

  return (
    <div className="w-full h-full flex flex-col rounded-3xl overflow-hidden border border-[#562C2C]/10 bg-[#FAF3DD]/90 backdrop-blur-xl relative">
      {/* Header */}
      <div className="p-4 border-b border-[#562C2C]/10 bg-[#FAF3DD] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A36C] to-[#2D6A4F] flex items-center justify-center text-white">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-bold text-[#562C2C]">EnviroSense AI</h3>
          <p className="text-xs text-[#562C2C]/70 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00A36C] animate-pulse" />
            Online • Neuro-Symbolic Active
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#562C2C]/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === "user"
                  ? "bg-[#00A36C] text-white rounded-tr-none"
                  : "bg-white/80 text-[#562C2C] rounded-tl-none border border-[#562C2C]/10"
              }`}
            >
              {msg.type === "text" ? (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              ) : (
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 font-bold ${
                    msg.riskData?.level === "High" ? "text-[#E07A5F]" : "text-[#00A36C]"
                  }`}>
                    {msg.riskData?.level === "High" ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
                    {msg.riskData?.level} Risk Detected
                  </div>
                  
                  <p className="text-sm text-[#562C2C]/80">{msg.riskData?.details}</p>
                  
                  {msg.riskData?.level === "High" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => requestStatus === 'idle' && handleRequestDoctor(msg.riskData)}
                      disabled={requestStatus !== 'idle'}
                      className={`w-full mt-2 border rounded-xl p-3 flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
                        requestStatus === 'sent' 
                          ? "bg-[#00A36C]/10 text-[#00A36C] border-[#00A36C]/20" 
                          : "bg-[#E07A5F]/10 hover:bg-[#E07A5F]/20 text-[#E07A5F] border-[#E07A5F]/20"
                      }`}
                    >
                      {requestStatus === 'sending' ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : requestStatus === 'sent' ? (
                        <>
                          <CheckCircle2 size={16} />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <Stethoscope size={16} />
                          Request Dr. Popa (Available)
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Thinking Animation */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-start"
            >
              <div className="bg-white/80 rounded-2xl rounded-tl-none p-4 border border-[#562C2C]/10 shadow-sm max-w-[85%]">
                <div className="space-y-3">
                  {THINKING_STEPS.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
                        index === currentStep 
                          ? "text-[#00A36C] font-medium" 
                          : index < currentStep 
                            ? "text-[#00A36C]/70" 
                            : "text-[#562C2C]/30"
                      }`}
                    >
                      <div className="relative">
                        <step.icon size={16} />
                        {index === currentStep && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00A36C] rounded-full animate-ping" />
                        )}
                      </div>
                      <span>{step.text}</span>
                      {index < currentStep && <CheckCircle2 size={14} className="ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[#FAF3DD] border-t border-[#562C2C]/10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your symptoms..."
            disabled={isThinking}
            className="w-full bg-white/80 border-0 rounded-xl py-3 pl-4 pr-12 text-sm text-[#562C2C] placeholder:text-[#562C2C]/40 focus:ring-2 focus:ring-[#00A36C]/50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className="absolute right-2 p-2 bg-[#00A36C] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#008f5d] transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
