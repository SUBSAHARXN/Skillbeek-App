import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PersonaPfpSet } from "../../components/common/PersonaPfpSet";
import { CustomAnimatedRadioButton } from "../../components/common/CustomAnimatedRadioButton";
import { EditFieldModal } from "../offers/components/EditFieldModal";
import { SaveExitModal } from "../offers/components/SaveExitModal";
import { OfferProgressBar } from "../offers/components/OfferProgressBar";
import { BackArrowIcon, TimeCreditIcon, TimerIcon, UniversalSkillIcon, CalendarIcon, ClockIcon, PencilIcon } from "../../components/common/Icons";
import { EditRateModal } from "../offers/components/EditRateModal";
import { DurationPickerModal } from "../offers/components/DurationPickerModal";
import { SkillsEditModal } from "../offers/components/SkillsEditModal";
import { AvailabilityData, getRecurringDaysText, getSpecificDatesText } from "../offers/steps/AvailabilityView";
import { SpecificDatesModal } from "../offers/components/SpecificDatesModal";
import { TimezoneModal } from "../offers/components/TimezoneModal";
import { TimePickerModal } from "../offers/components/TimePickerModal";
import { Button } from "../../components/ui/Button";

import { SectionCard } from "../../components/common/SectionCard";

export interface SessionSetupData {
  title: string;
  duration: number;
  availability: any | null;
  description?: string;
  participant?: { name: string; email: string };
}

interface SessionSetupViewProps {
  onBack: () => void;
  onNext: (data: SessionSetupData) => void;
  isP1?: boolean;
  isTimeCredit?: boolean;
  timeCreditRate?: number;
  sessionMinutes?: number;
  isSessionFromChat?: boolean;
  initialData?: SessionSetupData | null;
}

// Exchange icon matching Figma node 2694:9238
function ExchangeIcon() {
  return (
    <div className="relative shrink-0 w-[24px] h-[24px]">
      <svg className="absolute h-[16.14px] left-[9.02px] top-[2px] w-[14.984px]" viewBox="0 0 15 16.14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.64445 3.03168C6.59022 2.66451 6.24737 2.4075 5.88739 2.49788C5.05416 2.70707 4.2673 3.07347 3.57205 3.57864C2.69594 4.21522 1.99232 5.05252 1.52353 6.01637C1.05474 6.98021 0.83524 8.04086 0.884479 9.10435C0.933717 10.1678 1.25017 11.2014 1.80581 12.1133C2.36145 13.0253 3.13913 13.7876 4.06995 14.3327C5.00077 14.8778 6.05601 15.1889 7.1422 15.2384C8.22839 15.2879 9.31199 15.0743 10.297 14.6165C11.0721 14.2563 11.7674 13.7536 12.3458 13.1381C12.604 12.8635 12.5384 12.4317 12.2333 12.2103L12.103 12.1158C11.8073 11.9012 11.3972 11.966 11.1404 12.2258C10.7133 12.6578 10.2094 13.0126 9.65184 13.2718C8.89336 13.6243 8.05899 13.7888 7.22262 13.7506C6.38626 13.7125 5.57373 13.473 4.85699 13.0533C4.14026 12.6335 3.54145 12.0466 3.11361 11.3443C2.68576 10.6421 2.44209 9.8463 2.40418 9.02741C2.36627 8.20852 2.53528 7.39183 2.89625 6.64967C3.25722 5.90751 3.799 5.26279 4.47361 4.77262C4.96723 4.41395 5.52083 4.14613 6.10709 3.98029C6.46423 3.87926 6.71979 3.54189 6.66557 3.17472L6.64445 3.03168Z" fill="#020038" />
        <path d="M8.58148 2.02759C8.75199 2.05335 8.83067 2.25403 8.72311 2.38882L6.787 4.81497C6.67943 4.94976 6.4663 4.91756 6.40335 4.75701L5.2703 1.86721C5.20735 1.70667 5.3418 1.53819 5.51231 1.56394L8.58148 2.02759Z" fill="#020038" />
      </svg>
      <svg className="absolute h-[16.14px] left-0 top-[4.91px] w-[14.984px] rotate-180" viewBox="0 0 15 16.14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.64445 3.03168C6.59022 2.66451 6.24737 2.4075 5.88739 2.49788C5.05416 2.70707 4.2673 3.07347 3.57205 3.57864C2.69594 4.21522 1.99232 5.05252 1.52353 6.01637C1.05474 6.98021 0.83524 8.04086 0.884479 9.10435C0.933717 10.1678 1.25017 11.2014 1.80581 12.1133C2.36145 13.0253 3.13913 13.7876 4.06995 14.3327C5.00077 14.8778 6.05601 15.1889 7.1422 15.2384C8.22839 15.2879 9.31199 15.0743 10.297 14.6165C11.0721 14.2563 11.7674 13.7536 12.3458 13.1381C12.604 12.8635 12.5384 12.4317 12.2333 12.2103L12.103 12.1158C11.8073 11.9012 11.3972 11.966 11.1404 12.2258C10.7133 12.6578 10.2094 13.0126 9.65184 13.2718C8.89336 13.6243 8.05899 13.7888 7.22262 13.7506C6.38626 13.7125 5.57373 13.473 4.85699 13.0533C4.14026 12.6335 3.54145 12.0466 3.11361 11.3443C2.68576 10.6421 2.44209 9.8463 2.40418 9.02741C2.36627 8.20852 2.53528 7.39183 2.89625 6.64967C3.25722 5.90751 3.799 5.26279 4.47361 4.77262C4.96723 4.41395 5.52083 4.14613 6.10709 3.98029C6.46423 3.87926 6.71979 3.54189 6.66557 3.17472L6.64445 3.03168Z" fill="#020038" />
        <path d="M8.58148 2.02759C8.75199 2.05335 8.83067 2.25403 8.72311 2.38882L6.787 4.81497C6.67943 4.94976 6.4663 4.91756 6.40335 4.75701L5.2703 1.86721C5.20735 1.70667 5.3418 1.53819 5.51231 1.56394L8.58148 2.02759Z" fill="#020038" />
      </svg>
    </div>
  );
}



