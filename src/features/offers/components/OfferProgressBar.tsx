import React from "react";
import { motion } from "framer-motion";

interface OfferProgressBarProps {
  currentStep: number; // 1 to totalSteps
  subStepProgress: number; // 0 to 100 (progress of the *current* step)
  totalSteps?: number; // defaults to 5
}

export function OfferProgressBar({ currentStep, subStepProgress, totalSteps = 5 }: OfferProgressBarProps) {
  const BEZIER: [number, number, number, number] = [0.24, 0.08, 0.67, 0.99];
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  // Dynamic bar width: available width (352px) minus gaps, divided by totalSteps
  const AVAILABLE_WIDTH = 352;
  const GAP_PX = 2;
  const totalGapSpace = (totalSteps - 1) * GAP_PX;
  const barWidth = (AVAILABLE_WIDTH - totalGapSpace) / totalSteps;

  return (
    <div className="w-full flex gap-[2px] items-center justify-center">
      {steps.map((step) => {
        // Calculate progress for this specific segment
        let progress = 0;
        if (step < currentStep) {
          progress = 100; // Past steps are fully filled
        } else if (step === currentStep) {
          progress = subStepProgress; // Current step uses sub-step progress
        } else {
          progress = 0; // Future steps are empty
        }

        const isComplete = progress === 100;
        const isLastStep = step === totalSteps;
        const targetRadius = isComplete && !isLastStep ? "0px" : "9999px";

        return (
          <div 
            key={step} 
            className="h-[4px] relative bg-[#e0dce3]"
            style={{ 
              width: `${barWidth}px`,
              borderRadius: step === 1 ? "9999px 0 0 9999px" : isLastStep ? "0 9999px 9999px 0" : "0",
            }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full bg-[#171519]"
              initial={{ width: `${progress}%` }}
              animate={{ 
                width: `${progress}%`,
                borderTopRightRadius: targetRadius,
                borderBottomRightRadius: targetRadius
              }}
              transition={{
                width: { duration: 0.6, ease: BEZIER },
                borderTopRightRadius: { duration: 0.1, delay: isComplete ? 0.5 : 0 },
                borderBottomRightRadius: { duration: 0.1, delay: isComplete ? 0.5 : 0 },
              }}
              style={{
                borderTopLeftRadius: "9999px",
                borderBottomLeftRadius: "9999px",
              }}
            />
            {/* The empty background of each segment should match the overall shape */}
            <div 
              className="absolute left-0 top-0 h-full w-full border-[1px] border-transparent"
              style={{ 
                borderRadius: "9999px", 
                boxShadow: "inset 0 0 0 1px transparent" // Just structural
              }}
              />
          </div>
        );
      })}
    </div>
  );
}
