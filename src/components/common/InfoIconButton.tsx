import React from "react";
import { InfoIcon } from "./Icons";

interface InfoIconButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  className?: string;
  iconClassName?: string;
}

export function InfoIconButton({
  onClick,
  label = "More information",
  className = "",
  iconClassName = "",
}: InfoIconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)] rounded-full p-[4px] -ml-[4px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Text-Primary-Text-brand)]/45 ${className}`}
      aria-label={label}
    >
      <InfoIcon
        className={`w-[20px] h-[20px] text-[var(--Text-Primary-Subtitle)] ${iconClassName}`}
      />
    </button>
  );
}
