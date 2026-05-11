import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "../../../components/common/Icons";

export interface SpecificDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: Date, end: Date) => void;
  mode?: "single" | "range";
  initialRange?: { start: Date; end: Date } | null;
  disabledRanges?: { start: Date; end: Date }[];
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

export function SpecificDatesModal({ isOpen, onClose, onApply, mode = "range", initialRange, disabledRanges }: SpecificDatesModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Memoize limits so they don't recalculate on every render
  const { today, maxDate } = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const m = new Date(t);
    m.setDate(m.getDate() + 90);
    return { today: t, maxDate: m };
  }, []);

  const toMs = (d: Date | null) => (d ? d.getTime() : null);
  const sameDay = (a: Date | null, b: Date | null) => a && b && toMs(a) === toMs(b);
  const fmt = (d: Date | null) => (d ? `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}` : "");

  // Calculate rendering range (4 months)
  const months = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }, [today]);

  const handleDayClick = (year: number, month: number, day: number) => {
    const sel = new Date(year, month, day);
    sel.setHours(0, 0, 0, 0);

    const msSel = toMs(sel);
    if (msSel === null) return;
    if (msSel > (toMs(maxDate) || Infinity) || msSel < (toMs(today) || 0)) return; // Disabled

    if (mode === "single") {
      setStartDate(sel);
      setEndDate(sel);
      return;
    }

    if (!startDate || (startDate && endDate)) {
      setStartDate(sel);
      setEndDate(null);
    } else {
      const msStart = toMs(startDate) || 0;
      if (msSel < msStart) {
        setStartDate(sel);
      } else if (sameDay(sel, startDate)) {
        setStartDate(null);
      } else {
        setEndDate(sel);
      }
    }
  };

  const clearAll = () => {
    setStartDate(null);
    setEndDate(null);
  };

  // Helper to determine tailwind classes for rendering
  const getDayClass = (year: number, month: number, day: number) => {
    const thisDate = new Date(year, month, day);
    thisDate.setHours(0, 0, 0, 0);
    const ms = toMs(thisDate);
    if (ms === null) return { isDisabled: true, isStart: false, isEnd: false, isMid: false };

    const isDisabled = ms > (toMs(maxDate) || Infinity) || ms < (toMs(today) || 0);
    
    // Sort visually so start is always left and end is right
    const rStart = startDate && endDate && (toMs(startDate) || 0) > (toMs(endDate) || 0) ? endDate : startDate;
    const rEnd = startDate && endDate && (toMs(startDate) || 0) > (toMs(endDate) || 0) ? startDate : endDate;

    const isStart = sameDay(thisDate, rStart);
    const isEnd = rEnd && sameDay(thisDate, rEnd);
    const isMid = rStart && rEnd && ms > (toMs(rStart) || 0) && ms < (toMs(rEnd) || 0);

    return { isDisabled, isStart, isEnd, isMid };
  };

  const hasSelection = startDate !== null; // Active on ANY selection, doesn't need to be a full range

  // Date Feedback Component Logic
  let feedbackText = "Select a date";
  if (startDate) {
    if (!endDate || startDate.getTime() === endDate.getTime()) {
      feedbackText = fmt(startDate);
    } else {
      const firstDate = startDate.getTime() < endDate.getTime() ? startDate : endDate;
      const secondDate = startDate.getTime() < endDate.getTime() ? endDate : startDate;
      feedbackText = `${fmt(firstDate)} - ${fmt(secondDate)}`;
    }
  }

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
            className="absolute bottom-0 left-0 w-full z-[150] bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)]"
          >
            <div className="w-full flex flex-col px-0">
              {/* Drag Handle */}
              <div className="w-full flex justify-center px-[16px]">
                <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />
              </div>

              {/* Header */}
              <div className="w-full flex items-center justify-between px-[16px] mb-[16px]">
                <div className="w-[48px]" />
                <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                  Select Date
                </h3>
                <button
                  onClick={onClose}
                  className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors"
                >
                  <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
                </button>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#e0dce3]" />

              {/* Date Feedback Label */}
              <div className="w-full flex items-center justify-center py-[12px] mb-[12px] min-h-[44px] border-b border-black/5">
                <span className="font-['Nunito'] font-medium text-[#171519] text-[16px] leading-[24px]">
                  {feedbackText}
                </span>
              </div>

              {/* Scroll Area */}
              <div className="w-full max-h-[400px] overflow-y-auto px-0 modal-scrollbar relative">
                {months.map(({ year, month }, idx) => {
                  const firstDow = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const blanks = Array.from({ length: firstDow });
                  const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);

                  return (
                    <div key={idx} className="w-full flex flex-col items-center mb-[24px] px-[16px]">
                      <h4 className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px] tracking-[0.1px] mb-[16px] uppercase">
                        {MONTH_NAMES[month]} {year}
                      </h4>
                      
                      {/* DOW Row */}
                      <div className="w-full grid grid-cols-7 mb-[8px]">
                        {DOW.map((n, i) => (
                          <div key={`dow-${idx}-${i}`} className="flex items-center justify-center font-['Nunito'] font-bold text-[#171519] text-[14px] leading-[20px] tracking-[1px] h-[44px]">
                            {n}
                          </div>
                        ))}
                      </div>

                      {/* Days Grid */}
                      <div className="w-full grid grid-cols-7 gap-y-[0px]">
                        {blanks.map((_, i) => <div key={`blank-${idx}-${i}`} className="h-[44px]" />)}
                        
                        {days.map((day) => {
                          const { isDisabled, isStart, isEnd, isMid } = getDayClass(year, month, day);

                          // Logic for text and inner circle
                          let textClass = "text-[#171519]";
                          let innerCircleClass = "bg-transparent";
                          if (isDisabled) {
                            textClass = "text-[#c0bcc3]";
                          } else if (isStart || isEnd) {
                            textClass = "text-[#f0edf4]";
                            innerCircleClass = "bg-[#b7812f]";
                          }

                          return (
                            <div 
                              key={`day-${idx}-${day}`} 
                              className={`relative h-[44px] flex items-center justify-center ${isDisabled ? "cursor-default pointer-events-none" : "cursor-pointer"}`}
                              onClick={() => handleDayClick(year, month, day)}
                            >
                              {/* Background for range */}
                              {isMid && <div className="absolute inset-y-0 w-full bg-[#f4dcbf]" />}
                              {isStart && !isEnd && (startDate && endDate) && <div className="absolute inset-y-0 right-0 w-[50%] bg-[#f4dcbf]" />}
                              {isEnd && !isStart && (startDate && endDate) && <div className="absolute inset-y-0 left-0 w-[50%] bg-[#f4dcbf]" />}
                              
                              {/* Inner Circle and Text */}
                              <div className={`relative z-10 w-[44px] h-[44px] rounded-full flex items-center justify-center font-['Nunito'] font-semibold text-[16px] leading-[24px] tracking-[0.1px] transition-colors duration-150 ${innerCircleClass} ${textClass} ${!isDisabled && !isStart && !isEnd ? "hover:bg-black/5" : ""}`}>
                                {day}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-between px-[16px] mt-[16px]">
                <button 
                  onClick={clearAll}
                  className="px-[16px] py-[12px] h-[48px] flex items-center justify-center"
                >
                  <span className="font-['Nunito'] font-bold text-[#a09da3] text-[16px] leading-[24px]">
                    Clear all
                  </span>
                </button>
                <button 
                  disabled={!hasSelection}
                  onClick={() => {
                    if (hasSelection && startDate) {
                      onApply(startDate, endDate || startDate);
                    }
                  }}
                  className={`px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] flex items-center justify-center transition-colors ${
                    hasSelection ? "bg-[#171519] text-[#fbf6ff] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[#2f2c32]" : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
                  }`}
                >
                  <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
                    Apply
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
