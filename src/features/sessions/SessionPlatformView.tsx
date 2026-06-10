import React, { useId, useState, useRef, useMemo, useEffect } from "react";
import { AsYouType, isValidPhoneNumber } from "libphonenumber-js/max";
import { getCountryCallingCode, getCountries } from "react-phone-number-input/max";
import "react-phone-number-input/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { OfferProgressBar } from "../offers/components/OfferProgressBar";
import { ChevronDownIcon, ChevronUpIcon, CloseIcon, PencilIcon, PhoneIcon, SearchIcon, ErrorIcon, CopyIcon, EyeOpenIcon, PlusIcon } from "../../components/common/Icons";
import { InfoIconButton } from "../../components/common/InfoIconButton";
import { CustomAnimatedRadioButton } from "../../components/common/CustomAnimatedRadioButton";
import { JitsiIcon, PhoneCallIcon, InPersonIcon, CustomLinkIcon } from "./SessionIcons";
import { Flags } from "../../components/common/Flags";
import { NeumorphicDivider } from "../../components/common/NeumorphicDivider";
import { SuccessToast } from "../../components/common/SuccessToast";

type PlatformOption = {
  id: string;
  label: string;
  value: string;
  icon: "google-meet" | "zoom" | "jitsi" | "phone-call" | "in-person" | "custom-link";
};

type PhoneContact = {
  id: string;
  number: string;
  lastUsed?: boolean;
};

const phoneNumbers: PhoneContact[] = [
  {
    id: "phone-1",
    number: "+234 905 621 6980",
  },
];

// Country data for the country code picker
type CountryEntry = {
  iso: string;
  name: string;
  callingCode: string;
};

const COUNTRY_NAMES: Record<string, string> = {
  AC: "Ascension Island", AD: "Andorra", AE: "United Arab Emirates", AF: "Afghanistan",
  AG: "Antigua and Barbuda", AI: "Anguilla", AL: "Albania", AM: "Armenia",
  AO: "Angola", AR: "Argentina", AS: "American Samoa", AT: "Austria",
  AU: "Australia", AW: "Aruba", AX: "Åland Islands", AZ: "Azerbaijan",
  BA: "Bosnia and Herzegovina", BB: "Barbados", BD: "Bangladesh", BE: "Belgium",
  BF: "Burkina Faso", BG: "Bulgaria", BH: "Bahrain", BI: "Burundi",
  BJ: "Benin", BL: "Saint Barthélemy", BM: "Bermuda", BN: "Brunei",
  BO: "Bolivia", BR: "Brazil", BS: "Bahamas", BT: "Bhutan",
  BW: "Botswana", BY: "Belarus", BZ: "Belize", CA: "Canada",
  CC: "Cocos Islands", CD: "Congo (DRC)", CF: "Central African Republic", CG: "Congo",
  CH: "Switzerland", CI: "Côte d'Ivoire", CK: "Cook Islands", CL: "Chile",
  CM: "Cameroon", CN: "China", CO: "Colombia", CR: "Costa Rica",
  CU: "Cuba", CV: "Cape Verde", CW: "Curaçao", CX: "Christmas Island",
  CY: "Cyprus", CZ: "Czechia", DE: "Germany", DJ: "Djibouti",
  DK: "Denmark", DM: "Dominica", DO: "Dominican Republic", DZ: "Algeria",
  EC: "Ecuador", EE: "Estonia", EG: "Egypt", ER: "Eritrea",
  ES: "Spain", ET: "Ethiopia", FI: "Finland", FJ: "Fiji",
  FK: "Falkland Islands", FM: "Micronesia", FO: "Faroe Islands", FR: "France",
  GA: "Gabon", GB: "United Kingdom", GD: "Grenada", GE: "Georgia",
  GF: "French Guiana", GG: "Guernsey", GH: "Ghana", GI: "Gibraltar",
  GL: "Greenland", GM: "Gambia", GN: "Guinea", GP: "Guadeloupe",
  GQ: "Equatorial Guinea", GR: "Greece", GT: "Guatemala", GU: "Guam",
  GW: "Guinea-Bissau", GY: "Guyana", HK: "Hong Kong", HN: "Honduras",
  HR: "Croatia", HT: "Haiti", HU: "Hungary", ID: "Indonesia",
  IE: "Ireland", IL: "Israel", IM: "Isle of Man", IN: "India",
  IO: "British Indian Ocean Territory", IQ: "Iraq", IR: "Iran", IS: "Iceland",
  IT: "Italy", JE: "Jersey", JM: "Jamaica", JO: "Jordan",
  JP: "Japan", KE: "Kenya", KG: "Kyrgyzstan", KH: "Cambodia",
  KI: "Kiribati", KM: "Comoros", KN: "Saint Kitts and Nevis", KP: "North Korea",
  KR: "South Korea", KW: "Kuwait", KY: "Cayman Islands", KZ: "Kazakhstan",
  LA: "Laos", LB: "Lebanon", LC: "Saint Lucia", LI: "Liechtenstein",
  LK: "Sri Lanka", LR: "Liberia", LS: "Lesotho", LT: "Lithuania",
  LU: "Luxembourg", LV: "Latvia", LY: "Libya", MA: "Morocco",
  MC: "Monaco", MD: "Moldova", ME: "Montenegro", MF: "Saint Martin",
  MG: "Madagascar", MH: "Marshall Islands", MK: "North Macedonia", ML: "Mali",
  MM: "Myanmar", MN: "Mongolia", MO: "Macao", MP: "Northern Mariana Islands",
  MQ: "Martinique", MR: "Mauritania", MS: "Montserrat", MT: "Malta",
  MU: "Mauritius", MV: "Maldives", MW: "Malawi", MX: "Mexico",
  MY: "Malaysia", MZ: "Mozambique", NA: "Namibia", NC: "New Caledonia",
  NE: "Niger", NF: "Norfolk Island", NG: "Nigeria", NI: "Nicaragua",
  NL: "Netherlands", NO: "Norway", NP: "Nepal", NR: "Nauru",
  NU: "Niue", NZ: "New Zealand", OM: "Oman", PA: "Panama",
  PE: "Peru", PF: "French Polynesia", PG: "Papua New Guinea", PH: "Philippines",
  PK: "Pakistan", PL: "Poland", PM: "Saint Pierre and Miquelon", PR: "Puerto Rico",
  PS: "Palestine", PT: "Portugal", PW: "Palau", PY: "Paraguay",
  QA: "Qatar", RE: "Réunion", RO: "Romania", RS: "Serbia",
  RU: "Russia", RW: "Rwanda", SA: "Saudi Arabia", SB: "Solomon Islands",
  SC: "Seychelles", SD: "Sudan", SE: "Sweden", SG: "Singapore",
  SH: "Saint Helena", SI: "Slovenia", SJ: "Svalbard and Jan Mayen", SK: "Slovakia",
  SL: "Sierra Leone", SM: "San Marino", SN: "Senegal", SO: "Somalia",
  SR: "Suriname", SS: "South Sudan", ST: "São Tomé and Príncipe", SV: "El Salvador",
  SX: "Sint Maarten", SY: "Syria", SZ: "Eswatini", TA: "Tristan da Cunha",
  TC: "Turks and Caicos Islands", TD: "Chad", TG: "Togo", TH: "Thailand",
  TJ: "Tajikistan", TK: "Tokelau", TL: "Timor-Leste", TM: "Turkmenistan",
  TN: "Tunisia", TO: "Tonga", TR: "Turkey", TT: "Trinidad and Tobago",
  TV: "Tuvalu", TW: "Taiwan", TZ: "Tanzania", UA: "Ukraine",
  UG: "Uganda", US: "United States", UY: "Uruguay", UZ: "Uzbekistan",
  VA: "Vatican City", VC: "Saint Vincent and the Grenadines", VE: "Venezuela",
  VG: "British Virgin Islands", VI: "U.S. Virgin Islands", VN: "Vietnam",
  VU: "Vanuatu", WF: "Wallis and Futuna", WS: "Samoa", XK: "Kosovo",
  YE: "Yemen", YT: "Mayotte", ZA: "South Africa", ZM: "Zambia", ZW: "Zimbabwe",
};

