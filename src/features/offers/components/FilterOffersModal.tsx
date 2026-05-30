import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
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

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-40 bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 w-full z-50 bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col items-center shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] select-none"
      >
        {/* Drag Handle */}
        <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />

        {/* Header */}
        <div className="w-full flex items-center justify-between px-[16px] mb-[4px]">
          <div className="w-[48px]" />
          <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
            Filter Offers
          </h3>
          <button
            onClick={onClose}
            className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors"
          >
            <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#e0dce3] mb-[20px]" />

        {/* Filter Body */}
        <section className="flex flex-col items-start gap-6 px-4 py-0 relative self-stretch w-full">
          {/* Date Range Section */}
          <section className="flex flex-col items-start gap-3 p-4 relative self-stretch w-full bg-[#faf7fe] rounded-xl shadow-SM">
            <h2 className="relative self-stretch mt-[-1.00px] [font-family:'Nunito'] font-bold text-[#656268] text-base tracking-[1.00px] leading-6">
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
                    selectedDateRange === "last30" ? "bg-[#f8efff] text-[#2f2c32]" : "bg-[#f0edf4] text-[#a09da3]"
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
                  selectedDateRange === "custom" ? "bg-[#edf2ff] text-[#000010]" : "bg-[#f0edf4] text-[#a09da3]"
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
                    className="w-[44px] h-[44px] -my-3 -mr-2 flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
                  >
                    <CloseIcon className="w-[16px] h-[16px] text-[#000010]" />
                  </span>
                )}
              </button>
            </div>
          </section>
 
          {/* Skill Filter */}
          <section className="flex flex-col items-start gap-3 p-4 relative self-stretch w-full bg-[#faf7fe] rounded-2xl shadow-SM">
            <h2 className="relative self-stretch mt-[-1.00px] [font-family:'Nunito'] font-bold text-[#656268] text-base tracking-[1.00px] leading-6">
              Filter by Skill
            </h2>
            <div className="flex flex-col gap-3 w-full">
              {skills.map(s => (
                <div key={s} className="w-[fit-content] bg-[#f0edf4] rounded-[16px] flex items-center justify-between px-4 py-3 gap-[16px]">
                  <span className="font-['Nunito'] font-bold text-[#b7812f] text-[16px] leading-[24px] tracking-[1px]">{s}</span>
                  <button onClick={() => setSkills(prev => prev.filter(x => x !== s))} className="hover:opacity-70 transition-opacity">
                    <CloseIcon className="w-5 h-5 text-[#a09da3]" />
                  </button>
                </div>
              ))}
              {skills.length < 5 && (
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(true)}
                  className="w-fit inline-flex items-center justify-center gap-2 px-4 py-3 relative bg-[#f8efff] rounded-[16px] cursor-pointer hover:bg-[#eedeff] transition-colors"
                >
                  <span className="font-['Nunito'] font-bold text-[#2f2c32] text-[16px] leading-[24px]">
                    {skills.length === 0 ? "Choose Skill" : "Add more skills"}
                  </span>
                  <PlusIcon className="w-[24px] h-[24px] text-[#2f2c32]" />
                </button>
              )}
            </div>
          </section>

          {/* Dynamic Pickers (Highlights) */}
          {cards.map((card) => (
            <section
              key={card.key}
              className="flex flex-col items-start gap-3 p-4 relative self-stretch w-full bg-[#faf7fe] rounded-2xl shadow-SM"
            >
              <h2 className="relative self-stretch mt-[-1.00px] [font-family:'Nunito'] font-bold text-[#656268] text-base tracking-[1.00px] leading-6">
                {card.title}
              </h2>
              <div className="inline-flex items-center gap-4 relative">
                {card.key === "highlights" && highlights ? (
                  <button
                    type="button"
                    onClick={() => setHighlights("")}
                    className={`inline-flex items-center gap-1.5 p-3 rounded-2xl relative shadow-XS transition-colors hover:opacity-80 ${
                      highlights === "Hot now" ? "bg-[#fef6f5] text-[#870113]" :
                      highlights === "Closing soon" ? "bg-[#fffbf2] text-[#b87d18]" :
                      "bg-[#f0f4ff] text-[#133aa8]"
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
                      highlights === "Hot now" ? "text-[#870113]" :
                      highlights === "Closing soon" ? "text-[#b87d18]" :
                      "text-[#133aa8]"
                    }`} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenPicker(card.key)}
                    className="inline-flex items-center justify-center gap-1.5 p-3 relative bg-[#f8efff] rounded-2xl shadow-XS cursor-pointer hover:bg-[#eedeff] transition-colors"
                    aria-label={card.value}
                  >
                    <div className="flex justify-center w-fit mt-[-1.00px] [font-family:'Nunito'] font-bold text-[#2f2c32] text-sm text-center tracking-[1.00px] leading-5 whitespace-nowrap relative items-center">
                      {card.value}
                    </div>
                    <ChevronRightIcon className="!relative !w-4 !h-4 !aspect-[1] text-[#2f2c32]" />
                  </button>
                )}
              </div>
            </section>
          ))}
        </section>
 
        {/* Action Footer Buttons */}
        <div className="w-full flex items-center justify-between px-[16px] mt-[24px]">
          <button 
            onClick={handleClearAll} 
            className="font-['Nunito'] font-bold text-[16px] leading-[24px] text-[#49464c] underline px-[16px] py-[12px]"
          >
            Clear all
          </button>
          <button 
            onClick={handleApply} 
            disabled={!hasActiveFilters} 
            className={`flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] transition-colors ${hasActiveFilters ? "bg-[#171519] text-[#fbf6ff] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] hover:bg-[#2f2c32] active:scale-95" : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"}`}
          >
            Apply
          </button>
        </div>
      </motion.div>

      <SpecificDatesModal
        isOpen={isDatePickerOpen}
        onClose={handleDatePickerClose}
        onApply={handleDateRangeApply}
        initialRange={customRange}
      />

      <FilterSkillsModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        initialSkills={skills}
        onApply={(newSkills) => {
          setSkills(newSkills);
          setIsSkillModalOpen(false);
        }}
      />
      <FilterHighlightsModal
        isOpen={isHighlightsModalOpen}
        onClose={() => setIsHighlightsModalOpen(false)}
        selectedHighlight={highlights}
        onSelect={(highlight) => {
          setHighlights(highlight);
        }}
      />
    </>
  );
}
