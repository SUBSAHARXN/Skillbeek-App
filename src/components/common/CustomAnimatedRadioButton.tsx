import React from "react";

interface CustomAnimatedRadioButtonProps {
  checked: boolean;
}

export function CustomAnimatedRadioButton({ checked }: CustomAnimatedRadioButtonProps) {
  return (
    <div
      className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shrink-0 pointer-events-none ${
        checked
          ? "border-[2px] border-[#171519]"
          : "bg-transparent border-[1.5px] border-[#c0bcc3]"
      }`}
    >
      {/* Inner Dot */}
      <div
        className={`w-[12px] h-[12px] rounded-full bg-[#171519] transition-all duration-300 ease-in-out ${
          checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
    </div>
  );
}
