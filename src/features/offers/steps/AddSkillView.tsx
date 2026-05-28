import React from "react";
import Lottie from "lottie-react";

// @ts-ignore
import buoyJson from "../../../assets/animations/offer-create/Buoy-ani-5.json";

interface AddSkillViewProps {
  onBack?: () => void;
  onNext?: () => void;
}

export function AddSkillView({ onBack, onNext }: AddSkillViewProps) {
  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center pb-[34px]">
        <div className="px-[16px] w-full flex flex-col items-center">
          {/* Back Button */}
          <div className="w-full pt-[8px] pb-[40px] flex justify-start shrink-0">
            <button
              onClick={onBack}
              className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-gray-100 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>

          {/* Text Headers */}
          <div className="w-full flex flex-col gap-[12px] mt-[16px] mb-[44px]">
            <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1.2px]">
              Add skill
            </h1>
            <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
              Start by selecting up to three skills. Then, refine your selection with at least one specific tag to help others discover your offer
            </p>
          </div>

          {/* Middle Lottie Animation */}
          <div className="flex flex-col items-center justify-center w-full mb-[80px]">
            <div className="w-[328px] h-[324px] flex items-center justify-center relative overflow-visible">
              <Lottie
                animationData={buoyJson}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Bottom CTA Block inside the scrollable area */}
          <div className="w-full flex justify-center px-[0px] mb-[64px]">
            <button
              onClick={onNext}
              className="w-full h-[48px] flex items-center justify-center gap-[6px] bg-[#2f2c32] rounded-[16px] text-[#e0dce3] font-['Nunito'] font-bold text-[16px] leading-[24px] tracking-[0.16px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] hover:bg-[#171519] transition-colors"
            >
              <span>Add skill</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="#E0DCE3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]"></div>
      </div>
    </div>
  );
}
