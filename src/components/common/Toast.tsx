import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  isVisible: boolean;
  message: string;
  onUndo: () => void;
  onClose: () => void;
  bottomOffset?: string;
  actionLabel?: string;
}

export function Toast({ isVisible, message, onUndo, onClose, bottomOffset = "168px", actionLabel = "Undo" }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute left-0 right-0 z-[100] mx-auto w-[calc(100%-32px)] max-w-[352px] bg-[var(--Surface-Success-bg-surface)] rounded-[12px] px-[16px] py-[12px] flex items-center justify-between shadow-[0px_4px_12px_rgba(18,9,0,0.15)]"
          style={{ bottom: bottomOffset }}
          >
            <div className="flex items-center gap-[12px]">
              <div className="bg-[var(--Surface-Success-icon-bg-surface)] rounded-full w-[36px] h-[36px] flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 9L10.5 15L8 12.2727" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                {message}
              </span>
            </div>
            <button
              onClick={() => {
                onUndo();
                onClose();
              }}
              className="px-[8px] py-[4px] -mr-[8px] rounded-[16px] flex items-center justify-center"
            >
              <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px] underline">
                {actionLabel}
              </span>
            </button>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
