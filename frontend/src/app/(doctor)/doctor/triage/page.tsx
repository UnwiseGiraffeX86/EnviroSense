"use client";

import React, { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  User,
  XCircle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function TriagePage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchTriageRequests = async () => {
    setLoading(true);
    try {
      // 1. Fetch Logs
      const { data: logs, error: logsError } = await supabase
        .from('daily_logs')
        .select('*')
        .ilike('transcript', 'TRIAGE REQUEST%')
        // .neq('ai_risk_assessment', 'Resolved') // Temporarily removed to debug
        .order('created_at', { ascending: false });

      if (logsError) {
        console.error("Supabase Error Details (Logs):", JSON.stringify(logsError, null, 2));
        throw logsError;
      }

      // 2. Fetch Profiles manually to avoid FK issues
      let formattedRequests: any[] = [];
      
      if (logs && logs.length > 0) {
        const userIds = Array.from(new Set(logs.map(log => log.user_id)));
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
          
        if (profilesError) {
           console.error("Supabase Error Details (Profiles):", JSON.stringify(profilesError, null, 2));
           // Continue without profiles if error, or throw? Let's continue with unknown.
        }

        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

        formattedRequests = logs.map(log => {
          const profile = profilesMap.get(log.user_id);
          const parts = log.transcript.split(' - ');
          const type = parts[0].replace('TRIAGE REQUEST: ', '');
          const description = parts[1] || "No description provided";

          return {
            id: log.id,
            patientId: log.user_id,
            name: profile?.full_name || "Unknown Patient",
            email: profile?.email,
            type: type,
            description: description,
            severity: log.breathing_status === 'Severe' ? 'Critical' : 'Urgent',
            time: new Date(log.created_at),
            status: 'Pending'
          };
        });
      }

      setRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching triage requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTriageRequests();
    
    // Real-time subscription
    const channel = supabase
      .channel('triage_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_logs',
          filter: 'transcript=ilike.TRIAGE REQUEST%'
        },
        () => {
          fetchTriageRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleResolve = async (id: string) => {
    try {
      // Mark as resolved in DB
      const { error } = await supabase
        .from('daily_logs')
        .update({ ai_risk_assessment: 'Resolved' })
        .eq('id', id);

      if (error) throw error;

      // Optimistic update
      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (error) {
      console.error("Error resolving request:", error);
      alert("Failed to resolve request");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Triage & Alerts</h1>
          <p className="text-slate-500">Manage incoming patient requests and critical alerts</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B6]"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-semibold text-[#1E293B]">All Caught Up</h3>
          <p className="text-slate-500 mt-1">No pending triage requests at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 text-slate-500`}>
                    <User size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg text-[#1E293B]">{req.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityColor(req.severity)}`}>
                        {req.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} />
                        {req.time.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[#0077B6] font-medium mb-1">{req.type}</p>
                    <p className="text-slate-600 text-sm">{req.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Link 
                    href={`/doctor/patients/${req.patientId}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0077B6] text-white rounded-lg text-sm font-medium hover:bg-[#005f92] transition-colors"
                  >
                    View Patient <ArrowRight size={16} />
                  </Link>
                  <button 
                    onClick={() => handleResolve(req.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    <CheckCircle2 size={16} /> Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
