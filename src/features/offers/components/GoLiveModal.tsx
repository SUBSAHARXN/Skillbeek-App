import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import lighthouseData from "../../../assets/animations/Light-house-4.json";

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewLive: () => void;
}

export function GoLiveModal({ isOpen, onClose, onViewLive }: GoLiveModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-[200] bg-[#2f2c32]/[0.26] backdrop-blur-[4px]"
          />

          {/* Modal Container */}
          <div className="absolute inset-0 z-[210] flex items-center justify-center p-[16px] pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[352px] bg-[#fbf6ff] rounded-[32px] overflow-hidden flex flex-col items-center p-[24px] pointer-events-auto shadow-[0px_10px_30px_rgba(0,0,0,0.1)]"
            >
              {/* Lottie Animation Container */}
              <div className="w-[112px] h-[112px] flex items-center justify-center mb-[24px]">
                <Lottie
                  animationData={lighthouseData}
                  loop={true}
                  style={{ width: 112, height: 112 }}
                />
              </div>

              {/* Text Content */}
              <div className="w-full flex flex-col gap-[12px] mb-[40px] text-center px-[8px]">
                <h2 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[32px] tracking-[-0.7px]">
                  You're live!
                </h2>
                <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
                  Your offer is officially published and visible to the community. Partners can now start booking sessions with you.
                </p>
              </div>

              {/* Actions */}
              <div className="w-full flex items-center gap-[16px]">
                <button
                  onClick={onViewLive}
                  className="flex-1 h-[48px] flex items-center justify-center font-['Nunito'] font-bold text-[#737076] text-[16px] hover:bg-[#f0edf4] rounded-[16px] transition-colors"
                >
                  View Live Page
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 h-[48px] bg-[#b85f38] hover:bg-[#a15331] rounded-[16px] flex items-center justify-center transition-colors shadow-[0px_4px_12px_rgba(184,95,56,0.25)]"
                >
                  <span className="font-['Nunito'] font-bold text-[#fef6f5] text-[16px]">
                    Continue
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
