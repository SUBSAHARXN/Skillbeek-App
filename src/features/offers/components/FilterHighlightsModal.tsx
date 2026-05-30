import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "../../../components/common/Icons";
import { CustomAnimatedRadioButton } from "../../../components/common/CustomAnimatedRadioButton";
import { StaticFlameIcon, StaticCodeTimerIcon, StaticCodeSparkleIcon } from "../steps/SkillDetailsView";

interface FilterHighlightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHighlight: string | null;
  onSelect: (highlight: string) => void;
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
}: FilterHighlightsModalProps) {
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
            className="absolute inset-0 z-[140] bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
          />

          {/* Bottom Sheet */}
          <motion.div
            key="bottom-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full z-[150] bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col items-center shadow-[0px_-10px_30px_rgba(0,0,0,0.1)]"
          >
            <div className="w-full flex flex-col items-center px-[16px]">
              {/* Drag Handle */}
              <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />

              {/* Header */}
              <div className="w-full flex items-center justify-center relative mb-[16px] h-[24px]">
                <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                  Highlights
                </h3>
                <button
                  onClick={onClose}
                  className="absolute right-0 w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-gray-200 transition-colors"
                >
                  <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
                </button>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#e0dce3] mb-[12px]" />

              {/* Options */}
              <div className="w-full flex flex-col gap-[6px]">
                {HIGHLIGHT_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      onSelect(option.id);
                      setTimeout(onClose, 200);
                    }}
                    className="w-full bg-[#faf7fe] flex items-center justify-between px-[16px] py-[12px] min-h-[56px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[#f0edf4] transition-colors"
                  >
                    <div className="flex items-center gap-[6px]">
                      <div className="w-[24px] h-[24px] flex items-center justify-center relative">
                        {option.icon}
                      </div>
                      <span className="font-['Nunito'] font-semibold text-[#2f2c32] text-[16px] leading-[24px] tracking-[0.1px]">
                        {option.label}
                      </span>
                    </div>
                    <div className="p-[10px] shrink-0">
                      <CustomAnimatedRadioButton checked={selectedHighlight === option.id} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
