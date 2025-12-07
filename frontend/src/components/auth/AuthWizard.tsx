"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import StepIdentity from "./StepIdentity";
import StepBiometrics from "./StepBiometrics";
import StepRespiratory from "./StepRespiratory";
import StepCalibration from "./StepCalibration";
import LoginForm from "./LoginForm";
import { ChevronLeft } from "lucide-react";

import { useRouter } from "next/navigation";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Create a single instance of the Supabase client
let supabase: ReturnType<typeof createClient>;

if (typeof window !== 'undefined') {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  // Server-side fallback (though this component is client-side only)
  supabase = createClient(supabaseUrl, supabaseKey);
}

export type AuthMode = "LOGIN" | "SIGNUP";

const AuthWizard = () => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Consolidated Form Data
  const [formData, setFormData] = useState({
    // Identity
    fullName: "",
    email: "",
    password: "",
    // Biometrics
    dob: "",
    sex: "",
    sector: "",
    // Respiratory
    conditions: [] as string[],
    inhalerUsage: 0,
    // Calibration
    activityLevel: "",
    pollutionSensitivity: 5,
  });

  const updateFields = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Sign Up User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (authError) throw authError;

      // Check if session exists (required for RLS)
      if (authData.user && !authData.session) {
        // Email confirmation is enabled, so we can't insert into profiles yet.
        // We'll just redirect to a "Check your email" page or let them know.
        // For now, we'll just skip the profile creation and let them do it later or 
        // rely on them confirming email first.
        // Ideally, we should show a message.
        alert("Please check your email to confirm your account. You can complete your profile after logging in.");
        router.push("/login");
        return;
      }

      if (authData.user && authData.session) {
        // 2. Create Profile Record
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: authData.user.id,
              full_name: formData.fullName,
              dob: formData.dob,
              sex: formData.sex,
              sector: formData.sector,
              respiratory_conditions: formData.conditions,
              inhaler_usage_frequency: formData.inhalerUsage,
              activity_level: formData.activityLevel,
              pollution_sensitivity: formData.pollutionSensitivity,
            } as any,
          ] as any);

        if (profileError) {
            // If profile creation fails, we throw so it's caught below and displayed
            throw new Error(`Profile creation failed: ${profileError.message}`);
        }
      }

      // Redirect to dashboard or onboarding success
      router.push("/chat");

    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header / Navigation for Wizard */}
      {mode === "SIGNUP" && (
        <div className="mb-8 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="p-2 hover:bg-[#562C2C]/5 rounded-full transition-colors text-[#562C2C]/60"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setMode("LOGIN")}
              className="p-2 hover:bg-[#562C2C]/5 rounded-full transition-colors text-[#562C2C]/60"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= step ? "w-8 bg-[#00A36C]" : "w-2 bg-[#562C2C]/10"
                }`}
              />
            ))}
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#00A36C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#562C2C]/10 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait" custom={1}>
          {mode === "LOGIN" ? (
            <LoginForm key="login" onSwitchToSignup={() => setMode("SIGNUP")} />
          ) : (
            <motion.div
              key={`step-${step}`}
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {step === 1 && (
                <StepIdentity
                  formData={formData}
                  updateFields={updateFields}
                  onNext={nextStep}
                />
              )}
              {step === 2 && (
                <StepBiometrics
                  formData={formData}
                  updateFields={updateFields}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {step === 3 && (
                <StepRespiratory
                  formData={formData}
                  updateFields={updateFields}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {step === 4 && (
                <StepCalibration
                  formData={formData}
                  updateFields={updateFields}
                  onSubmit={handleFinalSubmit}
                  onBack={prevStep}
                  loading={loading}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && mode === "SIGNUP" && (
           <div className="mt-4 text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg animate-pulse">
             {error}
           </div>
        )}
      </div>
    </div>
  );
};

export default AuthWizard;
