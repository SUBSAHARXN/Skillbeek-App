import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { CloseIcon } from "../../../components/common/Icons";

export interface SpecificDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: Date, end: Date) => void;
  mode?: "single" | "range";
  initialRange?: { start: Date; end: Date } | null;
  disabledRanges?: { start: Date; end: Date }[];
  isDateAllowed?: (date: Date) => boolean;
  zIndex?: number;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

export function SpecificDatesModal({ isOpen, onClose, onApply, mode = "range", initialRange, disabledRanges, isDateAllowed, zIndex }: SpecificDatesModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setStartDate(initialRange ? initialRange.start : null);
      setEndDate(initialRange ? initialRange.end : null);
    }
  }, [initialRange, isOpen]);

  // Memoize limits so they don't recalculate on every render
  const { today, maxDate } = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const m = new Date(t);
    m.setDate(m.getDate() + 90);
    return { today: t, maxDate: m };
  }, []);

  const getMidnightMs = (d: Date | string | null) => {
    if (!d) return 0;
    const date = new Date(d);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  };

  const sameDay = (a: Date | string | null, b: Date | string | null) => {
    if (!a || !b) return false;
    return getMidnightMs(a) === getMidnightMs(b);
  };

  const toMs = (d: Date | null) => (d ? d.getTime() : null);
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
    
    // Check built-in limits (today/90 days)
    if (msSel > (toMs(maxDate) || Infinity) || msSel < (toMs(today) || 0)) return;
    
    // Check custom constraints
    if (isDateAllowed && !isDateAllowed(sel)) return;

    // Check disabled ranges (already selected)
    const isAlreadySelected = disabledRanges?.some(range => {
      const startMs = getMidnightMs(range.start);
      const endMs = getMidnightMs(range.end);
      return msSel >= startMs && msSel <= endMs;
    });
    if (isAlreadySelected) return;

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
    if (ms === null) return { isDisabled: true, isStart: false, isEnd: false, isMid: false, isAlreadySelected: false };

    const isOutOfRange = ms > (toMs(maxDate) || Infinity) || ms < (toMs(today) || 0) || (isDateAllowed && !isDateAllowed(thisDate));
    
    const isAlreadySelected = disabledRanges?.some(range => {
      const startMs = getMidnightMs(range.start);
      const endMs = getMidnightMs(range.end);
      return ms >= startMs && ms <= endMs;
    }) || false;

    const isAlreadyStart = disabledRanges?.some(range => sameDay(thisDate, range.start)) || false;
    const isAlreadyEnd = disabledRanges?.some(range => sameDay(thisDate, range.end)) || false;
    const isAlreadyMid = isAlreadySelected && !isAlreadyStart && !isAlreadyEnd;

    const isDisabled = isOutOfRange || isAlreadySelected;
    
    // Sort visually so start is always left and end is right
    const rStart = startDate && endDate && (toMs(startDate) || 0) > (toMs(endDate) || 0) ? endDate : startDate;
    const rEnd = startDate && endDate && (toMs(startDate) || 0) > (toMs(endDate) || 0) ? startDate : endDate;

    const isStart = sameDay(thisDate, rStart);
    const isEnd = rEnd && sameDay(thisDate, rEnd);
    const isMid = rStart && rEnd && ms > (toMs(rStart) || 0) && ms < (toMs(rEnd) || 0);

    return { isDisabled, isStart, isEnd, isMid, isAlreadySelected, isAlreadyStart, isAlreadyEnd, isAlreadyMid };
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
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Select Date"
      zIndex={zIndex}
      style={{}} // Ensure no maxHeight constraint if they want it to fit content
    >
      <div className="w-full flex flex-col px-0">

              {/* Date Feedback Label */}
              <div className="w-full flex items-center justify-center py-[12px] mb-[12px] min-h-[44px] border-b border-black/5">
                <span className="font-['Nunito'] font-medium text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                  {feedbackText}
                </span>
              </div>

              {/* Scroll Area with Fade Overlays */}
              <div className="relative w-full">
                {/* Top Scroll Fade */}
                <div className="absolute top-0 left-0 right-0 h-[32px] bg-gradient-to-b from-[var(--Surface-UI-surface-Background)] to-transparent pointer-events-none z-20" />

                {/* Scroll Area */}
                <div className="w-full max-h-[400px] overflow-y-auto px-0 modal-scrollbar relative pt-[8px] pb-[8px]">
                  {months.map(({ year, month }, idx) => {
                    const firstDow = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const blanks = Array.from({ length: firstDow });
                    const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);

                    return (
                      <div key={idx} className="w-full flex flex-col items-center mb-[24px] px-[16px]">
                        <h4 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px] tracking-[0.1px] mb-[16px] uppercase">
                          {MONTH_NAMES[month]} {year}
                        </h4>
                        
                        {/* DOW Row */}
                        <div className="w-full grid grid-cols-7 mb-[8px]">
                          {DOW.map((n, i) => (
                            <div key={`dow-${idx}-${i}`} className="flex items-center justify-center font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[14px] leading-[20px] tracking-[1px] h-[44px]">
                              {n}
                            </div>
                          ))}
                        </div>

                        {/* Days Grid */}
                        <div className="w-full grid grid-cols-7 gap-y-[0px]">
                          {blanks.map((_, i) => <div key={`blank-${idx}-${i}`} className="h-[44px]" />)}
                          
                          {days.map((day) => {
                            const { isDisabled, isStart, isEnd, isMid, isAlreadySelected, isAlreadyStart, isAlreadyEnd, isAlreadyMid } = getDayClass(year, month, day);

                            const dow = (firstDow + day - 1) % 7;
                            const isLeftEdge = dow === 0;
                            const isRightEdge = dow === 6;

                            // Logic for text and inner circle
                            let textClass = "text-[var(--Text-Primary-heading-1)]";
                            let innerCircleClass = "bg-transparent";
                            if (isDisabled && !isAlreadySelected) {
                              textClass = "text-[var(--Text-Primary-Caption-alt)]";
                            } else if (isStart || isEnd) {
                              textClass = "text-[var(--Text-Primary-Title-alt)]";
                              innerCircleClass = "bg-[var(--Button-Primary-Surface-default)]";
                            } else if (isAlreadySelected) {
                              textClass = "text-[var(--Text-Primary-heading-1)]/50";
                            }

                            return (
                              <div 
                                key={`day-${idx}-${day}`} 
                                className={`relative h-[44px] flex items-center justify-center ${isDisabled ? "cursor-default pointer-events-none" : "cursor-pointer"}`}
                                onClick={() => handleDayClick(year, month, day)}
                              >
                                {/* Background for already selected range (previously saved) - solid rectangle fill with edge fades */}
                                {isAlreadySelected && (
                                  <div className={`absolute inset-y-0 w-full ${isLeftEdge ? 'bg-gradient-to-r from-transparent to-[var(--Text-Primary-Text-brand)]/10' : isRightEdge ? 'bg-gradient-to-r from-[var(--Text-Primary-Text-brand)]/10 to-transparent' : 'bg-[var(--Button-Primary-Surface-default)]/10'}`} />
                                )}

                                {/* Background for active selection range with edge fades */}
                                {isMid && (
                                  <div className={`absolute inset-y-0 w-full ${isLeftEdge ? 'bg-gradient-to-r from-transparent to-[var(--Surface-UI-surface-Surface-Universal-highlighter)]' : isRightEdge ? 'bg-gradient-to-r from-[var(--Surface-UI-surface-Surface-Universal-highlighter)] to-transparent' : 'bg-[var(--Surface-UI-surface-Surface-Universal-highlighter)]'}`} />
                                )}
                                {isStart && !isEnd && (startDate && endDate) && (
                                  <div className={`absolute inset-y-0 right-0 w-[50%] ${isRightEdge ? 'bg-gradient-to-r from-[var(--Surface-UI-surface-Surface-Universal-highlighter)] to-transparent' : 'bg-[var(--Surface-UI-surface-Surface-Universal-highlighter)]'}`} />
                                )}
                                {isEnd && !isStart && (startDate && endDate) && (
                                  <div className={`absolute inset-y-0 left-0 w-[50%] ${isLeftEdge ? 'bg-gradient-to-r from-transparent to-[var(--Surface-UI-surface-Surface-Universal-highlighter)]' : 'bg-[var(--Surface-UI-surface-Surface-Universal-highlighter)]'}`} />
                                )}
                                
                                {/* Inner Circle and Text */}
                                <div className={`relative z-10 w-[44px] h-[44px] rounded-full flex items-center justify-center font-['Nunito'] font-semibold text-[16px] leading-[24px] tracking-[0.1px] transition-colors duration-150 ${innerCircleClass} ${textClass} ${!isDisabled && !isStart && !isEnd ? "hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)]" : ""}`}>
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

                {/* Bottom Scroll Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-[32px] bg-gradient-to-t from-[var(--Surface-UI-surface-Background)] to-transparent pointer-events-none z-20" />
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-between px-[16px] mt-[16px]">
                <button 
                  onClick={clearAll}
                  className="px-[16px] py-[12px] h-[48px] flex items-center justify-center"
                >
                  <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-placeholder)] text-[16px] leading-[24px]">
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
                    hasSelection ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)]" : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
                  }`}
                >
                  <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
                    Apply
                  </span>
                </button>
              </div>
            </div>
    </BottomSheet>
  );
}
