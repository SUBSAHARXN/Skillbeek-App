import React from "react";

interface ProficiencyTagProps {
  level: string;
  className?: string;
}

export function ProficiencyTag({ level, className = "" }: ProficiencyTagProps) {
  if (!level) return null;

  // Format if it has extra detail, e.g. "Intermediate — 3+ years" -> "Intermediate"
  const formattedLevel = level.split(" — ")[0];

  return (
    <div className={`bg-[var(--Surface-UI-surface-surface-variant)] p-[8px] rounded-[8px] self-start shrink-0 flex items-center justify-center ${className}`}>
      <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-brandPrimary)] text-[12px] leading-[16px] tracking-[1.1px] text-center">
        {formattedLevel}
      </span>
    </div>
  );
}
