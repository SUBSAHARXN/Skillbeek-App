import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, CalendarIcon, ClockIcon } from "../../../components/common/Icons";
import { AvailabilityData, getRecurringDaysText, getSpecificDatesText } from "../steps/AvailabilityView";

interface LiveAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  availability: AvailabilityData | null;
}

export function LiveAvailabilityModal({
  isOpen,
  onClose,
  availability,
}: LiveAvailabilityModalProps) {
  if (!availability) return null;

  const isRecurring = availability.type === "Recurring Weekly";
  const slots = isRecurring ? availability.recurringSlots : availability.specificSlots;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2f2c32]/[0.26] z-[500] backdrop-blur-[4px] rounded-[32px]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full z-[510] bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] max-h-[90%]"
          >
            {/* Handle */}
            <div className="w-full flex justify-center">
              <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />
            </div>

            <div className="w-full flex flex-col gap-[24px]">
              {/* Header */}
              <div className="flex flex-col gap-[16px] relative px-[16px]">
                <div className="flex items-center justify-center">
                  <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                    Availability
                  </h3>
                  <button
                    onClick={onClose}
                    className="absolute right-[16px] w-[48px] h-[48px] rounded-[32px] flex items-center justify-center bg-[#fbf6ff] hover:bg-[#f0edf4] transition-colors"
                  >
                    <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
                  </button>
                </div>
                <div className="w-full h-[1px] bg-[#e0dce3]" />
              </div>

              {/* Slots List */}
              <div className="flex flex-col gap-[24px] w-full max-h-[400px] overflow-y-auto px-[16px] pb-[24px] modal-scrollbar">
                {slots.map((slot, index) => {
                  return (
                    <div key={index} className="flex flex-col gap-[16px]">
                      {isRecurring ? (
                        // Recurring Weekly layout
                        <>
                          {/* Calendar card */}
                          <div className="flex items-center gap-[12px] bg-[#fbf6ff] border border-[#f0edf4] rounded-[16px] p-[16px] w-full">
                            <CalendarIcon className="w-[24px] h-[24px] text-[#171519] shrink-0" />
                            <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px]">
                              {getRecurringDaysText((slot as any).days)}
                            </span>
                          </div>

                          {/* Time card */}
                          <div className="flex items-center gap-[12px] bg-[#fbf6ff] border border-[#f0edf4] rounded-[16px] p-[16px] w-full">
                            <ClockIcon className="w-[24px] h-[24px] text-[#171519] shrink-0" />
                            <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px]">
                              {slot.timeRange.start} - {slot.timeRange.end}
                            </span>
                          </div>
                        </>
                      ) : (
                        // Specific Dates layout
                        <>
                          <span className="font-['Nunito'] font-bold text-[#656268] text-[14px] leading-[20px] uppercase tracking-[0.5px]">
                            Available on
                          </span>
                          
                          {/* Calendar card */}
                          <div className="flex items-center gap-[12px] bg-[#fbf6ff] border border-[#f0edf4] rounded-[16px] p-[16px] w-full">
                            <CalendarIcon className="w-[24px] h-[24px] text-[#171519] shrink-0" />
                            <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px]">
                              {getSpecificDatesText((slot as any).dateRange)}
                            </span>
                          </div>

                          {/* Time card */}
                          <div className="flex items-center gap-[12px] bg-[#fbf6ff] border border-[#f0edf4] rounded-[16px] p-[16px] w-full">
                            <ClockIcon className="w-[24px] h-[24px] text-[#171519] shrink-0" />
                            <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px]">
                              {slot.timeRange.start} - {slot.timeRange.end}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Divider line between slots */}
                      {index < slots.length - 1 && (
                        <div className="w-full h-[1px] bg-[#e0dce3] my-[8px]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
