import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { CustomAnimatedCheckbox } from "../../../components/common/CustomAnimatedCheckbox";
import { SaveExitModal } from "../components/SaveExitModal";
import { CloseIcon, GripIcon, PlusIcon } from "../../../components/common/Icons";
import { ProficiencyTag } from "../../../components/common/ProficiencyTag";
import { InfoIconButton } from "../../../components/common/InfoIconButton";
import { GlobalAddTagsModal } from "../components/GlobalAddTagsModal";

// Badge components
function BBadge({ size = 20 }: { size?: number }) {
  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Star background */}
      <svg
        viewBox="0 0 15.7291 15.7291"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        overflow="visible"
      >
        <path
          d="M6.2127 0.917332C6.97429 -0.305777 8.75476 -0.305777 9.51636 0.917332C9.95654 1.62426 10.7978 1.97271 11.6089 1.7841C13.0123 1.45776 14.2713 2.71674 13.945 4.12014C13.7563 4.93127 14.1048 5.77251 14.8117 6.2127C16.0348 6.97429 16.0348 8.75476 14.8117 9.51636C14.1048 9.95654 13.7563 10.7978 13.945 11.6089C14.2713 13.0123 13.0123 14.2713 11.6089 13.945C10.7978 13.7563 9.95654 14.1048 9.51636 14.8117C8.75476 16.0348 6.97429 16.0348 6.2127 14.8117C5.77251 14.1048 4.93127 13.7563 4.12014 13.945C2.71674 14.2713 1.45776 13.0123 1.7841 11.6089C1.97271 10.7978 1.62426 9.95654 0.917332 9.51636C-0.305778 8.75476 -0.305777 6.97429 0.917332 6.21269C1.62426 5.77251 1.97271 4.93127 1.7841 4.12014C1.45776 2.71674 2.71674 1.45776 4.12014 1.7841C4.93127 1.97271 5.77251 1.62426 6.2127 0.917332Z"
          fill="#171519"
        />
      </svg>
      {/* B letterform */}
      <svg
        viewBox="0 0 5.33332 6.95357"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{ width: size * 0.42, height: size * 0.55 }}
        preserveAspectRatio="none"
        overflow="visible"
      >
        <path
          d="M4.66673 2.33333C4.72229 1.72222 4.36673 0.500001 2.50006 0.500001C2.00217 0.500001 1.69713 0.500001 1.49894 0.5C0.946668 0.499998 0.500057 0.947703 0.50005 1.49998L0.500027 3.33333M0.500027 3.33333L0.5 5.4754C0.499994 5.96898 0.860115 6.39461 1.35244 6.42968C3.20057 6.56133 4.83332 6.15745 4.83332 5C4.83332 3.33333 3.16666 3.33333 2.33332 3.33333C1.66666 3.33333 0.833348 3.33333 0.500027 3.33333Z"
          stroke="#F4FBF2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function PBadge({ size = 16 }: { size?: number }) {
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "#eacfff", width: size, height: size }}
    >
      <span
        className="font-['Nunito'] font-semibold text-center w-full"
        style={{ fontSize: `${size * 0.5}px`, color: "#380157", letterSpacing: "1.1px", lineHeight: "1" }}
      >
        P
      </span>
    </div>
  );
}

const MAX_VISIBLE_TAGS = 4;

interface SkillReviewViewProps {
  selectedSkills: string[];
  skillTagsMap: Record<string, string[]>;
  proficiencies?: Record<string, string>;
  onBack: () => void;
  onAddMore: (skills: string[], tagsMap: Record<string, string[]>) => void;
  onNext: (confirmedSkills: string[], confirmedTagsMap: Record<string, string[]>) => void;
  hideBadge?: boolean;
}

