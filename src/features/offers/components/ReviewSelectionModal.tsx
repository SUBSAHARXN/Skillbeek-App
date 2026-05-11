import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomAnimatedCheckbox } from "../../../components/common/CustomAnimatedCheckbox";

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
  onRemoveSkill
}: ReviewSelectionModalProps) {
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
            className="absolute bottom-0 left-0 w-full z-50 bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] max-h-[85%]"
          >
            {/* Handle */}
            <div className="w-full flex justify-center">
              <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />
            </div>

            <div className="w-full flex flex-col gap-[32px]">
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
                  Double-check your selected skills and specific tags before moving to the next step.
                </p>
              </div>

              {/* Skills List */}
              <div className="flex flex-col gap-[24px] w-full max-h-[400px] overflow-y-auto pr-0 pb-[92px] modal-scrollbar">
                {skills.map((skill, index) => {
                  const skillTags = tags[skill] || [];
                  const displayedTags = skillTags.slice(0, 2);
                  const extraTagsCount = skillTags.length - 2;

                  return (
                    <div key={skill} className="px-[16px]">
                      <div className="bg-[#faf7fe] rounded-[16px] p-[16px] flex flex-col gap-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-[12px]">
                            <span className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[32px] tracking-[-0.7px]">
                              {skill}
                            </span>
                            <div className="bg-[#f8efff] px-[8px] py-[4px] rounded-[8px]">
                              <span className="font-['Nunito'] font-bold text-[#8c35be] text-[12px] leading-[16px] tracking-[1.1px]">
                                {roles[skill] ? `${roles[skill]} • ` : ""}{formatProficiency(proficiencies[skill])}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => onRemoveSkill(skill)}
                            className="w-[44px] h-[44px] flex items-center justify-center"
                          >
                            <CustomAnimatedCheckbox checked={true} />
                          </button>
                        </div>

                        {skillTags.length > 0 && (
                          <div className="flex flex-wrap gap-[12px]">
                            {displayedTags.map(tag => (
                              <div key={tag} className="bg-[#f0edf4] px-[12px] py-[6px] rounded-[12px]">
                                <span className="font-['Nunito'] font-semibold text-[#b7812f] text-[14px] leading-[20px] tracking-[1px]">
                                  {tag}
                                </span>
                              </div>
                            ))}
                            {extraTagsCount > 0 && (
                              <div className="bg-[#f0edf4] px-[12px] py-[6px] rounded-[12px]">
                                <span className="font-['Nunito'] font-semibold text-[#b7812f] text-[14px] leading-[20px] tracking-[1px]">
                                  +{extraTagsCount}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Floating Add Button — absolute inside phone frame */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-[56px] right-[16px] z-[60]"
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
