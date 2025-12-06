import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, ArrowRight, ArrowLeft } from "lucide-react";

interface StepBiometricsProps {
  formData: any;
  updateFields: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepBiometrics: React.FC<StepBiometricsProps> = ({ formData, updateFields, onNext, onBack }) => {
  const isValid = formData.dob && formData.sex && formData.sector;

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-brand-brown">Biometrics</h3>
        <p className="text-brand-brown/60 text-sm">Establishing medical baselines.</p>
      </div>

      <div className="space-y-4">
        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-brown/60 uppercase tracking-wider ml-1">Date of Birth</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/40" />
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => updateFields({ dob: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-brand-brown/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-brand-brown"
            />
          </div>
        </div>

        {/* Biological Sex */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-brown/60 uppercase tracking-wider ml-1">Biological Sex</label>
          <div className="flex bg-white/50 p-1 rounded-xl border border-brand-brown/10">
            {["Male", "Female", "Other"].map((option) => (
              <button
                key={option}
                onClick={() => updateFields({ sex: option })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.sex === option
                    ? "bg-brand-green text-white shadow-md"
                    : "text-brand-brown/60 hover:bg-brand-brown/5"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-brown/60 uppercase tracking-wider ml-1">Bucharest Sector</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/40" />
            <select
              value={formData.sector}
              onChange={(e) => updateFields({ sector: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-brand-brown/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-brand-brown appearance-none"
            >
              <option value="">Select Sector</option>
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <option key={s} value={s}>
                  Sector {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl font-bold text-brand-brown/60 hover:bg-brand-brown/5 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-[2] bg-brand-green text-white py-3 rounded-xl font-bold hover:bg-brand-brown transition-colors shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default StepBiometrics;
