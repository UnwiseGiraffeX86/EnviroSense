"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import { 
  Search, 
  Filter, 
  ChevronRight,
  Loader2
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export default function PatientDirectory() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Patients");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // 1. Fetch all profiles with role 'patient'
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'patient');

        if (profilesError) throw profilesError;

        // 2. Fetch latest log for each patient to determine 'Last Active'
        const patientsWithStatus = await Promise.all(profiles.map(async (profile) => {
          const { data: logs } = await supabase
            .from('daily_logs')
            .select('created_at')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(1);

          const lastActive = logs && logs.length > 0 
            ? new Date(logs[0].created_at).toLocaleDateString() + ' ' + new Date(logs[0].created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            : 'Never';

          // Mocking Risk/Sector for now as they aren't in DB yet
          return {
            id: profile.id,
            name: profile.full_name || "Unknown Patient",
            sector: "Sector 1", // Mock
            lastActive: lastActive,
            risk: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low", // Mock
            status: "Stable" // Mock
          };
        }));

        setPatients(patientsWithStatus);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "High Risk Only") {
      return matchesSearch && patient.risk === "High";
    }
    if (filterType === "Sector 1 Only") {
      return matchesSearch && patient.sector === "Sector 1";
    }
    return matchesSearch;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-orange-400";
      case "Low": return "bg-green-500";
      default: return "bg-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Patient Directory</h1>
          <p className="text-[#64748B]">Manage and monitor patient records.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option>All Patients</option>
              <option>High Risk Only</option>
              <option>Sector 1 Only</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-[#1E293B]">Name</th>
                <th className="px-6 py-4 font-semibold text-[#1E293B]">Sector</th>
                <th className="px-6 py-4 font-semibold text-[#1E293B]">Last Active</th>
                <th className="px-6 py-4 font-semibold text-[#1E293B]">Risk Status</th>
                <th className="px-6 py-4 font-semibold text-[#1E293B] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Loading patients...
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#334155] group-hover:text-[#0077B6] transition-colors">
                        {patient.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{patient.sector}</td>
                    <td className="px-6 py-4 text-slate-500">{patient.lastActive}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${getRiskColor(patient.risk)}`} />
                        <span className="text-slate-700 font-medium">{patient.risk}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/doctor/patients/${patient.id}`);
                        }}
                        className="text-slate-400 hover:text-[#0077B6] p-2 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No patients found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


