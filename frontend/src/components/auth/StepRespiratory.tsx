import React from "react";
import { motion } from "framer-motion";
import { Activity, Wind, ArrowRight, ArrowLeft } from "lucide-react";

interface StepRespiratoryProps {
  formData: any;
  updateFields: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const CONDITIONS = [
  "Asthma",
  "COPD",
  "Bronchitis",
  "Allergies",
  "Smoker",
  "None",
];

const StepRespiratory: React.FC<StepRespiratoryProps> = ({ formData, updateFields, onNext, onBack }) => {
  const toggleCondition = (condition: string) => {
    const current = formData.conditions || [];
    if (condition === "None") {
      updateFields({ conditions: ["None"] });
      return;
    }
    
    let updated = [...current];
    if (updated.includes("None")) {
      updated = updated.filter(c => c !== "None");
    }

    if (updated.includes(condition)) {
      updated = updated.filter((c) => c !== condition);
    } else {
      updated.push(condition);
    }
    updateFields({ conditions: updated });
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-light text-[#562C2C]">Respiratory Profile</h3>
        <p className="text-[#562C2C]/60 text-sm">Mapping your lung health.</p>
      </div>

      <div className="space-y-6">
        {/* Conditions Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#562C2C]/60 uppercase tracking-wider ml-1">Known Conditions</label>
          <div className="grid grid-cols-2 gap-3">
            {CONDITIONS.map((condition) => {
              const isSelected = formData.conditions?.includes(condition);
              return (
                <button
                  key={condition}
                  onClick={() => toggleCondition(condition)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all border ${
                    isSelected
                      ? "bg-[#00A36C]/10 border-[#00A36C] text-[#00A36C]"
                      : "bg-white/50 border-[#562C2C]/10 text-[#562C2C]/70 hover:bg-[#562C2C]/5"
                  }`}
                >
                  {condition}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inhaler Usage Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-[#562C2C]/60 uppercase tracking-wider ml-1">Inhaler Usage (Weekly)</label>
            <span className="text-2xl font-light text-[#00A36C]">{formData.inhalerUsage}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={formData.inhalerUsage}
            onChange={(e) => updateFields({ inhalerUsage: parseInt(e.target.value) })}
            className="w-full h-2 bg-[#562C2C]/10 rounded-lg appearance-none cursor-pointer accent-[#00A36C]"
          />
          <div className="flex justify-between text-xs text-[#562C2C]/40">
            <span>Never</span>
            <span>Daily+</span>
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
          className="flex-[2] py-3 bg-[#00A36C] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#00A36C]/90 transition-colors shadow-lg shadow-[#00A36C]/20"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default StepRespiratory;
