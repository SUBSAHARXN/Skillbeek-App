import React from "react";

interface CustomAnimatedCheckboxProps {
  checked: boolean;
  disabled?: boolean; // shows a filled neutral checkbox (already-set state)
}

export function CustomAnimatedCheckbox({ checked, disabled }: CustomAnimatedCheckboxProps) {
  const effectiveChecked = disabled || checked;
  const bgColor = disabled 
    ? "#c0bcc3"       // disabled state fill
    : checked
      ? "#171519"     // active checked
      : "transparent"; // unchecked

  return (
    <div className="w-[44px] h-[44px] p-[10px] relative flex items-center justify-center shrink-0 pointer-events-none">
      <div
        className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: bgColor,
          border: effectiveChecked ? "none" : "1.5px solid #c0bcc3",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px]">
          <polyline
            points="20 6 9 17 4 12"
            stroke="#fbf6ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 ease-in-out"
            style={{
              strokeDasharray: 24,
              strokeDashoffset: effectiveChecked ? 0 : 24,
              opacity: effectiveChecked ? 1 : 0,
            }}
          />
        </svg>
      </div>
    </div>
  );
}
