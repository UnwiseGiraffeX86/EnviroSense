"use client";

import React, { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";
import { 
  Users, 
  Activity, 
  AlertCircle, 
  CalendarClock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export default function DoctorDashboard() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [triageRequests, setTriageRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, new: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const handleAcceptTriage = (id: number) => {
    setTriageRequests(prev => prev.filter(req => req.id !== id));
    // In a real app, this would update the DB
  };

  const handleDeclineTriage = (id: number) => {
    setTriageRequests(prev => prev.filter(req => req.id !== id));
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Total Patients (Real)
        const { count: totalPatients } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'patient');

        // 2. Fetch Recent Logs for Watchlist (Real) - Manual Join
        const { data: recentLogs, error: logsError } = await supabase
          .from('daily_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20); 

        if (logsError) {
            console.error("Error fetching logs:", logsError);
        }

        // 3. Fetch Triage Requests (Real from Logs) - Manual Join
        const { data: triageLogs, error: triageError } = await supabase
          .from('daily_logs')
          .select('*')
          .ilike('transcript', 'TRIAGE REQUEST%')
          .order('created_at', { ascending: false });

        if (triageError) {
            console.error("Error fetching triage logs:", triageError);
        }

        // 4. Fetch Profiles manually
        const userIds = new Set<string>();
        recentLogs?.forEach((l: any) => l.user_id && userIds.add(l.user_id));
        triageLogs?.forEach((l: any) => l.user_id && userIds.add(l.user_id));

        let profilesMap: Record<string, any> = {};
        if (userIds.size > 0) {
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name')
                .in('id', Array.from(userIds));
            
            profiles?.forEach((p: any) => {
                profilesMap[p.id] = p;
            });
        }

        setStats({
          total: totalPatients || 0,
          new: 3, // Fake
          pending: (triageLogs?.length || 0) + 12 // Real + Fake
        });

        // Process Watchlist - Filter for "Critical" conditions
        let formattedWatchlist: any[] = [];
        if (recentLogs) {
           formattedWatchlist = recentLogs
            .filter((log: any) => (log.breathing_status === 'Severe' || log.focus_level <= 3) && !log.transcript?.startsWith('TRIAGE REQUEST')) 
            .map((log: any) => ({
              id: log.id,
              patientId: log.user_id,
              name: profilesMap[log.user_id]?.full_name || "Unknown Patient",
              risk: "High",
              flag: log.breathing_status === 'Severe' ? 'Severe Breathing Alert' : 'Low Focus Alert',
              time: new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            }));
        }
        
        // If empty, add a fake one for demo to ensure UI isn't empty
        if (formattedWatchlist.length === 0) {
             formattedWatchlist.push({
                id: 'demo-1',
                patientId: 'demo-patient-id', // Changed from fake-id to avoid 400 errors if used in queries
                name: "Mihai Ionescu",
                risk: "High",
                flag: "Severe Breathing Alert",
                time: "10:42 AM"
             });
        }
        setWatchlist(formattedWatchlist);

        // Process Triage - Mix of Fake and Real
        let initialTriage: any[] = [];
        
        if (triageLogs && triageLogs.length > 0) {
          initialTriage = triageLogs.map((log: any) => {
            // Extract symptom from "TRIAGE REQUEST: Symptom - Description"
            const parts = log.transcript.split(' - ');
            const type = parts[0].replace('TRIAGE REQUEST: ', '');
            
            return {
              id: log.id,
              name: profilesMap[log.user_id]?.full_name || "Unknown Patient",
              type: type,
              status: "Urgent" // All triage requests are urgent
            };
          });
        }

        // Add some fake ones if list is short
        if (initialTriage.length < 3) {
          initialTriage.push(
            { id: 101, name: "Stefan Geala", type: "Consultation Request", status: "Pending" },
            { id: 102, name: "Elena Dumitrescu", type: "Prescription Renewal", status: "Pending" }
          );
        }
        
        setTriageRequests(initialTriage);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-[#0077B6]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">EnviroSense MD</h1>
          <p className="text-[#64748B]">Overview of patient status and daily tasks.</p>
        </div>
        <div className="text-sm text-[#64748B] bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Top Section: Sentinel Watchlist (2/3) & Incoming Triage (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sentinel Watchlist */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-red-50/50">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <h2 className="font-semibold text-[#1E293B]">Sentinel Watchlist</h2>
            </div>
            <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {watchlist.length} Critical
            </span>
          </div>
          
          <div className="divide-y divide-slate-100 flex-1">
            {watchlist.length > 0 ? watchlist.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div className="flex items-start gap-4">
                  <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${item.risk === 'High' ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`} />
                  <div>
                    <h3 className="font-medium text-[#334155] group-hover:text-[#0077B6] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-red-600 font-medium mt-0.5">
                      {item.flag}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push(`/doctor/patients/${item.patientId}`)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#0077B6] bg-[#E0F2FE] rounded-lg hover:bg-[#BAE6FD] transition-colors"
                >
                  <FileText size={16} />
                  Review Chart
                </button>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-500">No critical alerts.</div>
            )}
          </div>
        </div>

        {/* Incoming Triage */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="text-[#0077B6]" size={20} />
              <h2 className="font-semibold text-[#1E293B]">Incoming Triage</h2>
            </div>
            <button className="text-xs text-[#0077B6] hover:underline">View All</button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {triageRequests.map((req) => (
              <div key={req.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-[#334155]">{req.name}</h3>
                    <p className="text-xs text-slate-500">{req.type}</p>
                  </div>
                  {req.status === 'Urgent' && (
                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">URGENT</span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => handleAcceptTriage(req.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                  >
                    <CheckCircle2 size={14} /> Accept
                  </button>
                  <button 
                    onClick={() => handleDeclineTriage(req.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    <XCircle size={14} /> Decline
                  </button>
                </div>
              </div>
            ))}
            {triageRequests.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">No pending triage requests.</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Population Health Snapshot */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-[#1E293B]">Population Health Snapshot</h2>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-slate-600">Stable (65%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-slate-600">Moderate Risk (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-slate-600">High Risk (10%)</span>
            </div>
          </div>
        </div>

        {/* Simple CSS Bar Chart Visualization */}
        <div className="h-12 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-green-500 hover:bg-green-600 transition-colors w-[65%]" title="Stable: 65%" />
          <div className="h-full bg-orange-400 hover:bg-orange-500 transition-colors w-[25%]" title="Moderate: 25%" />
          <div className="h-full bg-red-500 hover:bg-red-600 transition-colors w-[10%]" title="High Risk: 10%" />
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Patients</p>
            <p className="text-xl font-bold text-[#1E293B]">{stats.total}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">New This Week</p>
            <p className="text-xl font-bold text-[#0077B6]">+{stats.new}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pending Review</p>
            <p className="text-xl font-bold text-orange-500">{stats.pending}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


