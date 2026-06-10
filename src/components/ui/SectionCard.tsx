import React from "react";
import { EditIcon } from "../common/Icons";

/**
 * Universal SectionCard — Single Source of Truth
 *
 * An elevated card container used throughout the app for
 * displaying editable sections (Title, Session goal, Availability, etc.)
 *
 * Features:
 *   • `onEdit` — makes the whole card clickable with hover/active effects
 *   • `action` — custom trailing element (overrides the default EditIcon)
 *   • `icon` — leading icon element next to the title
 *   • `children` — any content rendered below the header
 *   • `className` — for view-specific overrides (extra padding, margin, etc.)
 *   • `titleClassName` — for overriding the title color
 *   • `noPadding` — disables inner padding (useful when children need full-bleed)
 */

interface SectionCardProps {
  /** Title label shown in the header */
  title: string;
  /** Callback when card or edit icon is tapped */
  onEdit?: () => void;
  /** Card body content */
  children: React.ReactNode;
  /** Override title text color */
  titleClassName?: string;
  /** Override container styles (border-radius, padding, shadow, etc.) */
  className?: string;
  /** Custom trailing action element — replaces the default EditIcon */
  action?: React.ReactNode;
  /** Optional leading icon next to the title */
  icon?: React.ReactNode;
  /** If true, disables the default px/py padding on the container */
  noPadding?: boolean;
}

export function SectionCard({
  title,
  onEdit,
  children,
  titleClassName = "text-[var(--Text-Primary-heading-1)]",
  className = "",
  action,
  icon,
  noPadding = false,
}: SectionCardProps) {
  const isClickable = !!onEdit;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isClickable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onEdit!();
    }
  };

  // Default action is the EditIcon (only when onEdit is provided and no custom action)
  const trailingAction =
    action !== undefined
      ? action
      : onEdit
      ? (
          <div
            className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-transparent text-[var(--Text-Primary-heading-1)] -mr-[8px]"
            aria-hidden="true"
          >
            <EditIcon className="w-[20px] h-[20px]" />
          </div>
        )
      : null;

  return (
    <div
      onClick={isClickable ? onEdit : undefined}
      onKeyDown={handleKeyDown}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`w-full min-w-0 bg-[var(--Surface-UI-surface-surface-elevated)] flex flex-col gap-[12px] select-none rounded-[12px] shadow-skillbeek-sm ${
        noPadding ? "" : "px-[16px] py-[16px]"
      } ${className} ${
        isClickable
          ? "cursor-pointer hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] hover:shadow-skillbeek-md active:scale-[0.995] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--Text-Primary-Text-brand)]/45"
          : ""
      }`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-[8px]">
          {icon && <span className="shrink-0">{icon}</span>}
          <span
            className={`font-['Nunito'] font-bold text-[18px] leading-[28px] ${titleClassName}`}
          >
            {title}
          </span>
        </div>
        {trailingAction}
      </div>

      {/* Body */}
      <div className={isClickable ? "pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}
