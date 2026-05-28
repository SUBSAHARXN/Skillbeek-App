import React, { useState, useMemo } from "react";
import { OfferProgressBar } from "../components/OfferProgressBar";
import { CustomAnimatedCheckbox } from "../../../components/common/CustomAnimatedCheckbox";
import { SaveExitModal } from "../components/SaveExitModal";

interface SkillSelectViewProps {
  initialSkills?: string[];
  initialTagsMap?: Record<string, string[]>;
  onBack?: () => void;
  onNext?: (selectedSkills: string[], skillTagsMap: Record<string, string[]>) => void;
  hideTags?: boolean;
  isViewOnly?: boolean;
  onSkillClick?: (skill: string) => void;
}

const SKILL_CATEGORIES = [
  {
    name: "Design & Creative",
    skills: ["Visual Design", "Experience Design", "Motion & 3D"]
  },
  {
    name: "Product & Strategy",
    skills: ["Product Management", "User Research", "Market Strategy"]
  },
  {
    name: "Engineering & Data",
    skills: ["Web Development", "Mobile Development", "Data Science"]
  },
  {
    name: "Writing & Content",
    skills: ["Copywriting", "Content Strategy", "Technical Writing"]
  },
  {
    name: "Business Operations & Growth",
    skills: ["Digital Marketing", "Customer Success", "Project Operations"]
  }
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

export function SkillSelectView({
  initialSkills = [],
  initialTagsMap = {},
  onBack,
  onNext,
  hideTags = false,
  isViewOnly = false,
  onSkillClick
}: SkillSelectViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [tempFilters, setTempFilters] = useState<string[]>([]);
  const [filterSearchQuery, setFilterSearchQuery] = useState("");

  // Tag Modal State
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [skillForTags, setSkillForTags] = useState<string>("");
  const [skillTagsMap, setSkillTagsMap] = useState<Record<string, string[]>>(initialTagsMap);
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleOpenFilter = () => {
    setTempFilters(appliedFilters);
    setFilterSearchQuery("");
    setIsFilterModalOpen(true);
  };

  const handleToggleFilter = (categoryName: string) => {
    setTempFilters(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleApplyFilter = () => {
    setAppliedFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const handleToggle = (skill: string) => {
    if (hideTags) {
      // Just toggle skill without modal
      if (selectedSkills.includes(skill)) {
        setSelectedSkills(prev => prev.filter(s => s !== skill));
        setSkillTagsMap(prev => {
          const newMap = { ...prev };
          delete newMap[skill];
          return newMap;
        });
      } else {
        if (selectedSkills.length < 3) {
          setSelectedSkills(prev => [...prev, skill]);
          setSkillTagsMap(prev => ({ ...prev, [skill]: [] }));
        }
      }
      return;
    }

    if (selectedSkills.includes(skill)) {
      // Re-open modal to edit existing tags
      setSkillForTags(skill);
      setTempTags(skillTagsMap[skill] || []);
      setTagInput("");
      setIsTagsModalOpen(true);
    } else {
      if (selectedSkills.length < 3) {
        // Open modal with empty tags — user adds their own
        setSkillForTags(skill);
        setTempTags([]);
        setTagInput("");
        setIsTagsModalOpen(true);
      }
    }
  };

  const handleApplyTags = () => {
    if (!selectedSkills.includes(skillForTags)) {
      setSelectedSkills(prev => [...prev, skillForTags]);
    }
    setSkillTagsMap(prev => ({ ...prev, [skillForTags]: tempTags }));
    setIsTagsModalOpen(false);
  };

  const handleClearTags = () => {
    setSelectedSkills(prev => prev.filter(s => s !== skillForTags));
    setSkillTagsMap(prev => {
      const newMap = { ...prev };
      delete newMap[skillForTags];
      return newMap;
    });
    setIsTagsModalOpen(false);
  };

  const toggleTag = (tag: string) => {
    setTempTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 5)
    );
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

  const filteredCategories = useMemo(() => {
    let result = SKILL_CATEGORIES;

    if (appliedFilters.length > 0) {
      result = result.filter(category => appliedFilters.includes(category.name));
    }

    if (!searchQuery.trim()) return result;
    const lowerQuery = searchQuery.toLowerCase();

    return result.map(category => ({
      name: category.name,
      skills: category.skills.filter(skill => skill.toLowerCase().includes(lowerQuery))
    })).filter(category => category.skills.length > 0);
  }, [searchQuery, appliedFilters]);

  const visibleSelectedCount = useMemo(() => {
    const allVisibleSkills = filteredCategories.flatMap(c => c.skills);
    return selectedSkills.filter(s => allVisibleSkills.includes(s)).length;
  }, [filteredCategories, selectedSkills]);

  const modalFilteredCategories = useMemo(() => {
    if (!filterSearchQuery.trim()) return SKILL_CATEGORIES;
    const lowerQuery = filterSearchQuery.toLowerCase();
    return SKILL_CATEGORIES.filter(cat => cat.name.toLowerCase().includes(lowerQuery));
  }, [filterSearchQuery]);

  const isNextEnabled = selectedSkills.length >= 1;

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0 z-10 relative bg-[#fbf6ff]">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      {/* Header Action Buttons */}
      {!isViewOnly && (
        <div className="w-full px-[16px] flex justify-between items-center pt-[16px] mb-[40px] shrink-0 relative z-10 bg-[#fbf6ff]">
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors"
          >
            <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
              Save and Exit
            </span>
          </button>
          <button className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors">
            <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">
              Questions?
            </span>
          </button>
        </div>
      )}

      {isViewOnly && (
        <div className="w-full px-[16px] flex items-center pt-[16px] mb-[40px] shrink-0 relative z-10 bg-[#fbf6ff]">
          <button
            onClick={onBack}
            className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#fbf6ff] hover:bg-[#f0edf4] transition-colors shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* Search Bar Area */}
      <div className="w-full px-[16px] pb-[32px] shrink-0 z-10 relative bg-[#fbf6ff]">
        <div className="w-full h-[56px] bg-[#faf7fe] rounded-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] flex items-center justify-between px-[12px]">
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
          <button className="shrink-0 ml-[12px]" onClick={handleOpenFilter}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>

        {/* Pop-in Selection Counter */}
        <div
          className={`w-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${visibleSelectedCount > 0 ? "max-h-[80px] opacity-100 mt-[12px]" : "max-h-0 opacity-0 mt-0"
            }`}
        >
          <div className="w-full bg-[#faf7fe] rounded-[12px] p-[10px] flex items-center">
            <p className="font-['Nunito'] font-bold text-[20px] tracking-[-0.2px] text-[#171519] leading-[28px]">
              <span>{visibleSelectedCount}</span>
              <span>/3 Selected</span>
            </p>
          </div>
        </div>

        {/* Active Filter Chips — horizontally scrollable */}
        <div
          className={`w-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${appliedFilters.length > 0 ? "max-h-[56px] opacity-100 mt-[12px]" : "max-h-0 opacity-0 mt-0"
            }`}
        >
          <div className="flex gap-[13px] overflow-x-auto scrollbar-hide pb-[2px]">
            {appliedFilters.map(filter => (
              <div
                key={filter}
                className="flex items-center gap-[12px] bg-[#f0edf4] rounded-[12px] px-[12px] py-[12px] shrink-0"
              >
                <span className="font-['Nunito'] font-semibold text-[14px] leading-[20px] text-[#b7812f] tracking-[1px] whitespace-nowrap">
                  {filter}
                </span>
                <button
                  onClick={() => {
                    const updated = appliedFilters.filter(f => f !== filter);
                    setAppliedFilters(updated);
                  }}
                  className="shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b7812f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-[16px] flex flex-col gap-[24px] relative z-0">
        {filteredCategories.map((category) => (
          <div key={category.name} className="flex flex-col gap-[6px]">
            <div className="py-[8px]">
              <h2 className="font-['Nunito'] font-extrabold text-[#171519] text-[14px] leading-[20px] tracking-[1px] uppercase">
                {category.name}
              </h2>
            </div>
            <div className="flex flex-col gap-[4px]">
              {category.skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                const isDisabled = !isSelected && selectedSkills.length >= 3;

                return (
                  <div
                    key={skill}
                    onClick={() => {
                      if (isViewOnly && onSkillClick) {
                        onSkillClick(skill);
                      } else if (!isDisabled) {
                        handleToggle(skill);
                      }
                    }}
                    className={`w-full bg-[#faf7fe] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] p-[8px] flex items-center justify-between select-none transition-all ${
                      isViewOnly ? "h-[60px]" : ""
                    } ${isDisabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer active:scale-[0.99] hover:bg-[#f0edf4]"
                      }`}
                  >
                    <span className="font-['Nunito'] font-semibold text-[#2f2c32] text-[16px] leading-[24px] tracking-[0.1px]">
                      {skill}
                    </span>

                    {!isViewOnly && (
                      <CustomAnimatedCheckbox
                        checked={isSelected}
                        disabled={isDisabled}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <div className="flex justify-center py-[40px] text-[#a09da3] font-['Nunito'] font-medium">
            No skills found matching "{searchQuery}"
          </div>
        )}

        {/* Spacer Div (The Universal Hack) */}
        <div style={{ height: '156px', width: '100%' }} aria-hidden="true" className="shrink-0" />
      </div>

      {/* Fixed Bottom Footer */}
      {!isViewOnly && (
        <div className="absolute bottom-0 left-0 w-full bg-[#faf7fe] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col gap-[32px] items-center pt-[0px] pb-[44px] z-20">
          {/* Progress Bar */}
          <div className="w-full flex justify-center">
            <OfferProgressBar currentStep={1} subStepProgress={50} totalSteps={3} />
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
              onClick={() => isNextEnabled && onNext?.(selectedSkills, skillTagsMap)}
              disabled={!isNextEnabled}
              className={`flex items-center justify-center px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] leading-[24px] tracking-[0.16px] transition-colors ${isNextEnabled
                ? "bg-[#171519] text-[#fbf6ff]"
                : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
                }`}
            >
              Next
            </button>
          </div>

          {/* Bottom Home Indicator */}
          <div className="absolute bottom-0 left-0 w-full h-[34px] flex items-center justify-center pb-[8px]">
            <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]"></div>
          </div>
        </div>
      )}

      {/* Add Tags Modal */}
      <AddTagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        skillName={skillForTags}
        tags={tempTags}
        onToggleTag={toggleTag}
        onApply={handleApplyTags}
        onClear={handleClearTags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        onTagInputKeyDown={handleTagInputKeyDown}
      />

      {/* Modal Bottom Sheet: Filter by Domain */}
      {/* Overlay Background */}
      <div
        className={`absolute inset-0 z-30 bg-[#2f2c32]/25 backdrop-blur-[4px] transition-opacity duration-300 ${isFilterModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsFilterModalOpen(false)}
      />

      {/* Bottom Sheet Container */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-[#faf7fe] rounded-t-[24px] flex flex-col pt-[8px] pb-[44px] z-40 transition-transform duration-300 ${isFilterModalOpen ? "translate-y-0 ease-[cubic-bezier(0,0,0.2,1)]" : "translate-y-full ease-[cubic-bezier(0.4,0,1,1)]"
          }`}
      >
        <div className="w-full flex flex-col items-center gap-[16px] px-[16px]">
          {/* Drag Handle */}
          <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mt-[8px]" />

          {/* Header */}
          <div className="w-full flex items-center justify-center relative h-[24px]">
            <h3 className="font-['Nunito'] font-bold text-[20px] leading-[28px] text-[#171519] tracking-[-0.2px]">
              Filter by Domain
            </h3>
            <button
              className="absolute right-0 flex items-center justify-center w-[24px] h-[24px]"
              onClick={() => setIsFilterModalOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="w-full px-[16px]">
            <div className="w-full h-px bg-[#e0dce3]" />
          </div>

          <p className="font-['Nunito'] font-medium text-[16px] leading-[24px] text-[#49464c] text-center w-full">
            Choose one or more areas of expertise to narrow down the skill list. This helps you find exactly what you need faster.
          </p>

          {/* Modal Search Bar */}
          <div className="w-full bg-[#faf7fe] rounded-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] px-[12px] py-[16px] flex items-center">
            <input
              type="text"
              placeholder="Search domain"
              value={filterSearchQuery}
              onChange={(e) => setFilterSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-['Nunito'] font-medium text-[16px] tracking-[0.1px] text-[#171519] placeholder-[#a09da3]"
            />
          </div>

          {/* Filter Categories List */}
          <div className="w-full flex flex-col gap-[6px] max-h-[300px] overflow-y-auto px-[4px]">
            {modalFilteredCategories.map(cat => {
              const isSelected = tempFilters.includes(cat.name);
              return (
                <div
                  key={cat.name}
                  onClick={() => handleToggleFilter(cat.name)}
                  className="w-full bg-[#faf7fe] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] p-[8px] flex items-center justify-between cursor-pointer select-none active:scale-[0.99] transition-transform"
                >
                  <span className="font-['Nunito'] font-semibold text-[#2f2c32] text-[16px] leading-[24px] tracking-[0.1px]">
                    {cat.name}
                  </span>
                  <CustomAnimatedCheckbox checked={isSelected} />
                </div>
              );
            })}

            {modalFilteredCategories.length === 0 && (
              <div className="flex justify-center py-[20px] text-[#a09da3] font-['Nunito'] font-medium">
                No domains found matching "{filterSearchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex items-center justify-between px-[16px] mt-[32px]">
          <button
            onClick={() => {
              setTempFilters([]);
              setAppliedFilters([]);
              setIsFilterModalOpen(false);
            }}
            className="flex h-[48px] items-center justify-center px-[16px] py-[12px] font-['Nunito'] font-bold text-[#49464c] text-[16px] leading-[24px] tracking-[0.16px] underline"
          >
            Clear all
          </button>
          <button
            onClick={handleApplyFilter}
            disabled={tempFilters.length === 0}
            className={`flex items-center justify-center px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] leading-[24px] tracking-[0.16px] transition-colors ${tempFilters.length > 0
              ? "bg-[#171519] text-[#fbf6ff]"
              : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
              }`}
          >
            Apply
          </button>
        </div>
      </div>

      <SaveExitModal
        isOpen={isSaveModalOpen}
        onKeepWorking={() => setIsSaveModalOpen(false)}
        onExit={() => {
          setIsSaveModalOpen(false);
          if (onBack) onBack();
        }}
      />
    </div>
  );
}

function AddTagsModal({
  isOpen,
  onClose,
  skillName,
  tags,
  onToggleTag,
  onApply,
  onClear,
  tagInput,
  setTagInput,
  onTagInputKeyDown
}: {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  tags: string[];
  onToggleTag: (tag: string) => void;
  onApply: () => void;
  onClear: () => void;
  tagInput: string;
  setTagInput: (val: string) => void;
  onTagInputKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`absolute inset-0 z-50 bg-[#2f2c32]/26 backdrop-blur-[4px] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-[#faf7fe] rounded-t-[24px] flex flex-col pt-[8px] pb-[44px] z-[60] transition-transform duration-300 ${isOpen ? "translate-y-0 ease-out" : "translate-y-full ease-in"
          }`}
      >
        <div className="w-full flex flex-col items-center gap-[32px]">
          {/* Header Section */}
          <div className="w-full px-[16px] flex flex-col gap-[16px] items-center">
            {/* Drag Handle */}
            <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px]" />

            <div className="w-full flex items-center justify-between relative h-[24px]">
              <div className="flex-1 flex justify-center">
                <h3 className="font-['Nunito'] font-bold text-[20px] leading-[28px] text-[#171519] tracking-[-0.2px]">
                  Add tags
                </h3>
              </div>
              <button
                onClick={onClose}
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
            {/* User-added tags as chips */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-[12px]">
                {tags.map(tag => (
                  <div
                    key={tag}
                    onClick={() => onToggleTag(tag)}
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
                onKeyDown={onTagInputKeyDown}
                className="w-full bg-transparent border-none outline-none font-['Nunito'] font-medium text-[16px] leading-[24px] text-[#171519] placeholder-[#a09da3]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex items-center justify-between px-[16px]">
            <button
              onClick={onClear}
              className="font-['Nunito'] font-bold text-[16px] leading-[24px] text-[#49464c] underline px-[16px] py-[12px]"
            >
              Clear all
            </button>
            <button
              onClick={onApply}
              disabled={tags.length === 0}
              className={`flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] transition-colors ${tags.length > 0 ? "bg-[#171519] text-[#fbf6ff]" : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
                }`}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
