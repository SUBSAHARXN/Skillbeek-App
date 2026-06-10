import React, { useState, useMemo } from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";
import { SearchIcon } from "../../../components/common/Icons";
import { CustomAnimatedRadioButton } from "../../../components/common/CustomAnimatedRadioButton";

interface TimezoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTimezone: string;
  onSelect: (tz: string) => void;
}

// Curated alias map: iana → extra search keywords (cities, countries, abbreviations)
const TIMEZONE_ALIASES: Record<string, string[]> = {
  "Africa/Abidjan":        ["ivory coast", "côte d'ivoire", "abidjan"],
  "Africa/Accra":          ["ghana", "accra"],
  "Africa/Addis_Ababa":    ["ethiopia", "addis ababa"],
  "Africa/Algiers":        ["algeria", "algiers"],
  "Africa/Cairo":          ["egypt", "cairo", "eet"],
  "Africa/Casablanca":     ["morocco", "casablanca"],
  "Africa/Dar_es_Salaam":  ["tanzania", "dar es salaam"],
  "Africa/Johannesburg":   ["south africa", "johannesburg", "cape town", "durban", "sast"],
  "Africa/Kampala":        ["uganda", "kampala"],
  "Africa/Khartoum":       ["sudan", "khartoum"],
  "Africa/Kinshasa":       ["congo", "kinshasa", "drc"],
  "Africa/Lagos":          ["nigeria", "lagos", "abuja", "kano", "port harcourt", "calabar", "wat"],
  "Africa/Lusaka":         ["zambia", "lusaka"],
  "Africa/Nairobi":        ["kenya", "nairobi", "eat"],
  "Africa/Tripoli":        ["libya", "tripoli"],
  "Africa/Tunis":          ["tunisia", "tunis"],
  "America/Anchorage":     ["alaska", "anchorage"],
  "America/Bogota":        ["colombia", "bogota"],
  "America/Buenos_Aires":  ["argentina", "buenos aires"],
  "America/Caracas":       ["venezuela", "caracas"],
  "America/Chicago":       ["central time", "chicago", "dallas", "houston", "cst", "cdt"],
  "America/Denver":        ["mountain time", "denver", "phoenix", "mst", "mdt"],
  "America/Lima":          ["peru", "lima"],
  "America/Los_Angeles":   ["pacific time", "los angeles", "san francisco", "seattle", "pst", "pdt"],
  "America/Mexico_City":   ["mexico", "mexico city", "guadalajara"],
  "America/New_York":      ["eastern time", "new york", "miami", "boston", "washington", "est", "edt"],
  "America/Sao_Paulo":     ["brazil", "sao paulo", "brt"],
  "America/Toronto":       ["canada", "toronto", "montreal", "est"],
  "America/Vancouver":     ["canada", "vancouver", "pst"],
  "Asia/Bangkok":          ["thailand", "bangkok", "ict"],
  "Asia/Colombo":          ["sri lanka", "colombo"],
  "Asia/Dhaka":            ["bangladesh", "dhaka"],
  "Asia/Dubai":            ["uae", "dubai", "abu dhabi", "gulf", "gst"],
  "Asia/Hong_Kong":        ["hong kong", "hkt"],
  "Asia/Jakarta":          ["indonesia", "jakarta", "wib"],
  "Asia/Jerusalem":        ["israel", "jerusalem", "tel aviv"],
  "Asia/Karachi":          ["pakistan", "karachi", "islamabad", "pkt"],
  "Asia/Kolkata":          ["india", "kolkata", "mumbai", "delhi", "bangalore", "chennai", "ist"],
  "Asia/Kuala_Lumpur":     ["malaysia", "kuala lumpur", "myt"],
  "Asia/Manila":           ["philippines", "manila", "pht"],
  "Asia/Riyadh":           ["saudi arabia", "riyadh", "ast"],
  "Asia/Seoul":            ["south korea", "seoul", "kst"],
  "Asia/Shanghai":         ["china", "shanghai", "beijing", "cst"],
  "Asia/Singapore":        ["singapore", "sgt"],
  "Asia/Taipei":           ["taiwan", "taipei"],
  "Asia/Tokyo":            ["japan", "tokyo", "jst"],
  "Australia/Melbourne":   ["australia", "melbourne", "aest"],
  "Australia/Perth":       ["australia", "perth", "awst"],
  "Australia/Sydney":      ["australia", "sydney", "aest", "aedt"],
  "Europe/Amsterdam":      ["netherlands", "amsterdam", "cet"],
  "Europe/Berlin":         ["germany", "berlin", "cet"],
  "Europe/Brussels":       ["belgium", "brussels", "cet"],
  "Europe/Bucharest":      ["romania", "bucharest"],
  "Europe/Istanbul":       ["turkey", "istanbul", "ankara"],
  "Europe/Kiev":           ["ukraine", "kyiv", "kiev"],
  "Europe/Lisbon":         ["portugal", "lisbon"],
  "Europe/London":         ["uk", "united kingdom", "england", "london", "scotland", "ireland", "gmt", "bst"],
  "Europe/Madrid":         ["spain", "madrid", "barcelona"],
  "Europe/Moscow":         ["russia", "moscow", "msk"],
  "Europe/Paris":          ["france", "paris", "cet"],
  "Europe/Rome":           ["italy", "rome", "milan"],
  "Europe/Warsaw":         ["poland", "warsaw"],
  "Europe/Zurich":         ["switzerland", "zurich", "geneva"],
  "Pacific/Auckland":      ["new zealand", "auckland", "nzst"],
  "UTC":                   ["utc", "gmt", "coordinated universal time"],
};

