import React from "react";
import { CloseIcon } from "../../../components/common/Icons";

interface GlobalAddTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  onToggleTag: (tag: string) => void;
  onApply: () => void;
  onClear: () => void;
  tagInput: string;
  setTagInput: (val: string) => void;
  onTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  footerActions?: React.ReactNode;
  zIndex?: number;
}

export function GlobalAddTagsModal({
  isOpen,
  onClose,
  tags,
  onToggleTag,
  onApply,
  onClear,
  tagInput,
  setTagInput,
  onTagInputKeyDown,
  footerActions,
  zIndex = 550,
}: GlobalAddTagsModalProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-[var(--Surface-UI-surface-Background)]/[0.15] backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-t-[24px] flex flex-col pt-[8px] pb-[44px] transition-transform duration-300 ${
          isOpen ? "translate-y-0 ease-out" : "translate-y-full ease-in"
        }`}
        style={{ zIndex: zIndex + 10 }}
      >
        <div className="w-full flex flex-col items-center gap-[24px]">
          {/* Header Section */}
          <div className="w-full px-[16px] flex flex-col gap-[16px] items-center">
            {/* Drag Handle */}
            <div className="w-[64px] h-[8px] bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[4px]" />

            <div className="w-full flex items-center justify-between relative h-[24px]">
              <div className="flex-1 flex justify-center">
                <h3 className="font-['Nunito'] font-bold text-[20px] leading-[28px] text-[var(--Text-Primary-heading-1)] tracking-[-0.2px]">
                  Add tags
                </h3>
              </div>
              <button
                onClick={onClose}
                className="absolute right-0 w-[24px] h-[24px] flex items-center justify-center"
              >
                <CloseIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-heading-1)]" />
              </button>
            </div>

            <div className="w-full h-px bg-[var(--Surface-UI-surface-Surface-Universal-Hover)]" />

            <p className="font-['Nunito'] font-medium text-[16px] leading-[24px] text-[var(--Text-Primary-Body)] text-center px-[16px]">
              Add up to 5 specific tags to help others discover you. Separate each with a comma.
            </p>
          </div>

          {/* Tags Section */}
          <div className="w-full px-[16px] flex flex-col gap-[24px]">
            {/* Input field */}
            <div className="w-full bg-[var(--Surface-UI-surface-surface-elevated)] rounded-[12px] shadow-[0px_4px_12px_rgba(18,9,0,0.15)] px-[12px] py-[16px]">
              <input
                type="text"
                placeholder="wireframing, prototyping,"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={onTagInputKeyDown}
                className="w-full bg-transparent border-none outline-none font-['Nunito'] font-medium text-[16px] leading-[24px] text-[var(--Text-Primary-heading-1)] placeholder-[#a09da3]"
              />
            </div>

            {/* User-added tags as chips */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-[12px]">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => onToggleTag(tag)}
                    className="flex items-center gap-[12px] px-[12px] py-[12px] rounded-[12px] bg-[var(--Mapped-Surface-UI-surface-surface-variant)] cursor-pointer transition-all duration-200 active:scale-95"
                  >
                    <span className="font-['Nunito'] font-semibold text-[14px] leading-[20px] text-[var(--Text-Primary-Text-brand)] tracking-[1px]">
                      {tag}
                    </span>
                    <CloseIcon className="w-[24px] h-[24px] text-[var(--Text-Primary-Text-brand)]" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {footerActions ? (
            footerActions
          ) : (
            <div className="w-full flex items-center justify-between px-[16px] mt-[12px]">
              <button
                onClick={onClear}
                className="font-['Nunito'] font-bold text-[16px] leading-[24px] text-[var(--Text-Primary-Body)] underline px-[16px] py-[12px]"
              >
                Clear all
              </button>
              <button
                onClick={onApply}
                disabled={tags.length === 0}
                className={`flex items-center justify-center px-[16px] py-[12px] rounded-[16px] min-w-[101px] h-[48px] font-['Nunito'] font-bold text-[16px] transition-colors ${
                  tags.length > 0
                    ? "bg-[var(--Surface-UI-surface-Surface-Universal-alternate)] text-[var(--Text-Primary-Body-alt)]"
                    : "bg-[var(--Button-Primary-Surface-disabled)] text-[var(--Text-Primary-Disabled)] cursor-not-allowed"
                }`}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
