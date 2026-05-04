import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";

// @ts-ignore - Ignore TS complaining about webm module
import introVideo from "../../assets/videos/skill-beek-sp-main-export.webm";
import backgroundLottie from "../../assets/animations/skill-beek-no-bg-multi-grad.json";
import logoLottie from "../../assets/animations/Splash-screen-logo-final-v-B7812F.json";

interface SplashViewProps {
  onComplete: () => void;
}

export function SplashView({ onComplete }: SplashViewProps) {
  const [phase, setPhase] = useState<1 | 2>(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    // 9 seconds exactly transition
    const timer = setTimeout(() => {
      setPhase(2);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  const bodyLines = [
    "Connect with skill seekers, exchange",
    "knowledge, and grow your reputation",
  ];

  return (
    <div className="w-full max-w-[384px] h-[812px] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl bg-[#06000c]">
      
      {/* BACKGROUND LOTTIE (Always present, but hidden by video until Phase 2) */}
      <div className="absolute inset-0 z-0">
        <Lottie
          animationData={backgroundLottie}
          loop={true}
          className="w-full h-full object-cover"
        />
      </div>

      {/* TRANSITION OVERLAY (Primary 200 at 85 opacity) */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 z-20 pointer-events-none bg-[#e9d5ff]/85"
          />
        )}
      </AnimatePresence>

      {/* PHASE 1: VIDEO */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 z-30"
          >
            <video
              ref={videoRef}
              src={introVideo}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 2: UI CONTENT */}
      {phase === 2 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-[124px] px-[16px]">
          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center justify-center -mt-[20px]"
          >
            {/* Logo Animation (Cropped and scaled 2x to 416x312 internally) */}
            <div className="w-[312px] h-[160px] overflow-hidden relative flex justify-center">
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-[416px] h-[312px]">
                <Lottie 
                  lottieRef={lottieRef}
                  animationData={logoLottie} 
                  loop={false} 
                  initialSegment={[0, 80]}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
            
            {/* Reintroduced Logotype: 24px spacing below cropped logo */}
            <div className="overflow-hidden mt-[24px]">
              <motion.h1 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                className="font-['Nunito'] font-bold text-[44px] text-[#f0edf4] tracking-[1px] select-none leading-none"
              >
                SKILLBEEK
              </motion.h1>
            </div>
          </motion.div>

          {/* Title Text */}
          <div className="w-full max-w-[352px] flex flex-col items-center mt-[12px]">
            <div className="overflow-hidden mb-[32px] py-1">
              <motion.h2
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="font-['Nunito'] font-bold text-[#f0edf4] text-[24px] leading-[32px] tracking-[-0.7px] text-center whitespace-pre-wrap"
              >
                {`Discover new skills,\nshare what you know`}
              </motion.h2>
            </div>

            {/* Body Text line by line staggered dive */}
            <div className="flex flex-col items-center">
              {bodyLines.map((line, i) => (
                <div key={i} className="overflow-hidden py-[2px] px-[4px]">
                  <motion.p
                    initial={{ y: 30, rotateZ: 5, opacity: 0 }}
                    animate={{ y: 0, rotateZ: 0, opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.25, 1, 0.5, 1],
                      delay: 0.9 + i * 0.15,
                    }}
                    style={{ originX: 0, originY: 1 }}
                    className="font-['Nunito'] font-bold text-[#e0dce3] text-[18px] leading-[28px] text-center"
                  >
                    {line}
                  </motion.p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 10,
              delay: 1.4,
            }}
            className="absolute bottom-[54px] w-full px-[16px] flex justify-center"
          >
            <button
              type="button"
              onClick={onComplete}
              className="w-full max-w-[352px] h-[48px] rounded-[16px] bg-[#b7812f] hover:bg-[#835501] active:bg-[#915d00] flex items-center justify-center transition-colors shadow-[0px_1px_3px_0px_rgba(18,9,0,0.1)] group relative overflow-hidden"
            >
              <span className="font-['Nunito'] font-bold text-[16px] text-[#f5f4f5] tracking-[0.16px]">
                Let's Get Started
              </span>
              {/* Subtle shine effect on hover (optional enhancement) */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
