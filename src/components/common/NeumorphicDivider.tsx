import React from "react";

export function NeumorphicDivider({ className }: { className?: string }) {
  return (
    <div className={`w-full flex items-center justify-center my-[16px] ${className || ""}`}>
      <div
        className="w-full h-[2px] rounded-full overflow-hidden bg-[var(--Surface-Primary-Background)]"
        style={{ boxShadow: "var(--Neumorphic-Divider-Shadow)" }}
      />
    </div>
  );
}
