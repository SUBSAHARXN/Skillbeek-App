import React, { useState } from "react";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { ChevronDownIcon, ChevronUpIcon, TimerIcon } from "../../../components/common/Icons";
import { DurationPickerModal } from "../components/DurationPickerModal";
import { SaveExitModal } from "../components/SaveExitModal";
import { motion, AnimatePresence } from "framer-motion";

interface SessionLengthViewProps {
  onBack: () => void;
  onNext: (duration: { type: "preset" | "custom"; minutes: number }) => void;
  onSaveExit?: () => void;
  onQuestions?: () => void;
  isSessionBooking?: boolean;
}

const PRESETS = [
  { label: "30 Min", minutes: 30 },
  { label: "60 Min", minutes: 60 },
  { label: "90 Min", minutes: 90 },
];

export function SessionLengthView({
  onBack,
  onNext,
  onSaveExit,
  onQuestions,
  isSessionBooking = false,
}: SessionLengthViewProps) {
  // null = nothing selected; "30"|"60"|"90"|"custom"
  const [selected, setSelected] = useState<string | null>(isSessionBooking ? "custom" : null);
  const [customHours, setCustomHours] = useState(isSessionBooking ? 2 : 1);
  const [customMinutes, setCustomMinutes] = useState(isSessionBooking ? 30 : 30);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const customTotalMinutes = customHours * 60 + customMinutes;

  const formatCustom = () => {
    const h = customHours;
    const m = customMinutes;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} hr`;
    return `${h} hr ${m} min`;
  };

  const formatSessionDuration = () => {
    const h = customHours;
    const m = customMinutes;
    const totalMin = h * 60 + m;
    if (totalMin === 30) return "30 Minutes";
    if (totalMin === 60) return "60 Minutes";
    if (totalMin === 90) return "90 Minutes";

    if (h === 0) return `${m} Min`;
    const hrLabel = h === 1 ? "hr" : "hrs";
    if (m === 0) return `${h}${hrLabel}`;
    return `${h}${hrLabel} ${m} Min`;
  };

  const isNextEnabled = selected !== null;

  const handleNext = () => {
    if (!selected) return;
    if (selected === "custom") {
      onNext({ type: "custom", minutes: customTotalMinutes });
    } else {
      const preset = PRESETS.find((p) => p.label === selected);
      onNext({ type: "preset", minutes: preset?.minutes ?? 60 });
    }
  };

  const handleOptionSelect = (val: string) => {
    if (val === "custom") {
      setIsDurationModalOpen(true);
    } else {
      const mins = parseInt(val, 10);
      setCustomHours(Math.floor(mins / 60));
      setCustomMinutes(mins % 60);
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]" />
      </div>

      {/* Header Action Buttons (Fixed at Top) */}
      <div className="w-full px-[16px] flex justify-between items-center py-[16px] shrink-0 bg-[#fbf6ff] z-20">
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors bg-white"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">Save and Exit</span>
        </button>
        <button
          onClick={onQuestions}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors bg-white"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">Questions?</span>
        </button>
      </div>

      {/* Content */}
      <div className={`flex-1 px-[16px] pb-[180px] ${isSessionBooking ? "overflow-visible" : "overflow-y-auto availability-scrollbar"}`}>
        <div className="flex flex-col gap-[12px] mb-[24px]">
          <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1.2px]">
            {isSessionBooking ? "Choose a duration" : "Default Session Length"}
          </h1>
          <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
            {isSessionBooking
              ? "We've pre-selected a time based on your offer, but you can choose another."
              : "Set the standard length for a session. You can always agree to a different length with your partner for a specific session."}
          </p>
        </div>

        {isSessionBooking ? (
          /* Session Booking Duration selector card */
          <div className="flex flex-col relative w-full">
            <section
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative flex items-center justify-between rounded-xl bg-[#faf7fe] px-4 py-6 border border-[#f0edf4] cursor-pointer hover:bg-[#f0edf4] transition-colors shadow-skillbeek-sm"
              aria-label="Duration selector"
            >
              <div className="relative inline-flex flex-[0_0_auto] items-center gap-1.5">
                <TimerIcon className="!relative !h-6 !w-6 !aspect-[1] text-[#171519]" />
                <span className="relative mt-[-1.00px] w-fit whitespace-nowrap font-['Nunito'] text-[16px] font-medium leading-6 tracking-[0.10px] text-[#656268]">
                  Duration
                </span>
              </div>
              <button
                type="button"
                className="relative inline-flex flex-[0_0_auto] items-center gap-2 rounded-md"
                aria-label="Select duration"
              >
                <span className="relative mt-[-1.00px] flex w-fit items-end whitespace-nowrap font-['Nunito'] text-[16px] font-bold leading-6 tracking-[0.16px] text-[#2f2c32]">
                  {formatSessionDuration()}
                </span>
                {isDropdownOpen ? (
                  <ChevronUpIcon className="!relative !h-6 !w-6 !aspect-[1] text-[#2f2c32]" />
                ) : (
                  <ChevronDownIcon className="!relative !h-6 !w-6 !aspect-[1] text-[#2f2c32]" />
                )}
              </button>
            </section>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.fieldset
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-[4px] flex flex-col items-start gap-[12px] p-[16px] relative bg-[#faf7fe] rounded-xl border border-[#f0edf4] shadow-skillbeek-sm w-full z-10"
                >
                  <legend className="sr-only">Select duration</legend>
                  {[
                    { label: "30 Minutes", value: "30" },
                    { label: "60 Minutes", value: "60" },
                    { label: "90 Minutes", value: "90" },
                    { label: "Custom", value: "custom" },
                  ].map((option) => {
                    const isPreset = option.value !== "custom";
                    const optMin = isPreset ? parseInt(option.value, 10) : -1;
                    const isSelected = isPreset
                      ? (customTotalMinutes === optMin)
                      : (customTotalMinutes !== 30 && customTotalMinutes !== 60 && customTotalMinutes !== 90);

                    return (
                      <label
                        key={option.value}
                        className="flex items-center justify-between px-[16px] py-[14px] relative self-stretch w-full bg-white rounded-xl border border-[#f0edf4] cursor-pointer hover:bg-[#faf7fe] transition-colors shadow-[0px_1px_1.5px_rgba(18,9,0,0.04)]"
                      >
                        <input
                          type="radio"
                          name="session-duration-dropdown"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => handleOptionSelect(option.value)}
                          className="sr-only"
                          aria-label={option.label}
                        />
                        <div className="flex items-center justify-between w-full">
                          <span className="font-['Nunito'] font-bold text-[#2f2c32] text-[16px] leading-[24px]">
                            {option.label}
                          </span>
                          
                          {/* Premium Custom Radio circle */}
                          <div 
                            className={`w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected 
                                ? "border-[#171519] bg-transparent" 
                                : "border-[#c0bcc3] bg-transparent"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-[12px] h-[12px] bg-[#171519] rounded-full" />
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </motion.fieldset>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            {/* Chip Row — shown when no "custom" selection */}
            {selected !== "custom" && (
              <div className="flex flex-row gap-[12px] flex-wrap">
                {PRESETS.map((preset) => {
                  const isSelected = selected === preset.label;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => setSelected(preset.label)}
                      className={`h-[44px] px-[16px] rounded-[99px] flex items-center justify-center transition-all font-['Nunito'] font-semibold text-[16px] leading-[24px] ${isSelected
                        ? "bg-[#171519] text-[#fbf6ff]"
                        : "bg-[#f0edf4] text-[#2f2c32] shadow-[0px_1px_1.5px_rgba(18,9,0,0.06)]"
                        }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}

                {/* Custom chip */}
                <button
                  onClick={() => setIsDurationModalOpen(true)}
                  className="h-[44px] px-[16px] rounded-[99px] flex items-center justify-center transition-all font-['Nunito'] font-semibold text-[16px] leading-[24px] bg-[#f0edf4] text-[#2f2c32] shadow-[0px_1px_1.5px_rgba(18,9,0,0.06)]"
                >
                  Custom
                </button>
              </div>
            )}

            {/* Custom result row — shown after custom duration is set */}
            {selected === "custom" && (
              <div className="flex flex-col gap-[8px]">
                <span className="font-['Nunito'] font-bold text-[#49464c] text-[14px] leading-[20px] tracking-[1px] uppercase">
                  Duration
                </span>
                <div
                  onClick={() => setIsDurationModalOpen(true)}
                  className="w-full h-[56px] bg-[#faf7fe] rounded-[16px] flex items-center justify-between px-[16px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[#f0edf4] transition-colors"
                >
                  <div className="flex items-center gap-[8px]">
                    <TimerIcon className="w-[24px] h-[24px] text-[#171519]" />
                    <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                      Custom
                    </span>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px]">
                      {formatCustom()}
                    </span>
                    <ChevronDownIcon className="w-[16px] h-[16px] text-[#171519]" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {/* Bottom Spacer */}
        <div className="h-[156px] shrink-0" aria-hidden="true" />
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[#faf7fe] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col items-center gap-[32px] pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={4} subStepProgress={100} />
        </div>
        <div className="w-full flex items-center justify-between px-[16px]">
          <button
            onClick={onBack}
            className="font-['Nunito'] font-bold text-[#49464c] text-[16px] leading-[24px] underline"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isNextEnabled}
            className={`font-['Nunito'] font-bold text-[16px] leading-[24px] px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] transition-all ${isNextEnabled
              ? "bg-[#171519] text-[#fbf6ff] cursor-pointer hover:bg-[#2f2c32]"
              : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
              }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]" />
      </div>

      {/* Duration Picker Modal */}
      <DurationPickerModal
        isOpen={isDurationModalOpen}
        onClose={() => setIsDurationModalOpen(false)}
        initialHours={customHours}
        initialMinutes={customMinutes}
        onApply={(h, m) => {
          setCustomHours(h);
          setCustomMinutes(m);
          setSelected("custom");
          setIsDurationModalOpen(false);
          setIsDropdownOpen(false);
        }}
      />

      <SaveExitModal
        isOpen={isSaveModalOpen}
        onKeepWorking={() => setIsSaveModalOpen(false)}
        onExit={() => {
          setIsSaveModalOpen(false);
          if (onSaveExit) onSaveExit();
        }}
      />
    </div>
  );
}
