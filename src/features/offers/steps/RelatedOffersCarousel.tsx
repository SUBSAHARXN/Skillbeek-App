import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon } from "../../../components/common/Icons";
import { PersonaPfpSet } from "../../../components/common/PersonaPfpSet";
import { NeumorphicDivider } from "../../../components/common/NeumorphicDivider";
import { OfferDuration } from "../../../components/common/OfferDuration";
import { FlameIcon, CodeTimerIcon, CodeSparkleIcon, BBadge, CardBookmarkButton, StarIcon } from "./SkillDetailsView";
import { LiveOfferView } from "./LiveOfferView";
import SkillbeekLoader from "../../../components/common/SkillbeekLoader";
import ReactDOM from "react-dom";

const spring = { type: "spring" as const, stiffness: 220, damping: 28 };

export function RelatedOffersCarousel({ currentSkillName, hash = 0, layoutIdPrefix = "related-offer", onViewAll }: { currentSkillName: string; hash?: number; layoutIdPrefix?: string; onViewAll?: () => void }) {
  const [isCarouselAtEnd, setIsCarouselAtEnd] = React.useState(false);
  const [showViewAll, setShowViewAll] = React.useState(false);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [isScreenLoading, setIsScreenLoading] = React.useState(false);
  const [selectedOfferId, setSelectedOfferId] = React.useState<number | null>(null);

  const latestOffers = [
    {
      id: 1 + hash,
      badge: { text: "Hot now", type: "hot" },
      time: "Posted 6 hours ago",
      title: `Advanced ${currentSkillName} Practice: Business, Finance, and Tech`,
      tags: [
        { label: currentSkillName, hasBadge: true },
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
      receiveSkills: [currentSkillName, "Business Strategy", "Financial Modeling"],
      receiveTags: {
        [currentSkillName]: ["Advanced practice", "Case studies"],
        "Business Strategy": ["Market analysis", "Growth"],
        "Financial Modeling": ["Valuation", "Forecasting"]
      },
      receiveRoles: {
        [currentSkillName]: "Collaborator",
        "Business Strategy": "Collaborator",
        "Financial Modeling": "Collaborator"
      },
      receiveProficiencies: {
        [currentSkillName]: "Advanced — 3-5 years",
        "Business Strategy": "Advanced — 3-5 years",
        "Financial Modeling": "Advanced — 3-5 years"
      }
    },
    {
      id: 2 + hash,
      badge: { text: "Closing soon", type: "closing" },
      time: "Posted 30 days ago",
      title: `Building Scalable ${currentSkillName} Components`,
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
      isTimeCredit: false,
      requestsCount: 15,
      reviewSkills: [currentSkillName, "Design Systems", "Product Management"],
      reviewTags: {
        [currentSkillName]: ["Auto layout", "Variables"],
        "Design Systems": ["Tokens", "Component library"],
        "Product Management": ["Agile", "Roadmap"]
      },
      reviewRoles: {
        [currentSkillName]: "Collaborator",
        "Design Systems": "Collaborator",
        "Product Management": "Collaborator"
      },
      reviewProficiencies: {
        [currentSkillName]: "Intermediate — 2-3 years",
        "Design Systems": "Intermediate — 2-3 years",
        "Product Management": "Expert — 5+ years"
      },
      receiveSkills: ["Visual Design", "Motion & 3D", "Interaction Design"],
      receiveTags: {
        "Visual Design": ["Typography", "Color theory"],
        "Motion & 3D": ["2D Animation", "3D Modeling"],
        "Interaction Design": ["Prototyping", "Framer"]
      },
      receiveRoles: {
        "Visual Design": "Collaborator",
        "Motion & 3D": "Collaborator",
        "Interaction Design": "Collaborator"
      },
      receiveProficiencies: {
        "Visual Design": "Intermediate — 1-2 years",
        "Motion & 3D": "Basic — 0-1 years",
        "Interaction Design": "Intermediate — 2-3 years"
      }
    },
    {
      id: 3 + hash,
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
      isTimeCredit: false,
      requestsCount: 24,
      reviewSkills: ["Product Design", "Interaction Design", "Visual Design"],
      reviewTags: {
        "Product Design": ["Design systems", "User research"],
        "Interaction Design": ["Micro-interactions", "User flows"],
        "Visual Design": ["Typography", "Brand guidelines"]
      },
      reviewRoles: {
        "Product Design": "Reviewer",
        "Interaction Design": "Reviewer",
        "Visual Design": "Reviewer"
      },
      reviewProficiencies: {
        "Product Design": "Expert — 5+ years",
        "Interaction Design": "Expert — 5+ years",
        "Visual Design": "Intermediate — 2-3 years"
      },
      receiveSkills: ["UI/UX Design", "Figma Prototyping", "Experience Design"],
      receiveTags: {
        "UI/UX Design": ["Prototyping", "Usability testing"],
        "Figma Prototyping": ["Component states", "Auto layout"],
        "Experience Design": ["Wireframing", "User flows"]
      },
      receiveRoles: {
        "UI/UX Design": "Collaborator",
        "Figma Prototyping": "Collaborator",
        "Experience Design": "Collaborator"
      },
      receiveProficiencies: {
        "UI/UX Design": "Intermediate — 2-3 years",
        "Figma Prototyping": "Expert — 5+ years",
        "Experience Design": "Intermediate — 2-3 years"
      }
    },
    {
      id: 4 + hash,
      badge: null,
      time: "Posted 2 hours ago",
      title: `Configuring Virtual Environments for ${currentSkillName}`,
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
      receiveSkills: ["Cloud Computing", "Infrastructure", "DevOps"],
      receiveTags: {
        "Cloud Computing": ["AWS", "Virtual Environments"],
        "Infrastructure": ["Terraform", "Docker"],
        "DevOps": ["CI/CD", "Automation"]
      },
      receiveRoles: {
        "Cloud Computing": "Mentor",
        "Infrastructure": "Mentor",
        "DevOps": "Mentor"
      },
      receiveProficiencies: {
        "Cloud Computing": "Expert — 5+ years",
        "Infrastructure": "Expert — 5+ years",
        "DevOps": "Expert — 5+ years"
      }
    }
  ];

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setIsCarouselAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
      const cardWidth = 296;
      const currentIndex = Math.round(scrollLeft / cardWidth);
      // Hysteresis: show at index >= length-2, but only hide at index < length-3
      // This prevents rapid toggling at the boundary which causes the button to "dance"
      setShowViewAll(prev => {
        if (!prev && currentIndex >= latestOffers.length - 2) return true;
        if (prev && currentIndex < latestOffers.length - 3) return false;
        return prev;
      });
    }
  };

  // Portal target — find the nearest phone frame or use document.body
  const portalTarget = typeof document !== "undefined" ? (document.getElementById("phone-frame-root") || document.body) : null;

  // Render the overlay via a portal so it escapes the scrollable container
  const overlay = (
    <AnimatePresence>
      {/* Loading Overlay */}
      {isScreenLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px] z-[2000] flex items-center justify-center pointer-events-auto"
        >
          <SkillbeekLoader size={92} />
        </motion.div>
      )}

      {/* Expanded LiveOfferView */}
      {selectedOfferId && (
        <div className="fixed inset-0 z-[2000]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-0"
            onClick={() => setSelectedOfferId(null)}
          />
          <div className="fixed inset-0 z-10 flex items-center justify-center">
            <div className="w-full h-full max-w-[430px] mx-auto relative">
              {(() => {
                const offer = latestOffers.find((o) => o.id === selectedOfferId);
                if (!offer) return null;
                return (
                  <LiveOfferView
                    offerTitle={offer.title}
                    offerDescription="Ready to dive into the world of user research? This session is a hands-on introduction designed for UI designers, developers, or anyone new to UX. We'll demystify the research process and give you the confidence to start gathering valuable insights from your users."
                    isTimeCredit={(offer as any).isTimeCredit !== undefined ? (offer as any).isTimeCredit : !!offer.points}
                    timeCreditRate={offer.points || 120}
                    onBack={() => setSelectedOfferId(null)}
                    layoutIdPrefix={`${layoutIdPrefix}-${offer.id}`}
                    badge={offer.badge as any}
                    isOwner={false}
                    requestsCount={(offer as any).requestsCount}
                    reviewSkills={(offer as any).reviewSkills || []}
                    reviewTags={(offer as any).reviewTags || {}}
                    reviewRoles={(offer as any).reviewRoles || {}}
                    reviewProficiencies={(offer as any).reviewProficiencies || {}}
                    receiveSkills={(offer as any).receiveSkills || []}
                    receiveTags={(offer as any).receiveTags || {}}
                    receiveRoles={(offer as any).receiveRoles || {}}
                    receiveProficiencies={(offer as any).receiveProficiencies || {}}
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Latest Offers */}
      <div className="w-full flex flex-col gap-[16px] mb-[24px]">
        <h2 className="font-['Nunito'] font-bold text-[18px] leading-[24px] text-[var(--Text-Primary-heading-1)]">
          Latest offers with skill
        </h2>
        <div className="overflow-hidden -mx-4 relative">
          {!isCarouselAtEnd && (
            <div className="absolute right-0 top-[16px] h-[520px] w-[48px] bg-gradient-to-l from-[var(--Surface-Primary-Background)] via-[var(--Surface-Primary-Background)]/80 to-transparent pointer-events-none z-[2]" />
          )}

          {/* Floating View all Button — uses tween transition to avoid spring re-trigger "dancing", but keeps whileTap bounce */}
          <div className="absolute inset-y-0 left-[16px] right-[16px] pointer-events-none z-[10]">
            <motion.button
              initial={false}
              animate={{
                scale: (!isScreenLoading && !selectedOfferId && showViewAll) ? 1 : 0.85,
                opacity: (!isScreenLoading && !selectedOfferId && showViewAll) ? 1 : 0,
                y: "-50%"
              }}
              transition={{ type: "tween", duration: 0.2 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (onViewAll) {
                  // Small delay to allow the whileTap scale bounce to be seen
                  setTimeout(() => onViewAll(), 150);
                }
              }}
              style={{
                pointerEvents: (!isScreenLoading && !selectedOfferId && showViewAll) ? "auto" : "none"
              }}
              className="absolute top-1/2 right-0 inline-flex items-center justify-center gap-[6px] px-[16px] py-[12px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] rounded-[16px] shadow-[0_1px_3px_0_rgba(18,9,0,0.10)]"
            >
              <span className="font-['Nunito'] font-bold text-[var(--Button-UI-comp-sur-Text-primary)] text-[16px] leading-[24px]">
                View all
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAF8FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.button>
          </div>

          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex gap-[16px] overflow-x-auto px-4 py-4 snap-x snap-mandatory hide-scrollbar"
            style={{ minHeight: 572 }}
          >
            {latestOffers.map((offer) => (
              <motion.main
                layoutId={`${layoutIdPrefix}-${offer.id}-container`}
                onClick={() => {
                  setIsScreenLoading(true);
                  setTimeout(() => {
                    setSelectedOfferId(offer.id);
                    setIsScreenLoading(false);
                  }, 1200);
                }}
                key={offer.id}
                transition={{ layout: spring }}
                whileHover={{ y: -3, scale: 1.015 }}
                className="cursor-pointer flex flex-col justify-between items-start p-4 relative bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[32px] shadow-[0px_12px_32px_0px_rgba(23,21,25,0.08)] shrink-0 w-[280px] h-[520px] select-none snap-center overflow-hidden"
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
                    <motion.h1
                      layoutId={`${layoutIdPrefix}-${offer.id}-title`}
                      layout="position"
                      transition={{ layout: spring }}
                      className="[display:-webkit-box] items-center self-stretch tracking-normal overflow-hidden text-ellipsis [-webkit-line-clamp:3] [-webkit-box-orient:vertical] relative font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-lg leading-[28px] h-[84px]"
                    >
                      {offer.title}
                    </motion.h1>
                  </div>
                  <div className="flex-col items-start flex gap-1 relative self-stretch w-full flex-[0_0_auto]">
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
                <section
                  className="flex flex-col items-start gap-2 relative self-stretch w-full"
                  aria-label={`${offer.profile.name} profile summary`}
                >
                  <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                    <motion.div
                      layoutId={`${layoutIdPrefix}-${offer.id}-author`}
                      transition={{ layout: spring }}
                      className="items-center gap-3 flex relative flex-1 grow"
                    >
                      <div
                        className="relative w-10 h-10 shrink-0 rounded-full"
                        style={{
                          border: "4px solid #eacfff",
                          boxSizing: "content-box"
                        }}
                      >
                        <PersonaPfpSet
                          className="w-full h-full rounded-full"
                          persona={offer.profile.persona}
                        />
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
                    </motion.div>
                  </div>
                  <NeumorphicDivider className="my-0 w-full" />
                  <motion.div layoutId={`${layoutIdPrefix}-${offer.id}-duration`} transition={{ layout: spring }} className="w-full">
                    <OfferDuration
                      duration={offer.duration}
                      price={offer.points}
                      isTimeCredit={(offer as any).isTimeCredit}
                    />
                  </motion.div>
                </section>
              </motion.main>
            ))}
          </div>
        </div>
      </div>

      {/* Portal the overlay out so it escapes scrollable containers */}
      {portalTarget && ReactDOM.createPortal(overlay, portalTarget)}
    </>
  );
}
