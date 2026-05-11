import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TimerIcon, UniversalSkillIcon, PencilIcon, CalendarIcon, ClockIcon, DocumentIcon, TrashIcon } from "../../../components/common/Icons";
import { PersonaPfpSet } from "../../../components/common/PersonaPfpSet";
import { SkillbeekSingleStar } from "../../../components/common/SkillbeekSingleStar";
import { EditFieldModal } from "../components/EditFieldModal";
import { TimezoneModal } from "../components/TimezoneModal";
import { EditAvailabilityModal } from "../components/EditAvailabilityModal";
import { DurationPickerModal } from "../components/DurationPickerModal";
import { SkillsEditModal } from "../components/SkillsEditModal";
import { ReviewSelectionModal } from "../components/ReviewSelectionModal";
import { AvailabilityData, getRecurringDaysText, getSpecificDatesText } from "./AvailabilityView";

interface OfferPreviewViewProps {
  offerTitle?: string;
  offerDescription?: string;
  availability?: any;
  reviewSkills?: string[];
  reviewTags?: Record<string, string[]>;
  reviewRoles?: Record<string, string>;
  reviewProficiencies?: Record<string, string>;
  receiveSkills?: string[];
  receiveTags?: Record<string, string[]>;
  receiveRoles?: Record<string, string>;
  receiveProficiencies?: Record<string, string>;
  sessionDuration?: { type: "preset" | "custom"; minutes: number };
  onPublish?: () => void;
  onBack?: () => void;
}

