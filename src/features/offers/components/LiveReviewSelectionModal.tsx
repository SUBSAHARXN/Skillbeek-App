import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, UsersIcon } from "../../../components/common/Icons";
import frame7056 from "./frame-7056.svg";

interface LiveReviewSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  skills: string[];
  tags: Record<string, string[]>;
  roles: Record<string, string>;
  proficiencies: Record<string, string>;
}

export function LiveReviewSelectionModal({
  isOpen,
  onClose,
  title,
  skills,
  tags,
  roles,
  proficiencies,
}: LiveReviewSelectionModalProps) {
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
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="absolute right-[16px] w-[48px] h-[48px] rounded-[32px] flex items-center justify-center bg-[#fbf6ff]"
                  >
                    <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
                  </button>
                </div>
                <div className="w-full h-[1px] bg-[#e0dce3]" />
              </div>

              {/* Skills List */}
              <div 
                className="flex flex-col gap-[24px] w-full max-h-[400px] overflow-y-auto pr-0 pb-[24px] modal-scrollbar"
              >
                {skills.map((skill, index) => {
                  const skillTags = tags[skill] || [];
                  const skillRole = roles[skill];
                  const isPrimary = index === 0;

                  return (
                    <div key={skill} className="px-[16px]">
                      <div 
                        className={`bg-[#faf7fe] rounded-[16px] p-[20px] flex flex-col gap-[16px] transition-all duration-300 border-2 ${
                          isPrimary ? "border-[#b7812f] shadow-sm" : "border-transparent"
                        }`}
                        style={{
                          boxShadow: "0px 4px 12px 0px rgba(18,9,0,0.15)"
                        }}
                      >
                        {/* Header row */}
                        <div className="flex items-start justify-between w-full gap-[12px]">
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
                        </div>

                        {/* Role Badge */}
                        {skillRole && (
                          <div
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#e8fae5] p-2 relative self-start"
                            role="img"
                            aria-label={skillRole}
                          >
                            <img
                              className="relative flex-[0_0_auto]"
                              alt={`${skillRole} icon`}
                              src={frame7056}
                            />
                            <span className="[display:-webkit-box] relative w-fit items-center overflow-hidden text-ellipsis whitespace-nowrap [font-family:'Nunito-Bold',Helvetica] text-xs font-bold leading-4 tracking-[1.10px] text-[#0b3700] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">
                              {skillRole}
                            </span>
                          </div>
                        )}

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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