// Auto-keywords added to every timezone based on its IANA region prefix
const REGION_KEYWORDS: Record<string, string[]> = {
  "Africa":      ["africa"],
  "America":     ["america", "usa", "united states", "us", "north america", "south america", "latin america"],
  "Antarctica":  ["antarctica"],
  "Arctic":      ["arctic"],
  "Asia":        ["asia"],
  "Atlantic":    ["atlantic"],
  "Australia":   ["australia", "au", "oceania"],
  "Europe":      ["europe", "eu"],
  "Indian":      ["indian", "indian ocean"],
  "Pacific":     ["pacific", "oceania"],
  "UTC":         ["utc", "gmt"],
};

// Country → all its IANA zones: ensures "china", "russia" etc. match ALL their timezones
const COUNTRY_TIMEZONES: Array<{ keywords: string[]; zones: string[] }> = [
  {
    keywords: ["china", "prc", "chinese"],
    zones: ["Asia/Shanghai", "Asia/Urumqi", "Asia/Chongqing", "Asia/Harbin", "Asia/Kashgar", "Asia/Hong_Kong", "Asia/Macau"],
  },
  {
    keywords: ["russia", "russian federation"],
    zones: [
      "Europe/Moscow", "Europe/Kaliningrad", "Europe/Samara", "Europe/Volgograd",
      "Europe/Saratov", "Europe/Ulyanovsk", "Europe/Kirov", "Europe/Astrakhan",
      "Asia/Yekaterinburg", "Asia/Omsk", "Asia/Novosibirsk", "Asia/Barnaul",
      "Asia/Tomsk", "Asia/Novokuznetsk", "Asia/Krasnoyarsk", "Asia/Irkutsk",
      "Asia/Chita", "Asia/Yakutsk", "Asia/Khandyga", "Asia/Vladivostok",
      "Asia/Ust-Nera", "Asia/Magadan", "Asia/Sakhalin", "Asia/Srednekolymsk",
      "Asia/Kamchatka", "Asia/Anadyr",
    ],
  },
  {
    keywords: ["indonesia", "indonesian"],
    zones: ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "Asia/Pontianak"],
  },
  {
    keywords: ["brazil", "brasil", "brazilian"],
    zones: [
      "America/Sao_Paulo", "America/Manaus", "America/Belem", "America/Fortaleza",
      "America/Recife", "America/Maceio", "America/Santarem", "America/Campo_Grande",
      "America/Cuiaba", "America/Porto_Velho", "America/Boa_Vista",
      "America/Rio_Branco", "America/Eirunepe", "America/Noronha",
    ],
  },
  {
    keywords: ["australia", "australian"],
    zones: [
      "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane",
      "Australia/Adelaide", "Australia/Perth", "Australia/Darwin",
      "Australia/Hobart", "Australia/Lord_Howe", "Australia/Lindeman",
      "Australia/Eucla", "Australia/Broken_Hill",
    ],
  },
  {
    keywords: ["canada", "canadian"],
    zones: [
      "America/Toronto", "America/Vancouver", "America/Winnipeg", "America/Edmonton",
      "America/Halifax", "America/Regina", "America/St_Johns", "America/Whitehorse",
      "America/Yellowknife", "America/Creston", "America/Dawson", "America/Dawson_Creek",
      "America/Fort_Nelson", "America/Glace_Bay", "America/Goose_Bay", "America/Iqaluit",
      "America/Moncton", "America/Nipigon", "America/Pangnirtung", "America/Rainy_River",
      "America/Rankin_Inlet", "America/Resolute", "America/Thunder_Bay",
    ],
  },
  {
    keywords: ["mexico", "mexican"],
    zones: [
      "America/Mexico_City", "America/Cancun", "America/Merida", "America/Monterrey",
      "America/Chihuahua", "America/Hermosillo", "America/Mazatlan",
      "America/Bahia_Banderas", "America/Tijuana", "America/Matamoros",
      "America/Ojinaga", "America/Santa_Isabel",
    ],
  },
  {
    keywords: ["united states", "usa", "us"],
    zones: [
      "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
      "America/Phoenix", "America/Anchorage", "America/Adak", "America/Detroit",
      "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo",
      "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay",
      "America/Indiana/Vincennes", "America/Indiana/Winamac",
      "America/Kentucky/Louisville", "America/Kentucky/Monticello",
      "America/North_Dakota/Beulah", "America/North_Dakota/Center",
      "America/North_Dakota/New_Salem", "Pacific/Honolulu",
    ],
  },
  {
    keywords: ["ukraine", "ukrainian"],
    zones: ["Europe/Kiev", "Europe/Uzhgorod", "Europe/Zaporozhye"],
  },
  {
    keywords: ["spain", "spanish"],
    zones: ["Europe/Madrid", "Africa/Ceuta", "Atlantic/Canary"],
  },
  {
    keywords: ["portugal", "portuguese"],
    zones: ["Europe/Lisbon", "Atlantic/Azores", "Atlantic/Madeira"],
  },
  {
    keywords: ["france", "french"],
    zones: ["Europe/Paris", "America/Cayenne", "Indian/Reunion", "Pacific/Noumea", "Pacific/Tahiti"],
  },
  {
    keywords: ["new zealand", "nz", "kiwi"],
    zones: ["Pacific/Auckland", "Pacific/Chatham"],
  },
  {
    keywords: ["ecuador"],
    zones: ["America/Guayaquil", "Pacific/Galapagos"],
  },
  {
    keywords: ["chile", "chilean"],
    zones: ["America/Santiago", "Pacific/Easter"],
  },
  {
    keywords: ["mongolia", "mongolian"],
    zones: ["Asia/Ulaanbaatar", "Asia/Hovd", "Asia/Choibalsan"],
  },
  {
    keywords: ["kazakhstan", "kazakh"],
    zones: ["Asia/Almaty", "Asia/Qostanay", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Atyrau", "Asia/Oral", "Asia/Qyzylorda"],
  },
];

