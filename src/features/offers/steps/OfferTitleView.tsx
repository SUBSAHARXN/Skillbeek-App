import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { SaveExitModal } from "../components/SaveExitModal";

export function OfferTitleView({ onBack, onNext }: { onBack?: () => void; onNext?: (title: string) => void }) {
  const [title, setTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Math for sub-step logic:
  // Step 1 has 4 sub-screens. Empty = 0%, 15+ chars = 25% (we effectively complete sub-screen 1).
  const isTitleValid = title.length >= 15;
  const progressPercent = isTitleValid ? 25 : 0;

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder (mocked) */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      <div className="flex-1 overflow-y-auto w-full flex flex-col relative pt-[16px]">
        {/* Header Action Buttons */}
        <div className="w-full px-[16px] flex justify-between items-center mb-[40px]">
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors"
          >
            <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
              Save and Exit
            </span>
          </button>
          <button className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors">
            <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
              Questions?
            </span>
          </button>
        </div>

        {/* Title Content */}
        <div className="w-full px-[16px] flex flex-col gap-[32px] mb-[24px]">
          {/* Header Texts */}
          <div className="flex flex-col gap-[12px]">
            <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px]">
              What are You Offering?
            </h1>
            <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] whitespace-pre-wrap">
              Keep it short and clear so people can quickly understand what you're offering
            </p>
          </div>

          {/* Form Input Container */}
          <div className="flex flex-col gap-[8px] relative w-full shrink-0">
            {/* Input Wrapper */}
            <div className="flex flex-col gap-[20px] shrink-0 w-full relative z-20">
              <label className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] pointer-events-none">
                Offer Title
              </label>

              {/* Textarea */}
              <div
                className={`flex h-[180px] w-full px-[16px] py-[10px] rounded-[12px] bg-transparent transition-all border-solid`}
                style={{
                  borderWidth: isFocused ? "2px" : "1.5px",
                  borderColor: isFocused ? "#171519" : "#a09da3"
                }}
              >
                <textarea
                  value={title}
                  onChange={(e) => {
                    // Limit max length to 80 to respect the design constraint
                    if (e.target.value.length <= 80) {
                      setTitle(e.target.value);
                    }
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="UX portfolio review or learn Canva basics"
                  className="w-full h-full resize-none outline-none bg-transparent font-['Nunito'] font-medium text-[16px] leading-[24px] tracking-[0.1px]"
                  style={{
                    color: title.length > 0 ? "#171519" : "#a09da3"
                  }}
                />
              </div>
            </div>

            {/* Validation Text Stacks (Animated) */}
            <div className="relative w-full overflow-hidden min-h-[100px] flex flex-col justify-start pt-[4px]">
              <AnimatePresence mode="popLayout" initial={false}>
                {title.length === 0 && (
                  <motion.div
                    key="msg1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full"
                  >
                    <p className="font-['Nunito'] font-bold text-[#171519] text-[14px] tracking-[1px] leading-[20px]">
                      80 <span className="font-medium text-[#656268]">characters available</span>
                    </p>
                  </motion.div>
                )}

                {title.length > 0 && title.length < 15 && (
                  <motion.div
                    key="msg2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full"
                  >
                    <p className="font-['Nunito'] font-medium text-[#171519] text-[14px] tracking-[1px] leading-[20px]">
                      <span className="text-[#656268]">Your title is a bit too short. A more descriptive title at least </span>
                      <span className="font-bold">15</span>
                      <span className="text-[#656268]"> characters </span>
                      <span className="font-bold">helps others find your offer</span>
                    </p>
                  </motion.div>
                )}

                {title.length >= 15 && (
                  <motion.div
                    key="msg3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full"
                  >
                    <p className="font-['Nunito'] font-medium text-[#171519] text-[14px] tracking-[1px] leading-[20px]">
                      Most great titles are 20–50 characters
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Spacer to push footer down */}
        <div className="flex-1" />

        {/* Footer Group (Progress + CTA) */}
        <div className="w-full bg-[#faf7fe] flex flex-col gap-[32px] items-center pt-[16px] pb-[40px] z-10 shrink-0">
          <OfferProgressBar currentStep={1} subStepProgress={progressPercent} />

          <div className="w-full flex items-center justify-between px-[16px]">
            <button
              onClick={onBack}
              className="h-[48px] px-[16px] py-[12px] flex items-center justify-center rounded-[16px] transition-colors"
            >
              <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px] underline decoration-solid leading-[24px]">
                Back
              </span>
            </button>
            <button
              onClick={() => onNext && onNext(title)}
              disabled={!isTitleValid}
              className={`h-[48px] px-[16px] py-[12px] flex justify-center items-center rounded-[16px] w-[101px] transition-all
                ${isTitleValid
                  ? "bg-[#171519] text-[#fbf6ff] cursor-pointer hover:bg-[#2f2c32] shadow-skillbeek-xs"
                  : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
                }`}
            >
              <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
                Next
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Home Indicator */}
        <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px]">
          <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]"></div>
        </div>
      </div>

      <SaveExitModal
        isOpen={isSaveModalOpen}
        onKeepWorking={() => setIsSaveModalOpen(false)}
        onExit={() => {
          setIsSaveModalOpen(false);
          if (onBack) onBack(); // or navigate completely out of flow
        }}
      />
    </div>
  );
}
