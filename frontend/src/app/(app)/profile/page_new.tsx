"use client";

import React, { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  FileText, 
  Pill, 
  Save, 
  Loader2,
  CheckCircle2
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    address: "",
    emergency_contact: "",
    medical_history: "",
    current_medications: "",
    allergies: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (data) {
            setProfile({
              full_name: data.full_name || "",
              phone: data.phone || "",
              address: data.address || "",
              emergency_contact: data.emergency_contact || "",
              medical_history: data.medical_history || "",
              current_medications: data.current_medications || "",
              allergies: data.allergies || ""
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("You must be logged in to save profile.");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-[#0077B6]" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">My Profile</h1>
        <p className="text-[#64748B]">Manage your personal and medical information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-semibold text-[#1E293B] flex items-center gap-2">
            <User size={20} className="text-[#0077B6]" /> Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full pl-9 p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full pl-9 p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Emergency Contact</label>
            <div className="relative">
              <AlertCircle size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                name="emergency_contact"
                value={profile.emergency_contact}
                onChange={handleChange}
                className="w-full pl-9 p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                placeholder="Name & Phone"
              />
            </div>
          </div>
        </div>

        {/* Medical Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-semibold text-[#1E293B] flex items-center gap-2">
            <FileText size={20} className="text-[#0077B6]" /> Medical History
          </h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Conditions & History</label>
            <textarea
              name="medical_history"
              value={profile.medical_history}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] min-h-[80px]"
              placeholder="e.g. Asthma, Diabetes..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Pill size={16} /> Current Medications
            </label>
            <textarea
              name="current_medications"
              value={profile.current_medications}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] min-h-[80px]"
              placeholder="e.g. Albuterol 2 puffs as needed..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" /> Allergies
            </label>
            <textarea
              name="allergies"
              value={profile.allergies}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] min-h-[80px]"
              placeholder="e.g. Penicillin, Peanuts..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-[#0077B6] text-white rounded-xl font-semibold shadow-lg hover:bg-[#023E8A] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {success ? "Saved Successfully!" : "Save Profile"}
        </button>

      </form>
    </div>
  );
}
