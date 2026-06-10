import React, { useMemo, useState } from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { Button } from "../../../components/ui/Button";
import { CloseIcon, ChevronRightIcon, ChevronLeftIcon, PlusIcon } from "../../../components/common/Icons";
import { SpecificDatesModal } from "./SpecificDatesModal";

import { FilterSkillsModal } from "./FilterSkillsModal";
import { FilterHighlightsModal } from "./FilterHighlightsModal";
import { StaticFlameIcon, StaticCodeTimerIcon, StaticCodeSparkleIcon } from "../steps/SkillDetailsView";

export type FilterKey = "dateRange" | "skill" | "highlights";

export interface FilterValues {
  dateRange: "last30" | "custom" | "";
  skills: string[];
  highlights: string;
}

interface FilterOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: FilterValues;
  onApply: (filters: FilterValues) => void;
}

export function FilterOffersModal({
  isOpen,
  onClose,
  initialFilters,
  onApply,
}: FilterOffersModalProps) {
  const [selectedDateRange, setSelectedDateRange] = useState<"last30" | "custom" | "">(
    initialFilters.dateRange
  );
  const [skills, setSkills] = useState<string[]>(initialFilters.skills);
  const [highlights, setHighlights] = useState(initialFilters.highlights);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isHighlightsModalOpen, setIsHighlightsModalOpen] = useState(false);
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date } | null>(null);

  const getCustomRangeText = () => {
    if (!customRange) return "Set Custom";
    const start = customRange.start;
    const end = customRange.end;
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (start.getTime() === end.getTime()) {
      return `${start.getDate()} ${MONTHS[start.getMonth()]}`;
    }
    return `${start.getDate()} ${MONTHS[start.getMonth()]} - ${end.getDate()} ${MONTHS[end.getMonth()]}`;
  };

  const handleDateRangeApply = (start: Date, end: Date) => {
    setCustomRange({ start, end });
    setIsDatePickerOpen(false);
  };

  const cards = useMemo(
    () => [
      {
        key: "highlights" as const,
        title: "Filter by Highlights",
        value: highlights || "Choose Highlights",
      },
    ],
    [highlights]
  );

  const hasActiveFilters =
    selectedDateRange !== "" ||
    skills.length > 0 ||
    highlights.trim().length > 0;

  const handleOpenPicker = (key: FilterKey) => {
    if (key === "skill") {
      setIsSkillModalOpen(true);
    }

    if (key === "highlights") {
      setIsHighlightsModalOpen(true);
    }
  };

  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false);
    if (!customRange) {
      setSelectedDateRange("");
    }
  };

  const handleClearAll = () => {
    setSelectedDateRange("");
    setSkills([]);
    setHighlights("");
    setCustomRange(null);
  };

  const handleApply = () => {
    onApply({
      dateRange: selectedDateRange,
      skills,
      highlights,
    });
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Filter Offers"
        zIndex={500}
      >

        {/* Filter Body */}
        <section className="flex flex-col items-start gap-6 px-4 py-0 relative self-stretch w-full">
          {/* Date Range Section */}
          <section className="flex flex-col items-start gap-3 p-4 relative self-stretch w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-xl shadow-SM">
            <h2 className="relative self-stretch mt-[-1.00px] [font-family:'Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-base tracking-[1.00px] leading-6">
              Filter by date range
            </h2>
            <div
              className="inline-flex items-center gap-4 relative"
              role="group"
              aria-label="Filter by date range"
            >
              {!customRange && (
                <button
                  type="button"
                  aria-pressed={selectedDateRange === "last30"}
                  onClick={() => {
                    setSelectedDateRange(selectedDateRange === "last30" ? "" : "last30");
                    setCustomRange(null);
                  }}
                  className={`box-border inline-flex items-center justify-center gap-1.5 p-3 relative rounded-2xl shadow-XS cursor-pointer transition-colors ${
                    selectedDateRange === "last30" ? "bg-[var(--Surface-UI-surface-surface-variant)] text-[var(--Text-Primary-heading-3)]" : "bg-[var(--Surface-UI-surface-surface-elevated)] text-[var(--Text-Primary-Text-placeholder)]"
                  }`}
                >
                  <div className="flex justify-center w-fit mt-[-1.00px] [font-family:'Nunito'] font-bold text-sm text-center tracking-[1.00px] leading-5 whitespace-nowrap relative items-center">
                    Last 30 days
                  </div>
                </button>
              )}
              <button
                type="button"
                aria-pressed={selectedDateRange === "custom"}
                onClick={() => {
                  setSelectedDateRange("custom");
                  setIsDatePickerOpen(true);
                }}
                className={`inline-flex justify-center gap-1.5 p-3 rounded-2xl shadow-XS relative items-center cursor-pointer transition-colors ${
                  selectedDateRange === "custom" ? "bg-[var(--Surface-Information-bg-surface)] text-[var(--Text-Information-primary-darker)]" : "bg-[var(--Surface-UI-surface-surface-elevated)] text-[var(--Text-Primary-Text-placeholder)]"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="!relative !w-4 !h-4 !aspect-[1]">
                  <path d="M13.3029 2.25977H2.69681C2.40393 2.25977 2.1665 2.49719 2.1665 2.79007V13.3961C2.1665 13.689 2.40393 13.9264 2.69681 13.9264H13.3029C13.5957 13.9264 13.8332 13.689 13.8332 13.3961V2.79007C13.8332 2.49719 13.5957 2.25977 13.3029 2.25977Z" stroke={selectedDateRange === "custom" ? "#153094" : "#a09da3"} strokeWidth="2.12121" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.1816 1.19922V3.32043" stroke={selectedDateRange === "custom" ? "#153094" : "#a09da3"} strokeWidth="2.12121" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.81836 1.19922V3.32043" stroke={selectedDateRange === "custom" ? "#153094" : "#a09da3"} strokeWidth="2.12121" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.1665 5.44141H13.8332" stroke={selectedDateRange === "custom" ? "#153094" : "#a09da3"} strokeWidth="2.12121" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="flex justify-center w-fit mt-[-1.00px] [font-family:'Nunito'] font-bold text-sm text-center tracking-[1.00px] leading-5 whitespace-nowrap relative items-center">
                  {getCustomRangeText()}
                </div>
                {customRange && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomRange(null);
                      setSelectedDateRange("");
                    }}
                    className="w-[44px] h-[44px] -my-3 -mr-2 flex items-center justify-center rounded-full hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] active:bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] transition-colors cursor-pointer"
                  >
                    <CloseIcon className="w-[16px] h-[16px] text-[var(--Text-Information-primary-darker)]" />
                  </span>
                )}
              </button>
            </div>
          </section>
 
          {/* Skill Filter */}
          <section className="flex flex-col items-start gap-3 p-4 relative self-stretch w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-2xl shadow-SM">
            <h2 className="relative self-stretch mt-[-1.00px] [font-family:'Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-base tracking-[1.00px] leading-6">
              Filter by Skill
            </h2>
            <div className="flex flex-col gap-3 w-full">
              {skills.map(s => (
                <div key={s} className="w-[fit-content] bg-[var(--Mapped-Surface-UI-surface-surface-variant)] rounded-[16px] flex items-center justify-between px-4 py-3 gap-[16px]">
                  <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-brand)] text-[16px] leading-[24px] tracking-[1px]">{s}</span>
                  <button onClick={() => setSkills(prev => prev.filter(x => x !== s))} className="hover:opacity-70 transition-opacity">
                    <CloseIcon className="w-5 h-5 text-[var(--Text-Primary-Text-placeholder)]" />
                  </button>
                </div>
              ))}
              {skills.length < 5 && (
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(true)}
                  className="w-fit inline-flex items-center justify-center gap-2 px-4 py-3 relative bg-[var(--Surface-UI-surface-surface-variant)] rounded-[16px] cursor-pointer hover:bg-[var(--Button-UI-comp-sur-Surface-Primary)] transition-colors"
                >
                  <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px]">
                    {skills.length === 0 ? "Choose Skill" : "Add more skills"}
                  </span>
                  <PlusIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-3)]" />
                </button>
              )}
            </div>
          </section>

          {/* Dynamic Pickers (Highlights) */}
          {cards.map((card) => (
            <section
              key={card.key}
              className="flex flex-col items-start gap-3 p-4 relative self-stretch w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-2xl shadow-SM"
            >
              <h2 className="relative self-stretch mt-[-1.00px] [font-family:'Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-base tracking-[1.00px] leading-6">
                {card.title}
              </h2>
              <div className="inline-flex items-center gap-4 relative">
                {card.key === "highlights" && highlights ? (
                  <button
                    type="button"
                    onClick={() => setHighlights("")}
                    className={`inline-flex items-center gap-1.5 p-3 rounded-2xl relative shadow-XS transition-colors hover:opacity-80 ${
                      highlights === "Hot now" ? "bg-[var(--Surface-Error-bg-surface)] text-[var(--Text-Error-primary)]" :
                      highlights === "Closing soon" ? "bg-[var(--Surface-Warning-bg-surface)] text-[var(--Text-Primary-Text-brand)]" :
                      "bg-[var(--Surface-Information-bg-surface)] text-[var(--Text-Information-primary)]"
                    }`}
                  >
                    <div className="relative w-6 h-6 flex items-center justify-center" aria-hidden="true">
                      {highlights === "Hot now" && <StaticFlameIcon className="w-full h-full" />}
                      {highlights === "Closing soon" && <StaticCodeTimerIcon />}
                      {highlights === "New offer" && <StaticCodeSparkleIcon />}
                    </div>
                    <div className="relative w-fit font-['Nunito'] font-bold text-[14px] tracking-[1px] leading-5 whitespace-nowrap">
                      {highlights}
                    </div>
                    <CloseIcon className={`w-5 h-5 ml-1 ${
                      highlights === "Hot now" ? "text-[var(--Text-Error-primary)]" :
                      highlights === "Closing soon" ? "text-[var(--Text-Primary-Text-brand)]" :
                      "text-[var(--Text-Information-primary)]"
                    }`} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenPicker(card.key)}
                    className="inline-flex items-center justify-center gap-1.5 p-3 relative bg-[var(--Surface-UI-surface-surface-variant)] rounded-2xl shadow-XS cursor-pointer hover:bg-[var(--Button-UI-comp-sur-Surface-Primary)] transition-colors"
                    aria-label={card.value}
                  >
                    <div className="flex justify-center w-fit mt-[-1.00px] [font-family:'Nunito'] font-bold text-[var(--Text-Primary-heading-3)] text-sm text-center tracking-[1.00px] leading-5 whitespace-nowrap relative items-center">
                      {card.value}
                    </div>
                    <ChevronRightIcon className="!relative !w-4 !h-4 !aspect-[1] text-[var(--Text-Primary-heading-3)]" />
                  </button>
                )}
              </div>
            </section>
          ))}
        </section>
 
        {/* Action Footer Buttons */}
        <div className="w-full flex items-center justify-between px-[16px] mt-[24px]">
          <Button variant="ghost" onClick={handleClearAll}>
            Clear all
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!hasActiveFilters}
            className="min-w-[101px]"
          >
            Apply
          </Button>
        </div>
      </BottomSheet>

      <SpecificDatesModal
        isOpen={isDatePickerOpen}
        onClose={handleDatePickerClose}
        onApply={handleDateRangeApply}
        initialRange={customRange}
        zIndex={600}
      />

      <FilterSkillsModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        initialSkills={skills}
        onApply={(newSkills) => {
          setSkills(newSkills);
          setIsSkillModalOpen(false);
        }}
        zIndex={600}
      />
      <FilterHighlightsModal
        isOpen={isHighlightsModalOpen}
        onClose={() => setIsHighlightsModalOpen(false)}
        selectedHighlight={highlights}
        onSelect={(highlight) => {
          setHighlights(highlight);
        }}
        zIndex={600}
      />
    </>
  );
}
