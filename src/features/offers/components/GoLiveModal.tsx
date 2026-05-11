import React, { useRef, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "../../../assets/animations/Lighthouse.json";

interface GoLiveModalProps {
  isOpen: boolean;
  onViewLivePage: () => void;
  onContinue: () => void;
}

export function GoLiveModal({ isOpen, onViewLivePage, onContinue }: GoLiveModalProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[130] flex items-center justify-center bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]">
      <div 
        className="w-[352px] h-[408px] bg-gradient-to-b from-[#fbf6ff] from-[28.36%] to-[#8c35be] to-[697.73%] rounded-[16px] p-[24px] flex flex-col items-center justify-between shadow-[12px_12px_24px_-8px_rgba(18,9,0,0),0px_4px_12px_0px_rgba(18,9,0,0.15)] relative overflow-hidden"
      >
        {/* Lottie Animation (112x112) */}
        <div className="w-[112px] h-[112px] shrink-0">
          <Lottie 
            lottieRef={lottieRef}
            animationData={animationData}
            loop={false}
            autoplay={true}
            style={{ 
              width: "100%", 
              height: "100%",
              maskImage: "radial-gradient(circle, black 45%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(circle, black 45%, transparent 80%)"
            }}
          />
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center gap-[16px] text-center w-full">
          <h2 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[32px]">
            You're live!
          </h2>
          <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
            Your offer is officially published and visible to the community. Partners can now start booking sessions with you.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-[16px] w-full">
          <button
            onClick={onViewLivePage}
            className="w-[144px] h-[48px] rounded-[16px] flex items-center justify-center hover:bg-[#f0edf4] transition-colors"
          >
            <span className="font-['Nunito'] font-bold text-[#737076] text-[16px] leading-[24px]">
              View Live Page
            </span>
          </button>
          <button
            onClick={onContinue}
            className="w-[144px] h-[48px] rounded-[16px] bg-[#b85f38] flex items-center justify-center shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] hover:bg-[#a35331] transition-colors"
          >
            <span className="font-['Nunito'] font-bold text-[#fef6f5] text-[16px] leading-[24px]">
              Continue
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
