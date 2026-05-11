import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, PlusIcon } from "../../../components/common/Icons";
import { AvailabilityData, RecurringSlot, SpecificSlot, DAY_ORDER, getRecurringDaysText, getSpecificDatesText, SlotCard } from "../steps/AvailabilityView";
import { RecurringWeeklyModal } from "./RecurringWeeklyModal";
import { SpecificDatesModal } from "./SpecificDatesModal";
import { TimePickerModal } from "./TimePickerModal";
import { NeumorphicDivider } from "../../../components/common/NeumorphicDivider";

interface EditAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  availability: AvailabilityData | null;
  onApply: (data: AvailabilityData) => void;
}

export function EditAvailabilityModal({ isOpen, onClose, availability, onApply }: EditAvailabilityModalProps) {
  const [localData, setLocalData] = useState<AvailabilityData>({
    type: "Recurring Weekly",
    recurringSlots: [],
    specificSlots: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  useEffect(() => {
    if (isOpen && availability) {
      setLocalData(availability);
    }
  }, [isOpen, availability]);

  // Sub-modal states
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);
  const [isSpecificOpen, setIsSpecificOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // Pending edits
  const [pendingDays, setPendingDays] = useState<string[]>([]);
  const [pendingDateRange, setPendingDateRange] = useState<{ start: Date; end: Date } | null>(null);

  const hasSlots = localData.type === "Recurring Weekly" ? localData.recurringSlots.length > 0 : localData.specificSlots.length > 0;
  
  const usedDaysExcludingEdited = localData.recurringSlots
    .filter((_, i) => i !== editingSlotIndex)
    .flatMap(s => s.days);
  const remainingDays = DAY_ORDER.filter((d: string) => !usedDaysExcludingEdited.includes(d));
  const canAddMore = localData.type === "Recurring Weekly" ? remainingDays.length > 0 : true;

  const usedDateRangesExcludingEdited = localData.specificSlots
    .filter((_, i) => i !== editingSlotIndex)
    .map(s => s.dateRange);

  const handleClearAll = () => {
    setLocalData(prev => ({
      ...prev,
      recurringSlots: [],
      specificSlots: []
    }));
  };

  const handleApply = () => {
    onApply(localData);
  };

  const handleDeleteSlot = (index: number) => {
    if (localData.type === "Recurring Weekly") {
      setLocalData(prev => ({ ...prev, recurringSlots: prev.recurringSlots.filter((_, i) => i !== index) }));
    } else {
      setLocalData(prev => ({ ...prev, specificSlots: prev.specificSlots.filter((_, i) => i !== index) }));
    }
  };

  const handleAddMore = () => {
    setEditingSlotIndex(null);
    setPendingDays([]);
    setPendingDateRange(null);
    if (localData.type === "Recurring Weekly") setIsRecurringOpen(true);
    else setIsSpecificOpen(true);
  };

  const handleEditDays = (index: number) => {
    setEditingSlotIndex(index);
    if (localData.type === "Recurring Weekly") {
      setPendingDays(localData.recurringSlots[index].days);
      setIsRecurringOpen(true);
    } else {
      setPendingDateRange(localData.specificSlots[index].dateRange);
      setIsSpecificOpen(true);
    }
  };

  const handleEditTime = (index: number) => {
    setEditingSlotIndex(index);
    setIsTimePickerOpen(true);
  };

  const handleDaysApply = (days: string[]) => {
    setPendingDays(days);
    setIsRecurringOpen(false);
    setIsTimePickerOpen(true);
  };

  const handleDateRangeApply = (start: Date, end: Date) => {
    setPendingDateRange({ start, end });
    setIsSpecificOpen(false);
    setIsTimePickerOpen(true);
  };

  const handleTimeApply = (start: string, end: string) => {
    const timeRange = { start, end };
    if (localData.type === "Recurring Weekly") {
      setLocalData(prev => {
        const next = { ...prev, recurringSlots: [...prev.recurringSlots] };
        if (editingSlotIndex !== null) {
          next.recurringSlots[editingSlotIndex] = { days: pendingDays.length > 0 ? pendingDays : next.recurringSlots[editingSlotIndex].days, timeRange };
        } else {
          next.recurringSlots.push({ days: pendingDays, timeRange });
        }
        return next;
      });
    } else {
      setLocalData(prev => {
        const next = { ...prev, specificSlots: [...prev.specificSlots] };
        if (editingSlotIndex !== null) {
          next.specificSlots[editingSlotIndex] = { dateRange: pendingDateRange ?? next.specificSlots[editingSlotIndex].dateRange, timeRange };
        } else {
          next.specificSlots.push({ dateRange: pendingDateRange!, timeRange });
        }
        return next;
      });
    }
    setPendingDays([]);
    setPendingDateRange(null);
    setEditingSlotIndex(null);
    setIsTimePickerOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 z-[120] bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
            />
            <motion.div
              key="bottom-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full z-[130] bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              <div className="w-full flex flex-col px-0">
                <div className="w-full flex justify-center px-[16px]">
                  <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />
                </div>
                
                <div className="w-full flex items-center justify-center relative mb-[16px] h-[24px] px-[16px]">
                  <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                    Select Days
                  </h3>
                  <button
                    onClick={onClose}
                    className="absolute right-[16px] w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-gray-200 transition-colors"
                  >
                    <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
                  </button>
                </div>
                
                <div className="w-full px-[16px]">
                  <NeumorphicDivider />
                </div>

                <div 
                  className="w-full min-w-full flex flex-col gap-[0px] max-h-[500px] overflow-y-auto mb-[32px] modal-scrollbar"
                >
                  {localData.type === "Recurring Weekly" && localData.recurringSlots.map((slot, i) => (
                    <React.Fragment key={i}>
                      <div className="px-[16px]">
                        <SlotCard
                          label="Available days"
                          daysText={getRecurringDaysText(slot.days)}
                          timeText={`${slot.timeRange.start} – ${slot.timeRange.end}`}
                          isRecurring={true}
                          onEditDays={() => handleEditDays(i)}
                          onEditTime={() => handleEditTime(i)}
                          onDelete={() => handleDeleteSlot(i)}
                        />
                      </div>
                      {i < localData.recurringSlots.length - 1 && (
                        <div className="px-[16px]">
                          <NeumorphicDivider />
                        </div>
                      )}
                    </React.Fragment>
                  ))}

                  {localData.type === "Specific Dates" && localData.specificSlots.map((slot, i) => (
                    <React.Fragment key={i}>
                      <div className="px-[16px]">
                        <SlotCard
                          label="Available dates"
                          daysText={getSpecificDatesText(slot.dateRange)}
                          timeText={`${slot.timeRange.start} – ${slot.timeRange.end}`}
                          isRecurring={false}
                          onEditDays={() => handleEditDays(i)}
                          onEditTime={() => handleEditTime(i)}
                          onDelete={() => handleDeleteSlot(i)}
                        />
                      </div>
                      {i < localData.specificSlots.length - 1 && (
                        <div className="px-[16px]">
                          <NeumorphicDivider />
                        </div>
                      )}
                    </React.Fragment>
                  ))}

                  {canAddMore && (
                    <div className="px-[16px]">
                      <button onClick={handleAddMore} className="flex items-center gap-[8px] py-[12px] hover:opacity-70 transition-opacity w-fit mt-[8px]">
                        <PlusIcon className="w-[20px] h-[20px] text-[#171519]" />
                        <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px]">
                          Add more hours
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full flex items-center justify-between mt-[16px] px-[16px]">
                  <button onClick={handleClearAll} className="px-[16px] py-[12px] h-[48px] flex items-center justify-center">
                    <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] underline leading-[24px]">
                      Clear all
                    </span>
                  </button>
                  <button onClick={handleApply} disabled={!hasSlots} className={`px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] flex items-center justify-center transition-colors ${hasSlots ? "bg-[#171519] text-[#fbf6ff] hover:bg-[#2f2c32] shadow-[0px_1px_3px_rgba(18,9,0,0.1)]" : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"}`}>
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

      <RecurringWeeklyModal isOpen={isRecurringOpen} onClose={() => setIsRecurringOpen(false)} onApply={handleDaysApply} disabledDays={usedDaysExcludingEdited} initialDays={pendingDays} />
      <SpecificDatesModal 
        isOpen={isSpecificOpen} 
        onClose={() => setIsSpecificOpen(false)} 
        onApply={handleDateRangeApply} 
        initialRange={pendingDateRange}
        disabledRanges={usedDateRangesExcludingEdited}
      />
      <TimePickerModal isOpen={isTimePickerOpen} onClose={() => setIsTimePickerOpen(false)} onApply={handleTimeApply} />
    </>
  );
}
