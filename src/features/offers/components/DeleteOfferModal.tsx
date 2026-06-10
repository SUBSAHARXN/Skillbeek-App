import React, { useRef, useState, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { CenterModal } from "../../../components/ui/CenterModal";
import { Button } from "../../../components/ui/Button";
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
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      zIndex={200}
      className="overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #BA3430 -229.67%, #FEF6F5 55.67%)",
      }}
    >
      {/* Lottie Animation Container with Circle Background */}
      <div className="w-[88px] h-[88px] bg-[var(--Surface-Primary-Background)] rounded-full flex items-center justify-center mb-[24px] overflow-hidden">
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
        <h2 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[36px] tracking-[-1.2px]">
          {title}
        </h2>
        <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
          {body}
        </p>
      </div>

      {/* Actions */}
      <div className="w-full flex items-center gap-[16px]">
        <Button
          variant="ghost"
          onClick={onClose}
          className="flex-1 no-underline text-[var(--Text-Primary-Body)] hover:bg-[var(--Surface-UI-surface-surface-elevated)] hover:no-underline rounded-[16px]"
        >
          {cancelText}
        </Button>
        <Button
          variant="primary"
          onClick={handleDeleteClick}
          className="flex-1 bg-[var(--mapped\/surface\/error\/icon-bg-surface,var(--Surface-Error-icon-bg-surface))] hover:bg-[var(--mapped\/surface\/error\/icon-bg-surface,var(--Surface-Error-icon-bg-surface))] rounded-[16px] border-0 shadow-skillbeek-xs"
        >
          <span className="text-[var(--mapped\/text\/error\/text-default,var(--Text-Error-Text-default))]">
            {confirmText}
          </span>
        </Button>
      </div>
    </CenterModal>
  );
}
