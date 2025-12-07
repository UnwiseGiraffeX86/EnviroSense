import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

interface StepIdentityProps {
  formData: any;
  updateFields: (fields: any) => void;
  onNext: () => void;
}

const StepIdentity: React.FC<StepIdentityProps> = ({ formData, updateFields, onNext }) => {
  const isValid = formData.fullName && formData.email && formData.password;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-light text-[#562C2C]">Identity</h3>
        <p className="text-[#562C2C]/60 text-sm">Let's secure your data vault.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#562C2C]/40" />
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => updateFields({ fullName: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#562C2C]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A36C]/50 text-[#562C2C] placeholder:text-[#562C2C]/30 transition-all"
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#562C2C]/40" />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => updateFields({ email: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#562C2C]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A36C]/50 text-[#562C2C] placeholder:text-[#562C2C]/30 transition-all"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#562C2C]/40" />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => updateFields({ password: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#562C2C]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A36C]/50 text-[#562C2C] placeholder:text-[#562C2C]/30 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full py-3 bg-[#00A36C] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#00A36C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00A36C]/20"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
};

export default StepIdentity;
