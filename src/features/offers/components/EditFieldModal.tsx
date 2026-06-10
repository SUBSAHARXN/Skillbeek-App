import React, { useState, useEffect, useRef } from "react";
import { BottomSheet } from "../../../components/ui/BottomSheet";

interface EditFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (value: string) => void;
  label: string;        // "Topic" | "Offer description"
  initialValue: string;
  maxChars: number;
}

export function EditFieldModal({
  isOpen,
  onClose,
  onUpdate,
  label,
  initialValue,
  maxChars,
}: EditFieldModalProps) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset value when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      // Auto-focus and move cursor to end after animation
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 300);
    }
  }, [isOpen, initialValue]);

  const remaining = maxChars - value.length;
  const isAtLimit = remaining <= 0;
  const hasContent = value.trim().length > 0;
  const canUpdate = hasContent && !isAtLimit;

  const handleUpdate = () => {
    if (!canUpdate) return;
    onUpdate(value.trim());
    onClose();
  };

  const handleClearAll = () => {
    setValue("");
    textareaRef.current?.focus();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={label}>
      {/* Editable Area */}
      <div className="flex-1 px-[16px] overflow-y-auto flex flex-col gap-[12px]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              setValue(e.target.value);
            }
          }}
          className="w-full font-['Nunito'] font-bold text-[var(--Text-Primary-heading-1)] text-[24px] leading-[32px] tracking-[-0.7px] bg-transparent border-none outline-none resize-none placeholder:text-[var(--Text-Primary-Caption-alt)]"
          placeholder={`Enter your ${label.toLowerCase()}…`}
          rows={label === "Topic" ? 3 : 6}
        />
        {/* Character counter */}
        <p className="font-['Nunito'] text-[14px] leading-[20px] tracking-[1px]">
          <span className={`font-bold ${isAtLimit ? "text-[var(--Text-Warning-Text-primary)]" : "text-[var(--Text-Primary-heading-1)]"}`}>
            {remaining}
          </span>
          <span className="font-medium text-[var(--Text-Primary-heading-3)]"> characters available</span>
        </p>
      </div>

      {/* Footer */}
      <div className="w-full flex items-center justify-between px-[16px] pt-[24px] shrink-0">
        <button
          onClick={handleClearAll}
          className="h-[48px] px-[16px] flex items-center justify-center"
        >
          <span className="font-['Nunito'] font-bold text-[var(--Text-Primary-Text-placeholder)] text-[16px] leading-[24px] underline">
            Clear all
          </span>
        </button>
        <button
          onClick={handleUpdate}
          className={`h-[48px] px-[16px] w-[101px] rounded-[16px] flex items-center justify-center transition-colors ${
            canUpdate
              ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)] hover:bg-[var(--Surface-UI-surface-Surface-Universal-alternate-lighter)] shadow-[0px_1px_3px_rgba(18,9,0,0.1)]"
              : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
          }`}
        >
          <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">Update</span>
        </button>
      </div>
    </BottomSheet>
  );
}
