import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, ChevronDownIcon, ClockIcon, PencilIcon, PlusIcon, CloseIcon } from "../../../components/common/Icons";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { AvailabilityTypeModal } from "../components/AvailabilityTypeModal";
import { RecurringWeeklyModal } from "../components/RecurringWeeklyModal";
import { SpecificDatesModal } from "../components/SpecificDatesModal";
import { TimePickerModal } from "../components/TimePickerModal";
import { TimezoneModal } from "../components/TimezoneModal";

// ─── Day helpers ──────────────────────────────────────────────────────────────
export const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_ABBR: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu",
  Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

export const getRecurringDaysText = (days: string[]) => {
  if (!days || days.length === 0) return "Select days";
  const sorted = [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));

  if (sorted.length === 7) return "Every day";

  const isWeekdays = sorted.length === 5 && ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].every(d => sorted.includes(d));
  if (isWeekdays) return "Weekdays";

  const isWeekends = sorted.length === 2 && ["Saturday", "Sunday"].every(d => sorted.includes(d));
  if (isWeekends) return "Weekends";

  // New logic: 1-2 days show full spelling, 3+ days use abbreviations
  if (sorted.length <= 2) {
    return sorted.join(", ");
  }

  const abbrs = sorted.map(d => DAY_ABBR[d] ?? d.substring(0, 3));
  if (abbrs.length > 3) {
    return `${abbrs.slice(0, 3).join(", ")} +${abbrs.length - 3}`;
  }
  return abbrs.join(", ");
};

export const getSpecificDatesText = (range: { start: Date; end: Date } | null) => {
  if (!range) return "Select dates";
  const fmt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const s = range.start.toLocaleDateString("en-US", fmt);
  const e = range.end.toLocaleDateString("en-US", fmt);
  return s === e ? s : `${s} – ${e}`;
};

// ─── Data types ───────────────────────────────────────────────────────────────
export interface RecurringSlot {
  days: string[];
  timeRange: { start: string; end: string };
}
export interface SpecificSlot {
  dateRange: { start: Date; end: Date };
  timeRange: { start: string; end: string };
}

export interface AvailabilityData {
  type: string | null;
  recurringSlots: RecurringSlot[];
  specificSlots: SpecificSlot[];
  timezone: string;
}

// ─── NeumorphicDivider (project-wide pattern) ─────────────────────────────────
function NeumorphicDivider() {
  return (
    <div className="w-full flex items-center justify-center my-[16px]">
      <div
        className="w-full h-[2px] rounded-full bg-[var(--Surface-Primary-Background)]"
        style={{ boxShadow: "inset 2px 2px 12px rgba(192, 188, 195, 0.5), inset -2px -2px 12px rgba(255, 255, 255, 0.9)" }}
      />
    </div>
  );
}

