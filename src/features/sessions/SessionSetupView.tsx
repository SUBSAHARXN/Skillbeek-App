import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PersonaPfpSet } from "../../components/common/PersonaPfpSet";
import { CustomAnimatedRadioButton } from "../../components/common/CustomAnimatedRadioButton";
import { EditFieldModal } from "../offers/components/EditFieldModal";
import { SaveExitModal } from "../offers/components/SaveExitModal";
import { OfferProgressBar } from "../offers/components/OfferProgressBar";
import { BackArrowIcon, TimeCreditIcon, TimerIcon } from "../../components/common/Icons";
import { EditRateModal } from "../offers/components/EditRateModal";
import { DurationPickerModal } from "../offers/components/DurationPickerModal";

import { SectionCard } from "../../components/common/SectionCard";

interface SessionSetupViewProps {
  onBack: () => void;
  onNext: () => void;
  isP1?: boolean;
  isTimeCredit?: boolean;
  timeCreditRate?: number;
  sessionMinutes?: number;
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

export function SessionSetupView({
  onBack,
  onNext,
  isP1 = false,
  isTimeCredit = false,
  timeCreditRate = 120,
  sessionMinutes = 60,
}: SessionSetupViewProps) {
  const [title, setTitle] = useState("Teach UI");
  const [role, setRole] = useState("Mentee/Learner");
  const [localRate, setLocalRate] = useState(timeCreditRate);
  const [localDuration, setLocalDuration] = useState(sessionMinutes);

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      {/* Header Action Buttons */}
      <div className="w-full flex justify-between items-center py-[16px] px-[16px] shrink-0 bg-[#fbf6ff] z-20">
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors bg-white pointer-events-auto"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
            Save and Exit
          </span>
        </button>
        <button className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors bg-white pointer-events-auto">
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
            Questions?
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-col relative pt-[0px] pb-[180px] px-[16px] availability-scrollbar">
        
        {/* Flexible Exchange Info Banner */}
        <div className="w-full mb-[24px]">
          <div className="w-full bg-[#edf2ff] rounded-[12px] px-[12px] py-[14px] flex gap-[8px] items-start shadow-[0px_4px_12px_rgba(18,9,0,0.15)]">
            <ExchangeIcon />
            <span className="font-['Nunito'] font-medium text-[#020038] text-[16px] leading-[24px] tracking-[0.1px]">
              Great! Let's get your <strong className="font-bold text-[#020038]">{title}</strong> session scheduled.
            </span>
          </div>
        </div>

        {/* Header Title */}
        <h2 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1px] mb-[24px]">
          Who's this session with?
        </h2>

        {/* User Card */}
        <div className="w-full bg-[#faf7fe] rounded-[12px] px-[16px] py-[16px] flex items-center gap-[16px] border border-[#f0edf4] mb-[16px] shadow-skillbeek-sm">
          <div 
            className="relative w-10 h-10 shrink-0 rounded-full"
            style={{
              border: "4px solid var(--mapped\\/surface\\/ui-surface-stroke, var(--mapped-button-ui-comp-sur-stroke, #eacfff))",
              boxSizing: "content-box"
            }}
          >
            <PersonaPfpSet
              className="w-full h-full rounded-full"
              persona="07"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[24px]">
              Mei Lin
            </span>
            <span className="font-['Nunito'] font-medium text-[#737076] text-[14px] leading-[20px]">
              Selected from your offer
            </span>
          </div>
        </div>

        {/* Title Card */}
        <div className="mb-[16px] w-full">
          <SectionCard title="Title" onEdit={() => setIsTitleModalOpen(true)}>
            <p className="font-['Nunito'] font-medium text-[#49464c] text-[20px] leading-[28px] tracking-[-0.2px] overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
              {title}
            </p>
          </SectionCard>
        </div>

        {/* Role Card */}
        <div className="w-full mb-[16px]">
          <SectionCard title="Session role" onEdit={() => setIsRoleModalOpen(true)}>
            <div className="flex items-center gap-[8px] p-[16px] bg-[#f8efff] rounded-[12px] w-full">
              <CustomAnimatedRadioButton checked={true} />
              <span className="text-[#171519] font-bold text-[18px] leading-[24px]">{role}</span>
            </div>
          </SectionCard>
        </div>

        {/* Rate card (if isTimeCredit is true) */}
        {isTimeCredit && (
          <div className="w-full mb-[16px]">
            <SectionCard title="Rate (per session)" onEdit={isP1 ? () => setIsRateModalOpen(true) : undefined}>
              <div className="flex items-center gap-[12px]">
                <TimeCreditIcon className="w-[24px] h-[24px]" />
                <span className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[32px] tracking-[-0.7px]">
                  {localRate}
                </span>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Duration Card */}
        <div className="w-full">
          <SectionCard title="Duration" onEdit={isP1 ? () => setIsDurationModalOpen(true) : undefined}>
            <div className="flex items-center gap-[8px]">
              <TimerIcon className="w-[24px] h-[24px] text-[#171519]" />
              <span className="font-['Nunito'] font-bold text-[#171519] text-[18px] leading-[24px]">
                {formatDuration(localDuration)}
              </span>
            </div>
          </SectionCard>
        </div>

      </div>

      {/* Fixed Bottom Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[#faf7fe] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col items-center gap-[32px] pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={1} subStepProgress={50} />
        </div>
        <div className="w-full flex items-center justify-between px-[16px]">
          <button
            onClick={onBack}
            className="font-['Nunito'] font-bold text-[#49464c] text-[16px] leading-[24px] underline cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="font-['Nunito'] font-bold text-[16px] leading-[24px] px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] bg-[#171519] text-[#fbf6ff] cursor-pointer hover:bg-[#2f2c32] transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]" />
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
            <div className="absolute inset-0 bg-[#2f2c3242] backdrop-blur-[4px]" onClick={() => setIsRoleModalOpen(false)} />
            
            {/* Modal Card */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-[384px] bg-[#faf7fe] rounded-t-[32px] pt-[24px] px-[24px] pb-[48px] flex flex-col gap-[24px] shadow-[0px_-8px_24px_rgba(18,9,0,0.1)] z-10"
            >
              <div className="flex flex-col gap-[8px]">
                <h3 className="font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[32px]">
                  Select Session Role
                </h3>
                <p className="font-['Nunito'] font-medium text-[#737076] text-[14px] leading-[20px]">
                  Choose how you'd like to connect and grow together.
                </p>
              </div>

              {/* Radio List */}
              <div className="flex flex-col gap-[12px] w-full">
                {ROLES.map((r) => {
                  const isChecked = role === r.value;
                  return (
                    <div
                      key={r.value}
                      onClick={() => {
                        setRole(r.value);
                        setIsRoleModalOpen(false);
                      }}
                      className={`w-full p-[16px] rounded-[16px] border flex items-center justify-between cursor-pointer transition-all duration-300 bg-[#faf7fe] shadow-skillbeek-sm ${
                        isChecked 
                          ? "border-[#171519]" 
                          : "border-[#f0edf4] hover:bg-[#f0edf4]"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px]">
                          {r.value}
                        </span>
                        <span className="font-['Nunito'] font-medium text-[#737076] text-[12px] leading-[16px]">
                          {r.description}
                        </span>
                      </div>
                      <CustomAnimatedRadioButton checked={isChecked} />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rate Edit Modal */}
      <AnimatePresence>
        {isRateModalOpen && (
          <EditRateModal
            isOpen={isRateModalOpen}
            onClose={() => setIsRateModalOpen(false)}
            initialRate={localRate}
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
              setIsDurationModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
