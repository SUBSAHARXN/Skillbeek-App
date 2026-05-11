import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "../../../components/common/Icons";

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: string, end: string) => void;
  mode?: "single" | "range";
  initialStartTime?: string;
  initialEndTime?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
const PERIODS = ["AM", "PM"];
const ITEM_HEIGHT = 44;

export function TimePickerModal({ isOpen, onClose, onApply, mode = "range", initialStartTime, initialEndTime }: TimePickerModalProps) {
  const [step, setStep] = useState<"start" | "end">("start");
  
  const parseTime = (timeStr?: string, defaultTime = { h: "9", m: "00", p: "AM" }) => {
    if (!timeStr) return defaultTime;
    const [time, period] = timeStr.split(" ");
    const [h, m] = time.split(":");
    return { h, m, p: period as "AM" | "PM" };
  };

  const [startTime, setStartTime] = useState(() => parseTime(initialStartTime, { h: "9", m: "00", p: "AM" }));
  const [endTime, setEndTime] = useState(() => parseTime(initialEndTime, { h: "5", m: "00", p: "PM" }));

  // Re-sync if initial props change while open (or when opening)
  useEffect(() => {
    if (isOpen) {
      setStartTime(parseTime(initialStartTime, { h: "9", m: "00", p: "AM" }));
      setEndTime(parseTime(initialEndTime, { h: "5", m: "00", p: "PM" }));
      setStep("start");
    }
  }, [isOpen, initialStartTime, initialEndTime]);

  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const perRef = useRef<HTMLDivElement>(null);

  const scrollTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const applyOpticalCurve = (el: HTMLDivElement | null) => {
    if (!el) return;
    const center = el.scrollTop + 110; // 220px container / 2
    const items = el.querySelectorAll('.picker-item');
    items.forEach(item => {
      const label = item.querySelector('.picker-label') as HTMLElement;
      if (!label) return;
      const distance = ((item as HTMLElement).offsetTop + 22) - center;
      const angle = distance * -0.75;
      label.style.transform = `perspective(260px) rotateX(${angle}deg)`;
    });
  };

  const handleScroll = (type: "h" | "m" | "p") => {
    const el = type === "h" ? hourRef.current : type === "m" ? minRef.current : perRef.current;
    if (!el) return;

    applyOpticalCurve(el);

    if (scrollTimers.current[type]) clearTimeout(scrollTimers.current[type]);

    scrollTimers.current[type] = setTimeout(() => {
      const activeIdx = Math.round(el.scrollTop / ITEM_HEIGHT);
      const data = type === "h" ? HOURS : type === "m" ? MINUTES : PERIODS;
      const val = data[Math.min(activeIdx, data.length - 1)];
      
      if (step === "start") {
        setStartTime((prev) => ({ ...prev, [type]: val }));
      } else {
        setEndTime((prev) => ({ ...prev, [type]: val }));
      }
      
      // snap to the exact position
      el.scrollTo({ top: activeIdx * ITEM_HEIGHT, behavior: "smooth" });
    }, 100);
  };

  // Sync scroll positions when modal opens or step changes
  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setStep("start");
      return;
    }

    const t = step === "start" ? startTime : endTime;

    const syncScroll = (el: HTMLDivElement | null, data: string[], val: string) => {
      if (!el) return;
      const idx = data.indexOf(val);
      if (idx >= 0) {
        el.scrollTop = idx * ITEM_HEIGHT;
      }
    };

    // Use requestAnimationFrame to let the DOM paint first
    requestAnimationFrame(() => {
      syncScroll(hourRef.current, HOURS, t.h);
      syncScroll(minRef.current, MINUTES, t.m);
      syncScroll(perRef.current, PERIODS, t.p);

      applyOpticalCurve(hourRef.current);
      applyOpticalCurve(minRef.current);
      applyOpticalCurve(perRef.current);
    });
  }, [isOpen, step, startTime, endTime]);

  const renderColumn = (type: "h" | "m" | "p", data: string[], ref: React.RefObject<HTMLDivElement>) => {
    const currentVal = step === "start" ? startTime[type] : endTime[type];

    return (
      <div 
        ref={ref}
        onScroll={() => handleScroll(type)}
        className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory px-[4px] text-center relative z-10"
        style={{ padding: `${ITEM_HEIGHT * 2}px 0` }}
      >
        {data.map((val) => (
          <div 
            key={val} 
            className="picker-item flex items-center justify-center snap-center"
            style={{ height: ITEM_HEIGHT }}
          >
            <span
              className={`picker-label font-['Nunito'] font-bold text-[24px] tracking-[-0.7px] transition-colors block will-change-transform ${
                val === currentVal ? "text-[#171519]" : "text-[#a09da3]"
              }`}
            >
              {val}
            </span>
          </div>
        ))}
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
            className="absolute inset-0 z-[140] bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full z-[150] bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col items-center shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] select-none"
          >
            <div className="w-full flex flex-col items-center">
              {/* Drag Handle */}
              <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />

              {/* Header */}
              <div className="w-full flex items-center justify-between px-[16px] mb-[16px]">
                <div className="w-[48px]" />
                <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                  {mode === "single" ? "Set time" : step === "start" ? "Set start time" : "Set end time"}
                </h3>
                <button
                  onClick={onClose}
                  className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors"
                >
                  <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
                </button>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#e0dce3] mb-[16px]" />

              {/* Subtitle */}
              {mode !== "single" && (
                <div className="px-[16px] w-full text-left mb-[16px]">
                  <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
                    Set the specific hours you are available to swap.
                  </p>
                </div>
              )}

              {/* Breadcrumb for end time */}
              {step === "end" && (
                <div 
                  className="w-full flex items-center justify-center mb-[16px] cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => setStep("start")}
                >
                  <span className="font-['Nunito'] font-semibold text-[#b7812f] text-[24px] leading-[32px] tracking-[-0.7px]">
                    {startTime.h}:{startTime.m} {startTime.p} -
                  </span>
                </div>
              )}

              {/* Picker Wheels */}
              <div 
                className="relative w-full h-[220px] transition-all duration-300"
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

                <div className="flex w-full h-full relative z-10 px-[16px] gap-[16px]">
                  {renderColumn("h", HOURS, hourRef)}
                  {renderColumn("m", MINUTES, minRef)}
                  {renderColumn("p", PERIODS, perRef)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-between px-[16px] mt-[24px]">
                <button 
                  onClick={() => {
                    if (step === "end") setStep("start");
                    else onClose();
                  }}
                  className="px-[16px] py-[12px] h-[48px] flex items-center justify-center"
                >
                  <span className="font-['Nunito'] font-bold text-[#a09da3] text-[16px] underline leading-[24px]">
                    Cancel
                  </span>
                </button>
                <button 
                  onClick={() => {
                    if (mode === "single") {
                      const s = `${startTime.h}:${startTime.m} ${startTime.p}`;
                      onApply(s, s);
                    } else if (step === "start") {
                      setStep("end");
                    } else {
                      const s = `${startTime.h}:${startTime.m} ${startTime.p}`;
                      const e = `${endTime.h}:${endTime.m} ${endTime.p}`;
                      onApply(s, e);
                    }
                  }}
                  className="px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] flex items-center justify-center bg-[#171519] text-[#fbf6ff] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] hover:bg-[#2f2c32] transition-colors"
                >
                  <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
                    {mode === "single" ? "Apply" : step === "start" ? "Set end time" : "Apply"}
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