// ─── Slot card ────────────────────────────────────────────────────────────────
export function SlotCard({
  label,
  daysText,
  timeText,
  isRecurring,
  onEditDays,
  onEditTime,
  onDelete,
}: {
  label: string;
  daysText: string;
  timeText: string;
  isRecurring: boolean;
  onEditDays: () => void;
  onEditTime: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      {/* Slot header with per-slot delete */}
      <div className="flex items-center justify-end">
        <button
          onClick={onDelete}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
          title="Remove this schedule"
        >
          <CloseIcon className="w-[16px] h-[16px] text-[var(--Text-Primary-Text-placeholder)]" />
        </button>
      </div>
      <div
        onClick={onEditDays}
        className="bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] rounded-[12px] px-[16px] py-[24px] flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-[6px]">
          <CalendarIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
        </div>
        <div className="flex items-center gap-[8px]">
          <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
            {(() => {
              const match = daysText.match(/^(.+?)(\s\+\d+)$/);
              return match
                ? <>{match[1]}<span className="font-bold">{match[2]}</span></>
                : daysText;
            })()}
          </span>
          <ChevronDownIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
        </div>
      </div>

      <div
        onClick={onEditTime}
        className="bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] rounded-[12px] px-[16px] py-[24px] flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-[6px]">
          <ClockIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
        </div>
        <div className="flex items-center gap-[8px]">
          <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
            {timeText}
          </span>
          <ChevronDownIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
        </div>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface AvailabilityViewProps {
  onBack?: () => void;
  onNext?: (data: AvailabilityData) => void;
  onSaveExit?: () => void;
  onQuestions?: () => void;
}

export function AvailabilityView({ onBack, onNext, onSaveExit, onQuestions }: AvailabilityViewProps) {
  // ── type selection ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availabilityType, setAvailabilityType] = useState<string | null>(null);

  // ── confirmed slots ──
  const [recurringSlots, setRecurringSlots] = useState<RecurringSlot[]>([]);
  const [specificSlots, setSpecificSlots] = useState<SpecificSlot[]>([]);

  // ── pending slot being built ──
  const [pendingDays, setPendingDays] = useState<string[]>([]);
  const [pendingDateRange, setPendingDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null); // null = new slot

  // ── modal open states ──
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isSpecificDatesModalOpen, setIsSpecificDatesModalOpen] = useState(false);
  const [isTimePickerModalOpen, setIsTimePickerModalOpen] = useState(false);
  const [pendingStartTime, setPendingStartTime] = useState<string | undefined>();
  const [pendingEndTime, setPendingEndTime] = useState<string | undefined>();

  // ── timezone ──
  const [timezone, setTimezone] = useState("");
  const [isTimezoneModalOpen, setIsTimezoneModalOpen] = useState(false);

  useEffect(() => {
    try { setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone); }
    catch { setTimezone("UTC"); }
  }, []);

  // ── computed ──
  const hasSlots = availabilityType === "Recurring Weekly"
    ? recurringSlots.length > 0
    : specificSlots.length > 0;

  // Days already committed in OTHER slots (not the one being edited)
  const usedDaysExcludingEdited = recurringSlots
    .filter((_, i) => i !== editingSlotIndex)
    .flatMap(s => s.days);

  const remainingDays = DAY_ORDER.filter(d => !usedDaysExcludingEdited.includes(d));
  // Can add more only if there are still unused days (recurring) or always for specific dates
  const canAddMore = availabilityType === "Recurring Weekly"
    ? remainingDays.length > 0
    : true;

  const disabledDateRangesExcludingEdited = specificSlots
    .filter((_, i) => i !== editingSlotIndex)
    .map(s => s.dateRange);

  const timezoneLabel = timezone.split("/").slice(1).join(" ").replace(/_/g, " ") || timezone;

  // ── handlers ──
  const handleAddMore = () => {
    setEditingSlotIndex(null);
    setPendingDays([]);
    setPendingDateRange(null);
    setPendingStartTime(undefined);
    setPendingEndTime(undefined);
    if (availabilityType === "Recurring Weekly") {
      setIsRecurringModalOpen(true);
    } else {
      setIsSpecificDatesModalOpen(true);
    }
  };
  const handleEditSlotDays = (index: number) => {
    setEditingSlotIndex(index);
    if (availabilityType === "Recurring Weekly") {
      setPendingDays(recurringSlots[index].days);
      setPendingStartTime(recurringSlots[index].timeRange.start);
      setPendingEndTime(recurringSlots[index].timeRange.end);
      setIsRecurringModalOpen(true);
    } else {
      setPendingDateRange(specificSlots[index].dateRange);
      setPendingStartTime(specificSlots[index].timeRange.start);
      setPendingEndTime(specificSlots[index].timeRange.end);
      setIsSpecificDatesModalOpen(true);
    }
  };

  const handleEditSlotTime = (index: number) => {
    setEditingSlotIndex(index);
    if (availabilityType === "Recurring Weekly") {
      setPendingDays(recurringSlots[index].days);
      setPendingStartTime(recurringSlots[index].timeRange.start);
      setPendingEndTime(recurringSlots[index].timeRange.end);
    } else {
      setPendingDateRange(specificSlots[index].dateRange);
      setPendingStartTime(specificSlots[index].timeRange.start);
      setPendingEndTime(specificSlots[index].timeRange.end);
    }
    setIsTimePickerModalOpen(true);
  };

  const handleDaysApply = (days: string[]) => {
    const dayRemoved = pendingDays.some(d => !days.includes(d));
    if (dayRemoved) {
      setPendingStartTime(undefined);
      setPendingEndTime(undefined);
    }
    setPendingDays(days);
    setIsRecurringModalOpen(false);
    setIsTimePickerModalOpen(true);
  };

  const handleDateRangeApply = (start: Date, end: Date) => {
    // Check for date overlap with existing slots (excluding the one being edited)
    const newStart = start.getTime();
    const newEnd = end.getTime();
    const hasOverlap = specificSlots
      .filter((_, i) => i !== editingSlotIndex)
      .some(slot => {
        const s = slot.dateRange.start.getTime();
        const e = slot.dateRange.end.getTime();
        return newStart <= e && newEnd >= s;
      });

    if (hasOverlap) {
      // Close modal — user needs to pick non-overlapping dates
      setIsSpecificDatesModalOpen(false);
      alert("Those dates overlap with an existing schedule. Please choose different dates.");
      return;
    }

    setPendingDateRange({ start, end });
    setIsSpecificDatesModalOpen(false);
    setIsTimePickerModalOpen(true);
  };

  const handleTimeApply = (start: string, end: string) => {
    const timeRange = { start, end };

    if (availabilityType === "Recurring Weekly") {
      setRecurringSlots(prev => {
        const next = [...prev];
        if (editingSlotIndex !== null) {
          next[editingSlotIndex] = { days: pendingDays.length > 0 ? pendingDays : next[editingSlotIndex].days, timeRange };
        } else {
          next.push({ days: pendingDays, timeRange });
        }
        return next;
      });
    } else {
      setSpecificSlots(prev => {
        const next = [...prev];
        if (editingSlotIndex !== null) {
          next[editingSlotIndex] = { dateRange: pendingDateRange ?? next[editingSlotIndex].dateRange, timeRange };
        } else {
          next.push({ dateRange: pendingDateRange!, timeRange });
        }
        return next;
      });
    }

    setPendingDays([]);
    setPendingDateRange(null);
    setEditingSlotIndex(null);
    setIsTimePickerModalOpen(false);
  };

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]" />
      </div>

      {/* Header Action Buttons (Fixed at Top) */}
      <div className="w-full px-[16px] flex justify-between items-center py-[16px] shrink-0 bg-[var(--Surface-Primary-Background)] z-20">
        <button onClick={onSaveExit} className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]">
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">Save and Exit</span>
        </button>
        <button onClick={onQuestions} className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]">
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">Questions?</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 px-[16px] pt-[0px] overflow-y-auto availability-scrollbar">
        <div className="flex flex-col gap-[12px] mb-[24px]">
          <h1 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[36px] tracking-[-1.2px]">
            Set your availability
          </h1>
          <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
            Set your typical availability for this offer so partners know when to book.
          </p>
        </div>

        {/* Availability Type Selector — hidden once first slot is committed */}
        {!hasSlots && (
          <div
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] p-[24px] flex items-center justify-between shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] border border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)] cursor-pointer"
          >
            <div className="flex items-center gap-[6px]">
              <CalendarIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
              <span className="font-['Nunito'] font-medium text-[var(--Text-Primary-Subtitle)] text-[16px] leading-[24px]">
                {availabilityType === "Recurring Weekly" ? "Recurring days" : availabilityType === "Specific Dates" ? "Specific dates" : "availability type"}
              </span>
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">Choose</span>
              <ChevronDownIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
            </div>
          </div>
        )}

        {/* ── Confirmed slots section ── */}
        {hasSlots && (
          <div className="flex flex-col gap-[0px]">
            {/* Timezone */}
            <button
              onClick={() => setIsTimezoneModalOpen(true)}
              className="flex items-center gap-[6px] py-[4px] mb-[16px] cursor-pointer hover:opacity-70 transition-opacity w-fit"
            >
              <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-brand)] text-[16px] leading-[24px]">{timezoneLabel}</span>
              <PencilIcon className="w-[18px] h-[18px] text-[var(--Text-Primary-Text-brand)]" />
            </button>

            {/* "Available on" header — X just collapses back to type selector, doesn't wipe slots */}
            <div className="flex items-center justify-between mb-[12px]">
              <h2 className="font-['Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-[14px] leading-[20px] tracking-[1px] uppercase">
                Available on
              </h2>
            </div>

            {/* Slot cards separated by NeumorphicDivider */}
            {availabilityType === "Recurring Weekly"
              ? recurringSlots.map((slot, i) => (
                <React.Fragment key={i}>
                  <SlotCard
                    label="Available days"
                    daysText={getRecurringDaysText(slot.days)}
                    timeText={`${slot.timeRange.start} – ${slot.timeRange.end}`}
                    isRecurring={true}
                    onEditDays={() => handleEditSlotDays(i)}
                    onEditTime={() => handleEditSlotTime(i)}
                    onDelete={() => setRecurringSlots(prev => prev.filter((_, idx) => idx !== i))}
                  />
                  {i < recurringSlots.length - 1 && <NeumorphicDivider />}
                </React.Fragment>
              ))
              : specificSlots.map((slot, i) => (
                <React.Fragment key={i}>
                  <SlotCard
                    label="Available dates"
                    daysText={getSpecificDatesText(slot.dateRange)}
                    timeText={`${slot.timeRange.start} – ${slot.timeRange.end}`}
                    isRecurring={false}
                    onEditDays={() => handleEditSlotDays(i)}
                    onEditTime={() => handleEditSlotTime(i)}
                    onDelete={() => setSpecificSlots(prev => prev.filter((_, idx) => idx !== i))}
                  />
                  {i < specificSlots.length - 1 && <NeumorphicDivider />}
                </React.Fragment>
              ))
            }

            {/* Add more hours */}
            {canAddMore && (
              <button
                onClick={handleAddMore}
                className="flex items-center gap-[8px] mt-[16px] py-[12px] cursor-pointer hover:opacity-70 transition-opacity w-fit"
              >
                <PlusIcon className="w-[20px] h-[20px] text-[var(--Text-Primary-heading-1)]" />
                <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">Add more hours</span>
              </button>
            )}
          </div>
        )}
        {/* Bottom Spacer */}
        <div className="h-[156px] shrink-0" aria-hidden="true" />
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col items-center gap-[32px] pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={2} subStepProgress={0} />
        </div>
        <div className="w-full flex items-center justify-between px-[16px]">
          <button onClick={onBack} className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] underline">
            Back
          </button>
          <button
            onClick={() => onNext && onNext({ type: availabilityType, recurringSlots, specificSlots, timezone })}
            disabled={!hasSlots}
            className={`font-['Nunito'] font-bold text-[16px] leading-[24px] px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] transition-all ${hasSlots ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] cursor-pointer hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)]" : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]" />
      </div>

      {/* ── Modals ── */}
      <AvailabilityTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedType={availabilityType}
        onSelect={(type) => {
          setAvailabilityType(type);
          setIsModalOpen(false);
          if (type === "Recurring Weekly") setIsRecurringModalOpen(true);
          else setIsSpecificDatesModalOpen(true);
        }}
      />

      <RecurringWeeklyModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        onApply={handleDaysApply}
        initialDays={pendingDays}
        disabledDays={usedDaysExcludingEdited}
      />

      <SpecificDatesModal
        isOpen={isSpecificDatesModalOpen}
        onClose={() => setIsSpecificDatesModalOpen(false)}
        onApply={handleDateRangeApply}
        disabledRanges={disabledDateRangesExcludingEdited}
      />

      <TimePickerModal
        isOpen={isTimePickerModalOpen}
        onClose={() => setIsTimePickerModalOpen(false)}
        onApply={handleTimeApply}
        initialStartTime={pendingStartTime}
        initialEndTime={pendingEndTime}
      />

      <TimezoneModal
        isOpen={isTimezoneModalOpen}
        onClose={() => setIsTimezoneModalOpen(false)}
        selectedTimezone={timezone}
        onSelect={(tz) => { setTimezone(tz); setIsTimezoneModalOpen(false); }}
      />
    </div>
  );
}
