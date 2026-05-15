import React, { useState } from "react";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { SaveExitModal } from "../components/SaveExitModal";

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

// TimeCred coin icon (Skillbeek "ₛ" currency mark)
function TimeCreditIcon() {
  return (
    <div className="relative shrink-0 w-[24px] h-[24px] flex items-center justify-center">
      <svg className="w-[18px] h-[14.19px]" viewBox="0 0 18 14.1942" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M3.90166 7.37403C3.84628 7.38554 3.85484 7.46211 3.9114 7.46211H10.0626C10.1044 7.46211 10.1447 7.44666 10.1752 7.41811C10.8649 6.743 11.2097 5.82588 11.2097 4.6666C11.2097 3.7274 10.9603 2.90559 10.4614 2.20117C9.96241 1.49684 9.27268 0.953893 8.39218 0.572336C7.49707 0.190779 6.45517 0 5.2665 0C4.16583 0 3.15333 0.161389 2.22882 0.484252C1.43631 0.748423 0.751534 1.12582 0.174705 1.61645C0.00126823 1.76397 -0.0451224 2.009 0.0448947 2.21814L0.346566 2.91902C0.49378 3.26104 0.931373 3.36043 1.23607 3.14639C1.72106 2.8057 2.22803 2.54198 2.75699 2.35526C3.50549 2.07648 4.35661 1.93709 5.3105 1.93709C6.44039 1.93709 7.32829 2.17187 7.97401 2.64143C8.60496 3.11107 8.92051 3.7494 8.92051 4.55652C8.92051 5.20216 8.72235 5.70849 8.32618 6.07536C7.91523 6.44222 7.24012 6.721 6.301 6.91177L3.90166 7.37403Z" fill="#B7812F" />
        <path d="M14.4785 8.49306C14.7824 8.49306 15.0288 8.24668 15.0288 7.94276V7.44107C15.0288 7.24124 14.9205 7.05711 14.7458 6.96004L14.7242 6.94805C14.6424 6.90262 14.5504 6.87877 14.4569 6.87877H1.82154C1.51762 6.87877 1.27124 7.12515 1.27124 7.42908L1.27124 7.94276C1.27124 8.24669 1.51762 8.49306 1.82154 8.49306L5.91691 8.49306C6.14685 8.49306 6.3123 8.71569 6.27392 8.94241C6.23332 9.18223 6.213 9.436 6.213 9.70373C6.213 10.5988 6.45517 11.384 6.93934 12.059C7.40906 12.734 8.08401 13.2624 8.96451 13.6439C9.84502 14.0108 10.8869 14.1942 12.0902 14.1942C13.3376 14.1942 14.4675 14.0401 15.48 13.7319C16.3434 13.4566 17.1108 13.0854 17.782 12.6181C17.9864 12.4758 18.0535 12.2079 17.9558 11.9788L17.629 11.2133C17.4881 10.8832 17.074 10.7751 16.7728 10.9705C16.4576 11.1752 16.1367 11.3546 15.8102 11.5087C15.2673 11.7582 14.6949 11.9489 14.0934 12.081C13.477 12.1984 12.8093 12.2571 12.0902 12.2571C10.8575 12.2571 9.95502 12.037 9.38268 11.5967C8.79573 11.1565 8.50218 10.5768 8.50218 9.85782C8.50218 9.36606 8.63297 8.96311 8.89456 8.64885C8.98306 8.54252 9.11959 8.49306 9.25794 8.49306H14.4785Z" fill="#B7812F" />
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
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0 z-10 relative bg-[#fbf6ff]">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]" />
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

      <div className="flex-1 overflow-y-auto w-full flex flex-col relative pt-[0px] availability-scrollbar">

        {/* Flexible Exchange Info Banner */}
        <div className="w-full px-[16px] mb-[32px]">
          <div className="w-full bg-[#edf2ff] rounded-[12px] px-[12px] py-[14px] flex gap-[8px] items-start shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
            <ExchangeIcon />
            <div className="flex flex-col gap-[12px]">
              <h3 className="font-['Nunito'] font-bold text-[#000010] text-[20px] leading-[28px]">
                Flexible Exchange
              </h3>
              <p className="font-['Nunito'] font-medium text-[#000010] text-[16px] leading-[24px] tracking-[0.1px]">
                If your partner offers a skill instead of TimeCredits, you can choose to accept it when confirming the session.
              </p>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="w-full px-[16px] flex flex-col gap-[12px] mb-[24px]">
          <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1.2px]">
            Set your rate
          </h1>
          <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
            Enter the number of TimeCredits you want to charge per session.
          </p>
        </div>

        {/* Rate Card */}
        <div className="w-full px-[16px]">
          <div className="w-full bg-[#faf7fe] rounded-[12px] p-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
            <p className="font-['Nunito'] font-bold text-[#2f2c32] text-[18px] leading-[28px] mb-[16px]">
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
                  className="w-full max-w-[150px] bg-transparent border-none outline-none font-['Nunito'] font-medium text-[24px] leading-[32px] tracking-[-0.7px] text-[#171519] placeholder-[#a09da3]"
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
      <div className="absolute bottom-0 left-0 w-full bg-[#faf7fe] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col gap-[32px] items-center pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={3} subStepProgress={0} />
        </div>
        <div className="w-full flex items-center justify-between px-[16px]">
          <button
            onClick={onBack}
            className="flex h-[48px] items-center justify-center px-[16px] py-[12px] font-['Nunito'] font-bold text-[#49464c] text-[16px] leading-[24px] tracking-[0.16px] underline"
          >
            Back
          </button>
          <button
            onClick={() => isNextEnabled && onNext(numericRate)}
            disabled={!isNextEnabled}
            className={`flex items-center justify-center px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] leading-[24px] tracking-[0.16px] transition-colors ${isNextEnabled
                ? "bg-[#171519] text-[#fbf6ff]"
                : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]" />
      </div>

      <SaveExitModal
        isOpen={isSaveModalOpen}
        onKeepWorking={() => setIsSaveModalOpen(false)}
        onExit={() => { setIsSaveModalOpen(false); onBack(); }}
      />
    </div>
  );
}
