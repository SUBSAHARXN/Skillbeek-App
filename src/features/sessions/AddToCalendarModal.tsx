import React from "react";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { Button } from "../../components/ui/Button";
import { CloseIcon, GoogleCalendarIcon, MicrosoftCalendarIcon, AppleCalendarIcon, ChevronRightIcon } from "../../components/common/Icons";

export interface SessionDetails {
  title: string;
  startTimeMs: number;
  endTimeMs: number;
  jitsiLink: string;
  description?: string;
  timezone?: string;
}

interface AddToCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionDetails?: SessionDetails;
}

type CalendarOption = "google" | "microsoft" | "apple";

export function AddToCalendarModal({ isOpen, onClose, sessionDetails }: AddToCalendarModalProps) {
  const options = [
    { id: "google" as CalendarOption, label: "Google Calendar", Icon: GoogleCalendarIcon },
    { id: "microsoft" as CalendarOption, label: "Microsoft Calendar", Icon: MicrosoftCalendarIcon },
    { id: "apple" as CalendarOption, label: "Apple Calendar", Icon: AppleCalendarIcon },
  ];

  const handleOptionClick = (optionId: CalendarOption) => {
    if (!sessionDetails) return;
    const { title, startTimeMs, endTimeMs, jitsiLink, description, timezone } = sessionDetails;
    
    const formatDate = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const startStr = formatDate(startTimeMs);
    const endStr = formatDate(endTimeMs);
    
    const formatOutlook = (ms: number) => new Date(ms).toISOString().split('.')[0] + 'Z';
    const outStart = formatOutlook(startTimeMs);
    const outEnd = formatOutlook(endTimeMs);
    
    const fullDescription = (description ? description + '\n\n' : '') + `Join here: ${jitsiLink}`;
    const encodedTitle = encodeURIComponent(title);
    const encodedDetails = encodeURIComponent(fullDescription);
    const timezoneParam = timezone ? `&ctz=${encodeURIComponent(timezone)}` : '';
    
    if (optionId === "google") {
       const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startStr}/${endStr}&details=${encodedDetails}${timezoneParam}`;
      window.open(url, '_blank');
    } else if (optionId === "microsoft") {
      const url = `https://outlook.live.com/calendar/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodedTitle}&startdt=${outStart}&enddt=${outEnd}&body=${encodedDetails}`;
      window.open(url, '_blank');
    } else if (optionId === "apple") {
      const icsDescription = fullDescription.replace(/\n/g, '\\n');
      const ics = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART:${startStr}\nDTEND:${endStr}\nSUMMARY:${title}\nDESCRIPTION:${icsDescription}\nEND:VEVENT\nEND:VCALENDAR`;
      const blob = new Blob([ics], {type:'text/calendar'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'session.ics';
      a.click();
    }
    onClose();
  };

  return (
    <div data-mapped-colour-styles-mode="dark" className="contents dark">
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Add to Calendar"
        zIndex={50}
        className="bg-[var(--Surface-UI-surface-Surface)] rounded-t-[32px]"
      >
        <div className="w-full flex flex-col px-[24px] pb-[32px] text-white">
          {/* Options */}
          <div className="flex flex-col gap-3 mb-8">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className="flex items-center w-full bg-[var(--Mapped-Surface-UI-surface-surface-elevated)] hover:bg-[var(--Mapped-Surface-Primary-Surface-Universal-Hover)] transition-all duration-150 active:scale-[0.99] rounded-[16px] p-4 cursor-pointer"
              >
                <option.Icon className="w-6 h-6 mr-4 flex-shrink-0" />
                <span className="font-['Nunito'] text-[var(--Mapped-Text-Primary-heading-1)] text-[18px] font-medium tracking-[0.1px] flex-1 text-left">
                  {option.label}
                </span>
                <ChevronRightIcon className="w-[20px] h-[20px] text-[var(--Mapped-Text-Primary-Subtitle)]" />
              </button>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="w-full flex items-center justify-center pt-[8px]">
            <Button
              variant="primary"
              className="w-full bg-[var(--Mapped-Surface-UI-surface-surface-elevated)] hover:bg-[var(--Mapped-Surface-Primary-Surface-Universal-Hover)] text-[var(--Mapped-Text-Primary-heading-1)] border-0"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
