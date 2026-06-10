import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "../common/Icons";

interface BottomSheetProps {
  /** Controls visibility of the modal */
  isOpen: boolean;
  /** Fired when the backdrop or close button is clicked */
  onClose?: () => void;
  /** Optional title shown in the header */
  title?: string;
  /** Content of the modal */
  children: React.ReactNode;
  /** Optional custom class name for the sheet container */
  className?: string;
  /** Optional style for overriding things like maxHeight (default is usually 85%) */
  style?: React.CSSProperties;
  /** If true, the header divider will not be shown */
  hideDivider?: boolean;
  /** Optional custom z-index base (defaults to 500) */
  zIndex?: number;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  style = { maxHeight: "85%" },
  hideDivider = false,
  zIndex = 500,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px] rounded-[32px]"
            style={{ zIndex }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`absolute bottom-0 left-0 w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] select-none ${className}`}
            style={{ ...style, zIndex: zIndex + 10 }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center mb-[16px] shrink-0">
              <div className="w-[64px] h-[8px] bg-[var(--Mapped-Surface-UI-surface-surface-variant)] rounded-[4px]" />
            </div>

            {/* Header */}
            {(title || onClose) && (
              <div className="w-full flex items-center justify-between px-[16px] shrink-0 mb-[8px]">
                {/* Spacer to center the title if there's a close button */}
                <div className="w-[48px]" />
                
                {title && (
                  <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] tracking-[-0.2px] text-center flex-1">
                    {title}
                  </h3>
                )}
                
                {onClose ? (
                  <button
                    onClick={onClose}
                    className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] transition-colors"
                    aria-label="Close"
                  >
                    <CloseIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
                  </button>
                ) : (
                  <div className="w-[48px]" />
                )}
              </div>
            )}

            {/* Divider */}
            {title && !hideDivider && (
              <div className="mx-[16px] h-[1px] bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] mb-[24px] shrink-0" />
            )}

            {/* Editable Content Area */}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
