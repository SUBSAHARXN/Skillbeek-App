import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PersonaPfpSet } from "../../../components/common/PersonaPfpSet";
import { SkillbeekSingleStar } from "../../../components/common/SkillbeekSingleStar";
import { ChevronLeftIcon, BookmarkIcon, MoreIcon, ClockIcon, CalendarIcon, TimeCreditIcon } from "../../../components/common/Icons";
import { SectionCard } from "../../../components/common/SectionCard";
import { NeumorphicDivider } from "../../../components/common/NeumorphicDivider";
import { LiveReviewSelectionModal } from "../components/LiveReviewSelectionModal";
import { LiveAvailabilityModal } from "../components/LiveAvailabilityModal";
import { DeleteOfferModal } from "../components/DeleteOfferModal";
import { SuccessToast } from "../../../components/common/SuccessToast";
import { AvailabilityData, getRecurringDaysText, getSpecificDatesText } from "./AvailabilityView";
import { FlameIcon, CodeTimerIcon, CodeSparkleIcon } from "./SkillDetailsView";
import { RelatedOffersCarousel } from "./RelatedOffersCarousel";
import { AllOffersView } from "./AllOffersView";

interface LiveOfferViewProps {
  offerTitle?: string;
  offerDescription?: string;
  availability?: AvailabilityData | null;
  isTimeCredit?: boolean;
  isOwner?: boolean;
  timeCreditRate?: number;
  sessionMinutes?: number;
  reviewSkills?: string[];
  reviewTags?: Record<string, string[]>;
  reviewRoles?: Record<string, string>;
  reviewProficiencies?: Record<string, string>;
  receiveSkills?: string[];
  receiveTags?: Record<string, string[]>;
  receiveRoles?: Record<string, string>;
  receiveProficiencies?: Record<string, string>;
  onBack?: () => void;
  layoutIdPrefix?: string;
  badge?: { text: string; type: "hot" | "closing" | "new" } | null;
  isSkillAdded?: boolean;
  requestsCount?: number;
}

const spring = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
  mass: 0.9
};

// ─── Helper ──────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  return `${minutes} minutes`;
}

// ─── Skill Card ──────────────────────────────────────────────────

