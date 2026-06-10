import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackArrowIcon, MoreIcon, TimeCreditIcon, UniversalSkillIcon, CalendarIcon, ClockIcon, PencilIcon } from "../../components/common/Icons";
import { SectionCard } from "../../components/common/SectionCard";
import { PersonaPfpSet } from "../../components/common/PersonaPfpSet";
import { JitsiIcon, PhoneCallIcon, InPersonIcon, CustomLinkIcon } from "./SessionIcons";

// Helper functions copied from previous files
function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} Minutes`;
  if (m === 0) return `${h} hour${h > 1 ? "s" : ""}`;
  return `${h} hr ${m} min`;
}

function formatProficiency(p: string) {
  if (!p) return "Basic";
  return p.split(" — ")[0];
}

function getSpecificDatesText(dateRange: { start: string | Date; end: string | Date }): string {
  if (!dateRange || !dateRange.start) return "";
  const start = new Date(dateRange.start);
  const end = dateRange.end ? new Date(dateRange.end) : start;
  const isSameDay = start.toDateString() === end.toDateString();

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const startStr = start.toLocaleDateString("en-US", options);
  if (isSameDay) return startStr;
  
  const endStr = end.toLocaleDateString("en-US", options);
  return `${startStr} - ${endStr}`;
}

// Figma SVG for Google Meet
const GoogleMeetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" fill="none">
    <g clipPath="url(#clip0_3265_11317)">
      <path d="M13.3145 7.99824L15.2639 10.2265L17.8853 11.9018L18.3424 8.01196L17.8853 4.20898L15.2137 5.68081L13.3145 7.99824Z" fill="#00832D" />
      <path d="M2 11.5411V14.855C2 15.6126 2.61364 16.2263 3.37126 16.2263H6.68515L7.37078 13.7214L6.68515 11.5411L4.41114 10.8555L2 11.5411Z" fill="#0066DA" />
      <path d="M6.68515 -0.228516L2 4.45664L4.41114 5.14227L6.68515 4.45664L7.35936 2.30604L6.68515 -0.228516Z" fill="#E94235" />
      <path d="M6.68515 4.45703H2V11.5419H6.68515V4.45703Z" fill="#2684FC" />
      <path d="M20.8781 1.75639L17.8842 4.21095V11.9037L20.8918 14.3697C21.3421 14.7217 22.0003 14.4006 22.0003 13.8281V2.28661C22.0003 1.70725 21.3272 1.38958 20.8781 1.75639ZM13.3133 8.00021V11.5426H6.68555V16.2278H16.5129C17.2706 16.2278 17.8842 15.6142 17.8842 14.8565V11.9037L13.3133 8.00021Z" fill="#00AC47" />
      <path d="M16.5129 -0.228516H6.68555V4.45664H13.3133V7.99907L17.8842 4.21209V1.14275C17.8842 0.385125 17.2706 -0.228516 16.5129 -0.228516Z" fill="#FFBA00" />
    </g>
    <defs>
      <clipPath id="clip0_3265_11317">
        <rect width="24" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// Figma SVG for Zoom
const ZoomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <g clipPath="url(#clip0_3265_11319)">
      <path d="M12 24C18.6281 24 24 18.6281 24 12C24 5.37188 18.6281 0 12 0C5.37188 0 0 5.37188 0 12C0 18.6281 5.37188 24 12 24Z" fill="#2196F3" />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.04064 15.4312H14.9766V9.60933C14.9766 8.73276 14.2641 8.02026 13.3875 8.02026H5.45627V13.8421C5.45627 14.7187 6.16408 15.4312 7.04064 15.4312ZM16.036 13.3125L19.2094 15.4265V8.02026L16.036 10.139V13.3125Z" fill="white" />
    </g>
    <defs>
      <clipPath id="clip0_3265_11319">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const PlatformIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case "zoom": return <ZoomIcon />;
    case "jitsi": return <JitsiIcon />;
    case "phone-call": return <PhoneCallIcon />;
    case "in-person": return <InPersonIcon />;
    case "custom-link": return <CustomLinkIcon />;
    default: return <GoogleMeetIcon />;
  }
};

interface SessionPreviewViewProps {
  onBack: () => void;
  onSendRequest: () => void;
  sessionTitle?: string;
  sessionDescription?: string;
  sessionDuration?: number;
  sessionAvailability?: any;
  exchangeType?: string;
  receiveSkills?: string[];
  receiveTags?: Record<string, string[]>;
  receiveProficiencies?: Record<string, string>;
  timeCreditRate?: number;
  preferredPlatform?: string;
  fallbackPlatform?: string;
}

export function SessionPreviewView({
  onBack,
  onSendRequest,
  sessionTitle = "Introduction to Design Systems",
  sessionDescription = "In this hands-on session, we will cover the foundational principles of user research, how to conduct interviews, and...",
  sessionDuration = 60,
  sessionAvailability,
  exchangeType = "skill-swap",
  receiveSkills = ["Copywriting"],
  receiveTags = { "Copywriting": ["vrfrv", "cdd"] },
  receiveProficiencies = { "Copywriting": "Intermediate" },
  timeCreditRate = 120,
  preferredPlatform = "google-meet",
  fallbackPlatform = "zoom",
}: SessionPreviewViewProps) {

  // For demonstration
  const fakeAvailability = sessionAvailability || {
    type: "Specific Dates",
    specificSlots: [
      {
        dateRange: { start: new Date().toISOString() },
        timeRange: { start: "10:00 AM", end: "11:00 AM" }
      }
    ],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  const platformLabels: Record<string, string> = {
    "jitsi": "Jitsi",
    "google-meet": "Google Meet",
    "zoom": "Zoom",
    "phone-call": "Phone Call",
    "in-person": "In-person",
    "custom-link": "Custom Link"
  };

  return (
    <div className="w-full max-w-[384px] h-full bg-[var(--Surface-Primary-Background)] rounded-3xl overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Header Placeholder */}
      <div className="relative z-[60] w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-3xl" />
      </div>

      {/* Header Actions */}
      <div className="relative z-[60] w-full px-[16px] py-[8px] flex items-center shrink-0 h-[64px]">
        <div className="flex flex-[1_0_0] items-center gap-[4px] min-w-0">
          <button
            onClick={onBack}
            className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors shrink-0"
          >
            <BackArrowIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
          </button>
          <div className="flex flex-[1_0_0] flex-col items-start justify-center min-w-0">
            <h1 className="font-nunito font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] truncate w-full">
              Edit Session
            </h1>
          </div>
        </div>
        <button
          className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors relative shrink-0"
        >
          <MoreIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
        </button>
      </div>

      {/* Main scrollable content area */}
      <div className="flex-1 overflow-y-auto px-[16px] pb-[180px] pt-[8px] preview-scrollbar">
        
        {/* User Card */}
        <div className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] px-[16px] py-[16px] flex items-center gap-[16px] border border-[var(--Surface-UI-surface-surface-elevated)] mb-[16px] shadow-skillbeek-sm">
          <div 
            className="relative w-10 h-10 shrink-0 rounded-full"
            style={{
              border: "4px solid var(--mapped\\/surface\\/ui-surface-stroke, #eacfff)",
              boxSizing: "content-box"
            }}
          >
            <PersonaPfpSet
              className="w-full h-full rounded-full"
              persona="07"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[18px] leading-[24px]">
              Mei Lin
            </span>
            <span className="font-['Nunito'] font-medium text-[var(--Text-Primary-Caption)] text-[14px] leading-[20px]">
              Selected from your chat
            </span>
          </div>
        </div>

        {/* Title Card */}
        <div className="mb-[16px] w-full">
          <SectionCard title="Title" onEdit={() => console.log("Edit Title")}>
            <p className="font-['Nunito'] font-medium text-[20px] leading-[28px] tracking-[-0.2px] overflow-hidden text-ellipsis whitespace-nowrap min-w-0 text-[var(--Text-Primary-Body)]">
              {sessionTitle}
            </p>
          </SectionCard>
        </div>

        {/* Session Description Card */}
        <div className="mb-[16px] w-full">
          <SectionCard title="Session goal" onEdit={() => console.log("Edit Session Goal")}>
            <p className="font-['Nunito'] font-medium text-[16px] leading-[24px] tracking-[1px] line-clamp-5 overflow-hidden break-words break-all w-full min-w-0 text-[var(--Text-Primary-Body)]">
              {sessionDescription}
            </p>
          </SectionCard>
        </div>

        {/* Availability Card */}
        <div className="w-full mb-[16px]">
          <SectionCard title="Availability" onEdit={() => console.log("Edit Availability")}>
            <div className="flex flex-col gap-[12px]">
              {fakeAvailability?.type === "Specific Dates" && fakeAvailability.specificSlots?.length > 0 ? (
                fakeAvailability.specificSlots.map((slot: any, i: number) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col gap-[12px]">
                      <div className="flex items-center gap-[8px]">
                        <CalendarIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
                        <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px] tracking-[0.1px]">
                          {getSpecificDatesText(slot.dateRange)}
                        </span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <ClockIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
                        <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px] tracking-[0.1px]">
                          {slot.timeRange.start} - {slot.timeRange.end} <span className="text-[var(--Text-Primary-Caption)]">({formatDuration(sessionDuration)})</span>
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px] tracking-[0.1px]">
                  Not set
                </span>
              )}

              {fakeAvailability && (
                <div className="flex items-center gap-[4px] self-start mt-[4px]">
                  <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-brand)] text-[16px] leading-[24px]">
                    {fakeAvailability?.timezone?.split("/").pop()?.replace(/_/g, " ") || "Lagos"}
                  </span>
                  <PencilIcon className="w-[16px] h-[16px] text-[var(--Text-Primary-Text-brand)]" />
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Exchange Type Card */}
        <div className="w-full mb-[16px]">
          <SectionCard title="Exchange Type" onEdit={() => console.log("Edit Exchange Type")}>
            <div className="flex items-center gap-[8px]">
              <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[18px] leading-[24px]">
                {exchangeType === "time-credit" ? "Time Credit" : "Skill Swap"}
              </span>
            </div>
          </SectionCard>
        </div>

        {/* Skills you want Card (if skill swap) */}
        {exchangeType === "skill-swap" && receiveSkills.length > 0 && (
          <div className="w-full mb-[16px]">
            <SectionCard title="Skills you want" onEdit={() => console.log("Edit Skills you want")}>
              {(() => {
                const firstSkill = receiveSkills[0];
                const firstTags = receiveTags[firstSkill] || [];
                const displayedTags = firstTags.slice(0, 2);
                const extraTags = firstTags.length - 2;

                return (
                  <div className="flex items-start gap-[16px]">
                    <UniversalSkillIcon className="w-[40px] h-[40px] shrink-0" />
                    <div className="flex-1 flex flex-col gap-[16px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[24px] leading-[32px] tracking-[-0.7px] w-[140px] truncate block">
                          {firstSkill}
                        </span>
                        <div className="bg-[var(--Surface-UI-surface-surface-variant)] px-[8px] py-[4px] rounded-[8px] shrink-0">
                          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-brandPrimary)] text-[12px] leading-[16px] tracking-[1.1px] truncate block">
                            {formatProficiency(receiveProficiencies[firstSkill])}
                          </span>
                        </div>
                      </div>

                      {firstTags.length > 0 && (
                        <div className="flex flex-nowrap items-center gap-[6px] overflow-hidden">
                          {displayedTags.map(tag => (
                            <div key={tag} className="bg-[var(--Surface-UI-surface-surface-elevated)] p-[12px] rounded-[12px] flex items-center shrink-0 max-w-[100px]">
                              <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-Text-brand)] text-[14px] leading-[20px] tracking-[1px] truncate block">
                                {tag}
                              </span>
                            </div>
                          ))}
                          {extraTags > 0 && (
                            <div className="bg-[var(--Surface-UI-surface-surface-elevated)] p-[12px] rounded-[12px] flex items-center shrink-0">
                              <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-Text-brand)] text-[14px] leading-[20px] tracking-[1px]">
                                +{extraTags}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {receiveSkills.length > 1 && (
                        <div className="h-[48px] py-[12px] rounded-[16px] bg-transparent border-none outline-none flex items-center justify-center self-start">
                          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Caption)] text-[16px] leading-[24px] tracking-[0.16px]">
                            + {receiveSkills.length - 1} more
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </SectionCard>
          </div>
        )}

        {/* Rate card (if time credit) */}
        {exchangeType === "time-credit" && (
          <div className="w-full mb-[16px]">
            <SectionCard title="Rate (per session)" onEdit={() => console.log("Edit Rate")}>
              <div className="flex items-center gap-[12px]">
                <TimeCreditIcon className="w-[24px] h-[24px]" />
                <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[24px] leading-[32px] tracking-[-0.7px]">
                  {timeCreditRate}
                </span>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Preferred Platform Card */}
        <div className="w-full mb-[16px]">
          <SectionCard title="Preferred platform" onEdit={() => console.log("Edit Preferred Platform")}>
            <div className="flex items-center gap-[12px]">
              <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0 bg-[var(--Surface-Information-bg-surface)] rounded-[8px]">
                <PlatformIcon icon={preferredPlatform} />
              </div>
              <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                {platformLabels[preferredPlatform] || preferredPlatform}
              </span>
            </div>
          </SectionCard>
        </div>

        {/* Fallback Platform Card */}
        {fallbackPlatform && fallbackPlatform !== "" && fallbackPlatform !== "none" && (
          <div className="w-full mb-[16px]">
            <SectionCard title="Fallback Platform (optional)" onEdit={() => console.log("Edit Fallback Platform")}>
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0 bg-[var(--Surface-Information-bg-surface)] rounded-[8px]">
                  <PlatformIcon icon={fallbackPlatform} />
                </div>
                <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                  {platformLabels[fallbackPlatform] || fallbackPlatform}
                </span>
              </div>
            </SectionCard>
          </div>
        )}

      </div>

      {/* Footer Footer */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center pointer-events-none z-30">
        {/* Gradient Overlay for Floating Effect */}
        <div className="w-[calc(100%-4px)] h-[156px] bg-gradient-to-t from-[var(--Surface-UI-surface-Background)] via-[var(--Surface-UI-surface-Background)]/90 to-transparent flex items-center justify-center px-[16px] pb-[44px] pointer-events-none">
          <button
            onClick={onSendRequest}
            className="w-full max-w-[352px] h-[48px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[16px] flex items-center justify-center hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] transition-colors shadow-[0px_4px_12px_rgba(0,0,0,0.15)] pointer-events-auto"
          >
            <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body-alt)] text-[16px]">
              Send Session Request
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-[60] pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]" />
      </div>
    </div>
  );
}
