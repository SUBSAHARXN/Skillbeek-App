import React from "react";
import Lottie from "lottie-react";
import { CenterModal } from "../../../components/ui/CenterModal";
import { Button } from "../../../components/ui/Button";
// @ts-ignore
import warningShieldJSON from "../../../assets/animations/Shield-01.json";

interface SaveExitModalProps {
  isOpen: boolean;
  onExit: () => void;
  onKeepWorking: () => void;
}

export function SaveExitModal({
  isOpen,
  onExit,
  onKeepWorking,
}: SaveExitModalProps) {
  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onKeepWorking}
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
        <div className="absolute" style={{ width: "92px", height: "92px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Lottie animationData={warningShieldJSON} autoplay={true} loop={false} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      {/* ── Text Block ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-[16px] text-center w-full">
        <p
          className="font-['Nunito'] font-bold w-full"
          style={{
            fontSize: "var(--font-size\\/h1, 28px)",
            lineHeight: "var(--line-height\\/h2, 32px)",
            letterSpacing: "var(--responsive-grid\\/tracking\\/h2, 0px)",
            color: "var(--mapped\\/text\\/primary\\/heading-1, #171519)",
          }}
        >
          Taking a break?
        </p>

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
          We've safely saved your progress. You can easily pick up right where you left off whenever you're ready.
        </p>
      </div>

      {/* ── Button Row (Horizontal) ────────────────────────────── */}
      <div className="flex items-center justify-between gap-[16px] w-full">
        {/* Secondary Button -> Exit */}
        <Button
          variant="ghost"
          className="flex-1 no-underline text-[var(--mapped\/text\/primary\/caption,#656268)] whitespace-nowrap"
          onClick={onExit}
        >
          Exit
        </Button>

        {/* Primary Warning Button -> Keep working */}
        <Button
          variant="primary"
          className="flex-1 bg-[var(--mapped\/surface\/warning\/icon-bg-surface,#b85f38)] hover:bg-[var(--mapped\/surface\/warning\/icon-bg-surface-hover,#a3532f)] border-0 whitespace-nowrap"
          onClick={onKeepWorking}
        >
          <span className="text-[var(--mapped\/text\/warning\/text-default,#fff6f3)]">
            Keep working
          </span>
        </Button>
      </div>
    </CenterModal>
  );
}
