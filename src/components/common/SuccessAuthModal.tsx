import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import { CenterModal } from "../../components/ui/CenterModal";
import { Button } from "../../components/ui/Button";
// @ts-ignore
import confirmationIconJSON from "../../assets/animations/confirmation-Icon.json";

interface SuccessAuthModalProps {
  isOpen: boolean;
  onProceed: () => void;
  title?: string;
  message?: string;
  ctaText?: string;
  zIndex?: number;
}

export function SuccessAuthModal({
  isOpen,
  onProceed,
  title = "Welcome back",
  message = "We verified your code. You're all set to access your account.",
  ctaText = "Continue to Skillbeek",
  zIndex = 50,
}: SuccessAuthModalProps) {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Delay playback by ~4 frames (approx 100ms)
      const timer = setTimeout(() => {
        lottieRef.current?.play();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onProceed}
      zIndex={zIndex}
      className="gap-[40px]"
      style={{
        background: "linear-gradient(0deg, #f4fbf2 55.67%, #349024 229.67%)",
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
        <p className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[32px] tracking-[0px] w-full">
          {title}
        </p>
        <div className="font-['Nunito'] font-medium text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px] tracking-[0.1px] w-full">
          <p>{message}</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full flex items-center justify-center">
        <Button
          variant="primary"
          className="w-full bg-[var(--Surface-Success-icon-bg-surface)] hover:bg-[var(--Surface-Success-Hover)] text-[var(--Text-Success-Default)] border-0"
          onClick={onProceed}
        >
          {ctaText}
        </Button>
      </div>
    </CenterModal>
  );
}
