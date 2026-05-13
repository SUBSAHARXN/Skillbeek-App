import React from "react";
import { motion } from "framer-motion";
import { PersonaPfpSet } from "../../../components/common/PersonaPfpSet";
import { SkillbeekSingleStar } from "../../../components/common/SkillbeekSingleStar";

interface LiveOfferViewProps {
  offerTitle?: string;
  offerDescription?: string;
  isTimeCredit?: boolean;
  timeCreditRate?: number;
  sessionMinutes?: number;
  reviewSkills?: string[];
  reviewTags?: Record<string, string[]>;
  reviewProficiencies?: Record<string, string>;
  receiveSkills?: string[];
  receiveTags?: Record<string, string[]>;
  receiveProficiencies?: Record<string, string>;
  onBack?: () => void;
}

// ─── Helper ──────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hrs`;
  return `${h} hrs, ${m} min`;
}

// ─── Skill Card ──────────────────────────────────────────────────

function SkillCard({
  title,
  proficiency,
  tags,
}: {
  title: string;
  proficiency?: string;
  tags: string[];
}) {
  const formatProf = (p: string) => {
    if (!p) return "Basic";
    return p.split(" — ")[0];
  };

  return (
    <div className="w-full bg-[#faf7fe] rounded-[16px] p-[16px] flex flex-col gap-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
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

      {/* Edit button */}
      <button className="self-start flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[83px] h-[48px] font-['Nunito'] font-bold text-[16px] bg-[#171519] text-[#fbf6ff] transition-colors">
        See more
      </button>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export function LiveOfferView({
  offerTitle = "Teach UI",
  offerDescription = "Ready to dive into the world of user research? This session is a hands-on introduction designed for UI designers, developers, or anyone new to UX. We'll demystify the research process and give you the confidence to start gathering valuable insights from your users.",
  isTimeCredit = false,
  timeCreditRate = 0,
  sessionMinutes = 390,
  reviewSkills = [],
  reviewTags = {},
  reviewProficiencies = {},
  receiveSkills = [],
  receiveTags = {},
  receiveProficiencies = {},
  onBack,
}: LiveOfferViewProps) {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="absolute inset-0 w-full h-full bg-[#fbf6ff] flex flex-col z-[400] overflow-hidden rounded-[32px]"
    >
      {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden availability-scrollbar pb-[180px]">

        {/* Top Action Row: back (left) + bookmark/more (right) */}
        <div className="w-full px-[16px] flex items-center justify-between h-[64px] shrink-0">
          {/* Back Button */}
          <button 
            onClick={onBack}
            className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#faf7fe] shadow-[0px_1px_3px_rgba(18,9,0,0.1)]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-[16px]">
            {/* Bookmark */}
            <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#faf7fe] shadow-[0px_1px_3px_rgba(18,9,0,0.1)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="#b7812f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* More */}
            <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#faf7fe] shadow-[0px_1px_3px_rgba(18,9,0,0.1)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="5" r="1.5" fill="#171519" />
                <circle cx="12" cy="12" r="1.5" fill="#171519" />
                <circle cx="12" cy="19" r="1.5" fill="#171519" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full flex flex-col gap-[8px] px-[16px]">

          {/* Active Badge */}
          <div className="inline-flex mb-[8px]">
            <div className="bg-[#edf2ff] px-[12px] py-[12px] rounded-[8px]">
              <span className="font-['Nunito'] font-bold text-[#153094] text-[14px] leading-[20px] tracking-[1px]">
                Active
              </span>
            </div>
          </div>

          {/* Offer Title */}
          <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1.2px] mb-[24px]">
            {offerTitle}
          </h1>

          {/* Social Proof */}
          <div className="flex items-center gap-[6px] mb-[8px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="#171519" strokeWidth="2" />
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px]">
              24 people requested this offer this week
            </span>
          </div>

          {/* Posted meta */}
          <div className="flex items-center gap-[8px] mb-[24px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#49464c" strokeWidth="2" />
              <path d="M12 6V12L16 14" stroke="#49464c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-['Nunito'] font-medium text-[#49464c] text-[14px] leading-[20px] tracking-[1px]">
              Posted 2 hrs ago
            </span>
            {/* Dot */}
            <div className="w-[4px] h-[4px] rounded-full bg-[#49464c]" />
            <span className="font-['Nunito'] font-medium text-[#49464c] text-[14px] leading-[20px] tracking-[1px]">
              Available Sep 30 - Oct 3
            </span>
          </div>

          {/* Divider line */}
          <div className="w-full h-[1px] bg-[#e0dce3] mb-[16px]" />

          {/* Author Card */}
          <div className="w-full bg-[#faf7fe] rounded-[16px] px-[16px] py-[16px] flex items-center gap-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] mb-[16px]">
            {/* PFP */}
            <div className="w-[80px] h-[80px] shrink-0">
              <PersonaPfpSet className="w-[80px] h-[80px]" />
            </div>
            <div className="flex flex-col gap-[6px]">
              <span className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[28px] tracking-[-0.7px]">
                Aiko Tanaka
              </span>
              <div className="flex items-center gap-[4px]">
                <SkillbeekSingleStar rating={4.7} iconClassName="w-[24px] h-[24px]" />
                <span className="font-['Nunito'] font-bold text-[#171519] text-[14px] leading-[20px] tracking-[1px]">
                  4.7
                </span>
                <div className="w-[4px] h-[4px] rounded-full bg-[#49464c]" />
                <span className="font-['Nunito'] font-bold text-[#171519] text-[14px] leading-[20px] tracking-[1px] underline cursor-pointer">
                  34 reviews
                </span>
              </div>
            </div>
          </div>

          {/* Divider line */}
          <div className="w-full h-[1px] bg-[#e0dce3] mb-[16px]" />

          {/* Topic Card (same for both variants) */}
          <div className="w-full bg-[#faf7fe] rounded-[16px] px-[24px] py-[16px] flex flex-col gap-[12px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] mb-[4px]">
            <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px]">
              Topic
            </span>
            <span className="font-['Nunito'] font-medium text-[#49464c] text-[18px] leading-[28px]">
              {offerTitle}
            </span>
            {/* Book Session inside card */}
            <button className="w-full h-[48px] bg-[#171519] hover:bg-[#2f2c32] rounded-[16px] flex items-center justify-center transition-colors">
              <span className="font-['Nunito'] font-bold text-[#fbf6ff] text-[16px] leading-[24px] tracking-[0.16px]">
                Book Session
              </span>
            </button>
          </div>

          {/* Offer description section */}
          <div className="w-full bg-[#faf7fe] rounded-[16px] px-[24px] py-[16px] flex flex-col gap-[12px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] mb-[4px]">
            <span className="font-['Nunito'] font-bold text-[#a09da3] text-[18px] leading-[28px]">
              Offer description
            </span>
            <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
              {offerDescription}
            </p>
            <button className="self-start flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[67px] h-[48px] font-['Nunito'] font-bold text-[16px] bg-[#171519] text-[#fbf6ff] transition-colors">
              Read more
            </button>
          </div>

          {/* Divider label — About the host */}
          <div className="w-full py-[4px] mb-[4px]">
            <span className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[36px] tracking-[-0.7px]">
              About the host
            </span>
          </div>

          {/* Skills You'll Learn section */}
          {reviewSkills.length > 0 && (
            <div className="w-full flex flex-col gap-[12px] mb-[16px]">
              <span className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[28px] tracking-[-0.7px]">
                Skills you'll learn
              </span>
              <div className="flex flex-col gap-[12px]">
                {reviewSkills.map(skill => (
                  <SkillCard
                    key={skill}
                    title={skill}
                    proficiency={reviewProficiencies[skill]}
                    tags={reviewTags[skill] || []}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Skills Wanted section */}
          {receiveSkills.length > 0 && (
            <div className="w-full flex flex-col gap-[12px] mb-[16px]">
              <span className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[28px] tracking-[-0.7px]">
                Skills wanted in return
              </span>
              <div className="flex flex-col gap-[12px]">
                {receiveSkills.map(skill => (
                  <SkillCard
                    key={skill}
                    title={skill}
                    proficiency={receiveProficiencies[skill]}
                    tags={receiveTags[skill] || []}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reviews section placeholder */}
          <div className="w-full bg-[#faf7fe] rounded-[16px] px-[24px] py-[16px] flex flex-col gap-[12px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] mb-[4px]">
            <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px]">
              Reviews (34)
            </span>
            <div className="flex items-center gap-[6px]">
              <SkillbeekSingleStar rating={4.7} iconClassName="w-[24px] h-[24px]" />
              <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px]">
                4.7 out of 5
              </span>
            </div>
            <button className="self-start flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[83px] h-[48px] font-['Nunito'] font-bold text-[16px] bg-[#171519] text-[#fbf6ff] transition-colors">
              See more
            </button>
          </div>

          {/* Availability section placeholder */}
          <div className="w-full bg-[#faf7fe] rounded-[16px] px-[24px] py-[16px] flex flex-col gap-[12px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] mb-[16px]">
            <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px]">
              Availability
            </span>
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[8px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#49464c" strokeWidth="2" />
                  <path d="M16 2V6" stroke="#49464c" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 2V6" stroke="#49464c" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 10H21" stroke="#49464c" strokeWidth="2" />
                </svg>
                <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                  Available Sep 30 - Oct 3
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#49464c" strokeWidth="2" />
                  <path d="M12 6V12L16 14" stroke="#49464c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
                  Weekdays, 9 AM - 5 PM
                </span>
              </div>
            </div>
            <button className="self-start mt-[4px] flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[133px] h-[48px] font-['Nunito'] font-bold text-[16px] bg-[#171519] text-[#fbf6ff] transition-colors">
              Check availability
            </button>
          </div>

          {/* Report button */}
          <button className="self-start flex items-center justify-center px-[16px] py-[12px] rounded-[16px] h-[48px] font-['Nunito'] font-bold text-[16px] text-[#49464c] underline mb-[16px]">
            Report this offer
          </button>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-[#fbf6ff] flex flex-col items-center px-[16px] pt-[16px] pb-[34px] shadow-[0px_-4px_24px_rgba(18,9,0,0.06)] rounded-b-[32px]">
        {/* Timecredit: session cost + button side-by-side */}
        {isTimeCredit && (
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-[4px]">
                <span className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px]">
                  {Math.floor(sessionMinutes / 60)}
                </span>
                <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px]">
                  {sessionMinutes % 60 > 0 ? `hrs, ${sessionMinutes % 60} min` : 'hrs'}
                </span>
              </div>
              <span className="font-['Nunito'] font-medium text-[#49464c] text-[14px] leading-[20px] tracking-[1px]">
                Session cost
              </span>
            </div>
            <button className="h-[48px] px-[24px] bg-[#171519] hover:bg-[#2f2c32] rounded-[16px] flex items-center justify-center transition-colors shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
              <span className="font-['Nunito'] font-bold text-[#fbf6ff] text-[16px] leading-[24px] tracking-[0.16px]">
                Book Session
              </span>
            </button>
          </div>
        )}

        {/* Skillswap / mutual: full-width Book Session button */}
        {!isTimeCredit && (
          <button className="w-full h-[48px] bg-[#171519] hover:bg-[#2f2c32] rounded-[16px] flex items-center justify-center transition-colors shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
            <span className="font-['Nunito'] font-bold text-[#fbf6ff] text-[16px] leading-[24px] tracking-[0.16px]">
              Book Session
            </span>
          </button>
        )}

        {/* Home indicator */}
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px] mt-[16px]" />
      </div>
    </motion.div>
  );
}
