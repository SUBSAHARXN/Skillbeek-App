import React from "react";

/**
 * Universal Button component — Single Source of Truth
 *
 * Variants:
 *   • primary  — Brown fill, white text (Next, Apply, Update)
 *   • ghost    — No fill, underlined text (Back, Clear all)
 *   • outline  — Border stroke, transparent fill (Save and Exit, Questions?)
 *
 * Sizes:
 *   • md (default) — h-48, px-16, text-16 (standard footer CTA)
 *   • sm           — h-44, px-16, text-16 (header pill buttons)
 *
 * All props are composable — pass `className` to override anything view-specific.
 */

type ButtonVariant = "primary" | "ghost" | "outline";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Fixed width (e.g. "w-[101px]" for CTA buttons). Pass any Tailwind width class. */
  fullWidth?: boolean;
  /** Extra classes for view-specific overrides */
  className?: string;
  children: React.ReactNode;
}

// ── Variant Styles ──────────────────────────────────────────────────────
const variantStyles: Record<ButtonVariant, { enabled: string; disabled: string }> = {
  primary: {
    enabled: [
      "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)]",
      "text-[var(--Text-Primary-Body-alt)]",
      "hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)]",
      "shadow-[0px_1px_3px_rgba(18,9,0,0.1)]",
      "cursor-pointer",
    ].join(" "),
    disabled: [
      "bg-[var(--Button-Primary-Surface-disabled)]",
      "text-[var(--Text-Primary-Disabled)]",
      "cursor-not-allowed",
    ].join(" "),
  },
  ghost: {
    enabled: [
      "text-[var(--Text-Primary-Body)]",
      "underline",
      "cursor-pointer",
    ].join(" "),
    disabled: [
      "text-[var(--Text-Primary-Disabled)]",
      "underline",
      "cursor-not-allowed",
    ].join(" "),
  },
  outline: {
    enabled: [
      "border-2",
      "border-[var(--Button-Primary-Stroke-Stroke-default)]",
      "hover:border-[var(--Text-Primary-Subtitle)]",
      "active:border-[var(--Button-Primary-Stroke-Stroke-tertiary-default)]",
      "bg-[var(--Surface-Primary-Background)]",
      "text-[var(--Text-Primary-Body)]",
      "cursor-pointer",
    ].join(" "),
    disabled: [
      "border-2",
      "border-[var(--Button-Primary-Stroke-Stroke-secondary-disabled)]",
      "bg-[var(--Button-Primary-Surface-disabled)]",
      "text-[var(--Text-Primary-Disabled)]",
      "cursor-not-allowed",
    ].join(" "),
  },
};

// ── Size Styles ─────────────────────────────────────────────────────────
const sizeStyles: Record<ButtonSize, string> = {
  md: "h-[48px] px-[16px] py-[12px]",
  sm: "h-[44px] px-[16px]",
};

// ── Shared base styles ──────────────────────────────────────────────────
const baseStyles = [
  "font-['Nunito']",
  "font-bold",
  "text-[16px]",
  "leading-[24px]",
  "tracking-[0.16px]",
  "flex",
  "items-center",
  "justify-center",
  "transition-colors",
  "select-none",
].join(" ");

// ── Shape by variant ────────────────────────────────────────────────────
const shapeStyles: Record<ButtonVariant, string> = {
  primary: "rounded-[16px]",
  ghost: "",
  outline: "rounded-[99px]",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const stateStyles = disabled
    ? variantStyles[variant].disabled
    : variantStyles[variant].enabled;

  return (
    <button
      disabled={disabled}
      className={[
        baseStyles,
        sizeStyles[size],
        shapeStyles[variant],
        stateStyles,
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
