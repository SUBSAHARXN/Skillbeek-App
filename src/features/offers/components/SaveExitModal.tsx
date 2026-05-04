import React from "react";
import Lottie from "lottie-react";
import { AnimatePresence, motion } from "framer-motion";
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="save-exit-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute inset-0 rounded-[32px] z-50 flex items-center justify-center"
          style={{
            backgroundColor: "var(--mapped\\/surface\\/ui-surface\\/overlay-bg)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          onClick={onKeepWorking} // click outside to close
        >
          <motion.div
            key="save-exit-card"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-center gap-[40px] p-[24px] rounded-[16px] shrink-0"
            style={{
              width: "352px",
              background: "linear-gradient(0deg, #f4fbf2 55.67%, var(--mapped\\/surface\\/warning\\/icon-bg-surface, #b85f38) 229.67%)",
              boxShadow: "12px 12px 24px 0px rgba(18,9,0,0), 0px 4px 12px 0px rgba(18,9,0,0.15)",
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
              <button
                className="flex-1 flex items-center justify-center rounded-[16px] transition-colors hover:bg-black/5"
                style={{ height: "48px" }}
                onClick={onExit}
              >
                <span
                  className="font-['Nunito'] font-bold text-center whitespace-nowrap"
                  style={{
                    fontSize: "var(--font-size\\/paragraph, 16px)",
                    lineHeight: "var(--line-height\\/paragraph, 24px)",
                    letterSpacing: "var(--responsive-grid\\/tracking\\/buttons, 0.16px)",
                    color: "var(--mapped\\/text\\/primary\\/caption, #656268)",
                  }}
                >
                  Exit
                </span>
              </button>

              {/* Primary Warning Button -> Keep working */}
              <button
                className="flex-1 flex items-center justify-center rounded-[16px] transition-colors"
                style={{
                  height: "48px",
                  backgroundColor: "var(--mapped\\/surface\\/warning\\/icon-bg-surface, #b85f38)",
                  boxShadow: "0px 1px 3px 0px rgba(18,9,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--mapped\\/surface\\/warning\\/icon-bg-surface-hover, #a3532f)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--mapped\\/surface\\/warning\\/icon-bg-surface, #b85f38)";
                }}
                onClick={onKeepWorking}
              >
                <span
                  className="font-['Nunito'] font-bold text-center whitespace-nowrap"
                  style={{
                    fontSize: "var(--font-size\\/paragraph, 16px)",
                    lineHeight: "var(--line-height\\/paragraph, 24px)",
                    letterSpacing: "var(--responsive-grid\\/tracking\\/buttons, 0.16px)",
                    color: "var(--mapped\\/text\\/warning\\/text-default, #fff6f3)",
                  }}
                >
                  Keep working
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
