import React, { useState, useCallback } from "react";
import { useOverlayScrollbars } from "overlayscrollbars-react";
import { LoginView } from "./features/auth/LoginView";
import { PasswordView } from "./features/auth/PasswordView";
import { OTPMethodView } from "./features/auth/OTPMethodView";
import { OTPInputView } from "./features/auth/OTPInputView";
import { CreatePasswordView } from "./features/auth/CreatePasswordView";
import { OfferCreateFlowView } from "./features/offers/OfferCreateFlowView";
import { OfferTitleView } from "./features/offers/steps/OfferTitleView";
import { OfferDescriptionView } from "./features/offers/steps/OfferDescriptionView";
import { AddSkillView } from "./features/offers/steps/AddSkillView";
import { SkillSelectView } from "./features/offers/steps/SkillSelectView";
import { SkillReviewView } from "./features/offers/steps/SkillReviewView";
import { ProficiencyLevelsView } from "./features/offers/steps/ProficiencyLevelsView";
import { ExchangeDetailsView } from "./features/offers/steps/ExchangeDetailsView";
import { ReceiveSkillsAddView } from "./features/offers/steps/ReceiveSkillsAddView";
import { PartnerProficiencyView } from "./features/offers/steps/PartnerProficiencyView";
import { TimeCreditView } from "./features/offers/steps/TimeCreditView";
import { AvailabilityView } from "./features/offers/steps/AvailabilityView";
import { OfferSettingsView } from "./features/offers/steps/OfferSettingsView";
import { OfferExpirationView } from "./features/offers/steps/OfferExpirationView";
import { SessionLengthView } from "./features/offers/steps/SessionLengthView";
import { OfferPreviewView } from "./features/offers/steps/OfferPreviewView";
import { SplashView } from "./features/splash/SplashView";
import { motion, AnimatePresence } from "framer-motion";
import SkillbeekLoader from "./components/common/SkillbeekLoader";

type ViewState = "splash" | "login" | "password" | "otp" | "otpInput" | "createPassword" | "offerCreate" | "offerTitle" | "offerDescription" | "offerAddSkill" | "skillSelect" | "skillReview" | "proficiencyLevels" | "exchangeDetails" | "receiveSkillsAdd" | "receiveSkillsSelect" | "receiveSkillsReview" | "partnerProficiency" | "timeCreditRate" | "availability" | "offerSettings" | "offerExpiration" | "sessionLength" | "offerPreview";
type AuthMode = "login" | "reset";