function buildCountryList(): CountryEntry[] {
  const countries = getCountries();
  return countries
    .map((iso) => {
      try {
        const callingCode = getCountryCallingCode(iso);
        const name = COUNTRY_NAMES[iso] || iso;
        return { iso, name, callingCode: `+${callingCode}` } as CountryEntry;
      } catch {
        return null;
      }
    })
    .filter((c): c is CountryEntry => c !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

const ALL_COUNTRIES = buildCountryList();

// Figma SVG for Google Meet
const GoogleMeetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" fill="none">
    <g clipPath="url(#clip0_3265_11317)">
      <path d="M13.3145 7.99824L15.2639 10.2265L17.8853 11.9018L18.3424 8.01196L17.8853 4.20898L15.2137 5.68081L13.3145 7.99824Z" fill="#00832D" />
      <path d="M2 11.5411V14.855C2 15.6126 2.61364 16.2263 3.37126 16.2263H6.68515L7.37078 13.7214L6.68515 11.5411L4.41114 10.8555L2 11.5411Z" fill="#0066DA" />
      <path d="M6.68515 -0.228516L2 4.45664L4.41114 5.14227L6.68515 4.45664L7.35936 2.30604L6.68515 -0.228516Z" fill="#E94235" />
      <path d="M6.68515 4.45703H2V11.5419H6.68515V4.45703Z" fill="#2684FC" />
      <path d="M20.8781 1.75639L17.8842 4.21095V11.9037L20.8918 14.3697C21.3421 14.7217 22.0003 14.4006 22.0003 13.8281V2.28661C22.0003 1.70725 21.3272 1.38958 20.8781 1.75639ZM13.3133 8.00021V11.5426H6.68555V16.2278H16.5129C17.2706 16.2278 17.8842 15.6142 17.8842 14.8565V11.9037L13.3133 8.00021Z" fill="#00AC47" />
      <path d="M16.5129 -0.228516H6.68555V4.45664H13.3133V7.99907L17.8842 4.21209V1.14275C17.8842 0.385125 17.2706 -0.228516 16.5129 -0.228516Z" fill="#FFBA00" />
    </g>
    <defs>
      <clipPath id="clip0_3265_11317">
        <rect width="24" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);


// Figma SVG for Zoom
const ZoomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <g clipPath="url(#clip0_3265_11319)">
      <path d="M12 24C18.6281 24 24 18.6281 24 12C24 5.37188 18.6281 0 12 0C5.37188 0 0 5.37188 0 12C0 18.6281 5.37188 24 12 24Z" fill="#2196F3" />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.04064 15.4312H14.9766V9.60933C14.9766 8.73276 14.2641 8.02026 13.3875 8.02026H5.45627V13.8421C5.45627 14.7187 6.16408 15.4312 7.04064 15.4312ZM16.036 13.3125L19.2094 15.4265V8.02026L16.036 10.139V13.3125Z" fill="white" />
    </g>
    <defs>
      <clipPath id="clip0_3265_11319">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const NoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#f0edf4"/>
    <path d="M16 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11Z" fill="#a09da3"/>
  </svg>
);

const PlatformIcon = ({ icon }: { icon: PlatformOption["icon"] | "none" }) => {
  switch (icon) {
    case "zoom": return <ZoomIcon />;
    case "jitsi": return <JitsiIcon />;
    case "phone-call": return <PhoneCallIcon />;
    case "in-person": return <InPersonIcon />;
    case "custom-link": return <CustomLinkIcon />;
    case "none": return <NoneIcon />;
    default: return <GoogleMeetIcon />;
  }
};

const platformGroups = [
  {
    id: "preferred-platform",
    title: "Preferred platform",
    optional: true,
    options: [
      {
        id: "preferred-jitsi",
        label: "Jitsi (Recommended)",
        value: "jitsi",
        icon: "jitsi",
      },
      {
        id: "preferred-google-meet",
        label: "Google Meet",
        value: "google-meet",
        icon: "google-meet",
      },
      {
        id: "preferred-zoom",
        label: "Zoom (Manual)",
        value: "zoom",
        icon: "zoom",
      },
      {
        id: "preferred-phone-call",
        label: "Phone Call",
        value: "phone-call",
        icon: "phone-call",
      },
      {
        id: "preferred-in-person",
        label: "In-person",
        value: "in-person",
        icon: "in-person",
      },
      {
        id: "preferred-custom-link",
        label: "Custom Link",
        value: "custom-link",
        icon: "custom-link",
      },
    ] satisfies PlatformOption[],
    defaultValue: "",
  },
  {
    id: "fallback-platform",
    title: "Fallback Platform (optional)",
    optional: true,
    options: [
      {
        id: "fallback-jitsi",
        label: "Jitsi (Recommended)",
        value: "jitsi",
        icon: "jitsi",
      },
      {
        id: "fallback-zoom",
        label: "Zoom (Manual)",
        value: "zoom",
        icon: "zoom",
      },
      {
        id: "fallback-google-meet",
        label: "Google Meet",
        value: "google-meet",
        icon: "google-meet",
      },
      {
        id: "fallback-phone-call",
        label: "Phone Call",
        value: "phone-call",
        icon: "phone-call",
      },
      {
        id: "fallback-in-person",
        label: "In-person",
        value: "in-person",
        icon: "in-person",
      },
      {
        id: "fallback-custom-link",
        label: "Custom Link",
        value: "custom-link",
        icon: "custom-link",
      },
    ] satisfies PlatformOption[],
    defaultValue: "",
  },
];

interface SessionPlatformViewProps {
  onBack: () => void;
  onNext: () => void;
  onSaveExit?: () => void;
  onQuestions?: () => void;
  onLaunchSession?: (link: string) => void;
  sessionTitle?: string;
  sessionDuration?: number;
  sessionAvailability?: any;
  sessionDescription?: string;
  sessionParticipant?: { name: string; email: string };
}

