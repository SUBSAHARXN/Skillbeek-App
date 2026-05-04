# Skillbeek Memory Index
Last Commit: 2026-05-01 08:45

## Core Objects
| Object | State/Symbol | Location |
|---|---|---|
| Auth Flow | `handleLoginContinue`, `authMode`, `isAuthenticating` | `src/App.tsx` |
| Offer Flow | `OfferCreateFlowView`, `reviewSkills`, `exchangeType` | `src/App.tsx` |
| Navigation | `ViewState`, `navigateTo`, `currentView` | `src/App.tsx` |

## Key Patterns
- **OOUX:** Focus on Objects (Users, Skills, Offers) before Verbs.
- **Navigation:** Framer Motion `AnimatePresence` with `slideVariants`.
- **Styling:** Neumorphic/Glassmorphic via `src/index.css` and Tailwind.
- **Mobile:** Capacitor ready (Responsive Web).

## Active Task
- Initiate Token Saving Strategy (DONE)
- Next: Follow memory retrieval contract for all lookups.
