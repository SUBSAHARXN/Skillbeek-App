import React, { useState, useEffect, useRef } from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { Button } from "../../../components/ui/Button";

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
          <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[44px]">
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
                  val === currentVal ? "text-[var(--Text-Primary-heading-1)]" : "text-[var(--Text-Primary-Text-placeholder)]"
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
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Custom Session Length">
      <p className="font-['Nunito'] font-semibold text-[var(--Text-Primary-Subtitle)] text-[14px] leading-[20px] tracking-[1px] text-center mb-[16px] px-[16px]">
        Set the exact duration for your session.
      </p>


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
          className="absolute left-[32px] right-[32px] bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] rounded-[12px] pointer-events-none z-0"
          style={{ top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT }}
        />

        <div className="flex w-full h-full relative z-10 px-[16px]">
          {renderColumn("h", HOURS, hourRef)}
          {renderColumn("m", MINUTES, minRef)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex items-center justify-between px-[16px] mt-[24px]">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          className="min-w-[101px]"
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>
    </BottomSheet>
  );
}
