import React, { useState } from "react";
import Lottie from "lottie-react";
import { SaveExitModal } from "./components/SaveExitModal";


// @ts-ignore
import handsJson from "../../assets/animations/offer-create/Hands-ani-final-V4.json";
// @ts-ignore
import paperJson from "../../assets/animations/offer-create/Paper-7.json";
// @ts-ignore
import calenderJson from "../../assets/animations/offer-create/Calender-4.json";
// @ts-ignore
import settingsJson from "../../assets/animations/offer-create/Settings.json";
// @ts-ignore
import goliveJson from "../../assets/animations/offer-create/Go-live.json";

interface StepData {
  id: number;
  title: string;
  subtitle: string;
  animationType: "json" | "lottie";
  animationData?: any;
  animationSrc?: string;
  initialSegment?: [number, number];
  customScale?: number;
}

const steps: StepData[] = [
  {
    id: 1,
    title: "Describe Your Offer",
    subtitle: "Define what you are offering and why it matters",
    animationType: "json",
    animationData: handsJson,
  },
  {
    id: 2,
    title: "Set the Terms",
    subtitle: "Clarify what you expect in return and who can swap with you",
    animationType: "json",
    animationData: paperJson,
  },
  {
    id: 3,
    title: "Plan Your Schedule",
    subtitle: "Choose your availability and how you prefer to connect",
    animationType: "json",
    animationData: calenderJson,
  },
  {
    id: 4,
    title: "Offer Settings",
    subtitle: "Set who can see your offer, how long a session lasts, and whether this offer repeats",
    animationType: "json",
    animationData: settingsJson,
  },
  {
    id: 5,
    title: "Preview & Go Live",
    subtitle: "Review your offer details, adjust visibility, and go live",
    animationType: "json",
    animationData: goliveJson,
    initialSegment: [8, 223],
    customScale: 2.1,
  },
];

// Neumorphic horizontal divider utilizing the CSS concept provided by the user
function NeumorphicDivider() {
  return (
    <div className="w-full flex items-center justify-center my-[16px]">
      <div
        className="w-full h-[2px] rounded-full bg-[var(--Surface-Primary-Background)]"
        style={{
          boxShadow: "inset 2px 2px 12px rgba(192, 188, 195, 0.5), inset -2px -2px 12px rgba(255, 255, 255, 0.9)"
        }}
      />
    </div>
  );
}

const AnimatedStepIcon = ({ step, canPlay, onComplete }: { step: StepData, canPlay: boolean, onComplete: () => void }) => {
  const lottieRef = React.useRef<any>(null);
  const [hasPlayed, setHasPlayed] = React.useState(false);

  React.useEffect(() => {
    if (canPlay && !hasPlayed && lottieRef.current) {
      setHasPlayed(true);
      lottieRef.current.play();

      // Trigger the next step after 0.2s regardless of when this one finishes
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

export function OfferCreateFlowView({ onBack, onContinue }: { onBack?: () => void; onContinue?: () => void }) {
  const [finishedSteps, setFinishedSteps] = React.useState(0);
  const [isStep5Visible, setIsStep5Visible] = React.useState(false);
  const [isBottomSeen, setIsBottomSeen] = React.useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const step5Ref = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === step5Ref.current && entry.isIntersecting) {
          setIsStep5Visible(true);
        }
        if (entry.target === bottomRef.current && entry.isIntersecting) {
          setIsBottomSeen(true);
        }
      });
    }, { threshold: 0.1 });

    if (step5Ref.current) observer.observe(step5Ref.current);
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder (mocked) */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]"></div>
      </div>

      {/* Header Action Buttons (Fixed at Top) */}
      <div className="w-full flex justify-between items-center py-[16px] px-[16px] shrink-0 bg-[var(--Surface-Primary-Background)] z-20">
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]"
        >
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">
            Save and Exit
          </span>
        </button>
        <button className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]">
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">
            Questions?
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-col relative pt-[0px] pb-[180px] px-0 availability-scrollbar">


        {/* Header Texts */}
        <div className="w-full flex flex-col gap-[12px] mt-[8px] mb-[32px] px-[16px]">
          <h1 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[36px] tracking-[0px]">
            Create an Offer on Skillbeek
          </h1>
          <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
            Create an offer to showcase what you do best
            <br />
            Whether you're sharing a skill, offering a service, or requesting something in return, this is where great exchanges begin
          </p>
        </div>

        {/* Steps List */}
        <div className="w-full flex flex-col gap-[8px] px-[16px]">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const canPlay = isLast ? (finishedSteps >= steps.length - 1 && isStep5Visible) : finishedSteps >= index;

            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div
                  ref={isLast ? step5Ref : null}
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
                      onComplete={() => { if (finishedSteps === index) setFinishedSteps(prev => prev + 1); }}
                    />
                  </div>
                </div>

                {/* Neumorphic Groove Divider (Don't show on last item) */}
                {!isLast && <NeumorphicDivider />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom CTA Placeholder */}
        <div ref={bottomRef} className="h-[1px] w-full" />
      </div>

      {/* Bottom CTA Block (Fixed) */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center pointer-events-none z-30">
        <div className="w-[calc(100%-4px)] h-[156px] bg-gradient-to-t from-[var(--Surface-Primary-Background)] via-[var(--Surface-Primary-Background)]/90 to-transparent flex items-center justify-center px-[16px] pb-[44px] pointer-events-none">
          <button
            disabled={!isStep5Visible}
            onClick={onContinue}
            className={`w-full max-w-[352px] h-[48px] font-['Nunito'] font-bold text-[16px] rounded-[16px] leading-[24px] tracking-[0.16px] transition-all duration-500 pointer-events-auto
              ${isStep5Visible
                ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] opacity-100 translate-y-0"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-0 translate-y-10"}`}
          >
            Create My Offer
          </button>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px]">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]">        </div>
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
