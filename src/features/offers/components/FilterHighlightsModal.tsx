import React from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { CustomAnimatedRadioButton } from "../../../components/common/CustomAnimatedRadioButton";
import { StaticFlameIcon, StaticCodeTimerIcon, StaticCodeSparkleIcon } from "../steps/SkillDetailsView";

interface FilterHighlightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHighlight: string | null;
  onSelect: (highlight: string) => void;
  zIndex?: number;
}

const HIGHLIGHT_OPTIONS = [
  {
    id: "New offer",
    label: "New offer",
    icon: <StaticCodeSparkleIcon />,
  },
  {
    id: "Hot now",
    label: "Hot now",
    icon: <StaticFlameIcon className="w-full h-full" />,
  },
  {
    id: "Closing soon",
    label: "Closing soon",
    icon: <StaticCodeTimerIcon />,
  },
];

export function FilterHighlightsModal({
  isOpen,
  onClose,
  selectedHighlight,
  onSelect,
  zIndex,
}: FilterHighlightsModalProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Highlights" zIndex={zIndex}>

      {/* Options */}
      <div className="w-full px-[16px] flex flex-col gap-[6px]">
        {HIGHLIGHT_OPTIONS.map((option) => (
          <div
            key={option.id}
            onClick={() => {
              onSelect(option.id);
              setTimeout(onClose, 200);
            }}
            className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between px-[16px] py-[12px] min-h-[56px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
          >
            <div className="flex items-center gap-[6px]">
              <div className="w-[24px] h-[24px] flex items-center justify-center relative">
                {option.icon}
              </div>
              <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px] tracking-[0.1px]">
                {option.label}
              </span>
            </div>
            <div className="p-[10px] shrink-0">
              <CustomAnimatedRadioButton checked={selectedHighlight === option.id} />
            </div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}
