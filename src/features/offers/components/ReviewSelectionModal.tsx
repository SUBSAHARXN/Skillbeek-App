import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomAnimatedCheckbox } from "../../../components/common/CustomAnimatedCheckbox";

function GripIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="5" r="2" />
      <circle cx="4" cy="12" r="2" />
      <circle cx="4" cy="19" r="2" />
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

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

  useEffect(() => {
    setOrderedSkills(skills);
  }, [skills]);

  const formatProficiency = (p: string) => {
    if (!p) return "Basic";
    return p.split(" — ")[0];
  };

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
            className="absolute inset-0 bg-[#2f2c32]/[0.26] z-40 backdrop-blur-[4px] rounded-[32px]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full z-50 bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] max-h-[90%]"
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
                    Review your selection
                  </h3>
                  <button
                    onClick={onClose}
                    className="absolute right-[16px] w-[48px] h-[48px] rounded-[32px] flex items-center justify-center bg-[#fbf6ff]"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="w-full h-[1px] bg-[#e0dce3]" />
                <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] text-center px-[16px]">
                  I need you to modifiy this copy because it is break my design
                </p>
              </div>

              {/* Skills List */}
              <div className="flex flex-col gap-[24px] w-full max-h-[400px] overflow-y-auto pr-0 pb-[24px] modal-scrollbar">
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
                        className={`bg-[#faf7fe] rounded-[16px] p-[20px] flex flex-col gap-[16px] cursor-pointer transition-all duration-300 border-2 ${
                          isPrimary ? "border-[#b7812f] shadow-sm" : "border-transparent"
                        }`}
                        style={{
                          boxShadow: "0px 4px 12px 0px rgba(18,9,0,0.15)"
                        }}
                      >
                        {/* Header row: aligned to items-start so controls stay top-right if long text wraps */}
                        <div className="flex items-start justify-between w-full gap-[12px]">
                          {/* Left side wrapper: flex-col cleanly stacks wrapped title and proficiency badge vertically */}
                          <div className="flex flex-col items-start gap-[6px] flex-1 min-w-0">
                            <span className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[32px] tracking-[-0.7px] break-words block">
                              {skill}
                            </span>
                            <div className="bg-[#f8efff] px-[8px] py-[4px] rounded-[8px] shrink-0">
                              <span className="font-['Nunito'] font-bold text-[#8c35be] text-[12px] leading-[16px] tracking-[1.1px]">
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
                              className="cursor-grab active:cursor-grabbing p-[4px] text-[#c0bcc3] hover:opacity-80 transition-opacity"
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
                              <div key={tag} className="bg-[#f0edf4] px-[12px] py-[12px] rounded-[12px]">
                                <span className="font-['Nunito'] font-semibold text-[#b7812f] text-[14px] leading-[20px] tracking-[1px]">
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
                  <button
                    onClick={onClose}
                    className="font-['Nunito'] font-bold text-[16px] leading-[24px] text-[#49464c] underline px-[16px] py-[12px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onApply || onClose}
                    className="flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] bg-[#171519] text-[#fbf6ff] hover:bg-[#2f2c32] transition-colors shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>

          {/* Floating Add Button — absolute inside phone frame */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-[128px] right-[16px] z-[60]"
          >
            <button
              onClick={() => {
                onClose();
                onAddMore();
              }}
              className="w-[56px] h-[56px] rounded-[16px] bg-[#b7812f] shadow-[0px_12px_32px_rgba(18,9,0,0.15),0px_8px_4px_rgba(18,9,0,0.05)] flex items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbf6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
