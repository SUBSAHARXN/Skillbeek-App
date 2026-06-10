import React from "react";

interface SkillTagProps {
  tag: string;
  className?: string;
}

export function SkillTag({ tag, className = "" }: SkillTagProps) {
  if (!tag) return null;

  return (
    <div className={`bg-[var(--Mapped-Surface-UI-surface-surface-variant)] rounded-[12px] p-[12px] flex items-center shrink-0 ${className}`}>
      <span className="font-['Nunito'] font-semibold text-[14px] leading-[20px] text-[var(--Text-Primary-Text-brand)] tracking-[1px] whitespace-nowrap">
        {tag}
      </span>
    </div>
  );
}