function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} Minutes`;
  if (m === 0) return `${h} hour${h > 1 ? "s" : ""}`;
  return `${h} hr ${m} min`;
}

function NeumorphicDivider() {
  return (
    <div className="w-full flex items-center justify-center my-[16px]">
      <div
        className="w-full h-[2px] rounded-full bg-[#fbf6ff]"
        style={{ boxShadow: "inset 2px 2px 12px rgba(192, 188, 195, 0.5), inset -2px -2px 12px rgba(255, 255, 255, 0.9)" }}
      />
    </div>
  );
}

function SectionCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-w-0 bg-[#faf7fe] rounded-[12px] px-[24px] py-[16px] flex flex-col gap-[12px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
      <div className="flex items-center justify-between">
        <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px]">
          {title}
        </span>
        {onEdit && (
          <button
            onClick={onEdit}
            className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px] px-[16px] py-[12px] -mr-[16px] hover:text-[#49464c] transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function OfferPreviewView({
  offerTitle: initialTitle = "Teach UI",
  offerDescription: initialDesc = "Ready to dive into the world of user research? This session is a hands-on introduction designed for UI designers, developers, or anyone new to UX. We'll demystify the research process and give you the confidence to start gathering valuable insights from your users.",
  availability,
  reviewSkills = [],
  reviewTags = {},
  reviewRoles = {},
  reviewProficiencies = {},
  receiveSkills = [],
  receiveTags = {},
  receiveRoles = {},
  receiveProficiencies = {},
  sessionDuration = { type: "preset", minutes: 30 },
  onPublish,
  onBack,
}: OfferPreviewViewProps) {
  const [localAvailability, setLocalAvailability] = useState<AvailabilityData | null>(availability || null);
  const [localReviewSkills, setLocalReviewSkills] = useState<string[]>(reviewSkills || []);
  const [localReviewTags, setLocalReviewTags] = useState<Record<string, string[]>>(reviewTags || {});
  const [localReviewRoles, setLocalReviewRoles] = useState<Record<string, string>>(reviewRoles || {});
  const [localReviewProficiencies, setLocalReviewProficiencies] = useState<Record<string, string>>(reviewProficiencies || {});
  const [localReceiveSkills, setLocalReceiveSkills] = useState<string[]>(receiveSkills || []);
  const [localReceiveTags, setLocalReceiveTags] = useState<Record<string, string[]>>(receiveTags || {});
  const [localReceiveRoles, setLocalReceiveRoles] = useState<Record<string, string>>(receiveRoles || {});
  const [localReceiveProficiencies, setLocalReceiveProficiencies] = useState<Record<string, string>>(receiveProficiencies || {});

  const [localSessionDuration, setLocalSessionDuration] = useState<{ type: "preset" | "custom"; minutes: number }>(sessionDuration);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTimezoneModalOpen, setIsTimezoneModalOpen] = useState(false);

  // Availability editing state
  const [isEditAvailabilityOpen, setIsEditAvailabilityOpen] = useState(false);

  // Skills editing state
  const [skillsEditModal, setSkillsEditModal] = useState<{ open: boolean; type: "offered" | "wanted" }>({
    open: false,
    type: "offered"
  });

  const [reviewSelectionModal, setReviewSelectionModal] = useState<{ open: boolean; type: "offered" | "wanted" }>({
    open: false,
    type: "offered"
  });

  const handleEditSkills = (type: "offered" | "wanted") => {
    setSkillsEditModal({ open: true, type });
  };

  const handleApplySkillsUpdate = (skills: string[], tags: Record<string, string[]>, roles: Record<string, string>, profs: Record<string, string>) => {
    if (skillsEditModal.type === "offered") {
      setLocalReviewSkills(skills);
      setLocalReviewTags(tags);
      setLocalReviewRoles(roles);
      setLocalReviewProficiencies(profs);
    } else {
      setLocalReceiveSkills(skills);
      setLocalReceiveTags(tags);
      setLocalReceiveRoles(roles);
      setLocalReceiveProficiencies(profs);
    }
  };

  const handleEditAvailability = () => {
    setIsEditAvailabilityOpen(true);
  };

  const formatProficiency = (p: string) => {
    if (!p) return "Basic";
    return p.split(" — ")[0];
  };

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDesc);

  const [editModal, setEditModal] = useState<{
    open: boolean;
    field: "title" | "description" | null;
  }>({ open: false, field: null });

  const openEdit = (field: "title" | "description") =>
    setEditModal({ open: true, field });
  const closeEdit = () => setEditModal({ open: false, field: null });

  const handleUpdate = (value: string) => {
    if (editModal.field === "title") setTitle(value);
    else if (editModal.field === "description") setDescription(value);
  };

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-3xl overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      <div className="relative z-[60] w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-3xl" />
      </div>

      <div className="relative z-[60] w-full px-[16px] py-[8px] flex items-center shrink-0 h-[64px]">
        <div className="flex flex-[1_0_0] items-center gap-[4px] min-w-0">
          <button
            onClick={onBack}
            className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors shrink-0"
          >
            <BackArrowIcon className="w-[24px] h-[24px] text-[#171519]" />
          </button>
          <div className="flex flex-[1_0_0] flex-col items-start justify-center min-w-0">
            <h1 className="font-nunito font-bold text-[#171519] text-[20px] leading-[28px] truncate w-full">
              Edit Your Offer
            </h1>
          </div>
        </div>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors relative shrink-0"
        >
          <MoreIcon className="w-[24px] h-[24px] text-[#171519]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-0 pb-[32px] pt-[8px] preview-scrollbar">
        <div className="flex flex-col gap-[16px] min-w-0 w-full px-[16px]">
          <div className="bg-[#FEF0EA] px-[8px] py-[8px] rounded-[8px] self-start">
            <span className="font-['Nunito'] font-black text-[#b85f38] text-[12px] leading-[16px] tracking-[1.1px] uppercase">
              Unpublished
            </span>
          </div>

          <div className="flex flex-col gap-[24px] min-w-0 w-full">
            <div className="w-full min-w-0 bg-[#faf7fe] rounded-[12px] px-[24px] py-[16px] flex flex-col gap-[12px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
              <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px]">
                Profile
              </span>
              <div className="flex flex-col items-center gap-[12px]">
                <PersonaPfpSet className="w-[109px] h-[109px]" persona="01" />
                <div className="flex flex-col items-center gap-[8px] w-full">
                  <span className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[32px] text-center w-full">
                    Aiko Tanaka
                  </span>
                  <div className="flex items-center gap-[6px]">
                    <SkillbeekSingleStar rating={4.7} />
                    <div className="w-[4px] h-[4px] rounded-full bg-[#171519]" />
                    <button className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px] underline">
                      34 reviews
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px] min-w-0 w-full">
              <SectionCard title="Topic" onEdit={() => openEdit("title")}>
                <p className="font-['Nunito'] font-medium text-[#49464c] text-[20px] leading-[28px] tracking-[-0.2px] overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                  {title}
                </p>
              </SectionCard>

              <SectionCard title="Offer description" onEdit={() => openEdit("description")}>
                <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[1px] line-clamp-5 overflow-hidden break-words break-all w-full min-w-0">
                  {description}
                </p>
              </SectionCard>

              <SectionCard title="Availability" onEdit={handleEditAvailability}>
                <div className="flex flex-col gap-[12px]">
                  {localAvailability?.type === "Recurring Weekly" && localAvailability.recurringSlots.length > 0 ? (
                    localAvailability.recurringSlots.map((slot, i) => (
                      <React.Fragment key={i}>
                        <div className="flex flex-col gap-[12px]">
                          <div className="flex items-center gap-[8px]">
                            <CalendarIcon className="w-[24px] h-[24px] text-[#171519]" />
                            <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px] tracking-[0.1px]">
                              {getRecurringDaysText(slot.days)}
                            </span>
                          </div>
                          <div className="flex items-center gap-[8px]">
                            <ClockIcon className="w-[24px] h-[24px] text-[#171519]" />
                            <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px] tracking-[0.1px]">
                              {slot.timeRange.start} - {slot.timeRange.end}
                            </span>
                          </div>
                        </div>
                        {i < localAvailability.recurringSlots.length - 1 && <NeumorphicDivider />}
                      </React.Fragment>
                    ))
                  ) : localAvailability?.type === "Specific Dates" && localAvailability.specificSlots.length > 0 ? (
                    localAvailability.specificSlots.map((slot, i) => (
                      <React.Fragment key={i}>
                        <div className="flex flex-col gap-[12px]">
                          <div className="flex items-center gap-[8px]">
                            <CalendarIcon className="w-[24px] h-[24px] text-[#171519]" />
                            <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px] tracking-[0.1px]">
                              {getSpecificDatesText(slot.dateRange)}
                            </span>
                          </div>
                          <div className="flex items-center gap-[8px]">
                            <ClockIcon className="w-[24px] h-[24px] text-[#171519]" />
                            <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px] tracking-[0.1px]">
                              {slot.timeRange.start} - {slot.timeRange.end}
                            </span>
                          </div>
                        </div>
                        {i < localAvailability.specificSlots.length - 1 && <NeumorphicDivider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px] tracking-[0.1px]">
                      Not set
                    </span>
                  )}

                  <button
                    onClick={() => setIsTimezoneModalOpen(true)}
                    className="flex items-center gap-[4px] self-start mt-[4px]"
                  >
                    <span className="font-['Nunito'] font-bold text-[#b7812f] text-[16px] leading-[24px]">
                      {localAvailability?.timezone?.split("/").pop()?.replace(/_/g, " ") || "Lagos"}
                    </span>
                    <PencilIcon className="w-[16px] h-[16px] text-[#b7812f]" />
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Offered skills" onEdit={() => handleEditSkills("offered")}>
                {localReviewSkills.length > 0 ? (() => {
                  const firstSkill = localReviewSkills[0];
                  const firstTags = localReviewTags[firstSkill] || [];
                  const displayedTags = firstTags.slice(0, 2);
                  const extraTags = firstTags.length - 2;

                  return (
                    <div className="flex items-start gap-[16px]">
                      <UniversalSkillIcon className="w-[40px] h-[40px] shrink-0" />
                      <div className="flex-1 flex flex-col gap-[16px]">
                        <div className="flex items-center gap-[8px]">
                          <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px] w-[132px] truncate block">
                            {firstSkill}
                          </span>
                          <div className="bg-[#f8efff] px-[8px] py-[4px] rounded-[8px] shrink-0">
                            <span className="font-['Nunito'] font-bold text-[#8c35be] text-[12px] leading-[16px] tracking-[1.1px] truncate block">
                              {localReviewRoles[firstSkill] ? `${localReviewRoles[firstSkill]} • ` : ""}{formatProficiency(localReviewProficiencies[firstSkill])}
                            </span>
                          </div>
                        </div>

                        {firstTags.length > 0 && (
                          <div className="flex flex-wrap gap-[6px]">
                            {displayedTags.map(tag => (
                              <div key={tag} className="bg-[#f0edf4] p-[12px] rounded-[12px] flex items-center">
                                <span className="font-['Nunito'] font-semibold text-[#b7812f] text-[14px] leading-[20px] tracking-[1px] whitespace-nowrap">
                                  {tag}
                                </span>
                              </div>
                            ))}
                            {extraTags > 0 && (
                              <div className="bg-[#f0edf4] p-[12px] rounded-[12px] flex items-center">
                                <span className="font-['Nunito'] font-semibold text-[#b7812f] text-[14px] leading-[20px] tracking-[1px]">
                                  +{extraTags}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {localReviewSkills.length > 1 && (
                          <button
                            onClick={() => setReviewSelectionModal({ open: true, type: "offered" })}
                            className="h-[48px] py-[12px] rounded-[16px] bg-transparent border-none outline-none flex items-center justify-center self-start"
                          >
                            <span className="font-['Nunito'] font-bold text-[#737076] text-[16px] leading-[24px] tracking-[0.16px]">
                              + {localReviewSkills.length - 1} more
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })() : (
                  <div className="flex items-center gap-[16px]">
                    <UniversalSkillIcon className="w-[40px] h-[40px] shrink-0" />
                    <div className="flex-1 flex flex-col gap-[6px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px] w-[132px] truncate block">
                          3D modelling
                        </span>
                        <div className="bg-[#f8efff] px-[8px] py-[4px] rounded-[8px] shrink-0">
                          <span className="font-['Nunito'] font-bold text-[#8c35be] text-[12px] leading-[16px] tracking-[1.1px]">
                            Intermediate
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Skills you want" onEdit={() => handleEditSkills("wanted")}>
                {localReceiveSkills.length > 0 ? (() => {
                  const firstSkill = localReceiveSkills[0];
                  const firstTags = localReceiveTags[firstSkill] || [];
                  const displayedTags = firstTags.slice(0, 2);
                  const extraTags = firstTags.length - 2;

                  return (
                    <div className="flex items-start gap-[16px]">
                      <UniversalSkillIcon className="w-[40px] h-[40px] shrink-0" />
                      <div className="flex-1 flex flex-col gap-[16px]">
                        <div className="flex items-center gap-[8px]">
                          <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px] w-[132px] truncate block">
                            {firstSkill}
                          </span>
                          <div className="bg-[#f8efff] px-[8px] py-[4px] rounded-[8px] shrink-0">
                            <span className="font-['Nunito'] font-bold text-[#8c35be] text-[12px] leading-[16px] tracking-[1.1px] truncate block">
                              {localReceiveRoles[firstSkill] ? `${localReceiveRoles[firstSkill]} • ` : ""}{formatProficiency(localReceiveProficiencies[firstSkill])}
                            </span>
                          </div>
                        </div>

                        {firstTags.length > 0 && (
                          <div className="flex flex-wrap gap-[6px]">
                            {displayedTags.map(tag => (
                              <div key={tag} className="bg-[#f0edf4] p-[12px] rounded-[12px] flex items-center">
                                <span className="font-['Nunito'] font-semibold text-[#b7812f] text-[14px] leading-[20px] tracking-[1px] whitespace-nowrap">
                                  {tag}
                                </span>
                              </div>
                            ))}
                            {extraTags > 0 && (
                              <div className="bg-[#f0edf4] p-[12px] rounded-[12px] flex items-center">
                                <span className="font-['Nunito'] font-semibold text-[#b7812f] text-[14px] leading-[20px] tracking-[1px]">
                                  +{extraTags}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {localReceiveSkills.length > 1 && (
                          <button
                            onClick={() => setReviewSelectionModal({ open: true, type: "wanted" })}
                            className="h-[48px] py-[12px] rounded-[16px] bg-transparent border-none outline-none flex items-center justify-center self-start"
                          >
                            <span className="font-['Nunito'] font-bold text-[#737076] text-[16px] leading-[24px] tracking-[0.16px]">
                              + {localReceiveSkills.length - 1} more
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })() : (
                  <div className="flex items-center gap-[16px]">
                    <UniversalSkillIcon className="w-[40px] h-[40px] shrink-0" />
                    <div className="flex-1 flex flex-col gap-[6px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[28px] w-[132px] truncate block">
                          UI design
                        </span>
                        <div className="bg-[#f8efff] px-[8px] py-[4px] rounded-[8px] shrink-0">
                          <span className="font-['Nunito'] font-bold text-[#8c35be] text-[12px] leading-[16px] tracking-[1.1px]">
                            Basic
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Session length" onEdit={() => setIsDurationModalOpen(true)}>
                <div className="flex items-center gap-[6px]">
                  <TimerIcon className="w-[24px] h-[24px] text-[#171519]" />
                  <span className="font-['Nunito'] font-medium text-[#656268] text-[16px] leading-[24px] tracking-[0.1px]">
                    {formatDuration(localSessionDuration.minutes)}
                  </span>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#faf7fe] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] pt-[8px] pb-[40px]">
        <div className="px-[16px] mt-[16px]">
          <button
            onClick={onPublish}
            className="w-full h-[56px] bg-[#171519] rounded-[16px] flex items-center justify-center gap-[8px] hover:bg-[#2f2c32] transition-colors"
          >
            <span className="font-['Nunito'] font-bold text-[#fbf6ff] text-[16px]">
              Go Live
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-[60] pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]" />
      </div>

      <AnimatePresence>
        {isDurationModalOpen && (
          <DurationPickerModal
            isOpen={isDurationModalOpen}
            onClose={() => setIsDurationModalOpen(false)}
            initialHours={Math.floor(localSessionDuration.minutes / 60)}
            initialMinutes={localSessionDuration.minutes % 60}
            onApply={(h, m) => {
              setLocalSessionDuration({ type: "custom", minutes: h * 60 + m });
              setIsDurationModalOpen(false);
            }}
          />
        )}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 flex"
          >
            <div className="absolute inset-0 bg-[#2f2c3242] backdrop-blur-[4px]" onClick={() => setIsMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-[28px] top-[120px] w-[279px] bg-[#faf7fe] rounded-[16px] p-[8px] flex flex-col gap-[8px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)]"
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full bg-transparent rounded-[12px] px-[16px] py-[12px] flex items-center gap-[12px] hover:bg-[#f0edf4] transition-colors"
              >
                <DocumentIcon className="w-[24px] h-[24px] text-[#171519]" />
                <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px]">Save Draft</span>
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className="w-full bg-transparent rounded-[12px] px-[16px] py-[12px] flex items-center gap-[12px] hover:bg-[#f0edf4] transition-colors"
              >
                <TrashIcon className="w-[24px] h-[24px] text-[#870113]" />
                <span className="font-['Nunito'] font-bold text-[#870113] text-[16px] leading-[24px]">Delete Offer</span>
              </button>
            </motion.div>
          </motion.div>
        )}
        {editModal.open && (
          <EditFieldModal
            key={editModal.field}
            isOpen={editModal.open}
            onClose={closeEdit}
            onUpdate={handleUpdate}
            label={editModal.field === "title" ? "Topic" : "Offer description"}
            initialValue={editModal.field === "title" ? title : description}
            maxChars={editModal.field === "title" ? 80 : 500}
          />
        )}
        {isTimezoneModalOpen && (
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
        )}
        <EditAvailabilityModal
          isOpen={isEditAvailabilityOpen}
          onClose={() => setIsEditAvailabilityOpen(false)}
          availability={localAvailability}
          onApply={(data) => {
            setLocalAvailability(data);
            setIsEditAvailabilityOpen(false);
          }}
        />
        {skillsEditModal.open && (
          <SkillsEditModal
            isOpen={skillsEditModal.open}
            onClose={() => setSkillsEditModal({ ...skillsEditModal, open: false })}
            type={skillsEditModal.type}
            initialSkills={skillsEditModal.type === "offered" ? localReviewSkills : localReceiveSkills}
            initialTags={skillsEditModal.type === "offered" ? localReviewTags : localReceiveTags}
            initialRoles={skillsEditModal.type === "offered" ? localReviewRoles : localReceiveRoles}
            initialProficiencies={skillsEditModal.type === "offered" ? localReviewProficiencies : localReceiveProficiencies}
            onApply={handleApplySkillsUpdate}
          />
        )}
        <ReviewSelectionModal
          isOpen={reviewSelectionModal.open}
          onClose={() => setReviewSelectionModal({ ...reviewSelectionModal, open: false })}
          title="Review your selection"
          skills={reviewSelectionModal.type === "offered" ? localReviewSkills : localReceiveSkills}
          tags={reviewSelectionModal.type === "offered" ? localReviewTags : localReceiveTags}
          roles={reviewSelectionModal.type === "offered" ? localReviewRoles : localReceiveRoles}
          proficiencies={reviewSelectionModal.type === "offered" ? localReviewProficiencies : localReceiveProficiencies}
          onAddMore={() => handleEditSkills(reviewSelectionModal.type)}
          onRemoveSkill={(skill) => {
            if (reviewSelectionModal.type === "offered") {
              setLocalReviewSkills(prev => prev.filter(s => s !== skill));
            } else {
              setLocalReceiveSkills(prev => prev.filter(s => s !== skill));
            }
          }}
        />
      </AnimatePresence>
    </div>
  );
}
