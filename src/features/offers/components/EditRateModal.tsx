import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "../../../components/common/Icons";
import { NeumorphicDivider } from "../../../components/common/NeumorphicDivider";

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

interface EditRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (rate: number) => void;
  initialRate: number;
}

export function EditRateModal({ isOpen, onClose, onApply, initialRate }: EditRateModalProps) {
  const [rate, setRate] = useState<number | "">(initialRate || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setRate(initialRate || "");
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    }
  }, [isOpen, initialRate]);

  const handleApply = () => {
    if (typeof rate === "number" && rate > 0) {
      onApply(rate);
      onClose();
    }
  };

  const handleClearAll = () => {
    setRate("");
    inputRef.current?.focus();
  };

  const hasRate = typeof rate === "number" && rate > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-[120] bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full z-[130] bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] select-none"
          >
            {/* Drag Handle */}
            <div className="flex justify-center mb-[16px] shrink-0">
              <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px]" />
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between px-[16px] shrink-0">
              <div className="w-[48px]" />
              <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                Edit rate
              </h3>
              <button
                onClick={onClose}
                className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors"
              >
                <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
              </button>
            </div>

            <div className="px-[16px]">
              <NeumorphicDivider />
            </div>

            {/* Content Area */}
            <div className="w-full px-[16px] flex flex-col gap-[16px]">
              <div className="flex items-center gap-[6px]">
                <TimeCreditIcon />
                <input
                  ref={inputRef}
                  type="number"
                  min={0}
                  value={rate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") { setRate(""); return; }
                    const n = parseInt(val, 10);
                    if (!isNaN(n) && n >= 0) setRate(n);
                  }}
                  className="w-full max-w-[150px] bg-transparent border-none outline-none font-['Nunito'] font-medium text-[24px] leading-[32px] tracking-[-0.7px] text-[#171519] placeholder-[#a09da3]"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="w-full flex items-center justify-between px-[16px] mt-[32px] shrink-0">
              <button
                onClick={handleClearAll}
                className="h-[48px] px-[16px] flex items-center justify-center"
              >
                <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px] underline">
                  Clear all
                </span>
              </button>
              <button
                onClick={handleApply}
                disabled={!hasRate}
                className={`h-[48px] px-[16px] w-[101px] rounded-[16px] flex items-center justify-center transition-colors ${
                  hasRate
                    ? "bg-[#171519] text-[#fbf6ff] hover:bg-[#2f2c32] shadow-skillbeek-xs"
                    : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
                }`}
              >
                <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">Apply</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
