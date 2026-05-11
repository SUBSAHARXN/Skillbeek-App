import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "../../../components/common/Icons";
import { CustomAnimatedCheckbox } from "../../../components/common/CustomAnimatedCheckbox";

export interface RecurringWeeklyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (days: string[]) => void;
  disabledDays?: string[]; // days already committed in other slots
  initialDays?: string[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function RecurringWeeklyModal({ isOpen, onClose, onApply, disabledDays = [], initialDays }: RecurringWeeklyModalProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Reset selection every time the modal opens fresh
  useEffect(() => {
    if (isOpen) setSelectedDays(initialDays ?? []);
  }, [isOpen, initialDays]);

  const toggleDay = (day: string) => {
    const isAlreadySelected = selectedDays.includes(day);
    if (!isAlreadySelected) {
      const newSelection = [...selectedDays, day];
      setSelectedDays(newSelection);
      // Trigger apply immediately as per user request
      onApply(newSelection);
    } else {
      setSelectedDays(prev => prev.filter(d => d !== day));
    }
  };

  const handleClearAll = () => setSelectedDays([]);

  const hasSelection = selectedDays.length > 0;

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
            className="absolute inset-0 z-40 bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
          />

          {/* Bottom Sheet */}
          <motion.div
            key="bottom-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full z-50 bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)]"
          >
            <div className="w-full flex flex-col px-0">
              {/* Drag Handle */}
              <div className="w-full flex justify-center px-[16px]">
                <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />
              </div>

              {/* Header */}
              <div className="w-full flex items-center justify-center relative mb-[16px] h-[24px] px-[16px]">
                <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                  Select Days
                </h3>
                <button
                  onClick={onClose}
                  className="absolute right-[16px] w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-gray-200 transition-colors"
                >
                  <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
                </button>
              </div>

              {/* Divider */}
              <div className="w-full px-[16px] mb-[12px]">
                <div className="w-full h-[1px] bg-[#e0dce3]" />
              </div>

              {/* Days List */}
              <div className="w-full flex flex-col gap-[6px] mb-[32px] max-h-[400px] overflow-y-auto pr-0 modal-scrollbar">
                {DAYS.map(day => {
                  const isDisabled = disabledDays.includes(day);
                  const isChecked = selectedDays.includes(day);
                  return (
                    <div className="px-[16px]" key={day}>
                      <div
                        onClick={() => !isDisabled && toggleDay(day)}
                        className={`w-full bg-[#faf7fe] flex items-center justify-between p-[8px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.15)] ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[#f0edf4] transition-colors"
                          }`}
                      >
                        <span className={`font-['Nunito'] font-semibold text-[16px] leading-[24px] tracking-[0.1px] pl-[8px] ${isDisabled ? "text-[#a09da3]" : "text-[#2f2c32]"
                          }`}>
                          {day}
                        </span>
                        <CustomAnimatedCheckbox checked={isChecked} disabled={isDisabled} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-between px-[16px]">
                <button
                  onClick={handleClearAll}
                  className="px-[16px] py-[12px] h-[48px] flex items-center justify-center"
                >
                  <span className="font-['Nunito'] font-bold text-[#a09da3] text-[16px] underline leading-[24px]">
                    Clear all
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
