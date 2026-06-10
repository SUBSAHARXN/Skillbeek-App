import React from "react";
import { motion } from "framer-motion";
import { EmailMessageIcon, PhoneIcon, WhatsAppIcon, ChevronRightIcon } from "../../components/common/Icons";

export function OTPMethodView({ 
  email, 
  onBack, 
  discardedMethods = [],
  onSelectMethod 
}: { 
  email: string; 
  onBack?: () => void;
  discardedMethods?: string[];
  onSelectMethod?: (method: string) => void;
}) {

  return (
    <div className="w-full max-w-[384px] h-[812px] bg-[var(--Surface-Primary-Background)] rounded-[32px] overflow-hidden relative flex flex-col mx-auto shadow-2xl">
      {/* Top Status Bar Placeholder (mocked) */}
      <div className="w-full h-[56px] flex items-center justify-center pt-[12px] shrink-0">
        <div className="w-[140px] h-[36px] bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] rounded-[32px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-[16px] pb-[40px] flex flex-col items-center">
        {/* Back Button / Top Area */}
        <div className="w-full pt-[8px] pb-[12px] flex justify-start shrink-0">
          <button onClick={onBack} className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-gray-100 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="#171519" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Text Headers */}
        <div className="w-full flex flex-col items-start gap-[16px] mb-[44px]">
          <h1 className="font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[28px] leading-[32px] tracking-[0px]">
            Confirm it's You
          </h1>
          <p className="font-['Nunito'] font-medium text-[var(--Text-Primary-heading-1)] text-[16px] leading-[24px] tracking-[0.1px]">
            Choose how You will like us to send Your code
          </p>
        </div>

        {/* Selection Cards */}
        <div className="w-full flex flex-col gap-[16px]">
          
          {!discardedMethods.includes("Email") && (
            <button onClick={() => onSelectMethod?.("Email")} className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[16px] flex items-center gap-[16px] shadow-skillbeek-xs hover:shadow-skillbeek-sm transition-shadow group">
              <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0 text-[var(--Text-Primary-heading-1)]">
                <EmailMessageIcon className="w-[18px] h-[18px] stroke-2" />
              </div>
              <div className="flex-1 flex flex-col items-start justify-center">
                <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px] tracking-[1px]">
                  Email
                </span>
              </div>
              <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0 text-[var(--Text-Primary-heading-1)] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ChevronRightIcon className="w-[16px] h-[16px]" />
              </div>
            </button>
          )}

          {!discardedMethods.includes("Phone Call") && (
            <button onClick={() => onSelectMethod?.("Phone Call")} className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[16px] flex items-center gap-[16px] shadow-skillbeek-xs hover:shadow-skillbeek-sm transition-shadow group">
              <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0 text-[var(--Text-Primary-heading-1)]">
                <PhoneIcon className="w-[18px] h-[18px] stroke-2" />
              </div>
              <div className="flex-1 flex flex-col items-start justify-center">
                <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px] tracking-[1px]">
                  Phone Call
                </span>
              </div>
              <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0 text-[var(--Text-Primary-heading-1)] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ChevronRightIcon className="w-[16px] h-[16px]" />
              </div>
            </button>
          )}

          {!discardedMethods.includes("WhatsApp") && (
            <button onClick={() => onSelectMethod?.("WhatsApp")} className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[16px] p-[16px] flex items-center gap-[16px] shadow-skillbeek-xs hover:shadow-skillbeek-sm transition-shadow group">
              <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0 text-[var(--Text-Primary-heading-1)]">
                <WhatsAppIcon className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1 flex flex-col items-start justify-center">
                <span className="font-['Nunito'] font-semibold text-[var(--Text-Primary-heading-3)] text-[16px] leading-[24px] tracking-[1px]">
                  WhatsApp
                </span>
              </div>
              <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0 text-[var(--Text-Primary-heading-1)] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ChevronRightIcon className="w-[16px] h-[16px]" />
              </div>
            </button>
          )}

        </div>

      </div>
      
      {/* Bottom Home Indicator */}
      <div className="absolute bottom-0 w-full h-[34px] flex items-center justify-center pb-[8px]">
        <div className="w-[144px] h-[5px] bg-[var(--Text-Primary-Caption-alt)] rounded-[100px]"></div>
      </div>
    </div>
  );
}
