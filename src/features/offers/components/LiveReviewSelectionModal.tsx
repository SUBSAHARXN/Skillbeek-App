import React from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
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
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      {/* Skills List */}
      <div 
        className="flex flex-col gap-[24px] w-full max-h-[400px] overflow-y-auto pr-0 pb-[24px] pt-[24px] modal-scrollbar"
      >
        {skills.map((skill, index) => {
          const skillTags = tags[skill] || [];
          const skillRole = roles[skill];
          const isPrimary = index === 0;

          return (
            <div key={skill} className="px-[16px]">
              <div 
                className={`bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[20px] flex flex-col gap-[16px] transition-all duration-300 border-2 ${
                  isPrimary ? "border-[var(--Text-Primary-Text-brand)] shadow-sm" : "border-transparent"
                }`}
                style={{
                  boxShadow: "0px 4px 12px 0px rgba(18,9,0,0.15)"
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between w-full gap-[12px]">
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
                </div>

                {/* Role Badge */}
                {skillRole && (
                  <div
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--Surface-Success-bg-surface-padding)] p-2 relative self-start"
                    role="img"
                    aria-label={skillRole}
                  >
                    <img
                      className="relative flex-[0_0_auto]"
                      alt={`${skillRole} icon`}
                      src={frame7056}
                    />
                    <span className="[display:-webkit-box] relative w-fit items-center overflow-hidden text-ellipsis whitespace-nowrap [font-family:'Nunito-Bold',Helvetica] text-xs font-bold leading-4 tracking-[1.10px] text-[var(--Surface-Success-Pressed)] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">
                      {skillRole}
                    </span>
                  </div>
                )}

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
    </BottomSheet>
  );
}
