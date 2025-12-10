"use client";

import { useState } from 'react';
import { Activity, ShieldCheck, Stethoscope, UserCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface SymptomTriageProps {
  onSubmit: (symptoms: string) => void;
  isAnalyzing: boolean;
  analysisResult: any;
  onStartChat: () => void;
}

export default function SymptomTriage({ onSubmit, isAnalyzing, analysisResult, onStartChat }: SymptomTriageProps) {
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(symptoms);
  };

  if (analysisResult) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-[#FAF3DD]/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-[#562C2C]/10">
          <div className="bg-[#FAF3DD] p-6 border-b border-[#562C2C]/10">
            <h2 className="text-2xl font-semibold text-[#562C2C] mb-2">Care Card</h2>
            <p className="text-[#562C2C]/80">We've analyzed your input against local environmental factors.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#00A36C]/10 rounded-full">
                <Activity className="w-6 h-6 text-[#00A36C]" />
              </div>
              <div>
                <h3 className="font-medium text-[#562C2C]">Health Insight</h3>
                <p className="text-[#562C2C]/70 mt-1">
                  Your symptoms align with <span className="font-medium text-[#562C2C]">{analysisResult.possible_causes[0]}</span>.
                  {analysisResult.weather_context.pm25 > 20 && (
                    <span> Note: High PM2.5 levels ({analysisResult.weather_context.pm25}µg/m³) in your sector may be exacerbating this.</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E07A5F]/10 rounded-full">
                <Stethoscope className="w-6 h-6 text-[#E07A5F]" />
              </div>
              <div>
                <h3 className="font-medium text-[#562C2C]">Specialist Recommendation</h3>
                <p className="text-[#562C2C]/70 mt-1">
                  Based on this, we recommend a review by a <span className="font-medium text-[#E07A5F]">{analysisResult.medical_specialty || 'General Practitioner'}</span>.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#562C2C]/10">
              <button
                onClick={onStartChat}
                className="w-full py-4 bg-[#00A36C] hover:bg-[#008f5d] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <UserCheck className="w-5 h-5" />
                Connect with a Doctor
              </button>
              <p className="text-center text-xs text-[#562C2C]/40 mt-3">
                Wait time is approximately 2 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#562C2C] mb-3">How are you feeling today?</h1>
        <p className="text-[#562C2C]/60">Describe your symptoms and we'll match you with the right care.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., I've had a dry cough since yesterday and my chest feels tight..."
          className="w-full h-48 p-6 rounded-2xl border-2 border-[#562C2C]/10 focus:border-[#00A36C] focus:ring-0 resize-none text-lg text-[#562C2C] placeholder-[#562C2C]/30 shadow-sm transition-all bg-white/80"
          disabled={isAnalyzing}
        />
        
        <div className="absolute bottom-4 right-4">
          <button
            type="submit"
            disabled={!symptoms.trim() || isAnalyzing}
            className={`
              px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2
              ${!symptoms.trim() || isAnalyzing 
                ? 'bg-[#562C2C]/10 text-[#562C2C]/30 cursor-not-allowed' 
                : 'bg-[#00A36C] text-white hover:bg-[#008f5d] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}
            `}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-pulse">Analyzing...</span>
              </>
            ) : (
              <>
                Analyze Symptoms
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-12 grid grid-cols-3 gap-6 text-center">
        <div className="p-4 rounded-xl bg-[#FAF3DD]/50 border border-[#562C2C]/5">
          <div className="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-[#00A36C]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-medium text-[#562C2C]">Secure & Private</h3>
        </div>
        <div className="p-4 rounded-xl bg-[#FAF3DD]/50 border border-[#562C2C]/5">
          <div className="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-[#00A36C]">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-medium text-[#562C2C]">AI Analysis</h3>
        </div>
        <div className="p-4 rounded-xl bg-[#FAF3DD]/50 border border-[#562C2C]/5">
          <div className="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-[#00A36C]">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-medium text-[#562C2C]">Human Care</h3>
        </div>
      </div>
    </div>
  );
}
