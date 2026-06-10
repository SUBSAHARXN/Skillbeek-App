import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronLeftIcon, BookmarkIcon, BookmarkFilledIcon, PlusIcon, ClockIcon, TimeCreditIcon, MoreIcon, TrashIcon, CloseIcon } from "../../../components/common/Icons";
import { SuccessToast } from "../../../components/common/SuccessToast";
import { GlobalAddTagsModal } from "../components/GlobalAddTagsModal";
import { OfferDuration } from "../../../components/common/OfferDuration";
import { SkillTag } from "../../../components/common/SkillTag";
import { ProficiencyTag } from "../../../components/common/ProficiencyTag";
import { PersonaPfpSet } from "../../../components/common/PersonaPfpSet";
import { NeumorphicDivider } from "../../../components/common/NeumorphicDivider";
import { LiveOfferView } from "./LiveOfferView";
import { SkillSelectView } from "./SkillSelectView";
import { DeleteOfferModal } from "../components/DeleteOfferModal";
import SkillbeekLoader from "../../../components/common/SkillbeekLoader";
import { AllOffersView } from "./AllOffersView";

// Rosette seal/badge component
export function BBadge({ size = 20, children = "B" }: { size?: number; children?: React.ReactNode }) {
  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Star background */}
      <svg
        viewBox="0 0 15.7291 15.7291"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        overflow="visible"
      >
        <path
          d="M6.2127 0.917332C6.97429 -0.305777 8.75476 -0.305777 9.51636 0.917332C9.95654 1.62426 10.7978 1.97271 11.6089 1.7841C13.0123 1.45776 14.2713 2.71674 13.945 4.12014C13.7563 4.93127 14.1048 5.77251 14.8117 6.2127C16.0348 6.97429 16.0348 8.75476 14.8117 9.51636C14.1048 9.95654 13.7563 10.7978 13.945 11.6089C14.2713 13.0123 13.0123 14.2713 11.6089 13.945C10.7978 13.7563 9.95654 14.1048 9.51636 14.8117C8.75476 16.0348 6.97429 16.0348 6.2127 14.8117C5.77251 14.1048 4.93127 13.7563 4.12014 13.945C2.71674 14.2713 1.45776 13.0123 1.7841 11.6089C1.97271 10.7978 1.62426 9.95654 0.917332 9.51636C-0.305778 8.75476 -0.305777 6.97429 0.917332 6.21269C1.62426 5.77251 1.97271 4.93127 1.7841 4.12014C1.45776 2.71674 2.71674 1.45776 4.12014 1.7841C4.93127 1.97271 5.77251 1.62426 6.2127 0.917332Z"
          fill="#171519"
        />
      </svg>
      {/* Dynamic letter/number overlay */}
      <div 
        className="relative z-10 flex items-center justify-center font-['Nunito'] font-bold text-[var(--Text-Success-Default)] leading-none select-none"
        style={{ fontSize: `${size * 0.55}px` }}
      >
        {children}
      </div>
    </div>
  );
}

export function StaticCodeTimerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C16.5563 21 20.25 17.3063 20.25 12.75C20.25 8.19365 16.5563 4.5 12 4.5C7.44365 4.5 3.75 8.19365 3.75 12.75C3.75 17.3063 7.44365 21 12 21Z" stroke="#B85F38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12.75L15.75 9" stroke="#B85F38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.75 1.5H14.25" stroke="#B85F38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CodeTimerIcon({ className }: { className?: string }) {
  const handRef = React.useRef<SVGPathElement>(null);
  const pulseRef = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();
    
    // Hand rotation speed
    const speed = 0.08; 

    const renderLoop = () => {
      const time = Date.now() - startTime;

      // 1. Rotate the clock hand continuously
      if (handRef.current) {
        handRef.current.style.transform = `rotate(${time * speed}deg)`;
      }

      // 2. Subtle heartbeat pulse on the outer ring for urgency
      if (pulseRef.current) {
        const scale = 0.95 + Math.sin(time * 0.005) * 0.05;
        pulseRef.current.style.transform = `scale(${scale})`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }} className={className || "w-full h-full"}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ overflow: "visible" }} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Outer stopwatch body (Pulses) */}
        <g ref={pulseRef} style={{ transformOrigin: "12px 12.75px" }}>
          {/* Main circle */}
          <path 
            d="M12 21C16.5563 21 20.25 17.3063 20.25 12.75C20.25 8.19365 16.5563 4.5 12 4.5C7.44365 4.5 3.75 8.19365 3.75 12.75C3.75 17.3063 7.44365 21 12 21Z" 
            stroke="#B85F38" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Top button */}
          <path 
            d="M9.75 1.5H14.25" 
            stroke="#B85F38" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </g>

        {/* Rotating Hand */}
        <path 
          ref={handRef}
          d="M12 12.75L15.75 9" 
          stroke="#B85F38" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ transformOrigin: "12px 12.75px" }} 
        />
      </svg>
    </div>
  );
}

export function StaticCodeSparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.9996 3.59961C11.9996 10.7996 13.1996 11.9996 20.3996 11.9996C13.1996 11.9996 11.9996 13.1996 11.9996 20.3996C11.9996 13.1996 10.7996 11.9996 3.59961 11.9996C10.7996 11.9996 11.9996 10.7996 11.9996 3.59961Z" fill="#D2A363"/>
      <path d="M18.0004 2.40039C18.0004 5.28039 18.4804 6.00039 21.6004 6.00039C18.4804 6.00039 18.0004 6.72039 18.0004 9.60039C18.0004 6.72039 17.5204 6.00039 14.4004 6.00039C17.5204 6.00039 18.0004 5.28039 18.0004 2.40039Z" fill="#E7C292"/>
      <path d="M7.1998 14.4004C7.1998 16.3204 7.5598 16.8004 9.5998 16.8004C7.5598 16.8004 7.1998 17.2804 7.1998 19.2004C7.1998 17.2804 6.8398 16.8004 4.7998 16.8004C6.8398 16.8004 7.1998 16.3204 7.1998 14.4004Z" fill="#835501"/>
    </svg>
  );
}

export function CodeSparkleIcon({ className }: { className?: string }) {
  const mainRef = React.useRef<SVGPathElement>(null);
  const topRef = React.useRef<SVGPathElement>(null);
  const bottomRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();
    
    // Twinkling speed
    const speed = 0.004; 

    const renderLoop = () => {
      const time = Date.now() - startTime;

      // 1. Main Sparkle: Gentle continuous pulse and slow rotation
      if (mainRef.current) {
        const scaleMain = 0.95 + Math.sin(time * speed) * 0.1; 
        const rotMain = Math.sin(time * speed * 0.5) * 5; 
        mainRef.current.style.transform = `scale(${scaleMain}) rotate(${rotMain}deg)`;
        mainRef.current.style.opacity = String(0.8 + Math.abs(Math.sin(time * speed)) * 0.2);
      }

      // 2. Top Right Sparkle: Pops in and out (offset by +2)
      if (topRef.current) {
        const scaleTop = 0.6 + Math.sin(time * speed * 1.5 + 2) * 0.4;
        topRef.current.style.transform = `scale(${scaleTop})`;
        topRef.current.style.opacity = String(scaleTop); 
      }

      // 3. Bottom Left Sparkle: Pops in and out (offset by +4)
      if (bottomRef.current) {
        const scaleBottom = 0.6 + Math.sin(time * speed * 1.2 + 4) * 0.4;
        bottomRef.current.style.transform = `scale(${scaleBottom})`;
        bottomRef.current.style.opacity = String(scaleBottom);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }} className={className || "w-full h-full"}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ overflow: "visible" }} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main Center Sparkle */}
        <path
          ref={mainRef}
          d="M12.0001 3.59961C12.0001 10.7996 13.2001 11.9996 20.4001 11.9996C13.2001 11.9996 12.0001 13.1996 12.0001 20.3996C12.0001 13.1996 10.8001 11.9996 3.6001 11.9996C10.8001 11.9996 12.0001 10.7996 12.0001 3.59961Z"
          fill="#D2A363"
          style={{ transformOrigin: "12px 12px" }}
        />
        {/* Smaller Top Right Sparkle */}
        <path
          ref={topRef}
          d="M17.9999 2.40039C17.9999 5.28039 18.4799 6.00039 21.5999 6.00039C18.4799 6.00039 17.9999 6.72039 17.9999 9.60039C17.9999 6.72039 17.5199 6.00039 14.3999 6.00039C17.5199 6.00039 17.9999 5.28039 17.9999 2.40039Z"
          fill="#E7C292"
          style={{ transformOrigin: "18px 6px" }}
        />
        {/* Smaller Bottom Left Sparkle */}
        <path
          ref={bottomRef}
          d="M7.1998 14.4004C7.1998 16.3204 7.5598 16.8004 9.5998 16.8004C7.5598 16.8004 7.1998 17.2804 7.1998 19.2004C7.1998 17.2804 6.8398 16.8004 4.7998 16.8004C6.8398 16.8004 7.1998 16.3204 7.1998 14.4004Z"
          fill="#835501"
          style={{ transformOrigin: "7.2px 16.8px" }}
        />
      </svg>
    </div>
  );
}

