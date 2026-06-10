import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface FakeKeyboardProps {
  className?: string;
  isVisible: boolean;
}

export function FakeKeyboard({ className, isVisible }: FakeKeyboardProps) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: isVisible ? 0 : "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        "absolute bottom-0 left-0 right-0 h-[288px] bg-[var(--Surface-UI-surface-surface-variant)] rounded-t-[16px] shadow-lg flex flex-col z-50",
        className
      )}
    >
      {/* Keyboard Toolbar layer (mocked) */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1 bg-[var(--Surface-UI-surface-surface-variant)] h-[40px] rounded-t-[16px]">
        {/* Mocked toolbar icons */}
        <div className="flex gap-4">
          <div className="w-5 h-5 bg-gray-300 rounded-sm opacity-50"></div>
          <div className="w-5 h-5 bg-gray-300 rounded-sm opacity-50"></div>
          <div className="w-5 h-5 bg-gray-300 rounded-sm opacity-50"></div>
        </div>
        <div className="flex gap-4">
          <div className="w-5 h-5 bg-gray-300 rounded-sm opacity-50"></div>
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="flex-1 px-2 pt-2 pb-8 flex flex-col gap-[10px]">
        {/* Row 1 */}
        <div className="flex justify-center gap-[4px] px-[2px]">
          {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((key) => (
            <div
              key={key}
              className="flex-1 h-[40px] bg-[var(--Surface-Primary-Background)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)] flex items-center justify-center font-['Nunito'] text-[20px] text-[var(--Text-Primary-heading-1)] pb-1"
            >
              {key}
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex justify-center gap-[4px] px-[18px]">
          {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((key) => (
            <div
              key={key}
              className="flex-1 h-[40px] bg-[var(--Surface-Primary-Background)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)] flex items-center justify-center font-['Nunito'] text-[20px] text-[var(--Text-Primary-heading-1)] pb-1"
            >
              {key}
            </div>
          ))}
        </div>

        {/* Row 3 */}
        <div className="flex justify-center gap-[4px] px-[2px]">
          <div className="w-[36px] h-[40px] bg-[var(--Button-UI-comp-sur-Stroke-Stroke)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)] flex items-center justify-center">
            {/* Shift icon mock */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2"><path d="M12 2v20M12 2l-7 7m7-7l7 7"/></svg>
          </div>
          {["z", "x", "c", "v", "b", "n", "m"].map((key) => (
            <div
              key={key}
              className="flex-1 max-w-[36px] h-[40px] bg-[var(--Surface-Primary-Background)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)] flex items-center justify-center font-['Nunito'] text-[20px] text-[var(--Text-Primary-heading-1)] pb-1"
            >
              {key}
            </div>
          ))}
          <div className="w-[48px] h-[40px] bg-[var(--Button-UI-comp-sur-Stroke-Stroke)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)] flex items-center justify-center">
            {/* Delete icon mock */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM18 9l-6 6M12 9l6 6"/></svg>
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex justify-center gap-[4px] px-[2px]">
          <div className="w-[52px] h-[40px] bg-[var(--Button-UI-comp-sur-Stroke-Stroke)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)] flex items-center justify-center font-['Nunito'] font-bold text-[14px]">
            ?123
          </div>
          <div className="w-[32px] h-[40px] bg-[var(--Button-UI-comp-sur-Stroke-Stroke)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)] flex items-center justify-center">
             @
          </div>
          <div className="w-[32px] h-[40px] bg-[var(--Surface-Primary-Background)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)] flex items-center justify-center text-[18px]">
             ☺
          </div>
          <div className="flex-1 w-[148px] h-[40px] bg-[var(--Surface-Primary-Background)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)]">
             {/* Spacebar */}
          </div>
          <div className="w-[32px] h-[40px] bg-[var(--Button-UI-comp-sur-Stroke-Stroke)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)] flex items-center justify-center font-bold text-[16px] pb-1">
             .
          </div>
          <div className="w-[52px] h-[40px] bg-[var(--Text-Primary-Text-brandPrimary)] rounded-[6px] shadow-[0px_1px_0px_0px_rgba(56,12,81,0.25)] flex items-center justify-center">
             {/* Enter icon mock (white) */}
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M9 10l-5 5 5 5M4 15h11a4 4 0 0 0 4-4V4"/></svg>
          </div>
        </div>
      </div>
      
      {/* Dragger / Handle */}
      <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[120px] h-[3px] bg-[var(--Button-UI-comp-sur-Stroke-Stroke)] rounded-full"></div>
    </motion.div>
  );
}
