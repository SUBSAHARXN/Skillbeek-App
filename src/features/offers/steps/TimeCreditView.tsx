import React, { useState } from "react";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { SaveExitModal } from "../components/SaveExitModal";
import { TimeCreditIcon } from "../../../components/common/Icons";

interface TimeCreditViewProps {
  onBack: () => void;
  onNext: (rate: number) => void;
}

// Exchange icon matching Figma node 2694:9238
function ExchangeIcon() {
  return (
    <div className="relative shrink-0 w-[24px] h-[24px]">
      <svg className="absolute h-[16.14px] left-[9.02px] top-[2px] w-[14.984px]" viewBox="0 0 15 16.14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.64445 3.03168C6.59022 2.66451 6.24737 2.4075 5.88739 2.49788C5.05416 2.70707 4.2673 3.07347 3.57205 3.57864C2.69594 4.21522 1.99232 5.05252 1.52353 6.01637C1.05474 6.98021 0.83524 8.04086 0.884479 9.10435C0.933717 10.1678 1.25017 11.2014 1.80581 12.1133C2.36145 13.0253 3.13913 13.7876 4.06995 14.3327C5.00077 14.8778 6.05601 15.1889 7.1422 15.2384C8.22839 15.2879 9.31199 15.0743 10.297 14.6165C11.0721 14.2563 11.7674 13.7536 12.3458 13.1381C12.604 12.8635 12.5384 12.4317 12.2333 12.2103L12.103 12.1158C11.8073 11.9012 11.3972 11.966 11.1404 12.2258C10.7133 12.6578 10.2094 13.0126 9.65184 13.2718C8.89336 13.6243 8.05899 13.7888 7.22262 13.7506C6.38626 13.7125 5.57373 13.473 4.85699 13.0533C4.14026 12.6335 3.54145 12.0466 3.11361 11.3443C2.68576 10.6421 2.44209 9.8463 2.40418 9.02741C2.36627 8.20852 2.53528 7.39183 2.89625 6.64967C3.25722 5.90751 3.799 5.26279 4.47361 4.77262C4.96723 4.41395 5.52083 4.14613 6.10709 3.98029C6.46423 3.87926 6.71979 3.54189 6.66557 3.17472L6.64445 3.03168Z" fill="#020038" />
        <path d="M8.58148 2.02759C8.75199 2.05335 8.83067 2.25403 8.72311 2.38882L6.787 4.81497C6.67943 4.94976 6.4663 4.91756 6.40335 4.75701L5.2703 1.86721C5.20735 1.70667 5.3418 1.53819 5.51231 1.56394L8.58148 2.02759Z" fill="#020038" />
      </svg>
      <svg className="absolute h-[16.14px] left-0 top-[4.91px] w-[14.984px] rotate-180" viewBox="0 0 15 16.14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.64445 3.03168C6.59022 2.66451 6.24737 2.4075 5.88739 2.49788C5.05416 2.70707 4.2673 3.07347 3.57205 3.57864C2.69594 4.21522 1.99232 5.05252 1.52353 6.01637C1.05474 6.98021 0.83524 8.04086 0.884479 9.10435C0.933717 10.1678 1.25017 11.2014 1.80581 12.1133C2.36145 13.0253 3.13913 13.7876 4.06995 14.3327C5.00077 14.8778 6.05601 15.1889 7.1422 15.2384C8.22839 15.2879 9.31199 15.0743 10.297 14.6165C11.0721 14.2563 11.7674 13.7536 12.3458 13.1381C12.604 12.8635 12.5384 12.4317 12.2333 12.2103L12.103 12.1158C11.8073 11.9012 11.3972 11.966 11.1404 12.2258C10.7133 12.6578 10.2094 13.0126 9.65184 13.2718C8.89336 13.6243 8.05899 13.7888 7.22262 13.7506C6.38626 13.7125 5.57373 13.473 4.85699 13.0533C4.14026 12.6335 3.54145 12.0466 3.11361 11.3443C2.68576 10.6421 2.44209 9.8463 2.40418 9.02741C2.36627 8.20852 2.53528 7.39183 2.89625 6.64967C3.25722 5.90751 3.799 5.26279 4.47361 4.77262C4.96723 4.41395 5.52083 4.14613 6.10709 3.98029C6.46423 3.87926 6.71979 3.54189 6.66557 3.17472L6.64445 3.03168Z" fill="#020038" />
        <path d="M8.58148 2.02759C8.75199 2.05335 8.83067 2.25403 8.72311 2.38882L6.787 4.81497C6.67943 4.94976 6.4663 4.91756 6.40335 4.75701L5.2703 1.86721C5.20735 1.70667 5.3418 1.53819 5.51231 1.56394L8.58148 2.02759Z" fill="#020038" />
      </svg>
    </div>
  );
}

