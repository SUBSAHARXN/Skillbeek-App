import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CenterModalProps {
  /** Controls visibility of the modal */
  isOpen: boolean;
  /** Fired when the backdrop is clicked */
  onClose?: () => void;
  /** Content of the modal */
  children: React.ReactNode;
  /** Optional custom class name for the card container */
  className?: string;
  /** Optional style object for the card container */
  style?: React.CSSProperties;
  /** Optional custom z-index base (defaults to 200) */
  zIndex?: number;
}

export function CenterModal({
  isOpen,
  onClose,
  children,
  className = "",
  style = {},
  zIndex = 200,
}: CenterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="center-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 rounded-[32px] backdrop-blur-[4px]"
            style={{
              zIndex,
              backgroundColor: "var(--mapped\\/surface\\/ui-surface\\/overlay-bg, rgba(47,44,50,0.26))",
            }}
          />

          {/* Modal Container */}
          <div
            className="absolute inset-0 flex items-center justify-center p-[24px] pointer-events-none"
            style={{ zIndex: zIndex + 10 }}
          >
            <motion.div
              key="center-modal-card"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-[352px] rounded-[16px] flex flex-col items-center p-[24px] pointer-events-auto select-none ${className}`}
              style={{
                boxShadow: "12px 12px 24px 0px rgba(18,9,0,0), 0px 4px 12px 0px rgba(18,9,0,0.15)",
                ...style,
              }}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
