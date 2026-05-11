import React from "react";

export function NeumorphicDivider({ className }: { className?: string }) {
  return (
    <div className={`w-full flex items-center justify-center my-[16px] ${className || ""}`}>
      <div
        className="w-full h-[2px] rounded-full bg-[#fbf6ff]"
        style={{ boxShadow: "inset 2px 2px 12px rgba(192, 188, 195, 0.5), inset -2px -2px 12px rgba(255, 255, 255, 0.9)" }}
      />
    </div>
  );
}
