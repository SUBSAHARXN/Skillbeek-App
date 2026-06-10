import React, { useState } from "react";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { InfoIcon, CloseIcon } from "../../../components/common/Icons";
import { CustomAnimatedRadioButton } from "../../../components/common/CustomAnimatedRadioButton";
import { AnimatePresence, motion } from "framer-motion";

interface OfferSettingsViewProps {
  onBack: () => void;
  onNext: (settings: { visibility: "public" | "invite" }) => void;
  onSaveExit?: () => void;
  onQuestions?: () => void;
}

export function OfferSettingsView({
  onBack,
  onNext,
  onSaveExit,
  onQuestions
}: OfferSettingsViewProps) {
  const [visibility, setVisibility] = useState<"public" | "invite" | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const isNextEnabled = visibility !== null;

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder (mocked) */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]"></div>
      </div>

      {/* Header Action Buttons (Fixed at Top) */}
      <div className="w-full px-[16px] flex justify-between items-center py-[16px] shrink-0 bg-[var(--Surface-Primary-Background)] z-20">
        <button
          onClick={onSaveExit}
          className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]"
        >
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">
            Save and Exit
          </span>
        </button>
        <button
          onClick={onQuestions}
          className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]"
        >
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">
            Questions?
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-[16px] overflow-y-auto availability-scrollbar">
        <div className="flex flex-col gap-[12px] mb-[32px]">
          <h1 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[36px] tracking-[-1.2px]">
            Offer Settings & Visibility
          </h1>
          <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
            Just a few final touches to control how your offer works. You can always change these later from your dashboard.
          </p>
        </div>

        {/* Exchange Type Section */}
        <div className="flex flex-col gap-[16px]">
          <h2 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] tracking-[0px]">
            Exchange Type
          </h2>

          <div className="flex flex-col gap-[20px]">
            {/* Public Option */}
            <div
              className="flex items-center gap-[6px] cursor-pointer py-[10px]"
              onClick={() => setVisibility("public")}
            >
              <CustomAnimatedRadioButton checked={visibility === "public"} />
              <span className={`font-['Nunito'] text-[16px] leading-[24px] tracking-[0.1px] ${visibility === "public" ? "font-bold text-[var(--Text-Primary-heading-1)]" : "font-medium text-[var(--Text-Primary-heading-3)]"}`}>
                Public
              </span>
            </div>

            {/* Invite-Only Option */}
            <div className="flex items-center gap-[6px] py-[10px] relative">
              <div
                className="flex items-center gap-[6px] cursor-pointer"
                onClick={() => setVisibility("invite")}
              >
                <CustomAnimatedRadioButton checked={visibility === "invite"} />
                <span className={`font-['Nunito'] text-[16px] leading-[24px] tracking-[0.1px] ${visibility === "invite" ? "font-bold text-[var(--Text-Primary-heading-1)]" : "font-medium text-[var(--Text-Primary-heading-3)]"}`}>
                  Invite-Only
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(true);
                }}
                className="w-[24px] h-[24px] flex items-center justify-center text-[var(--Text-Primary-heading-3)] hover:bg-[var(--Surface-UI-surface-surface-elevated)] rounded-full transition-colors ml-[-4px]"
              >
                <InfoIcon className="w-[16px] h-[16px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-[156px] shrink-0" aria-hidden="true" />
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col items-center gap-[32px] pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={4} subStepProgress={0} />
        </div>
        <div className="w-full flex items-center justify-between px-[16px]">
          <button onClick={onBack} className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] underline">
            Back
          </button>
          <button
            onClick={() => isNextEnabled && onNext({ visibility })}
            disabled={!isNextEnabled}
            className={`font-['Nunito'] font-bold text-[16px] leading-[24px] px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] transition-all ${isNextEnabled ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] cursor-pointer hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)]" : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]" />
      </div>

      {/* Tooltip Overlay */}
      <AnimatePresence>
        {showTooltip && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px]"
              onClick={() => setShowTooltip(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-50 left-[16px] top-[446px] w-[352px] bg-[var(--Button-Primary-Surface-default-sec)] rounded-[12px] p-[12px] flex shadow-[0px_4px_12px_rgba(0,0,0,0.1)]"
            >
              <p className="flex-1 font-['Nunito'] font-medium text-[var(--Text-Primary-heading-3)] text-[14px] leading-[20px] tracking-[0.1px] pr-[12px]">
                Keep this offer private. Perfect for testing new skills or offering exclusive swaps to specific partners.
              </p>
              <button
                onClick={() => setShowTooltip(false)}
                className="w-[24px] h-[24px] flex items-center justify-center shrink-0 hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] rounded-full transition-colors"
              >
                <CloseIcon className="w-[20px] h-[20px] text-[var(--Text-Primary-heading-3)]" />
              </button>

              {/* Tooltip Pointer Triangle */}
              <div
                className="absolute top-[-8px] left-[118px] w-[16px] h-[8.8px]"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: '8.8px solid #f9f4ee'
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
