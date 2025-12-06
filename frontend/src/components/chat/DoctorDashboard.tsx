"use client";

import { useState } from 'react';

interface DoctorDashboardProps {
  queue: any[];
  activeCase: any;
  onAcceptCase: (id: string) => void;
  onSelectCase: (c: any) => void;
  messages: any[];
  onSendMessage: (text: string) => void;
}

export default function DoctorDashboard({ 
  queue, 
  activeCase, 
  onAcceptCase, 
  onSelectCase,
  messages,
  onSendMessage
}: DoctorDashboardProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      {/* Left Sidebar: Queue */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Incoming Referrals</h2>
          <span className="text-xs text-gray-500">{queue.length} pending cases</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {queue.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No pending cases.
            </div>
          )}
          {queue.map((c) => (
            <div 
              key={c.id}
              onClick={() => onSelectCase(c)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeCase?.id === c.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-gray-900 text-sm">
                  {c.profiles?.full_name || 'Anonymous'}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  c.ai_analysis?.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {c.ai_analysis?.severity || 'Medium'}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {c.initial_symptoms}
              </p>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {activeCase ? (
          <>
            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Consultation #{activeCase.id.slice(0, 8)}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Patient: {activeCase.profiles?.full_name}
                  </p>
                </div>
                {activeCase.status === 'waiting_doctor' && (
                  <button
                    onClick={() => onAcceptCase(activeCase.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Accept Case
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {/* AI Summary Block in Chat */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm mb-6">
                  <div className="flex items-center gap-2 mb-2 text-blue-800 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    AI Triage Summary
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-blue-600 block text-xs uppercase tracking-wide">Symptoms</span>
                      <p className="text-gray-700">{activeCase.initial_symptoms}</p>
                    </div>
                    <div>
                      <span className="text-blue-600 block text-xs uppercase tracking-wide">Potential Causes</span>
                      <p className="text-gray-700">{activeCase.ai_analysis?.possible_causes?.join(", ")}</p>
                    </div>
                  </div>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === activeCase.patient_id ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        msg.is_system_message
                          ? 'bg-gray-200 text-gray-600 text-center w-full'
                          : msg.sender_id === activeCase.patient_id
                          ? 'bg-white border border-gray-200 text-gray-800'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {activeCase.status === 'active' && (
                <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Sidebar: Eco-Context Panel */}
            <div className="w-72 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Eco-Context Panel
              </h3>

              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Air Quality (PM2.5)</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {activeCase.ai_analysis?.weather_context?.pm25 || 0}
                    </span>
                    <span className="text-xs text-gray-500 mb-1">µg/m³</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        (activeCase.ai_analysis?.weather_context?.pm25 || 0) > 25 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((activeCase.ai_analysis?.weather_context?.pm25 || 0) * 2, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {activeCase.ai_analysis?.weather_context?.note}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">AI Hypothesis</span>
                  <p className="text-sm text-gray-700">
                    Symptom onset correlates with environmental factors.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {activeCase.ai_analysis?.possible_causes?.map((cause: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                        {cause}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Recommended Action</span>
                  <p className="text-sm text-gray-700">
                    Review respiratory history. Consider prescribing antihistamines if allergy suspected.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
            Select a case to view details
          </div>
        )}
      </div>
    </div>
  );
}