// Pre-build a lookup: zone → extra country keywords
function buildCountryKeywordMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  COUNTRY_TIMEZONES.forEach(({ keywords, zones }) => {
    zones.forEach((zone) => {
      if (!map[zone]) map[zone] = [];
      map[zone].push(...keywords);
    });
  });
  return map;
}

const COUNTRY_KEYWORD_MAP = buildCountryKeywordMap();

// Build enriched searchable timezone list from IANA + curated aliases + region keywords
function buildSearchableTimezones() {
  let raw: string[];
  try {
    raw = Intl.supportedValuesOf("timeZone");
  } catch {
    raw = ["UTC"];
  }

  return raw.map((iana) => {
    const region = iana.split("/")[0];
    const cityLabel = iana.split("/").slice(1).join(" ").replace(/_/g, " ");
    const curatedAliases = TIMEZONE_ALIASES[iana] || [];
    const regionKeywords = REGION_KEYWORDS[region] || [];
    const countryKeywords = COUNTRY_KEYWORD_MAP[iana] || [];

    // searchIndex = IANA path + city label + curated aliases + region keywords + country keywords
    const searchIndex = [
      iana.toLowerCase().replace(/_/g, " "),
      cityLabel.toLowerCase(),
      ...curatedAliases,
      ...regionKeywords,
      ...countryKeywords,
    ].join(" ");

    return {
      value: iana,
      label: cityLabel || iana,
      region,
      searchIndex,
    };
  });
}

