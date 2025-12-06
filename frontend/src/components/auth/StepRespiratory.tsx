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
        <h3 className="text-2xl font-bold text-brand-brown">Respiratory Profile</h3>
        <p className="text-brand-brown/60 text-sm">Calibrating sensitivity models.</p>
      </div>

      <div className="space-y-6">
        {/* Conditions Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-brown/60 uppercase tracking-wider ml-1">Medical Conditions</label>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map((condition) => (
              <button
                key={condition}
                onClick={() => toggleCondition(condition)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                  formData.conditions?.includes(condition)
                    ? "bg-brand-green text-white border-brand-green shadow-md"
                    : "bg-white/50 text-brand-brown/60 border-brand-brown/10 hover:bg-brand-brown/5"
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        {/* Inhaler Usage Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-brand-brown/60 uppercase tracking-wider ml-1">Inhaler Usage (Weekly)</label>
            <span className="text-2xl font-bold text-brand-green">{formData.inhalerUsage}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={formData.inhalerUsage}
            onChange={(e) => updateFields({ inhalerUsage: parseInt(e.target.value) })}
            className="w-full h-2 bg-brand-brown/10 rounded-lg appearance-none cursor-pointer accent-brand-green"
          />
          <div className="flex justify-between text-xs text-brand-brown/40">
            <span>Never</span>
            <span>Daily+</span>
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
          className="flex-[2] bg-brand-green text-white py-3 rounded-xl font-bold hover:bg-brand-brown transition-colors shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2"
        >
          Next Step <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default StepRespiratory;
