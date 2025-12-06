"use client";

import { useState } from 'react';

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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-teal-100">
          <div className="bg-teal-50 p-6 border-b border-teal-100">
            <h2 className="text-2xl font-semibold text-teal-900 mb-2">Care Card</h2>
            <p className="text-teal-700">We've analyzed your input against local environmental factors.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Health Insight</h3>
                <p className="text-gray-600 mt-1">
                  Your symptoms align with <span className="font-medium text-gray-900">{analysisResult.possible_causes[0]}</span>.
                  {analysisResult.weather_context.pm25 > 20 && (
                    <span> Note: High PM2.5 levels ({analysisResult.weather_context.pm25}µg/m³) in your sector may be exacerbating this.</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Specialist Recommendation</h3>
                <p className="text-gray-600 mt-1">
                  Based on this, we recommend a review by a <span className="font-medium text-purple-700">{analysisResult.medical_specialty || 'General Practitioner'}</span>.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={onStartChat}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Connect with a Doctor
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
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
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How are you feeling today?</h1>
        <p className="text-gray-500">Describe your symptoms and we'll match you with the right care.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., I've had a dry cough since yesterday and my chest feels tight..."
          className="w-full h-48 p-6 rounded-2xl border-2 border-gray-100 focus:border-teal-500 focus:ring-0 resize-none text-lg text-gray-700 shadow-sm transition-all"
          disabled={isAnalyzing}
        />
        
        <div className="absolute bottom-4 right-4">
          <button
            type="submit"
            disabled={!symptoms.trim() || isAnalyzing}
            className={`
              px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2
              ${!symptoms.trim() || isAnalyzing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}
            `}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-pulse">Analyzing...</span>
              </>
            ) : (
              <>
                Analyze Symptoms
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-12 grid grid-cols-3 gap-6 text-center">
        <div className="p-4 rounded-xl bg-gray-50">
          <div className="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-teal-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900">Secure & Private</h3>
        </div>
        <div className="p-4 rounded-xl bg-gray-50">
          <div className="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-teal-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900">AI Analysis</h3>
        </div>
        <div className="p-4 rounded-xl bg-gray-50">
          <div className="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-teal-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900">Human Care</h3>
        </div>
      </div>
    </div>
  );
}
