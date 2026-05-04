import React from "react";
import { motion } from "framer-motion";

interface OfferProgressBarProps {
  currentStep: number; // 1 to 5
  subStepProgress: number; // 0 to 100 (progress of the *current* step)
}

export function OfferProgressBar({ currentStep, subStepProgress }: OfferProgressBarProps) {
  const BEZIER: [number, number, number, number] = [0.24, 0.08, 0.67, 0.99];
  const steps = [1, 2, 3, 4, 5];

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

        // The user requested a transition to 0 roundness when completed (likely to connect seamlessly)
        // We apply it to the right-side corners. If it's 100%, right corners are flat.
        // Wait, what if it's the very last step (5)? It should probably remain rounded on the far right.
        const isComplete = progress === 100;
        const isLastStep = step === 5;
        const targetRadius = isComplete && !isLastStep ? "0px" : "9999px";

        return (
          <div 
            key={step} 
            className="h-[4px] relative bg-[#e0dce3] w-[68.8px]"
            style={{ 
              borderRadius: step === 1 ? "9999px 0 0 9999px" : isLastStep ? "0 9999px 9999px 0" : "0",
              // Wait, if the empty bar is also supposed to be round piecemeal... 
              // Let's just make each segment completely rounded initially to be safe,
              // then flatten right edges if complete.
              // Actually, standard pill segments are typically fully rounded.
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
