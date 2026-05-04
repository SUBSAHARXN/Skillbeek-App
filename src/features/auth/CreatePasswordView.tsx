import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
// @ts-ignore
import confirmationIconInlineJSON from "../../assets/animations/confirmation-Icon-inline.json";
import { CloseIcon, EyeClosedIcon, EyeOpenIcon, ErrorIcon, CheckCircleIcon } from "../../components/common/Icons";
import { SuccessAuthModal } from "../../components/common/SuccessAuthModal";

// The bouncing dots animation
function SmallLoadingAnimation() {
  return (
    <div className="flex gap-[4px] items-center justify-center h-[24px] px-[2px]">
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        className="w-[4px] h-[4px] rounded-full bg-[#a09da3]"
      />
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
        className="w-[4px] h-[4px] rounded-full bg-[#a09da3]"
      />
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
        className="w-[4px] h-[4px] rounded-full bg-[#a09da3]"
      />
    </div>
  );
}

function DelayedInlineLottie() {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      lottieRef.current?.play();
    }, 120); // ~4 frames delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[20px] h-[20px] relative flex items-center justify-center shrink-0">
      <div className="absolute w-[47px] h-[47px] flex items-center justify-center pointer-events-none">
        <Lottie 
          lottieRef={lottieRef} 
          animationData={confirmationIconInlineJSON} 
          autoplay={false} 
          loop={false} 
        />
      </div>
    </div>
  );
}

interface CreatePasswordViewProps {
  onBack?: () => void;
  mode?: "login" | "reset";
}

