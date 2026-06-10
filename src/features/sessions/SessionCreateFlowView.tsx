import React, { useState } from "react";
import Lottie from "lottie-react";
import { SaveExitModal } from "../offers/components/SaveExitModal";
import { BackArrowIcon } from "../../components/common/Icons";

// @ts-ignore
import handsJson from "../../assets/animations/offer-create/Hands-ani-final-V4.json";
// @ts-ignore
import settingsJson from "../../assets/animations/offer-create/Settings.json";
// @ts-ignore
import confirmationJson from "../../assets/animations/confirmation-Icon.json";

interface StepData {
  id: number;
  title: string;
  subtitle: string;
  animationType: "json" | "lottie";
  animationData?: any;
  initialSegment?: [number, number];
  customScale?: number;
}

const steps: StepData[] = [
  {
    id: 1,
    title: "Craft Your Offering",
    subtitle: "Define the skill you'll share and its value. Share your level and what makes it stand out.",
    animationType: "json",
    animationData: handsJson,
    customScale: 1.5,
  },
  {
    id: 2,
    title: "Plan Your Session",
    subtitle: "Set your availability and preferred tools. Share what you'd like in return — time, skills, or both.",
    animationType: "json",
    animationData: settingsJson,
    customScale: 1.5,
  },
  {
    id: 3,
    title: "Publish & Connect",
    subtitle: "Your offer is almost live! Just finalize visibility and notes and get ready to connect.",
    animationType: "json",
    animationData: confirmationJson,
    customScale: 1.4,
    initialSegment: [0, 80],
  },
];

function NeumorphicDivider() {
  return (
    <div className="w-full flex items-center justify-center my-[16px]">
      <div
        className="w-full h-[2px] rounded-full bg-[var(--Surface-Primary-Background)]"
        style={{
          boxShadow: "var(--Neumorphic-Divider-Shadow)"
        }}
      />
    </div>
  );
}

const AnimatedStepIcon = ({ step, canPlay, onComplete }: { step: StepData; canPlay: boolean; onComplete: () => void }) => {
  const lottieRef = React.useRef<any>(null);
  const [hasPlayed, setHasPlayed] = React.useState(false);

  React.useEffect(() => {
    if (canPlay && !hasPlayed && lottieRef.current) {
      setHasPlayed(true);
      lottieRef.current.play();

      const timer = setTimeout(() => {
        onComplete();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [canPlay, hasPlayed, onComplete]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={step.animationData}
      loop={false}
      autoplay={false}
      initialSegment={step.initialSegment}
      onComplete={onComplete}
      style={{ width: "100%", height: "100%", transform: `scale(${step.customScale || 1.5})` }}
    />
  );
};

export function SessionCreateFlowView({ onBack, onContinue }: { onBack?: () => void; onContinue?: () => void }) {
  const [finishedSteps, setFinishedSteps] = React.useState(0);
  const [isStep3Visible, setIsStep3Visible] = React.useState(false);
  const [isBottomSeen, setIsBottomSeen] = React.useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const step3Ref = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === step3Ref.current && entry.isIntersecting) {
          setIsStep3Visible(true);
        }
        if (entry.target === bottomRef.current && entry.isIntersecting) {
          setIsBottomSeen(true);
        }
      });
    }, { threshold: 0.1 });

    if (step3Ref.current) observer.observe(step3Ref.current);
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]"></div>
      </div>

      {/* Header Action Buttons */}
      <div className="w-full px-[16px] flex items-center py-[16px] shrink-0 bg-[var(--Surface-Primary-Background)] z-20">
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors shrink-0 pointer-events-auto"
        >
          <BackArrowIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-col relative pt-[0px] pb-[180px] px-[16px] availability-scrollbar">
        {/* Header Texts */}
        <div className="w-full flex flex-col gap-[12px] mt-[8px] mb-[32px]">
          <h1 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[36px] tracking-[-1px]">
            Share Your Skills, Grow Together.
          </h1>
          <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
            It's simple to connect with others, share your expertise, and unlock new learning experiences on Skillbeek. Let's get your first offer ready in three quick steps.
          </p>
        </div>

        {/* Steps List */}
        <div className="w-full flex flex-col gap-[8px]">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const canPlay = isLast ? (finishedSteps >= steps.length - 1 && isStep3Visible) : finishedSteps >= index;

            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div
                  ref={isLast ? step3Ref : null}
                  className="w-full flex items-center justify-between min-h-[64px] gap-[16px]"
                >
                  {/* Number & Text Block */}
                  <div className="flex items-start gap-[8px] flex-1">
                    <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] shrink-0 w-[20px] text-left">
                      {step.id}
                    </span>
                    <div className="flex flex-col gap-[4px] mt-[2px] w-full pr-[12px]">
                      <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] tracking-[0px]">
                        {step.title}
                      </h3>
                      <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 64x64px Animation Icon Container */}
                  <div className="shrink-0 w-[64px] h-[64px] flex items-center justify-center relative bg-[var(--Surface-UI-surface-Surface-Universal-Hover)]/10 rounded-full overflow-visible">
                    <AnimatedStepIcon
                      step={step}
                      canPlay={canPlay}
                      onComplete={() => {
                        if (finishedSteps === index) setFinishedSteps((prev) => prev + 1);
                      }}
                    />
                  </div>
                </div>

                {/* Divider */}
                {!isLast && <NeumorphicDivider />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom CTA Placeholder */}
        <div ref={bottomRef} className="h-[1px] w-full" />
      </div>

      {/* Bottom CTA Block */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center pointer-events-none z-30">
        <div className="w-[calc(100%-4px)] h-[156px] bg-gradient-to-t from-[var(--Surface-Primary-Background)] via-[var(--Surface-Primary-Background)]/90 to-transparent flex items-center justify-center px-[16px] pb-[44px] pointer-events-none">
          <button
            disabled={!isStep3Visible}
            onClick={onContinue}
            className={`w-full max-w-[352px] h-[48px] font-['Nunito'] font-bold text-[16px] rounded-[16px] leading-[24px] tracking-[0.16px] transition-all duration-500 pointer-events-auto
              ${isStep3Visible
                ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] opacity-100 translate-y-0 cursor-pointer"
                : "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed opacity-0 translate-y-10"}`}
          >
            Book Session
          </button>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px] pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]"></div>
      </div>

      <SaveExitModal
        isOpen={isSaveModalOpen}
        onKeepWorking={() => setIsSaveModalOpen(false)}
        onExit={() => {
          setIsSaveModalOpen(false);
          if (onBack) onBack();
        }}
      />
    </div>
  );
}
