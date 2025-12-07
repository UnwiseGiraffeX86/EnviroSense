import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Moon, Sunrise, EyeOff, ArrowRight, ArrowLeft, Zap } from "lucide-react";

interface StepNeuroProps {
  formData: any;
  updateFields: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const SLEEP_TYPES = [
  { id: "deep", label: "Deep Sleeper", icon: Moon },
  { id: "light", label: "Light Sleeper", icon: Sunrise },
  { id: "insomnia", label: "Insomniac", icon: EyeOff },
];

const STRESS_TRIGGERS = [
  "Heatwaves",
  "Traffic Noise",
  "Smog/Odors",
  "Lack of Greenery",
  "Crowds",
];

const StepNeuro: React.FC<StepNeuroProps> = ({ formData, updateFields, onNext, onBack }) => {
  // Helper to update nested neuro state
  const updateNeuro = (key: string, value: any) => {
    updateFields({
      neuro: {
        ...formData.neuro,
        [key]: value,
      },
    });
  };

  const toggleTrigger = (trigger: string) => {
    const current = formData.neuro.stressTriggers || [];
    let updated;
    if (current.includes(trigger)) {
      updated = current.filter((t: string) => t !== trigger);
    } else {
      updated = [...current, trigger];
    }
    updateNeuro("stressTriggers", updated);
  };

  const isValid = formData.neuro.sleepType && formData.neuro.stressTriggers.length > 0;

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="space-y-4"
    >
      <div className="text-center mb-2">
        <h3 className="text-xl font-light text-[#562C2C]">Neuro-Sensitivity</h3>
        <p className="text-[#562C2C]/60 text-xs">Calibrating your environmental resilience.</p>
      </div>

      <div className="space-y-4">
        {/* A. Brain Fog Index */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="w-4 h-4 text-[#00A36C]" />
            <label className="text-[10px] font-bold text-[#562C2C]/60 uppercase tracking-wider">Brain Fog Index</label>
          </div>
          
          <div className="relative pt-4 pb-1">
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={formData.neuro.focusIndex}
              onChange={(e) => updateNeuro("focusIndex", parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#562C2C]/10 rounded-lg appearance-none cursor-pointer accent-[#00A36C]"
            />
            <div className="flex justify-between text-[10px] text-[#562C2C]/50 mt-1 font-medium">
              <span>Crystal Clear (0)</span>
              <span className="text-[#00A36C] font-bold text-base -mt-5">{formData.neuro.focusIndex}</span>
              <span>Frequent Fog (10)</span>
            </div>
          </div>
        </div>

        {/* B. Sleep & Restoration */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#562C2C]/60 uppercase tracking-wider ml-1">Sleep & Restoration</label>
          <div className="grid grid-cols-3 gap-2">
            {SLEEP_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.neuro.sleepType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => updateNeuro("sleepType", type.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-[#00A36C]/10 border-[#00A36C] text-[#00A36C]"
                      : "bg-white/50 border-[#562C2C]/10 text-[#562C2C]/60 hover:bg-[#562C2C]/5"
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${isSelected ? "text-[#00A36C]" : "text-[#562C2C]/40"}`} />
                  <span className="text-[10px] font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* C. Eco-Anxiety Triggers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-[#E07A5F]" />
            <label className="text-[10px] font-bold text-[#562C2C]/60 uppercase tracking-wider">Which factors disrupt your focus?</label>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STRESS_TRIGGERS.map((trigger) => {
              const isSelected = formData.neuro.stressTriggers.includes(trigger);
              return (
                <button
                  key={trigger}
                  onClick={() => toggleTrigger(trigger)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    isSelected
                      ? "bg-[#E07A5F]/20 border-[#E07A5F] text-[#562C2C]"
                      : "bg-white/50 border-[#562C2C]/10 text-[#562C2C]/60 hover:bg-[#562C2C]/5"
                  }`}
                >
                  {trigger}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 border border-[#562C2C]/10 text-[#562C2C] rounded-xl font-medium hover:bg-[#562C2C]/5 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-[2] py-2.5 bg-[#00A36C] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#00A36C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00A36C]/20 text-sm"
        >
          Calibrate Final Model <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default StepNeuro;
