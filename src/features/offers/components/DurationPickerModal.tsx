import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "../../../components/common/Icons";

interface DurationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (hours: number, minutes: number) => void;
  initialHours?: number;
  initialMinutes?: number;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i.toString()); // 0–12
const MINUTES = ["00", "15", "30", "45"];
const ITEM_HEIGHT = 44;

export function DurationPickerModal({
  isOpen,
  onClose,
  onApply,
  initialHours = 1,
  initialMinutes = 30,
}: DurationPickerModalProps) {
  const [hours, setHours] = useState(initialHours.toString());
  const [minutes, setMinutes] = useState(initialMinutes.toString().padStart(2, "0"));

  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const scrollTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const handleScroll = (type: "h" | "m") => {
    const el = type === "h" ? hourRef.current : minRef.current;
    if (!el) return;

    if (scrollTimers.current[type]) clearTimeout(scrollTimers.current[type]);

    scrollTimers.current[type] = setTimeout(() => {
      const activeIdx = Math.round(el.scrollTop / ITEM_HEIGHT);
      const data = type === "h" ? HOURS : MINUTES;
      const val = data[Math.min(activeIdx, data.length - 1)];
      
      if (type === "h") setHours(val);
      else setMinutes(val);
      
      // snap to the exact position
      el.scrollTo({ top: activeIdx * ITEM_HEIGHT, behavior: "smooth" });
    }, 100);
  };

  // Sync scroll positions when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const syncScroll = (el: HTMLDivElement | null, data: string[], val: string) => {
      if (!el) return;
      const idx = data.indexOf(val);
      if (idx >= 0) {
        el.scrollTop = idx * ITEM_HEIGHT;
      }
    };

    requestAnimationFrame(() => {
      syncScroll(hourRef.current, HOURS, hours);
      syncScroll(minRef.current, MINUTES, minutes);
    });
  }, [isOpen]);

  const handleApply = () => {
    let h = parseInt(hours);
    let m = parseInt(minutes);
    
    // Edge case: 0 hr 0 min → snap to 0 hr 15 min
    if (h === 0 && m === 0) {
      m = 15;
    }
    onApply(h, m);
  };

  const renderColumn = (type: "h" | "m", data: string[], ref: React.RefObject<HTMLDivElement>) => {
    const currentVal = type === "h" ? hours : minutes;
    const label = type === "h" ? "hr" : "min";

    return (
      <div className="flex-1 flex items-center justify-center relative h-full">
        {/* Static Label anchored to the right of the numbers */}
        <div className="absolute right-[25%] pointer-events-none z-20">
          <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[44px]">
            {label}
          </span>
        </div>
        
        <div 
          ref={ref}
          onScroll={() => handleScroll(type)}
          className="w-full overflow-y-auto scrollbar-hide snap-y snap-mandatory relative z-10"
          style={{ padding: `${ITEM_HEIGHT * 2}px 0`, height: "100%" }}
        >
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
          {data.map((val) => (
            <div 
              key={val} 
              className="picker-item flex items-center justify-center snap-center"
              style={{ height: ITEM_HEIGHT, paddingRight: "40px" }} // Push numbers left to make room for label
            >
              <span
                className={`font-['Nunito'] font-bold text-[24px] tracking-[-0.7px] transition-colors block ${
                  val === currentVal ? "text-[#171519]" : "text-[#a09da3]"
                }`}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full z-50 bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col items-center shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] select-none"
          >
            {/* Drag Handle */}
            <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />

            {/* Header */}
            <div className="w-full flex items-center justify-between px-[16px] mb-[4px]">
              <div className="w-[48px]" />
              <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                Custom Session Length
              </h3>
              <button
                onClick={onClose}
                className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors"
              >
                <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
              </button>
            </div>

            <p className="font-['Nunito'] font-medium text-[#49464c] text-[14px] leading-[20px] tracking-[0.1px] mb-[16px]">
              Set the exact duration for your session.
            </p>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#e0dce3] mb-[0px]" />

            {/* Picker Wheels Area */}
            <div 
              className="relative w-full h-[220px]"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
                maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)"
              }}
            >
              {/* Highlight Background */}
              <div 
                className="absolute left-[32px] right-[32px] bg-[#e0dce3] rounded-[12px] pointer-events-none z-0"
                style={{ top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT }}
              />

              <div className="flex w-full h-full relative z-10 px-[16px]">
                {renderColumn("h", HOURS, hourRef)}
                {renderColumn("m", MINUTES, minRef)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex items-center justify-between px-[16px] mt-[24px]">
              <button 
                onClick={onClose}
                className="px-[16px] py-[12px] h-[48px] flex items-center justify-center"
              >
                <span className="font-['Nunito'] font-bold text-[#a09da3] text-[16px] underline leading-[24px]">
                  Cancel
                </span>
              </button>
              <button 
                onClick={handleApply}
                className="px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] flex items-center justify-center bg-[#171519] text-[#fbf6ff] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] hover:bg-[#2f2c32] transition-colors"
              >
                <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
                  Apply
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
