import React, { useId, useState, useRef, useMemo } from "react";
import { AsYouType, isValidPhoneNumber } from "libphonenumber-js/max";
import { getCountryCallingCode, getCountries } from "react-phone-number-input/max";
import "react-phone-number-input/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { OfferProgressBar } from "../offers/components/OfferProgressBar";
import { ChevronDownIcon, ChevronUpIcon, CloseIcon, PencilIcon, PhoneIcon, SearchIcon, ErrorIcon, CopyIcon } from "../../components/common/Icons";
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
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#F0EDF4"/>
    <path d="M16 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11Z" fill="#A09DA3"/>
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
    optional: false,
    options: [
      {
        id: "preferred-google-meet",
        label: "Google Meet (Default)",
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
        id: "preferred-jitsi",
        label: "Jitsi",
        value: "jitsi",
        icon: "jitsi",
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
    defaultValue: "google-meet",
  },
  {
    id: "fallback-platform",
    title: "Fallback Platform (optional)",
    optional: true,
    options: [
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
        id: "fallback-jitsi",
        label: "Jitsi",
        value: "jitsi",
        icon: "jitsi",
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
      <div className="inline-flex items-center justify-center gap-2 px-3 h-full bg-[#f0edf4] hover:bg-[#e0dce3] transition-colors relative self-stretch">
        {Icon ? <Icon country={value} label={value} className="!w-6 !h-6" /> : <Flags countryCode={(value || "ng").toLowerCase()} className="!w-6 !h-6" />}
        <ChevronDownIcon className="w-6 h-6 shrink-0 !aspect-[1]" />
      </div>
    </div>
  );
};

export function SessionPlatformView({ onBack, onNext, onSaveExit, onQuestions }: SessionPlatformViewProps) {
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
  const [zoomLink, setZoomLink] = useState("");
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

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[#fbf6ff] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[#171519] rounded-[32px]"></div>
      </div>

      {/* Header Actions */}
      <div className="w-full px-[16px] flex justify-between items-center py-[16px] shrink-0 bg-[#fbf6ff] z-20">
        <button
          onClick={onSaveExit}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors bg-white"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">Save and Exit</span>
        </button>
        <button
          onClick={onQuestions}
          className="h-[44px] px-[16px] border-2 border-[#c0bcc3] hover:border-[#656268] active:border-[#171519] rounded-[99px] flex items-center justify-center transition-colors bg-white"
        >
          <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px]">Questions?</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 w-full flex flex-col relative pt-[0px] overflow-y-auto availability-scrollbar pb-[156px]">
        {/* Title Content */}
        <div className="w-full px-[16px] flex flex-col gap-[32px] mb-[24px]">
          {/* Header Texts */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center gap-[8px]">
              <h1 className="font-['Nunito'] font-bold text-[#171519] text-[28px] leading-[36px] tracking-[-1.2px]">
                Plan Your Session
              </h1>
              <InfoIconButton
                onClick={() => setIsInfoOpen(true)}
                label="Platform Info"
              />
            </div>
            <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px]">
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
                  <legend className="font-['Nunito'] font-bold text-[#656268] text-[14px] leading-[20px] tracking-[1px] mb-[8px]">
                    {group.title}
                  </legend>
                  {selectedOption.value === "phone-call" && !isGroupActive ? (
                    <div 
                      onClick={() => {
                        setIsEnteringNewNumber(false);
                        setIsPhoneModalOpen(true);
                      }}
                      className="flex flex-col items-center justify-center gap-4 p-4 relative w-full bg-[#faf7fe] rounded-[24px] shadow-SM border border-transparent hover:border-[#e0dce3] transition-colors cursor-pointer"
                    >
                      <section className="flex items-center gap-[138px] p-3 w-full bg-[#f8efff] rounded-xl relative">
                        <div className="flex items-start gap-3">
                          <PlatformIcon icon={selectedOption.icon} />
                          <div className="flex flex-col items-start justify-center gap-2">
                            <h1 className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px] mt-[-1px]">
                              {selectedOption.label}
                            </h1>
                            <p className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[32px] tracking-[-0.70px] m-0">
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
                          className="w-full flex items-center justify-center gap-1.5 p-3 rounded-2xl cursor-pointer hover:bg-[#f0edf4] transition-colors"
                        >
                          <PencilIcon className="w-6 h-6 text-[#2f2c32]" />
                          <span className="font-['Nunito'] font-bold text-[#2f2c32] text-[16px] leading-[24px] underline mt-[-1px]">
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
                          className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-[#b7812f] hover:bg-[#9a6a23] transition-colors rounded-2xl cursor-pointer"
                        >
                          <PhoneIcon className="w-6 h-6 text-[#f9f4ee]" />
                          <span className="font-['Nunito'] font-bold text-[#f9f4ee] text-[16px] leading-[24px] tracking-[0.16px] mt-[-1px]">
                            Change Number
                          </span>
                        </button>
                      </section>
                    </div>
                  ) : selectedOption.value === "zoom" && !isGroupActive && zoomLink ? (
                    <div 
                      onClick={() => setIsZoomModalOpen(true)}
                      className="flex flex-col items-center justify-center gap-4 p-4 relative w-full bg-[#faf7fe] rounded-[24px] shadow-SM border border-transparent hover:border-[#e0dce3] transition-colors cursor-pointer"
                    >
                      <article
                        className="flex items-stretch relative w-full bg-[#f6f8ff] rounded-[12px] overflow-hidden min-h-[72px]"
                        aria-label="Meeting link card"
                      >
                        <div className="flex items-center justify-center w-[56px] bg-[#edf2ff] shrink-0">
                          <PlatformIcon icon={selectedOption.icon} />
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 flex-1 min-w-0">
                          <div className="flex flex-col items-start justify-center gap-1 min-w-0 flex-1">
                            <h1 className="font-['Nunito'] font-bold text-[#000010] text-[16px] tracking-[1.0px] leading-[24px] truncate w-full">
                              Zoom meeting
                            </h1>
                            <a
                              href={zoomLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="font-['Nunito'] font-medium text-[#737076] text-[14px] tracking-[1.0px] leading-[20px] truncate max-w-[152px] hover:underline block"
                            >
                              {zoomLink}
                            </a>
                          </div>
                          <button
                            type="button"
                            className="flex items-center justify-center p-2 rounded-lg hover:bg-[#e2e8f0] transition-colors shrink-0 ml-2 bg-white"
                            aria-label="Copy meeting link"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(zoomLink);
                              setShowCopyToast(true);
                            }}
                          >
                            <CopyIcon className="w-5 h-5 text-[#000010]" />
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
                          className="w-full flex items-center justify-center gap-1.5 p-3 rounded-2xl cursor-pointer hover:bg-[#f0edf4] transition-colors"
                        >
                          <PencilIcon className="w-6 h-6 text-[#2f2c32]" />
                          <span className="font-['Nunito'] font-bold text-[#2f2c32] text-[16px] leading-[24px] underline mt-[-1px]">
                            Change Platform
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsZoomModalOpen(true);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-[#b7812f] hover:bg-[#9a6a23] transition-colors rounded-2xl cursor-pointer"
                        >
                          <CustomLinkIcon stroke="var(--stroke-alternate)" />
                          <span className="font-['Nunito'] font-bold text-[#f9f4ee] text-[16px] leading-[24px] tracking-[0.16px] mt-[-1px]">
                            Change Link
                          </span>
                        </button>
                      </section>
                    </div>
                  ) : (
                    <div
                      onClick={() => setActiveGroup(isGroupActive ? null : group.id)}
                      className={`flex items-center justify-between px-[16px] py-[24px] bg-[#faf7fe] rounded-[12px] shadow-SM cursor-pointer border transition-colors relative ${isGroupActive ? "border-[#e0dce3]" : "border-transparent hover:border-[#e0dce3]"
                        }`}
                    >
                      <div className="flex items-center gap-[12px]">
                        <PlatformIcon icon={selectedOption.icon} />
                        <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px]">
                          {selectedOption.label}
                        </span>
                      </div>
                      {isGroupActive ? (
                        <ChevronUpIcon className="w-[24px] h-[24px] text-[#49464c]" />
                      ) : (
                        <ChevronDownIcon className="w-[24px] h-[24px] text-[#49464c]" />
                      )}
                    </div>
                  )}

                  {/* Removed inline dropdown menu - moved to Modal below */}
                </fieldset>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[#faf7fe] shadow-[0px_-12px_24px_rgba(18,9,0,0.02),0px_-12px_12px_rgba(18,9,0,0.04)] flex flex-col items-center gap-[32px] pt-[0px] pb-[44px] z-20">
        <div className="w-full flex justify-center">
          <OfferProgressBar currentStep={1} subStepProgress={75} />
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
            disabled={!isNextEnabled}
            className={`font-['Nunito'] font-bold text-[16px] leading-[24px] px-[16px] py-[12px] rounded-[16px] w-[101px] h-[48px] transition-all ${isNextEnabled
                ? "bg-[#171519] text-[#fbf6ff] cursor-pointer hover:bg-[#2f2c32]"
                : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px] z-30 pointer-events-none">
        <div className="w-[144px] h-[5px] bg-[#c0bcc3] rounded-[100px]"></div>
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
              className="absolute inset-0 z-40 bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
            />

            {/* Modal Content */}
            <motion.div
              key="modal"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full z-50 bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col items-center shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] select-none"
            >
              {/* Drag Handle */}
              <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />

              {(() => {
                const group = platformGroups.find((g) => g.id === activeGroup);
                if (!group) return null;

                return (
                  <>
                    {/* Header */}
                    <div className="w-full flex items-center justify-between px-[16px] mb-[16px]">
                      <div className="w-[48px]" />
                      <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px] text-center">
                        {group.title.replace(" (optional)", "")}
                      </h3>
                      <button
                        onClick={() => setActiveGroup(null)}
                        className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors"
                      >
                        <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
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
                          className="w-full bg-[#faf7fe] flex items-center justify-between px-[16px] py-[12px] min-h-[56px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer"
                        >
                          <div className="flex items-center gap-[12px]">
                            <PlatformIcon icon="none" />
                            <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px]">
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
                              handlePlatformChange(group.id, option.value);
                              setActiveGroup(null);
                              if (option.value === "phone-call") {
                                setIsEnteringNewNumber(false);
                                setIsPhoneModalOpen(true);
                              }
                              if (option.value === "zoom") {
                                setIsZoomModalOpen(true);
                              }
                            }}
                            className="w-full bg-[#faf7fe] flex items-center justify-between px-[16px] py-[12px] min-h-[56px] rounded-[12px] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] cursor-pointer"
                          >
                            <div className="flex items-center gap-[12px]">
                              <PlatformIcon icon={option.icon} />
                              <span className="font-['Nunito'] font-semibold text-[#171519] text-[16px] leading-[24px]">
                                {option.label}
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
            className="absolute inset-0 z-40 bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
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
              className="absolute bottom-0 left-0 w-full z-50 bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col items-center shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] select-none"
            >
              {/* Drag Handle */}
              <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px] mb-[16px]" />

              {/* Header */}
              <div className="w-full flex items-center justify-between px-[16px] mb-[16px]">
                <div className="w-[48px]" />
                <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px] text-center">
                  {isEnteringNewNumber 
                    ? "Enter your phone number" 
                    : selectedPhoneId ? "Your Contact Number" : "Select Your Number"}
                </h3>
                <button
                  onClick={() => {
                    setIsPhoneModalOpen(false);
                    setIsEnteringNewNumber(false);
                  }}
                  className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors"
                >
                  <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
                </button>
              </div>

              {/* Divider */}
              <NeumorphicDivider className="px-[16px]" />

              {/* Content */}
              <div className="w-full flex flex-col gap-[16px] px-[16px]">
                <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] text-center">
                  Your partner will use this number to call you at the scheduled time.
                </p>

                {isEnteringNewNumber ? (
                  <>
                    <div className={`flex items-stretch relative self-stretch w-full flex-[0_0_auto] bg-[#faf7fe] rounded-xl border-2 border-solid mt-[8px] overflow-hidden transition-colors ${
                      phoneDuplicateError ? "border-[#870113]" : "border-[#b7812f]"
                    }`}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setCountrySearch("");
                          setIsCountryModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-3 relative self-stretch flex-[0_0_auto] bg-[#f0edf4] hover:bg-[#e0dce3] transition-colors cursor-pointer"
                      >
                        <Flags countryCode={selectedCountryCode.toLowerCase()} className="!relative !w-6 !h-6 shrink-0" />
                        <ChevronDownIcon className="w-6 h-6 shrink-0 !aspect-[1]" />
                      </div>
                      <div className="flex flex-col items-start gap-1 px-3 py-2 relative flex-1 grow justify-center">
                        <label
                          htmlFor={inputId}
                          className="relative flex items-center self-stretch mt-[-1.00px] font-['Nunito'] font-semibold text-[#737076] text-xs tracking-[1.10px] leading-4"
                        >
                          Phone number
                        </label>
                        <div className="flex items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                          <div className="font-['Nunito'] font-semibold text-[#a09da3] relative flex items-center w-fit mt-[-1.00px] text-base tracking-[0] leading-6 whitespace-nowrap">
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
                              className="flex-1 min-w-0 h-6 font-['Nunito'] font-medium text-[#49464c] text-base tracking-[0] leading-6 bg-transparent outline-none caret-[#171519] placeholder:text-transparent p-0 w-full"
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
                            <span className="font-['Nunito'] font-medium leading-[20px] text-[12px] tracking-[0.5px] text-[#870113]">
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
                        <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px] leading-[24px] underline">
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
                            ? "bg-[#171519] text-[#fbf6ff] hover:bg-[#2f2c32] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] cursor-pointer"
                            : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
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
                              ? "border-[#b7812f] bg-[#fdfaf5]"
                              : "border-[#e0dce3] bg-[#faf7fe] hover:border-[#b7812f]"
                          }`}
                        >
                          <div className="flex items-center gap-[12px]">
                            <div className="w-[40px] h-[40px] rounded-[12px] bg-[#f0edf4] flex items-center justify-center">
                              <PhoneIcon className="w-[20px] h-[20px] text-[#2f2c32]" />
                            </div>
                            <span className="font-['Nunito'] font-bold text-[#171519] text-[16px] leading-[24px]">
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
                      <span className="font-['Nunito'] font-bold text-[#153094] text-[16px] leading-[24px]">
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
              className="absolute inset-0 z-[80] bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full z-[90] bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] h-[90%]"
            >
              {/* Drag Handle */}
              <div className="flex justify-center mb-[16px] shrink-0">
                <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px]" />
              </div>

              {/* Header */}
              <div className="w-full flex items-center justify-between px-[16px] mb-[16px] shrink-0">
                <div className="w-[48px]" />
                <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                  Search Country
                </h3>
                <button
                  onClick={() => {
                    setIsCountryModalOpen(false);
                    setCountrySearch("");
                  }}
                  className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors"
                >
                  <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
                </button>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#e0dce3] mb-[16px] shrink-0" />

              {/* Description */}
              <div className="px-[16px] w-full text-center mb-[16px] shrink-0">
                <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px]">
                  Search for your city or timezone to ensure your availability schedule is perfectly accurate.
                </p>
              </div>

              {/* Search Field */}
              <div className="px-[16px] w-full mb-[24px] shrink-0">
                <div className="w-full bg-[#faf7fe] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] rounded-[12px] px-[12px] py-[16px] flex items-center">
                  <SearchIcon className="w-[20px] h-[20px] text-[#a09da3] mr-[8px] shrink-0" />
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search cities or countries..."
                    className="w-full bg-transparent outline-none font-['Nunito'] font-medium text-[#171519] text-[16px] placeholder:text-[#a09da3]"
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
                        className="w-full bg-[#faf7fe] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] flex items-center justify-between p-[12px] rounded-[12px] cursor-pointer hover:bg-[#f0edf4] transition-colors min-h-[44px]"
                      >
                        <div className="flex items-center gap-[12px]">
                          <Flags countryCode={country.iso.toLowerCase()} className="!w-6 !h-6 shrink-0" />
                          <span className="font-['Nunito'] font-semibold text-[#2f2c32] text-[16px] leading-[24px]">
                            {country.name} ({country.callingCode})
                          </span>
                        </div>
                        <CustomAnimatedRadioButton checked={isSelected} />
                      </div>
                    );
                  })}
                </div>

                {filteredCountries.length === 0 && (
                  <p className="font-['Nunito'] font-medium text-[#a09da3] text-[16px] text-center mt-[32px]">
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
        <div className="w-full bg-[#f9f4ee] rounded-[12px] p-[16px] flex gap-[12px] items-start shadow-xl">
          {/* Content column */}
          <div className="flex-1 flex flex-col pt-[4px]">
            <p className="font-['Nunito'] font-medium text-[16px] leading-[24px] text-[#171519] tracking-[0.2px]">
              We can't auto-generate Zoom links yet. Please schedule the meeting and paste your link.
            </p>
          </div>

          {/* X close button */}
          <button
            onClick={() => setIsInfoOpen(false)}
            className="shrink-0 w-[32px] h-[32px] flex items-center justify-center -mr-[4px] hover:bg-[#eae1d5] rounded-full transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-[16px] h-[16px] text-[#171519]" />
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
            className="absolute inset-0 z-[100] bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
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
              className="absolute bottom-0 left-0 w-full z-[110] bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)]"
            >
              {/* Drag Handle */}
              <div className="flex justify-center mb-[16px] shrink-0">
                <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px]" />
              </div>

              {/* Header */}
              <div className="w-full flex items-center justify-center px-[16px] mb-[16px] shrink-0 relative h-[28px]">
                <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                  Enter your security code
                </h3>
              </div>

              {/* Content */}
              <div className="w-full flex flex-col px-[16px]">
                {/* Divider */}
                <div className="w-full h-[1px] bg-[#e0dce3] mb-[16px] shrink-0" />
                <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px] text-center mb-[24px]">
                  We just sent a 6-digit code to <br />
                  <span className="font-bold text-[#171519]">+{getCountryCallingCode(selectedCountryCode as any)}{" "}{newPhoneNumber}</span> Enter it below.
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
                        className={`w-[44px] h-[48px] bg-[#faf7fe] rounded-[8px] flex items-center justify-center text-center font-['Nunito'] font-semibold text-[28px] focus:outline-none transition-all duration-200 ${
                          otpErrorMsg
                            ? "border-[1.5px] border-[#870113] text-[#870113] focus:ring-2 focus:ring-[#870113] shadow-[0px_1px_2px_rgba(18,9,0,0.1)]"
                            : successIndex !== null && index <= successIndex
                            ? "border-[1.5px] border-[#349024] bg-[#ebf8e9] text-[#171519] shadow-[0px_0px_10px_rgba(52,144,36,0.3)] shadow-skillbeek-xs ring-2 ring-[#349024]"
                            : "border-none text-[#171519] shadow-[0px_1px_2px_rgba(18,9,0,0.1)] focus:ring-2 focus:ring-[#b7812f]"
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
                              ? 'text-[12px] tracking-[0.5px] text-[#870113]' 
                              : 'text-[14px] tracking-[1px] text-[#349024]'
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
                          <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] tracking-[0.1px]">
                            Resend Code in <span className="font-bold">00:{otpCountdown.toString().padStart(2, '0')}</span>
                          </p>
                        ) : (
                          <button
                            onClick={() => setOtpCountdown(15)}
                            className="font-['Nunito'] font-bold text-[#171519] text-[16px] underline hover:text-[#b7812f] transition-colors"
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
            className="absolute inset-0 z-[100] bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
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
            className="absolute bottom-0 left-0 w-full z-[110] bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)]"
          >
            {/* Drag Handle */}
            <div className="flex justify-center mb-[16px] shrink-0">
              <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px]" />
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between px-[16px] mb-[16px] shrink-0">
              <div className="w-[48px]" />
              <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                Paste your Zoom link
              </h3>
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors"
              >
                <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#e0dce3] mb-[16px] shrink-0" />

            {/* Content */}
            <div className="w-full flex flex-col px-[16px]">
              <p className="font-['Nunito'] font-medium text-[#49464c] text-[16px] leading-[24px] tracking-[0.1px] mb-[24px]">
                Create a new meeting in your Zoom app and paste the invite link below.
              </p>

              <div
                className={`w-full h-[56px] bg-[#fbf6ff] flex flex-col justify-center px-[16px] cursor-text transition-all duration-300 shrink-0 ${
                  isZoomInputActive || zoomLink.length > 0
                    ? "border-2 border-[#b7812f] rounded-[16px] shadow-skillbeek-sm"
                    : "border-[1.5px] border-[#c0bcc3] rounded-[16px] shadow-skillbeek-xs hover:border-[#b7812f]"
                }`}
                onClick={() => {
                  setIsZoomInputActive(true);
                  setTimeout(() => zoomInputRef.current?.focus(), 50);
                }}
              >
                {isZoomInputActive || zoomLink.length > 0 ? (
                  // Active State Input layout
                  <div className="flex flex-col h-full justify-center w-full relative">
                    <span className="font-['Nunito'] font-normal text-[13px] leading-[18px] tracking-[0.0769em] text-[#656268]">
                      Zoom invite link
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
                        className="w-full outline-none font-['Nunito'] font-medium text-[16px] leading-[24px] bg-transparent text-[#171519] pr-[16px] rounded-[4px]"
                      />
                    </div>
                  </div>
                ) : (
                  // Inactive State Input layout
                  <div className="flex items-center h-full">
                    <span className="font-['Nunito'] font-normal text-[#656268] text-[16px] leading-[24px] tracking-[0px]">
                      Zoom invite link
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full flex items-center justify-between pt-[24px] shrink-0">
                <button
                  onClick={() => { setZoomLink(""); setIsZoomInputActive(false); }}
                  className="h-[48px] px-[0px] flex items-center justify-center"
                >
                  <span className="font-['Nunito'] font-bold text-[#49464c] text-[16px] leading-[24px] underline">
                    Clear all
                  </span>
                </button>
                <button
                  onClick={() => setIsZoomModalOpen(false)}
                  disabled={zoomLink.trim() === ""}
                  className={`h-[48px] px-[16px] min-w-[101px] rounded-[16px] flex items-center justify-center transition-colors ${
                    zoomLink.trim() !== ""
                      ? "bg-[#171519] text-[#fbf6ff] hover:bg-[#2f2c32] shadow-[0px_1px_3px_rgba(18,9,0,0.1)] cursor-pointer"
                      : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
                  }`}
                >
                  <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">Apply</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SuccessToast
        isVisible={showCopyToast}
        message="Link copied to clipboard"
        onClose={() => setShowCopyToast(false)}
      />
    </div>
  );
}
