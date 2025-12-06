import React from "react";
import { motion } from "framer-motion";
import { Zap, CloudRain, Check, ArrowLeft } from "lucide-react";

interface StepCalibrationProps {
  formData: any;
  updateFields: (fields: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

const StepCalibration: React.FC<StepCalibrationProps> = ({ formData, updateFields, onSubmit, onBack, loading }) => {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-brand-brown">Final Calibration</h3>
        <p className="text-brand-brown/60 text-sm">Personalizing your digital twin.</p>
      </div>

      <div className="space-y-6">
        {/* Activity Level */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-brown/60 uppercase tracking-wider ml-1">Daily Activity Level</label>
          <div className="grid grid-cols-3 gap-2">
            {["Low", "Moderate", "High"].map((level) => (
              <button
                key={level}
                onClick={() => updateFields({ activityLevel: level })}
                className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                  formData.activityLevel === level
                    ? "bg-brand-green text-white border-brand-green shadow-md"
                    : "bg-white/50 text-brand-brown/60 border-brand-brown/10 hover:bg-brand-brown/5"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Pollution Sensitivity */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-brand-brown/60 uppercase tracking-wider ml-1">Pollution Sensitivity</label>
            <span className="text-2xl font-bold text-brand-green">{formData.pollutionSensitivity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={formData.pollutionSensitivity}
            onChange={(e) => updateFields({ pollutionSensitivity: parseInt(e.target.value) })}
            className="w-full h-2 bg-brand-brown/10 rounded-lg appearance-none cursor-pointer accent-brand-green"
          />
          <div className="flex justify-between text-xs text-brand-brown/40">
            <span>Resilient</span>
            <span>Sensitive</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 rounded-xl font-bold text-brand-brown/60 hover:bg-brand-brown/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading || !formData.activityLevel}
          className="flex-[2] bg-brand-green text-white py-3 rounded-xl font-bold hover:bg-brand-brown transition-colors shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Twin..." : "Complete Setup"} <Check className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default StepCalibration;
