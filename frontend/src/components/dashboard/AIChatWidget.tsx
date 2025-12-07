"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Stethoscope
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, currentStep]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

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
    await new Promise(resolve => setTimeout(resolve, 800));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: "Analysis Complete.",
      type: "risk-card",
      riskData: {
        level: "High",
        advice: "Consult Specialist",
        details: "Symptoms correlate with high PM2.5 levels in your area (Sector 1). Immediate medical consultation recommended."
      }
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsThinking(false);
    setCurrentStep(0);
  };

  return (
    <div className="w-full max-w-md mx-auto h-[600px] flex flex-col rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white/60 backdrop-blur-xl relative">
      {/* Header */}
      <div className="p-4 border-b border-white/20 bg-white/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white shadow-lg">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-bold text-[#1E293B]">EnviroSense AI</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online • Neuro-Symbolic Active
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === "user"
                  ? "bg-[#0077B6] text-white rounded-tr-none"
                  : "bg-white/80 text-[#1E293B] rounded-tl-none border border-white/50"
              }`}
            >
              {msg.type === "text" ? (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              ) : (
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 font-bold ${
                    msg.riskData?.level === "High" ? "text-red-600" : "text-green-600"
                  }`}>
                    {msg.riskData?.level === "High" ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
                    {msg.riskData?.level} Risk Detected
                  </div>
                  
                  <p className="text-sm text-slate-600">{msg.riskData?.details}</p>
                  
                  {msg.riskData?.level === "High" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl p-3 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                    >
                      <Stethoscope size={16} />
                      Request Dr. Popa (Available)
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
              <div className="bg-white/80 rounded-2xl rounded-tl-none p-4 border border-white/50 shadow-sm max-w-[85%]">
                <div className="space-y-3">
                  {THINKING_STEPS.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
                        index === currentStep 
                          ? "text-[#0077B6] font-medium" 
                          : index < currentStep 
                            ? "text-green-600/70" 
                            : "text-slate-300"
                      }`}
                    >
                      <div className="relative">
                        <step.icon size={16} />
                        {index === currentStep && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#0077B6] rounded-full animate-ping" />
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
      <form onSubmit={handleSendMessage} className="p-4 bg-white/40 border-t border-white/20">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your symptoms..."
            disabled={isThinking}
            className="w-full bg-white/80 border-0 rounded-xl py-3 pl-4 pr-12 text-sm text-[#1E293B] placeholder:text-slate-400 focus:ring-2 focus:ring-[#0077B6]/50 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className="absolute right-2 p-2 bg-[#0077B6] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#005f92] transition-colors shadow-md"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
