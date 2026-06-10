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
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder (mocked) */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]"></div>
      </div>

      {/* Header Action Buttons (Fixed at Top) */}
      <div className="w-full px-[16px] flex justify-between items-center py-[16px] shrink-0 bg-[var(--Surface-Primary-Background)] z-20">
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]"
        >
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">
            Save and Exit
          </span>
        </button>
        <button className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]">
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">
            Questions?
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full flex flex-col relative pt-[0px] availability-scrollbar">

        {/* Title Content */}
        <div className="w-full px-[16px] flex flex-col gap-[32px] mb-[24px]">
          {/* Header Texts */}
          <div className="flex flex-col gap-[12px]">
            <h1 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[36px]">
              What are You Offering?
            </h1>
            <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] whitespace-pre-wrap">
              Keep it short and clear so people can quickly understand what you're offering
            </p>
          </div>

          {/* Form Input Container */}
          <div className="flex flex-col gap-[8px] relative w-full shrink-0">
            {/* Input Wrapper */}
            <div className="flex flex-col gap-[20px] shrink-0 w-full relative z-20">
              <label className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] pointer-events-none">
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
                    <p className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[14px] tracking-[1px] leading-[20px]">
                      80 <span className="font-medium text-[var(--Text-Primary-Subtitle)]">characters available</span>
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
                    <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-heading-1)] text-[14px] tracking-[1px] leading-[20px]">
                      <span className="text-[var(--Text-Primary-Subtitle)]">Your title is a bit too short. A more descriptive title at least </span>
                      <span className="font-bold">15</span>
                      <span className="text-[var(--Text-Primary-Subtitle)]"> characters </span>
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
                    <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-heading-1)] text-[14px] tracking-[1px] leading-[20px]">
                      Most great titles are 20–50 characters
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-[156px] shrink-0" aria-hidden="true" />
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col gap-[32px] items-center pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={1} subStepProgress={progressPercent} />
        </div>

        <div className="w-full flex items-center justify-between px-[16px]">
          <button
            onClick={onBack}
            className="h-[48px] px-[16px] py-[12px] flex items-center justify-center rounded-[16px] transition-colors"
          >
            <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px] underline decoration-solid leading-[24px]">
              Back
            </span>
          </button>
          <button
            onClick={() => onNext && onNext(title)}
            disabled={!isTitleValid}
            className={`h-[48px] px-[16px] py-[12px] flex justify-center items-center rounded-[16px] w-[101px] transition-all
              ${isTitleValid
                ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] cursor-pointer hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] shadow-skillbeek-xs"
                : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
              }`}
          >
            <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
              Next
            </span>
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]"></div>
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