function SkillCard({
  title,
  proficiency,
  tags,
  role,
  onViewMore,
  extraText
}: {
  title: string;
  proficiency?: string;
  tags: string[];
  role?: string;
  onViewMore?: () => void;
  extraText?: string;
}) {
  const formatProf = (p: string) => {
    if (!p) return "Basic";
    return p.split(" — ")[0];
  };

  return (
    <div className="w-full bg-[#faf7fe] rounded-[16px] p-[16px] flex flex-col gap-[16px] shadow-skillbeek-sm">
      {/* Top row: skill name + proficiency badge */}
      <div className="flex items-center gap-[12px]">
        <span className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[32px] tracking-[-0.7px]">
          {title}
        </span>
        {proficiency && (
          <div className="bg-[#f8efff] px-[8px] py-[8px] rounded-[8px]">
            <span className="font-['Nunito'] font-bold text-[#8c35be] text-[12px] leading-[16px] tracking-[1.1px]">
              {formatProf(proficiency)}
            </span>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {role && (
        <div
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#e8fae5] p-2 relative self-start"
          role="img"
          aria-label={role}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 flex-[0_0_auto]">
            <path d="M10.5 24C10.5 20.8174 11.9223 17.7652 14.4541 15.5147C16.9858 13.2643 20.4196 12 24 12V24H10.5Z" fill="url(#paint0_linear_3812_17286)"/>
            <path d="M9 15C10.1046 15 11 14.1046 11 13C11 11.8954 10.1046 11 9 11C7.89543 11 7 11.8954 7 13C7 14.1046 7.89543 15 9 15Z" fill="#C9DAFF"/>
            <path d="M9.5 15L13.5 12" stroke="#C9DAFF" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9.5 14.5V19.5M9.5 19.5L8 23M9.5 19.5L13.5 19" stroke="#C9DAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 15.5L13 10" stroke="#C9DAFF" strokeWidth="2" strokeLinecap="round"/>
            <path d="M19 7C20.1046 7 21 6.10457 21 5C21 3.89543 20.1046 3 19 3C17.8954 3 17 3.89543 17 5C17 6.10457 17.8954 7 19 7Z" fill="#98B5FD"/>
            <path d="M20 7V11M20 11L18 14M20 11L22 14" stroke="#98B5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 8L14 12" stroke="#98B5FD" strokeWidth="2" strokeLinecap="round"/>
            <path d="M13.5812 8.0918C13.0798 8.32324 12.8609 8.91737 13.0923 9.41882C13.3238 9.92027 13.9179 10.1392 14.4194 9.90772L14.0003 8.99976L13.5812 8.0918ZM20.5003 5.99976L20.0812 5.0918L13.5812 8.0918L14.0003 8.99976L14.4194 9.90772L20.9194 6.90772L20.5003 5.99976Z" fill="#98B5FD"/>
            <defs>
              <linearGradient id="paint0_linear_3812_17286" x1="17.5" y1="20" x2="22" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EDF2FF"/>
                <stop offset="1" stopColor="#E8FAE5"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="[display:-webkit-box] relative w-fit items-center overflow-hidden text-ellipsis whitespace-nowrap [font-family:'Nunito-Bold',Helvetica] text-xs font-bold leading-4 tracking-[1.10px] text-[#0b3700] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">
            {role}
          </span>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-[12px]">
          {tags.map(tag => (
            <div key={tag} className="bg-[#f0edf4] px-[12px] py-[12px] rounded-[12px]">
              <span className="font-['Nunito'] font-semibold text-[#b7812f] text-[14px] leading-[20px] tracking-[1px]">
                {tag}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* View more button */}
      {onViewMore && extraText && (
        <button onClick={onViewMore} className="self-start mt-[4px]">
          <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px] underline">
            {extraText}
          </span>
        </button>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export function LiveOfferView({
  offerTitle = "Teach UI",
  offerDescription = "Ready to dive into the world of user research? This session is a hands-on introduction designed for UI designers, developers, or anyone new to UX. We'll demystify the research process and give you the confidence to start gathering valuable insights from your users.",
  availability = null,
  isTimeCredit = false,
  isOwner = false,
  timeCreditRate = 0,
  sessionMinutes = 390,
  reviewSkills = [],
  reviewTags = {},
  reviewRoles = {},
  reviewProficiencies = {},
  receiveSkills = [],
  receiveTags = {},
  receiveRoles = {},
  receiveProficiencies = {},
  onBack,
  layoutIdPrefix,
  badge,
  isSkillAdded = true,
  requestsCount,
}: LiveOfferViewProps) {
  const [activeModal, setActiveModal] = React.useState<{ title: string; content: string } | null>(null);
  const [reviewSelectionModal, setReviewSelectionModal] = useState<{ open: boolean; type: "offered" | "wanted" }>({
    open: false,
    type: "offered"
  });
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);

  return (
    <motion.div
      initial={layoutIdPrefix ? { opacity: 0 } : { x: "100%", opacity: 0 }}
      animate={layoutIdPrefix ? { opacity: 1 } : { x: 0, opacity: 1 }}
      exit={layoutIdPrefix ? { opacity: 0 } : { x: "100%", opacity: 0 }}
      transition={layoutIdPrefix ? { layout: spring } : { type: "spring", damping: 28, stiffness: 280 }}
      layoutId={layoutIdPrefix ? `${layoutIdPrefix}-container` : undefined}
      className="absolute inset-0 w-full h-full bg-[#fbf6ff] flex flex-col z-[400] overflow-hidden rounded-[32px]"
    >
      {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]" />
      </div>

      {/* Top Action Row: back (left) + bookmark/more (right) */}
      <div className="w-full px-[16px] flex items-center justify-between h-[64px] shrink-0">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#faf7fe] hover:bg-[#f0edf4] transition-colors"
        >
          <ChevronLeftIcon className="w-[24px] h-[24px] text-[#171519]" />
        </button>

        <div className="flex items-center gap-[16px]">
          {/* Bookmark */}
          <motion.button
            onClick={() => {
              setIsWiggling(true);
              setToastVisible(true);
              setTimeout(() => setIsWiggling(false), 500);
            }}
            animate={isWiggling ? { scale: [1, 0.8, 1.25, 0.95, 1.05, 1] } : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#faf7fe] hover:bg-[#f0edf4] transition-colors origin-center focus:outline-none"
          >
            <BookmarkIcon className="w-[24px] h-[24px] text-[#b7812f]" />
          </motion.button>
          {/* More */}
          <button
            onClick={() => setIsMoreMenuOpen(prev => !prev)}
            className={`w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#faf7fe] hover:bg-[#f0edf4] transition-colors ${isMoreMenuOpen ? "relative z-[520]" : ""
              }`}
          >
            <MoreIcon className="w-[24px] h-[24px] text-[#171519]" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden availability-scrollbar pb-[120px]">

        {/* Content Area */}
        <div className="w-full flex flex-col gap-[8px] px-[16px] pt-[24px]">

          {/* Active Badge / Dynamic Badge */}
          {isOwner ? (
            <div className="inline-flex">
              <div className="bg-[#edf2ff] px-[8px] py-[4px] rounded-[6px]">
                <span className="font-['Nunito'] font-bold text-[#153094] text-[12px] leading-[16px] tracking-[0.5px]">
                  Active
                </span>
              </div>
            </div>
          ) : badge ? (
            <div className="inline-flex">
              <div className={`inline-flex items-center gap-1 px-[8px] py-[4px] rounded-[6px] ${
                badge.type === 'hot' ? 'bg-[#fef6f5]' :
                badge.type === 'closing' ? 'bg-[#fffbf2]' :
                'bg-[#f0f4ff]'
              }`}>
                <div className="relative w-4 h-4 shrink-0 flex items-center justify-center" aria-hidden="true">
                  {badge.type === 'hot' && <FlameIcon className="w-full h-full" />}
                  {badge.type === 'closing' && <CodeTimerIcon />}
                  {badge.type === 'new' && <CodeSparkleIcon />}
                </div>
                <span className={`font-['Nunito'] font-bold text-[12px] leading-[16px] tracking-[0.5px] ${
                  badge.type === 'hot' ? 'text-[#870113]' :
                  badge.type === 'closing' ? 'text-[#b87d18]' :
                  'text-[#133aa8]'
                }`}>
                  {badge.text}
                </span>
              </div>
            </div>
          ) : null}

          {/* Offer Title */}
          <motion.h1 
            layoutId={layoutIdPrefix ? `${layoutIdPrefix}-title` : undefined}
            layout="position"
            transition={layoutIdPrefix ? { layout: spring } : undefined}
            className="font-['Nunito'] font-bold text-[#171519] text-[26px] leading-[34px] tracking-[-0.5px] mb-[16px] break-words w-full min-w-0"
          >
            {offerTitle}
          </motion.h1>

          {/* Social Proof */}
          {requestsCount && requestsCount > 0 ? (
            <aside
              className="relative flex w-full items-center gap-1.5 rounded-[4px] bg-[#edf2ff] p-2 mb-[12px]"
              aria-label="Offer demand details"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <g clipPath="url(#clip0_3674_17545)">
                  <mask id="mask0_3674_17545" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <path d="M24 0H0V24H24V0Z" fill="white"/>
                    <path d="M19.3801 20.142L18.3383 20.5786C14.2835 22.2777 9.7163 22.2777 5.66152 20.5786L4.61963 20.142L5.71581 16.1846C5.92449 15.4312 6.4935 14.7974 7.28082 14.5883C10.2284 13.8052 13.7713 13.8052 16.719 14.5883C17.5063 14.7974 18.0753 15.4312 18.284 16.1846L19.3801 20.142Z" fill="black" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.8634 9.01045C8.4652 7.03268 9.98824 5.20117 11.9998 5.20117C14.0114 5.20117 15.5344 7.03268 15.1362 9.01045L14.8394 10.4847C14.5674 11.8358 13.3758 12.8012 11.9998 12.8012C10.6238 12.8012 9.4322 11.8358 9.1602 10.4847L8.8634 9.01045Z" fill="black" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
                  </mask>
                  <g mask="url(#mask0_3674_17545)">
                    <path d="M13.2084 15.1214L12.2968 15.5035C8.74886 16.9902 4.75256 16.9902 1.20462 15.5035L0.292969 15.1214L1.25213 11.6587C1.43472 10.9995 1.93261 10.445 2.62151 10.2619C5.20066 9.57675 8.30072 9.57675 10.8799 10.2619C11.5688 10.445 12.0666 10.9995 12.2493 11.6587L13.2084 15.1214Z" stroke="#1C1F21" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.00633 5.38097C3.6579 3.65042 4.99056 2.04785 6.75068 2.04785C8.51079 2.04785 9.84345 3.65042 9.49503 5.38097L9.23533 6.67093C8.99733 7.85313 7.95464 8.69785 6.75068 8.69785C5.54671 8.69785 4.50403 7.85313 4.26603 6.67093L4.00633 5.38097Z" stroke="#1C1F21" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23.7084 15.1214L22.7968 15.5035C19.2489 16.9902 15.2526 16.9902 11.7046 15.5035L10.793 15.1214L11.7521 11.6587C11.9347 10.9995 12.4326 10.445 13.1215 10.2619C15.7007 9.57675 18.8007 9.57675 21.3799 10.2619C22.0688 10.445 22.5666 10.9995 22.7493 11.6587L23.7084 15.1214Z" stroke="#1C1F21" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.5063 5.38097C14.1579 3.65042 15.4906 2.04785 17.2507 2.04785C19.0108 2.04785 20.3435 3.65042 19.995 5.38097L19.7353 6.67093C19.4973 7.85313 18.4546 8.69785 17.2507 8.69785C16.0467 8.69785 15.004 7.85313 14.766 6.67093L14.5063 5.38097Z" stroke="#1C1F21" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <path d="M19.3801 20.142L18.3383 20.5786C14.2835 22.2777 9.7163 22.2777 5.66152 20.5786L4.61963 20.142L5.71581 16.1846C5.92449 15.4312 6.4935 14.7974 7.28082 14.5883C10.2284 13.8052 13.7713 13.8052 16.719 14.5883C17.5063 14.7974 18.0753 15.4312 18.284 16.1846L19.3801 20.142Z" stroke="#1C1F21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.8634 9.01045C8.4652 7.03268 9.98824 5.20117 11.9998 5.20117C14.0114 5.20117 15.5344 7.03268 15.1362 9.01045L14.8394 10.4847C14.5674 11.8358 13.3758 12.8012 11.9998 12.8012C10.6238 12.8012 9.4322 11.8358 9.1602 10.4847L8.8634 9.01045Z" stroke="#1C1F21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_3674_17545">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <p 
                className="relative flex-1 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  color: "var(--Mapped-Text-Information-primary-darker, #000010)",
                  fontFamily: "var(--Typeface-Nunito, Nunito)",
                  fontSize: "var(--Font-size-Subtitle, 14px)",
                  fontStyle: "normal",
                  fontWeight: "var(--Font-weight-600-semi-bold, 600)" as any,
                  lineHeight: "var(--Line-height-Subtitle, 20px)",
                  letterSpacing: "var(--Responsive-grid-Tracking-Subtitle, 1px)",
                }}
              >
                Requested {requestsCount} times this week
              </p>
            </aside>
          ) : null}

          {/* Neumorphic Divider */}
          <NeumorphicDivider className="mt-0 mb-[16px]" />

          {/* Author Card */}
          <motion.article
            layoutId={layoutIdPrefix ? `${layoutIdPrefix}-author` : undefined}
            transition={layoutIdPrefix ? { layout: spring } : undefined}
            className="w-full bg-[#faf7fe] rounded-[12px] px-[16px] py-[16px] flex items-center justify-between shadow-skillbeek-sm mb-[16px]"
            aria-label={`David Chen profile summary`}
          >
            <div className="relative flex flex-1 grow items-center gap-3">
              <div 
                className="relative w-[48px] h-[48px] shrink-0 rounded-full"
                style={{
                  border: "4px solid var(--mapped\\/surface\\/ui-surface-stroke, var(--mapped-button-ui-comp-sur-stroke, #eacfff))",
                  boxSizing: "content-box"
                }}
              >
                <PersonaPfpSet className="w-full h-full rounded-full" />
              </div>
              <div className="relative flex flex-1 grow flex-col items-start gap-1">
                <h2 className="relative self-stretch -mt-[1px] font-['Nunito'] text-xl font-bold leading-7 tracking-[-1.20px] text-[#171519]">
                  David Chen
                </h2>
                <div className="relative flex w-full items-center gap-1.5 self-stretch">
                  <div className="relative inline-flex items-center gap-1">
                    <SkillbeekSingleStar rating={4.0} iconClassName="w-[16px] h-[16px]" />
                  </div>
                  <div className="w-px h-3 bg-[#656268]"></div>
                  <div className="relative inline-flex items-center justify-center">
                    <button
                      type="button"
                      className="relative inline-flex flex-[0_0_auto] items-center justify-center gap-1.5 self-stretch rounded-2xl"
                      aria-label="12 reviews for David Chen"
                    >
                      <span className="relative -mt-[1px] flex w-fit items-center justify-center whitespace-nowrap font-['Nunito'] text-center text-sm font-bold leading-5 tracking-[1.00px] text-[#8c35be]">
                        12 reviews
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {!isOwner && (
              <div className="relative inline-flex flex-[0_0_auto] items-center gap-6">
                <button
                  type="button"
                  className="all-[unset] relative flex items-center justify-center cursor-pointer"
                  aria-label="Open chat options for David Chen"
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative h-[48px] w-[48px] shrink-0">
                    <path d="M24.375 32.25H16.5C16.3011 32.25 16.1103 32.171 15.9697 32.0303C15.829 31.8897 15.75 31.6989 15.75 31.5V23.625C15.75 21.3375 16.6587 19.1437 18.2762 17.5262C19.8937 15.9087 22.0875 15 24.375 15C25.5077 15 26.6292 15.2231 27.6756 15.6565C28.7221 16.09 29.6729 16.7253 30.4738 17.5262C31.2747 18.3271 31.91 19.2779 32.3435 20.3244C32.7769 21.3708 33 22.4923 33 23.625C33 24.7577 32.7769 25.8792 32.3435 26.9256C31.91 27.9721 31.2747 28.9229 30.4738 29.7238C29.6729 30.5247 28.7221 31.16 27.6756 31.5935C26.6292 32.0269 25.5077 32.25 24.375 32.25Z" stroke="#171519" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24.375 25.125C24.9963 25.125 25.5 24.6213 25.5 24C25.5 23.3787 24.9963 22.875 24.375 22.875C23.7537 22.875 23.25 23.3787 23.25 24C23.25 24.6213 23.7537 25.125 24.375 25.125Z" fill="#171519"/>
                    <path d="M20.25 25.125C20.8713 25.125 21.375 24.6213 21.375 24C21.375 23.3787 20.8713 22.875 20.25 22.875C19.6287 22.875 19.125 23.3787 19.125 24C19.125 24.6213 19.6287 25.125 20.25 25.125Z" fill="#171519"/>
                    <path d="M28.5 25.125C29.1213 25.125 29.625 24.6213 29.625 24C29.625 23.3787 29.1213 22.875 28.5 22.875C27.8787 22.875 27.375 23.3787 27.375 24C27.375 24.6213 27.8787 25.125 28.5 25.125Z" fill="#171519"/>
                  </svg>
                  <div className="absolute left-[calc(50%-4px)] top-[calc(50%-4px)] h-2 w-2 rounded bg-[#e0dce3] opacity-0 aspect-square" />
                </button>
              </div>
            )}
          </motion.article>

          {/* Neumorphic Divider */}
          <NeumorphicDivider className="mt-0 mb-[16px]" />


          {/* Offer description section */}
          <SectionCard title="Offer description" className="rounded-[12px] px-[16px] py-[16px] shadow-skillbeek-sm mb-[16px]">
            <div className="flex flex-col gap-[6px] w-full min-w-0">
              <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[1px] line-clamp-5 overflow-hidden break-words break-all w-full min-w-0">
                {offerDescription}
              </p>
              <button
                onClick={() => setActiveModal({ title: "Offer description", content: offerDescription })}
                className="self-start"
              >
                <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px] underline">
                  Show all
                </span>
              </button>
            </div>
          </SectionCard>

          {/* Divider label — How this swap works */}
          <div className="w-full mt-[16px] mb-[16px]">
            <h2 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1.2px]">
              {isTimeCredit ? "How this offer works" : "How this swap works"}
            </h2>
          </div>

          {/* Skills You'll Learn section */}
          {!isTimeCredit && reviewSkills.length > 0 && (
            <div className="w-full flex flex-col gap-[12px] mb-[16px]">
              <span className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px]">
                Offered Skills
              </span>
              <div className="flex flex-col gap-[12px]">
                <SkillCard
                  title={reviewSkills[0]}
                  proficiency={reviewProficiencies[reviewSkills[0]]}
                  tags={reviewTags[reviewSkills[0]] || []}
                  role={reviewRoles[reviewSkills[0]]}
                  onViewMore={reviewSkills.length > 1 ? () => setReviewSelectionModal({ open: true, type: "offered" }) : undefined}
                  extraText={reviewSkills.length > 1 ? `+ ${reviewSkills.length - 1} more` : undefined}
                />
              </div>
            </div>
          )}

          {/* Skills Wanted section */}
          {receiveSkills.length > 0 && (
            <div className="w-full flex flex-col gap-[12px] mb-[16px]">
              <span className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px]">
                {isTimeCredit ? "Skills you want" : "Skills wanted in return"}
              </span>
              <div className="flex flex-col gap-[12px]">
                <SkillCard
                  title={receiveSkills[0]}
                  proficiency={receiveProficiencies[receiveSkills[0]]}
                  tags={receiveTags[receiveSkills[0]] || []}
                  role={receiveRoles[receiveSkills[0]]}
                  onViewMore={receiveSkills.length > 1 ? () => setReviewSelectionModal({ open: true, type: "wanted" }) : undefined}
                  extraText={receiveSkills.length > 1 ? `+ ${receiveSkills.length - 1} more` : undefined}
                />
              </div>
            </div>
          )}

          {/* Rate section */}
          {isTimeCredit && (
            <motion.div 
              layoutId={layoutIdPrefix ? `${layoutIdPrefix}-duration` : undefined}
              transition={layoutIdPrefix ? { layout: spring } : undefined}
              className="w-full bg-[#faf7fe] rounded-[16px] px-[24px] py-[16px] flex flex-col gap-[12px] shadow-skillbeek-sm mb-[16px]"
            >
              <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px]">
                Rate (per session)
              </span>
              <div className="flex items-center gap-[12px]">
                <TimeCreditIcon className="w-[24px] h-[24px]" />
                <span className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[32px] tracking-[-0.7px]">
                  {timeCreditRate}
                </span>
              </div>
            </motion.div>
          )}



          {/* Availability section */}
          <div className="w-full bg-[#faf7fe] rounded-[16px] px-[24px] py-[16px] flex flex-col gap-[12px] shadow-skillbeek-sm mb-[16px]">
            <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px]">
              Availability
            </span>
            <div className="flex flex-col gap-[12px]">
              {availability?.type === "Recurring Weekly" && availability.recurringSlots.length > 0 ? (
                (() => {
                  const firstSlot = availability.recurringSlots[0];
                  return (
                    <>
                      <div className="flex items-center gap-[8px]">
                        <CalendarIcon className="w-[24px] h-[24px] text-[#171519]" />
                        <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                          {getRecurringDaysText(firstSlot.days)}
                        </span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <ClockIcon className="w-[24px] h-[24px] text-[#171519]" />
                        <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                          {firstSlot.timeRange.start} - {firstSlot.timeRange.end}
                        </span>
                      </div>
                    </>
                  );
                })()
              ) : availability?.type === "Specific Dates" && availability.specificSlots.length > 0 ? (
                (() => {
                  const firstSlot = availability.specificSlots[0];
                  return (
                    <>
                      <div className="flex items-center gap-[8px]">
                        <CalendarIcon className="w-[24px] h-[24px] text-[#171519]" />
                        <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                          {getSpecificDatesText(firstSlot.dateRange)}
                        </span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <ClockIcon className="w-[24px] h-[24px] text-[#171519]" />
                        <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                          {firstSlot.timeRange.start} - {firstSlot.timeRange.end}
                        </span>
                      </div>
                    </>
                  );
                })()
              ) : (
                <>
                  <div className="flex items-center gap-[8px]">
                    <CalendarIcon className="w-[24px] h-[24px] text-[#171519]" />
                    <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                      Available Sep 30 - Oct 3
                    </span>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <ClockIcon className="w-[24px] h-[24px] text-[#171519]" />
                    <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                      Weekdays, 9 AM - 5 PM
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* View more button (only show if multiple slots exist) */}
            {((availability?.type === "Recurring Weekly" && availability.recurringSlots.length > 1) ||
              (availability?.type === "Specific Dates" && availability.specificSlots.length > 1)) && (
                <button
                  onClick={() => setIsAvailabilityModalOpen(true)}
                  className="self-start mt-[4px]"
                >
                  <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px] underline">
                    View more
                  </span>
                </button>
              )}
          </div>

          <RelatedOffersCarousel 
            currentSkillName={reviewSkills[0] || "Web Development"} 
            layoutIdPrefix={layoutIdPrefix ? `${layoutIdPrefix}-inner` : "inner-related-offer"} 
            onViewAll={() => setShowAllOffers(true)}
          />

        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div
        className="absolute bottom-0 left-0 w-full h-[120px] flex flex-col items-center justify-end px-[16px] pb-[44px] rounded-b-[32px] pointer-events-none z-30"
        style={{
          background: "linear-gradient(180deg, rgba(250, 247, 254, 0) 0%, #FAF7FE 100%)",
        }}
      >
        <button className="w-full h-[48px] bg-[#171519] hover:bg-[#2f2c32] rounded-[16px] flex items-center justify-center transition-colors shadow-skillbeek-sm pointer-events-auto">
          <span className="font-['Nunito'] font-bold text-[#fbf6ff] text-[16px] leading-[24px] tracking-[0.16px]">
            Book Session
          </span>
        </button>
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-40 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]" />
      </div>

      {/* Detail Modal Bottom Sheet */}
      <div
        className={`absolute inset-0 z-[500] bg-[#2f2c32]/25 backdrop-blur-[4px] transition-opacity duration-300 ${activeModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setActiveModal(null)}
      />
      <div
        className={`absolute bottom-0 left-0 w-full bg-[#faf7fe] rounded-t-[24px] flex flex-col pt-[8px] pb-[44px] z-[510] transition-transform duration-300 shadow-[0px_-4px_24px_rgba(18,9,0,0.1)] ${activeModal ? "translate-y-0 ease-[cubic-bezier(0,0,0.2,1)]" : "translate-y-full ease-[cubic-bezier(0.4,0,1,1)]"
          }`}
      >
        {/* Handle Bar */}
        <div className="w-[48px] h-[5px] bg-[#c0bcc3] rounded-[100px] mx-auto mt-[4px] mb-[16px]" />

        {/* Header */}
        <div className="w-full relative flex items-center justify-center h-[28px] px-[16px]">
          <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px]">
            {activeModal?.title}
          </span>
          <button
            onClick={() => setActiveModal(null)}
            className="absolute right-[16px] w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-[#f0edf4] transition-colors"
            aria-label="Close"
          >
            <svg className="w-[24px] h-[24px] text-[#171519]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Neumorphic Divider */}
        <NeumorphicDivider className="mt-[16px] mb-[24px]" />

        {/* Body Content */}
        <div className="px-[24px] pb-[16px] overflow-y-auto max-h-[300px]">
          {activeModal?.title === "Topic" ? (
            <p className="font-['Nunito'] font-medium text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px] break-words">
              {activeModal?.content}
            </p>
          ) : (
            <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[1px] break-words break-all">
              {activeModal?.content}
            </p>
          )}
        </div>
      </div>

      <LiveReviewSelectionModal
        isOpen={reviewSelectionModal.open}
        onClose={() => setReviewSelectionModal({ ...reviewSelectionModal, open: false })}
        title={reviewSelectionModal.type === "offered" ? "Offered Skills" : "Skill you want"}
        skills={reviewSelectionModal.type === "offered" ? reviewSkills : receiveSkills}
        tags={reviewSelectionModal.type === "offered" ? reviewTags : receiveTags}
        roles={reviewSelectionModal.type === "offered" ? reviewRoles : receiveRoles}
        proficiencies={reviewSelectionModal.type === "offered" ? reviewProficiencies : receiveProficiencies}
      />

      <LiveAvailabilityModal
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        availability={availability}
      />

      <DeleteOfferModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          if (onBack) onBack();
        }}
      />

      {/* More Options Menu Popover Dropdown */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[500] flex"
          >
            <div className="absolute inset-0 bg-[#2f2c3242] backdrop-blur-[4px]" onClick={() => setIsMoreMenuOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-[28px] top-[120px] w-[279px] bg-[#faf7fe] rounded-[16px] p-[8px] flex flex-col gap-[8px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Share Offer */}
              <button
                onClick={() => {
                  console.log("Share Offer clicked");
                  setIsMoreMenuOpen(false);
                }}
                className="w-full bg-transparent rounded-[12px] px-[16px] py-[12px] flex items-center gap-[12px] hover:bg-[#f0edf4] transition-colors"
              >
                <svg className="w-[24px] h-[24px] text-[#171519]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px]">
                  Share Offer
                </span>
              </button>

              {/* Pause Offer */}
              {isOwner && (
                <button
                  onClick={() => {
                    console.log("Pause Offer clicked");
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full bg-transparent rounded-[12px] px-[16px] py-[12px] flex items-center gap-[12px] hover:bg-[#f0edf4] transition-colors"
                >
                  <svg className="w-[24px] h-[24px] text-[#171519]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px]">
                    Pause Offer
                  </span>
                </button>
              )}

              {/* Report Offer */}
              {!isOwner && (
                <button
                  onClick={() => {
                    console.log("Report Offer clicked");
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full bg-transparent rounded-[12px] px-[16px] py-[12px] flex items-center gap-[12px] hover:bg-[#f0edf4] transition-colors"
                >
                  <svg className="w-[24px] h-[24px] text-[#171519]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                  <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px]">
                    Report Offer
                  </span>
                </button>
              )}

              {/* Delete Offer */}
              {isOwner && (
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                  className="w-full bg-transparent rounded-[12px] px-[16px] py-[12px] flex items-center gap-[12px] hover:bg-[#f0edf4] transition-colors"
                >
                  <svg className="w-[24px] h-[24px] text-[#8c1d18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  <span className="font-['Nunito'] font-bold text-[#8c1d18] text-[16px] leading-[24px]">
                    Delete Offer
                  </span>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAllOffers && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute inset-0 z-[1000] bg-[#fbf6ff] flex"
          >
            <AllOffersView 
              onBack={() => setShowAllOffers(false)} 
              onOfferClick={(id) => {
                // optional: handle click
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <SuccessToast
        isVisible={toastVisible}
        message="added to your Bookmarks"
        actionLabel="View"
        onAction={() => {
          console.log("View bookmarks clicked");
          setToastVisible(false);
        }}
        onClose={() => setToastVisible(false)}
        customIcon={<BookmarkIcon className="w-[22px] h-[22px] text-white" />}
        iconBg="#2e8b22"
        bgColor="#f3fbf2"
        borderColor="#e3f6df"
      />
    </motion.div>
  );
}
