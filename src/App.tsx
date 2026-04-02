import React, { useState, useCallback } from "react";
import { LoginView } from "./features/auth/LoginView";
import { PasswordView } from "./features/auth/PasswordView";
import { OTPMethodView } from "./features/auth/OTPMethodView";
import { OTPInputView } from "./features/auth/OTPInputView";
import { motion, AnimatePresence } from "framer-motion";
import SkillbeekLoader from "./components/common/SkillbeekLoader";

type ViewState = "login" | "password" | "otp" | "otpInput";

function App() {
  const [currentView, setCurrentView] = useState<ViewState>("login");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isKnownDevice, setIsKnownDevice] = useState(true);
  const [email, setEmail] = useState("");
  const [selectedOTPMethod, setSelectedOTPMethod] = useState<string | null>(null);
  const [discardedOTPMethods, setDiscardedOTPMethods] = useState<string[]>([]);

  /* ── Auth Flow: Login → Overlay Loader (2s delay) → Password/OTP ───── */
  const handleLoginContinue = useCallback((enteredEmail: string) => {
    setEmail(enteredEmail);
    // 1. Show the loader OVERLAY
    setIsAuthenticating(true);

    // 2. Simulate 2s auth processing delay
    setTimeout(() => {
      // 3. Switch the background view underneath the overlay
      if (isKnownDevice) {
        setCurrentView("password");
      } else {
        setDiscardedOTPMethods([]);
        setCurrentView("otp");
      }
      // 4. Hide the loader overlay to reveal the new screen
      setIsAuthenticating(false);
    }, 2000);
  }, [isKnownDevice]);

  const handleBack = () => {
    setCurrentView("login");
  };

  const handleMethodSelection = (method: string) => {
    setSelectedOTPMethod(method);
    setCurrentView("otpInput");
  };

  const handleOTPBack = () => {
    setCurrentView("otp");
  };

  const handleMoreOptions = () => {
    if (selectedOTPMethod) {
      setDiscardedOTPMethods((prev) => [...prev, selectedOTPMethod]);
    }
    setCurrentView("otp");
  };

  /* ── Shared fade transition (no slide) ──────────────────────── */
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  };

  const fadeTransition = { duration: 0.35, ease: "easeInOut" as const };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 selection:bg-purple-200">
      
      {/* Dev Controls */}
      <div className="mb-4 bg-neutral-800 p-4 rounded-[16px] flex gap-4 items-center text-white font-['Nunito'] shadow-xl">
        <span className="font-bold text-[14px]">Dev Toggles:</span>
        <label className="flex items-center gap-2 cursor-pointer text-[14px]">
          <input 
            type="checkbox" 
            checked={isKnownDevice} 
            onChange={(e) => setIsKnownDevice(e.target.checked)}
            className="w-4 h-4 accent-purple-500"
          />
          Known Device (Bypass OTP)
        </label>
        <button 
          onClick={() => {
            setCurrentView("login");
            setIsAuthenticating(false);
          }}
          className="ml-4 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-[8px] text-[12px] font-bold transition-colors"
        >
          Reset Flow
        </button>
        <button 
          onClick={() => setIsAuthenticating(prev => !prev)}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-[8px] text-[12px] font-bold transition-colors shadow-[0_0_10px_rgba(168,85,247,0.4)]"
        >
          Toggle Loader Overlay
        </button>
      </div>

      {/* Mobile constraint container for Desktop Sandboxing */}
      <div className="w-[396px] h-[824px] bg-black rounded-[36px] p-[6px] shadow-2xl relative overflow-hidden ring-4 ring-neutral-800">
        
        {/* We use a wrapper with bg-[#fbf6ff] to ensure screens have a solid background color */}
        <div className="w-full h-full relative overflow-hidden bg-[#fbf6ff] rounded-[30px]">

          {/* ── Main Screen Routes ──────────────────────────────── */}
          <AnimatePresence mode="wait">
            {currentView === "login" && (
              <motion.div
                key="login"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={fadeTransition}
                className="w-full h-full"
              >
                <LoginView onContinue={handleLoginContinue} />
              </motion.div>
            )}

            {currentView === "password" && (
              <motion.div
                key="password"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={fadeTransition}
                className="w-full h-full"
              >
                <PasswordView email={email} onBack={handleBack} />
              </motion.div>
            )}

            {currentView === "otp" && (
              <motion.div
                key="otp"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={fadeTransition}
                className="w-full h-full"
              >
                <OTPMethodView 
                  email={email} 
                  onBack={handleBack} 
                  discardedMethods={discardedOTPMethods}
                  onSelectMethod={handleMethodSelection}
                />
              </motion.div>
            )}

            {currentView === "otpInput" && (
              <motion.div
                key="otpInput"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={fadeTransition}
                className="w-full h-full"
              >
                {/* Requires importing OTPInputView once it is created */}
                <OTPInputView 
                  email={email} 
                  selectedMethod={selectedOTPMethod}
                  onBack={handleOTPBack}
                  onMoreOptions={handleMoreOptions}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Loader Overlay (Top Layer) ──────────────────────── */}
          {/* This sits ON TOP of whichever screen is active */}
          <AnimatePresence>
            {isAuthenticating && (
              <motion.div
                key="authenticating-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                // Using exactly #2F2C32 with 26% opacity via Tailwind arbitrary values
                className="absolute inset-0 z-50 flex items-center justify-center bg-[#2F2C32]/[0.26]"
              >
                <SkillbeekLoader size={120} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

export default App;
