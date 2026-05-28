import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, TimeCreditIcon } from "../../../components/common/Icons";
import { NeumorphicDivider } from "../../../components/common/NeumorphicDivider";

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
