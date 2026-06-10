import React, { useState, useEffect } from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { Button } from "../../../components/ui/Button";
import { CustomAnimatedCheckbox } from "../../../components/common/CustomAnimatedCheckbox";

export interface RecurringWeeklyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (days: string[]) => void;
  disabledDays?: string[]; // days already committed in other slots
  initialDays?: string[];
  zIndex?: number;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function RecurringWeeklyModal({ isOpen, onClose, onApply, disabledDays = [], initialDays, zIndex }: RecurringWeeklyModalProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Reset selection every time the modal opens fresh
  useEffect(() => {
    if (isOpen) setSelectedDays(initialDays ?? []);
  }, [isOpen, initialDays]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleClearAll = () => setSelectedDays([]);

  const hasSelection = selectedDays.length > 0;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Days" zIndex={zIndex}>

      {/* Days List */}
      <div className="w-full flex flex-col gap-[6px] mb-[32px] max-h-[400px] overflow-y-auto pr-0 modal-scrollbar">
        {DAYS.map(day => {
          const isDisabled = disabledDays.includes(day);
          const isChecked = selectedDays.includes(day);
          return (
            <div className="px-[16px]" key={day}>
              <div
                onClick={() => !isDisabled && toggleDay(day)}
                className={`w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between p-[8px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.15)] ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
                  }`}
              >
                <span className={`font-['Nunito'] font-semibold text-[16px] leading-[24px] tracking-[0.1px] pl-[8px] ${isDisabled ? "text-[var(--Text-Primary-Text-placeholder)]" : "text-[var(--Text-Primary-heading-3)]"
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
        <Button variant="ghost" onClick={handleClearAll}>Clear all</Button>
        <Button
          variant="primary"
          className="min-w-[101px]"
          onClick={() => { if (hasSelection) onApply(selectedDays); }}
          disabled={!hasSelection}
        >
          Apply
        </Button>
      </div>
    </BottomSheet>
  );
}
