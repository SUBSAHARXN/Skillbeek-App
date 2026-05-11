import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import animationData from '../../../assets/animations/Bin-slam-Whole.json';

interface DeleteOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteOfferModal({ isOpen, onClose, onConfirm }: DeleteOfferModalProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  // Using a ref for the state prevents stale closures inside Lottie's onComplete callback
  const animState = useRef<'intro' | 'looping' | 'outro'>('intro');

  useEffect(() => {
    if (isOpen) {
      animState.current = 'intro';
      if (lottieRef.current) {
        (lottieRef.current as any).loop = false;
        lottieRef.current.playSegments([0, 26], true);
      }
    }
  }, [isOpen]);

  const handleComplete = () => {
    if (animState.current === 'intro') {
      animState.current = 'looping';
      if (lottieRef.current) {
        // Direct mutation avoids React state render delays
        (lottieRef.current as any).loop = true;
        lottieRef.current.setSpeed(0.00001);
        lottieRef.current.playSegments([25, 90], true);
      }
    } else if (animState.current === 'outro') {
      // Small delay before actual unmount for smoothness
      setTimeout(() => onConfirm(), 300);
    }
  };

  const handleDeleteClick = () => {
    animState.current = 'outro';
    if (lottieRef.current) {
      (lottieRef.current as any).loop = false;
      lottieRef.current.setSpeed(0.3);
      lottieRef.current.playSegments([93, 95], true);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[130] flex items-center justify-center px-[16px]"
    >
      <div className="absolute inset-0 bg-[#2f2c3242] backdrop-blur-[4px]" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-[343px] bg-[#faf7fe] rounded-[24px] p-[24px] flex flex-col items-center shadow-xl"
      >
        <div className="w-[120px] h-[120px] mb-[16px]">
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop={false}
            autoplay={false}
            onComplete={handleComplete}
          />
        </div>
        <h2 className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[32px] text-center mb-[8px]">
          Delete this offer?
        </h2>
        <p className="font-['Nunito'] font-medium text-[#656268] text-[16px] leading-[24px] text-center mb-[32px]">
          This action cannot be undone. You will lose all data associated with this offer.
        </p>
        
        <div className="flex w-full gap-[12px]">
          <button
            onClick={onClose}
            className="flex-1 h-[48px] rounded-[16px] bg-[#f0edf4] text-[#171519] font-['Nunito'] font-bold text-[16px] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex-1 h-[48px] rounded-[16px] bg-[#ba1a1a] text-[#ffffff] font-['Nunito'] font-bold text-[16px] transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
