import React from "react";
import Lottie from "lottie-react";
import { CenterModal } from "../../../components/ui/CenterModal";
import { Button } from "../../../components/ui/Button";
import lighthouseData from "../../../assets/animations/Light-house-4.json";

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewLive: () => void;
}

export function GoLiveModal({ isOpen, onClose, onViewLive }: GoLiveModalProps) {
  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      zIndex={200}
      className="bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden"
    >
      {/* Lottie Animation Container with Bleeding Gradient */}
      <div 
        className="w-[112px] h-[112px] flex items-center justify-center mb-[24px] relative"
        style={{
          maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)'
        }}
      >
        <Lottie
          animationData={lighthouseData}
          loop={true}
          style={{ width: 112, height: 112 }}
        />
      </div>

      {/* Text Content */}
      <div className="w-full flex flex-col gap-[12px] mb-[40px] text-center px-[8px]">
        <h2 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[32px] tracking-[-0.7px]">
          You're live!
        </h2>
        <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
          Your offer is officially published and visible to the community. Partners can now start booking sessions with you.
        </p>
      </div>

      {/* Actions */}
      <div className="w-full flex items-center gap-[16px]">
        <Button
          variant="ghost"
          onClick={onViewLive}
          className="flex-1 no-underline text-[var(--Text-Primary-Caption)] hover:bg-[var(--Surface-UI-surface-surface-elevated)] hover:no-underline rounded-[16px] whitespace-nowrap"
        >
          View Live Page
        </Button>
        <Button
          variant="primary"
          onClick={onClose}
          className="flex-1 bg-[var(--Surface-Warning-icon-bg-surface)] hover:bg-[var(--Surface-Warning-icon-bg-surface)] rounded-[16px] shadow-[0px_4px_12px_rgba(184,95,56,0.25)] border-0 whitespace-nowrap"
        >
          <span className="text-[var(--Text-Error-Text-default)]">
            Continue
          </span>
        </Button>
      </div>
    </CenterModal>
  );
}
