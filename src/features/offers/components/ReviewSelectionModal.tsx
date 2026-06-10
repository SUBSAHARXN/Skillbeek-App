import React, { useState, useEffect, useRef } from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { Button } from "../../../components/ui/Button";
import { CustomAnimatedCheckbox } from "../../../components/common/CustomAnimatedCheckbox";
import { CloseIcon, GripIcon, PlusIcon } from "../../../components/common/Icons";
import { motion } from "framer-motion";

interface ReviewSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  skills: string[];
  tags: Record<string, string[]>;
  roles: Record<string, string>;
  proficiencies: Record<string, string>;
  onAddMore: () => void;
  onRemoveSkill: (skill: string) => void;
  onEditTags: (skill: string) => void;
  onApply?: () => void;
  onReorderSkills?: (reorderedSkills: string[]) => void;
}

export function ReviewSelectionModal({
  isOpen,
  onClose,
  title,
  skills,
  tags,
  roles,
  proficiencies,
  onAddMore,
  onRemoveSkill,
  onEditTags,
  onApply,
  onReorderSkills
}: ReviewSelectionModalProps) {
  const [orderedSkills, setOrderedSkills] = useState<string[]>(skills);
  const [showFAB, setShowFAB] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setOrderedSkills(skills);
  }, [skills]);

  useEffect(() => {
    setShowFAB(true);
    lastScrollY.current = 0;
  }, [skills, isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    
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

  const formatProficiency = (p: string) => {
    if (!p) return "Basic";
    return p.split(" — ")[0];
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Review your selection">
      <div className="w-full flex flex-col items-center">
        {/* Subtitle */}
        <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] text-center px-[16px] mb-[16px]">
          I need you to modifiy this copy because it is break my design
        </p>

        {/* Skills List */}
        <div 
          onScroll={handleScroll}
          className="flex flex-col gap-[24px] w-full max-h-[400px] overflow-y-auto pr-0 pb-[24px] modal-scrollbar"
        >
          {orderedSkills.map((skill, index) => {
            const skillTags = tags[skill] || [];
            const isPrimary = index === 0;

            return (
              <div 
                key={skill} 
                className="px-[16px]"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", skill);
                  e.dataTransfer.effectAllowed = "move";
                  setTimeout(() => {
                    if (e.target instanceof HTMLElement) {
                      e.target.classList.add("opacity-50", "scale-[1.02]");
                    }
                  }, 0);
                }}
                onDragEnd={(e) => {
                  if (e.target instanceof HTMLElement) {
                    e.target.classList.remove("opacity-50", "scale-[1.02]");
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

                  const fromIdx = orderedSkills.indexOf(draggedSkill);
                  const toIdx = orderedSkills.indexOf(skill);
                  if (fromIdx !== -1 && toIdx !== -1) {
                    const updated = [...orderedSkills];
                    updated.splice(fromIdx, 1);
                    updated.splice(toIdx, 0, draggedSkill);
                    setOrderedSkills(updated);
                    onReorderSkills?.(updated);
                  }
                }}
              >
                <div 
                  onClick={() => onEditTags(skill)}
                  className={`bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[20px] flex flex-col gap-[16px] cursor-pointer transition-all duration-300 border-2 ${
                    isPrimary ? "border-[var(--Text-Primary-Text-brand)] shadow-sm" : "border-transparent"
                  }`}
                  style={{
                    boxShadow: "0px 4px 12px 0px rgba(18,9,0,0.15)"
                  }}
                >
                  {/* Header row: aligned to items-start so controls stay top-right if long text wraps */}
                  <div className="flex items-start justify-between w-full gap-[12px]">
                    {/* Left side wrapper: flex-col cleanly stacks wrapped title and proficiency badge vertically */}
                    <div className="flex flex-col items-start gap-[6px] flex-1 min-w-0">
                      <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[24px] leading-[32px] tracking-[-0.7px] break-words block">
                        {skill}
                      </span>
                      <div className="bg-[var(--Surface-UI-surface-surface-variant)] px-[8px] py-[4px] rounded-[8px] shrink-0">
                        <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-brandPrimary)] text-[12px] leading-[16px] tracking-[1.1px]">
                          {formatProficiency(proficiencies[skill])}
                        </span>
                      </div>
                    </div>

                    {/* Right Controls Wrapper: perfectly aligned to the top alongside the text copy */}
                    <div className="flex items-center gap-[16px] shrink-0 mt-0">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          const fromIdx = orderedSkills.indexOf(skill);
                          if (fromIdx > 0) {
                            const updated = [...orderedSkills];
                            updated.splice(fromIdx, 1);
                            updated.unshift(skill);
                            setOrderedSkills(updated);
                            onReorderSkills?.(updated);
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
                          onRemoveSkill(skill);
                        }}
                        className="shrink-0 flex items-center justify-center"
                      >
                        <CustomAnimatedCheckbox checked={true} />
                      </button>
                    </div>
                  </div>

                  {skillTags.length > 0 && (
                    <div className="flex flex-wrap gap-[12px]">
                      {skillTags.map(tag => (
                        <div key={tag} className="bg-[var(--Mapped-Surface-UI-surface-surface-variant)] px-[12px] py-[12px] rounded-[12px]">
                          <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-Text-brand)] text-[14px] leading-[20px] tracking-[1px]">
                            {tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="w-full flex items-center justify-between px-[16px] pt-[8px]">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary"
            className="min-w-[101px]"
            onClick={onApply || onClose}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Floating Add Button — absolute relative to bottom sheet */}
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0 }}
        animate={{ 
          y: 0, 
          opacity: showFAB ? 1 : 0, 
          scale: showFAB ? 1 : 0 
        }}
        exit={{ y: 60, opacity: 0, scale: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 350 }}
        className="absolute bottom-[100px] right-[16px] z-[60]"
        style={{ pointerEvents: showFAB ? "auto" : "none" }}
      >
        <button
          onClick={() => {
            onClose();
            onAddMore();
          }}
          className="w-[56px] h-[56px] rounded-[16px] bg-[var(--Button-Primary-Surface-default)] shadow-[0px_12px_32px_rgba(18,9,0,0.15),0px_8px_4px_rgba(18,9,0,0.05)] flex items-center justify-center"
        >
          <PlusIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-Body-alt)]" />
        </button>
      </motion.div>
    </BottomSheet>
  );
}
