import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { SaveExitModal } from "../components/SaveExitModal";

export function OfferDescriptionView({ onBack, onNext }: { onBack?: () => void; onNext?: (desc: string) => void }) {
  const [description, setDescription] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Math for sub-step logic:
  // Step 1 has 4 sub-screens. Screen 1 complete = 25%.
  // This is Screen 2. Default state should be 25%, when valid it becomes 50%.
  const isValid = description.length >= 40;
  const progressPercent = isValid ? 50 : 25;

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder (mocked) */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      {/* Header Action Buttons (Fixed at Top) */}
      <div className="w-full px-[16px] flex justify-between items-center py-[16px] shrink-0 bg-[#fbf6ff] z-20">
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors bg-white"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
            Save and Exit
          </span>
        </button>
        <button className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors bg-white">
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
            Questions?
          </span>
        </button>
      </div>

      <div className="flex-1 w-full flex flex-col relative pt-[0px] overflow-y-auto availability-scrollbar">

        {/* Title Content */}
        <div className="w-full px-[16px] flex flex-col gap-[32px] mb-[24px]">
          {/* Header Texts */}
          <div className="flex flex-col gap-[12px]">
            <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px]">
              What will people get from this offer?
            </h1>
            <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] whitespace-pre-wrap">
              This is your chance to set expectations. Share what a typical session is like and what a learner will walk away with
            </p>
          </div>

          {/* Form Input Container */}
          <div className="flex flex-col gap-[8px] relative w-full shrink-0">
            {/* Input Wrapper */}
            <div className="flex flex-col gap-[20px] shrink-0 w-full relative z-20">
              <label className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] pointer-events-none">
                Offer description
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
                  value={description}
                  onChange={(e) => {
                    // Limit max length to 500
                    if (e.target.value.length <= 500) {
                      setDescription(e.target.value);
                    }
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="In our session, we'll review your project and work on live prototyping to solve your specific UI challenges. Please bring a link to your Figma file."
                  className="w-full h-full resize-none outline-none bg-transparent font-['Nunito'] font-medium text-[16px] leading-[24px] tracking-[0.1px]"
                  style={{
                    color: description.length > 0 ? "#171519" : "#a09da3"
                  }}
                />
              </div>
            </div>

            {/* Validation Text Stacks (Animated) */}
            <div className="relative w-full overflow-hidden min-h-[100px] flex flex-col justify-start pt-[4px]">
              <AnimatePresence mode="popLayout" initial={false}>
                {description.length === 0 && (
                  <motion.div
                    key="msg1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full"
                  >
                    <p className="font-['Nunito'] font-bold text-[#171519] text-[14px] tracking-[1px] leading-[20px]">
                      {500 - description.length} <span className="font-medium text-[#656268]">characters available</span>
                    </p>
                  </motion.div>
                )}

                {description.length > 0 && description.length < 40 && (
                  <motion.div
                    key="msg2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full"
                  >
                    <p className="font-['Nunito'] font-bold text-[#171519] text-[14px] tracking-[1px] leading-[20px]">
                      Please expand on your description. To be effective, it needs at least 40 characters.
                    </p>
                  </motion.div>
                )}

                {description.length >= 40 && (
                  <motion.div
                    key="msg3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full"
                  >
                    <p className="font-['Nunito'] font-medium text-[#171519] text-[14px] tracking-[1px] leading-[20px]">
                      The sweet spot for a great description is usually 2 to 3 clear sentences
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
      <div className="absolute bottom-0 left-0 w-full bg-[#faf7fe] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col gap-[32px] items-center pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={1} subStepProgress={progressPercent} />
        </div>

        <div className="w-full flex items-center justify-between px-[16px]">
          <button
            onClick={onBack}
            className="h-[48px] px-[16px] py-[12px] flex items-center justify-center rounded-[16px] transition-colors"
          >
            <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px] leading-[24px]">
              Back
            </span>
          </button>
          <button
            onClick={() => onNext && onNext(description)}
            disabled={!isValid}
            className={`h-[48px] px-[16px] py-[12px] flex justify-center items-center rounded-[16px] w-[101px] transition-all
              ${isValid
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
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]"></div>
      </div>

      <SaveExitModal
        isOpen={isSaveModalOpen}
        onKeepWorking={() => setIsSaveModalOpen(false)}
        onExit={() => {
          setIsSaveModalOpen(false);
          if (onBack) onBack(); // or navigate back/exit
        }}
      />
    </div>
  );
}
