import React, { useState, useEffect } from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { Button } from "../../../components/ui/Button";
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
  zIndex?: number;
}

export function EditAvailabilityModal({ isOpen, onClose, availability, onApply, zIndex = 500 }: EditAvailabilityModalProps) {
  const [localData, setLocalData] = useState<AvailabilityData>({
    type: "Recurring Weekly",
    recurringSlots: [],
    specificSlots: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  useEffect(() => {
    if (isOpen && availability) {
      setLocalData(availability);
      const noSlots = availability.type === "Recurring Weekly" 
        ? availability.recurringSlots.length === 0 
        : availability.specificSlots.length === 0;
      
      if (noSlots) {
        if (availability.type === "Recurring Weekly") {
          setIsRecurringOpen(true);
        } else {
          setIsSpecificOpen(true);
        }
      }
    } else if (!isOpen) {
      setIsRecurringOpen(false);
      setIsSpecificOpen(false);
      setIsTimePickerOpen(false);
      setEditingSlotIndex(null);
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
    if (editingSlotIndex !== null) {
      // If editing an existing slot, update it directly and close
      setLocalData(prev => {
        const next = { ...prev, recurringSlots: [...prev.recurringSlots] };
        next.recurringSlots[editingSlotIndex] = { 
          ...next.recurringSlots[editingSlotIndex], 
          days 
        };
        return next;
      });
      setIsRecurringOpen(false);
      setEditingSlotIndex(null);
    } else {
      // If adding a new slot, keep the flow to time picker
      setPendingDays(days);
      setIsRecurringOpen(false);
      setIsTimePickerOpen(true);
    }
  };

  const handleDateRangeApply = (start: Date, end: Date) => {
    const dateRange = { start, end };
    if (editingSlotIndex !== null) {
      setLocalData(prev => {
        const next = { ...prev, specificSlots: [...prev.specificSlots] };
        next.specificSlots[editingSlotIndex] = { 
          ...next.specificSlots[editingSlotIndex], 
          dateRange 
        };
        return next;
      });
      setIsSpecificOpen(false);
      setEditingSlotIndex(null);
    } else {
      setPendingDateRange(dateRange);
      setIsSpecificOpen(false);
      setIsTimePickerOpen(true);
    }
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
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Select Days"
        style={{ height: "85%" }}
        zIndex={zIndex}
      >
        <div className="w-full flex flex-col px-0 h-full overflow-hidden">
          <div 
            className="w-full min-w-full flex flex-col gap-[0px] flex-1 overflow-y-auto mb-[32px] modal-scrollbar"
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
                  <PlusIcon className="w-[20px] h-[20px] text-[var(--Text-Primary-heading-1)]" />
                  <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                    Add more hours
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="w-full flex items-center justify-between mt-[16px] px-[16px]">
            <Button variant="ghost" onClick={handleClearAll}>
              Clear all
            </Button>
            <Button
              variant="primary"
              className="min-w-[101px]"
              onClick={handleApply}
              disabled={!hasSlots}
            >
              Apply
            </Button>
          </div>
        </div>
      </BottomSheet>

      <RecurringWeeklyModal isOpen={isRecurringOpen} onClose={() => setIsRecurringOpen(false)} onApply={handleDaysApply} disabledDays={usedDaysExcludingEdited} initialDays={pendingDays} zIndex={zIndex + 100} />
      <SpecificDatesModal 
        isOpen={isSpecificOpen} 
        onClose={() => setIsSpecificOpen(false)} 
        onApply={handleDateRangeApply} 
        initialRange={pendingDateRange}
        disabledRanges={usedDateRangesExcludingEdited}
        zIndex={zIndex + 100}
      />
      <TimePickerModal isOpen={isTimePickerOpen} onClose={() => setIsTimePickerOpen(false)} onApply={handleTimeApply} zIndex={zIndex + 100} />
    </>
  );
}
