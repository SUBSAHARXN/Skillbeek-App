import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, SearchIcon } from "../../../components/common/Icons";
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
  onApply: (skills: string[], tags: Record<string, string[]>, roles: Record<string, string>, proficiencies: Record<string, string>) => void;
}

const SKILL_CATEGORIES = [
  { name: "Design & Creative", skills: ["Visual Design", "Experience Design", "Motion & 3D"] },
  { name: "Product & Strategy", skills: ["Product Management", "User Research", "Market Strategy"] },
  { name: "Engineering & Data", skills: ["Web Development", "Mobile Development", "Data Science"] },
  { name: "Writing & Content", skills: ["Copywriting", "Content Strategy", "Technical Writing"] },
  { name: "Business Operations & Growth", skills: ["Digital Marketing", "Customer Success", "Project Operations"] }
];

const SKILL_TAGS_SUGGESTIONS: Record<string, string[]> = {
  "Visual Design": ["Logo design", "Brand guidelines", "Visual identity", "Typography", "Colour theory"],
  "Experience Design": ["Wireframing", "Prototyping", "User flows", "Information architecture", "Usability testing"],
  "Motion & 3D": ["2D Animation", "3D Modeling", "Video editing", "After Effects", "Character design"],
  "Product Management": ["Agile", "Roadmap", "Stakeholder management", "Backlog grooming", "Product lifecycle"],
  "User Research": ["Interviews", "Surveys", "Persona creation", "A/B testing", "Competitive analysis"],
  "Market Strategy": ["SEO", "Content strategy", "Market research", "Growth hacking", "Brand positioning"],
  "Web Development": ["React", "Node.js", "CSS/HTML", "TypeScript", "API Integration"],
  "Mobile Development": ["React Native", "Swift", "Kotlin", "Flutter", "App Store Optimization"],
  "Data Science": ["Python", "Machine Learning", "Data visualization", "SQL", "Statistical analysis"],
  "Copywriting": ["Ad copy", "Scriptwriting", "UX writing", "Ghostwriting", "Storytelling"],
  "Content Strategy": ["Editorial calendar", "SEO", "Social media strategy", "Analytics", "Tone of voice"],
  "Technical Writing": ["API documentation", "User guides", "White papers", "Markdown", "Knowledge base"],
  "Digital Marketing": ["Google Ads", "Meta Ads", "Email marketing", "Analytics", "Funnel optimization"],
  "Customer Success": ["CRM", "Retention", "Churn reduction", "Onboarding", "Customer feedback"],
  "Project Operations": ["Resource management", "Budgeting", "Process improvement", "Risk management", "OKRs"]
};

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
  onApply
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
    if (!selectedSkills.includes(activeSkillForTags)) {
      setSelectedSkills(prev => [...prev, activeSkillForTags]);
    }
    setTags(prev => ({ ...prev, [activeSkillForTags]: tempTags }));
    setIsTagModalOpen(false);
  };

  const handleClearSkillTags = () => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
          />

          {/* Bottom Sheet */}
          <motion.div
            key="bottom-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full z-50 bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] h-[85%]"
          >
            <div className="w-full flex flex-col px-0 h-full">
              {/* Drag Handle */}
              <div className="w-full flex justify-center px-[16px] shrink-0">
                <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />
              </div>

              {/* Header */}
              <div className="w-full flex items-center justify-center relative mb-[16px] h-[24px] shrink-0 px-[16px]">
                <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                  {step === "skills" ? `Edit ${type === "offered" ? "Offered" : "Wanted"} Skills` : 
                   step === "roles" ? (type === "offered" ? "How will you share this skill" : "Who are you looking for") : 
                   "Set Proficiency"}
                </h3>
                <button
                  onClick={onClose}
                  className="absolute right-[16px] w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-gray-200 transition-colors"
                >
                  <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
                </button>
              </div>

              {/* Divider */}
              <div className="w-full px-[16px] mb-[12px] shrink-0">
                <div className="w-full h-[1px] bg-[#e0dce3]" />
              </div>

              {/* Content Area */}
              <div className="w-full flex-1 overflow-y-auto flex flex-col gap-[16px] pb-[24px] pr-0 modal-scrollbar">
                {step === "skills" ? (
                  <div className="flex flex-col gap-[20px] px-[16px]">
                    {/* Search */}
                    <div className="w-full h-[56px] bg-[#faf7fe] rounded-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] flex items-center px-[12px]">
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
                          className="flex-1 bg-transparent border-none outline-none font-['Nunito'] font-medium text-[16px] tracking-[0.1px] text-[#171519] placeholder-[#a09da3]"
                        />
                      </div>
                    </div>

                    {/* Selection Counter */}
                    {selectedSkills.length > 0 && (
                      <div className="w-full bg-[#faf7fe] rounded-[12px] p-[10px] flex items-center">
                        <p className="font-['Nunito'] font-bold text-[20px] tracking-[-0.2px] text-[#171519] leading-[28px]">
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
                          <h3 className="font-['Nunito'] font-bold text-[#656268] text-[14px] uppercase tracking-wider">
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
                                  className={`w-full bg-[#faf7fe] flex items-center justify-between p-[12px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] transition-colors ${
                                    isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[#f0edf4]"
                                  }`}
                                >
                                  <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] pl-[8px]">
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
                        <h3 className="font-['Nunito'] font-bold text-[#171519] text-[18px]">
                          {skill}
                        </h3>
                        <div className="flex flex-col gap-[8px]">
                          {["Mentor", "Collaborator", "Reviewer", "Mentee / Learner"].map(role => {
                            const isSelected = roles[skill] === role;
                            return (
                              <div
                                key={role}
                                onClick={() => setRoles(prev => ({ ...prev, [skill]: role }))}
                                className="w-full bg-[#faf7fe] flex items-center justify-between p-[12px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[#f0edf4] transition-colors"
                              >
                                <span className={`font-['Nunito'] ${isSelected ? "font-bold" : "font-semibold"} text-[16px] pl-[8px] text-[#171519]`}>
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
                        <h3 className="font-['Nunito'] font-bold text-[#171519] text-[18px]">
                          {skill}
                        </h3>
                        <div className="flex flex-col gap-[8px]">
                          {levels.map(level => {
                            const isSelected = proficiencies[skill] === level;
                            return (
                              <div
                                key={level}
                                onClick={() => setProficiencies(prev => ({ ...prev, [skill]: level }))}
                                className="w-full bg-[#faf7fe] flex items-center justify-between p-[12px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[#f0edf4] transition-colors"
                              >
                                <span className={`font-['Nunito'] ${isSelected ? "font-bold" : "font-semibold"} text-[16px] pl-[8px] text-[#171519]`}>
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
                    <button
                      onClick={() => { setSelectedSkills([]); setTags({}); }}
                      className="px-[16px] py-[12px] h-[48px] flex items-center justify-center"
                    >
                      <span className="font-['Nunito'] font-bold text-[#a09da3] text-[16px] underline leading-[24px]">
                        Clear all
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        if (selectedSkills.length > 0) handleApplySkills();
                      }}
                      className={`px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] flex items-center justify-center transition-colors ${
                        selectedSkills.length > 0 ? "bg-[#171519] text-[#fbf6ff] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[#2f2c32]" : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
                      }`}
                    >
                      <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
                        Next
                      </span>
                    </button>
                  </>
                ) : step === "roles" ? (
                  <>
                    <button
                      onClick={() => setStep("skills")}
                      className="px-[16px] py-[12px] h-[48px] flex items-center justify-center"
                    >
                      <span className="font-['Nunito'] font-bold text-[#a09da3] text-[16px] underline leading-[24px]">
                        Back
                      </span>
                    </button>
                    <button
                      onClick={handleApplyRoles}
                      className="px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] flex items-center justify-center transition-colors bg-[#171519] text-[#fbf6ff] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[#2f2c32]"
                    >
                      <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
                        Next
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setStep("roles")}
                      className="px-[16px] py-[12px] h-[48px] flex items-center justify-center"
                    >
                      <span className="font-['Nunito'] font-bold text-[#a09da3] text-[16px] underline leading-[24px]">
                        Back
                      </span>
                    </button>
                    <button
                      onClick={handleApplyAll}
                      className="px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] flex items-center justify-center transition-colors bg-[#171519] text-[#fbf6ff] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] cursor-pointer hover:bg-[#2f2c32]"
                    >
                      <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">
                        Apply
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Add Tags Pop-up Modal */}
          {isTagModalOpen && (
            <>
              {/* Overlay for Tag Modal */}
              <div
                className="absolute inset-0 z-[60] bg-[#2f2c32]/26 backdrop-blur-[4px] transition-opacity duration-300"
                onClick={() => setIsTagModalOpen(false)}
              />
              {/* Tag Bottom Sheet */}
              <div className="absolute bottom-0 left-0 w-full bg-[#faf7fe] rounded-t-[24px] flex flex-col pt-[8px] pb-[44px] z-[70] transition-transform duration-300">
                <div className="w-full flex flex-col items-center gap-[32px]">
                  {/* Header Section */}
                  <div className="w-full px-[16px] flex flex-col gap-[16px] items-center">
                    <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px]" />
                    <div className="w-full flex items-center justify-between relative h-[24px]">
                      <div className="flex-1 flex justify-center">
                        <h3 className="font-['Nunito'] font-bold text-[20px] leading-[28px] text-[#171519] tracking-[-0.2px]">
                          Add tags
                        </h3>
                      </div>
                      <button
                        onClick={() => setIsTagModalOpen(false)}
                        className="absolute right-0 w-[24px] h-[24px] flex items-center justify-center"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <div className="w-full h-px bg-[#e0dce3]" />
                    <p className="font-['Nunito'] font-medium text-[16px] leading-[24px] text-[#49464c] text-center px-[16px]">
                      Add up to 5 specific tags to help others discover you. Separate each with a comma.
                    </p>
                  </div>

                  {/* Tags Section */}
                  <div className="w-full px-[16px] flex flex-col gap-[24px]">
                    {/* Selected tags as chips */}
                    {tempTags.length > 0 && (
                      <div className="flex flex-wrap gap-[12px]">
                        {tempTags.map(tag => (
                          <div
                            key={tag}
                            onClick={() => toggleTempTag(tag)}
                            className="flex items-center gap-[12px] px-[12px] py-[12px] rounded-[12px] bg-[#f0edf4] cursor-pointer transition-all duration-200 active:scale-95"
                          >
                            <span className="font-['Nunito'] font-semibold text-[14px] leading-[20px] text-[#b7812f] tracking-[1px]">
                              {tag}
                            </span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b7812f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Input field */}
                    <div className="w-full bg-[#faf7fe] rounded-[12px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] px-[12px] py-[16px]">
                      <input
                        type="text"
                        placeholder="wireframing, prototyping,"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        className="w-full bg-transparent border-none outline-none font-['Nunito'] font-medium text-[16px] leading-[24px] text-[#171519] placeholder-[#a09da3]"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-full flex items-center justify-between px-[16px]">
                    <button
                      onClick={handleClearSkillTags}
                      className="font-['Nunito'] font-bold text-[16px] leading-[24px] text-[#49464c] underline px-[16px] py-[12px]"
                    >
                      {selectedSkills.includes(activeSkillForTags) ? "Remove skill" : "Cancel"}
                    </button>
                    <button
                      onClick={handleApplyTags}
                      disabled={tempTags.length === 0}
                      className={`flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] transition-colors ${tempTags.length > 0 ? "bg-[#171519] text-[#fbf6ff]" : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"}`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
