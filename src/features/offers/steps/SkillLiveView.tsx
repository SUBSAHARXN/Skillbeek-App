import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UniversalSkillIcon, BackArrowIcon } from "../../../components/common/Icons";

function PBadge({ size = 16 }: { size?: number }) {
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center animate-fade-in"
      style={{ backgroundColor: "#eacfff", width: size, height: size }}
    >
      <span
        className="font-['Nunito'] font-semibold text-center w-full"
        style={{ fontSize: `${size * 0.5}px`, color: "#380157", letterSpacing: "1.1px", lineHeight: "1" }}
      >
        P
      </span>
    </div>
  );
}

interface SkillLiveViewProps {
  skills: string[];
  proficiencies: Record<string, string>;
  onBack: () => void;
  onSkillClick: (skill: string) => void;
}

export function SkillLiveView({ skills, proficiencies, onBack, onSkillClick }: SkillLiveViewProps) {
  const [activeTab, setActiveTab] = useState("All");
  const [direction, setDirection] = useState(1); // 1 for right-to-left, -1 for left-to-right

  const formatProficiency = (p: string) => {
    if (!p) return "Basic";
    return p.split(" — ")[0]; // e.g., "Intermediate — I can..." -> "Intermediate"
  };

  const tabs = ["All", "Verified", "Provisional"];
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    
    // Check horizontal swipe threshold and ensure it is not mostly a vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      const currentIndex = tabs.indexOf(activeTab);
      if (diffX > 0) {
        // Swiped left -> Next tab
        if (currentIndex < tabs.length - 1) {
          setDirection(1);
          setActiveTab(tabs[currentIndex + 1]);
        }
      } else {
        // Swiped right -> Previous tab
        if (currentIndex > 0) {
          setDirection(-1);
          setActiveTab(tabs[currentIndex - 1]);
        }
      }
    }
  };

  const handleTabClick = (tab: string) => {
    const newIndex = tabs.indexOf(tab);
    const currentIndex = tabs.indexOf(activeTab);
    if (newIndex !== currentIndex) {
      setDirection(newIndex > currentIndex ? 1 : -1);
      setActiveTab(tab);
    }
  };

  const filteredSkills = skills.filter(() => {
    if (activeTab === "Verified") return false;
    return true;
  });

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 15 : -15,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -15 : 15,
    }),
  };

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0 z-10 relative bg-[var(--Surface-Primary-Background)]">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]" />
      </div>

      {/* Header Action Buttons */}
      <div className="w-full px-[16px] flex items-center py-[16px] shrink-0 bg-[var(--Surface-Primary-Background)] z-20">
        <button
          onClick={onBack}
          className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors shrink-0"
        >
          <BackArrowIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
        </button>
      </div>

      {/* Tabs */}
      <div className="w-full px-[16px] flex items-center justify-center gap-[12px] mt-[8px] mb-[24px] shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`font-['Nunito'] font-bold text-[16px] leading-[24px] px-[16px] py-[8px] rounded-[99px] transition-all duration-200 ${
              activeTab === tab ? "bg-[var(--Surface-UI-surface-surface-elevated)] text-[var(--Text-Primary-heading-1)]" : "text-[var(--Text-Primary-Text-placeholder)] hover:bg-[var(--Surface-UI-surface-surface-elevated)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-y-auto px-[16px] pb-[44px] flex flex-col availability-scrollbar"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 flex flex-col gap-[16px]"
          >
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
                <div
                  key={skill}
                  onClick={() => onSkillClick(skill)}
                  className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[16px] flex items-center gap-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.02)] border border-[var(--Surface-UI-surface-surface-elevated)] cursor-pointer hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] transition-colors"
                >
                  <div className="w-[48px] h-[48px] shrink-0 bg-[var(--Surface-Primary-Background)] rounded-full flex items-center justify-center">
                    <UniversalSkillIcon className="w-[32px] h-[32px] text-[var(--Text-Warning-Text-primary)]" />
                  </div>
                  <div className="flex flex-col items-start gap-[8px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[18px] leading-[28px]">
                        {skill}
                      </span>
                      <PBadge size={16} />
                    </div>
                    <div className="bg-[var(--Surface-UI-surface-surface-variant)] px-[8px] py-[8px] rounded-[8px]">
                      <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-brandPrimary)] text-[12px] leading-[16px] tracking-[1.1px] capitalize">
                        {formatProficiency(proficiencies[skill])}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full flex-1 flex flex-col items-center pt-[72px] pb-[48px] text-center px-[24px] shrink-0">
                <svg className="w-[150px] h-[200px] mb-[24px]" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_3749_17193)">
                    <path d="M120.305 257.867C126.112 257.561 178.213 257.425 180.033 258.294C181.664 261.207 185.704 286.455 186.576 291.359C191.397 317.806 195.964 344.298 200.281 370.834C210.864 369.444 222.208 364.005 229.241 355.863C230.468 354.442 231.591 352.931 232.598 351.345C234.115 348.904 236.197 343.777 238.936 343.084C244.279 342.1 245.572 347.823 247.977 351.238C257.951 365.398 275.851 373.074 292.896 372.974C297.293 372.947 298.71 374.326 299.797 378.378C298.17 384.801 289.184 391.098 283.419 393.768C267.405 401.196 248.352 401.074 231.644 396.071C226.58 394.557 222.721 392.273 218.018 390.632L217.737 390.538C201.064 397.795 187.558 399.323 169.773 395.017C160.909 392.182 157.445 390.238 149.868 385.198C127.094 399.86 106.526 401.176 81.6523 390.5C78.7838 391.733 76.0946 393.067 73.1333 394.201C50.7937 402.77 19.7037 402.437 2.48805 383.67C0.591558 381.674 -0.773158 378.847 0.489239 376.111C2.14108 372.533 5.81545 373.076 8.87779 372.947C25.3491 372.252 42.2738 364.664 51.8333 350.862C54.0928 347.691 55.0996 342.403 60.1383 343.206C64.5014 343.901 65.4662 349.577 67.9302 352.923C75.7329 363.517 86.709 368.713 99.2887 370.829C99.9365 363.903 101.821 355.265 102.999 348.242C105.932 330.695 108.99 313.17 112.172 295.67L116.434 271.608C117.102 267.741 117.686 263.683 118.522 259.847C118.712 258.973 119.591 258.393 120.305 257.867Z" fill="url(#paint0_linear_3749_17193)"/>
                    <path d="M147.926 52.0758C157.185 51.4744 156.876 57.3339 159.265 64.1735C160.611 67.9708 162.213 71.6712 164.067 75.2492C173.384 93.1699 189.025 104.836 208.464 109.704C212.513 110.718 215.371 115.78 213.818 119.869C211.73 125.362 207.008 125.16 202.181 126.803C189.866 130.995 178.409 138.494 170.463 148.89C164.224 157.069 160.001 166.456 157.196 176.301C156.487 178.794 153.983 180.363 151.749 181.256C150.138 181.474 149.118 181.563 147.531 181.064C145.913 180.566 144.522 179.508 143.613 178.079C142.218 175.875 141.409 171.23 140.547 168.499C139.449 165.138 138.089 161.868 136.48 158.719C126.918 140.004 111.178 129.329 91.2472 124.904C86.9603 123.675 84.3918 118.727 86.1301 114.565C88.2684 109.431 93.2594 109.492 97.7729 108.151C118.968 101.857 134.653 85.0884 140.916 64.055C142.561 58.5325 141.87 54.6676 147.926 52.0758Z" fill="url(#paint1_linear_3749_17193)"/>
                    <path d="M116.947 230.33C127.727 229.798 142.242 230.225 153.387 230.222H171.257C175.118 230.222 182.563 229.72 185.809 231.494C188.368 232.909 190.244 235.308 190.997 238.135C192.636 244.383 189.185 249.926 182.979 251.485C180.304 251.888 176.136 251.769 173.326 251.766L158.843 251.763L133.927 251.78C128.749 251.78 118.913 252.337 114.259 250.757C108.993 248.969 106.297 240.673 109.508 235.857C111.854 232.335 112.758 231.632 116.947 230.33Z" fill="url(#paint2_linear_3749_17193)"/>
                    <path d="M146.759 194.262C160.928 192.331 175.85 202.423 177.137 217.069C177.94 226.179 175.232 224.309 167.539 224.251L153.787 224.221C150.086 224.221 125.729 224.599 123.411 223.735C122.973 223.299 122.619 222.916 122.556 222.265C121.055 206.731 131.997 196.137 146.759 194.262Z" fill="url(#paint3_linear_3749_17193)"/>
                    <path d="M225.19 34.9946C230.375 34.5712 232.109 36.7777 233.312 41.4009C232.78 43.7139 231.572 45.8838 229.79 47.4293C225.909 50.7914 218.989 59.7671 214.632 61.5793C209.148 62.1914 204.84 58.1766 207.295 52.2653C207.741 51.1892 212.491 46.4212 213.6 45.4441C216.94 42.5031 221.268 36.6674 225.19 34.9946Z" fill="url(#paint4_linear_3749_17193)"/>
                    <path d="M71.6247 35.3273C72.4058 35.2889 74.4455 35.2208 75.1941 35.7184C80.7112 39.7152 85.7054 45.5331 90.5883 50.4381C94.8373 54.7057 93.3108 59.7174 88.0702 61.9403C86.9175 62.0471 85.5617 62.0286 84.4531 61.6705C82.263 60.9633 68.2067 46.7732 67.0959 44.4978C66.3229 42.9141 66.2662 40.9346 66.9531 39.3152C67.8851 37.1187 69.5117 36.1547 71.6247 35.3273Z" fill="url(#paint5_linear_3749_17193)"/>
                    <path d="M239.242 111.383C243.448 111.163 260.168 110.548 263.194 112.452C265.011 113.596 265.599 115.731 266.095 117.681C265.29 121.454 264.534 122.672 260.949 124.225C256.737 124.518 241.473 124.99 238.064 123.581C236.539 122.949 235.08 121.83 234.451 120.257C233.745 118.49 234.371 116.492 235.113 114.844C235.988 112.898 237.314 112.141 239.242 111.383Z" fill="url(#paint6_linear_3749_17193)"/>
                    <path d="M38.8031 111.718C43.2106 111.547 58.2064 111 61.4339 112.365C62.9573 113.009 64.2848 114.152 64.8924 115.719C65.5127 117.319 65.3866 119.411 64.6573 120.956C63.7483 122.881 62.0758 123.941 60.1343 124.623C56.028 124.803 40.7134 125.336 37.523 123.98C35.9451 123.31 34.5922 122.118 34.018 120.471C33.5091 119.011 33.4032 116.921 34.1457 115.527C35.2956 113.369 36.494 112.43 38.8031 111.718Z" fill="url(#paint7_linear_3749_17193)"/>
                    <path d="M207.231 174.017C214.598 173.229 220.722 184.085 226.287 188.502C230.212 191.615 229.506 197.73 223.995 199.853C219.618 200.021 218.554 199.528 215.542 196.116C212.215 192.345 208.191 189.034 204.857 185.26C201.02 180.912 201.784 176.29 207.231 174.017Z" fill="url(#paint8_linear_3749_17193)"/>
                    <path d="M148.878 0.0133918C150.155 -0.0475627 151.396 0.0906225 152.573 0.613013C153.917 1.20932 155.023 2.27396 155.536 3.66599C156.581 6.49058 156.691 26.3682 155.387 28.9828C154.496 30.7673 152.791 31.5451 150.993 32.1279C149.611 32.1685 148.095 32.0571 146.834 31.4541C145.706 30.916 144.451 29.7719 144.07 28.5595C143.097 25.4685 142.949 5.50869 144.346 3.04099C145.295 1.36267 147.113 0.525027 148.878 0.0133918Z" fill="url(#paint9_linear_3749_17193)"/>
                    <path d="M88.8788 174.354C94.6792 173.772 98.4522 178.108 96.8193 182.368C95.5779 185.608 81.8499 199.041 79.2378 200.177C70.1801 200.969 68.59 192.976 74.199 187.992C77.8639 184.734 84.8652 176.029 88.8788 174.354Z" fill="url(#paint10_linear_3749_17193)"/>
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_3749_17193" x1="0" y1="257.633" x2="109.849" y2="489.577" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_3749_17193" x1="85.5804" y1="52.0332" x2="214.976" y2="180.698" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_3749_17193" x1="108.123" y1="230.062" x2="118.815" y2="270.887" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_3749_17193" x1="122.419" y1="194.025" x2="148.224" y2="240.557" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <linearGradient id="paint4_linear_3749_17193" x1="206.589" y1="34.9434" x2="233.286" y2="61.6669" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <linearGradient id="paint5_linear_3749_17193" x1="66.4745" y1="35.3008" x2="93.1708" y2="61.8731" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <linearGradient id="paint6_linear_3749_17193" x1="234.142" y1="111.111" x2="243.739" y2="133.941" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <linearGradient id="paint7_linear_3749_17193" x1="33.6125" y1="111.465" x2="43.2446" y2="134.213" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <linearGradient id="paint8_linear_3749_17193" x1="202.463" y1="173.977" x2="228.365" y2="200.279" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <linearGradient id="paint9_linear_3749_17193" x1="143.318" y1="0" x2="165.692" y2="9.06764" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <linearGradient id="paint10_linear_3749_17193" x1="70.9371" y1="174.301" x2="96.8663" y2="200.563" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#EDF2FF"/>
                      <stop offset="0.5" stop-color="#C9DAFF"/>
                      <stop offset="1" stop-color="#98B5FD"/>
                    </linearGradient>
                    <clipPath id="clip0_3749_17193">
                      <rect width="300" height="400" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[20px] leading-[28px] tracking-[-0.2px]">
                  No verified skills yet.
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]" />
      </div>
    </div>
  );
}
