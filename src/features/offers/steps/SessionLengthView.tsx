import React, { useState } from "react";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { ChevronDownIcon, TimerIcon } from "../../../components/common/Icons";
import { DurationPickerModal } from "../components/DurationPickerModal";
import { SaveExitModal } from "../components/SaveExitModal";

interface SessionLengthViewProps {
  onBack: () => void;
  onNext: (duration: { type: "preset" | "custom"; minutes: number }) => void;
  onSaveExit?: () => void;
  onQuestions?: () => void;
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
}: SessionLengthViewProps) {
  // null = nothing selected; "30"|"60"|"90"|"custom"
  const [selected, setSelected] = useState<string | null>(null);
  const [customHours, setCustomHours] = useState(1);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const customTotalMinutes = customHours * 60 + customMinutes;

  const formatCustom = () => {
    const h = customHours;
    const m = customMinutes;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} hr`;
    return `${h} hr ${m} min`;
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

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]" />
      </div>

      {/* Header Buttons */}
      <div className="w-full px-[16px] flex justify-between items-center mb-[24px] pt-[16px]">
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">Save and Exit</span>
        </button>
        <button
          onClick={onQuestions}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">Questions?</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-[16px] overflow-y-auto">
        <div className="flex flex-col gap-[12px] mb-[32px]">
          <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1.2px]">
            Default Session Length
          </h1>
          <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
            Set the standard length for a session. You can always agree to a different length with your partner for a specific session.
          </p>
        </div>

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
                <TimerIcon className="w-[24px] h-[24px] text-[#49464c]" />
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
      </div>

      {/* Footer */}
      <div className="bg-[#faf7fe] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col items-center gap-[32px] pt-[0px] pb-[44px] shrink-0">
        <OfferProgressBar currentStep={4} subStepProgress={100} />
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
