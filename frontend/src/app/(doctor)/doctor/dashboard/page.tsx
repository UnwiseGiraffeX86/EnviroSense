import React from "react";
import { 
  Users, 
  Activity, 
  AlertCircle, 
  CalendarClock 
} from "lucide-react";

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Clinical Command</h1>
          <p className="text-[#64748B]">Overview of patient status and daily tasks.</p>
        </div>
        <div className="text-sm text-[#64748B] bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Patients" 
          value="124" 
          icon={Users} 
          trend="+3 this week"
          trendUp={true}
        />
        <StatCard 
          title="Critical Alerts" 
          value="5" 
          icon={AlertCircle} 
          color="text-red-600"
          bg="bg-red-50"
          trend="Requires attention"
          trendUp={false}
        />
        <StatCard 
          title="Active Monitoring" 
          value="28" 
          icon={Activity} 
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard 
          title="Appointments" 
          value="8" 
          icon={CalendarClock} 
          color="text-purple-600"
          bg="bg-purple-50"
          trend="Next: 2:00 PM"
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Alerts / Triage */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-[#1E293B]">Priority Triage</h2>
            <button className="text-sm text-[#0077B6] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-[#334155]">Patient #{1000 + i}</h3>
                    <span className="text-xs text-slate-400">10m ago</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    Reported high anxiety levels and irregular sleep patterns via voice log.
                  </p>
                </div>
                <button className="px-3 py-1 text-xs font-medium text-[#0077B6] bg-[#E0F2FE] rounded-full hover:bg-[#BAE6FD]">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Schedule */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="font-semibold text-[#1E293B] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors">
                + Add New Patient
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors">
                Create Clinical Note
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors">
                Schedule Follow-up
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color = "text-[#0077B6]", bg = "bg-[#E0F2FE]", trend, trendUp }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${bg} ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span className={trendUp === true ? "text-green-600" : trendUp === false ? "text-red-600" : "text-slate-500"}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
