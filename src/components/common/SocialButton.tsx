import React from "react";
import { cn } from "../../lib/utils";
import { GoogleIcon, MicrosoftIcon, FacebookIcon, EmailMessageIcon, PhoneIcon } from "./Icons";

export type SocialProvider = "google" | "microsoft" | "email" | "phone" | "facebook";
export type SocialButtonState = "default" | "disabled" | "active" | "activeHover";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: SocialProvider;
  buttonState?: SocialButtonState;
  onClick?: () => void;
}

export function SocialButton({
  provider,
  buttonState = "default",
  className,
  onClick,
  ...props
}: SocialButtonProps) {
  // Determine provider-specific styling out of the mapping
  const getProviderConfig = () => {
    switch (provider) {
      case "google":
        return { icon: <GoogleIcon className="w-[18px] h-[18px]" />, text: "Continue with Google" };
      case "microsoft":
        return { icon: <MicrosoftIcon className="w-[18px] h-[18px]" />, text: "Continue with Microsoft" };
      case "email":
        return { icon: <EmailMessageIcon className="w-[18px] h-[18px]" />, text: "Continue with Email" };
      case "phone":
        return { icon: <PhoneIcon className="w-[18px] h-[18px]" />, text: "Continue with Phone" };
      case "facebook":
        return { icon: <FacebookIcon className="w-[18px] h-[18px]" />, text: "Facebook" };
      default:
        return { icon: null, text: `Continue with ${provider}` };
    }
  };

  const config = getProviderConfig();

  // Dynamic styling based on state
  const baseClasses =
    "flex items-center justify-start gap-[56px] px-[24px] py-[12px] h-[48px] rounded-[32px] w-full font-['Nunito'] font-bold text-[16px] tracking-[0px] leading-[24px] shadow-skillbeek-xs transition-all duration-300";

  const stateClasses = {
    default:
      "bg-[#fbf6ff] border-[1.5px] border-[#c0bcc3] text-[#171519] cursor-pointer hover:bg-gray-50",
    disabled:
      "bg-[#fbf6ff] border-[1.5px] border-[#a09da3] text-[#a09da3] cursor-not-allowed opacity-70",
    active:
      "bg-[#fbf6ff] border-2 border-[#b7812f] text-[#171519] cursor-pointer",
    activeHover:
      "bg-[#fbf6ff] border-2 border-[#a7721b] text-[#171519] cursor-pointer",
  };

  return (
    <button
      onClick={buttonState !== "disabled" ? onClick : undefined}
      disabled={buttonState === "disabled"}
      className={cn(baseClasses, stateClasses[buttonState], className)}
      {...props}
    >
      <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
        {config.icon}
      </div>
      <span className="whitespace-nowrap">{config.text}</span>
    </button>
  );
}
