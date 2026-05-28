import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { SaveExitModal } from "../components/SaveExitModal";
import { CustomAnimatedRadioButton } from "../../../components/common/CustomAnimatedRadioButton";

interface ProficiencyLevelsViewProps {
  selectedSkills: string[];
  skillTagsMap: Record<string, string[]>;
  onBack: () => void;
  onNext: (proficiencies: Record<string, string>) => void;
}

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

function NeumorphicDivider() {
  return (
    <div className="w-full flex items-center justify-center my-[16px]">
      <div
        className="w-full h-[2px] rounded-full bg-[#fbf6ff]"
        style={{
          boxShadow: "inset 2px 2px 12px rgba(192, 188, 195, 0.5), inset -2px -2px 12px rgba(255, 255, 255, 0.9)"
        }}
      />
    </div>
  );
}

export function ProficiencyLevelsView({
  selectedSkills,
  skillTagsMap,
  onBack,
  onNext
}: ProficiencyLevelsViewProps) {
  const [proficiencies, setProficiencies] = useState<Record<string, string>>(
    Object.fromEntries(selectedSkills.map(skill => [skill, ""]))
  );
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleSelect = (skill: string, level: string) => {
    setProficiencies(prev => ({ ...prev, [skill]: level }));
  };

  const isNextEnabled = selectedSkills.every(skill => proficiencies[skill] !== "");

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Status Bar */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0 z-10 relative bg-[#fbf6ff]">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]" />
      </div>

      {/* Header Action Buttons (Fixed at Top) */}
      <div className="w-full px-[16px] flex justify-between items-center py-[16px] shrink-0 bg-[#fbf6ff] z-20">
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors bg-white"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
            Save and Exit
          </span>
        </button>
        <button className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors bg-white">
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
            Questions?
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full flex flex-col relative pt-[0px] availability-scrollbar">

        {/* Page Header */}
        <div className="w-full px-[16px] flex flex-col gap-[12px] mb-[32px]">
          <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1.2px]">
            Set your proficiency levels
          </h1>
          <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
            Choose your current ability level. Honesty helps you find the right matches.
          </p>
        </div>

        {/* Skills List */}
        <div className="w-full px-[16px] flex flex-col">
          {selectedSkills.map((skill, index) => (
            <React.Fragment key={skill}>
              <div className="flex flex-col gap-[12px]">
                <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px]">
                  {skill}
                </h3>
                <div className="flex flex-col">
                  {PROFICIENCY_LEVELS.map(level => {
                    const isSelected = proficiencies[skill] === level;
                    return (
                      <div
                        key={level}
                        onClick={() => handleSelect(skill, level)}
                        className="flex items-center gap-[6px] cursor-pointer group py-[10px]"
                      >
                        <CustomAnimatedRadioButton checked={isSelected} />
                        <span className={`font-['Nunito'] ${isSelected ? "font-bold" : "font-semibold"} text-[16px] leading-[24px] text-[#2f2c32] tracking-[0.1px] transition-all`}>
                          {level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {index < selectedSkills.length - 1 && <NeumorphicDivider />}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom Spacer */}
        <div className="h-[156px] shrink-0" aria-hidden="true" />
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[#faf7fe] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col gap-[32px] items-center pt-[0px] pb-[44px] z-20">
        {/* Progress Bar */}
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={2} subStepProgress={50} totalSteps={3} />
        </div>

        {/* Buttons */}
        <div className="w-full flex items-center justify-between px-[16px]">
          <button
            onClick={onBack}
            className="flex h-[48px] items-center justify-center px-[16px] py-[12px] font-['Nunito'] font-bold text-[#49464c] text-[16px] leading-[24px] tracking-[0.16px] underline"
          >
            Back
          </button>
          <button
            onClick={() => isNextEnabled && onNext(proficiencies)}
            disabled={!isNextEnabled}
            className={`flex items-center justify-center px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] leading-[24px] tracking-[0.16px] transition-colors ${isNextEnabled
              ? "bg-[#171519] text-[#fbf6ff]"
              : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]" />
      </div>

      <SaveExitModal
        isOpen={isSaveModalOpen}
        onKeepWorking={() => setIsSaveModalOpen(false)}
        onExit={() => {
          setIsSaveModalOpen(false);
          onBack();
        }}
      />
    </div>
  );
}
