import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon, ChevronUpIcon } from "../../../components/common/Icons";
import { PersonaPfpSet } from "../../../components/common/PersonaPfpSet";
import { NeumorphicDivider } from "../../../components/common/NeumorphicDivider";
import { OfferDuration } from "../../../components/common/OfferDuration";
import { FlameIcon, CodeTimerIcon, CodeSparkleIcon, BBadge, CardBookmarkButton, StarIcon } from "./SkillDetailsView";
import { FilterOffersModal, FilterValues } from "../components/FilterOffersModal";

interface AllOffersViewProps {
  onBack?: () => void;
  onOfferClick?: (offerId: number) => void;
}

// Re-using the same mock data from RelatedOffersCarousel
const LATEST_OFFERS = [
  {
    id: 1,
    badge: { text: "Hot now", type: "hot" },
    time: "Posted 6 hours ago",
    title: "Advanced Web Development Practice: Business, Finance, and Tech",
    tags: [
      { label: "Web Development", hasBadge: true },
      { label: "Advanced", hasBadge: false }
    ],
    extraTagsCount: 2,
    profile: {
      name: "Isabella Rossi",
      role: "Collaborator",
      rating: 4.7,
      reviewsCount: 34,
      persona: "03" as const
    },
    duration: "60 minutes",
    points: 120,
  },
  {
    id: 2,
    badge: { text: "Closing soon", type: "closing" },
    time: "Posted 30 days ago",
    title: "Building Scalable Web Development Components",
    tags: [
      { label: "UI/UX Design", hasBadge: true },
      { label: "Intermediate", hasBadge: false }
    ],
    extraTagsCount: 2,
    profile: {
      name: "Kwame Mensah",
      role: "Collaborator",
      rating: 4.7,
      reviewsCount: 34,
      persona: "02" as const
    },
    duration: "45 minutes",
    points: 234,
  },
  {
    id: 3,
    badge: { text: "New offer", type: "new" },
    time: "",
    title: "Semantic Design Systems for Cross-Platform Accessibility",
    tags: [
      { label: "Product Design", hasProvisionalBadge: true },
      { label: "Expert", hasBadge: false }
    ],
    extraTagsCount: 2,
    profile: {
      name: "David Chen",
      role: "Reviewer",
      rating: 4.0,
      reviewsCount: 12,
      persona: "05" as const
    },
    duration: "120 minutes",
    points: 234,
  },
  {
    id: 4,
    badge: null,
    time: "Posted 2 hours ago",
    title: "Configuring Virtual Environments for Web Development",
    tags: [
      { label: "Cloud Computing", hasBadge: true },
      { label: "Expert", hasBadge: false }
    ],
    extraTagsCount: 2,
    profile: {
      name: "Pierre Dubois",
      role: "Mentor",
      rating: 3.6,
      reviewsCount: 9,
      persona: "11" as const
    },
    duration: "30 minutes",
    points: 45,
  }
];

