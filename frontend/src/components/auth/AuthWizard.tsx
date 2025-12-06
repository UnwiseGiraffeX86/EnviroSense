import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import StepIdentity from "./StepIdentity";
import StepBiometrics from "./StepBiometrics";
import StepRespiratory from "./StepRespiratory";
import StepCalibration from "./StepCalibration";
import LoginForm from "./LoginForm";
import { ChevronLeft } from "lucide-react";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export type AuthMode = "LOGIN" | "SIGNUP";

const AuthWizard = () => {
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

      if (authData.user) {
        // 2. Create Profile Record
        // Note: This assumes you have a 'profiles' table with these columns.
        // If not, you might need to adjust this or create the table.
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
            },
          ]);

        if (profileError) {
            // If profile creation fails, we might want to warn the user 
            // but the auth account is already created.
            console.error("Profile creation failed:", profileError);
            // Ideally, you'd have a retry mechanism or a way to complete profile later.
        }
      }

      // Redirect to dashboard or onboarding success
      window.location.href = "/chat"; 

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
              className="p-2 hover:bg-brand-brown/5 rounded-full transition-colors text-brand-brown/60"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setMode("LOGIN")}
              className="p-2 hover:bg-brand-brown/5 rounded-full transition-colors text-brand-brown/60"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= step ? "w-8 bg-brand-green" : "w-2 bg-brand-brown/10"
                }`}
              />
            ))}
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      )}

      <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-brown/10 rounded-full blur-3xl pointer-events-none" />

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
