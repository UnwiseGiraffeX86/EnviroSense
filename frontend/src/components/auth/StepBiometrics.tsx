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
        <h3 className="text-2xl font-light text-[#562C2C]">Biometrics</h3>
        <p className="text-[#562C2C]/60 text-sm">Establishing medical baselines.</p>
      </div>

      <div className="space-y-4">
        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#562C2C]/60 uppercase tracking-wider ml-1">Date of Birth</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#562C2C]/40" />
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => updateFields({ dob: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#562C2C]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A36C]/50 text-[#562C2C] transition-all"
            />
          </div>
        </div>

        {/* Biological Sex */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#562C2C]/60 uppercase tracking-wider ml-1">Biological Sex</label>
          <div className="flex bg-white/50 p-1 rounded-xl border border-[#562C2C]/10">
            {["Male", "Female", "Other"].map((option) => (
              <button
                key={option}
                onClick={() => updateFields({ sex: option })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.sex === option
                    ? "bg-[#00A36C] text-white shadow-md"
                    : "text-[#562C2C]/60 hover:bg-[#562C2C]/5"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#562C2C]/60 uppercase tracking-wider ml-1">Sector</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#562C2C]/40" />
            <select
              value={formData.sector}
              onChange={(e) => updateFields({ sector: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#562C2C]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A36C]/50 text-[#562C2C] appearance-none transition-all"
            >
              <option value="" disabled>Select your region</option>
              <option value="NA">North America</option>
              <option value="EU">Europe</option>
              <option value="AS">Asia</option>
              <option value="OC">Oceania</option>
              <option value="SA">South America</option>
              <option value="AF">Africa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-[#562C2C]/10 text-[#562C2C] rounded-xl font-medium hover:bg-[#562C2C]/5 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-[2] py-3 bg-[#00A36C] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#00A36C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00A36C]/20"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default StepBiometrics;
