import React, { useState, useEffect } from "react";
import { SessionSetupData } from "./SessionSetupView";
import { ChevronLeftIcon, CalendarIcon } from "../../components/common/Icons";
import { PersonaPfpSet } from "../../components/common/PersonaPfpSet";
import { NeumorphicDivider } from "../../components/common/NeumorphicDivider";
import { AddToCalendarModal } from "./AddToCalendarModal";

interface LiveSessionRoomViewProps {
  sessionData: SessionSetupData | null;
  meetingLink?: string;
  onLeave: () => void;
}

export function LiveSessionRoomView({ sessionData, meetingLink, onLeave }: LiveSessionRoomViewProps) {
  const [activeMeetingLink, setActiveMeetingLink] = useState<string | null>(meetingLink || null);
  const [now, setNow] = useState(Date.now());
  const [hasEnded, setHasEnded] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate exact start and end times
  const { startTimeMs, endTimeMs } = React.useMemo(() => {
    if (!sessionData || !sessionData.availability) return { startTimeMs: 0, endTimeMs: 0 };
    
    const slot = sessionData.availability.specificSlots?.[0];
    if (!slot) return { startTimeMs: 0, endTimeMs: 0 };

    const date = new Date(slot.dateRange.start);
    
    // Parse time
    const parseTime = (t: string) => {
      const [time, ampm] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return { h, m };
    };

    const startT = parseTime(slot.timeRange.start);
    
    const s = new Date(date);
    s.setHours(startT.h, startT.m, 0, 0);
    
    const startMs = s.getTime();
    const endMs = startMs + (sessionData.duration * 60000);

    return { startTimeMs: startMs, endTimeMs: endMs };
  }, [sessionData]);

  useEffect(() => {
    if (startTimeMs > 0 && now >= endTimeMs) {
      setHasEnded(true);
    }
  }, [now, startTimeMs, endTimeMs]);

  // Polling for Jitsi Link 5 seconds before start
  useEffect(() => {
    if (!startTimeMs) return;
    const FIFTEEN_MINS_MS = 15 * 60 * 1000;
    if (now < startTimeMs - FIFTEEN_MINS_MS) return; // only start polling 15m before
    if (activeMeetingLink) return; // stop if we already have it
    
    const poll = setInterval(async () => {
      try {
        // MOCK BACKEND POLLING:
        console.log("Mock Polling API for Meet Link...");
        setActiveMeetingLink("https://meet.google.com/abc-defg-hij");
        clearInterval(poll);
      } catch (err) {
        console.error("Failed to fetch meeting link");
      }
    }, 1000);

    return () => clearInterval(poll);
  }, [now, startTimeMs, activeMeetingLink]);

  // Format countdown
  const getRemainingTime = (target: number) => {
    const diff = Math.max(0, target - now);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (d > 0 || h > 0) parts.push(`${h}h`);
    if (d > 0 || h > 0 || m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    
    return parts.join(' ');
  };

  if (!sessionData) return null;
  if (!startTimeMs) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)]">
        Invalid session data.
        <button onClick={onLeave} className="mt-4 px-4 py-2 bg-[var(--Surface-Primary-Background)] text-[var(--Text-Primary-heading-1)] rounded-full">Go Back</button>
      </div>
    );
  }

  if (hasEnded) {
    return (
      <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden flex flex-col items-center justify-center mx-auto shadow-2xl relative p-[24px]">
        <h2 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] mb-[16px]">Session Ended</h2>
        <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-Caption)] text-center mb-[32px]">
          The scheduled time for this session has concluded. We hope it was a productive chat!
        </p>
        <button
          onClick={onLeave}
          className="h-[56px] w-full max-w-[200px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[99px] text-[var(--Text-Primary-Body-alt)] font-['Nunito'] font-bold text-[18px]"
        >
          Return Home
        </button>
      </div>
    );
  }

  const FIFTEEN_MINS_MS = 15 * 60 * 1000;
  const isLive = now >= (startTimeMs - FIFTEEN_MINS_MS) && now < endTimeMs && activeMeetingLink !== null;

  // Formatting date and time for new layout
  const sessionDateObj = new Date(startTimeMs);
  const sessionDateStr = sessionDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const sessionTimeStr = sessionDateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (isLive) {
    const isGoogleMeet = activeMeetingLink?.includes("meet.google.com");

    if (isGoogleMeet) {
      return (
        <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px] overflow-hidden flex flex-col relative mx-auto shadow-2xl items-center justify-center p-[24px]">
          {/* Top UI Overlay */}
          <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-[16px]">
            <button onClick={onLeave} className="text-[var(--Text-Primary-Title-alt)] bg-[var(--Text-Information-primary-darker)]/50 px-4 py-2 rounded-full font-semibold hover:bg-[var(--Text-Information-primary-darker)]/70 transition-colors">
              Leave
            </button>
            <div className="bg-red-500 text-[var(--Text-Primary-Title-alt)] px-4 py-2 rounded-full font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-[var(--Surface-Primary-Background)] rounded-full animate-pulse" />
              {getRemainingTime(endTimeMs)}
            </div>
          </div>
          
          <h2 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] mb-[32px]">Session is Live</h2>
          <button
            onClick={() => window.open(activeMeetingLink!, '_blank')}
            className="w-full max-w-[280px] bg-[#00832D] hover:bg-[#006f26] transition-colors rounded-[32px] h-[56px] flex items-center justify-center gap-[8px] font-['Nunito'] font-bold text-white text-[18px]"
          >
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
            Join via Google Meet
          </button>
          <p className="mt-[24px] text-[var(--Text-Primary-Body)] text-[14px] font-['Nunito'] text-center px-[16px]">
            Google Meet will open in a new browser window.
          </p>
        </div>
      );
    }

    // Default Jitsi Iframe Render
    return (
      <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px] overflow-hidden flex flex-col relative mx-auto shadow-2xl">
        {/* Top UI Overlay */}
        <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-[16px] bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={onLeave} className="text-[var(--Text-Primary-Title-alt)] bg-[var(--Text-Information-primary-darker)]/50 px-4 py-2 rounded-full font-semibold">
            Leave
          </button>
          <div className="bg-red-500 text-[var(--Text-Primary-Title-alt)] px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--Surface-Primary-Background)] rounded-full animate-pulse" />
            {getRemainingTime(endTimeMs)}
          </div>
        </div>
        <iframe
          src={activeMeetingLink || ""}
          className="w-full h-full border-none"
          allow="camera; microphone; display-capture; autoplay"
          title="Live Session"
        />
      </div>
    );
  }

  // --- New Wait Screen Layout ---
  return (
    <main
      className="dark bg-[var(--Surface-UI-surface-Surface)] w-full max-w-[384px] h-[812px] flex flex-col mx-auto rounded-[32px] overflow-hidden shadow-2xl relative"
      data-mapped-colour-styles-mode="dark"
    >
      <header className="flex w-full h-14 relative flex-col items-center justify-center pt-3 pb-0 px-0">
        <div className="flex items-center justify-center gap-9 px-4 py-0 relative flex-1 self-stretch w-full grow">
          <div
            className="relative w-[140px] h-9 bg-[var(--Surface-Primary-Background)] rounded-[32px]"
            aria-hidden="true"
          />
        </div>
      </header>
      <section
        className="flex w-full h-full relative flex-col items-center gap-[60px] px-4 py-0"
        aria-label="Upcoming session details"
      >
        <div className="flex flex-col w-full max-w-[352px] items-center gap-4 relative flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-6 pt-4 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center gap-2 px-0 py-2 relative self-stretch w-full flex-[0_0_auto]">
              <button
                type="button"
                aria-label="Go back"
                onClick={onLeave}
                className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[var(--Surface-UI-surface-Surface-Universal-Hover)] transition-colors cursor-pointer"
              >
                <ChevronLeftIcon className="w-[20px] h-[20px] text-[var(--Text-Primary-heading-1)] stroke-[2.5px]" />
              </button>
            </div>
            <div className="flex flex-col w-full items-center gap-token-24 relative flex-[0_0_auto]">
              <div className="flex-col justify-center gap-token-12 w-full flex-[0_0_auto] flex items-center relative self-stretch">
                <p className="justify-center mt-[-1.00px] text-Subtitle text-[var(--Text-Primary-Caption-alt)] flex items-center relative self-stretch text-center">
                  Session starts in
                </p>
                <div className="flex-col gap-[var(--Gap-Width-Height-12)] w-full flex-[0_0_auto] flex items-center relative self-stretch">
                  <h1 className="mt-[-1.00px] text-[var(--Text-Primary-heading-1)] text-D3 relative self-stretch text-center tabular-nums">
                    {getRemainingTime(startTimeMs)}
                  </h1>
                  <div className="inline-flex items-center justify-center gap-token-6 relative flex-[0_0_auto] w-full">
                    <time
                      className="relative flex items-center justify-center w-fit mt-[-1.00px] text-Subtitle text-[var(--Text-Primary-Caption)] whitespace-nowrap"
                    >
                      {sessionDateStr}
                    </time>
                    <div 
                      className="relative w-[2px] h-3 rounded-full overflow-hidden bg-[var(--Surface-UI-surface-Surface)] mx-1" 
                      style={{ boxShadow: "var(--Neumorphic-Divider-Shadow)" }}
                      aria-hidden="true" 
                    />
                    <time
                      className="relative flex items-center justify-center w-fit mt-[-1.00px] text-Subtitle text-[var(--Text-Primary-Caption)] whitespace-nowrap"
                    >
                      {sessionTimeStr}
                    </time>
                  </div>
                </div>
              </div>
              <div className="flex-col gap-token-24 w-full flex-[0_0_auto] flex items-center relative self-stretch">
                <div className="flex flex-col items-center gap-token-12 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="justify-center mt-[-1.00px] text-Subtitle text-[var(--Text-Primary-Caption)] flex items-center relative self-stretch text-center">
                    UPCOMING SESSION
                  </p>
                  <h2 className="text-[var(--Text-Primary-heading-1)] text-H3 relative self-stretch text-center">
                    {sessionData.title}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col w-[148px] items-center gap-token-16 relative flex-[0_0_auto]">
                <div
                  className="relative w-[75px] h-10"
                  aria-label="Session hosts"
                >
                  {[
                    { id: "03", name: "Isabella", leftClass: "left-0", zClass: "z-10" },
                    { id: "04", name: "Lena", leftClass: "left-[26px]", zClass: "z-0" }
                  ].map(host => (
                    <div key={host.id} className={`absolute top-0 ${host.leftClass} ${host.zClass}`}>
                      <PersonaPfpSet persona={host.id as any} className="w-10 h-10 flex border-2 border-[var(--Surface-UI-surface-Surface)]" />
                    </div>
                  ))}
                </div>
                <p className="flex items-center justify-center text-[var(--Text-Primary-Text-brand)] text-base tracking-[1.00px] leading-6 relative self-stretch font-bold text-center">
                  {[
                    { id: "03", name: "Isabella" },
                    { id: "04", name: "Lena" }
                  ].map((host, index, arr) => (
                    <React.Fragment key={host.id}>
                      <button
                        type="button"
                        className="hover:underline cursor-pointer focus:outline-none"
                        onClick={() => {
                          // TODO: Open person modal for host.id
                          console.log(`Open modal for ${host.name}`);
                        }}
                        aria-label={`View ${host.name}'s profile`}
                      >
                        {host.name}
                      </button>
                      {index < arr.length - 1 && <span className="mx-1">and</span>}
                    </React.Fragment>
                  ))}
                </p>
              </div>
              <div className="flex-col gap-token-24 self-stretch w-full flex-[0_0_auto] flex items-center relative">
                <NeumorphicDivider className="!my-0 w-full" />
                <button
                  type="button"
                  onClick={() => setIsCalendarModalOpen(true)}
                  className="dark h-12 justify-center gap-[var(--Gap-Width-Height-6)] px-4 py-3 self-stretch w-full bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-2xl shadow-XS flex items-center relative cursor-pointer active:scale-95 transition-transform duration-150"
                  data-mapped-colour-styles-mode="dark"
                  aria-label="Add session to calendar"
                >
                  <span className="inline-flex items-center justify-center gap-token-6 relative flex-[0_0_auto]">
                    <CalendarIcon className="!relative !w-6 !h-6 !aspect-[1] text-[var(--Text-Primary-Body-alt)]" />
                    <span className="justify-center w-fit mt-[-1.00px] text-[var(--Text-Primary-Body-alt)] font-bold text-Paragraph text-center whitespace-nowrap flex items-center relative">
                      Add to Calendar
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex flex-col w-full max-w-[352px] items-center gap-token-24 relative flex-[0_0_auto] mt-auto pb-[96px]">
          <div className="flex flex-col items-center gap-token-12 relative self-stretch w-full flex-[0_0_auto]">
            <p className="mt-[-1.00px] text-[var(--Text-Primary-Caption-alt)] text-Subtitle relative self-stretch text-center">
              You will be notified when the room opens. No need to keep
              <br />
              this screen open
            </p>
          </div>
        </footer>
      </section>

      {/* Add To Calendar Modal */}
      <AddToCalendarModal 
        isOpen={isCalendarModalOpen} 
        onClose={() => setIsCalendarModalOpen(false)} 
        sessionDetails={{
          title: sessionData.title,
          startTimeMs,
          endTimeMs,
          jitsiLink: activeMeetingLink || window.location.href,
          description: sessionData.description,
          timezone: sessionData.availability?.timezone
        }}
      />
    </main>
  );
}
