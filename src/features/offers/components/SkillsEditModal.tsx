import React, { useState } from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { Button } from "../../../components/ui/Button";
import { GlobalAddTagsModal } from "./GlobalAddTagsModal";
import { CloseIcon } from "../../../components/common/Icons";
import { CustomAnimatedCheckbox } from "../../../components/common/CustomAnimatedCheckbox";
import { CustomAnimatedRadioButton } from "../../../components/common/CustomAnimatedRadioButton";

interface SkillsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "offered" | "wanted";
  initialSkills: string[];
  initialTags: Record<string, string[]>;
  initialRoles: Record<string, string>;
  initialProficiencies: Record<string, string>;
  initialActiveSkillForTags?: string;
  onApply: (skills: string[], tags: Record<string, string[]>, roles: Record<string, string>, proficiencies: Record<string, string>) => void;
  onApplyTagsOnly?: (skill: string, tags: string[]) => void;
  zIndex?: number;
}

const SKILL_CATEGORIES = [
  { name: "Design & Creative", skills: ["Visual Design", "Experience Design", "Motion & 3D"] },
  { name: "Product & Strategy", skills: ["Product Management", "User Research", "Market Strategy"] },
  { name: "Engineering & Data", skills: ["Web Development", "Mobile Development", "Data Science"] },
  { name: "Writing & Content", skills: ["Copywriting", "Content Strategy", "Technical Writing"] },
  { name: "Business Operations & Growth", skills: ["Digital Marketing", "Customer Success", "Project Operations"] }
];

const OFFERED_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const WANTED_LEVELS = ["Open to all", "Beginner", "Intermediate", "Advanced"];

