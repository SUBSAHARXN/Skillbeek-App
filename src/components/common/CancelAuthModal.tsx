import React from "react";
import Lottie from "lottie-react";
import { CenterModal } from "../../components/ui/CenterModal";
import { Button } from "../../components/ui/Button";
// @ts-ignore
import warningShieldJSON from "../../assets/animations/Shield-01.json";

interface CancelAuthModalProps {
  isOpen: boolean;
  onKeepWaiting: () => void;
  onConfirmCancel: () => void;
}

export function CancelAuthModal({
  isOpen,
  onKeepWaiting,
  onConfirmCancel,
}: CancelAuthModalProps) {
  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onKeepWaiting}
      zIndex={50}
      className="gap-[40px]"
      style={{
        width: "352px",
        background: "linear-gradient(0deg, #f4fbf2 55.67%, var(--mapped\\/surface\\/warning\\/icon-bg-surface, #b85f38) 229.67%)",
      }}
    >
      {/* ── Icon Circle ────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden shrink-0"
        style={{
          width: "88px",
          height: "88px",
          borderRadius: "58.212px",
          backgroundColor: "var(--mapped\\/surface\\/warning\\/bg-surface-padding)",
        }}
      >
        {/* Shield Lottie */}
        <div
          className="absolute"
          style={{
            width: "92px",
            height: "92px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Lottie
            animationData={warningShieldJSON}
            autoplay={true}
            loop={false}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {/* ── Text Block ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-[16px] text-center w-full">
        {/* Title */}
        <p
          className="font-['Nunito'] font-bold w-full"
          style={{
            fontSize: "var(--font-size\\/h1, 28px)",
            lineHeight: "var(--line-height\\/h2, 32px)",
            letterSpacing: "var(--responsive-grid\\/tracking\\/h2, 0px)",
            color: "var(--mapped\\/text\\/primary\\/heading-1, #171519)",
          }}
        >
          Cancel Authentication?
        </p>

        {/* Body */}
        <p
          className="font-['Nunito'] w-full"
          style={{
            fontWeight: "var(--font-weight\\/400-medium, 500)",
            fontSize: "var(--font-size\\/paragraph, 16px)",
            lineHeight: "var(--line-height\\/paragraph, 24px)",
            letterSpacing: "0.1px",
            color: "var(--mapped\\/text\\/primary\\/body, #171519)",
          }}
        >
          Are you sure you want to stop waiting? This will take you back.
        </p>
      </div>

      {/* ── Button Row (Vertical) ───────────────────────────────── */}
      <div className="flex flex-col items-center justify-center gap-[16px] w-full">
        {/* Ghost / Secondary Button */}
        <Button
          variant="ghost"
          className="w-full no-underline text-[var(--mapped\/text\/primary\/caption,#656268)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] hover:no-underline rounded-[16px] whitespace-nowrap"
          onClick={onKeepWaiting}
        >
          No, Keep Waiting
        </Button>

        {/* CTA / Warning Button */}
        <Button
          variant="primary"
          className="w-full bg-[var(--mapped\/surface\/warning\/icon-bg-surface,#b85f38)] hover:bg-[var(--mapped\/surface\/warning\/icon-bg-surface-hover,#a3532f)] border-0 whitespace-nowrap"
          onClick={onConfirmCancel}
        >
          <span className="text-[var(--mapped\/text\/warning\/text-default,#fff6f3)]">
            yes, Cancel
          </span>
        </Button>
      </div>
    </CenterModal>
  );
}
