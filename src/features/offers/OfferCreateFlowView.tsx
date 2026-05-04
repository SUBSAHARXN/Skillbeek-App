import React, { useState } from "react";
import Lottie from "lottie-react";
import { SaveExitModal } from "./components/SaveExitModal";
// @ts-ignore
import { DotLottiePlayer } from "@dotlottie/react-player";

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
        className="w-full h-[2px] rounded-full bg-[#fbf6ff]"
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
    }
  }, [canPlay, hasPlayed]);

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
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder (mocked) */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col relative pt-[16px] pb-[40px] px-[16px]">
        {/* Header Action Buttons */}
        <div className="w-full flex justify-between items-center mb-[40px] shrink-0">
          <button 
            onClick={() => setIsSaveModalOpen(true)}
            className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors"
          >
            <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
              Save and Exit
            </span>
          </button>
          <button className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors">
            <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
              Questions?
            </span>
          </button>
        </div>

        {/* Header Texts */}
        <div className="w-full flex flex-col gap-[12px] mt-[8px] mb-[32px]">
          <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[0px]">
            Create an Offer on Skillbeek
          </h1>
          <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
            Create an offer to showcase what you do best
            <br />
            Whether you're sharing a skill, offering a service, or requesting something in return, this is where great exchanges begin
          </p>
        </div>

        {/* Steps List */}
        <div className="w-full flex flex-col gap-[8px]">
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
                    <span className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] shrink-0 w-[20px] text-left">
                      {step.id}
                    </span>
                    <div className="flex flex-col gap-[4px] mt-[2px] w-full pr-[12px]">
                      <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[0px]">
                        {step.title}
                      </h3>
                      <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 64x64px Animation Icon Container */}
                  <div className="shrink-0 w-[64px] h-[64px] flex items-center justify-center relative bg-[#E0E5EC]/10 rounded-full overflow-visible">
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

        {/* Bottom CTA Block */}
        <div ref={bottomRef} className="w-full pt-[40px] pb-[24px] flex justify-center">
          <button 
            disabled={!isBottomSeen}
            onClick={onContinue}
            className={`w-full h-[48px] font-['Nunito'] font-bold text-[16px] rounded-[16px] leading-[24px] tracking-[0.16px] transition-all
              ${isBottomSeen 
                ? "bg-[#171519] text-[#fbf6ff] shadow-skillbeek-xs hover:bg-[#2f2c32]" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"}`}
          >
            Create My Offer
          </button>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px]">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]">        </div>
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
