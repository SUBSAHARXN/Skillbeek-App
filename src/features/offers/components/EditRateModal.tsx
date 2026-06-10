import React, { useState, useEffect, useRef } from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { Button } from "../../../components/ui/Button";
import { TimeCreditIcon } from "../../../components/common/Icons";
import { NeumorphicDivider } from "../../../components/common/NeumorphicDivider";

interface EditRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (rate: number) => void;
  initialRate: number;
  title?: string;
}

export function EditRateModal({ isOpen, onClose, onApply, initialRate, title = "Edit rate" }: EditRateModalProps) {
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
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title} hideDivider={true}>

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
            className="w-full max-w-[150px] bg-transparent border-none outline-none font-['Nunito'] font-medium text-[24px] leading-[32px] tracking-[-0.7px] text-[var(--Text-Primary-heading-1)] placeholder-[#a09da3]"
            placeholder="0"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex items-center justify-between px-[16px] mt-[32px] shrink-0">
        <Button variant="ghost" onClick={handleClearAll}>Clear all</Button>
        <Button
          variant="primary"
          className="w-[101px]"
          onClick={handleApply}
          disabled={!hasRate}
        >
          Apply
        </Button>
      </div>
    </BottomSheet>
  );
}