export function TimeCreditView({ onBack, onNext }: TimeCreditViewProps) {
  // Use empty string to show placeholder, otherwise the active value
  const [rate, setRate] = useState<number | "">("");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const numericRate = typeof rate === "number" ? rate : 0;
  const isNextEnabled = numericRate > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") { setRate(""); return; }
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 0) setRate(n);
  };

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0 z-10 relative bg-[var(--Surface-Primary-Background)]">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]" />
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

        {/* Flexible Exchange Info Banner */}
        <div className="w-full px-[16px] mb-[32px]">
          <div className="w-full bg-[var(--Surface-Information-bg-surface)] rounded-[12px] px-[12px] py-[14px] flex gap-[8px] items-start shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
            <ExchangeIcon />
            <div className="flex flex-col gap-[12px]">
              <h3 className="font-['Nunito'] font-bold text-[var(--Text-Information-primary-darker)] text-[20px] leading-[28px]">
                Flexible Exchange
              </h3>
              <p className="font-['Nunito'] font-medium text-[var(--Text-Information-primary-darker)] text-[16px] leading-[24px] tracking-[0.1px]">
                If your partner offers a skill instead of TimeCredits, you can choose to accept it when confirming the session.
              </p>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="w-full px-[16px] flex flex-col gap-[12px] mb-[24px]">
          <h1 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[36px] tracking-[-1.2px]">
            Set your rate
          </h1>
          <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
            Enter the number of TimeCredits you want to charge per session.
          </p>
        </div>

        {/* Rate Card */}
        <div className="w-full px-[16px]">
          <div className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] p-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
            <p className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-3)] text-[18px] leading-[28px] mb-[16px]">
              Set your rate (per session)
            </p>
            <div className="flex items-center justify-between">
              {/* Currency icon + input */}
              <div className="flex items-center gap-[6px]">
                <TimeCreditIcon />
                <input
                  type="number"
                  min={0}
                  value={rate}
                  onChange={handleInputChange}
                  className="w-full max-w-[150px] bg-transparent border-none outline-none font-['Nunito'] font-medium text-[24px] leading-[32px] tracking-[-0.7px] text-[var(--Text-Primary-heading-1)] placeholder-[#a09da3]"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-[156px] shrink-0" aria-hidden="true" />
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col gap-[32px] items-center pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={3} subStepProgress={0} />
        </div>
        <div className="w-full flex items-center justify-between px-[16px]">
          <button
            onClick={onBack}
            className="flex h-[48px] items-center justify-center px-[16px] py-[12px] font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.16px] underline"
          >
            Back
          </button>
          <button
            onClick={() => isNextEnabled && onNext(numericRate)}
            disabled={!isNextEnabled}
            className={`flex items-center justify-center px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] leading-[24px] tracking-[0.16px] transition-colors ${isNextEnabled
              ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)]"
              : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]" />
      </div>

      <SaveExitModal
        isOpen={isSaveModalOpen}
        onKeepWorking={() => setIsSaveModalOpen(false)}
        onExit={() => { setIsSaveModalOpen(false); onBack(); }}
      />
    </div>
  );
}
