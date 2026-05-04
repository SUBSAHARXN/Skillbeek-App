import React, { useState, useEffect, useRef } from "react";
import { maskEmail, maskPhone } from "../../utils/maskers";
import { CancelAuthModal } from "../../components/common/CancelAuthModal";
import { SuccessAuthModal } from "../../components/common/SuccessAuthModal";
import { ErrorIcon } from "../../components/common/Icons";
import { motion, AnimatePresence } from "framer-motion";

interface OTPInputViewProps {
  email: string;
  selectedMethod: string | null;
  mode?: "login" | "reset";
  onBack: () => void;
  onMoreOptions: () => void;
  onSuccessProceed?: () => void;
}

export function OTPInputView({ email, selectedMethod, mode = "login", onBack, onMoreOptions, onSuccessProceed }: OTPInputViewProps) {
  const [countdown, setCountdown] = useState(15);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successIndex, setSuccessIndex] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isContinueEnabled = otp.some(digit => digit !== "");
  const hasError = errorMsg !== null;

  const handleSuccessFlow = () => {
    let current = 0;
    const interval = setInterval(() => {
      setSuccessIndex(current);
      current++;
      if (current >= 6) {
        clearInterval(interval);
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 300);
      }
    }, 100);
  };

  const handleContinue = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const val = otp.join('');
    if (val.length === 0) {
      setErrorMsg("Looks like you forgot to enter the code");
    } else if (val.length < 6) {
      setErrorMsg("Looks like you missed a few digits");
    } else {
      if (val === "111111") {
        handleSuccessFlow();
      } else {
        // Simulate validation error
        setErrorMsg("That code isn’t valid or may have expired");
      }
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const val = otp.join('');
    if (val.length === 6) {
      if (val === "111111") {
        handleSuccessFlow();
      } else {
        setErrorMsg("That code isn’t valid or may have expired");
      }
    }
  }, [otp]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
      if (errorMsg) setErrorMsg(null);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (errorMsg) setErrorMsg(null);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleContinue();
      return;
    }
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (errorMsg) setErrorMsg(null);
  };

  const getDescription = () => {
    // In a real application, the user API would return the phone/whatsapp number.
    // For now we mock it with a masked mockup number.
    const mockPhoneNumber = "+2349034567880";

    switch (selectedMethod) {
      case "WhatsApp":
        return <>We just sent a code to WhatsApp number <span className="font-bold">{maskPhone(mockPhoneNumber)}</span></>;
      case "Phone Call":
        return <>We just sent a code to Phone number <span className="font-bold">{maskPhone(mockPhoneNumber)}</span></>;
      case "Email":
      default:
        return <>We just sent a code to email address <span className="font-bold">{maskEmail(email)}</span></>;
    }
  };

  const formattedTime = `00:${countdown.toString().padStart(2, '0')}`;

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder (mocked) */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-[40px] flex flex-col items-start px-[16px]">
        {/* Back Button / Top Area */}
        <div className="w-full pt-[8px] pb-[12px] flex justify-start shrink-0">
          <button onClick={() => setShowCancelModal(true)} className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-gray-100 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Text Headers */}
        <div className="w-full flex flex-col items-start gap-[12px] mb-[44px]">
          <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[32px] tracking-[0px]">
            Enter Your security Code
          </h1>
          <p className="font-['Nunito'] font-medium text-[#171519] text-[16px] leading-[24px] tracking-[0.1px]">
            {getDescription()}
          </p>
        </div>

        {/* OTP Input Fields & Error */}
        <div className="w-full flex flex-col items-center gap-[4px] mb-[32px]">
          <div className="w-full flex items-center justify-center gap-[16px]">
            {otp.map((digit, index) => (
              <input
                key={index}
                autoFocus={index === 0}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-[44px] h-[48px] bg-[#faf7fe] rounded-[8px] flex items-center justify-center text-center font-['Nunito'] font-semibold text-[28px] focus:outline-none transition-all duration-200 ${hasError
                    ? "border-[1.5px] border-[#870113] text-[#870113] focus:ring-2 focus:ring-[#870113] shadow-skillbeek-xs"
                    : successIndex !== null && index <= successIndex
                    ? "border-[1.5px] border-[#349024] text-[#171519] ring-2 ring-[#349024] shadow-[0px_0px_10px_rgba(52,144,36,0.3)] shadow-skillbeek-xs"
                    : "border-none text-[#171519] shadow-skillbeek-xs focus:ring-2 focus:ring-[#b7812f]"
                  }`}
              />
            ))}
          </div>

          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full flex items-center justify-center overflow-hidden shrink-0 mt-[4px]"
              >
                <div className="w-full max-w-[352px] flex items-start gap-[6px]">
                  <ErrorIcon className="w-[14px] h-[14px] shrink-0 mt-[3px]" />
                  <span className="font-['Nunito'] font-medium text-[#870113] text-[12px] leading-[20px] tracking-[0.5px]">
                    {errorMsg}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Verify Button */}
        {isContinueEnabled && (
          <div className="w-full flex justify-center mb-[24px]">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full max-w-[352px] h-[48px] rounded-[16px] flex items-center justify-center font-['Nunito'] font-bold text-[16px] transition-all duration-300 bg-[#171519] text-[#fbf6ff] shadow-skillbeek-sm hover:bg-[#2f2c32]"
            >
              Verify
            </button>
          </div>
        )}

        {/* Resend Code / Timer */}
        <div className="flex flex-col gap-[16px] items-start w-full">
          {countdown > 0 ? (
            <p className="font-['Nunito'] font-medium text-[#171519] text-[16px] tracking-[0.1px]">
              Resend Code in <span className="font-bold">{formattedTime}</span>
            </p>
          ) : (
            <button
              onClick={() => setCountdown(15)}
              className="font-['Nunito'] font-bold text-[#171519] text-[16px] underline hover:text-[#b7812f] transition-colors"
            >
              Resend Code
            </button>
          )}

          <button
            onClick={onMoreOptions}
            className="flex items-center justify-center group"
          >
            <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] tracking-[0.16px] underline group-hover:text-[#b7812f] transition-colors">
              More Options
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px]">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]"></div>
      </div>

      {/* Cancel Authentication Modal — the open state IS the animation trigger */}
      <CancelAuthModal
        isOpen={showCancelModal}
        onKeepWaiting={() => setShowCancelModal(false)}
        onConfirmCancel={() => {
          setShowCancelModal(false);
          onBack();
        }}
      />
      <SuccessAuthModal
        isOpen={showSuccessModal}
        title={mode === "reset" ? "That worked" : undefined}
        message={mode === "reset" ? "We verified your code. Choose a new password to secure your account." : undefined}
        ctaText={mode === "reset" ? "Set new password" : undefined}
        onProceed={() => {
          setShowSuccessModal(false);
          if (onSuccessProceed) onSuccessProceed();
        }}
      />
    </div>
  );
}