export function SkillsEditModal({
  isOpen,
  onClose,
  type,
  initialSkills,
  initialTags,
  initialRoles,
  initialProficiencies,
  initialActiveSkillForTags,
  onApply,
  onApplyTagsOnly,
  zIndex = 500,
}: SkillsEditModalProps) {
  const [step, setStep] = useState<"skills" | "roles" | "levels">("skills");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [tags, setTags] = useState<Record<string, string[]>>(initialTags);
  const [roles, setRoles] = useState<Record<string, string>>(initialRoles);
  const [proficiencies, setProficiencies] = useState<Record<string, string>>(initialProficiencies);
  const [searchQuery, setSearchQuery] = useState("");

  // Tag modal state
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [activeSkillForTags, setActiveSkillForTags] = useState<string>("");
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  React.useEffect(() => {
    if (initialActiveSkillForTags && isOpen) {
      setActiveSkillForTags(initialActiveSkillForTags);
      setTempTags(initialTags[initialActiveSkillForTags] || []);
      setTagInput("");
      // Small delay to ensure parent animation context is ready for the child pop-up
      const timer = setTimeout(() => {
        setIsTagModalOpen(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialActiveSkillForTags, isOpen, initialTags]);

  const levels = type === "offered" ? OFFERED_LEVELS : WANTED_LEVELS;

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      // Just uncheck the skill and remove its tags
      setSelectedSkills(prev => prev.filter(s => s !== skill));
      setTags(prev => {
        const next = { ...prev };
        delete next[skill];
        return next;
      });
    } else {
      if (selectedSkills.length >= 3) return;
      // Open tag modal to add new skill
      setActiveSkillForTags(skill);
      setTempTags([]);
      setTagInput("");
      setIsTagModalOpen(true);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const val = tagInput.trim().replace(/,$/, "");
      if (val && !tempTags.includes(val) && tempTags.length < 5) {
        setTempTags(prev => [...prev, val]);
      }
      setTagInput("");
    }
  };

  const toggleTempTag = (tag: string) => {
    setTempTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 5 ? [...prev, tag] : prev
    );
  };

  const handleApplyTags = () => {
    if (tempTags.length === 0) return; // Must have at least 1 tag
    
    if (onApplyTagsOnly) {
      onApplyTagsOnly(activeSkillForTags, tempTags);
      onClose();
      return;
    }

    if (!selectedSkills.includes(activeSkillForTags)) {
      setSelectedSkills(prev => [...prev, activeSkillForTags]);
    }
    setTags(prev => ({ ...prev, [activeSkillForTags]: tempTags }));
    setIsTagModalOpen(false);
  };

  const handleClearSkillTags = () => {
    if (onApplyTagsOnly) {
      // If we are in tags-only mode, "Remove skill" should actually remove it from the parent's state
      onApplyTagsOnly(activeSkillForTags, []); // Sending empty array means removal
      onClose();
      return;
    }

    setSelectedSkills(prev => prev.filter(s => s !== activeSkillForTags));
    setTags(prev => {
      const next = { ...prev };
      delete next[activeSkillForTags];
      return next;
    });
    setIsTagModalOpen(false);
  };

  const handleApplySkills = () => {
    const newRoles = { ...roles };
    const newProfs = { ...proficiencies };
    const roleOptions = ["Mentor", "Collaborator", "Reviewer", "Mentee / Learner"];
    
    selectedSkills.forEach(skill => {
      if (!newRoles[skill]) newRoles[skill] = roleOptions[0];
      if (!newProfs[skill]) newProfs[skill] = levels[0];
    });
    setRoles(newRoles);
    setProficiencies(newProfs);
    setStep("roles");
  };

  const handleApplyRoles = () => {
    setStep("levels");
  };

  const handleApplyAll = () => {
    onApply(selectedSkills, tags, roles, proficiencies);
    onClose();
  };

  const sheetTitle = step === "skills" ? `Edit ${type === "offered" ? "Offered" : "Wanted"} Skills` : 
                     step === "roles" ? (type === "offered" ? "How will you share this skill" : "Who are you looking for") : 
                     "Set Proficiency";

  return (
    <>
      <BottomSheet
        isOpen={isOpen && !initialActiveSkillForTags}
        onClose={onClose}
        title={sheetTitle}
        style={{ height: "85%" }}
        zIndex={zIndex}
        className={isTagModalOpen ? "opacity-0 pointer-events-none" : ""}
      >
        <div className="w-full flex flex-col px-0 h-full overflow-hidden">
          {/* Content Area */}
          <div className="w-full flex-1 overflow-y-auto flex flex-col gap-[16px] pb-[24px] pr-0 modal-scrollbar">
            {step === "skills" ? (
              <div className="flex flex-col gap-[20px] px-[16px]">
                {/* Search */}
                <div className="w-full h-[56px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] flex items-center px-[12px]">
                  <div className="flex items-center gap-[8px] flex-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a09da3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search Skills"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-['Nunito'] font-medium text-[16px] tracking-[0.1px] text-[var(--Text-Primary-heading-1)] placeholder-[#a09da3]"
                    />
                  </div>
                </div>

                {/* Selection Counter */}
                {selectedSkills.length > 0 && (
                  <div className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] p-[10px] flex items-center">
                    <p className="font-['Nunito'] font-bold text-[20px] tracking-[-0.2px] text-[var(--Text-Primary-heading-1)] leading-[28px]">
                      <span>{selectedSkills.length}</span>
                      <span>/3 Selected</span>
                    </p>
                  </div>
                )}

                {/* Categories */}
                {SKILL_CATEGORIES.map(category => {
                  const filteredSkills = category.skills.filter(s =>
                    s.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  if (filteredSkills.length === 0) return null;
                  return (
                    <div key={category.name} className="flex flex-col gap-[12px]">
                      <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-[14px] uppercase tracking-wider">
                        {category.name}
                      </h3>
                      <div className="flex flex-col gap-[8px]">
                        {filteredSkills.map(skill => {
                          const isSelected = selectedSkills.includes(skill);
                          const isDisabled = !isSelected && selectedSkills.length >= 3;
                          return (
                            <div
                              key={skill}
                              onClick={() => !isDisabled && handleToggleSkill(skill)}
                              className={`w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between p-[12px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.15)] transition-colors ${
                                isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)]"
                              }`}
                            >
                              <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] pl-[8px]">
                                {skill}
                              </span>
                              <CustomAnimatedCheckbox checked={isSelected} disabled={isDisabled} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : step === "roles" ? (
              <div className="flex flex-col gap-[24px] px-[16px]">
                {selectedSkills.map(skill => (
                  <div key={skill} className="flex flex-col gap-[12px]">
                    <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[18px]">
                      {skill}
                    </h3>
                    <div className="flex flex-col gap-[8px]">
                      {["Mentor", "Collaborator", "Reviewer", "Mentee / Learner"].map(role => {
                        const isSelected = roles[skill] === role;
                        return (
                          <div
                            key={role}
                            onClick={() => setRoles(prev => ({ ...prev, [skill]: role }))}
                            className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between p-[12px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.15)] cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
                          >
                            <span className={`font-['Nunito'] ${isSelected ? "font-bold" : "font-semibold"} text-[16px] pl-[8px] text-[var(--Text-Primary-heading-1)]`}>
                              {role}
                            </span>
                            <CustomAnimatedRadioButton checked={isSelected} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-[24px] px-[16px]">
                {selectedSkills.map(skill => (
                  <div key={skill} className="flex flex-col gap-[12px]">
                    <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[18px]">
                      {skill}
                    </h3>
                    <div className="flex flex-col gap-[8px]">
                      {levels.map(level => {
                        const isSelected = proficiencies[skill] === level;
                        return (
                          <div
                            key={level}
                            onClick={() => setProficiencies(prev => ({ ...prev, [skill]: level }))}
                            className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between p-[12px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.15)] cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
                          >
                            <span className={`font-['Nunito'] ${isSelected ? "font-bold" : "font-semibold"} text-[16px] pl-[8px] text-[var(--Text-Primary-heading-1)]`}>
                              {level}
                            </span>
                            <CustomAnimatedRadioButton checked={isSelected} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="w-full flex items-center justify-between mt-[16px] shrink-0 px-[16px]">
            {step === "skills" ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => { setSelectedSkills([]); setTags({}); }}
                >
                  Clear all
                </Button>
                <Button
                  variant="primary"
                  className="min-w-[101px]"
                  disabled={selectedSkills.length === 0}
                  onClick={handleApplySkills}
                >
                  Next
                </Button>
              </>
            ) : step === "roles" ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setStep("skills")}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  className="min-w-[101px]"
                  onClick={handleApplyRoles}
                >
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setStep("roles")}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  className="min-w-[101px]"
                  onClick={handleApplyAll}
                >
                  Apply
                </Button>
              </>
            )}
          </div>
        </div>
      </BottomSheet>

      {/* Add Tags Modal */}
      <GlobalAddTagsModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        tags={tempTags}
        onToggleTag={toggleTempTag}
        onApply={handleApplyTags}
        onClear={handleClearSkillTags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        onTagInputKeyDown={handleTagInputKeyDown}
        footerActions={
          <div className="w-full flex items-center justify-between px-[16px] mt-[12px]">
            <Button
              variant="ghost"
              onClick={handleClearSkillTags}
            >
              {selectedSkills.includes(activeSkillForTags) ? "Remove skill" : "Cancel"}
            </Button>
            <Button
              variant="primary"
              className="min-w-[101px]"
              disabled={tempTags.length === 0}
              onClick={handleApplyTags}
            >
              Apply
            </Button>
          </div>
        }
      />
    </>
  );
}
