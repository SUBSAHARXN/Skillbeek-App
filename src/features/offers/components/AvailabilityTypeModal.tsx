import React from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { CustomAnimatedRadioButton } from "../../../components/common/CustomAnimatedRadioButton";

interface AvailabilityTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: string | null;
  onSelect: (type: string) => void;
}

export function AvailabilityTypeModal({
  isOpen,
  onClose,
  selectedType,
  onSelect,
}: AvailabilityTypeModalProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Availability type">

      {/* Options */}
      <div className="w-full px-[16px] flex flex-col gap-[6px]">
        {/* Recurring Weekly */}
        <div
          onClick={() => {
            onSelect("Recurring Weekly");
            setTimeout(onClose, 200);
          }}
          className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between px-[16px] py-[12px] min-h-[56px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer"
        >
          <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px] tracking-[0.1px]">
            Recurring Weekly
          </span>
          <div className="p-[10px] shrink-0">
            <CustomAnimatedRadioButton checked={selectedType === "Recurring Weekly"} />
          </div>
        </div>

        {/* Specific Dates */}
        <div
          onClick={() => {
            onSelect("Specific Dates");
            setTimeout(onClose, 200);
          }}
          className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between px-[16px] py-[12px] min-h-[56px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer"
        >
          <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px] tracking-[0.1px]">
            Specific Dates
          </span>
          <div className="p-[10px] shrink-0">
            <CustomAnimatedRadioButton checked={selectedType === "Specific Dates"} />
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
