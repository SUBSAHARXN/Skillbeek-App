import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SocialButton } from "../../components/common/SocialButton";
import { FakeKeyboard } from "../../components/common/FakeKeyboard";
import { CloseIcon, ErrorIcon } from "../../components/common/Icons";

export function LoginView({ onContinue }: { onContinue?: (email: string) => void }) {
  const [isActive, setIsActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [email, setEmail] = useState("");
  const [isAutofill, setIsAutofill] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleInputFocus = () => {
    setIsActive(true);
    if (!hasInteracted && email === "") {
      setEmail("Kinsleymustafa@example.com");
      setIsAutofill(true);
      setHasInteracted(true);
    }
  };

  let errorMsg = null;
  if (email.length > 0) {
    const atIndex = email.indexOf('@');
    if (atIndex === -1) {
      errorMsg = "That doesn’t look like a valid email";
    } else {
      const dotIndex = email.indexOf('.', atIndex);
      if (dotIndex === -1 || dotIndex === email.length - 1) {
        errorMsg = "That doesn’t look like a valid email";
      }
    }
  }

  const hasError = email.length > 0 && errorMsg !== null;
  const isContinueEnabled = email.length > 0;

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder (mocked) */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-[16px] pb-[80px] flex flex-col items-center">
        {/* Close Button / Top Area */}
        <div className="w-full pt-[8px] pb-[12px] flex justify-start shrink-0">
          <button className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-gray-100 transition-colors">
            <CloseIcon className="w-[18px] h-[18px] text-[#171519]" />
          </button>
        </div>

        {/* Dynamic Header (Clipped Container for smooth sliding) */}
        <div 
          className="w-full relative h-[88px] overflow-hidden flex items-center justify-center mb-[44px]"
          style={isAnimating ? { WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' } : undefined}
        >
          <AnimatePresence initial={false}>
            {!isActive ? (
              <motion.h1
                key="h-inactive"
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
                initial={{ y: -88, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -88, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-x-0 top-0 flex justify-center items-center h-full font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[32px] tracking-[-0.7px] text-center w-full whitespace-nowrap"
              >
                Login or sign up to Skillbeek
              </motion.h1>
            ) : (
              <motion.h1
                key="h-active"
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
                initial={{ y: 88, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 88, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-x-0 top-0 flex justify-center items-center h-full font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[32px] tracking-[-0.7px] text-center w-full whitespace-nowrap"
              >
                Enter your Email
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Input & Continue Button Group */}
        <motion.div layout className="w-full flex flex-col gap-[24px] z-50 relative bg-[#fbf6ff]">
          {/* Email Input & Error wrapper */}
          <div className="w-full flex flex-col items-center gap-[4px]">
            <motion.div
              className={`w-[352px] h-[56px] bg-[#fbf6ff] flex flex-col justify-center px-[16px] cursor-text transition-all duration-300 shrink-0 ${
                hasError
                  ? "border-2 border-[#870113] rounded-[16px] shadow-skillbeek-sm"
                  : isActive
                  ? "border-2 border-[#b7812f] rounded-[16px] shadow-skillbeek-sm"
                  : "border-[1.5px] border-[#c0bcc3] rounded-[16px] shadow-skillbeek-xs hover:border-[#b7812f]"
              }`}
              onClick={handleInputFocus}
            >
              {isActive ? (
                // Active State Input layout
                <div className="flex flex-col h-full justify-center w-full relative">
                  <span className={`font-['Nunito'] font-normal text-[13px] leading-[18px] tracking-[0.0769em] ${hasError ? 'text-[#870113]' : 'text-[#656268]'}`}>
                    Email
                  </span>
                  <div className="flex items-center justify-between w-full relative">
                    <input
                      autoFocus
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (isAutofill) setIsAutofill(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (isContinueEnabled && onContinue) {
                            onContinue(email);
                          }
                        }
                        if (isAutofill) {
                          if (e.key === 'Backspace' || e.key === 'Delete') {
                            e.preventDefault();
                            setEmail("");
                            setIsAutofill(false);
                          } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                            e.preventDefault();
                            setEmail(e.key);
                            setIsAutofill(false);
                          } else {
                            setIsAutofill(false);
                          }
                        }
                      }}
                      className={`w-full outline-none font-['Nunito'] font-medium text-[16px] leading-[24px] pr-[16px] rounded-[4px] ${
                        isAutofill
                          ? "bg-[#FDE2CD] text-[#a09da3] px-1 -ml-1" // text-placeholder color + highlighter background
                          : "bg-transparent text-[#171519]"
                      }`}
                    />
                  </div>
                </div>
              ) : (
                // Inactive State Input layout
                <div className="flex items-center h-full">
                  <span className="font-['Nunito'] font-normal text-[#656268] text-[16px] leading-[24px] tracking-[0px]">
                    Email
                  </span>
                </div>
              )}
            </motion.div>

            {/* Inline Error Message */}
            <AnimatePresence>
              {hasError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-[352px] flex items-center gap-[4px] overflow-hidden shrink-0"
                >
                  <ErrorIcon className="w-[14px] h-[14px] shrink-0" />
                  <span className="font-['Nunito'] font-medium text-[#870113] text-[12px] leading-[20px] tracking-[1.1px]">
                    {errorMsg}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Continue Button */}
          <motion.div layout className="w-full flex justify-center">
            <button
              type="button"
              disabled={!isContinueEnabled}
              onClick={(e) => {
                e.preventDefault();
                if (isContinueEnabled && onContinue) {
                  onContinue(email);
                }
              }}
              className={`w-full max-w-[352px] h-[48px] rounded-[16px] flex items-center justify-center font-['Nunito'] font-bold text-[16px] transition-all duration-300 ${
                isContinueEnabled
                  ? "bg-[#171519] text-[#fbf6ff] shadow-skillbeek-sm hover:bg-[#2f2c32]" // Assuming main brand dark for active btn based on standard OOUX maps, adjust if necessary
                  : "bg-[#f0edf4] text-[#a09da3] shadow-skillbeek-xs"
              }`}
            >
              Continue
            </button>
          </motion.div>
        </motion.div>

        {/* OR Divider */}
        <motion.div layout className="w-full flex items-center justify-center gap-[12px] my-[24px]">
          <div className="flex-1 h-px bg-[#c0bcc3] opacity-40"></div>
          <span className="font-['Nunito'] font-semibold text-[#171519] text-[12px] leading-[20px]">
            OR
          </span>
          <div className="flex-1 h-px bg-[#c0bcc3] opacity-40"></div>
        </motion.div>

        {/* Social Buttons */}
        <motion.div layout className="w-full flex flex-col gap-[16px]">
          <SocialButton provider="google" />
          <SocialButton provider="microsoft" />
          <SocialButton provider="phone" />
          <SocialButton provider="facebook" />
        </motion.div>

        {/* Footer Bar Placeholders (mocked) */}
        {!isActive && (
          <motion.div layout className="w-full flex justify-center mt-[44px] gap-[24px] font-['Nunito'] font-bold text-[14px]">
            <a href="#" className="text-[#171519] underline decoration-solid underline-offset-4 decoration-[#c0bcc3]">Terms of Service</a>
            <div className="w-[1px] h-[14px] bg-[#c0bcc3] mt-1"></div>
            <a href="#" className="text-[#171519] underline decoration-solid underline-offset-4 decoration-[#c0bcc3]">Privacy Policy</a>
          </motion.div>
        )}
      </div>

      {/* Fake Sliding Keyboard (Disabled per request) */}
      <FakeKeyboard isVisible={false} />

      {/* iOS Home Indicator Mock */}
      <div className="absolute bottom-0 left-0 right-0 h-[34px] flex items-center justify-center pb-[8px] pt-[24px]">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px] z-50"></div>
      </div>

    </div>
  );
}