export function AllOffersView({ onBack, onOfferClick }: AllOffersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFade, setShowFade] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({
    dateRange: "",
    skills: [],
    highlights: "",
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Calculate if the user has reached the bottom (allowing a tiny buffer of 10px)
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    setShowFade(!isAtBottom);

    const SCROLL_THRESHOLD = 80;
    const BOTTOM_THRESHOLD = 52;
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

    if (target.scrollTop > SCROLL_THRESHOLD && distanceToBottom > BOTTOM_THRESHOLD) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Real-time dynamic filtering logic based on Search input and Pop-up Modal selections
  const filteredOffers = useMemo(() => {
    return LATEST_OFFERS.filter((offer) => {
      // 1. Filter by Search input
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = offer.title.toLowerCase().includes(query);
        const matchesTags = offer.tags.some((tag) => tag.label.toLowerCase().includes(query));
        const matchesName = offer.profile.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTags && !matchesName) {
          return false;
        }
      }

      // 2. Filter by Skills (set in Modal)
      if (appliedFilters.skills && appliedFilters.skills.length > 0) {
        const hasSkillMatch = appliedFilters.skills.some((skill) => {
          const filterSkill = skill.toLowerCase();
          const matchesTags = offer.tags.some((tag) => tag.label.toLowerCase().includes(filterSkill));
          const matchesTitle = offer.title.toLowerCase().includes(filterSkill);
          return matchesTags || matchesTitle;
        });
        if (!hasSkillMatch) {
          return false;
        }
      }

      // 3. Filter by Highlights (set in Modal)
      if (appliedFilters.highlights.trim()) {
        const filterHighlight = appliedFilters.highlights.toLowerCase();
        const matchesBadge = offer.badge && offer.badge.text.toLowerCase().includes(filterHighlight);
        const matchesRole = offer.profile.role.toLowerCase().includes(filterHighlight);
        if (!matchesBadge && !matchesRole) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, appliedFilters]);

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0 z-30 relative bg-[var(--Surface-Primary-Background)]">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]"></div>
      </div>

      {/* Header Action Buttons */}
      <div className="w-full px-[16px] flex justify-between items-center pt-[16px] mb-[16px] shrink-0 relative z-30 bg-[var(--Surface-Primary-Background)]">
        <button
          onClick={onBack}
          className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[var(--Surface-UI-surface-surface-elevated)] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px]">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Top Fade Overlay (Fades cards as they scroll behind the search bar area) */}
      <div className="absolute top-[136px] left-0 right-0 h-[88px] bg-gradient-to-b from-[var(--Surface-Primary-Background)] via-[var(--Surface-Primary-Background)]/90 to-transparent pointer-events-none z-10" />

      {/* Search Bar Area */}
      <div className="w-full px-[16px] pb-[32px] shrink-0 z-20 relative bg-transparent">
        <div className="w-full h-[56px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] flex items-center justify-between px-[12px]">
          <div className="flex items-center gap-[8px] flex-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a09da3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search Offers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-['Nunito'] font-medium text-[16px] tracking-[0.1px] text-[var(--Text-Primary-heading-1)] placeholder-[#a09da3]"
            />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="shrink-0 ml-[12px] hover:scale-105 transition-transform active:scale-95 flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable List */}
      {/* Implemented as a vertical list since image 3 clearly shows cards stacked vertically with a 16px gap, and filling the width. */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-[16px] flex flex-col gap-[16px] relative z-0 pb-[40px] scrollbar-hide -mt-[88px] pt-[88px]"
      >
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div
              key={offer.id}
              onClick={() => onOfferClick && onOfferClick(offer.id)}
              className="cursor-pointer flex flex-col justify-between items-start p-4 relative bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[32px] shadow-[0px_12px_32px_0px_rgba(23,21,25,0.08)] shrink-0 w-full select-none"
            >
              <header className="flex flex-col w-full items-start gap-3 bg-transparent relative flex-[0_0_auto]">
              <div className="flex items-center justify-between self-stretch w-full relative flex-[0_0_auto]">
                {offer.badge ? (
                  <div className={`inline-flex items-center gap-1.5 p-3 rounded-xl relative flex-[0_0_auto] ${
                    offer.badge.type === 'hot' ? 'bg-[var(--Surface-Error-bg-surface)]' :
                    offer.badge.type === 'closing' ? 'bg-[var(--Surface-Warning-bg-surface)]' :
                    'bg-[var(--Surface-Information-bg-surface)]'
                  }`}>
                    <div className="relative w-6 h-6" aria-hidden="true">
                      {offer.badge.type === 'hot' && <FlameIcon className="w-full h-full" />}
                      {offer.badge.type === 'closing' && <CodeTimerIcon />}
                      {offer.badge.type === 'new' && <CodeSparkleIcon />}
                    </div>
                    <div className={`relative w-fit font-['Nunito'] font-bold text-sm tracking-[1.00px] leading-5 whitespace-nowrap ${
                      offer.badge.type === 'hot' ? 'text-[var(--Text-Error-primary)]' :
                      offer.badge.type === 'closing' ? 'text-[var(--Text-Primary-Text-brand)]' :
                      'text-[var(--Text-Information-primary)]'
                    }`}>
                      {offer.badge.text}
                    </div>
                  </div>
                ) : (
                  <div />
                )}
                <CardBookmarkButton offerTitle={offer.title} />
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                {offer.time ? (
                  <div className="inline-flex items-center gap-1.5 relative flex-[0_0_auto]">
                    <ClockIcon className="!relative !w-6 !h-6 text-[var(--Text-Primary-Subtitle)] stroke-[2.5]" />
                    <div className="relative flex items-center w-fit font-['Nunito'] font-semibold text-[var(--Text-Primary-Subtitle)] text-sm tracking-[1px] leading-5 whitespace-nowrap">
                      {offer.time}
                    </div>
                  </div>
                ) : (
                  <div className="h-[24px]" />
                )}
                <h1 className="[display:-webkit-box] items-center self-stretch tracking-normal overflow-hidden text-ellipsis [-webkit-line-clamp:3] [-webkit-box-orient:vertical] relative font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-lg leading-[28px]">
                  {offer.title}
                </h1>
              </div>
              <div className="flex-col items-start flex gap-1 relative self-stretch w-full flex-[0_0_auto] pb-[12px]">
                <div className="flex flex-wrap items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-wrap gap-1.5 items-center relative flex-[0_0_auto]">
                    {offer.tags.map((tag, tagIndex) =>
                      (tag as any).hasBadge ? (
                        <div
                          key={tagIndex}
                          className="gap-1.5 p-2 bg-[var(--Surface-UI-surface-surface-variant)] rounded-lg inline-flex items-center relative flex-[0_0_auto]"
                        >
                          <div className="relative font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-xs tracking-[1.10px] leading-4 whitespace-nowrap">
                            {tag.label.length > 16 ? tag.label.substring(0, 16) + '...' : tag.label}
                          </div>
                          <BBadge size={16}>B</BBadge>
                        </div>
                      ) : (
                        <div
                          key={tagIndex}
                          className="inline-flex items-center justify-center gap-2.5 p-2 relative flex-[0_0_auto] bg-[var(--Surface-UI-surface-surface-variant)] rounded-lg"
                        >
                          <div className="relative w-fit font-['Nunito'] font-bold text-[var(--Text-Primary-Text-brandPrimary)] text-xs tracking-[1.10px] leading-4 whitespace-nowrap">
                            {tag.label.length > 16 ? tag.label.substring(0, 16) + '...' : tag.label}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  {offer.extraTagsCount > 0 && (
                    <div className="inline-flex items-center justify-center p-2 relative flex-[0_0_auto]">
                      <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-xs tracking-[0.16px] leading-6">
                        +{offer.extraTagsCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </header>
            <section className="flex flex-col items-start gap-2 relative self-stretch w-full mt-auto">
              <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                <div className="items-center gap-3 flex relative flex-1 grow">
                  <div className="relative w-10 h-10 shrink-0 rounded-full" style={{ border: "4px solid #eacfff", boxSizing: "content-box" }}>
                    <PersonaPfpSet className="w-full h-full rounded-full" persona={offer.profile.persona} />
                  </div>
                  <div className="flex-col items-start justify-center gap-2 flex relative flex-1 grow min-w-0">
                    <div className="items-center gap-1.5 inline-flex relative flex-[0_0_auto]">
                      <div className="flex-col items-start gap-1 inline-flex relative flex-[0_0_auto]">
                        <h2 className="relative flex items-end w-fit font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-base tracking-[1.00px] leading-6 whitespace-nowrap">
                          {offer.profile.name}
                        </h2>
                        <p className="relative w-fit font-['Nunito'] font-semibold text-[var(--Text-Primary-Subtitle)] text-sm leading-5 tracking-[1px] whitespace-nowrap">
                          {offer.profile.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                      <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                        <div className="inline-flex items-center gap-1.5 relative flex-[0_0_auto]">
                          <StarIcon className="relative w-4 h-4 text-[var(--Text-Primary-Text-brand)]" />
                        </div>
                        <div className="relative font-['Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-sm tracking-[1.00px] leading-5 whitespace-nowrap">
                          {offer.profile.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="w-px h-3 relative bg-[var(--Text-Primary-Subtitle)]/40" aria-hidden="true" />
                      <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-brandPrimary)] text-sm tracking-[1.00px] leading-5 whitespace-nowrap">
                        {offer.profile.reviewsCount} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <NeumorphicDivider className="my-0 w-full" />
              <div className="w-full pt-[8px]">
                <OfferDuration duration={offer.duration} price={offer.points} isTimeCredit={false} />
              </div>
            </section>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center z-10 my-auto">
          <svg width="180" height="180" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto select-none pointer-events-none">
            <defs>
              <linearGradient id="peachGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFEFED" />
                <stop offset="100%" stopColor="#FFCEC8" />
              </linearGradient>
              <clipPath id="clip0_3895_17789">
                <rect width="280" height="280" fill="white"/>
              </clipPath>
            </defs>
            <g clipPath="url(#clip0_3895_17789)">
              <path d="M141.369 102.141C141.6 102.087 141.848 102.044 142.085 102.067C165.398 104.343 184.353 132.877 183.9 155.01C183.76 162.092 180.33 168.629 173.656 171.742C165.829 175.393 154.63 185.136 145.985 184.654C139.488 184.456 129.624 178.081 124.775 173.78C112.928 163.318 104.964 148.519 103.489 132.721C102.71 124.379 107.897 122.259 113.812 118.178L124.169 110.964C130.056 106.837 133.852 102.547 141.369 102.141ZM162.52 160.098C170.634 159.334 170.722 153.459 170.16 146.848C169.092 134.232 155.937 115.127 142.019 115.665C134.524 116.273 132.987 120.031 133.623 127.024C134.536 137.083 139.835 147.137 147.561 153.64C152.489 157.69 156.32 159.322 162.52 160.098Z" fill="url(#peachGradient)"/>
              <path d="M145.4 129.246C148.299 129.392 149.852 131.792 152.016 133.882C153.34 132.485 155.479 129.832 157.396 129.448C158.784 129.171 159.696 130.662 159.81 131.915C159.4 133.266 156.31 135.859 155.122 137.028C157.554 139.382 162.276 141.511 158.553 144.918C156.458 144.924 153.586 141.459 152.081 139.938C151.165 140.889 147.644 145.003 146.52 144.772C140.649 143.567 147.792 138.042 149.022 136.908C146.724 135.093 142.449 132.194 145.4 129.246Z" fill="url(#peachGradient)"/>
              <path d="M98.838 136.812C99.2778 137.312 100.46 142.76 100.799 143.872C106.515 162.573 119.201 180.394 138.36 187.232C136.271 188.069 132.815 190.138 130.639 191.293C125.879 193.784 121.081 196.2 116.247 198.543C113.293 199.965 109.078 202.011 105.976 202.987C101.395 197.567 97.8018 194.096 90.211 194.304C81.9289 195.145 77.3845 198.645 73.3902 205.907C64.1236 197.499 56.8939 187.969 54.3033 175.38C53.0342 169.214 58.6409 166.217 62.9343 163.066L72.3398 156.198C81.1106 149.778 89.9338 142.998 98.838 136.812Z" fill="url(#peachGradient)"/>
              <path d="M89.9718 197.645C93.0658 197.719 96.0531 198.789 98.4895 200.698C101.267 202.914 103.028 206.163 103.369 209.699C103.802 213.965 102.501 217.297 99.8477 220.55C101.307 222.776 104.79 231.503 106.054 234.57C108.073 239.471 110.626 244.88 112.543 249.729C115.613 249.773 119.785 249.461 122.507 250.32C123.867 251.657 124.241 252.289 124.403 254.193C124.897 259.998 121.036 259.625 116.756 259.794C117.733 262.044 117.891 262.676 119.245 264.603C121.395 267.665 127.568 266.2 128.984 267.55C128.312 271.636 117.007 272.016 113.885 271.613C110.12 271.124 106.839 270.483 104.587 267.18C111.686 269.169 115.194 270.229 122.488 268.941C112.563 265.998 105.912 260.356 96.0267 258.647C93.3614 258.187 90.0734 258.325 87.3408 258.377C84.4663 258.774 81.6224 259.257 78.9309 260.391C71.6793 263.448 67.5876 266.772 59.7739 268.878C65.675 269.979 72.4152 269.055 77.9305 266.786C73.9755 271.251 69.2348 271.973 63.4241 271.65C59.274 271.267 54.3942 270.508 51.3907 267.326C50.7634 266.662 50.4133 265.542 51.317 264.955C52.348 264.936 53.5621 265.394 54.5557 265.69C60.802 267.55 63.2865 265.515 64.8975 259.6C60.5375 259.634 56.5111 260.071 57.2152 253.827C57.4181 252.027 57.9494 251.207 59.3731 250.125C62.0028 249.602 64.7595 249.775 67.4475 249.817C71.8694 240.375 76.4887 230.41 81.1384 221.114C78.9176 218.681 77.4901 216.302 77.0268 212.978C76.5455 209.461 77.4907 205.898 79.6518 203.083C82.3796 199.47 85.6434 198.223 89.9718 197.645ZM93.6446 249.833C96.6927 249.813 99.8481 249.752 102.887 249.804C99.2858 241.804 96.1033 232.799 92.8205 224.57C91.0365 224.72 89.9356 224.791 88.1431 224.577C85.1991 232.416 81.7057 242.277 78.4116 249.848L93.6446 249.833ZM91.0498 216.681C94.5763 215.397 94.9605 214.013 95.6036 210.531C94.4846 207.655 92.9984 205.555 89.5202 205.936C82.6709 208.034 84.1981 216.537 91.0498 216.681Z" fill="url(#peachGradient)"/>
              <path d="M89.9404 265C92.9938 265.356 95.2875 267.907 97.8879 269.747C99.4104 270.825 101.009 271.793 102.67 272.642C113.908 278.276 127.076 276.415 135.488 267.385C136.556 266.367 138.714 264.317 140.295 265.462C143.099 267.487 144.893 269.733 148.029 271.458C153.332 274.373 159.735 274.704 165.082 271.68C166.93 270.634 169.257 268.798 171.238 268.317C175.142 269.562 176.957 272.163 180.774 273.87C185.294 275.818 190.06 276.534 195.038 275.275C196.626 274.871 206.884 269.385 203.795 277.31C203.067 279.179 198.547 280.771 196.528 281.501C187.812 284.659 178.99 281.687 171.635 276.634C160.73 285.528 149.305 284.061 138.818 275.533C132.792 280.482 126.359 282.226 118.89 283.295C107.358 283.539 99.712 280.403 90.5847 273.787C77.8535 285.091 55.6705 287.021 42.3722 275.714C41.6097 276.286 40.8411 276.723 40.0261 277.216C30.4682 283.008 18.5574 284.627 8.20039 279.966C5.66159 278.823 1.05581 276.309 2.17588 272.896C2.44518 272.074 3.40251 270.806 4.33445 270.702C7.82204 270.344 11.3046 272.374 14.694 273.025C22.2592 274.696 30.0297 273.57 36.3752 268.973C37.8064 267.934 41.1714 264.322 42.9572 265.375C44.3572 266.201 45.9543 267.939 47.1842 269.035C57.1001 277.874 71.8714 277.637 82.5833 270.336C84.9475 268.729 87.1691 266.209 89.6952 265.104L89.9404 265Z" fill="url(#peachGradient)"/>
              <path d="M74.6245 69.0307C77.8151 68.6338 82.9187 69.7391 85.8052 71.2074C91.6308 74.1707 94.7221 78.3185 96.8193 84.3144C100.983 81.046 109.94 81.6905 113.859 85.1169C115.358 86.108 116.921 89.0164 115.078 90.5009C111.486 93.3945 103.747 92.5389 99.2636 92.5337L77.0965 92.5237L57.1982 92.5156C51.4361 92.5177 42.8687 93.0773 37.6338 91.7289C32.5778 90.4268 35.6687 84.8599 39.8523 83.507C45.4913 81.6835 49.2432 81.8554 54.6207 84.0539C58.8092 74.7027 64.5869 70.2623 74.6245 69.0307Z" fill="url(#peachGradient)"/>
              <path d="M241.56 119.802C248.94 119.12 255.733 123.499 259.113 129.923C259.66 129.784 260.207 129.656 260.759 129.541C264.182 128.846 272.763 129.551 273.955 134.597C274.43 136.61 271.292 138.533 269.26 138.703C266.053 138.972 262.534 138.903 259.138 138.901L239.585 138.882C234.72 138.887 213.577 139.5 210.272 138.214C209.219 137.804 207.975 137.111 207.621 135.948C207.442 135.359 207.548 134.741 207.8 134.191C208.668 132.298 210.853 130.959 212.732 130.229C217.034 128.554 222.697 128.936 226.884 130.772C230.233 123.897 234.064 121.053 241.56 119.802Z" fill="url(#peachGradient)"/>
              <path d="M50.8976 180.742C50.8689 180.705 52.3933 185.433 52.5442 185.804C56.9236 196.53 64.2621 205.337 73.5395 212.016C70.5957 214.051 62.1826 219.054 58.8865 220.039C51.4949 220.447 45.685 213.714 41.773 208.295C39.1575 204.671 33.6218 193.046 38.1129 189.192C41.3462 186.416 47.1657 183.03 50.8976 180.742Z" fill="url(#peachGradient)"/>
              <path d="M32.2147 199.211C32.3067 199.246 32.3987 199.284 32.4907 199.321C32.9302 201.421 33.4811 204.26 34.2965 206.135C37.5243 213.617 43.6163 219.494 51.2097 222.449C48.9457 224.164 45.2312 227.446 42.5518 228.072C33.438 230.203 21.1032 214.251 23.8749 205.704C24.8374 202.736 29.7402 200.491 32.2147 199.211Z" fill="url(#peachGradient)"/>
              <path d="M182.16 68.8381C182.93 68.68 184.46 68.6877 185.271 68.7522C191.673 69.2702 197.91 72.1213 202.116 77.0391C203.966 79.2033 205.856 82.0039 203.084 84.3175C202.183 85.0694 200.441 84.782 199.575 84.125C198.711 83.468 197.985 82.2363 197.15 81.5036C193.86 78.1704 190.919 76.9831 186.445 76.051C180.066 75.8709 173.533 76.776 169.685 82.5664C167.615 85.6838 164.431 85.546 163.207 81.6457C162.899 80.6638 165.001 77.6418 165.808 76.7153C170.077 71.82 175.71 69.2874 182.16 68.8381Z" fill="url(#peachGradient)"/>
              <path d="M153.742 43.1529C154.029 43.1252 154.626 43.0828 154.911 43.0861C157.113 43.1115 160.545 47.2971 162.141 48.9739C163.679 47.0975 166.857 43.3933 169.29 43.1662C169.883 43.0641 171.059 43.1533 171.467 43.6884C173.8 46.7414 167.694 51.2634 165.944 52.593C168.77 54.8827 174.593 58.5563 170.291 61.9648C167.111 62.8152 164.056 58.6768 162.108 56.4743C160.483 57.8435 156.637 62.5253 154.949 62.1284C147.661 60.4156 156.749 53.7062 158.046 52.4912C155.371 50.2496 149.586 46.5887 153.742 43.1529Z" fill="url(#peachGradient)"/>
              <path d="M197.489 42.9707C200.374 43.4827 202.94 46.8198 205.044 49.0054C205.656 48.2862 206.284 47.5813 206.929 46.8916C208.497 45.1869 211.533 41.3614 213.962 43.8798C216.842 46.8693 210.898 50.9382 208.861 52.6378C211.456 54.8478 218.636 59.8176 212.166 62.2246L211.943 62.1888C209.583 61.8417 206.401 58.3113 204.979 56.3789C203.067 57.7818 200.02 62.1202 197.656 62.208C195.439 62.2904 194.045 59.3508 195.737 57.3448C197.292 55.5025 199.077 54.2085 200.88 52.5167C198.624 50.7284 191.165 44.7478 197.489 42.9707Z" fill="url(#peachGradient)"/>
              <path d="M260.476 33.0195C262.796 33.4572 263.2 38.4965 264.757 40.6201C266.669 43.2321 272.186 43.7333 273.385 45.547C273.237 47.6525 268.499 47.4508 266.332 49.2504C262.809 52.1792 263.489 55.5444 261.737 58.1808C258.963 58.1479 259.448 53.666 257.595 51.0955C255.256 47.8488 250.101 47.7216 248.9 46.0021C248.961 43.8321 253.518 43.7493 255.637 41.894C259.048 38.9065 258.417 36.0919 260.476 33.0195Z" fill="url(#peachGradient)"/>
              <path d="M121.016 26.7949C123.869 27.0467 123.101 30.561 124.767 32.8217C126.448 35.1031 130.516 35.4213 131.966 37.0331C132.271 38.937 127.873 38.9263 126.212 40.3717C123.37 42.8451 123.952 45.6961 122.384 48.2771C120.097 47.55 120.101 43.2811 118.237 41.1794C116.491 39.21 111.414 38.8735 111.34 37.0223C112.001 36.1095 113.334 35.7568 114.397 35.4406C119.474 33.9301 119.161 30.4299 121.016 26.7949Z" fill="url(#peachGradient)"/>
              <path d="M221.065 16.957C224.495 16.7253 225.662 17.3526 226.141 20.789C225.431 22.2283 225.148 22.63 223.808 23.4966C222.066 24.015 220.312 23.6987 219.317 22.0327C218.842 21.2414 218.707 20.2906 218.946 19.3986C219.3 18.0947 219.977 17.605 221.065 16.957Z" fill="url(#peachGradient)"/>
              <path d="M257.208 91.4136C258.713 91.2451 260.101 91.5726 260.952 92.9472C261.385 93.6309 261.501 94.4677 261.272 95.2436C260.923 96.4369 260.113 96.9141 259.087 97.4363C258.648 97.4548 258.003 97.4281 257.576 97.3382C256.629 97.1459 255.809 96.5632 255.314 95.7333C254.174 93.8013 255.58 92.3123 257.208 91.4136Z" fill="url(#peachGradient)"/>
              <path d="M102.377 48.8465C103.969 48.2469 105.745 49.0548 106.339 50.6485C106.933 52.2423 106.12 54.0156 104.524 54.6044C102.936 55.1904 101.173 54.3815 100.581 52.7952C99.9897 51.209 100.793 49.4433 102.377 48.8465Z" fill="url(#peachGradient)"/>
              <path d="M239.059 77.6816C242.534 77.6839 244.595 81.0138 240.855 83.1396C240.376 83.1582 239.652 83.1948 239.196 83.0976C238.412 82.9276 237.729 82.451 237.3 81.774C236.187 80.0492 237.56 78.4777 239.059 77.6816Z" fill="url(#peachGradient)"/>
            </g>
          </svg>
          <p 
            className="font-['Nunito'] font-bold text-[20px] leading-[28px] tracking-[-0.2px] mt-[44px]"
            style={{ color: "var(--mapped\\/text\\/primary\\/heading-4, #656268)" }}
          >
            No matching offers found
          </p>
        </div>
      )}
        {/* Spacer Div (The Universal Hack) */}
        <div style={{ height: '120px', width: '100%' }} aria-hidden="true" className="shrink-0" />
      </div>

      {/* Floating Back to top Button — styled identical to View all button */}
      <div className="absolute bottom-[40px] right-[16px] pointer-events-none z-[30] w-full flex justify-end px-[16px]">
        <motion.button
          initial={false}
          animate={{
            scale: showBackToTop ? 1 : 0.85,
            opacity: showBackToTop ? 1 : 0,
          }}
          transition={{ type: "tween", duration: 0.2 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            scrollToTop();
          }}
          style={{
            pointerEvents: showBackToTop ? "auto" : "none"
          }}
          className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[12px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] rounded-[16px] shadow-[0_1px_3px_0_rgba(18,9,0,0.10)] cursor-pointer"
        >
          <span className="font-['Nunito'] font-bold text-[var(--Button-UI-comp-sur-Text-primary)] text-[16px] leading-[24px]">
            Back to top
          </span>
          <ChevronUpIcon className="w-[18px] h-[18px] text-[var(--Button-UI-comp-sur-Text-primary)]" />
        </motion.button>
      </div>

      {/* Bottom Fade Overlay */}
      <AnimatePresence>
        {showFade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-[var(--Surface-Primary-Background)] via-[var(--Surface-Primary-Background)]/80 to-transparent pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* Filter Pop-up Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <FilterOffersModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            initialFilters={appliedFilters}
            onApply={(newFilters) => {
              setAppliedFilters(newFilters);
              setIsFilterModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