export function TimezoneModal({ isOpen, onClose, selectedTimezone, onSelect }: TimezoneModalProps) {
  const [search, setSearch] = useState("");

  const searchableTimezones = useMemo(() => buildSearchableTimezones(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return searchableTimezones;
    // Split query into words — ALL words must appear in searchIndex (AND logic)
    // e.g. "united states" → ["united", "states"] → both must match
    const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return searchableTimezones.filter((tz) =>
      words.every((word) => tz.searchIndex.includes(word))
    );
  }, [searchableTimezones, search]);

  // Group by region
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach((tz) => {
      if (!groups[tz.region]) groups[tz.region] = [];
      groups[tz.region].push(tz);
    });
    return groups;
  }, [filtered]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Edit Timezone" style={{ maxHeight: "90%" }}>
      {/* Description */}
      <div className="px-[16px] w-full text-center mb-[16px] shrink-0">
        <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Body)] text-[16px] leading-[24px] tracking-[0.1px]">
          Search for your city or timezone to ensure your availability schedule is perfectly accurate.
        </p>
      </div>

      {/* Search Field — same px-[16px] as list, shadow only (no border) */}
      <div className="px-[16px] w-full mb-[24px] shrink-0">
        <div className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] rounded-[12px] px-[12px] py-[16px] flex items-center">
          <SearchIcon className="w-[20px] h-[20px] text-[var(--Text-Primary-Text-placeholder)] mr-[8px] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cities, countries, or timezones..."
            className="w-full bg-transparent outline-none font-['Nunito'] font-medium text-[var(--Text-Primary-heading-1)] text-[16px] placeholder:text-[var(--Text-Primary-Text-placeholder)]"
          />
        </div>
      </div>

      {/* List — same px-[16px] as search */}
      <div className="w-full flex-1 overflow-y-auto px-[16px]">
        {Object.entries(grouped).map(([region, tzs]) => (
          <div key={region} className="mb-[24px]">
            <h4 className="font-['Nunito'] font-bold text-[var(--Text-Primary-Subtitle)] text-[14px] leading-[20px] tracking-[1px] uppercase mb-[8px]">
              {region}
            </h4>
            <div className="flex flex-col gap-[6px]">
              {tzs.map((tz) => {
                const isSelected = tz.value === selectedTimezone;
                return (
                  <div
                    key={tz.value}
                    onClick={() => onSelect(tz.value)}
                    className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] shadow-[0px_1px_1.5px_rgba(18,9,0,0.1)] flex items-center justify-between px-[12px] py-[8px] rounded-[12px] cursor-pointer hover:bg-[var(--Surface-UI-surface-surface-elevated)] transition-colors"
                  >
                    <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px]">
                      {tz.label}
                    </span>
                    <CustomAnimatedRadioButton checked={isSelected} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Text-placeholder)] text-[16px] text-center mt-[32px]">
            No results for "{search}"
          </p>
        )}
      </div>
    </BottomSheet>
  );
}
