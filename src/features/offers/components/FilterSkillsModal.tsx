import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { Button } from "../../../components/ui/Button";
import { CloseIcon, ChevronUpIcon } from "../../../components/common/Icons";
import { CustomAnimatedCheckbox } from "../../../components/common/CustomAnimatedCheckbox";

interface FilterSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSkills: string[];
  onApply: (skills: string[]) => void;
  zIndex?: number;
}

const SKILL_CATEGORIES = [
  { name: "Design & Creative", skills: ["Visual Design", "Experience Design", "Motion & 3D"] },
  { name: "Product & Strategy", skills: ["Product Management", "User Research", "Market Strategy"] },
  { name: "Engineering & Data", skills: ["Web Development", "Mobile Development", "Data Science"] },
  { name: "Writing & Content", skills: ["Copywriting", "Content Strategy", "Technical Writing"] },
  { name: "Business Operations & Growth", skills: ["Digital Marketing", "Customer Success", "Project Operations"] }
];

export function FilterSkillsModal({
  isOpen,
  onClose,
  initialSkills,
  onApply,
  zIndex = 500
}: FilterSkillsModalProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const SCROLL_THRESHOLD = 80;
    const BOTTOM_THRESHOLD = 52;
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

    if (target.scrollTop > SCROLL_THRESHOLD && distanceToBottom > BOTTOM_THRESHOLD) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [tempFilters, setTempFilters] = useState<string[]>([]);
  const [filterSearchQuery, setFilterSearchQuery] = useState("");

  const filteredCategories = React.useMemo(() => {
    let result = SKILL_CATEGORIES;

    if (appliedFilters.length > 0) {
      result = result.filter(category => appliedFilters.includes(category.name));
    }

    if (!searchQuery.trim()) return result;
    const lowerQuery = searchQuery.toLowerCase();

    return result.map(category => ({
      name: category.name,
      skills: category.skills.filter(skill => skill.toLowerCase().includes(lowerQuery))
    })).filter(category => category.skills.length > 0);
  }, [searchQuery, appliedFilters]);

  const modalFilteredCategories = React.useMemo(() => {
    if (!filterSearchQuery.trim()) return SKILL_CATEGORIES;
    const lowerQuery = filterSearchQuery.toLowerCase();
    return SKILL_CATEGORIES.filter(cat => cat.name.toLowerCase().includes(lowerQuery));
  }, [filterSearchQuery]);

  const handleOpenFilter = () => {
    setTempFilters([...appliedFilters]);
    setIsFilterModalOpen(true);
  };

  const handleToggleFilter = (name: string) => {
    setTempFilters(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleApplyFilter = () => {
    setAppliedFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleApply = () => {
    onApply(selectedSkills);
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Search Skills"
        style={{ height: "85%" }}
        zIndex={zIndex}
      >
        <div className="w-full flex flex-col px-0 h-full overflow-hidden">

              {/* Content Area */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="w-full flex-1 overflow-y-auto flex flex-col gap-[16px] pb-[24px] pr-0 modal-scrollbar"
              >
                <div className="flex flex-col gap-[20px] px-[16px]">
                  {/* Search */}
                  <div className="w-full h-[56px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] flex items-center px-[12px]">
                    <div className="flex items-center gap-[8px] flex-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a09da3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <input
                        type="text"
                        placeholder="Search Skills"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none font-['Nunito'] font-medium text-[16px] tracking-[0.1px] text-[var(--Text-Primary-heading-1)] placeholder-[#a09da3]"
                      />
                    </div>
                    <button className="shrink-0 ml-[12px]" onClick={handleOpenFilter}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                    </button>
                  </div>

                  {/* Active Filter Chips */}
                  {appliedFilters.length > 0 && (
                    <div className="flex gap-[13px] overflow-x-auto scrollbar-hide pb-[2px]">
                      {appliedFilters.map((filter) => (
                        <div
                          key={filter}
                          className="flex items-center gap-[12px] px-[12px] py-[12px] rounded-[12px] bg-[var(--Mapped-Surface-UI-surface-surface-variant)] cursor-pointer transition-all duration-200 active:scale-95 shrink-0"
                          onClick={() => setAppliedFilters((prev) => prev.filter((f) => f !== filter))}
                        >
                          <span className="font-['Nunito'] font-semibold text-[14px] leading-[20px] text-[var(--Text-Primary-Text-brand)] tracking-[1px] whitespace-nowrap">
                            {filter}
                          </span>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b7812f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Categories */}
                  {filteredCategories.map(category => {
                    return (
                      <div key={category.name} className="flex flex-col gap-[12px]">
                        <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-[14px] uppercase tracking-wider">
                          {category.name}
                        </h3>
                        <div className="flex flex-col gap-[8px]">
                          {category.skills.map(skill => {
                            const isSelected = selectedSkills.includes(skill);
                            return (
                              <div
                                key={skill}
                                onClick={() => handleToggleSkill(skill)}
                                className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between p-[12px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.15)] transition-colors cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)]"
                              >
                                <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] pl-[8px]">
                                  {skill}
                                </span>
                                <CustomAnimatedCheckbox checked={isSelected} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Floating Back to top Button — styled identical to View all button */}
              <div className="absolute bottom-[130px] right-[16px] pointer-events-none z-[160] w-full flex justify-end px-[16px]">
                <motion.button
                  initial={false}
                  animate={{
                    scale: showBackToTop ? 1 : 0.85,
                    opacity: showBackToTop ? 1 : 0,
                  }}
                  transition={{ type: "tween", duration: 0.2 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    scrollToTop();
                  }}
                  style={{
                    pointerEvents: showBackToTop ? "auto" : "none"
                  }}
                  className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[12px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] rounded-[16px] shadow-[0_1px_3px_0_rgba(18,9,0,0.10)] cursor-pointer"
                >
                  <span className="font-['Nunito'] font-bold text-[var(--Button-UI-comp-sur-Text-primary)] text-[16px] leading-[24px]">
                    Back to top
                  </span>
                  <ChevronUpIcon className="w-[18px] h-[18px] text-[var(--Button-UI-comp-sur-Text-primary)]" />
                </motion.button>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-between mt-[16px] shrink-0 px-[16px]">
                <Button variant="ghost" onClick={() => setSelectedSkills([])}>
                  Clear all
                </Button>
                <Button variant="primary" className="min-w-[101px]" onClick={handleApply}>
                  Apply
                </Button>
              </div>
            </div>
        </BottomSheet>

      {/* Modal Bottom Sheet: Filter by Domain */}
      <BottomSheet
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter by Domain"
        zIndex={zIndex + 100}
      >
        <div className="w-full flex flex-col items-center gap-[16px] px-[16px]">
          <p className="font-['Nunito'] font-medium text-[16px] leading-[24px] text-[var(--Text-Primary-Body)] text-center w-full">
            Choose one or more areas of expertise to narrow down the skill list. This helps you find exactly what you need faster.
          </p>

          {/* Modal Search Bar */}
          <div className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] px-[12px] py-[16px] flex items-center">
            <input
              type="text"
              placeholder="Search domain"
              value={filterSearchQuery}
              onChange={(e) => setFilterSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-['Nunito'] font-medium text-[16px] tracking-[0.1px] text-[var(--Text-Primary-heading-1)] placeholder-[#a09da3]"
            />
          </div>

          {/* Filter Categories List */}
          <div className="w-full flex flex-col gap-[6px] max-h-[300px] overflow-y-auto px-[4px]">
            {modalFilteredCategories.map(cat => {
              const isSelected = tempFilters.includes(cat.name);
              return (
                <div
                  key={cat.name}
                  onClick={() => handleToggleFilter(cat.name)}
                  className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] p-[8px] flex items-center justify-between cursor-pointer select-none active:scale-[0.99] transition-transform"
                >
                  <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px] tracking-[0.1px]">
                    {cat.name}
                  </span>
                  <CustomAnimatedCheckbox checked={isSelected} />
                </div>
              );
            })}

            {modalFilteredCategories.length === 0 && (
              <div className="flex justify-center py-[20px] text-[var(--Text-Primary-Text-placeholder)] font-['Nunito'] font-medium">
                No domains found matching "{filterSearchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex items-center justify-between px-[16px] mt-[32px]">
          <Button
            variant="ghost"
            onClick={() => {
              setTempFilters([]);
              setAppliedFilters([]);
              setIsFilterModalOpen(false);
            }}
          >
            Clear all
          </Button>
          <Button
            variant="primary"
            className="w-[101px]"
            onClick={handleApplyFilter}
            disabled={tempFilters.length === 0}
          >
            Apply
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
