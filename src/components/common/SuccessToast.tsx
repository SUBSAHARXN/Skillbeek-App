import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessToastProps {
  isVisible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M20 6L9 17L4 12" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export function SuccessToast({ isVisible, message, actionLabel = "Undo", onAction, onClose }: SuccessToastProps) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
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
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="absolute bottom-[80px] left-[16px] right-[16px] z-[300] pointer-events-auto"
        >
          <div className="w-full h-[72px] bg-[#fbf6ff] rounded-[16px] border border-[#f4fbf2] shadow-[0px_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-between px-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[44px] h-[44px] bg-[#349024] rounded-full flex items-center justify-center text-white">
                <CheckIcon className="w-[24px] h-[24px]" />
              </div>
              <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px]">
                {message}
              </span>
            </div>
            
            {onAction && (
              <button
                onClick={onAction}
                className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px] underline hover:opacity-70 transition-opacity px-[8px] whitespace-nowrap"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
