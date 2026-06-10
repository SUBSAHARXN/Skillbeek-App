import React, { useState, useEffect, useRef } from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { Button } from "../../../components/ui/Button";

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: string, end: string) => void;
  mode?: "single" | "range";
  initialStartTime?: string;
  initialEndTime?: string;
  zIndex?: number;
}

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
const PERIODS = ["AM", "PM"];
const ITEM_HEIGHT = 44;

export function TimePickerModal({ isOpen, onClose, onApply, mode = "range", initialStartTime, initialEndTime, zIndex }: TimePickerModalProps) {
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
                val === currentVal ? "text-[var(--Text-Primary-heading-1)]" : "text-[var(--Text-Primary-Text-placeholder)]"
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
    <BottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === "single" ? "Set time" : step === "start" ? "Set start time" : "Set end time"}
      zIndex={zIndex}
    >
      <div className="w-full flex flex-col items-center">
        {/* Subtitle */}
        {mode !== "single" && (
          <div className="px-[16px] w-full text-left mb-[16px]">
            <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
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
            <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-Text-brand)] text-[24px] leading-[32px] tracking-[-0.7px]">
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
            className="absolute left-[32px] right-[32px] bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] rounded-[12px] pointer-events-none z-0"
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
          <Button 
            variant="ghost" 
            onClick={() => {
              if (step === "end") setStep("start");
              else onClose();
            }}
          >
            {step === "end" ? "Back" : "Cancel"}
          </Button>
          <Button 
            variant="primary"
            className="min-w-[101px]"
            onClick={() => {
              if (mode === "single") {
                onApply(`${startTime.h}:${startTime.m} ${startTime.p}`, "");
              } else {
                if (step === "start") {
                  // Set end time to 1 minute after start time
                  let hour = parseInt(startTime.h, 10);
                  let min = parseInt(startTime.m, 10);
                  let period = startTime.p;

                  min += 1;
                  if (min >= 60) {
                    min -= 60;
                    hour += 1;
                    if (hour === 12) {
                      period = period === "AM" ? "PM" : "AM";
                    } else if (hour > 12) {
                      hour = 1;
                    }
                  }
                  
                  setEndTime({
                    h: hour.toString(),
                    m: min.toString().padStart(2, "0"),
                    p: period
                  });
                  
                  setStep("end");
                } else {
                  onApply(
                    `${startTime.h}:${startTime.m} ${startTime.p}`,
                    `${endTime.h}:${endTime.m} ${endTime.p}`
                  );
                }
              }
            }}
          >
            {mode === "single" || step === "end" ? "Apply" : "Set end time"}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