function App() {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>("splash");
  const [navDirection, setNavDirection] = useState(1);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isKnownDevice, setIsKnownDevice] = useState(true);
  const [email, setEmail] = useState("");
  const [selectedOTPMethod, setSelectedOTPMethod] = useState<string | null>(null);
  const [discardedOTPMethods, setDiscardedOTPMethods] = useState<string[]>([]);
  // Skill selection state shared across skill screens
  const [reviewSkills, setReviewSkills] = useState<string[]>([]);
  const [reviewTagsMap, setReviewTagsMap] = useState<Record<string, string[]>>({});
  const [receiveSkills, setReceiveSkills] = useState<string[]>([]);
  const [receiveTagsMap, setReceiveTagsMap] = useState<Record<string, string[]>>({});
  const [exchangeType, setExchangeType] = useState<string>("");

  // New global state for offer flow
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [reviewProficiencies, setReviewProficiencies] = useState<Record<string, string>>({});
  const [receiveProficiencies, setReceiveProficiencies] = useState<Record<string, string>>({});
  const [timeCreditRate, setTimeCreditRate] = useState<number>(0);
  const [availability, setAvailability] = useState<any>(null);
  const [offerSettings, setOfferSettings] = useState<any>(null);
  const [offerExpiration, setOfferExpiration] = useState<any>(null);
  const [sessionLength, setSessionLength] = useState<any>({ type: "preset", minutes: 30 });

  // Initialize global OverlayScrollbars
  const [initScrollbars] = useOverlayScrollbars({
    defer: true,
    options: {
      scrollbars: {
        autoHide: "scroll",
        theme: "os-theme-dark",
      },
    },
  });

  React.useEffect(() => {
    initScrollbars(document.body);
  }, [initScrollbars]);

  /* ── Auth Flow: Login → Overlay Loader (2s delay) → Password/OTP ───── */
  const handleLoginContinue = useCallback((enteredEmail: string) => {
    setEmail(enteredEmail);
    // 1. Show the loader OVERLAY
    setIsAuthenticating(true);
    setAuthMode("login");

    // 2. Simulate 2s auth processing delay
    setTimeout(() => {
      // 3. Switch the background view underneath the overlay
      if (isKnownDevice) {
        setCurrentView("password");
      } else {
        setDiscardedOTPMethods([]);
        setCurrentView("otp");
      }
      // 4. Hide the loader overlay to reveal the new screen
      setIsAuthenticating(false);
    }, 2000);
  }, [isKnownDevice]);

  const handleBack = () => {
    setCurrentView("login");
    setAuthMode("login");
  };

  const handleForgotPassword = () => {
    setIsAuthenticating(true);
    
    setTimeout(() => {
      setAuthMode("reset");
      setDiscardedOTPMethods([]);
      setCurrentView("otp");
      setIsAuthenticating(false);
    }, 2000);
  };

  const handleMethodSelection = (method: string) => {
    setSelectedOTPMethod(method);
    setCurrentView("otpInput");
  };

  const handleOTPBack = () => {
    if (authMode === "reset") {
      setCurrentView("password");
    } else {
      setCurrentView("login"); // basic login route for unrecognized device
    }
  };

  const handleMoreOptions = () => {
    if (selectedOTPMethod) {
      setDiscardedOTPMethods((prev) => [...prev, selectedOTPMethod]);
    }
    setCurrentView("otp");
  };

  /* ── Lateral Slide Transition ──────────────────────── */
  const slideVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    animate: { 
      x: 0,
      opacity: 1 
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0
    }),
  };

  const slideTransition = { duration: 0.35, ease: "easeInOut" as const };

  const navigateTo = (view: ViewState, direction: 1 | -1 = 1) => {
    setNavDirection(direction);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 selection:bg-purple-200">
      
      {/* Dev Controls */}
      <div className="mb-4 bg-neutral-800 p-4 rounded-[16px] flex gap-4 items-center text-white font-['Nunito'] shadow-xl">
        <span className="font-bold text-[14px]">Dev Toggles:</span>
        <label className="flex items-center gap-2 cursor-pointer text-[14px]">
          <input 
            type="checkbox" 
            checked={isKnownDevice} 
            onChange={(e) => setIsKnownDevice(e.target.checked)}
            className="w-4 h-4 accent-purple-500"
          />
          Known Device (Bypass OTP)
        </label>
        <button 
          onClick={() => {
            setCurrentView("splash");
            setIsFirstTimeUser(true);
            setIsAuthenticating(false);
          }}
          className="ml-4 px-3 py-1 bg-yellow-700 hover:bg-yellow-600 rounded-[8px] text-[12px] font-bold transition-colors"
        >
          Reset to Splash
        </button>
        <button 
          onClick={() => {
            setCurrentView("login");
            setIsAuthenticating(false);
          }}
          className="ml-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-[8px] text-[12px] font-bold transition-colors"
        >
          Reset Login
        </button>
        <button 
          onClick={() => setIsAuthenticating(prev => !prev)}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-[8px] text-[12px] font-bold transition-colors shadow-[0_0_10px_rgba(168,85,247,0.4)]"
        >
          Toggle Loader Overlay
        </button>
        <button 
          onClick={() => setCurrentView("createPassword")}
          className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-[8px] text-[12px] font-bold transition-colors shadow-[0_0_10px_rgba(52,144,36,0.4)]"
        >
          Create Pwd Flow
        </button>

        <button 
          onClick={() => setCurrentView("offerCreate")}
          className="px-3 py-1 bg-[#171519] hover:bg-[#2f2c32] rounded-[8px] text-[12px] text-[#fbf6ff] font-bold transition-colors shadow-[0_0_10px_rgba(23,21,25,0.4)]"
        >
          Offer Create Flow
        </button>
      </div>

      {/* Mobile constraint container for Desktop Sandboxing */}
      <div className="w-[396px] h-[824px] bg-black rounded-[36px] p-[6px] shadow-2xl relative overflow-hidden ring-4 ring-neutral-800">
        
        {/* We use a wrapper with bg-[#fbf6ff] to ensure screens have a solid background color */}
        <div className="w-full h-full relative overflow-hidden bg-[#fbf6ff] rounded-[30px]">

          {/* ── Main Screen Routes ──────────────────────────────── */}
          <AnimatePresence mode="popLayout" custom={navDirection}>
            {currentView === "splash" && (
              <motion.div
                key="splash"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full bg-[#06000c]"
              >
                <SplashView onComplete={() => navigateTo("login", 1)} />
              </motion.div>
            )}

            {currentView === "login" && (
              <motion.div
                key="login"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <LoginView onContinue={handleLoginContinue} />
              </motion.div>
            )}

            {currentView === "password" && (
              <motion.div
                key="password"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <PasswordView email={email} onBack={handleBack} onForgotPassword={handleForgotPassword} />
              </motion.div>
            )}

            {currentView === "otp" && (
              <motion.div
                key="otp"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <OTPMethodView 
                  email={email} 
                  onBack={handleBack} 
                  discardedMethods={discardedOTPMethods}
                  onSelectMethod={handleMethodSelection}
                />
              </motion.div>
            )}

            {currentView === "otpInput" && (
              <motion.div
                key="otpInput"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <OTPInputView 
                  email={email} 
                  selectedMethod={selectedOTPMethod}
                  mode={authMode}
                  onBack={handleOTPBack}
                  onMoreOptions={handleMoreOptions}
                  onSuccessProceed={() => {
                    if (authMode === "reset") {
                       navigateTo("createPassword", 1);
                    } else {
                       navigateTo("login", 1);
                       setAuthMode("login");
                    }
                  }}
                />
              </motion.div>
            )}

            {currentView === "createPassword" && (
              <motion.div
                key="createPassword"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <CreatePasswordView mode={authMode} onBack={() => { navigateTo("login", -1); setAuthMode("login"); }} />
              </motion.div>
            )}



            {currentView === "offerCreate" && (
              <motion.div
                key="offerCreate"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <OfferCreateFlowView 
                  onBack={() => navigateTo("login", -1)} 
                  onContinue={() => navigateTo("offerTitle", 1)} 
                />
              </motion.div>
            )}

            {currentView === "offerTitle" && (
              <motion.div
                key="offerTitle"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <OfferTitleView 
                  onBack={() => navigateTo("offerCreate", -1)}
                  onNext={(title) => {
                    setOfferTitle(title);
                    navigateTo("offerDescription", 1);
                  }}
                />
              </motion.div>
            )}

            {currentView === "offerDescription" && (
              <motion.div
                key="offerDescription"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <OfferDescriptionView 
                  onBack={() => navigateTo("offerTitle", -1)}
                  onNext={(desc) => {
                    setOfferDescription(desc);
                    navigateTo("offerAddSkill", 1);
                  }}
                />
              </motion.div>
            )}

            {currentView === "offerAddSkill" && (
              <motion.div
                key="offerAddSkill"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <AddSkillView 
                  onBack={() => navigateTo("offerDescription", -1)}
                  onNext={() => navigateTo("skillSelect", 1)}
                />
              </motion.div>
            )}

            {currentView === "skillSelect" && (
              <motion.div
                key="skillSelect"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <SkillSelectView 
                  initialSkills={reviewSkills}
                  initialTagsMap={reviewTagsMap}
                  onBack={() => navigateTo("offerAddSkill", -1)}
                  onNext={(skills, tagsMap) => {
                    setReviewSkills(skills);
                    setReviewTagsMap(tagsMap);
                    navigateTo("skillReview", 1);
                  }}
                />
              </motion.div>
            )}

            {currentView === "skillReview" && (
              <motion.div
                key="skillReview"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <SkillReviewView
                  selectedSkills={reviewSkills}
                  skillTagsMap={reviewTagsMap}
                  onBack={() => navigateTo("skillSelect", -1)}
                  onAddMore={(skills, tagsMap) => {
                    setReviewSkills(skills);
                    setReviewTagsMap(tagsMap);
                    navigateTo("skillSelect", -1);
                  }}
                  onNext={(confirmedSkills, confirmedTagsMap) => {
                    setReviewSkills(confirmedSkills);
                    setReviewTagsMap(confirmedTagsMap);
                    navigateTo("proficiencyLevels", 1);
                  }}
                />
              </motion.div>
            )}

            {currentView === "proficiencyLevels" && (
              <motion.div
                key="proficiencyLevels"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <ProficiencyLevelsView
                  selectedSkills={reviewSkills}
                  skillTagsMap={reviewTagsMap}
                  onBack={() => navigateTo("skillReview", -1)}
                  onNext={(proficiencies) => {
                    setReviewProficiencies(proficiencies);
                    navigateTo("exchangeDetails", 1);
                  }}
                />
              </motion.div>
            )}

            {currentView === "exchangeDetails" && (
              <motion.div
                key="exchangeDetails"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <ExchangeDetailsView
                  onBack={() => navigateTo("proficiencyLevels", -1)}
                  onNext={(type) => {
                    setExchangeType(type);
                    navigateTo("receiveSkillsAdd", 1);
                  }}
                />
              </motion.div>
            )}

            {currentView === "receiveSkillsAdd" && (
              <motion.div
                key="receiveSkillsAdd"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <ReceiveSkillsAddView
                  onBack={() => navigateTo("exchangeDetails", -1)}
                  onNext={() => navigateTo("receiveSkillsSelect", 1)}
                />
              </motion.div>
            )}

            {currentView === "receiveSkillsSelect" && (
              <motion.div
                key="receiveSkillsSelect"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <SkillSelectView 
                  initialSkills={receiveSkills}
                  initialTagsMap={receiveTagsMap}
                  onBack={() => navigateTo("receiveSkillsAdd", -1)}
                  onNext={(skills, tagsMap) => {
                    setReceiveSkills(skills);
                    setReceiveTagsMap(tagsMap);
                    navigateTo("receiveSkillsReview", 1);
                  }}
                />
              </motion.div>
            )}

            {currentView === "receiveSkillsReview" && (
              <motion.div
                key="receiveSkillsReview"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <SkillReviewView
                  selectedSkills={receiveSkills}
                  skillTagsMap={receiveTagsMap}
                  hideBadge={true}
                  onBack={() => navigateTo("receiveSkillsSelect", -1)}
                  onAddMore={(skills, tagsMap) => {
                    setReceiveSkills(skills);
                    setReceiveTagsMap(tagsMap);
                    navigateTo("receiveSkillsSelect", -1);
                  }}
                  onNext={(confirmedSkills, confirmedTagsMap) => {
                    setReceiveSkills(confirmedSkills);
                    setReceiveTagsMap(confirmedTagsMap);
                    navigateTo("partnerProficiency", 1);
                  }}
                />
              </motion.div>
            )}

            {currentView === "partnerProficiency" && (
              <motion.div
                key="partnerProficiency"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <PartnerProficiencyView
                  selectedSkills={receiveSkills}
                  onBack={() => navigateTo("receiveSkillsReview", -1)}
                  onNext={(proficiencies) => {
                    setReceiveProficiencies(proficiencies);
                    if (exchangeType === "time-credit") {
                      navigateTo("timeCreditRate", 1);
                    } else {
                      navigateTo("availability", 1);
                    }
                  }}
                />
              </motion.div>
            )}

            {currentView === "timeCreditRate" && (
              <motion.div
                key="timeCreditRate"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <TimeCreditView
                  onBack={() => navigateTo("partnerProficiency", -1)}
                  onNext={(rate) => {
                    setTimeCreditRate(rate);
                    navigateTo("availability", 1);
                  }}
                />
              </motion.div>
            )}

            {currentView === "availability" && (
              <motion.div
                key="availability"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <AvailabilityView
                  onBack={() => {
                    if (exchangeType === "time-credit") {
                      navigateTo("timeCreditRate", -1);
                    } else {
                      navigateTo("partnerProficiency", -1);
                    }
                  }}
                  onNext={(data) => {
                    setAvailability(data);
                    navigateTo("offerSettings", 1);
                  }}
                  onSaveExit={() => console.log("Save and exit")}
                  onQuestions={() => console.log("Questions?")}
                />
              </motion.div>
            )}

            {currentView === "offerSettings" && (
              <motion.div
                key="offerSettings"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <OfferSettingsView
                  onBack={() => navigateTo("availability", -1)}
                  onNext={(settings) => {
                    setOfferSettings(settings);
                    navigateTo("offerExpiration", 1);
                  }}
                  onSaveExit={() => console.log("Save and exit")}
                  onQuestions={() => console.log("Questions?")}
                />
              </motion.div>
            )}

            {currentView === "offerExpiration" && (
              <motion.div
                key="offerExpiration"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <OfferExpirationView
                  onBack={() => navigateTo("offerSettings", -1)}
                  onNext={(expiration) => {
                    setOfferExpiration(expiration);
                    navigateTo("sessionLength", 1);
                  }}
                  onSaveExit={() => console.log("Save and exit")}
                  onQuestions={() => console.log("Questions?")}
                />
              </motion.div>
            )}

            {currentView === "sessionLength" && (
              <motion.div
                key="sessionLength"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <SessionLengthView
                  onBack={() => navigateTo("offerExpiration", -1)}
                  onNext={(duration) => {
                    setSessionLength(duration);
                    navigateTo("offerPreview", 1);
                  }}
                  onSaveExit={() => console.log("Save and exit")}
                  onQuestions={() => console.log("Questions?")}
                />
              </motion.div>
            )}

            {currentView === "offerPreview" && (
              <motion.div
                key="offerPreview"
                custom={navDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                className="w-full h-full"
              >
                <OfferPreviewView
                  offerTitle={offerTitle}
                  offerDescription={offerDescription}
                  availability={availability}
                  reviewSkills={reviewSkills}
                  reviewTags={reviewTagsMap}
                  reviewProficiencies={reviewProficiencies}
                  receiveSkills={receiveSkills}
                  receiveTags={receiveTagsMap}
                  receiveProficiencies={receiveProficiencies}
                  sessionDuration={sessionLength}
                  onBack={() => navigateTo("sessionLength", -1)}
                  onPublish={() => console.log("Publish offer")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Loader Overlay (Top Layer) ──────────────────────── */}
          {/* This sits ON TOP of whichever screen is active */}
          <AnimatePresence>
            {isAuthenticating && (
              <motion.div
                key="authenticating-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                // Using exactly #2F2C32 with 26% opacity via Tailwind arbitrary values
                className="absolute inset-0 z-50 flex items-center justify-center bg-[#2F2C32]/[0.26]"
              >
                <SkillbeekLoader size={92} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

export default App;