export function SkillReviewView({
  selectedSkills: initialSkills,
  skillTagsMap,
  proficiencies = {},
  onBack,
  onNext,
  onAddMore,
  hideBadge = false
}: SkillReviewViewProps) {
  // Track which skills are still shown — unchecking removes the card
  const [visibleSkills, setVisibleSkills] = useState<string[]>(initialSkills);
  // Track a skill currently animating out
  const [removingSkill, setRemovingSkill] = useState<string | null>(null);
  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>({});
  // Badge info tooltip
  const [isBadgeInfoOpen, setIsBadgeInfoOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const [showFAB, setShowFAB] = useState(true);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset FAB visibility and scroll state when the list of visibleSkills changes
  useEffect(() => {
    setShowFAB(true);
    lastScrollY.current = 0;
    
    // Check if the scroll container has no scrollbar (already fits screen)
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollHeight <= clientHeight + 10) {
          setHasScrolledToBottom(true);
        } else {
          setHasScrolledToBottom(false);
        }
      }
    };
    
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [visibleSkills]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const { scrollHeight, clientHeight } = e.currentTarget;
    
    // Check if scrolled to bottom
    if (scrollHeight - currentScrollY <= clientHeight + 10) {
      setHasScrolledToBottom(true);
    }
    
    if (currentScrollY <= 0) {
      setShowFAB(true);
    } else if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
      if (currentScrollY > lastScrollY.current) {
        setShowFAB(false);
      } else {
        setShowFAB(true);
      }
    }
    lastScrollY.current = currentScrollY;
  };

  // Tag editing state
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [skillForTags, setSkillForTags] = useState<string>("");
  const [localTagsMap, setLocalTagsMap] = useState<Record<string, string[]>>(skillTagsMap);
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleOpenTagsModal = (skill: string) => {
    setSkillForTags(skill);
    setTempTags(localTagsMap[skill] || []);
    setTagInput("");
    setIsTagsModalOpen(true);
  };

  const handleApplyTags = () => {
    setLocalTagsMap(prev => ({ ...prev, [skillForTags]: tempTags }));
    setIsTagsModalOpen(false);
  };

  const handleClearTags = () => {
    setLocalTagsMap(prev => ({ ...prev, [skillForTags]: [] }));
    setTempTags([]);
    setIsTagsModalOpen(false);
  };

  const toggleTag = (tag: string) => {
    setTempTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 5)
    );
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const val = tagInput.trim().replace(/,$/, "");
      if (val && !tempTags.includes(val) && tempTags.length < 5) {
        setTempTags(prev => [...prev, val]);
      }
      setTagInput("");
    }
  };

  const handleUncheck = (skill: string) => {
    setRemovingSkill(skill);
    setTimeout(() => {
      setRemovingSkill(null);
      setVisibleSkills(prev => {
        const next = prev.filter(s => s !== skill);
        if (next.length === 0) {
          const currentTagsMap: Record<string, string[]> = {};
          next.forEach((s) => {
            currentTagsMap[s] = skillTagsMap[s] || [];
          });
          onAddMore?.(next, currentTagsMap);
        }
        return next;
      });
    }, 300);
  };

  const toggleExpand = (skill: string) => {
    setExpandedSkills((prev) => ({ ...prev, [skill]: !prev[skill] }));
  };

  const isNextEnabled = visibleSkills.length >= 1 && hasScrolledToBottom;

  const handleNext = () => {
    if (isNextEnabled) {
      const confirmedTagsMap: Record<string, string[]> = {};
      visibleSkills.forEach((s) => {
        confirmedTagsMap[s] = skillTagsMap[s] || [];
      });
      onNext?.(visibleSkills, confirmedTagsMap);
    }
  };

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0 z-10 relative bg-[var(--Surface-Primary-Background)]">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]" />
      </div>

      {/* Header Action Buttons (Fixed at Top) */}
      <div className="w-full px-[16px] flex justify-between items-center py-[16px] shrink-0 bg-[var(--Surface-Primary-Background)] z-20">
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]"
        >
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">
            Save and Exit
          </span>
        </button>
        <button className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]">
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">
            Questions?
          </span>
        </button>
      </div>


      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-[16px] pb-[248px] flex flex-col pt-[8px] availability-scrollbar"
      >
        {/* Page Header */}
        <div className="w-full pb-[16px] flex flex-col">
          <div className="flex items-center gap-[8px]">
            <h1 className="font-['Nunito'] font-bold text-[28px] leading-[36px] text-[var(--Text-Primary-heading-1)] tracking-[-1.2px]">
              Review your selection
            </h1>
            {/* Info icon — tappable, opens badge legend */}
            <InfoIconButton
              onClick={() => {
                console.log("Info icon clicked");
                setIsBadgeInfoOpen(true);
              }}
              label="What do these badges mean"
            />
          </div>
          <p className="font-['Nunito'] font-medium text-[16px] leading-[24px] text-[var(--Text-Primary-Body)] tracking-[0.1px] mt-[8px]">
            Your top skill is what the community sees first. Drag to reorder.
          </p>
        </div>

        <div className="flex flex-col gap-[24px]">
          {visibleSkills.map((skill, index) => {
            const tags = localTagsMap[skill] || [];
            const isExpanded = expandedSkills[skill] ?? false;
            const shownTags = isExpanded ? tags : tags.slice(0, MAX_VISIBLE_TAGS);
            const isRemoving = removingSkill === skill;
            const profLevel = proficiencies[skill];
            
            // The top card is automatically Primary
            const isPrimary = index === 0;

            return (
              <div
                key={skill}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", skill);
                  e.dataTransfer.effectAllowed = "move";
                  setTimeout(() => {
                    if (e.target instanceof HTMLElement) {
                      e.target.classList.add("opacity-50", "scale-[1.02]", "shadow-lg");
                    }
                  }, 0);
                }}
                onDragEnd={(e) => {
                  if (e.target instanceof HTMLElement) {
                    e.target.classList.remove("opacity-50", "scale-[1.02]", "shadow-lg");
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const draggedSkill = e.dataTransfer.getData("text/plain");
                  if (!draggedSkill || draggedSkill === skill) return;

                  const fromIdx = visibleSkills.indexOf(draggedSkill);
                  const toIdx = visibleSkills.indexOf(skill);
                  if (fromIdx !== -1 && toIdx !== -1) {
                    const updated = [...visibleSkills];
                    updated.splice(fromIdx, 1);
                    updated.splice(toIdx, 0, draggedSkill);
                    setVisibleSkills(updated);
                  }
                }}
                onClick={() => handleOpenTagsModal(skill)}
                className={`w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] flex flex-col items-start px-[20px] py-[20px] gap-[16px] overflow-hidden min-h-[148px] cursor-pointer transition-all duration-300 border-2 ${
                  isPrimary ? "border-[var(--Text-Primary-Text-brand)] shadow-sm" : "border-transparent"
                }`}
                style={{
                  boxShadow: isPrimary ? "0px 4px 12px 0px rgba(18,9,0,0.15)" : "0px 4px 12px 0px rgba(18,9,0,0.15)",
                  opacity: isRemoving ? 0 : 1,
                  maxHeight: isRemoving ? "0px" : "600px",
                  paddingTop: isRemoving ? "0px" : undefined,
                  paddingBottom: isRemoving ? "0px" : undefined,
                  marginBottom: isRemoving ? "-16px" : "0px",
                }}
              >
                {/* Header row: aligned to items-start so controls stay top-right if long text wraps */}
                <div className="flex items-start justify-between w-full gap-[12px]">
                  {/* Left Side Wrapper: items-start allows title text to wrap downward natively */}
                  <div className="flex items-start gap-[8px] flex-1 min-w-0">
                    <h2 className="font-['Nunito'] font-bold text-[24px] leading-[32px] text-[var(--Text-Primary-heading-1)] tracking-[-0.7px] break-words">
                      {skill.toLowerCase()}
                    </h2>
                    {/* PBadge hidden on Receive side — verification status is irrelevant when selecting desired partner skills */}
                    {!hideBadge && (
                      <div className="shrink-0 mt-[8px]">
                        <PBadge size={16} />
                      </div>
                    )}
                  </div>

                  {/* Right Side Controls Wrapper: perfectly aligned to the top alongside the text copy */}
                  <div className="flex items-center gap-[16px] shrink-0 mt-0">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        const fromIdx = visibleSkills.indexOf(skill);
                        if (fromIdx > 0) {
                          const updated = [...visibleSkills];
                          updated.splice(fromIdx, 1);
                          updated.unshift(skill);
                          setVisibleSkills(updated);
                        }
                      }}
                      className="cursor-grab active:cursor-grabbing p-[4px] text-[var(--Text-Primary-Caption-alt)] hover:opacity-80 transition-opacity"
                      title="Drag to reorder"
                    >
                      <GripIcon className="w-[16px] h-[24px]" />
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUncheck(skill);
                      }}
                      className="shrink-0 flex items-center justify-center"
                    >
                      <CustomAnimatedCheckbox checked={true} />
                    </button>
                  </div>
                </div>

                {/* Proficiency tag: 8px from title (using mt-[-8px] since parent has gap-16) and 12px from tags below */}
                {profLevel && (
                  <ProficiencyTag level={profLevel} className="-mt-[8px] mb-[-4px]" />
                )}

                {/* Tags — always visible on both Give and Receive sides */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-[12px] items-start">
                    {shownTags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] p-[12px] flex items-center shrink-0"
                      >
                        <span className="font-['Nunito'] font-semibold text-[14px] leading-[20px] text-[var(--Text-Primary-Text-brand)] tracking-[1px] whitespace-nowrap">
                          {tag}
                        </span>
                      </div>
                    ))}
                    {!isExpanded && tags.length > MAX_VISIBLE_TAGS && (
                      <div className="bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] p-[12px] flex items-center shrink-0">
                        <span className="font-['Nunito'] font-semibold text-[14px] leading-[20px] text-[var(--Text-Primary-Text-brand)] tracking-[1px]">
                          +{tags.length - MAX_VISIBLE_TAGS}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* View More/Less */}
                {tags.length > MAX_VISIBLE_TAGS && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(skill);
                    }}
                    className="mt-[16px] flex items-center gap-[4px]"
                  >
                    <span className="font-['Nunito'] font-bold text-[16px] leading-[24px] text-[var(--Text-Primary-Body)] tracking-[0.16px] underline decoration-solid">
                      {isExpanded ? "View less" : "View more"}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>


      {/* Floating "+" Add More button — absolute, anchored bottom-right, 40px above footer */}
      <motion.button
        onClick={() => {
          const currentTagsMap: Record<string, string[]> = {};
          visibleSkills.forEach((s) => {
            currentTagsMap[s] = skillTagsMap[s] || [];
          });
          onAddMore?.(visibleSkills, currentTagsMap);
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: showFAB ? 1 : 0, 
          opacity: showFAB ? 1 : 0 
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", damping: 15, stiffness: 350 }}
        className="absolute right-[24px] z-30"
        style={{
          bottom: "172px", /* footer height ~132px + 40px design spec gap */
          width: "56px",
          height: "56px",
          backgroundColor: "#b7812f",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 12px 32px 0px rgba(18,9,0,0.15), 0px 8px 4px 0px rgba(18,9,0,0.05)",
          pointerEvents: showFAB ? "auto" : "none",
        }}
      >
        <PlusIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-Body-alt)]" />
      </motion.button>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col gap-[32px] items-center pt-[0px] pb-[44px] z-20">
        {/* Progress Bar */}
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={3} subStepProgress={100} totalSteps={3} />
        </div>

        {/* Buttons */}
        <div className="w-full flex items-center justify-between px-[16px]">
          <button
            onClick={onBack}
            className="flex h-[48px] items-center justify-center px-[16px] py-[12px] font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.16px] underline"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isNextEnabled}
            className={`flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] leading-[24px] tracking-[0.16px] transition-colors ${isNextEnabled
              ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)]"
              : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
              }`}
          >
            {visibleSkills.length <= 1 ? "Add skill" : "Add skills"}
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]" />
      </div>

      {/* ── Add Tags Modal ─────────────────────────────── */}
      <GlobalAddTagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        tags={tempTags}
        onToggleTag={toggleTag}
        onApply={handleApplyTags}
        onClear={handleClearTags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        onTagInputKeyDown={handleTagInputKeyDown}
      />
      {/* ──────────────────────────────────────────────────── */}

      {/* ── Badge Info Overlay ─────────────────────────────── */}
      {/* Blurred backdrop */}
      <div
        className={`absolute inset-0 z-50 transition-opacity duration-300 ${isBadgeInfoOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        style={{ backgroundColor: "rgba(47,44,50,0.26)", backdropFilter: "blur(4px)" }}
        onClick={() => setIsBadgeInfoOpen(false)}
      />

      {/* Tooltip card — centred horizontally, positioned below the header */}
      <div
        className={`absolute z-[60] left-[16px] right-[16px] transition-all duration-300 ${isBadgeInfoOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        style={{ top: "188px" }}
      >
        {/* Arrow pointing up — aligned to info icon */}
        <div
          className="absolute"
          style={{
            top: "-8px",
            right: "66px",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "8px solid #f9f4ee"
          }}
        />

        {/* Card */}
        <div className="w-full bg-[var(--Button-Primary-Surface-default-sec)] rounded-[12px] p-[12px] flex gap-[12px] items-start">
          {/* Content column */}
          <div className="flex-1 flex flex-col gap-[8px]">
            <p className="font-['Nunito'] font-bold text-[18px] leading-[28px] text-[var(--Text-Primary-heading-1)] tracking-[0px]">
              What do these badges mean
            </p>

            <div className="flex flex-col gap-[12px]">
              {/* B badge row */}
              <div className="flex gap-[12px] items-start">
                <BBadge size={24} />
                <p className="flex-1 font-['Nunito'] font-medium text-[14px] leading-[20px] text-[var(--Text-Primary-heading-3)] tracking-[1px]">
                  This badge indicates a high level of trust, verified by consistent, high-quality sessions on the platform.
                </p>
              </div>

              {/* P badge row */}
              <div className="flex gap-[12px] items-start">
                <PBadge size={24} />
                <p className="flex-1 font-['Nunito'] font-medium text-[14px] leading-[20px] text-[var(--Text-Primary-heading-3)] tracking-[1px]">
                  A skill in progress. The user is claiming this skill but has not yet verified it through a session or provided full details.
                </p>
              </div>
            </div>
          </div>

          {/* X close button */}
          <button
            onClick={() => setIsBadgeInfoOpen(false)}
            className="shrink-0 w-[44px] h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <CloseIcon className="w-[20px] h-[20px] text-[var(--Text-Primary-heading-1)]" />
          </button>
        </div>
      </div>
      {/* ──────────────────────────────────────────────────── */}
    </div>
  );
}