const ROLES = [
  { value: "Mentor", description: "Share your expertise and guide others." },
  { value: "Collaborator", description: "Partner up to co-work or practice together." },
  { value: "Reviewer", description: "Give constructive feedback." },
  { value: "Mentee/Learner", description: "Eager to absorb knowledge and learn new skills." }
];

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

const FULL_DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function isDateAllowed(date: Date, offerData: AvailabilityData | null | undefined): boolean {
  if (!offerData) return true; // No constraints

  if (offerData.type === "Recurring Weekly" && offerData.recurringSlots.length > 0) {
    const dayName = FULL_DOW[date.getDay()];
    return offerData.recurringSlots.some(slot => slot.days.includes(dayName));
  }
  
  if (offerData.type === "Specific Dates" && offerData.specificSlots.length > 0) {
    const time = date.getTime();
    return offerData.specificSlots.some(slot => {
      const s = new Date(slot.dateRange.start).getTime();
      const e = new Date(slot.dateRange.end).getTime();
      return time >= s && time <= e;
    });
  }

  return true;
}

export function SessionSetupView({
  onBack,
  onNext,
  isP1 = false,
  isTimeCredit = false,
  timeCreditRate = 120,
  sessionMinutes = 60,
  isSessionFromChat = false,
  initialData = null,
}: SessionSetupViewProps) {
  const [title, setTitle] = useState(initialData?.title ?? (isSessionFromChat ? "" : "Teach UI"));
  const [description, setDescription] = useState(
    initialData?.description ?? (isSessionFromChat ? "" : "Ready to dive into the world of user research? This session is a hands-on introduction designed for UI designers, developers, or anyone new to UX. We'll demystify the research process and give you the confidence to start gathering valuable insights from your users.")
  );
  const [role, setRole] = useState("Mentee/Learner");
  const [exchangeType, setExchangeType] = useState<"select" | "skill-swap" | "time-credit">("select");
  const [localRate, setLocalRate] = useState(timeCreditRate);
  const [localDuration, setLocalDuration] = useState(initialData?.duration ?? sessionMinutes);

  const [localAvailability, setLocalAvailability] = useState<AvailabilityData | null>(initialData?.availability ?? null);
  const [isEditAvailabilityOpen, setIsEditAvailabilityOpen] = useState(false);
  const [isAvailabilityTypeModalOpen, setIsAvailabilityTypeModalOpen] = useState(false);
  const [tempAvailabilityType, setTempAvailabilityType] = useState<string | null>(null);
  const [isTimezoneModalOpen, setIsTimezoneModalOpen] = useState(false);
  const [isDurationSet, setIsDurationSet] = useState(false);

  // Flow state for scheduling specific date + time
  const [isSessionTimePickerOpen, setIsSessionTimePickerOpen] = useState(false);
  const [tempScheduleDate, setTempScheduleDate] = useState<Date | null>(null);

  const [tempRole, setTempRole] = useState("Mentee/Learner");
  const [tempExchangeType, setTempExchangeType] = useState<"select" | "skill-swap" | "time-credit">("select");

  const [offeredSkills, setOfferedSkills] = useState<string[]>(["Experience Design", "Visual Design"]);
  const [offeredTags, setOfferedTags] = useState<Record<string, string[]>>({ "Experience Design": ["aca", "bryb", "extra"] });
  const [offeredRoles, setOfferedRoles] = useState<Record<string, string>>({ "Experience Design": "Mentor" });
  const [offeredProficiencies, setOfferedProficiencies] = useState<Record<string, string>>({ "Experience Design": "Intermediate" });

  const [wantedSkills, setWantedSkills] = useState<string[]>(["Copywriting"]);
  const [wantedTags, setWantedTags] = useState<Record<string, string[]>>({ "Copywriting": ["vrfrv", "cdd"] });
  const [wantedRoles, setWantedRoles] = useState<Record<string, string>>({ "Copywriting": "Mentee / Learner" });
  const [wantedProficiencies, setWantedProficiencies] = useState<Record<string, string>>({ "Copywriting": "Intermediate" });

  const [skillsModalType, setSkillsModalType] = useState<"offered" | "wanted">("offered");

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isExchangeTypeModalOpen, setIsExchangeTypeModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isSessionScheduleModalOpen, setIsSessionScheduleModalOpen] = useState(false);

  const isNextEnabled = (() => {
    if (isSessionFromChat) {
      const isTitleValid = title.trim() !== "";
      const isDescriptionValid = description.trim() !== "";
      const isExchangeValid = exchangeType !== "select" && (
        exchangeType === "skill-swap"
          ? (offeredSkills.length > 0 && wantedSkills.length > 0)
          : (exchangeType === "time-credit" ? (wantedSkills.length > 0 && localRate > 0) : false)
      );
      const isDurationValid = localDuration > 0;
      const isAvailabilityValid = localAvailability !== null && (
        (localAvailability.recurringSlots && localAvailability.recurringSlots.length > 0) ||
        (localAvailability.specificSlots && localAvailability.specificSlots.length > 0)
      );
      return isTitleValid && isDescriptionValid && isExchangeValid && isDurationValid && isAvailabilityValid;
    } else {
      const isTitleValid = title.trim() !== "";
      const isRateValid = isTimeCredit ? localRate > 0 : true;
      return isTitleValid && isRateValid;
    }
  })();

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]"></div>
      </div>

      {/* Header Action Buttons */}
      <div className="w-full flex justify-between items-center py-[16px] px-[16px] shrink-0 bg-[var(--Surface-Primary-Background)] z-20">
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)] pointer-events-auto"
        >
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">
            Save and Exit
          </span>
        </button>
        <button className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)] pointer-events-auto">
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">
            Questions?
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-col relative pt-[0px] pb-[180px] px-[16px] availability-scrollbar">
        
        {/* Flexible Exchange Info Banner */}
        {!isSessionFromChat && (
          <div className="w-full mb-[24px]">
            <div className="w-full bg-[var(--Surface-Information-bg-surface)] rounded-[12px] px-[12px] py-[14px] flex gap-[8px] items-start shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
              <ExchangeIcon />
              <span className="font-['Nunito'] font-medium text-[var(--Text-Information-primary-dark)] text-[16px] leading-[24px] tracking-[0.1px]">
                Great! Let's get your <strong className="font-bold text-[var(--Text-Information-primary-dark)]">{title}</strong> session scheduled.
              </span>
            </div>
          </div>
        )}

        {/* Header Title */}
        <h2 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[36px] tracking-[-1px] mb-[24px]">
          Who's this session with?
        </h2>

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
              {isSessionFromChat ? "Selected from your chat" : "Selected from your offer"}
            </span>
          </div>
        </div>

        {/* Title Card */}
        <div className="mb-[16px] w-full">
          <SectionCard title="Title" onEdit={() => setIsTitleModalOpen(true)}>
            <p className={`font-['Nunito'] font-medium text-[20px] leading-[28px] tracking-[-0.2px] overflow-hidden text-ellipsis whitespace-nowrap min-w-0 ${title ? "text-[var(--Text-Primary-Body)]" : "text-[var(--Text-Primary-Text-placeholder)]"}`}>
              {title || "e.g., Introduction to Design Systems"}
            </p>
          </SectionCard>
        </div>

        {/* Session Description Card */}
        {isSessionFromChat && (
          <div className="mb-[16px] w-full">
            <SectionCard title="Session goal" onEdit={() => setIsDescriptionModalOpen(true)}>
              <p className={`font-['Nunito'] font-medium text-[16px] leading-[24px] tracking-[1px] line-clamp-5 overflow-hidden break-words break-all w-full min-w-0 ${description ? "text-[var(--Text-Primary-Body)]" : "text-[var(--Text-Primary-Text-placeholder)]"}`}>
                {description || "e.g., In this hands-on session, we will cover the foundational principles of user research, how to conduct interviews, and..."}
              </p>
            </SectionCard>
          </div>
        )}

        {/* Availability Card */}
        {isSessionFromChat && (
          <div className="w-full mb-[16px]">
            <SectionCard 
              title="Availability" 
              onEdit={() => setIsSessionScheduleModalOpen(true)}
            >
              <div className="flex flex-col gap-[12px]">
                {localAvailability?.type === "Specific Dates" && localAvailability.specificSlots.length > 0 ? (
                  localAvailability.specificSlots.map((slot, i) => (
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
                            {slot.timeRange.start} - {slot.timeRange.end} <span className="text-[var(--Text-Primary-Caption)]">({formatDuration(localDuration)})</span>
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))
                ) : (
                  <div className="flex items-center gap-[8px] p-[16px] bg-[var(--Surface-UI-surface-surface-variant)] rounded-[12px] w-full">
                    <CalendarIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-Text-placeholder)]" />
                    <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-Text-placeholder)] text-[16px] leading-[24px] tracking-[0.1px]">
                      Set availability
                    </span>
                  </div>
                )}

                {localAvailability && (localAvailability.recurringSlots.length > 0 || localAvailability.specificSlots.length > 0) && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTimezoneModalOpen(true);
                    }}
                    className="flex items-center gap-[4px] self-start mt-[4px] hover:opacity-70 transition-opacity pointer-events-auto cursor-pointer"
                  >
                    <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-brand)] text-[16px] leading-[24px]">
                      {localAvailability?.timezone?.split("/").pop()?.replace(/_/g, " ") || "Lagos"}
                    </span>
                    <PencilIcon className="w-[16px] h-[16px] text-[var(--Text-Primary-Text-brand)]" />
                  </button>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {/* Role Card */}
        {!isSessionFromChat && (
          <div className="w-full mb-[16px]">
            <SectionCard title="Session role" onEdit={() => { setTempRole(role); setIsRoleModalOpen(true); }}>
              <div className="flex items-center gap-[8px] p-[16px] bg-[var(--Surface-UI-surface-surface-variant)] rounded-[12px] w-full">
                <CustomAnimatedRadioButton checked={true} />
                <span className="text-[var(--Text-Primary-heading-1)] font-bold text-[18px] leading-[24px]">{role}</span>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Exchange Type Card */}
        {isSessionFromChat && (
          <div className="w-full mb-[16px]">
            <SectionCard title="Exchange Type" onEdit={() => { setTempExchangeType(exchangeType); setIsExchangeTypeModalOpen(true); }}>
              <div className="flex items-center gap-[8px] p-[16px] bg-[var(--Surface-UI-surface-surface-variant)] rounded-[12px] w-full">
                <CustomAnimatedRadioButton checked={exchangeType !== "select"} />
                <span className={`font-bold text-[18px] leading-[24px] ${exchangeType === "select" ? "text-[var(--Text-Primary-Text-placeholder)]" : "text-[var(--Text-Primary-heading-1)]"}`}>
                  {exchangeType === "select" ? "Select" : exchangeType === "time-credit" ? "Time Credit" : "Skill Swap"}
                </span>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Offered skills Card */}
        {isSessionFromChat && exchangeType === "skill-swap" && offeredSkills.length > 0 && (
          <div className="w-full mb-[16px]">
            <SectionCard title="Offered skills" onEdit={() => { setSkillsModalType("offered"); setIsSkillsModalOpen(true); }}>
              {(() => {
                const firstSkill = offeredSkills[0];
                const firstTags = offeredTags[firstSkill] || [];
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
                            {formatProficiency(offeredProficiencies[firstSkill])}
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

                      {offeredSkills.length > 1 && (
                        <div className="h-[48px] py-[12px] rounded-[16px] bg-transparent border-none outline-none flex items-center justify-center self-start">
                          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Caption)] text-[16px] leading-[24px] tracking-[0.16px]">
                            + {offeredSkills.length - 1} more
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

        {/* Skills you want Card */}
        {isSessionFromChat && (exchangeType === "skill-swap" || exchangeType === "time-credit") && wantedSkills.length > 0 && (
          <div className="w-full mb-[16px]">
            <SectionCard title="Skills you want" onEdit={() => { setSkillsModalType("wanted"); setIsSkillsModalOpen(true); }}>
              {(() => {
                const firstSkill = wantedSkills[0];
                const firstTags = wantedTags[firstSkill] || [];
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
                            {formatProficiency(wantedProficiencies[firstSkill])}
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

                      {wantedSkills.length > 1 && (
                        <div className="h-[48px] py-[12px] rounded-[16px] bg-transparent border-none outline-none flex items-center justify-center self-start">
                          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Caption)] text-[16px] leading-[24px] tracking-[0.16px]">
                            + {wantedSkills.length - 1} more
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



        {/* Rate card */}
        {(!isSessionFromChat ? isTimeCredit : exchangeType === "time-credit") && (
          <div className="w-full mb-[16px]">
            <SectionCard title="Rate (per session)" onEdit={() => setIsRateModalOpen(true)}>
              <div className="flex items-center gap-[12px]">
                <TimeCreditIcon className="w-[24px] h-[24px]" />
                <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[24px] leading-[32px] tracking-[-0.7px]">
                  {localRate}
                </span>
              </div>
            </SectionCard>
          </div>
        )}


      </div>

      {/* Fixed Bottom Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col items-center gap-[32px] pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={1} subStepProgress={50} />
        </div>
        <div className="w-full flex items-center justify-between px-[16px]">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button
            variant="primary"
            className="w-[101px]"
            onClick={() => onNext({ 
              title, 
              duration: localDuration, 
              availability: localAvailability,
              description: description,
              participant: { name: "Mei Lin", email: "mei.lin@example.com" }
            })}
            disabled={!isNextEnabled}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]" />
      </div>

      {/* Save Exit Modal */}
      <SaveExitModal
        isOpen={isSaveModalOpen}
        onKeepWorking={() => setIsSaveModalOpen(false)}
        onExit={() => {
          setIsSaveModalOpen(false);
          onBack();
        }}
      />

      {/* Title Edit Modal */}
      {isTitleModalOpen && (
        <EditFieldModal
          isOpen={isTitleModalOpen}
          onClose={() => setIsTitleModalOpen(false)}
          onUpdate={(val) => { setTitle(val); setIsTitleModalOpen(false); }}
          label="Topic"
          initialValue={title}
          maxChars={80}
        />
      )}

      {/* Description Edit Modal */}
      {isDescriptionModalOpen && (
        <EditFieldModal
          isOpen={isDescriptionModalOpen}
          onClose={() => setIsDescriptionModalOpen(false)}
          onUpdate={(val) => { setDescription(val); setIsDescriptionModalOpen(false); }}
          label="Session goal"
          initialValue={description}
          maxChars={500}
        />
      )}

      {/* Role Selection Modal */}
      <AnimatePresence>
        {isRoleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end justify-center"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px]" onClick={() => setIsRoleModalOpen(false)} />
            
            {/* Modal Card */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-[384px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-t-[32px] pt-[24px] px-[24px] pb-[48px] flex flex-col gap-[24px] shadow-[0px_-8px_24px_rgba(18,9,0,0.1)] z-10"
            >
              <div className="flex flex-col gap-[8px]">
                <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[24px] leading-[32px]">
                  Select Session Role
                </h3>
                <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Caption)] text-[14px] leading-[20px]">
                  Choose how you'd like to connect and grow together.
                </p>
              </div>

              {/* Radio List */}
              <div className="flex flex-col gap-[12px] w-full">
                {ROLES.map((r) => {
                  const isChecked = tempRole === r.value;
                  return (
                    <div
                      key={r.value}
                      onClick={() => {
                        setTempRole(r.value);
                      }}
                      className={`w-full p-[16px] rounded-[16px] border flex items-center justify-between cursor-pointer transition-all duration-300 bg-[var(--Surface-UI-surface-surface-elevated)] shadow-skillbeek-sm ${
                        isChecked 
                          ? "border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)]" 
                          : "border-[var(--Surface-UI-surface-surface-elevated)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)]"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                          {r.value}
                        </span>
                        <span className="font-['Nunito'] font-medium text-[var(--Text-Primary-Caption)] text-[12px] leading-[16px]">
                          {r.description}
                        </span>
                      </div>
                      <CustomAnimatedRadioButton checked={isChecked} />
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-between mt-[12px] shrink-0">
                <button 
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-[16px] py-[12px] h-[48px] flex items-center justify-center"
                >
                  <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-placeholder)] text-[16px] underline leading-[24px]">
                    Cancel
                  </span>
                </button>
                <button 
                  onClick={() => {
                    setRole(tempRole);
                    setIsRoleModalOpen(false);
                  }}
                  className="px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] flex items-center justify-center bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] transition-colors"
                >
                  <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
                    Apply
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exchange Type Selection Modal */}
      <AnimatePresence>
        {isExchangeTypeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end justify-center"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px]" onClick={() => setIsExchangeTypeModalOpen(false)} />
            
            {/* Modal Card */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-[384px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-t-[32px] pt-[24px] px-[24px] pb-[48px] flex flex-col gap-[24px] shadow-[0px_-8px_24px_rgba(18,9,0,0.1)] z-10"
            >
              <div className="flex flex-col gap-[8px]">
                <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[24px] leading-[32px]">
                  Select Exchange Type
                </h3>
                <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Caption)] text-[14px] leading-[20px]">
                  Choose how you'd like to structure this session's value exchange.
                </p>
              </div>

              {/* Radio List */}
              <div className="flex flex-col gap-[12px] w-full">
                {[
                  { value: "skill-swap", label: "Skill Swap", description: "Exchange your skills directly with others without using credits." },
                  { value: "time-credit", label: "Time Credit", description: "Use and earn platform credits for your skills and time." }
                ].map((type) => {
                  const isChecked = tempExchangeType === type.value;
                  return (
                    <div
                      key={type.value}
                      onClick={() => {
                        setTempExchangeType(type.value as "skill-swap" | "time-credit");
                      }}
                      className={`w-full p-[16px] rounded-[16px] border flex items-center justify-between cursor-pointer transition-all duration-300 bg-[var(--Surface-UI-surface-surface-elevated)] shadow-skillbeek-sm ${
                        isChecked 
                          ? "border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)]" 
                          : "border-[var(--Surface-UI-surface-surface-elevated)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)]"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                          {type.label}
                        </span>
                        <span className="font-['Nunito'] font-medium text-[var(--Text-Primary-Caption)] text-[12px] leading-[16px]">
                          {type.description}
                        </span>
                      </div>
                      <CustomAnimatedRadioButton checked={isChecked} />
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-between mt-[12px] shrink-0">
                <button 
                  onClick={() => setIsExchangeTypeModalOpen(false)}
                  className="px-[16px] py-[12px] h-[48px] flex items-center justify-center"
                >
                  <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-placeholder)] text-[16px] underline leading-[24px]">
                    Cancel
                  </span>
                </button>
                <button 
                  onClick={() => {
                    setExchangeType(tempExchangeType);
                    setIsExchangeTypeModalOpen(false);
                    if (tempExchangeType === "skill-swap") {
                      setSkillsModalType("offered");
                      setIsSkillsModalOpen(true);
                    } else if (tempExchangeType === "time-credit" && isSessionFromChat) {
                      setSkillsModalType("wanted");
                      setIsSkillsModalOpen(true);
                    }
                  }}
                  className="px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] flex items-center justify-center bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] transition-colors"
                >
                  <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
                    Apply
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Schedule Modal (now using SpecificDatesModal) */}
      <SpecificDatesModal
        isOpen={isSessionScheduleModalOpen}
        onClose={() => setIsSessionScheduleModalOpen(false)}
        mode="single"
        isDateAllowed={(date) => isDateAllowed(date, undefined)} // TODO: hook up to actual offer data if passed from App.tsx
        onApply={(date) => {
          setTempScheduleDate(date);
          setIsSessionScheduleModalOpen(false);
          setIsSessionTimePickerOpen(true);
        }}
      />

      {/* Time Picker Modal for specific date scheduling */}
      <TimePickerModal
        isOpen={isSessionTimePickerOpen}
        onClose={() => setIsSessionTimePickerOpen(false)}
        onApply={(start, end) => {
          if (!tempScheduleDate) return;
          
          // Calculate duration in minutes
          const parseTime = (t: string) => {
            const [time, ampm] = t.split(' ');
            let [h, m] = time.split(':').map(Number);
            if (ampm === 'PM' && h !== 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
            return h * 60 + m;
          };
          const startMins = parseTime(start);
          const endMins = parseTime(end);
          let dur = endMins - startMins;
          
          if (dur < 0) {
            dur += 24 * 60; // Handle crossing midnight
          }

          setLocalDuration(dur > 0 ? dur : 60);
          setIsDurationSet(true);

          setLocalAvailability({
            type: "Specific Dates",
            recurringSlots: [],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            specificSlots: [{
              dateRange: { start: tempScheduleDate, end: tempScheduleDate },
              timeRange: { start, end }
            }]
          });
          
          setIsSessionTimePickerOpen(false);
        }}
      />

      {/* Rate Edit Modal */}
      <AnimatePresence>
        {isRateModalOpen && (
          <EditRateModal
            isOpen={isRateModalOpen}
            onClose={() => setIsRateModalOpen(false)}
            initialRate={localRate}
            title={isSessionFromChat ? "Set rate" : "Edit rate"}
            onApply={(rate) => {
              setLocalRate(rate);
              setIsRateModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Duration Edit Modal */}
      <AnimatePresence>
        {isDurationModalOpen && (
          <DurationPickerModal
            isOpen={isDurationModalOpen}
            onClose={() => setIsDurationModalOpen(false)}
            initialHours={Math.floor(localDuration / 60)}
            initialMinutes={localDuration % 60}
            onApply={(h, m) => {
              setLocalDuration(h * 60 + m);
              setIsDurationSet(true);
              setIsDurationModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Skills Modal (Offered & Wanted) */}
      {isSkillsModalOpen && (
        <SkillsEditModal
          key={skillsModalType}
          isOpen={isSkillsModalOpen}
          onClose={() => setIsSkillsModalOpen(false)}
          type={skillsModalType}
          initialSkills={skillsModalType === "offered" ? offeredSkills : wantedSkills}
          initialTags={skillsModalType === "offered" ? offeredTags : wantedTags}
          initialRoles={skillsModalType === "offered" ? offeredRoles : wantedRoles}
          initialProficiencies={skillsModalType === "offered" ? offeredProficiencies : wantedProficiencies}
          onApply={(skills, tags, roles, profs) => {
            if (skillsModalType === "offered") {
              setOfferedSkills(skills);
              setOfferedTags(tags);
              setOfferedRoles(roles);
              setOfferedProficiencies(profs);
              // Chain to wanted skills modal
              setSkillsModalType("wanted");
            } else {
              setWantedSkills(skills);
              setWantedTags(tags);
              setWantedRoles(roles);
              setWantedProficiencies(profs);
              setIsSkillsModalOpen(false);
              if (exchangeType === "time-credit" && isSessionFromChat) {
                setIsRateModalOpen(true);
              }
            }
          }}
        />
      )}

      {/* Timezone Modal */}
      <TimezoneModal
        isOpen={isTimezoneModalOpen}
        onClose={() => setIsTimezoneModalOpen(false)}
        selectedTimezone={localAvailability?.timezone || "Africa/Lagos"}
        onSelect={(tz) => {
          if (localAvailability) {
            setLocalAvailability({ ...localAvailability, timezone: tz });
          }
          setIsTimezoneModalOpen(false);
        }}
      />
    </div>
  );
}
