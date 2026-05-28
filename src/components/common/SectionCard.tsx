import React from "react";
import { EditIcon } from "./Icons";

interface SectionCardProps {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
  titleClassName?: string;
  className?: string;
}

export function SectionCard({
  title,
  onEdit,
  children,
  titleClassName = "text-[#171519]",
  className = "rounded-[12px] px-[16px] py-[16px] shadow-skillbeek-sm",
}: SectionCardProps) {
  return (
    <div className={`w-full min-w-0 bg-[#faf7fe] flex flex-col gap-[12px] ${className}`}>
      <div className="flex items-center justify-between">
        <span className={`font-['Nunito'] font-bold text-[18px] leading-[28px] ${titleClassName}`}>
          {title}
        </span>
        {onEdit && (
          <button
            onClick={onEdit}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-[#f0edf4] transition-colors -mr-[8px]"
            aria-label="Edit"
          >
            <EditIcon className="w-[20px] h-[20px] text-[#171519]" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
