import React from "react";
import Lottie from "lottie-react";
import { AnimatePresence, motion } from "framer-motion";
// @ts-ignore
import confirmationIconJSON from "../../assets/animations/confirmation-Icon.json";

interface SuccessAuthModalProps {
  isOpen: boolean;
  onProceed: () => void;
  title?: string;
  message?: string;
  ctaText?: string;
}

export function SuccessAuthModal({
  isOpen,
  onProceed,
  title = "Welcome back",
  message = "We verified your code. You're all set to access your account.",
  ctaText = "Continue to Skillbeek",
}: SuccessAuthModalProps) {
  const lottieRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (isOpen) {
      // Delay playback by ~4 frames (approx 130ms at 30fps, or ~67ms at 60fps)
      // We'll use 100ms as a nice middle ground delay.
      const timer = setTimeout(() => {
        lottieRef.current?.play();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="success-auth-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute inset-0 rounded-[32px] z-50 flex items-center justify-center p-[24px]"
          style={{
            backgroundColor: "var(--mapped\\/surface\\/ui-surface\\/overlay-bg, rgba(47,44,50,0.26))",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <motion.div
            key="success-auth-card"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-center gap-[40px] p-[24px] rounded-[16px] shrink-0 w-full max-w-[352px]"
            style={{
              background: "linear-gradient(0deg, #f4fbf2 55.67%, #349024 229.67%)",
              boxShadow: "12px 12px 24px 0px rgba(18,9,0,0), 0px 4px 12px 0px rgba(18,9,0,0.15)",
            }}
          >
            {/* Lottie Animation Container */}
            <div className="relative shrink-0 w-[88px] h-[88px]">
              <Lottie
                lottieRef={lottieRef}
                animationData={confirmationIconJSON}
                autoplay={false}
                loop={false}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-[16px] items-center text-center w-full">
              <p className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[32px] tracking-[0px] w-full">
                {title}
              </p>
              <div className="font-['Nunito'] font-medium text-[#171519] text-[16px] leading-[24px] tracking-[0.1px] w-full">
                <p>{message}</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="w-full flex items-center justify-center">
              <button
                className="w-full h-[48px] rounded-[16px] bg-[#349024] flex items-center justify-center font-['Nunito'] font-bold text-[16px] text-[#f4fbf2] tracking-[0.16px] hover:bg-[#2a731d] transition-colors"
                style={{
                  boxShadow: "0px 1px 3px 0px rgba(18,9,0,0.1)",
                }}
                onClick={onProceed}
              >
                {ctaText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