const CustomCountrySelect = ({ value, options, iconComponent: Icon, onChange }: any) => {
  return (
    <div className="relative h-full flex-[0_0_auto]">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      >
        {options.map((option: any) => (
          <option key={option.value || "ZZ"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="inline-flex items-center justify-center gap-2 px-3 h-full bg-[var(--Surface-UI-surface-surface-elevated)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] transition-colors relative self-stretch">
        {Icon ? <Icon country={value} label={value} className="!w-6 !h-6" /> : <Flags countryCode={(value || "ng").toLowerCase()} className="!w-6 !h-6" />}
        <ChevronDownIcon className="w-6 h-6 shrink-0 !aspect-[1]" />
      </div>
    </div>
  );
};

export function SessionPlatformView({ onBack, onNext, onSaveExit, onQuestions, onLaunchSession, sessionTitle, sessionDuration, sessionAvailability, sessionDescription, sessionParticipant }: SessionPlatformViewProps) {
  const [isPublic, setIsPublic] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, string>>(
    Object.fromEntries(platformGroups.map((group) => [group.id, group.defaultValue]))
  );
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [selectedPhoneId, setSelectedPhoneId] = useState<string | null>(null);
  const [phones, setPhones] = useState(phoneNumbers);
  const [isEnteringNewNumber, setIsEnteringNewNumber] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const inputId = useId();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("NG");
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // Zoom Modal State
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<"zoom" | "custom-link">("zoom");
  const [zoomLink, setZoomLink] = useState("");
  const [jitsiLink, setJitsiLink] = useState("");
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [isGeneratingMeet, setIsGeneratingMeet] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [isZoomInputActive, setIsZoomInputActive] = useState(false);
  const zoomInputId = useId();
  const zoomInputRef = useRef<HTMLInputElement>(null);

  // OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpErrorMsg, setOtpErrorMsg] = useState<string | null>(null);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(15);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [successIndex, setSuccessIndex] = useState<number | null>(null);
  const isSuccessFlowRunning = useRef(false);

  const handleSuccessFlow = () => {
    if (isSuccessFlowRunning.current) return;
    isSuccessFlowRunning.current = true;
    let current = 0;
    const interval = setInterval(() => {
      setSuccessIndex(current);
      current++;
      if (current >= 6) {
        clearInterval(interval);
        setOtpSuccessMsg("Success");
        setTimeout(() => {
          // Add the newly verified number to the list and select it
          const callingCode = getCountryCallingCode(selectedCountryCode as any);
          const formattedNewNumber = `+${callingCode} ${newPhoneNumber.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")}`;
          
          setPhones(prev => {
            const newPhoneObj = { id: `p${prev.length + 1}`, number: formattedNewNumber };
            setSelectedPhoneId(newPhoneObj.id);
            return [...prev, newPhoneObj];
          });
          
          setIsEnteringNewNumber(false);
          setNewPhoneNumber("");
          setIsOtpModalOpen(false);
          setIsPhoneModalOpen(false);
          setOtpSuccessMsg(null);
          setSuccessIndex(null);
          setOtp(["", "", "", "", "", ""]);
          isSuccessFlowRunning.current = false;
        }, 1200);
      }
    }, 100);
  };

  React.useEffect(() => {
    if (otpCountdown > 0 && isOtpModalOpen) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown, isOtpModalOpen]);

  React.useEffect(() => {
    if (isOtpModalOpen) {
      // Wait for the modal to animate up before focusing, to prevent the background from jumping
      const focusTimer = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 400);
      return () => clearTimeout(focusTimer);
    }
  }, [isOtpModalOpen]);

  React.useEffect(() => {
    const val = otp.join('');
    if (val.length === 6) {
      if (val === "111111") {
        handleSuccessFlow();
      } else {
        setOtpErrorMsg("That code isn’t valid or may have expired");
      }
    }
  }, [otp]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(index + pastedData.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      if (otpErrorMsg) setOtpErrorMsg(null);
      if (otpSuccessMsg) setOtpSuccessMsg(null);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (otpErrorMsg) setOtpErrorMsg(null);
    if (otpSuccessMsg) setOtpSuccessMsg(null);

    if (value !== "" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    if (otpErrorMsg) setOtpErrorMsg(null);
    if (otpSuccessMsg) setOtpSuccessMsg(null);
  };

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return ALL_COUNTRIES;
    const query = countrySearch.toLowerCase().trim();
    return ALL_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.iso.toLowerCase().includes(query) ||
        c.callingCode.includes(query)
    );
  }, [countrySearch]);

  const handlePlatformChange = (groupId: string, value: string) => {
    setSelectedPlatforms((current) => ({
      ...current,
      [groupId]: value,
    }));
  };

  const isNextEnabled = true; // Add validation if needed

  const currentDigits = newPhoneNumber.replace(/\D/g, "");
  const currentFullE164 = `+${getCountryCallingCode(selectedCountryCode as any)}${currentDigits}`;
  const isPhoneNumberFormatValid = isValidPhoneNumber(currentFullE164);
  const isDuplicateNumber = phones.some(p => p.number.replace(/\D/g, "") === currentFullE164.replace(/\D/g, ""));
  const phoneDuplicateError = isPhoneNumberFormatValid && isDuplicateNumber;
  const canApplyNewNumber = isPhoneNumberFormatValid && !isDuplicateNumber;

  const handleNext = async () => {
    const isGoogleMeetSelected = 
      selectedPlatforms["preferred-platform"] === "google-meet" || 
      selectedPlatforms["fallback-platform"] === "google-meet";

    if (isGoogleMeetSelected && !googleMeetLink) {
      setIsGeneratingMeet(true);
      try {
        let startTime = new Date();
        let endTime = new Date(Date.now() + (sessionDuration || 60) * 60000);

        if (sessionAvailability?.type === "Specific Dates" && sessionAvailability.specificSlots?.length > 0) {
          const slot = sessionAvailability.specificSlots[0];
          const baseDate = new Date(slot.dateRange.start);
          
          const parseTime = (timeStr: string, base: Date) => {
            const [time, ampm] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (ampm === 'PM' && hours < 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            const d = new Date(base);
            d.setHours(hours, minutes, 0, 0);
            return d;
          };

          if (slot.timeRange?.start) {
            startTime = parseTime(slot.timeRange.start, baseDate);
          }
          if (slot.timeRange?.end) {
            endTime = parseTime(slot.timeRange.end, baseDate);
          }
        }

        const response = await fetch('/api/create-meet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session: {
              id: sessionTitle ? sessionTitle.replace(/\s+/g, '-') + '-' + Date.now() : 'session-' + Date.now(),
              title: sessionTitle || 'Skillbeek Session',
              description: sessionDescription || 'Skillbeek Exchange Session',
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
              participants: sessionParticipant ? [{ email: sessionParticipant.email }] : []
            }
          })
        });
        const data = await response.json();
        if (data.success && data.meetLink) {
          setGoogleMeetLink(data.meetLink);
        } else {
          console.error("Failed to generate Meet link:", data.error);
          // Fallback just to continue the flow
          setGoogleMeetLink("https://meet.google.com/error-fallback");
        }
      } catch (err) {
        console.error("API error:", err);
        setGoogleMeetLink("https://meet.google.com/error-fallback");
      } finally {
        setIsGeneratingMeet(false);
      }
    } else {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]"></div>
      </div>

      {/* Header Actions */}
      <div className="w-full px-[16px] flex justify-between items-center py-[16px] shrink-0 bg-[var(--Surface-Primary-Background)] z-20">
        <button
          onClick={onSaveExit}
          className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]"
        >
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">Save and Exit</span>
        </button>
        <button
          onClick={onQuestions}
          className="h-[44px] px-[16px] border-2 border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Text-Primary-Subtitle)] active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)] rounded-[99px] flex items-center justify-center transition-colors bg-[var(--Surface-Primary-Background)]"
        >
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px]">Questions?</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 w-full flex flex-col relative pt-[0px] overflow-y-auto availability-scrollbar pb-[156px]">
        {/* Title Content */}
        <div className="w-full px-[16px] flex flex-col gap-[32px] mb-[24px]">
          {/* Header Texts */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center gap-[8px]">
              <h1 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[36px] tracking-[-1.2px]">
                Plan Your Session
              </h1>
              <InfoIconButton
                onClick={() => setIsInfoOpen(true)}
                label="Platform Info"
              />
            </div>
            <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px]">
              Still working it out? You can edit anytime.
            </p>
          </div>

          {/* Platform Groups */}
          <div className="flex flex-col gap-[32px]">
            {platformGroups.map((group) => {
              const isNoneSelected = selectedPlatforms[group.id] === "" && group.optional;
              const selectedOption = isNoneSelected
                ? { id: "none", label: "None", value: "", icon: "none" as any }
                : (group.options.find((option) => option.value === selectedPlatforms[group.id]) ?? group.options[0]);
              const isGroupActive = activeGroup === group.id;

              return (
                <fieldset key={group.id} className="flex flex-col gap-[8px] relative w-full">
                  <legend className="font-['Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-[14px] leading-[20px] tracking-[1px] mb-[8px]">
                    {group.title}
                  </legend>
                  {selectedOption.value === "phone-call" && !isGroupActive ? (
                    <div 
                      onClick={() => {
                        setIsEnteringNewNumber(false);
                        setIsPhoneModalOpen(true);
                      }}
                      className="flex flex-col items-center justify-center gap-4 p-4 relative w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[24px] shadow-SM border border-transparent hover:border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)] transition-colors cursor-pointer"
                    >
                      <section className="flex items-center gap-[138px] p-3 w-full bg-[var(--Surface-UI-surface-surface-variant)] rounded-xl relative">
                        <div className="flex items-start gap-3">
                          <PlatformIcon icon={selectedOption.icon} />
                          <div className="flex flex-col items-start justify-center gap-2">
                            <h1 className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px] mt-[-1px]">
                              {selectedOption.label}
                            </h1>
                            <p className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[32px] tracking-[-0.70px] m-0">
                              {selectedPhoneId ? phones.find(p => p.id === selectedPhoneId)?.number : phones[0]?.number}
                            </p>
                          </div>
                        </div>
                      </section>
                      <NeumorphicDivider />
                      <section className="flex flex-col items-start gap-[18px] w-full">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveGroup(group.id);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 p-3 rounded-2xl cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
                        >
                          <PencilIcon className="w-6 h-6 text-[var(--Text-Primary-heading-3)]" />
                          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px] underline mt-[-1px]">
                            Change Platform
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEnteringNewNumber(true);
                            setIsPhoneModalOpen(true);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] transition-colors rounded-2xl cursor-pointer"
                        >
                          <PhoneIcon className="w-6 h-6 text-[var(--Button-Primary-Surface-default-sec)]" />
                          <span className="font-['Nunito'] font-bold text-[var(--Button-Primary-Surface-default-sec)] text-[16px] leading-[24px] tracking-[0.16px] mt-[-1px]">
                            Change Number
                          </span>
                        </button>
                      </section>
                    </div>
                  ) : (selectedOption.value === "zoom" || selectedOption.value === "custom-link" || selectedOption.value === "jitsi" || selectedOption.value === "google-meet") && !isGroupActive && (
                    ((selectedOption.value === "zoom" || selectedOption.value === "custom-link") && zoomLink) ||
                    (selectedOption.value === "jitsi" && jitsiLink) ||
                    (selectedOption.value === "google-meet" && googleMeetLink)
                  ) ? (
                    <div 
                      onClick={() => {
                        if (selectedOption.value !== "jitsi") setIsZoomModalOpen(true);
                      }}
                      className="flex flex-col items-center justify-center gap-4 p-4 relative w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[24px] shadow-SM border border-transparent hover:border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)] transition-colors cursor-pointer"
                    >
                      <article
                        className={`flex items-stretch relative w-full rounded-[12px] overflow-hidden min-h-[72px] ${
                          selectedOption.value === "custom-link" ? "bg-[var(--Surface-Primary-Background)]" : "bg-[var(--Surface-Information-bg-surface-lighter)]"
                        }`}
                        aria-label="Meeting link card"
                      >
                        <div className={`flex items-center justify-center w-[56px] shrink-0 ${
                          selectedOption.value === "custom-link" ? "bg-[var(--Surface-UI-surface-surface-variant)]" : "bg-[var(--Surface-Information-bg-surface)]"
                        }`}>
                          <PlatformIcon icon={selectedOption.icon} />
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 flex-1 min-w-0">
                          <div className="flex flex-col items-start justify-center gap-1 min-w-0 flex-1">
                            <h1 className="font-['Nunito'] font-bold text-[var(--Text-Information-primary-darker)] text-[16px] tracking-[1.0px] leading-[24px] truncate w-full">
                              {selectedOption.value === "custom-link" ? "Meeting Link" : selectedOption.value === "jitsi" ? "Jitsi meeting" : selectedOption.value === "google-meet" ? "Google Meet" : "Zoom meeting"}
                            </h1>
                            <a
                              href={selectedOption.value === "jitsi" ? jitsiLink : selectedOption.value === "google-meet" ? googleMeetLink : zoomLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                let url = selectedOption.value === "jitsi" ? jitsiLink : selectedOption.value === "google-meet" ? googleMeetLink : zoomLink;
                                if (selectedOption.value === "jitsi" || selectedOption.value === "google-meet") {
                                    if (selectedOption.value === "jitsi") {
                                        // Remove any existing hash or query to avoid collisions
                                        const baseUrl = url.split('#')[0].split('?')[0];
                                        url = baseUrl + "?lang=en";
                                    }
                                    
                                    if (onLaunchSession) {
                                      onLaunchSession(url);
                                      return;
                                    }
                                }
                                window.open(url, '_blank', 'noopener,noreferrer');
                              }}
                              className="font-['Nunito'] font-medium text-[var(--Text-Primary-Caption)] text-[14px] tracking-[1.0px] leading-[20px] truncate max-w-[152px] hover:underline block"
                            >
                              {selectedOption.value === "jitsi" ? jitsiLink : selectedOption.value === "google-meet" ? googleMeetLink : zoomLink}
                            </a>
                          </div>
                          <button
                            type="button"
                            className="flex items-center justify-center p-2 rounded-lg hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors shrink-0 ml-2 bg-[var(--Surface-Primary-Background)]"
                            aria-label="Copy meeting link"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(selectedOption.value === "jitsi" ? jitsiLink : selectedOption.value === "google-meet" ? googleMeetLink : zoomLink);
                              setShowCopyToast(true);
                            }}
                          >
                            <CopyIcon className="w-5 h-5 text-[var(--Text-Information-primary-darker)]" />
                          </button>
                        </div>
                      </article>
                      <NeumorphicDivider />
                      <section className="flex flex-col items-start gap-[18px] w-full">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveGroup(group.id);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 p-3 rounded-2xl cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
                        >
                          <PencilIcon className="w-6 h-6 text-[var(--Text-Primary-heading-3)]" />
                          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px] underline mt-[-1px]">
                            Change Platform
                          </span>
                        </button>
                        {selectedOption.value !== "jitsi" && selectedOption.value !== "google-meet" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalPlatform(selectedOption.value as "zoom" | "custom-link");
                              setIsZoomModalOpen(true);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] transition-colors rounded-2xl cursor-pointer"
                          >
                            <CustomLinkIcon stroke="var(--stroke-alternate)" />
                            <span className="font-['Nunito'] font-bold text-[var(--Button-Primary-Surface-default-sec)] text-[16px] leading-[24px] tracking-[0.16px] mt-[-1px]">
                              Change Link
                            </span>
                          </button>
                        )}
                      </section>
                    </div>
                  ) : (
                    <div
                      onClick={() => setActiveGroup(isGroupActive ? null : group.id)}
                      className={`flex items-center justify-between px-[16px] py-[24px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] shadow-SM cursor-pointer border transition-colors relative ${isGroupActive ? "border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)]" : "border-transparent hover:border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)]"
                        }`}
                    >
                      <div className="flex items-center gap-[12px]">
                        <PlatformIcon icon={selectedOption.icon} />
                        <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                          {selectedOption.label.replace(" (Recommended)", "")}
                          {selectedOption.label.includes("(Recommended)") && (
                            <span className="font-black"> (Recommended)</span>
                          )}
                        </span>
                      </div>
                      {isGroupActive ? (
                        <ChevronUpIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-Body)]" />
                      ) : (
                        <ChevronDownIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-Body)]" />
                      )}
                    </div>
                  )}

                  {/* Removed inline dropdown menu - moved to Modal below */}
                </fieldset>
              );
            })}
          </div>

          <div className="flex flex-col gap-[24px] mt-[16px]">
            {/* Link to a Project */}
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[8px]">
                <h2 className="font-['Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-[14px] leading-[20px] tracking-[1px]">
                  Project (optional)
                </h2>
              </div>
              
              <button
                type="button"
                className="w-full flex items-center gap-[12px] p-[16px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] shadow-SM border border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)] transition-colors cursor-pointer"
              >
                <PlusIcon className="w-[20px] h-[20px] text-[var(--Text-Primary-heading-1)]" />
                <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                  Add to a project
                </span>
              </button>
            </div>

            <NeumorphicDivider className="!my-[0px]" />

            {/* Who can see this */}
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[8px]">
                <h2 className="font-['Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-[14px] leading-[20px] tracking-[1px]">
                  Visibility
                </h2>
              </div>
              
              <div className="flex flex-row items-stretch gap-[12px] w-full">
                <div 
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex items-center gap-[12px] p-[16px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] shadow-SM border cursor-pointer transition-colors relative ${
                    isPublic 
                      ? "border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)]" 
                      : "border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)]"
                  }`}
                >
                  <div className="shrink-0 flex items-center justify-center">
                    <CustomAnimatedRadioButton checked={isPublic === true} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                      Public
                    </span>
                    <span className="font-['Nunito'] font-medium text-[var(--Text-Primary-Subtitle)] text-[14px] leading-[20px]">
                      Anyone can see
                    </span>
                  </div>
                </div>

                <div 
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex items-center gap-[12px] p-[16px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] shadow-SM border cursor-pointer transition-colors relative ${
                    !isPublic 
                      ? "border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)]" 
                      : "border-[var(--Button-Primary-Stroke-Stroke-default)] hover:border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)]"
                  }`}
                >
                  <div className="shrink-0 flex items-center justify-center">
                    <CustomAnimatedRadioButton checked={isPublic === false} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                      Private
                    </span>
                    <span className="font-['Nunito'] font-medium text-[var(--Text-Primary-Subtitle)] text-[14px] leading-[20px]">
                      Only you
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Fixed Bottom Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col items-center gap-[32px] pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={1} subStepProgress={75} />
        </div>
        <div className="w-full flex items-center justify-between px-[16px]">
          <button
            onClick={onBack}
            className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] underline cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isNextEnabled || isGeneratingMeet}
            className={`font-['Nunito'] font-bold text-[16px] leading-[24px] px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] transition-all ${isNextEnabled && !isGeneratingMeet
                ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] cursor-pointer hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)]"
                : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
              }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]"></div>
      </div>

      {/* Platform Selection Modal */}
      <AnimatePresence>
        {activeGroup && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveGroup(null)}
              className="absolute inset-0 z-40 bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px] rounded-[32px]"
            />

            {/* Modal Content */}
            <motion.div
              key="modal"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full z-50 bg-[var(--Surface-UI-surface-surface-elevated)] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col items-center shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] select-none"
            >
              {/* Drag Handle */}
              <div className="w-[64px] h-[8px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[4px] mb-[16px]" />

              {(() => {
                const group = platformGroups.find((g) => g.id === activeGroup);
                if (!group) return null;

                return (
                  <>
                    {/* Header */}
                    <div className="w-full flex items-center justify-between px-[16px] mb-[16px]">
                      <div className="w-[48px]" />
                      <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] tracking-[-0.2px] text-center">
                        {group.title.replace(" (optional)", "")}
                      </h3>
                      <button
                        onClick={() => setActiveGroup(null)}
                        className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
                      >
                        <CloseIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
                      </button>
                    </div>

                    {/* Divider */}
                    <NeumorphicDivider className="px-[16px] !my-[12px]" />

                    {/* Options List */}
                    <div className="w-full flex flex-col gap-[6px] px-[16px]">
                      {group.optional && (
                        <div
                          onClick={() => {
                            handlePlatformChange(group.id, "");
                            setActiveGroup(null);
                          }}
                          className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between px-[16px] py-[12px] min-h-[56px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer"
                        >
                          <div className="flex items-center gap-[12px]">
                            <PlatformIcon icon="none" />
                            <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                              None
                            </span>
                          </div>
                          <div className="p-[10px] shrink-0">
                            <CustomAnimatedRadioButton checked={selectedPlatforms[group.id] === ""} />
                          </div>
                        </div>
                      )}
                      {group.options
                        .filter((option) => {
                          // Prevent user from selecting the same platform for both preferred and fallback
                          if (group.id === "fallback-platform" && option.value === selectedPlatforms["preferred-platform"]) {
                            return false;
                          }
                          return true;
                        })
                        .map((option) => {
                        const isSelected = selectedPlatforms[group.id] === option.value;
                        return (
                          <div
                            key={option.id}
                            onClick={() => {
                              const isSameOption = selectedPlatforms[group.id] === option.value;
                              handlePlatformChange(group.id, option.value);
                              setActiveGroup(null);
                              if (option.value === "phone-call") {
                                setIsEnteringNewNumber(false);
                                setIsPhoneModalOpen(true);
                              }
                              if (option.value === "zoom" || option.value === "custom-link") {
                                if (!isSameOption) {
                                  setZoomLink("");
                                }
                                setModalPlatform(option.value as "zoom" | "custom-link");
                                setIsZoomModalOpen(true);
                              }
                              if (option.value === "jitsi") {
                                if (!isSameOption || !jitsiLink) {
                                  const rawTitle = (sessionTitle || "").replace(/[^a-zA-Z0-9]/g, '');
                                  const cleanTitle = rawTitle.length > 0 ? rawTitle : "SkillbeekSession";
                                  const uniqueId = window.crypto.randomUUID().split('-')[0];
                                  setJitsiLink(`https://jitsi.riot.im/Skillbeek-${cleanTitle}-${uniqueId}?lang=en#config.defaultLanguage=%22en%22`);
                                }
                              }
                              if (option.value === "google-meet") {
                                if (!isSameOption || !googleMeetLink) {
                                  // Clear the link to ensure wait screen logic runs on Next
                                  setGoogleMeetLink("");
                                }
                              }
                            }}
                            className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-between px-[16px] py-[12px] min-h-[56px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer"
                          >
                            <div className="flex items-center gap-[12px]">
                              <PlatformIcon icon={option.icon} />
                              <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                                {option.label.replace(" (Recommended)", "")}
                                {option.label.includes("(Recommended)") && (
                                  <span className="font-extrabold"> (Recommended)</span>
                                )}
                              </span>
                            </div>
                            <div className="p-[10px] shrink-0">
                              <CustomAnimatedRadioButton checked={isSelected} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Phone Number Selection Modal */}
      <AnimatePresence>
        {isPhoneModalOpen && (
          <motion.div
            key="phone-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsPhoneModalOpen(false);
              setIsEnteringNewNumber(false);
            }}
            className="absolute inset-0 z-40 bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px] rounded-[32px]"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isPhoneModalOpen && (
          <motion.div
            key="phone-modal"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full z-50 bg-[var(--Surface-UI-surface-surface-elevated)] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col items-center shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] select-none"
            >
              {/* Drag Handle */}
              <div className="w-[64px] h-[8px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[4px] mb-[16px]" />

              {/* Header */}
              <div className="w-full flex items-center justify-between px-[16px] mb-[16px]">
                <div className="w-[48px]" />
                <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] tracking-[-0.2px] text-center">
                  {isEnteringNewNumber 
                    ? "Enter your phone number" 
                    : selectedPhoneId ? "Your Contact Number" : "Select Your Number"}
                </h3>
                <button
                  onClick={() => {
                    setIsPhoneModalOpen(false);
                    setIsEnteringNewNumber(false);
                  }}
                  className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
                >
                  <CloseIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
                </button>
              </div>

              {/* Divider */}
              <NeumorphicDivider className="px-[16px]" />

              {/* Content */}
              <div className="w-full flex flex-col gap-[16px] px-[16px]">
                <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] text-center">
                  Your partner will use this number to call you at the scheduled time.
                </p>

                {isEnteringNewNumber ? (
                  <>
                    <div className={`flex items-stretch relative self-stretch w-full flex-[0_0_auto] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-xl border-2 border-solid mt-[8px] overflow-hidden transition-colors ${
                      phoneDuplicateError ? "border-[var(--Button-Error-Stroke-error)]" : "border-[var(--Text-Primary-Text-brand)]"
                    }`}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setCountrySearch("");
                          setIsCountryModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-3 relative self-stretch flex-[0_0_auto] bg-[var(--Surface-UI-surface-surface-elevated)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] transition-colors cursor-pointer"
                      >
                        <Flags countryCode={selectedCountryCode.toLowerCase()} className="!relative !w-6 !h-6 shrink-0" />
                        <ChevronDownIcon className="w-6 h-6 shrink-0 !aspect-[1]" />
                      </div>
                      <div className="flex flex-col items-start gap-1 px-3 py-2 relative flex-1 grow justify-center">
                        <label
                          htmlFor={inputId}
                          className="relative flex items-center self-stretch mt-[-1.00px] font-['Nunito'] font-semibold text-[var(--Text-Primary-Caption)] text-xs tracking-[1.10px] leading-4"
                        >
                          Phone number
                        </label>
                        <div className="flex items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                          <div className="font-['Nunito'] font-semibold text-[var(--Text-Primary-Text-placeholder)] relative flex items-center w-fit mt-[-1.00px] text-base tracking-[0] leading-6 whitespace-nowrap">
                            +{getCountryCallingCode(selectedCountryCode as any)}
                          </div>
                          <div className="flex flex-1 h-6 items-center px-0 py-0.5 relative min-w-0">
                            <input
                              id={inputId}
                              name="phoneNumber"
                              type="tel"
                              inputMode="numeric"
                              autoComplete="tel-national"
                              value={newPhoneNumber}
                              onChange={(e) => {
                                let digits = e.target.value.replace(/\D/g, "");
                                // Strip leading 0 since country code is already shown
                                if (digits.startsWith("0")) {
                                  digits = digits.substring(1);
                                }
                                // Limit to 10 local digits for Nigeria
                                digits = digits.substring(0, 10);

                                // Apply 3-4-3 format: XXX XXXX XXX
                                let formatted = "";
                                if (digits.length > 0) formatted += digits.slice(0, 3);
                                if (digits.length > 3) formatted += " " + digits.slice(3, 7);
                                if (digits.length > 7) formatted += " " + digits.slice(7, 10);

                                setNewPhoneNumber(formatted);
                              }}
                              className="flex-1 min-w-0 h-6 font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-base tracking-[0] leading-6 bg-transparent outline-none caret-[#171519] placeholder:text-transparent p-0 w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {phoneDuplicateError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="w-full flex items-center overflow-hidden shrink-0 mt-[4px]"
                        >
                          <div className="w-full flex items-start gap-[6px]">
                            <ErrorIcon className="w-[14px] h-[14px] shrink-0 mt-[3px]" />
                            <span className="font-['Nunito'] font-medium leading-[20px] text-[12px] tracking-[0.5px] text-[var(--Text-Error-primary)]">
                              Already saved. Please select it from your list.
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="w-full flex items-center justify-between pt-[24px] shrink-0">
                      <button
                        onClick={() => setNewPhoneNumber("")}
                        className="h-[48px] px-[0px] flex items-center justify-center"
                      >
                        <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] underline">
                          Clear all
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setOtp(["", "", "", "", "", ""]);
                          setOtpCountdown(15);
                          setOtpErrorMsg(null);
                          setOtpSuccessMsg(null);
                          setSuccessIndex(null);
                          if (canApplyNewNumber) {
                            setIsOtpModalOpen(true);
                          }
                        }}
                        disabled={!canApplyNewNumber}
                        className={`h-[48px] px-[16px] min-w-[101px] rounded-[16px] flex items-center justify-center transition-colors ${
                          canApplyNewNumber
                            ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] cursor-pointer"
                            : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
                        }`}
                      >
                        <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">Apply</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                               <div className="flex flex-col gap-[12px] w-full mt-[8px]">
                      {phones.map((phone) => (
                        <button
                          key={phone.id}
                          onClick={() => {
                            setSelectedPhoneId(phone.id);
                            setIsPhoneModalOpen(false);
                          }}
                          className={`flex items-center justify-between px-[16px] py-[12px] rounded-[16px] border-[2px] transition-all cursor-pointer ${
                            (selectedPhoneId === phone.id) || (!selectedPhoneId && phone.lastUsed)
                              ? "border-[var(--Text-Primary-Text-brand)] bg-[var(--Surface-Warning-bg-surface)]"
                              : "border-[var(--Button-Primary-Stroke-Stroke-secondary-hover)] bg-[var(--Surface-UI-surface-surface-elevated)] hover:border-[var(--Text-Primary-Text-brand)]"
                          }`}
                        >
                          <div className="flex items-center gap-[12px]">
                            <div className="w-[40px] h-[40px] rounded-[12px] bg-[var(--Surface-UI-surface-surface-elevated)] flex items-center justify-center">
                              <PhoneIcon className="w-[20px] h-[20px] text-[var(--Text-Primary-heading-3)]" />
                            </div>
                            <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px]">
                              {phone.number}
                            </span>
                          </div>
                          <CustomAnimatedRadioButton
                            checked={(selectedPhoneId === phone.id) || (!selectedPhoneId && phone.lastUsed === true)}
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEnteringNewNumber(true)}
                      className="self-start inline-flex items-center justify-center py-[12px] pr-[16px] rounded-[16px] hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <span className="font-['Nunito'] font-bold text-[var(--Text-Information-primary)] text-[16px] leading-[24px]">
                        Change Number
                      </span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Country Code Selection Modal */}
      <AnimatePresence>
        {isCountryModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCountryModalOpen(false);
                setCountrySearch("");
              }}
              className="absolute inset-0 z-[80] bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px] rounded-[32px]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full z-[90] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] h-[90%]"
            >
              {/* Drag Handle */}
              <div className="flex justify-center mb-[16px] shrink-0">
                <div className="w-[64px] h-[8px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[4px]" />
              </div>

              {/* Header */}
              <div className="w-full flex items-center justify-between px-[16px] mb-[16px] shrink-0">
                <div className="w-[48px]" />
                <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] tracking-[-0.2px]">
                  Search Country
                </h3>
                <button
                  onClick={() => {
                    setIsCountryModalOpen(false);
                    setCountrySearch("");
                  }}
                  className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
                >
                  <CloseIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
                </button>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] mb-[16px] shrink-0" />

              {/* Description */}
              <div className="px-[16px] w-full text-center mb-[16px] shrink-0">
                <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
                  Search for your city or timezone to ensure your availability schedule is perfectly accurate.
                </p>
              </div>

              {/* Search Field */}
              <div className="px-[16px] w-full mb-[24px] shrink-0">
                <div className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] rounded-[12px] px-[12px] py-[16px] flex items-center">
                  <SearchIcon className="w-[20px] h-[20px] text-[var(--Text-Primary-Text-placeholder)] mr-[8px] shrink-0" />
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search cities or countries..."
                    className="w-full bg-transparent outline-none font-['Nunito'] font-medium text-[var(--Text-Primary-heading-1)] text-[16px] placeholder:text-[var(--Text-Primary-Text-placeholder)]"
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="w-full flex-1 overflow-y-auto px-[16px]">
                <div className="flex flex-col gap-[6px]">
                  {filteredCountries.map((country) => {
                    const isSelected = country.iso === selectedCountryCode;
                    return (
                      <div
                        key={country.iso}
                        onClick={() => {
                          setSelectedCountryCode(country.iso);
                          setNewPhoneNumber("");
                          setIsCountryModalOpen(false);
                          setCountrySearch("");
                        }}
                        className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] flex items-center justify-between p-[12px] rounded-[12px] cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors min-h-[44px]"
                      >
                        <div className="flex items-center gap-[12px]">
                          <Flags countryCode={country.iso.toLowerCase()} className="!w-6 !h-6 shrink-0" />
                          <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px]">
                            {country.name} ({country.callingCode})
                          </span>
                        </div>
                        <CustomAnimatedRadioButton checked={isSelected} />
                      </div>
                    );
                  })}
                </div>

                {filteredCountries.length === 0 && (
                  <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Text-placeholder)] text-[16px] text-center mt-[32px]">
                    No results for "{countrySearch}"
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Info Overlay ─────────────────────────────── */}
      {/* Blurred backdrop */}
      <div
        className={`absolute inset-0 z-[60] transition-opacity duration-300 ${isInfoOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        style={{ backgroundColor: "rgba(47,44,50,0.26)", backdropFilter: "blur(4px)" }}
        onClick={() => setIsInfoOpen(false)}
      />

      {/* Tooltip card */}
      <div
        className={`absolute z-[70] left-[16px] right-[16px] transition-all duration-300 ${isInfoOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        style={{ top: "172px" }}
      >
        {/* Arrow pointing up */}
        <div
          className="absolute"
          style={{
            top: "-8px",
            left: "224px",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "8px solid #f9f4ee"
          }}
        />

        {/* Card */}
        <div className="w-full bg-[var(--Button-Primary-Surface-default-sec)] rounded-[12px] p-[16px] flex gap-[12px] items-start shadow-xl">
          {/* Content column */}
          <div className="flex-1 flex flex-col pt-[4px]">
            <p className="font-['Nunito'] font-medium text-[16px] leading-[24px] text-[var(--Text-Primary-heading-1)] tracking-[0.2px]">
              We can't auto-generate Zoom links yet. Please schedule the meeting and paste your link.
            </p>
          </div>

          {/* X close button */}
          <button
            onClick={() => setIsInfoOpen(false)}
            className="shrink-0 w-[32px] h-[32px] flex items-center justify-center -mr-[4px] hover:bg-[var(--Surface-UI-surface-Surface-Universal-highlighter)] rounded-full transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-[16px] h-[16px] text-[var(--Text-Primary-heading-1)]" />
          </button>
        </div>
      </div>
      {/* ──────────────────────────────────────────────────── */}

      {/* OTP Verification Modal */}

      <AnimatePresence>
        {isOtpModalOpen && (
          <motion.div
            key="otp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOtpModalOpen(false)}
            className="absolute inset-0 z-[100] bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px] rounded-[32px]"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOtpModalOpen && (
          <motion.div
            key="otp-modal"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full z-[110] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)]"
            >
              {/* Drag Handle */}
              <div className="flex justify-center mb-[16px] shrink-0">
                <div className="w-[64px] h-[8px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[4px]" />
              </div>

              {/* Header */}
              <div className="w-full flex items-center justify-center px-[16px] mb-[16px] shrink-0 relative h-[28px]">
                <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] tracking-[-0.2px]">
                  Enter your security code
                </h3>
              </div>

              {/* Content */}
              <div className="w-full flex flex-col px-[16px]">
                {/* Divider */}
                <div className="w-full h-[1px] bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] mb-[16px] shrink-0" />
                <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px] text-center mb-[24px]">
                  We just sent a 6-digit code to <br />
                  <span className="font-bold text-[var(--Text-Primary-heading-1)]">+{getCountryCallingCode(selectedCountryCode as any)}{" "}{newPhoneNumber}</span> Enter it below.
                </p>

                {/* OTP Inputs */}
                <div className="w-full flex flex-col items-center gap-[4px] mb-[16px]">
                  <div className="w-full flex items-center justify-between gap-[8px]">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={`w-[44px] h-[48px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[8px] flex items-center justify-center text-center font-['Nunito'] font-semibold text-[28px] focus:outline-none transition-all duration-200 ${
                          otpErrorMsg
                            ? "border-[1.5px] border-[var(--Button-Error-Stroke-error)] text-[var(--Text-Error-primary)] focus:ring-2 focus:ring-[var(--Text-Error-primary)] shadow-[0px_1px_2px_rgba(18,9,0,0.1)]"
                            : successIndex !== null && index <= successIndex
                            ? "border-[1.5px] border-[var(--Surface-Success-icon-bg-surface)] bg-[var(--Surface-Success-bg-surface-padding)] text-[var(--Text-Primary-heading-1)] shadow-[0px_0px_10px_rgba(52,144,36,0.3)] shadow-skillbeek-xs ring-2 ring-[var(--Surface-Success-icon-bg-surface)]"
                            : "border-none text-[var(--Text-Primary-heading-1)] shadow-[0px_1px_2px_rgba(18,9,0,0.1)] focus:ring-2 focus:ring-[var(--Text-Primary-Text-brand)]"
                        }`}
                      />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {(otpErrorMsg || otpSuccessMsg) && (
                      <motion.div
                        key={otpErrorMsg ? 'error' : 'success'}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full flex items-center justify-center overflow-hidden shrink-0 mt-[4px]"
                      >
                        <div className="w-full max-w-[352px] flex items-start gap-[6px]">
                          {otpErrorMsg && (
                            <ErrorIcon className="w-[14px] h-[14px] shrink-0 mt-[3px]" />
                          )}
                          <span className={`font-['Nunito'] font-medium leading-[20px] ${
                            otpErrorMsg 
                              ? 'text-[12px] tracking-[0.5px] text-[var(--Text-Error-primary)]' 
                              : 'text-[14px] tracking-[1px] text-[var(--Surface-Success-icon-bg-surface)]'
                          }`}>
                            {otpErrorMsg || otpSuccessMsg}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Resend Code / Timer */}
                <AnimatePresence>
                  {!otpSuccessMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden w-full"
                    >
                      <div className="flex flex-col gap-[12px] items-start w-full mb-[24px]">
                        {otpCountdown > 0 ? (
                          <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] tracking-[0.1px]">
                            Resend Code in <span className="font-bold">00:{otpCountdown.toString().padStart(2, '0')}</span>
                          </p>
                        ) : (
                          <button
                            onClick={() => setOtpCountdown(15)}
                            className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[16px] underline hover:text-[var(--Text-Primary-Text-brand)] transition-colors"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Buttons Removed */}
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div
            key="zoom-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute inset-0 z-[100] bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px] rounded-[32px]"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div
            key="zoom-modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full z-[110] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)]"
          >
            {/* Drag Handle */}
            <div className="flex justify-center mb-[16px] shrink-0">
              <div className="w-[64px] h-[8px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[4px]" />
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between px-[16px] mb-[16px] shrink-0">
              <div className="w-[48px]" />
              <h3 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[20px] leading-[28px] tracking-[-0.2px]">
                {modalPlatform === "custom-link" ? "Paste your link" : "Paste your Zoom link"}
              </h3>
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
              >
                <CloseIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] mb-[16px] shrink-0" />

            {/* Content */}
            <div className="w-full flex flex-col px-[16px]">
              <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px] mb-[24px]">
                {modalPlatform === "custom-link" 
                  ? "Paste the link to your preferred meeting platform below." 
                  : "Create a new meeting in your Zoom app and paste the invite link below."}
              </p>

              <div
                className={`w-full h-[56px] bg-[var(--Surface-Primary-Background)] flex flex-col justify-center px-[16px] cursor-text transition-all duration-300 shrink-0 ${
                  isZoomInputActive || zoomLink.length > 0
                    ? "border-2 border-[var(--Text-Primary-Text-brand)] rounded-[16px] shadow-skillbeek-sm"
                    : "border-[1.5px] border-[var(--Button-Primary-Stroke-Stroke-default)] rounded-[16px] shadow-skillbeek-xs hover:border-[var(--Text-Primary-Text-brand)]"
                }`}
                onClick={() => {
                  setIsZoomInputActive(true);
                  setTimeout(() => zoomInputRef.current?.focus(), 50);
                }}
              >
                {isZoomInputActive || zoomLink.length > 0 ? (
                  // Active State Input layout
                  <div className="flex flex-col h-full justify-center w-full relative">
                    <span className="font-['Nunito'] font-normal text-[13px] leading-[18px] tracking-[0.0769em] text-[var(--Text-Primary-Subtitle)]">
                      {modalPlatform === "custom-link" ? "Meeting link" : "Zoom invite link"}
                    </span>
                    <div className="flex items-center justify-between w-full relative">
                      <input
                        ref={zoomInputRef}
                        id={zoomInputId}
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        value={zoomLink}
                        onChange={(e) => setZoomLink(e.target.value)}
                        onBlur={() => setIsZoomInputActive(false)}
                        className="w-full outline-none font-['Nunito'] font-medium text-[16px] leading-[24px] bg-transparent text-[var(--Text-Primary-heading-1)] pr-[16px] rounded-[4px]"
                      />
                    </div>
                  </div>
                ) : (
                  // Inactive State Input layout
                  <div className="flex items-center h-full">
                    <span className="font-['Nunito'] font-normal text-[var(--Text-Primary-Subtitle)] text-[16px] leading-[24px] tracking-[0px]">
                      {modalPlatform === "custom-link" ? "Meeting link" : "Zoom invite link"}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full flex items-center justify-between pt-[24px] shrink-0">
                <button
                  onClick={() => { setZoomLink(""); setIsZoomInputActive(false); }}
                  className="h-[48px] px-[0px] flex items-center justify-center"
                >
                  <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] underline">
                    Clear all
                  </span>
                </button>
                <button
                  onClick={() => setIsZoomModalOpen(false)}
                  disabled={zoomLink.trim() === ""}
                  className={`h-[48px] px-[16px] min-w-[101px] rounded-[16px] flex items-center justify-center transition-colors ${
                    zoomLink.trim() !== ""
                      ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] cursor-pointer"
                      : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
                  }`}
                >
                  <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">Apply</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Google Meet Wait Screen */}
      <AnimatePresence>
        {isGeneratingMeet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-[var(--Surface-Primary-Background)] flex flex-col items-center justify-center rounded-[32px] backdrop-blur-[4px]"
          >
            <div className="w-12 h-12 border-4 border-[var(--Button-Primary-Stroke-Stroke-default)] border-t-[var(--Text-Primary-Text-brand)] rounded-full animate-spin mb-4" />
            <h2 className="font-['Nunito'] font-bold text-[20px] text-[var(--Text-Primary-heading-1)]">Generating Google Meet Link...</h2>
            <p className="font-['Nunito'] font-medium text-[16px] text-[var(--Text-Primary-Body)] mt-2 text-center px-8">
              Please wait while we securely connect to Google Calendar to set up your meeting.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <SuccessToast
        isVisible={showCopyToast}
        message="Link copied to clipboard"
        onClose={() => setShowCopyToast(false)}
        className="absolute bottom-[144px] left-[16px] w-[calc(100%-32px)] z-10 pointer-events-auto"
      />
    </div>
  );
}
