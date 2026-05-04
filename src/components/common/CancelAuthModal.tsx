import React from "react";
import Lottie from "lottie-react";
import { AnimatePresence, motion } from "framer-motion";
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
    <AnimatePresence>
      {isOpen && (
        /* ── Backdrop ──────────────────────────────────────────────────── */
        /* Figma: rgba(47,44,50,0.26) + 4px blur — var(--mapped/surface/ui-surface/overlay-bg) */
        <motion.div
          key="cancel-auth-backdrop"
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
          onClick={onKeepWaiting}
        >
          {/* ── Card ───────────────────────────────────────────────────── */}
          {/* Figma: w-352px, padding-24px, gap-40px, rounded-16px        */}
          {/* bg: var(--mapped/surface/warning/bg-surface, #fff6f3)        */}
          {/* shadow: SM — 12px 12px 24px rgba(18,9,0,0) + 0px 4px 12px rgba(18,9,0,0.15) */}
          <motion.div
            key="cancel-auth-card"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-center gap-[40px] p-[24px] rounded-[16px] shrink-0"
            style={{
              width: "352px",
              background: "linear-gradient(0deg, #f4fbf2 55.67%, var(--mapped\\/surface\\/warning\\/icon-bg-surface, #b85f38) 229.67%)",
              boxShadow:
                "12px 12px 24px 0px rgba(18,9,0,0), 0px 4px 12px 0px rgba(18,9,0,0.15)",
            }}
          >
            {/* ── Icon Circle ────────────────────────────────────────── */}
            {/* Figma: size-88px, rounded-[58.212px], overflow-clip       */}
            {/* bg: var(--mapped/surface/warning/bg-surface-padding, #fef0ea) */}
            {/* Shield inner: w-40px h-44px, centered                     */}
            {/*                                                            */}
            {/* MODAL STATE = ANIMATION TRIGGER.                          */}
            {/* This component only mounts when isOpen=true.              */}
            {/* Lottie autoplay fires on mount → plays once → holds frame.*/}
            <div
              className="relative overflow-hidden shrink-0"
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "58.212px",
                backgroundColor:
                  "var(--mapped\\/surface\\/warning\\/bg-surface-padding)",
              }}
            >
              {/* Shield Lottie                                              */}
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
            {/* Figma node 2072:5190 — gap-16px, text-center, w-full     */}
            <div
              className="flex flex-col items-center gap-[16px] text-center w-full"
              style={{ paddingInline: "0px" }}
            >
              {/* Title — Figma: Nunito Bold 28/32 tracking-0, --heading-1 */}
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

              {/* Body — Figma: Nunito Medium 16/24 tracking-0.1px, --body */}
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

            {/* ── Button Row ─────────────────────────────────────────── */}
            <div className="flex flex-col items-center justify-center gap-[16px] w-full">

              {/* ── Ghost / Secondary Button ────────────────────────── */}
              <div
                className="flex items-start rounded-[16px] shrink-0 cursor-pointer w-full"
                onClick={onKeepWaiting}
              >
                <div
                  className="flex gap-[6px] items-center justify-center rounded-[16px] shrink-0 transition-colors hover:bg-black/5 w-full"
                  style={{
                    height: "48px",
                    paddingInline: "var(--gap-width-height\\/16, 16px)",
                    paddingBlock: "var(--gap-width-height\\/12, 12px)",
                  }}
                >
                  <div className="flex flex-col justify-center leading-none shrink-0">
                    <p
                      className="font-['Nunito'] font-bold text-center whitespace-nowrap"
                      style={{
                        fontSize: "var(--font-size\\/paragraph, 16px)",
                        lineHeight: "var(--line-height\\/paragraph, 24px)",
                        letterSpacing:
                          "var(--responsive-grid\\/tracking\\/buttons, 0.16px)",
                        color:
                          "var(--mapped\\/text\\/primary\\/caption, #656268)",
                      }}
                    >
                      No, Keep Waiting
                    </p>
                  </div>
                </div>
              </div>

              {/* ── CTA / Warning Button ────────────────────────────── */}
              <div
                className="flex items-center justify-center relative shrink-0 w-full"
                style={{ height: "48px" }}
                onClick={onConfirmCancel}
              >
                <div
                  className="flex flex-1 gap-0 items-center justify-center rounded-[16px] cursor-pointer transition-colors w-full"
                  style={{
                    minHeight: "1px",
                    minWidth: "1px",
                    paddingInline: "var(--gap-width-height\\/16, 16px)",
                    paddingBlock: "var(--gap-width-height\\/12, 12px)",
                    backgroundColor:
                      "var(--mapped\\/surface\\/warning\\/icon-bg-surface, #b85f38)",
                    boxShadow: "0px 1px 3px 0px rgba(18,9,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--mapped\\/surface\\/warning\\/icon-bg-surface-hover, #a3532f)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--mapped\\/surface\\/warning\\/icon-bg-surface, #b85f38)";
                  }}
                >
                  <div className="flex gap-[6px] items-center justify-center shrink-0">
                    <div className="flex flex-col justify-center leading-none shrink-0">
                      <p
                        className="font-['Nunito'] font-bold text-center whitespace-nowrap"
                        style={{
                          fontSize: "var(--font-size\\/paragraph, 16px)",
                          lineHeight: "var(--line-height\\/paragraph, 24px)",
                          letterSpacing:
                            "var(--responsive-grid\\/tracking\\/buttons, 0.16px)",
                          color:
                            "var(--mapped\\/text\\/warning\\/text-default, #fff6f3)",
                        }}
                      >
                        yes, Cancel
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
