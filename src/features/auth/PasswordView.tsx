import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, EyeClosedIcon, EyeOpenIcon } from "../../components/common/Icons";
import { SuccessAuthModal } from "../../components/common/SuccessAuthModal";

export function PasswordView({ email, onBack, onForgotPassword }: { email: string; onBack?: () => void; onForgotPassword?: () => void }) {
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSuccessAnimation, setIsSuccessAnimation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const isContinueEnabled = password.length > 0;

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder (mocked) */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-[16px] pb-[40px] flex flex-col items-center">
        {/* Back Button / Top Area */}
        <div className="w-full pt-[8px] pb-[12px] flex justify-start shrink-0">
          <button onClick={onBack} className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-gray-100 transition-colors">
            {/* We could use ChevronLeft here, but styling a text back-arrow closely matches basic nav headers until icon is supplied */}
            <svg viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="w-full flex items-center justify-center mb-[44px]">
          <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[32px] tracking-[-0.7px] text-center w-full">
            Enter your password
          </h1>
        </div>

        <div className="w-full flex flex-col items-center gap-[24px]">
          {/* Password Input Wrapper */}
          <div className="w-[352px] flex flex-col items-start shrink-0">
            <div
              className={`w-[352px] h-[56px] relative bg-[#fbf6ff] flex items-center justify-between px-[16px] cursor-text transition-all duration-300 shrink-0 ${
                isSuccessAnimation
                  ? "border-[1.5px] border-transparent rounded-[16px] shadow-[0px_0px_10px_rgba(52,144,36,0.3)] shadow-skillbeek-sm"
                  : isActive
                  ? "border-2 border-[#b7812f] rounded-[16px] shadow-skillbeek-sm"
                  : "border-[1.5px] border-[#c0bcc3] rounded-[16px] shadow-skillbeek-xs hover:border-[#b7812f]"
              }`}
              onClick={() => {
                if (!isActive && !isSuccessAnimation) {
                   inputRef.current?.focus();
                }
              }}
            >
              {isSuccessAnimation && (
                <svg className="absolute inset-0 z-50 pointer-events-none rounded-[16px]" width="352" height="56" style={{ overflow: "visible" }}>
                  <motion.path
                    d="M 16 1 L 336 1 A 15 15 0 0 1 351 16 L 351 40 A 15 15 0 0 1 336 55 L 16 55 A 15 15 0 0 1 1 40 L 1 16 A 15 15 0 0 1 16 1 Z"
                    fill="none"
                    stroke="#349024"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    onAnimationComplete={() => setTimeout(() => setShowSuccessModal(true), 200)}
                  />
                </svg>
              )}

              <div className="flex-1 relative h-full mr-[8px]">
                {/* Floating Label (Pure CSS GPU transform) */}
                <span 
                  className={`absolute left-0 top-[16px] font-['Nunito'] font-semibold text-[#656268] text-[16px] leading-[24px] tracking-[1.1px] transition-transform duration-300 ease-out pointer-events-none origin-top-left will-change-transform ${
                    isActive || password.length > 0 
                      ? "-translate-y-[8px] scale-[0.75]" 
                      : "translate-y-0 scale-100"
                  }`}
                >
                  Password
                </span>

                {/* Input Field (Always mounted for robust blur target) */}
                <input
                  ref={inputRef}
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsActive(true)}
                  onBlur={() => {
                    if (!password) setIsActive(false);
                  }}
                  className={`w-full bg-transparent border-none outline-none font-['Nunito'] font-semibold text-[#171519] tracking-[2px] text-[16px] leading-[24px] transition-opacity duration-300 ${
                    isActive || password.length > 0 ? "opacity-100 absolute bottom-[8px] left-0 z-10" : "opacity-0 absolute inset-0 z-10"
                  }`}
                />
              </div>

              {/* password visibility toggle */}
              <button 
                className="w-[24px] h-[24px] flex items-center justify-center text-[#656268] hover:text-[#171519] transition-colors shrink-0 ml-[8px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPasswordVisible(!isPasswordVisible);
                }}
              >
                {isPasswordVisible ? <EyeOpenIcon className="w-[18px] h-[18px]" /> : <EyeClosedIcon className="w-[18px] h-[18px]" />}
              </button>
            </div>

            <div className="w-full flex items-start mt-[16px]">
              <button 
                type="button" 
                onClick={onForgotPassword}
                className="font-['Nunito'] font-bold text-[#06000c] text-[16px] leading-[24px] underline tracking-[0.16px]"
              >
                Forgot password?
              </button>
            </div>

            {/* Continue Button */}
            <div className="w-full flex justify-center mt-[24px]">
              <button
                type="button"
                disabled={!isContinueEnabled || isSuccessAnimation}
                onClick={(e) => {
                   e.preventDefault();
                   setIsSuccessAnimation(true);
                   setIsActive(false);
                }}
                className={`w-[352px] h-[48px] rounded-[16px] flex items-center justify-center font-['Nunito'] font-bold text-[16px] transition-all duration-300 ${
                  isContinueEnabled
                    ? "bg-[#171519] text-[#fbf6ff] shadow-skillbeek-sm hover:bg-[#2f2c32]"
                    : "bg-[#f0edf4] text-[#a09da3] shadow-skillbeek-xs"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px]">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]"></div>
      </div>

      <SuccessAuthModal
        isOpen={showSuccessModal}
        onProceed={() => setShowSuccessModal(false)}
        title="Welcome back"
        message="Your password is correct. You're all set to access your account."
        ctaText="Continue to Skillbeek"
      />
    </div>
  );
}
