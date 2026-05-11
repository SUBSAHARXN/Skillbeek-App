import React, { useState } from "react";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { ChevronDownIcon, CalendarIcon } from "../../../components/common/Icons";
import { SpecificDatesModal } from "../components/SpecificDatesModal";
import { TimePickerModal } from "../components/TimePickerModal";
import { SaveExitModal } from "../components/SaveExitModal";

// Local ClockIcon component for this view
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

interface OfferExpirationViewProps {
  onBack: () => void;
  onNext: (expiration: { date: Date | null; time: string | null }) => void;
  onSaveExit?: () => void;
  onQuestions?: () => void;
}

export function OfferExpirationView({
  onBack,
  onNext,
  onSaveExit,
  onQuestions
}: OfferExpirationViewProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // If the user hasn't explicitly set a date, we default to showing "90 days from now" as a placeholder?
  // Actually, the mockup shows "Tue, Oct 3" and "12:00 PM". Let's format date if set, otherwise "Select Date"
  const formattedDate = date 
    ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : "Select Date";
  
  const formattedTime = time || "Select Time";

  const isNextEnabled = date !== null && time !== null;

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      {/* Header Action Buttons */}
      <div className="w-full px-[16px] flex justify-between items-center mb-[24px] pt-[16px]">
        <button 
          onClick={() => setIsSaveModalOpen(true)}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
            Save and Exit
          </span>
        </button>
        <button 
          onClick={onQuestions}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
            Questions?
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-[16px] overflow-y-auto">
        <div className="flex flex-col gap-[12px] mb-[32px]">
          <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1.2px]">
            Offer Duration
          </h1>
          <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
            To keep the marketplace fresh, offers expire after 90 days by default. You can change this if you'd like.
          </p>
        </div>

        {/* Expiration Settings */}
        <div className="flex flex-col gap-[16px]">
          <h2 className="font-['Nunito'] font-bold text-[#49464c] text-[14px] leading-[20px] tracking-[1px] uppercase">
            Offer expires
          </h2>

          <div className="flex flex-col gap-[12px]">
            {/* Day Row */}
            <div 
              onClick={() => setIsDateModalOpen(true)}
              className="w-full h-[56px] bg-[#faf7fe] rounded-[16px] flex items-center justify-between px-[16px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[#f0edf4] transition-colors"
            >
              <div className="flex items-center gap-[8px]">
                <CalendarIcon className="w-[24px] h-[24px] text-[#171519]" />
                <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                  Date
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px]">
                  {formattedDate}
                </span>
                <ChevronDownIcon className="w-[16px] h-[16px] text-[#171519]" />
              </div>
            </div>

            {/* Time Row */}
            <div 
              onClick={() => setIsTimeModalOpen(true)}
              className="w-full h-[56px] bg-[#faf7fe] rounded-[16px] flex items-center justify-between px-[16px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[#f0edf4] transition-colors"
            >
              <div className="flex items-center gap-[8px]">
                <ClockIcon className="w-[24px] h-[24px] text-[#171519]" />
                <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                  Time
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px]">
                  {formattedTime}
                </span>
                <ChevronDownIcon className="w-[16px] h-[16px] text-[#171519]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#faf7fe] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col items-center gap-[32px] pt-[0px] pb-[44px] shrink-0">
        <OfferProgressBar currentStep={4} subStepProgress={50} />
        <div className="w-full flex items-center justify-between px-[16px]">
          <button onClick={onBack} className="font-['Nunito'] font-bold text-[#49464c] text-[16px] leading-[24px] underline">
            Back
          </button>
          <button
            onClick={() => isNextEnabled && onNext({ date, time })}
            disabled={!isNextEnabled}
            className={`font-['Nunito'] font-bold text-[16px] leading-[24px] px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] transition-all ${
              isNextEnabled ? "bg-[#171519] text-[#fbf6ff] cursor-pointer hover:bg-[#2f2c32]" : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]" />
      </div>

      {/* Modals */}
      <SpecificDatesModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        mode="single"
        onApply={(start) => {
          setDate(start);
          setIsDateModalOpen(false);
        }}
      />
      
      <TimePickerModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        mode="single"
        onApply={(start) => {
          setTime(start);
          setIsTimeModalOpen(false);
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