export function CreatePasswordView({ onBack, mode = "login" }: CreatePasswordViewProps) {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isRepeatVisible, setIsRepeatVisible] = useState(false);

  type ActiveInputState = "none" | "new" | "repeat";
  const [activeInput, setActiveInput] = useState<ActiveInputState>("none");

  // Typing tracking (debounce)
  const [isTypingNew, setIsTypingNew] = useState(false);
  const [isTypingRepeat, setIsTypingRepeat] = useState(false);

  // Success flow
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const newPasswordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);

  // Debounce logic for new password
  useEffect(() => {
    if (!isTypingNew) return;
    const timer = setTimeout(() => {
      setIsTypingNew(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [newPassword, isTypingNew]);

  // Debounce logic for repeat password
  useEffect(() => {
    if (!isTypingRepeat) return;
    const timer = setTimeout(() => {
      setIsTypingRepeat(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [repeatPassword, isTypingRepeat]);

  // Handle typing to trigger the thinking state
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setIsTypingNew(true);
  };

  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
    setIsTypingRepeat(true);
  };

  // Criteria validation checks
  const criteriaLength = newPassword.length >= 8;
  const criteriaNumber = /\d/.test(newPassword);
  const criteriaSpecial = /[!@#$%^&*()_+\-=\\[\]{};:'"\\|,.<>\\/?]+/.test(newPassword);
  const allCriteriaMet = criteriaLength && criteriaNumber && criteriaSpecial;

  // Matching check
  const passwordsMatch = newPassword === repeatPassword && newPassword.length > 0;
  
  // Submit state
  const isSubmitEnabled = allCriteriaMet && passwordsMatch && !isTypingNew && !isTypingRepeat;

  const renderNewPasswordFeedback = () => {
    if (newPassword.length === 0) {
      return (
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[8px]">
            <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#a09da3] shrink-0" />
            <span className="font-['Nunito'] font-medium text-[14px] text-[#656268]">At least 8 characters</span>
          </div>
          <div className="flex items-center gap-[8px]">
            <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#a09da3] shrink-0" />
            <span className="font-['Nunito'] font-medium text-[14px] text-[#656268]">At least 1 number (0–9)</span>
          </div>
          <div className="flex items-center gap-[8px]">
            <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#a09da3] shrink-0" />
            <span className="font-['Nunito'] font-medium text-[14px] text-[#656268]">At least 1 special character (!, #, *, etc.)</span>
          </div>
        </div>
      );
    }

    if (isTypingNew) {
      return (
        <div className="flex items-center">
          <SmallLoadingAnimation />
        </div>
      );
    }

    if (allCriteriaMet) {
      return (
        <div className="flex items-center h-[20px]">
          <DelayedInlineLottie />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-[8px]">
        {!criteriaLength && (
          <div className="flex items-center gap-[8px]">
            <ErrorIcon className="w-[14px] h-[14px] shrink-0 mt-[1px]" />
            <span className="font-['Nunito'] font-medium text-[14px] text-[#870113]">At least 8 characters</span>
          </div>
        )}
        {!criteriaNumber && (
          <div className="flex items-center gap-[8px]">
            <ErrorIcon className="w-[14px] h-[14px] shrink-0 mt-[1px]" />
            <span className="font-['Nunito'] font-medium text-[14px] text-[#870113]">At least 1 number (0–9)</span>
          </div>
        )}
        {!criteriaSpecial && (
          <div className="flex items-center gap-[8px]">
            <ErrorIcon className="w-[14px] h-[14px] shrink-0 mt-[1px]" />
            <span className="font-['Nunito'] font-medium text-[14px] text-[#870113]">At least 1 special character (!, #, *, etc.)</span>
          </div>
        )}
      </div>
    );
  };

  const renderRepeatPasswordFeedback = () => {
    if (repeatPassword.length === 0) return null;

    if (isTypingRepeat) {
      return (
        <div className="flex items-center">
          <SmallLoadingAnimation />
        </div>
      );
    }

    if (passwordsMatch) {
      return (
        <div className="flex items-center h-[20px]">
          <DelayedInlineLottie />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-[8px]">
        <ErrorIcon className="w-[14px] h-[14px] shrink-0 mt-[1px]" />
        <span className="font-['Nunito'] font-medium text-[14px] text-[#870113]">Passwords do not match</span>
      </div>
    );
  };

  const hasStartedTypingNew = newPassword.length > 0 || isTypingNew;
  const hasStartedTypingRepeat = repeatPassword.length > 0 || isTypingRepeat;

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
            <svg viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="w-full flex flex-col gap-[16px] items-start mb-[44px]">
          <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[32px] tracking-[-0.7px]">
            Set Your Password
          </h1>
          <p className="font-['Nunito'] font-medium text-[#171519] text-[16px] leading-[24px] tracking-[0.1px]">
            To keep your account secure, create a unique password that's at least 8 characters long and includes a number and a special character.
          </p>
        </div>

        <div className="w-full flex flex-col gap-[24px] items-center shrink-0">
          
          {/* Create Password Input */}
          <div className="w-[352px] flex flex-col items-start gap-[8px] shrink-0">
            <div
              className={`w-[352px] h-[56px] relative bg-[#fbf6ff] flex items-center justify-between px-[16px] cursor-text transition-all duration-300 shrink-0 ${
                isSubmitEnabled
                  ? "border-[2px] border-[#349024] rounded-[16px] shadow-[0px_0px_10px_rgba(52,144,36,0.3)] shadow-skillbeek-sm"
                  : activeInput === "new"
                  ? "border-2 border-[#b7812f] rounded-[16px] shadow-skillbeek-sm"
                  : "border-[1.5px] border-[#c0bcc3] rounded-[16px] shadow-skillbeek-xs hover:border-[#b7812f]"
              }`}
              onClick={() => {
                setActiveInput("new");
                newPasswordRef.current?.focus();
              }}
            >
              {isSubmitEnabled && (
                <svg className="absolute inset-0 pointer-events-none rounded-[16px] z-50" width="352" height="56" style={{ overflow: "visible" }}>
                  <motion.path
                    d="M 16 1 L 336 1 A 15 15 0 0 1 351 16 L 351 40 A 15 15 0 0 1 336 55 L 16 55 A 15 15 0 0 1 1 40 L 1 16 A 15 15 0 0 1 16 1 Z"
                    fill="none"
                    stroke="#349024"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                  />
                </svg>
              )}

              <div className="flex-1 relative h-full mr-[8px]">
                {/* Floating Label */}
                <span 
                  className={`absolute left-0 top-[16px] font-['Nunito'] font-semibold text-[16px] leading-[24px] tracking-[1.1px] transition-all duration-300 pointer-events-none origin-top-left ${
                    activeInput === "new" || newPassword.length > 0 
                      ? "-translate-y-[8px] scale-[0.75] text-[#656268]" 
                      : "translate-y-0 scale-100 text-[#a09da3] font-medium"
                  }`}
                >
                  Create Your Password
                </span>

                <input
                  ref={newPasswordRef}
                  type={isNewVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  onFocus={() => setActiveInput("new")}
                  className={`w-full bg-transparent border-none outline-none font-['Nunito'] font-semibold text-[#171519] tracking-[2px] text-[16px] leading-[24px] transition-opacity duration-300 ${
                    activeInput === "new" || newPassword.length > 0 ? "opacity-100 absolute bottom-[8px] left-0 z-10" : "opacity-0 absolute inset-0 z-10"
                  }`}
                />
              </div>

              {(activeInput === "new" || newPassword.length > 0) && (
                <button 
                  className="w-[24px] h-[24px] flex items-center justify-center text-[#656268] hover:text-[#171519] transition-colors shrink-0 ml-[8px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNewVisible(!isNewVisible);
                  }}
                >
                  {isNewVisible ? <EyeOpenIcon className="w-[18px] h-[18px]" /> : <EyeClosedIcon className="w-[18px] h-[18px]" />}
                </button>
              )}
            </div>

            {/* Inline Criteria for New Password */}
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-[8px] ml-[8px] mt-[4px] overflow-hidden"
              >
                {renderNewPasswordFeedback()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Repeat Password Input (Shows if first input has been interacted with) */}
          <AnimatePresence>
            {(activeInput !== "none" || newPassword.length > 0) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-[352px] flex flex-col items-start gap-[8px] shrink-0"
              >
                <div
                  className={`w-[352px] h-[56px] relative bg-[#fbf6ff] flex items-center justify-between px-[16px] cursor-text transition-all duration-300 shrink-0 ${
                    isSubmitEnabled
                      ? "border-[2px] border-[#349024] rounded-[16px] shadow-[0px_0px_10px_rgba(52,144,36,0.3)] shadow-skillbeek-sm"
                      : activeInput === "repeat"
                      ? "border-2 border-[#b7812f] rounded-[16px] shadow-skillbeek-sm"
                      : "border-[1.5px] border-[#c0bcc3] rounded-[16px] shadow-skillbeek-xs hover:border-[#b7812f]"
                  }`}
                  onClick={() => {
                    setActiveInput("repeat");
                    repeatPasswordRef.current?.focus();
                  }}
                >
                  {isSubmitEnabled && (
                    <svg className="absolute inset-0 pointer-events-none rounded-[16px] z-50" width="352" height="56" style={{ overflow: "visible" }}>
                      <motion.path
                        d="M 16 1 L 336 1 A 15 15 0 0 1 351 16 L 351 40 A 15 15 0 0 1 336 55 L 16 55 A 15 15 0 0 1 1 40 L 1 16 A 15 15 0 0 1 16 1 Z"
                        fill="none"
                        stroke="#349024"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                      />
                    </svg>
                  )}

                  <div className="flex-1 relative h-full mr-[8px]">
                    <span 
                      className={`absolute left-0 top-[16px] font-['Nunito'] font-semibold text-[16px] leading-[24px] tracking-[1.1px] transition-all duration-300 pointer-events-none origin-top-left ${
                        activeInput === "repeat" || repeatPassword.length > 0 
                          ? "-translate-y-[8px] scale-[0.75] text-[#656268]" 
                          : "translate-y-0 scale-100 text-[#a09da3] font-medium"
                      }`}
                    >
                      Repeat new password
                    </span>

                    <input
                      ref={repeatPasswordRef}
                      type={isRepeatVisible ? "text" : "password"}
                      value={repeatPassword}
                      onChange={handleRepeatPasswordChange}
                      onFocus={() => setActiveInput("repeat")}
                      className={`w-full bg-transparent border-none outline-none font-['Nunito'] font-semibold text-[#171519] tracking-[2px] text-[16px] leading-[24px] transition-opacity duration-300 ${
                        activeInput === "repeat" || repeatPassword.length > 0 ? "opacity-100 absolute bottom-[8px] left-0 z-10" : "opacity-0 absolute inset-0 z-10"
                      }`}
                    />
                  </div>

                  {(activeInput === "repeat" || repeatPassword.length > 0) && (
                    <button 
                      className="w-[24px] h-[24px] flex items-center justify-center text-[#656268] hover:text-[#171519] transition-colors shrink-0 ml-[8px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRepeatVisible(!isRepeatVisible);
                      }}
                    >
                      {isRepeatVisible ? <EyeOpenIcon className="w-[18px] h-[18px]" /> : <EyeClosedIcon className="w-[18px] h-[18px]" />}
                    </button>
                  )}
                </div>

                {/* Inline mismatch error for Repeat Password */}
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-[8px] mt-[4px] overflow-hidden"
                  >
                    {renderRepeatPasswordFeedback()}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Password / Submit Button */}
          <div className="w-full flex justify-center mt-[12px] relative">
            <button
              type="button"
              disabled={!isSubmitEnabled}
              onClick={(e) => {
                 e.preventDefault();
                 setShowSuccessModal(true);
              }}
              className={`w-[352px] h-[48px] rounded-[16px] flex items-center justify-center font-['Nunito'] font-bold text-[16px] transition-all duration-300 ${
                  isSubmitEnabled
                  ? "bg-[#171519] text-[#fbf6ff] shadow-skillbeek-sm hover:bg-[#2f2c32]"
                  : "bg-[#f0edf4] text-[#a09da3] shadow-[0px_1px_3px_0px_rgba(18,9,0,0.1)]"
              }`}
            >
              {mode === "reset" ? "Reset Password" : "Create Password"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px]">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]"></div>
      </div>

      <SuccessAuthModal
        isOpen={showSuccessModal}
        title="Password saved"
        message="Your new password is ready to go. Let's get you straight into your account."
        onProceed={() => {
          setShowSuccessModal(false);
          if (onBack) onBack();
        }}
      />
    </div>
  );
}
