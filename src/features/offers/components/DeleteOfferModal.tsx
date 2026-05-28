import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import binSlamData from "../../../assets/animations/Bin-slam-Whole.json";

interface DeleteOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  body?: string;
  confirmText?: string;
  cancelText?: string;
}

export function DeleteOfferModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Delete this offer?",
  body = "Are you sure you want to permanently delete this offer? It will be removed from the marketplace and this action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel"
}: DeleteOfferModalProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [phase, setPhase] = useState<'intro' | 'looping'>('intro');
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setIsLooping(false);
      const timer = setTimeout(() => {
        if (lottieRef.current) {
          lottieRef.current.setSpeed(1);
          lottieRef.current.playSegments([0, 26], true);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle intro → loop transition only (delete no longer uses onComplete)
  const handleAnimationComplete = () => {
    if (phase === 'intro' && lottieRef.current) {
      setPhase('looping');
      setIsLooping(true);
      setTimeout(() => {
        lottieRef.current?.playSegments([25, 90], true);
      }, 0);
    }
  };

  const handleDeleteClick = () => {
    if (lottieRef.current) {
      setIsLooping(false);
      lottieRef.current.setSpeed(0.6);
      lottieRef.current.playSegments([93, 95], true);
      // Frames 93-95 = 2 frames @ 60fps @ 0.6x ≈ ~55ms. Use 150ms buffer.
      setTimeout(() => {
        onConfirm();
      }, 150);
    } else {
      onConfirm();
    }
  };

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
              className="w-full max-w-[352px] rounded-[16px] overflow-hidden flex flex-col items-center p-[24px] pointer-events-auto"
              style={{
                background: "linear-gradient(180deg, #BA3430 -229.67%, #FEF6F5 55.67%)",
                boxShadow: "12px 12px 24px -8px rgba(18, 9, 0, 0.00), 0 4px 12px 0 rgba(18, 9, 0, 0.15)"
              }}
            >
              {/* Lottie Animation Container with Circle Background */}
              <div className="w-[88px] h-[88px] bg-white rounded-full flex items-center justify-center mb-[24px] overflow-hidden">
                <Lottie
                  lottieRef={lottieRef}
                  animationData={binSlamData}
                  loop={isLooping}
                  autoplay={false}
                  onComplete={handleAnimationComplete}
                  style={{ width: 124, height: 124, flexShrink: 0 }}
                />
              </div>

              {/* Text Content */}
              <div className="w-full flex flex-col gap-[12px] mb-[40px] text-center">
                <h2 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1.2px]">
                  {title}
                </h2>
                <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
                  {body}
                </p>
              </div>

              {/* Actions */}
              <div className="w-full flex items-center gap-[16px]">
                <button
                  onClick={onClose}
                  className="flex-1 h-[48px] flex items-center justify-center font-['Nunito'] font-bold text-[#49464c] text-[16px] hover:bg-[#f0edf4] rounded-[16px] transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex-1 h-[48px] bg-[#c13733] hover:bg-[#a12d2a] rounded-[16px] flex items-center justify-center transition-colors shadow-skillbeek-xs"
                >
                  <span className="font-['Nunito'] font-bold text-[#fbf6ff] text-[16px]">
                    {confirmText}
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
