import React from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
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
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Availability">
      {/* Slots List */}
      <div className="flex flex-col gap-[24px] w-full max-h-[400px] overflow-y-auto px-[16px] pb-[24px] pt-[24px] modal-scrollbar">
        {slots.map((slot, index) => {
          return (
            <div key={index} className="flex flex-col gap-[16px]">
              {isRecurring ? (
                // Recurring Weekly layout
                <>
                  {/* Calendar card */}
                  <div className="flex items-center gap-[12px] bg-[var(--Surface-Primary-Background)] border border-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[16px] w-full">
                    <CalendarIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)] shrink-0" />
                    <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                      {getRecurringDaysText((slot as any).days)}
                    </span>
                  </div>

                  {/* Time card */}
                  <div className="flex items-center gap-[12px] bg-[var(--Surface-Primary-Background)] border border-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[16px] w-full">
                    <ClockIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)] shrink-0" />
                    <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                      {slot.timeRange.start} - {slot.timeRange.end}
                    </span>
                  </div>
                </>
              ) : (
                // Specific Dates layout
                <>
                  <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-[14px] leading-[20px] uppercase tracking-[0.5px]">
                    Available on
                  </span>
                  
                  {/* Calendar card */}
                  <div className="flex items-center gap-[12px] bg-[var(--Surface-Primary-Background)] border border-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[16px] w-full">
                    <CalendarIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)] shrink-0" />
                    <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                      {getSpecificDatesText((slot as any).dateRange)}
                    </span>
                  </div>

                  {/* Time card */}
                  <div className="flex items-center gap-[12px] bg-[var(--Surface-Primary-Background)] border border-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[16px] w-full">
                    <ClockIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)] shrink-0" />
                    <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                      {slot.timeRange.start} - {slot.timeRange.end}
                    </span>
                  </div>
                </>
              )}

              {/* Divider line between slots */}
              {index < slots.length - 1 && (
                <div className="w-full h-[1px] bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] my-[8px]" />
              )}
            </div>
          );
        })}
      </div>
    </BottomSheet>
  );
}