function PBadge({ size = 16 }: { size?: number }) {
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center"
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

export function CardBookmarkButton({ offerTitle }: { offerTitle: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    setClickCount(prev => prev + 1);
  };

  return (
    <motion.button
      type="button"
      key={`card-bookmark-${clickCount}`}
      onClick={handleClick}
      initial={clickCount > 0 ? { scale: 0.6 } : false}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="flex w-12 h-12 items-center justify-center gap-2 relative bg-[var(--Surface-Primary-Background)] rounded-[32px] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors focus:outline-none origin-center shrink-0"
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark offer"}
    >
      {isBookmarked ? (
        <BookmarkFilledIcon className="!aspect-[1] !relative !w-6 !h-6 text-[var(--Text-Primary-Text-brand)]" />
      ) : (
        <BookmarkIcon className="!aspect-[1] !relative !w-6 !h-6 text-[var(--Text-Primary-Text-brand)]" />
      )}
    </motion.button>
  );
}

export function StaticFlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3856_17955)">
        <path d="M11.9998 0C7.1998 6.4 4.7998 12 4.7998 16.8C4.7998 18.7096 5.55837 20.5409 6.90864 21.8912C8.2589 23.2414 10.0902 24 11.9998 24C13.9094 24 15.7407 23.2414 17.091 21.8912C18.4412 20.5409 19.1998 18.7096 19.1998 16.8C19.1998 12 16.7998 6.4 11.9998 0Z" fill="#BA3430"/>
        <path d="M12.0002 7.19922C8.8002 11.9992 7.2002 15.9992 7.2002 19.1992C7.2002 20.4723 7.70591 21.6932 8.60608 22.5933C9.50626 23.4935 10.7272 23.9992 12.0002 23.9992C13.2732 23.9992 14.4941 23.4935 15.3943 22.5933C16.2945 21.6932 16.8002 20.4723 16.8002 19.1992C16.8002 15.9992 15.2002 11.9992 12.0002 7.19922Z" fill="#D98A68"/>
        <path d="M12.0002 7.19922C8.8002 11.9992 7.2002 15.9992 7.2002 19.1992C7.2002 20.4723 7.70591 21.6932 8.60608 22.5933C9.50626 23.4935 10.7272 23.9992 12.0002 23.9992C13.2732 23.9992 14.4941 23.4935 15.3943 22.5933C16.2945 21.6932 16.8002 20.4723 16.8002 19.1992C16.8002 15.9992 15.2002 11.9992 12.0002 7.19922Z" fill="#D98A68"/>
        <path d="M11.9996 13.1992C10.3996 16.3992 9.59961 18.7992 9.59961 20.3992C9.59961 21.0357 9.85247 21.6462 10.3026 22.0963C10.7526 22.5464 11.3631 22.7992 11.9996 22.7992C12.6361 22.7992 13.2466 22.5464 13.6967 22.0963C14.1468 21.6462 14.3996 21.0357 14.3996 20.3992C14.3996 18.7992 13.5996 16.3992 11.9996 13.1992Z" fill="#FED5C5"/>
      </g>
      <defs>
        <clipPath id="clip0_3856_17955">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function FlameIcon({ className }: { className?: string }) {
  const outerRef = React.useRef<SVGPathElement>(null);
  const midRef = React.useRef<SVGPathElement>(null);
  const innerRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();
    const speed = 0.008;
    const amp = 0.15;

    const renderLoop = () => {
      const time = Date.now() - startTime;
      if (outerRef.current)
        outerRef.current.style.transform = `scaleY(${1 + Math.sin(time * speed) * amp})`;
      if (midRef.current)
        midRef.current.style.transform = `scaleY(${1 + Math.sin(time * speed + 1) * amp})`;
      if (innerRef.current)
        innerRef.current.style.transform = `scaleY(${1 + Math.sin(time * speed + 2) * amp})`;
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      style={{ overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g style={{ transformOrigin: "50% 100%" }}>
        <path
          ref={outerRef}
          d="M60 0C36 32 24 60 24 84C24 93.5478 27.7928 102.705 34.5442 109.456C41.2955 116.207 50.4522 120 60 120C69.5478 120 78.7045 116.207 85.4558 109.456C92.2072 102.705 96 93.5478 96 84C96 60 84 32 60 0Z"
          fill="#BA3430"
          style={{ transformOrigin: "50% 100%" }}
        />
        <path
          ref={midRef}
          d="M60 36C44 60 36 80 36 96C36 102.365 38.5286 108.47 43.0294 112.971C47.5303 117.471 53.6348 120 60 120C66.3652 120 72.4697 117.471 76.9706 112.971C81.4714 108.47 84 102.365 84 96C84 80 76 60 60 36Z"
          fill="#D98A68"
          style={{ transformOrigin: "50% 100%" }}
        />
        <path
          ref={innerRef}
          d="M60 66C52 82 48 94 48 102C48 105.183 49.2643 108.235 51.5147 110.485C53.7652 112.736 56.8174 114 60 114C63.1826 114 66.2348 112.736 68.4853 110.485C70.7357 108.235 72 105.183 72 102C72 94 68 82 60 66Z"
          fill="#FED5C5"
          style={{ transformOrigin: "50% 100%" }}
        />
      </g>
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
    </svg>
  );
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}


interface SkillDetailsViewProps {
  skillName: string;
  proficiency: string;
  tags: string[];
  isAdded: boolean;
  onBack: () => void;
  onCreateOffer?: () => void;
}
const SKILL_TAGS_SUGGESTIONS: Record<string, string[]> = {
  "Visual Design": ["Logo design", "Brand guidelines", "Visual identity", "Typography", "Colour theory"],
  "UI/UX Design": ["Wireframing", "Prototyping", "User flows", "Information architecture", "Usability testing"],
  "Figma Prototyping": ["Component states", "Auto layout", "Variables", "Micro-interactions", "Interactive components"],
  "Experience Design": ["Wireframing", "Prototyping", "User flows", "Information architecture", "Usability testing"],
  "Motion & 3D": ["2D Animation", "3D Modeling", "Video editing", "After Effects", "Character design"],
  "Product Design": ["User research", "Prototyping", "Design thinking", "Figma", "Design systems"],
  "Design Systems": ["Tokens", "Component library", "Documentation", "Storybook", "Figma libraries"],
  "User Research": ["Interviews", "Surveys", "Persona creation", "A/B testing", "Competitive analysis"],
  "Product Management": ["Agile", "Roadmap", "Stakeholder management", "Backlog grooming", "Product lifecycle"],
  "Interaction Design": ["Micro-animations", "User flows", "Prototyping", "Framer", "Lottie"]
};
export function SkillDetailsView({ skillName, proficiency, tags, isAdded, onBack, onCreateOffer }: SkillDetailsViewProps) {
  const [skillStack, setSkillStack] = useState<string[]>([skillName]);
  const currentSkillName = skillStack[skillStack.length - 1];

  const [addedSkillsSet, setAddedSkillsSet] = useState<Set<string>>(new Set(isAdded ? [skillName] : []));
  const isCurrentSkillAdded = addedSkillsSet.has(currentSkillName);

  const [plusClickCount, setPlusClickCount] = useState(0);
  const [bookmarkClickCount, setBookmarkClickCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState<React.ReactNode>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [showSearchSkills, setShowSearchSkills] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [toastAction, setToastAction] = useState<"view" | "undo" | "okay">("view");
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);

  const [isCarouselAtEnd, setIsCarouselAtEnd] = useState(false);
  const [showViewAll, setShowViewAll] = useState(false);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const [skillsTags, setSkillsTags] = useState<Record<string, string[]>>({ [skillName]: tags || [] });
  const [skillsProficiencies, setSkillsProficiencies] = useState<Record<string, string>>({ [skillName]: proficiency || "Intermediate" });

  const [isSetProficiencyOpen, setIsSetProficiencyOpen] = useState(false);
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedProficiency, setSelectedProficiency] = useState("Intermediate");

  const spring = {
    type: "spring" as const,
    stiffness: 220,
    damping: 28,
    mass: 0.9
  };

  // Mock data for the view, lightly randomized based on currentSkillName length
  const hash = currentSkillName.length;
  const relatedSkills = [
    hash % 2 === 0 ? "UI/UX Design" : "Figma Prototyping",
    "Product Design",
    "Interaction Design",
    "Visual Design",
    hash % 3 === 0 ? "User Research" : "Design Systems"
  ];

  const latestOffers = [
    {
      id: 1 + hash,
      badge: { text: "Hot now", type: "hot" },
      time: "Posted 6 hours ago",
      title: `Advanced ${currentSkillName} Practice: Business, Finance, and Tech`,
      tags: [
        { label: currentSkillName, hasBadge: true },
        { label: "Advanced", hasBadge: false }
      ],
      extraTagsCount: 2,
      profile: {
        name: "Isabella Rossi",
        role: "Collaborator",
        rating: 4.7,
        reviewsCount: 34,
        persona: "03" as const
      },
      duration: "60 minutes",
      points: 120,
      receiveSkills: [currentSkillName, "Business Strategy", "Financial Modeling"],
      receiveTags: { 
        [currentSkillName]: ["Advanced practice", "Case studies"],
        "Business Strategy": ["Market analysis", "Growth"],
        "Financial Modeling": ["Valuation", "Forecasting"]
      },
      receiveRoles: { 
        [currentSkillName]: "Collaborator",
        "Business Strategy": "Collaborator",
        "Financial Modeling": "Collaborator"
      },
      receiveProficiencies: { 
        [currentSkillName]: "Advanced — 3-5 years",
        "Business Strategy": "Advanced — 3-5 years",
        "Financial Modeling": "Advanced — 3-5 years"
      }
    },
    {
      id: 2 + hash,
      badge: { text: "Closing soon", type: "closing" },
      time: "Posted 30 days ago",
      title: `Building Scalable ${currentSkillName} Components`,
      tags: [
        { label: "UI/UX Design", hasBadge: true },
        { label: "Intermediate", hasBadge: false }
      ],
      extraTagsCount: 2,
      profile: {
        name: "Kwame Mensah",
        role: "Collaborator",
        rating: 4.7,
        reviewsCount: 34,
        persona: "02" as const
      },
      duration: "45 minutes",
      points: 234,
      isTimeCredit: false,
      requestsCount: 15,
      reviewSkills: [currentSkillName, "Design Systems", "Product Management"],
      reviewTags: { 
        [currentSkillName]: ["Auto layout", "Variables"],
        "Design Systems": ["Tokens", "Component library"],
        "Product Management": ["Agile", "Roadmap"]
      },
      reviewRoles: { 
        [currentSkillName]: "Collaborator",
        "Design Systems": "Collaborator",
        "Product Management": "Collaborator"
      },
      reviewProficiencies: { 
        [currentSkillName]: "Intermediate — 2-3 years",
        "Design Systems": "Intermediate — 2-3 years",
        "Product Management": "Expert — 5+ years"
      },
      receiveSkills: ["Visual Design", "Motion & 3D", "Interaction Design"],
      receiveTags: { 
        "Visual Design": ["Typography", "Color theory"],
        "Motion & 3D": ["2D Animation", "3D Modeling"],
        "Interaction Design": ["Prototyping", "Framer"]
      },
      receiveRoles: { 
        "Visual Design": "Collaborator",
        "Motion & 3D": "Collaborator",
        "Interaction Design": "Collaborator"
      },
      receiveProficiencies: { 
        "Visual Design": "Intermediate — 1-2 years",
        "Motion & 3D": "Basic — 0-1 years",
        "Interaction Design": "Intermediate — 2-3 years"
      }
    },
    {
      id: 3 + hash,
      badge: { text: "New offer", type: "new" },
      time: "",
      title: "Semantic Design Systems for Cross-Platform Accessibility",
      tags: [
        { label: "Product Design", hasProvisionalBadge: true },
        { label: "Expert", hasBadge: false }
      ],
      extraTagsCount: 2,
      profile: {
        name: "David Chen",
        role: "Reviewer",
        rating: 4.0,
        reviewsCount: 12,
        persona: "05" as const
      },
      duration: "120 minutes",
      points: 234,
      isTimeCredit: false,
      requestsCount: 24,
      reviewSkills: ["Product Design", "Interaction Design", "Visual Design"],
      reviewTags: { 
        "Product Design": ["Design systems", "User research"],
        "Interaction Design": ["Micro-interactions", "User flows"],
        "Visual Design": ["Typography", "Brand guidelines"]
      },
      reviewRoles: { 
        "Product Design": "Reviewer",
        "Interaction Design": "Reviewer",
        "Visual Design": "Reviewer"
      },
      reviewProficiencies: { 
        "Product Design": "Expert — 5+ years",
        "Interaction Design": "Expert — 5+ years",
        "Visual Design": "Intermediate — 2-3 years"
      },
      receiveSkills: ["UI/UX Design", "Figma Prototyping", "Experience Design"],
      receiveTags: { 
        "UI/UX Design": ["Prototyping", "Usability testing"],
        "Figma Prototyping": ["Component states", "Auto layout"],
        "Experience Design": ["Wireframing", "User flows"]
      },
      receiveRoles: { 
        "UI/UX Design": "Collaborator",
        "Figma Prototyping": "Collaborator",
        "Experience Design": "Collaborator"
      },
      receiveProficiencies: { 
        "UI/UX Design": "Intermediate — 2-3 years",
        "Figma Prototyping": "Expert — 5+ years",
        "Experience Design": "Intermediate — 2-3 years"
      }
    },
    {
      id: 4 + hash,
      badge: null,
      time: "Posted 2 hours ago",
      title: `Configuring Virtual Environments for ${currentSkillName}`,
      tags: [
        { label: "Cloud Computing", hasBadge: true },
        { label: "Expert", hasBadge: false }
      ],
      extraTagsCount: 2,
      profile: {
        name: "Pierre Dubois",
        role: "Mentor",
        rating: 3.6,
        reviewsCount: 9,
        persona: "11" as const
      },
      duration: "30 minutes",
      points: 45,
      receiveSkills: ["Cloud Computing", "Infrastructure", "DevOps"],
      receiveTags: { 
        "Cloud Computing": ["AWS", "Virtual Environments"],
        "Infrastructure": ["Terraform", "Docker"],
        "DevOps": ["CI/CD", "Automation"]
      },
      receiveRoles: { 
        "Cloud Computing": "Mentor",
        "Infrastructure": "Mentor",
        "DevOps": "Mentor"
      },
      receiveProficiencies: { 
        "Cloud Computing": "Expert — 5+ years",
        "Infrastructure": "Expert — 5+ years",
        "DevOps": "Expert — 5+ years"
      }
    }
  ];

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setIsCarouselAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
      
      const cardWidth = 296; // 280px card + 16px gap
      const currentIndex = Math.round(scrollLeft / cardWidth);
      setShowViewAll(currentIndex >= latestOffers.length - 2);
    }
  };

  const handleRelatedSkillClick = (skill: string) => {
    setIsScreenLoading(true);
    setTimeout(() => {
      setSkillStack(prev => [...prev, skill]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsScreenLoading(false);
    }, 1200);
  };

  const handleBackClick = () => {
    if (skillStack.length > 1) {
      setSkillStack(prev => prev.slice(0, -1));
    } else {
      onBack();
    }
  };

  const handlePlusClick = () => {
    setTempTags(skillsTags[currentSkillName] || []);
    setTagInput("");
    setIsTagModalOpen(true);
  };

  const toggleTempTag = (tag: string) => {
    setTempTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/,$/, "");
      if (val && !tempTags.includes(val) && tempTags.length < 5) {
        setTempTags(prev => [...prev, val]);
      }
      setTagInput("");
    }
  };

  const handleClearTags = () => {
    setTempTags([]);
  };

  const handleApplyTags = () => {
    setIsTagModalOpen(false);
    setSelectedProficiency(skillsProficiencies[currentSkillName] || "Intermediate");
    setIsSetProficiencyOpen(true);
  };

  const handleApplyProficiency = () => {
    setSkillsTags(prev => ({ ...prev, [currentSkillName]: tempTags }));
    setSkillsProficiencies(prev => ({ ...prev, [currentSkillName]: selectedProficiency }));
    setAddedSkillsSet(prev => new Set(prev).add(currentSkillName));
    setPlusClickCount(prev => prev + 1);
    setToastAction("okay");
    setToastMessage(`${currentSkillName} added to your Skills`);
    setToastVisible(true);
    setIsSetProficiencyOpen(false);
  };

  const handleRemoveSkill = () => {
    setShowMoreMenu(false);
    setIsDeleteModalOpen(true);
  };

  const confirmRemoveSkill = () => {
    setAddedSkillsSet(prev => {
      const next = new Set(prev);
      next.delete(currentSkillName);
      return next;
    });
    setIsDeleteModalOpen(false);
    setToastAction("okay");
    setToastMessage(`${currentSkillName} removed`);
    setToastVisible(true);
  };

  const handleBookmarkClick = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    setBookmarkClickCount(prev => prev + 1);
    setToastMessage(newBookmarked ? `${currentSkillName} added to your Bookmarks` : `${currentSkillName} removed from Bookmarks`);
    setToastIcon(<BookmarkIcon className="w-[22px] h-[22px] text-[var(--Text-Primary-Title-alt)]" />);
    setToastAction(newBookmarked ? "view" : "okay");
    setToastVisible(true);
  };

  return (
    <LayoutGroup>
      <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
        {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0 z-10 relative bg-[var(--Surface-Primary-Background)]">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]" />
      </div>

      {/* Header Action Buttons */}
      <div className="w-full px-[16px] flex items-center justify-between py-[16px] shrink-0 bg-[var(--Surface-Primary-Background)] relative">
        {/* Left Back and Title */}
        <div className="flex items-center gap-[12px]">
          <button
            onClick={handleBackClick}
            className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[var(--Surface-Primary-Background)] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors shrink-0"
          >
            <ChevronLeftIcon className="w-[20px] h-[20px] text-[var(--Text-Primary-heading-1)] stroke-[2.5]" />
          </button>
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] tracking-[-0.2px]">
            Skill
          </span>
        </div>

        {/* Right Action Circle Buttons */}
        <div className="flex items-center gap-[12px]">
          {!isCurrentSkillAdded && (
            <motion.button 
              key={`plus-${plusClickCount}`}
              onClick={handlePlusClick}
              initial={plusClickCount > 0 ? { scale: 0.6 } : false}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[var(--Surface-Primary-Background)] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors origin-center focus:outline-none shrink-0"
            >
              <PlusIcon className="w-[20px] h-[20px] text-[var(--Text-Warning-Text-primary)]" />
            </motion.button>
          )}
          {!isCurrentSkillAdded && (
            <motion.button 
              key={`bookmark-${bookmarkClickCount}`}
              onClick={handleBookmarkClick}
              initial={bookmarkClickCount > 0 ? { scale: 0.6 } : false}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[var(--Surface-Primary-Background)] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors origin-center focus:outline-none shrink-0"
            >
              {isBookmarked ? <BookmarkFilledIcon className="w-[20px] h-[20px] text-[var(--Text-Warning-Text-primary)]" /> : <BookmarkIcon className="w-[20px] h-[20px] text-[var(--Text-Warning-Text-primary)]" />}
            </motion.button>
          )}
          {isCurrentSkillAdded && (
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[var(--Surface-Primary-Background)] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors focus:outline-none shrink-0 text-[var(--Text-Primary-heading-1)] relative z-50"
            >
              <MoreIcon className="w-[20px] h-[20px]" />
            </button>
          )}
        </div>
      </div>

      {/* More Options Dropdown */}
      <AnimatePresence>
        {showMoreMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex"
          >
            <div 
              className="absolute inset-0 bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px]" 
              onClick={() => setShowMoreMenu(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-[28px] top-[120px] w-[279px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[8px] flex flex-col gap-[8px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] z-40"
            >
              <button 
                onClick={handleRemoveSkill}
                className="w-full bg-transparent rounded-[12px] px-[16px] py-[12px] flex items-center gap-[12px] hover:bg-[var(--Surface-Error-bg-surface)] active:scale-[0.98] transition-colors text-[var(--Text-Error-primary)] text-left"
              >
                <TrashIcon className="w-[24px] h-[24px] text-[var(--Text-Error-primary)]" />
                <span className="font-['Nunito'] font-bold text-[var(--Text-Error-primary)] text-[16px] leading-[24px]">Remove Skill</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-[16px] pb-[44px] flex flex-col availability-scrollbar">
        {/* Header Section */}
        <div className="w-full flex flex-col gap-[16px] mb-[32px] items-start">
          {isCurrentSkillAdded && <ProficiencyTag level={skillsProficiencies[currentSkillName] || "Intermediate"} />}
          
          <div className="flex items-center gap-[8px] justify-start w-full">
            <h1 className="font-['Nunito'] font-bold text-[28px] leading-[36px] text-[var(--Text-Primary-heading-1)] tracking-[-1.2px] text-left break-words">
              {currentSkillName}
            </h1>
            {isCurrentSkillAdded && (
              <div className="shrink-0 mt-[2px]">
                <PBadge size={20} />
              </div>
            )}
          </div>

          {isCurrentSkillAdded && (
            <div className="flex flex-wrap gap-[8px] mt-[4px]">
              {(skillsTags[currentSkillName] || []).length > 0 ? (
                (skillsTags[currentSkillName] || []).map(tag => (
                  <SkillTag key={tag} tag={tag} />
                ))
              ) : (
                <span className="font-['Nunito'] text-[14px] text-[var(--Text-Primary-Text-placeholder)]">No tags selected.</span>
              )}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        {isCurrentSkillAdded && (
        <div className="w-full flex flex-col gap-[12px] mb-[32px]">
          <h2 className="font-['Nunito'] font-bold text-[18px] leading-[24px] text-[var(--Text-Primary-heading-1)]">
            Recent Sessions
          </h2>
          <div className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] border border-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] py-[24px] flex flex-col items-center justify-center gap-[16px] text-center px-[24px]">
            <svg width="150" height="118" viewBox="0 0 300 236" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <g clipPath="url(#clip0_3767_17431)">
                <path d="M189.176 90.4649C181.186 90.8 173.224 91.5984 165.328 92.8568C159.036 94.0865 147.531 95.888 143.192 101.328C141.562 103.373 140.307 112.985 139.802 116.003C137.235 130.885 135.402 145.887 134.308 160.952C133.704 169.811 133.296 181.21 134.487 189.962C134.888 193.211 135.357 195.812 136.203 199.009C136.591 200.476 137.231 202.317 137.556 203.71L137.933 204.453C138.354 205.553 138.843 206.929 139.318 207.978C144.355 218.431 152.392 226.66 163.302 230.827C181.733 237.872 222.002 237.881 239.985 229.619C250.561 224.761 258.523 215.26 262.573 204.425C263.12 203.127 264.113 198.863 264.683 198.41C267.803 188.18 264.637 140.084 262.664 117.314C261.842 116.5 261.071 107.476 260.784 105.656C260.338 102.832 259.387 100.997 257.058 99.3168C244.523 90.2751 205.268 89.7413 189.176 90.4649Z" fill="url(#paint0_linear_3767_17431)"/>
                <path d="M259.619 117.626C266.376 115.522 274.041 114.919 280.699 117.46C302.55 125.8 303.983 153.891 293.813 171.848C286.174 185.339 275.626 193.323 261.638 198.721C261.375 198.04 263.525 187.836 263.251 186.144C263.202 185.841 263.479 183.866 263.561 183.516C272.194 179.531 279.942 170.895 283.868 162.258C291.711 145.011 283.749 121.799 261.428 131.196C261.285 131.1 261.066 130.917 261.07 130.744C261.109 128.973 259.151 118.533 259.619 117.626ZM263.625 180.415L263.594 181.192C263.609 180.776 263.627 180.359 263.646 179.942C263.638 180.1 263.631 180.257 263.625 180.415ZM261.394 131.326L261.386 131.391C261.389 131.358 261.394 131.329 261.398 131.303C261.396 131.311 261.395 131.318 261.394 131.326Z" fill="url(#paint1_linear_3767_17431)"/>
                <path d="M140.123 205.889C164.658 225.449 229.465 224.437 256.501 208.58C257.817 207.807 261.521 204.681 262.573 204.426C258.523 215.262 250.561 224.762 239.985 229.621C222.002 237.883 181.733 237.873 163.302 230.829C152.392 226.661 144.355 218.432 139.318 207.979C139.696 207.702 139.955 207.439 140.297 207.121C140.534 206.319 140.553 206.719 140.123 205.889Z" fill="url(#paint2_linear_3767_17431)"/>
                <path d="M137.933 204.453C138.59 204.537 139.546 205.431 140.123 205.888C140.553 206.718 140.534 206.318 140.297 207.12C139.955 207.439 139.696 207.702 139.317 207.978C138.843 206.929 138.354 205.554 137.933 204.453Z" fill="url(#paint3_linear_3767_17431)"/>
                <path d="M199.218 138.93C205.638 139.254 203.378 154.043 206.897 157.832C209.75 160.904 223.574 157.661 225.734 161.013C230.006 167.643 212.073 169.92 211.702 175.476C211.308 179.05 216.84 189.534 215.834 192.46C212.945 200.869 202.555 184.932 197.593 183.973C192.749 185.414 188.244 192.279 183.326 193.968C181.691 194.53 179.333 193.314 179.27 191.478C179.093 186.405 184.364 178.78 184.468 174.049C184.545 170.424 171.102 165 170.767 161.425C170.058 153.838 184.652 159.303 188.672 157.902C195.319 155.414 192.386 140.49 199.218 138.93Z" fill="url(#paint4_linear_3767_17431)"/>
                <path d="M197.544 167.463C198.202 167.27 198.911 167.449 199.403 167.929C199.892 168.408 200.088 169.117 199.912 169.784C199.738 170.449 199.22 170.968 198.556 171.141C197.552 171.408 196.519 170.811 196.244 169.804C195.966 168.799 196.545 167.754 197.544 167.463Z" fill="url(#paint5_linear_3767_17431)"/>
                <path d="M189.162 164.76C191.207 165.214 191.334 166.535 189.794 167.789C188.749 167.381 187.874 167.052 187.888 165.799C188.27 165.14 188.488 165.1 189.162 164.76Z" fill="url(#paint6_linear_3767_17431)"/>
                <path d="M206.534 165.783C207.66 165.7 208.442 165.658 208.704 166.944C208.498 167.7 208.294 167.788 207.703 168.295C206.544 168.401 205.896 168.363 205.656 167.095C205.833 166.349 205.975 166.291 206.534 165.783Z" fill="url(#paint7_linear_3767_17431)"/>
                <path d="M198.469 157.494C200.393 158.549 200.209 159.694 198.816 161.097C196.66 160.213 197.039 158.804 198.469 157.494Z" fill="url(#paint8_linear_3767_17431)"/>
                <path d="M191.621 176.008C192.102 175.805 192.657 175.893 193.053 176.235C193.45 176.578 193.618 177.117 193.49 177.626C193.359 178.134 192.954 178.526 192.443 178.636C191.748 178.785 191.054 178.379 190.842 177.698C190.628 177.018 190.965 176.285 191.621 176.008Z" fill="url(#paint9_linear_3767_17431)"/>
                <path d="M203.005 176.281C203.675 175.956 204.479 176.231 204.814 176.896C205.147 177.563 204.887 178.375 204.231 178.723C203.795 178.952 203.271 178.928 202.858 178.659C202.446 178.391 202.208 177.919 202.24 177.427C202.27 176.934 202.563 176.496 203.005 176.281Z" fill="url(#paint10_linear_3767_17431)"/>
                <path d="M181.356 162.454C181.862 162.275 182.418 162.529 182.619 163.029C182.819 163.529 182.591 164.098 182.104 164.321C181.767 164.474 181.374 164.43 181.081 164.206C180.788 163.981 180.641 163.612 180.698 163.248C180.756 162.882 181.007 162.575 181.356 162.454Z" fill="url(#paint11_linear_3767_17431)"/>
                <path d="M186.812 183.186C187.301 183.039 187.82 183.292 188.013 183.768C188.203 184.243 188.001 184.787 187.547 185.022C187.214 185.195 186.812 185.163 186.508 184.938C186.205 184.715 186.055 184.339 186.12 183.969C186.183 183.597 186.453 183.294 186.812 183.186Z" fill="url(#paint12_linear_3767_17431)"/>
                <path d="M214.972 164.056C215.422 163.806 215.99 163.951 216.266 164.387C216.543 164.825 216.432 165.402 216.014 165.706C215.721 165.919 215.334 165.951 215.011 165.788C214.686 165.627 214.478 165.298 214.471 164.934C214.462 164.572 214.655 164.233 214.972 164.056Z" fill="url(#paint13_linear_3767_17431)"/>
                <path d="M198.858 149.586C199.327 149.482 199.795 149.767 199.924 150.231C200.052 150.696 199.797 151.182 199.341 151.335C199.024 151.445 198.673 151.367 198.429 151.134C198.186 150.903 198.089 150.555 198.178 150.231C198.269 149.906 198.531 149.657 198.858 149.586Z" fill="url(#paint14_linear_3767_17431)"/>
                <path d="M194.405 95.8057C203.455 95.4914 248.343 96.4325 252.102 103.52C252.136 104.169 252.124 104.497 251.66 104.981C246.524 110.347 216.048 111.955 208.405 112.081C198.683 112.797 157.797 111.292 151.068 105.328C150.624 104.934 150.23 104.403 150.248 103.778C150.261 103.327 150.519 102.941 150.822 102.63C155.873 97.4304 186.556 96.1012 194.405 95.8057Z" fill="url(#paint15_linear_3767_17431)"/>
                <path d="M43.9087 72.2139C42.2479 75.358 41.6236 82.2677 41.0194 86.0248C37.5702 108.438 32.2504 156.116 38.5637 167.521C39.0078 167.888 40.665 175.336 41.4136 176.966C45.4485 188.028 53.3126 197.334 64.0434 202.33C80.466 209.973 120.543 210.215 137.378 203.785C137.438 203.761 137.497 203.735 137.556 203.711C137.231 202.318 136.591 200.476 136.203 199.01C135.357 195.813 134.888 193.211 134.487 189.963C133.295 181.211 133.704 169.812 134.307 160.953C135.402 145.888 137.235 130.886 139.801 116.003C140.307 112.986 141.561 103.374 143.192 101.329C147.531 95.8887 159.036 94.0872 165.327 92.8577C164.077 91.9131 163.219 74.9741 160.472 71.2358C156.727 66.1351 144.504 63.8701 138.314 62.8545C127.164 61.0251 115.746 60.465 104.459 60.3356C91.0029 60.1815 57.5268 61.2546 46.4553 69.3826C45.3812 70.1712 44.5398 71.019 43.9087 72.2139Z" fill="url(#paint16_linear_3767_17431)"/>
                <path d="M2.23536 101.857C8.28767 84.9325 25.1679 78.4837 41.5492 84.531C40.9867 88.1272 40.3379 95.1383 39.6786 98.2418C34.0916 96.0254 28.6105 94.3058 22.7403 97.0156C10.9717 102.448 11.6637 119.089 16.2258 129.161C20.2539 138.054 28.5407 146.822 37.4799 150.824C38.0117 155.707 38.4482 160.542 39.255 165.392C39.2825 165.557 39.1663 165.864 39.0935 166.027C24.0118 160.104 11.9971 150.81 4.69634 135.834C-0.18579 125.379 -1.68655 112.823 2.23536 101.857Z" fill="url(#paint17_linear_3767_17431)"/>
                <path d="M41.4135 176.966L41.7426 176.9C46.3151 180.549 51.4232 183.766 56.897 185.818C76.8022 193.28 103.155 193.99 124.009 191.602C127.521 191.188 131.016 190.642 134.487 189.964C134.888 193.212 135.357 195.814 136.203 199.01C136.591 200.477 137.231 202.318 137.556 203.711C137.497 203.761 137.497 203.735 137.378 203.785C120.543 210.216 80.4659 209.973 64.0433 202.33C53.3129 197.334 45.4485 188.029 41.4135 176.966Z" fill="url(#paint18_linear_3767_17431)"/>
                <path d="M93.4634 65.9753C106.695 65.2547 140.33 66.1408 151.482 71.7255C152.433 72.2011 153.307 72.6809 153.664 73.736C153.581 74.2402 153.553 74.4369 153.21 74.838C148.69 80.1256 118.253 81.7844 110.923 82.1065C99.5003 82.5317 60.9197 81.5903 52.6899 75.5759C52.0611 75.1166 51.7032 74.7239 51.566 73.9268C51.6592 73.4292 51.7605 73.0921 52.1061 72.7095C56.6482 67.6878 86.3682 66.2494 93.4634 65.9753Z" fill="url(#paint19_linear_3767_17431)"/>
                <path d="M101.264 110.076C102.316 109.969 103.345 109.977 104.374 110.242C106.2 110.696 107.755 111.896 108.662 113.551C110.904 117.597 108.979 121.911 105.005 123.865C105.004 125.012 105.039 126.204 105.057 127.354C106.613 127.376 113.227 127.004 113.977 127.971C117.606 132.657 107.277 131.538 105.04 131.534C105.014 134.414 104.85 151.484 105.51 153.528C106.831 155.14 108.333 154.577 110.018 154.02C114.772 152.453 117.626 148.763 119.739 144.386C119.458 144.195 119.182 143.996 118.911 143.791C117.966 143.059 117.996 142.135 118.724 141.44C124.732 135.72 125.662 136.486 125.648 144.531C125.645 146.41 123.541 145.413 123.248 146.215C120.963 152.459 116.884 158.024 110.596 160.59C107.531 161.82 106.082 162.099 103.454 164.314C103.041 164.525 103.032 164.475 102.554 164.561C101.559 164.304 100.913 163.647 100.038 163.054C97.9884 161.663 95.5706 161.112 93.2505 159.921C89.2392 157.863 86.1269 154.866 84.0314 150.847C83.244 149.336 82.8026 147.501 81.8725 146.018C81.6304 145.953 81.3356 145.867 81.0884 145.893C78.5133 146.152 79.7074 142.856 79.6981 141.466C79.6757 138.166 81.1301 136.538 83.9887 139.008C84.9887 139.872 87.0375 141.494 86.9502 142.858C86.5647 143.62 86.3816 143.684 85.6699 144.229L85.4469 144.396C87.51 148.536 90.2686 152.29 94.756 153.908C96.5424 154.553 99.49 155.387 99.8625 152.575C100.152 150.387 100.101 147.959 100.131 145.734L100.219 131.536C98.1272 131.457 92.2783 131.984 91.3663 130.917C87.2964 126.158 99.2537 127.316 100.172 127.33L100.191 123.879C98.1637 122.798 96.6511 121.588 95.9175 119.285C95.3418 117.43 95.5278 115.42 96.4353 113.704C97.5447 111.615 99.1508 110.767 101.264 110.076Z" fill="url(#paint20_linear_3767_17431)"/>
                <path d="M101.999 114.321C103.507 114.005 104.995 114.94 105.37 116.441C105.744 117.944 104.87 119.473 103.391 119.906C102.382 120.201 101.293 119.92 100.553 119.17C99.8126 118.422 99.5395 117.325 99.8411 116.314C100.143 115.303 100.971 114.538 101.999 114.321Z" fill="url(#paint21_linear_3767_17431)"/>
                <path d="M93.2343 0.000113924C93.8738 -0.00426497 93.9107 0.116355 94.2375 0.575941C94.2 1.21446 92.6964 2.85058 92.2074 3.48633C88.3048 8.55929 85.3731 16.6292 88.6997 22.703C91.7932 28.6639 99.1388 26.9545 104.01 28.5693C118.298 33.3066 112.094 49.2752 101.608 54.057C100.927 54.3671 100.432 54.6733 99.732 54.4321C99.3987 53.7979 99.5 54.1535 99.6563 53.271C101.673 47.6697 99.3958 42.6458 93.8844 40.7695C88.9595 39.0928 84.5061 39.6035 79.7035 36.934C76.2844 35.0535 73.767 31.8648 72.7226 28.0924C69.1275 15.2031 81.7896 3.16228 93.2343 0.000113924Z" fill="#EDF2FF"/>
                <path d="M210.952 83.2292C210.329 83.3716 210.267 83.2618 209.849 82.8837C209.749 82.2521 210.867 80.3293 211.208 79.6028C213.932 73.8048 215.066 65.2903 210.515 60.0782C206.217 54.9258 199.41 58.1833 194.307 57.6593C179.338 56.1224 181.975 39.1866 191.191 32.25C191.789 31.7998 192.207 31.3937 192.942 31.478C193.404 32.0254 193.229 31.6997 193.265 32.5955C192.495 38.5017 195.797 42.9155 201.581 43.5559C206.749 44.1287 210.989 42.6672 216.251 44.2356C219.993 45.3327 223.135 47.9024 224.963 51.3605C231.236 63.1705 221.451 77.6667 210.952 83.2292Z" fill="#f9f4ee"/>
              </g>
              <defs>
                <linearGradient id="paint0_linear_3767_17431" x1="133.722" y1="90.2383" x2="278.774" y2="221.894" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="0.5" stopColor="#f4dcbf"/>
                  <stop offset="1" stopColor="#E7C292"/>
                </linearGradient>
                <linearGradient id="paint1_linear_3767_17431" x1="259.547" y1="115.789" x2="324.8" y2="147.537" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="0.5" stopColor="#f4dcbf"/>
                  <stop offset="1" stopColor="#E7C292"/>
                </linearGradient>
                <linearGradient id="paint2_linear_3767_17431" x1="139.318" y1="204.426" x2="154.474" y2="263.641" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="0.5" stopColor="#f4dcbf"/>
                  <stop offset="1" stopColor="#E7C292"/>
                </linearGradient>
                <linearGradient id="paint3_linear_3767_17431" x1="137.933" y1="204.453" x2="141.273" y2="206.851" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="0.5" stopColor="#f4dcbf"/>
                  <stop offset="1" stopColor="#E7C292"/>
                </linearGradient>
                <linearGradient id="paint4_linear_3767_17431" x1="170.742" y1="138.93" x2="226.713" y2="194.578" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="0.5" stopColor="#f4dcbf"/>
                  <stop offset="1" stopColor="#E7C292"/>
                </linearGradient>
                <linearGradient id="paint5_linear_3767_17431" x1="199.975" y1="171.205" x2="196.157" y2="167.404" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="1" stopColor="#f4dcbf"/>
                </linearGradient>
                <linearGradient id="paint6_linear_3767_17431" x1="190.837" y1="167.789" x2="187.809" y2="164.84" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="1" stopColor="#f4dcbf"/>
                </linearGradient>
                <linearGradient id="paint7_linear_3767_17431" x1="208.704" y1="168.333" x2="206.154" y2="165.326" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="1" stopColor="#f4dcbf"/>
                </linearGradient>
                <linearGradient id="paint8_linear_3767_17431" x1="199.887" y1="161.097" x2="196.472" y2="158.642" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="1" stopColor="#f4dcbf"/>
                </linearGradient>
                <linearGradient id="paint9_linear_3767_17431" x1="193.532" y1="178.667" x2="190.766" y2="175.912" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="1" stopColor="#f4dcbf"/>
                </linearGradient>
                <linearGradient id="paint10_linear_3767_17431" x1="204.959" y1="178.879" x2="202.224" y2="176.157" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="1" stopColor="#f4dcbf"/>
                </linearGradient>
                <linearGradient id="paint11_linear_3767_17431" x1="182.691" y1="164.411" x2="180.677" y2="162.406" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="1" stopColor="#f4dcbf"/>
                </linearGradient>
                <linearGradient id="paint12_linear_3767_17431" x1="188.084" y1="185.132" x2="186.096" y2="183.153" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="1" stopColor="#f4dcbf"/>
                </linearGradient>
                <linearGradient id="paint13_linear_3767_17431" x1="216.418" y1="165.891" x2="214.461" y2="163.943" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="1" stopColor="#f4dcbf"/>
                </linearGradient>
                <linearGradient id="paint14_linear_3767_17431" x1="199.957" y1="151.384" x2="198.137" y2="149.572" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="1" stopColor="#f4dcbf"/>
                </linearGradient>
                <linearGradient id="paint15_linear_3767_17431" x1="150.247" y1="95.7539" x2="155.451" y2="127.895" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f4ee"/>
                  <stop offset="0.5" stopColor="#f4dcbf"/>
                  <stop offset="1" stopColor="#E7C292"/>
                </linearGradient>
                <linearGradient id="paint16_linear_3767_17431" x1="35.6276" y1="60.3223" x2="182.375" y2="188.897" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EDF2FF"/>
                  <stop offset="0.5" stopColor="#C9DAFF"/>
                  <stop offset="1" stopColor="#98B5FD"/>
                </linearGradient>
                <linearGradient id="paint17_linear_3767_17431" x1="41.5492" y1="166.027" x2="-25.1269" y2="132.937" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EDF2FF"/>
                  <stop offset="1" stopColor="#C9DAFF"/>
                </linearGradient>
                <linearGradient id="paint18_linear_3767_17431" x1="41.4135" y1="176.9" x2="60.0048" y2="233.726" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EDF2FF"/>
                  <stop offset="0.5" stopColor="#C9DAFF"/>
                  <stop offset="1" stopColor="#98B5FD"/>
                </linearGradient>
                <linearGradient id="paint19_linear_3767_17431" x1="51.566" y1="65.7598" x2="56.7236" y2="97.7999" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EDF2FF"/>
                  <stop offset="0.5" stopColor="#C9DAFF"/>
                  <stop offset="1" stopColor="#98B5FD"/>
                </linearGradient>
                <linearGradient id="paint20_linear_3767_17431" x1="79.4296" y1="110.012" x2="133.239" y2="155.603" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EDF2FF"/>
                  <stop offset="0.5" stopColor="#C9DAFF"/>
                  <stop offset="1" stopColor="#98B5FD"/>
                </linearGradient>
                <linearGradient id="paint21_linear_3767_17431" x1="99.7203" y1="114.26" x2="105.482" y2="119.995" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EDF2FF"/>
                  <stop offset="0.5" stopColor="#C9DAFF"/>
                  <stop offset="1" stopColor="#98B5FD"/>
                </linearGradient>
                <clipPath id="clip0_3767_17431">
                  <rect width="300" height="236" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span className="font-['Nunito'] font-semibold text-[14px] leading-[20px] text-[var(--Text-Primary-Body)]">
              When you complete a session, it will show up right here.
            </span>
            <button 
              onClick={onCreateOffer}
              className="mt-[8px] px-[24px] py-[12px] bg-[var(--Button-Primary-Surface-default)] hover:bg-[var(--Button-Primary-Surface-default)] active:scale-[0.98] text-[var(--Text-Primary-Body-alt)] rounded-[16px] font-['Nunito'] font-bold text-[14px] leading-[20px] tracking-[0.16px] transition-all duration-150 shadow-[0px_1px_3px_0px_rgba(18,9,0,0.1)]"
            >
              Create an Offer
            </button>
          </div>
        </div>
        )}

        {/* Related Skills */}
        <div className="w-full flex flex-col gap-[12px] mb-[32px]">
          <h2 className="font-['Nunito'] font-bold text-[18px] leading-[24px] text-[var(--Text-Primary-heading-1)]">
            Related Skills
          </h2>
          <div className="flex flex-wrap gap-[8px]">
            {relatedSkills.map(related => (
              <button 
                key={related} 
                onClick={() => handleRelatedSkillClick(related)}
                className="px-[16px] py-[8px] bg-[var(--Surface-Primary-Background)] border border-[var(--Surface-UI-surface-surface-elevated)] rounded-[99px] flex items-center shadow-skillbeek-xs hover:bg-[var(--Surface-UI-surface-surface-elevated)] active:scale-[0.98] transition-all duration-150"
              >
                <span className="font-['Nunito'] font-semibold text-[14px] leading-[20px] text-[var(--Text-Primary-heading-1)]">
                  {related}
                </span>
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowSearchSkills(true)}
            className="self-start h-[48px] p-0 mt-[-6px] flex items-center justify-start font-['Nunito'] font-bold text-[16px] leading-[24px] text-[var(--Text-Primary-heading-1)] underline tracking-[-0.2px] hover:text-[var(--Text-Primary-Body)] transition-colors"
          >
            Show more Skills
          </button>
        </div>

        {/* Latest Offers */}
        <div className="w-full flex flex-col gap-[16px] mb-[24px]">
          <h2 className="font-['Nunito'] font-bold text-[18px] leading-[24px] text-[var(--Text-Primary-heading-1)]">
            Latest offers with skill
          </h2>
          <div className="overflow-hidden -mx-4 relative">
            {!isCarouselAtEnd && (
              <div className="absolute right-0 top-[16px] h-[520px] w-[48px] bg-gradient-to-l from-[var(--Surface-Primary-Background)] via-[var(--Surface-Primary-Background)]/80 to-transparent pointer-events-none z-[2]" />
            )}
            
            {/* Floating View all Button — uses tween transition to avoid spring re-trigger "dancing", but keeps whileTap bounce */}
            <div className="absolute inset-y-0 left-[16px] right-[16px] pointer-events-none z-[10]">
              <motion.button
                initial={false}
                animate={{
                  scale: (!isScreenLoading && !selectedOfferId && showViewAll) ? 1 : 0.85,
                  opacity: (!isScreenLoading && !selectedOfferId && showViewAll) ? 1 : 0,
                  y: "-50%"
                }}
                transition={{ type: "tween", duration: 0.2 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  // Small delay to allow the whileTap scale bounce to be seen
                  setTimeout(() => setShowAllOffers(true), 150);
                }}
                style={{
                  pointerEvents: (!isScreenLoading && !selectedOfferId && showViewAll) ? "auto" : "none"
                }}
                className="absolute top-1/2 right-0 inline-flex items-center justify-center gap-[6px] px-[16px] py-[12px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] rounded-[16px] shadow-[0_1px_3px_0_rgba(18,9,0,0.10)]"
              >
                <span className="font-['Nunito'] font-bold text-[var(--Button-UI-comp-sur-Text-primary)] text-[16px] leading-[24px]">
                  View all
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAF8FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.button>
            </div>

            <div 
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex gap-[16px] overflow-x-auto px-4 py-4 snap-x snap-mandatory hide-scrollbar" 
              style={{ minHeight: 572 }}
            >
            {latestOffers.map((offer) => (
              <motion.main
                layoutId={`offer-${offer.id}-container`}
                onClick={() => {
                  setIsScreenLoading(true);
                  setTimeout(() => {
                    setSelectedOfferId(offer.id);
                    setIsScreenLoading(false);
                  }, 1200);
                }}
                key={offer.id}
                transition={{ layout: spring }}
                whileHover={{ y: -3, scale: 1.015 }}
                className="cursor-pointer flex flex-col justify-between items-start p-4 relative bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[32px] shadow-[0px_12px_32px_0px_rgba(23,21,25,0.08)] shrink-0 w-[280px] h-[520px] select-none snap-center overflow-hidden"
              >
                <header className="flex flex-col w-full items-start gap-3 bg-transparent relative flex-[0_0_auto]">
                  <div className="flex items-center justify-between self-stretch w-full relative flex-[0_0_auto]">
                    {offer.badge ? (
                      <div className={`inline-flex items-center gap-1.5 p-3 rounded-xl relative flex-[0_0_auto] ${
                        offer.badge.type === 'hot' ? 'bg-[var(--Surface-Error-bg-surface)]' :
                        offer.badge.type === 'closing' ? 'bg-[var(--Surface-Warning-bg-surface)]' :
                        'bg-[var(--Surface-Information-bg-surface)]'
                      }`}>
                        <div className="relative w-6 h-6" aria-hidden="true">
                          {offer.badge.type === 'hot' && <FlameIcon className="w-full h-full" />}
                          {offer.badge.type === 'closing' && <CodeTimerIcon />}
                          {offer.badge.type === 'new' && <CodeSparkleIcon />}
                        </div>
                        <div className={`relative w-fit [font-family:'Nunito-Bold',Helvetica] font-bold text-sm tracking-[1.00px] leading-5 whitespace-nowrap overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] ${
                          offer.badge.type === 'hot' ? 'text-[var(--Text-Error-primary)]' :
                          offer.badge.type === 'closing' ? 'text-[var(--Text-Primary-Text-brand)]' :
                          'text-[var(--Text-Information-primary)]'
                        }`}>
                          {offer.badge.text}
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}
                    <CardBookmarkButton offerTitle={offer.title} />
                  </div>
                  <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                    {offer.time ? (
                      <div className="inline-flex items-center gap-1.5 relative flex-[0_0_auto]">
                        <ClockIcon className="!relative !w-6 !h-6 text-[var(--Text-Primary-Subtitle)] stroke-[2.5]" />
                        <div className="relative flex items-center w-fit [font-family:'Nunito-SemiBold',Helvetica] font-semibold text-[var(--Text-Primary-Subtitle)] text-sm tracking-[1px] leading-5 whitespace-nowrap">
                          {offer.time}
                        </div>
                      </div>
                    ) : (
                      <div className="h-[24px]" />
                    )}
                    <motion.h1 
                      layoutId={`offer-${offer.id}-title`}
                      layout="position"
                      transition={{ layout: spring }}
                      className="[display:-webkit-box] items-center self-stretch tracking-normal overflow-hidden text-ellipsis [-webkit-line-clamp:3] [-webkit-box-orient:vertical] relative [font-family:'Nunito-Bold',Helvetica] font-bold text-[var(--Text-Primary-heading-1)] text-lg leading-[28px] h-[84px]"
                    >
                      {offer.title}
                    </motion.h1>
                  </div>
                  <div className="flex-col items-start flex gap-1 relative self-stretch w-full flex-[0_0_auto]">
                    <div className="flex flex-wrap items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                      <div className="flex flex-wrap gap-1.5 items-center relative flex-[0_0_auto]">
                        {offer.tags.map((tag, tagIndex) =>
                          tag.hasBadge ? (
                            <div
                              key={tagIndex}
                              className="gap-1.5 p-2 bg-[var(--Surface-UI-surface-surface-variant)] rounded-lg inline-flex items-center relative flex-[0_0_auto]"
                            >
                              <div className="relative [display:-webkit-box] items-center w-fit mt-[-1.00px] [font-family:'Nunito-Bold',Helvetica] font-bold text-[var(--Text-Primary-Body)] text-xs tracking-[1.10px] leading-4 whitespace-nowrap overflow-hidden text-ellipsis [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                                {tag.label}
                              </div>
                              <BBadge size={16}>{(tag as any).badgeText || "B"}</BBadge>
                            </div>
                          ) : (
                            <div
                              key={tagIndex}
                              className="inline-flex items-center justify-center gap-2.5 p-2 relative flex-[0_0_auto] bg-[var(--Surface-UI-surface-surface-variant)] rounded-lg"
                            >
                              <div className="relative w-fit mt-[-1.00px] [font-family:'Nunito-Bold',Helvetica] font-bold text-[var(--Text-Primary-Text-brandPrimary)] text-xs tracking-[1.10px] leading-4 whitespace-nowrap overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                                {tag.label}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      {offer.extraTagsCount > 0 && (
                        <div className="inline-flex items-center justify-center p-2 relative flex-[0_0_auto]">
                          <button
                            type="button"
                            className="all-[unset] box-border inline-flex gap-1.5 self-stretch flex-[0_0_auto] rounded-2xl items-center justify-center relative"
                            data-mapped-colour-styles-mode="light"
                            aria-label={`Show ${offer.extraTagsCount} more categories`}
                          >
                            <div className="flex w-fit mt-[-1.00px] [font-family:'Nunito-Bold',Helvetica] font-bold text-[var(--Text-Primary-Subtitle)] text-xs text-center tracking-[0.16px] leading-6 whitespace-nowrap items-center justify-center relative">
                              +{offer.extraTagsCount}
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </header>
                <section
                  className="flex flex-col items-start gap-2 relative self-stretch w-full"
                  aria-label={`${offer.profile.name} profile summary`}
                >
                  <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                    <motion.div 
                      layoutId={`offer-${offer.id}-author`}
                      transition={{ layout: spring }}
                      className="items-center gap-3 flex relative flex-1 grow"
                    >
                      <div 
                        className="relative w-10 h-10 shrink-0 rounded-full"
                        style={{
                          border: "4px solid var(--mapped\\/surface\\/ui-surface-stroke, #eacfff)",
                          boxSizing: "content-box"
                        }}
                      >
                        <PersonaPfpSet
                          className="w-full h-full rounded-full"
                          persona={offer.profile.persona}
                        />
                      </div>
                      <div className="flex-col items-start justify-center gap-2 flex relative flex-1 grow min-w-0">
                        <div className="items-center gap-1.5 inline-flex relative flex-[0_0_auto]">
                          <div className="flex-col items-start gap-1 inline-flex relative flex-[0_0_auto]">
                            <h2 className="relative flex items-end w-fit mt-[-1.00px] [font-family:'Nunito-Bold',Helvetica] font-bold text-[var(--Text-Primary-heading-1)] text-base tracking-[1.00px] leading-6 whitespace-nowrap">
                              {offer.profile.name}
                            </h2>
                            <p 
                              className="relative w-fit whitespace-nowrap"
                              style={{
                                color: "#656268",
                                fontFamily: "var(--Typeface-Nunito, Nunito)",
                                fontSize: "var(--Font-size-Subtitle, 14px)",
                                fontStyle: "normal",
                                fontWeight: "var(--Font-weight-600-semi-bold, 600)" as any,
                                lineHeight: "var(--Line-height-Subtitle, 20px)",
                                letterSpacing: "var(--Responsive-grid-Tracking-Subtitle, 1px)"
                              }}
                            >
                              {offer.profile.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                          <div
                            className="inline-flex items-center gap-1 relative flex-[0_0_auto]"
                            aria-label={`Rating ${offer.profile.rating.toFixed(1)} out of 5`}
                          >
                            <div className="inline-flex items-center gap-1.5 relative flex-[0_0_auto]">
                              <StarIcon className="relative w-4 h-4 aspect-[1] text-[var(--Text-Primary-Text-brand)]" />
                            </div>
                            <div className="relative flex items-end w-fit mt-[-1.00px] [font-family:'Nunito-Bold',Helvetica] font-bold text-[var(--Text-Primary-Subtitle)] text-sm tracking-[1.00px] leading-5 whitespace-nowrap">
                              {offer.profile.rating.toFixed(1)}
                            </div>
                          </div>
                          <div className="w-px h-3 relative bg-[var(--Text-Primary-Subtitle)]/40" aria-hidden="true" />
                          <div className="inline-flex items-center justify-center relative flex-[0_0_auto]">
                            <button
                              type="button"
                              className="all-[unset] box-border inline-flex items-center justify-center gap-1.5 relative self-stretch flex-[0_0_auto] rounded-2xl cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--Surface-UI-surface-Surface-Universal-alternate)]"
                              data-mapped-colour-styles-mode="light"
                              aria-label={`${offer.profile.reviewsCount} reviews`}
                            >
                              <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Nunito-Bold',Helvetica] font-bold text-[var(--Text-Primary-Text-brandPrimary)] text-sm text-center tracking-[1.00px] leading-5 whitespace-nowrap">
                                {offer.profile.reviewsCount} reviews
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <NeumorphicDivider className="my-0 w-full" />
                  <motion.div layoutId={`offer-${offer.id}-duration`} transition={{ layout: spring }} className="w-full">
                    <OfferDuration
                      duration={offer.duration}
                      price={offer.points}
                      isTimeCredit={(offer as any).isTimeCredit}
                    />
                  </motion.div>
                </section>
              </motion.main>
            ))}
          </div>
          </div>
        </div>

      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]" />
      </div>

      {/* Success Toast */}
      <SuccessToast
        isVisible={toastVisible}
        message={toastMessage}
        actionLabel={toastAction === "undo" ? "Undo" : toastAction === "okay" ? "Okay" : "View"}
        onAction={() => {
          if (toastAction === "undo") {
            setAddedSkillsSet(prev => new Set(prev).add(currentSkillName));
          }
          setToastVisible(false);
        }}
        onClose={() => setToastVisible(false)}
      />

      {/* Expanded View Overlay */}
      <AnimatePresence>
        {showAllOffers && (
          <div className="absolute inset-0 z-[1000]">
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="absolute inset-0 z-[1000] bg-[var(--Surface-Primary-Background)] flex"
            >
              <AllOffersView 
                onBack={() => setShowAllOffers(false)} 
                onOfferClick={(id) => {
                  // handle click if needed
                }}
              />
            </motion.div>
          </div>
        )}

        {selectedOfferId && (
          <div className="absolute inset-0 z-[1000]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-0"
              onClick={() => setSelectedOfferId(null)}
            />
            
            <div className="absolute inset-0 z-10">
              {(() => {
                const offer = latestOffers.find((o) => o.id === selectedOfferId);
                if (!offer) return null;
                return (
                  <LiveOfferView
                    offerTitle={offer.title}
                    offerDescription="Ready to dive into the world of user research? This session is a hands-on introduction designed for UI designers, developers, or anyone new to UX. We'll demystify the research process and give you the confidence to start gathering valuable insights from your users."
                    isTimeCredit={(offer as any).isTimeCredit !== undefined ? (offer as any).isTimeCredit : !!offer.points}
                    timeCreditRate={offer.points || 120}
                    onBack={() => setSelectedOfferId(null)}
                    layoutIdPrefix={`offer-${offer.id}`}
                    badge={offer.badge as any}
                    isSkillAdded={isCurrentSkillAdded}
                    requestsCount={(offer as any).requestsCount}
                    reviewSkills={(offer as any).reviewSkills || []}
                    reviewTags={(offer as any).reviewTags || {}}
                    reviewRoles={(offer as any).reviewRoles || {}}
                    reviewProficiencies={(offer as any).reviewProficiencies || {}}
                    receiveSkills={(offer as any).receiveSkills || []}
                    receiveTags={(offer as any).receiveTags || {}}
                    receiveRoles={(offer as any).receiveRoles || {}}
                    receiveProficiencies={(offer as any).receiveProficiencies || {}}
                  />
                );
              })()}
            </div>
          </div>
        )}

        {/* Search Skills Overlay */}
        {showSearchSkills && (
          <div className="absolute inset-0 z-[1000]">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute inset-0 z-10"
            >
              <SkillSelectView 
                isViewOnly 
                onBack={() => setShowSearchSkills(false)} 
                onSkillClick={(skill) => {
                  handleRelatedSkillClick(skill);
                  setShowSearchSkills(false);
                }} 
              />
            </motion.div>
          </div>
        )}

        {/* Delete Skill Modal */}
        {isDeleteModalOpen && (
          <DeleteOfferModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmRemoveSkill}
            title="Remove skill?"
            body="This skill will be removed from your profile. You can always add it back later."
            confirmText="Remove"
            cancelText="Cancel"
          />
        )}

        {/* Add Tags Modal */}
        <GlobalAddTagsModal
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          tags={tempTags}
          onToggleTag={toggleTempTag}
          onApply={handleApplyTags}
          onClear={handleClearTags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          onTagInputKeyDown={handleTagInputKeyDown}
        />

        {/* Set Proficiency Modal */}
        <SetProficiencyModal
          isOpen={isSetProficiencyOpen}
          onClose={() => setIsSetProficiencyOpen(false)}
          skillName={currentSkillName}
          selectedProficiency={selectedProficiency}
          onSelectProficiency={setSelectedProficiency}
          onApply={handleApplyProficiency}
        />

        {/* Loading Overlay */}
        {isScreenLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px] z-[1100] flex items-center justify-center pointer-events-auto"
          >
            <SkillbeekLoader size={92} />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}



function SetProficiencyModal({
  isOpen,
  onClose,
  skillName,
  selectedProficiency,
  onSelectProficiency,
  onApply
}: {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  selectedProficiency: string;
  onSelectProficiency: (level: string) => void;
  onApply: () => void;
}) {
  const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced"];
  return (
    <>
      <div
        className={`absolute inset-0 z-[110] bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`absolute bottom-0 left-0 w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-t-[24px] flex flex-col pt-[8px] pb-[44px] z-[120] transition-transform duration-300 ${isOpen ? "translate-y-0 ease-out" : "translate-y-full ease-in"}`}
      >
        <div className="w-full flex flex-col items-center gap-[32px]">
          <div className="w-full px-[16px] flex flex-col gap-[16px] items-center">
            <div className="w-[64px] h-[8px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[4px]" />
            <div className="w-full flex items-center justify-between relative h-[24px]">
              <div className="flex-1 flex justify-center">
                <h3 className="font-['Nunito'] font-bold text-[20px] leading-[28px] text-[var(--Text-Primary-heading-1)] tracking-[-0.2px]">
                  Set Proficiency
                </h3>
              </div>
              <button onClick={onClose} className="absolute right-0 w-[24px] h-[24px] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="w-full h-px bg-[var(--Surface-UI-surface-Surface-Universal-Hover)]" />
          </div>
          <div className="w-full px-[16px] flex flex-col gap-[12px]">
            {PROFICIENCY_LEVELS.map(level => (
               <div key={level} onClick={() => onSelectProficiency(level)} className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between p-[12px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.15)] cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors">
                  <span className={`font-['Nunito'] ${selectedProficiency === level ? "font-bold" : "font-semibold"} text-[16px] pl-[8px] text-[var(--Text-Primary-heading-1)]`}>{level}</span>
                  <div className={`w-[24px] h-[24px] rounded-full border-[2px] flex items-center justify-center ${selectedProficiency === level ? "border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)]" : "border-[var(--Button-Primary-Icon-Stroke-disabled)]"}`}>
                    {selectedProficiency === level && <div className="w-[12px] h-[12px] rounded-full bg-[var(--Surface-UI-surface-Surface-Universal-alternate)]" />}
                  </div>
               </div>
            ))}
          </div>
          <div className="w-full flex items-center justify-end px-[16px]">
            <button onClick={onApply} className="flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] transition-colors bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)]">Apply</button>
          </div>
        </div>
      </div>
    </>
  );
}


