"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { sendChatMessage, type ChatMessage, type SensorContext } from "@/lib/gemmaChat";
import type { WatchData, StationData } from "@/hooks/useDashboardData";

type UIMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};

interface AIChatWidgetProps {
  watchData?: WatchData | null;
  stationData?: StationData | null;
  weather?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
  } | null;
  pm25?: number;
  pm10?: number;
}

export function AIChatWidget({ watchData, stationData, weather, pm25 = 0, pm10 = 0 }: AIChatWidgetProps) {
  const [messages, setMessages] = useState<UIMessage[]>([
    {
      id: "1",
      role: "ai",
      content: "Sentinel online. I'm monitoring your vitals and local air quality in real-time. How can I help?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Build sensor context from props
  function buildSensorContext(): SensorContext {
    return {
      pm25: stationData?.active?.pm25 ?? pm25,
      pm10: stationData?.active?.pm10 ?? pm10,
      temperature: weather?.temperature ?? 0,
      humidity: weather?.humidity ?? 0,
      windSpeed: weather?.windSpeed ?? 0,
      heartRate: watchData?.heartRate,
      hrvMs: watchData?.hrvMs,
      spo2: watchData?.spo2,
      stressLevel: watchData?.edaStressLevel,
      sleepScore: watchData?.sleepScore,
      skinTempDelta: watchData?.skinTempDelta,
      steps: watchData?.steps,
      dailyReadiness: watchData?.dailyReadiness,
      ambientTemp: watchData?.ambientTemp,
      ambientHumidity: watchData?.ambientHumidity,
      ambientPressure: watchData?.ambientPressure,
      ambientLight: watchData?.ambientLight,
    };
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const userText = inputValue.trim();
    const userMsg: UIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    try {
      const responseText = await sendChatMessage(
        userText,
        conversationHistory,
        buildSensorContext()
      );

      const aiMsg: UIMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: responseText,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Update conversation history for context
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text: userText }] },
        { role: "model", parts: [{ text: responseText }] },
      ]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          content: "Connection interrupted. Please try again.",
        },
      ]);
    }

    setIsThinking(false);
  };

  return (
    <div className="w-full h-full flex flex-col rounded-3xl overflow-hidden border border-[#562C2C]/20 shadow-sm bg-white/60 backdrop-blur-xl">
      {/* Header — compact */}
      <div className="px-4 py-2.5 border-b border-[#562C2C]/5 bg-white/40 flex items-center gap-2.5 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00A36C] to-[#2D6A4F] flex items-center justify-center text-white flex-shrink-0">
          <Bot size={16} />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-[#562C2C] text-sm leading-none">Sentinel AI</h3>
          <p className="text-[9px] text-[#562C2C]/50 font-medium flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A36C] animate-pulse" />
            Gemma 4 • Live Context
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#00A36C]/50" />
          <span className="text-[9px] text-[#562C2C]/40 font-medium">RAG</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#00A36C] text-white rounded-tr-sm"
                  : "bg-white/80 text-[#562C2C] rounded-tl-sm border border-[#562C2C]/10"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex justify-start"
            >
              <div className="bg-white/80 rounded-2xl rounded-tl-sm px-3 py-2 border border-[#562C2C]/10 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-[#00A36C] animate-spin" />
                <span className="text-[12px] text-[#562C2C]/50">Analyzing with live sensor context...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-2.5 bg-[#FAF3DD]/50 border-t border-[#562C2C]/5 flex-shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your health & environment..."
            disabled={isThinking}
            className="w-full bg-white/80 border border-[#562C2C]/10 rounded-xl py-2.5 pl-3 pr-10 text-[13px] text-[#562C2C] placeholder:text-[#562C2C]/30 focus:ring-1 focus:ring-[#00A36C]/40 focus:border-[#00A36C]/40 outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className="absolute right-1.5 p-1.5 bg-[#00A36C] text-white rounded-lg disabled:opacity-30 hover:bg-[#008f5d] transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
