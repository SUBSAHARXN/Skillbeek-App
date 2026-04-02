import React, { useState, useEffect, useRef } from "react";
import { maskEmail, maskPhone } from "../../utils/maskers";

interface OTPInputViewProps {
  email: string;
  selectedMethod: string | null;
  onBack: () => void;
  onMoreOptions: () => void;
}

export function OTPInputView({ email, selectedMethod, onBack, onMoreOptions }: OTPInputViewProps) {
  const [countdown, setCountdown] = useState(15);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getDescription = () => {
    // In a real application, the user API would return the phone/whatsapp number.
    // For now we mock it with a masked mockup number.
    const mockPhoneNumber = "+2349034567880";
    
    switch (selectedMethod) {
      case "WhatsApp":
        return `We just sent a code to WhatsApp number ${maskPhone(mockPhoneNumber)}`;
      case "Phone Call":
        return `We just sent a code to Phone number ${maskPhone(mockPhoneNumber)}`;
      case "Email":
      default:
        return `We just sent a code to email address ${maskEmail(email)}`;
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

        {/* OTP Input Fields */}
        <div className="w-full flex items-center justify-center gap-[16px] mb-[44px]">
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
              className="w-[44px] h-[48px] bg-[#faf7fe] border-none rounded-[8px] shadow-skillbeek-xs flex items-center justify-center text-center font-['Nunito'] font-semibold text-[28px] text-[#171519] focus:outline-none focus:ring-2 focus:ring-purple-400 transition-shadow"
            />
          ))}
        </div>

        {/* Resend Code / Timer */}
        <div className="flex flex-col gap-[12px] items-start w-full">
          {countdown > 0 ? (
            <p className="font-['Nunito'] font-medium text-[#171519] text-[16px] tracking-[0.1px]">
              Resend Code in <span className="font-bold">{formattedTime}</span>
            </p>
          ) : (
            <button 
              onClick={() => setCountdown(15)}
              className="font-['Nunito'] font-bold text-[#171519] text-[16px] underline hover:text-purple-600 transition-colors"
            >
              Resend Code
            </button>
          )}

          <button 
            onClick={onMoreOptions}
            className="flex h-[48px] items-center justify-center py-[12px] mt-2 group"
          >
            <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] tracking-[0.16px] underline group-hover:text-purple-600 transition-colors">
              More Options
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px]">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]"></div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full bg-[#fbf6ff] rounded-[24px] p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <h2 className="font-['Nunito'] font-bold text-[#171519] text-[20px]">
              Cancel Authentication?
            </h2>
            <p className="font-['Nunito'] font-medium text-[#171519] text-[15px]">
              Are you sure you want to cancel retrieving the OTP? Doing so will take you back.
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 font-['Nunito'] font-bold text-[14px] text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                No, Keep Waiting
              </button>
              <button 
                onClick={() => {
                  setShowCancelModal(false);
                  onBack();
                }}
                className="px-4 py-2 font-['Nunito'] font-bold text-[14px] text-white bg-[#b85f38] hover:bg-[#a3532f] rounded-xl transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
