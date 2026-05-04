import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "../../../components/common/Icons";

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-[#2f2c32]/[0.26] backdrop-blur-[4px] rounded-[32px]"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full z-50 bg-[#faf7fe] rounded-t-[24px] pb-[44px] pt-[8px] flex flex-col shadow-[0px_-10px_30px_rgba(0,0,0,0.1)] select-none"
            style={{ maxHeight: "85%" }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center mb-[16px] shrink-0">
              <div className="w-[64px] h-[8px] bg-[#f0edf4] rounded-[4px]" />
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between px-[16px] shrink-0">
              {/* Spacer to center the title */}
              <div className="w-[48px]" />
              <h3 className="font-['Nunito'] font-bold text-[#171519] text-[20px] leading-[28px] tracking-[-0.2px]">
                {label}
              </h3>
              <button
                onClick={onClose}
                className="w-[48px] h-[48px] flex items-center justify-center rounded-[32px] hover:bg-[#f0edf4] transition-colors"
              >
                <CloseIcon className="w-[24px] h-[24px] text-[#171519]" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#e0dce3] mt-[8px] mb-[24px] shrink-0" />

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
                className="w-full font-['Nunito'] font-bold text-[#171519] text-[24px] leading-[32px] tracking-[-0.7px] bg-transparent border-none outline-none resize-none placeholder:text-[#c0bcc3]"
                placeholder={`Enter your ${label.toLowerCase()}…`}
                rows={label === "Topic" ? 3 : 6}
              />
              {/* Character counter */}
              <p className="font-['Nunito'] text-[14px] leading-[20px] tracking-[1px]">
                <span className={`font-bold ${isAtLimit ? "text-[#b85f38]" : "text-[#171519]"}`}>
                  {remaining}
                </span>
                <span className="font-medium text-[#2f2c32]"> characters available</span>
              </p>
            </div>

            {/* Footer */}
            <div className="w-full flex items-center justify-between px-[16px] pt-[24px] shrink-0">
              <button
                onClick={handleClearAll}
                className="h-[48px] px-[16px] flex items-center justify-center"
              >
                <span className="font-['Nunito'] font-bold text-[#a09da3] text-[16px] leading-[24px] underline">
                  Clear all
                </span>
              </button>
              <button
                onClick={handleUpdate}
                className={`h-[48px] px-[16px] w-[101px] rounded-[16px] flex items-center justify-center transition-colors ${
                  canUpdate
                    ? "bg-[#171519] text-[#fbf6ff] hover:bg-[#2f2c32] shadow-[0px_1px_3px_rgba(18,9,0,0.1)]"
                    : "bg-[#f0edf4] text-[#a09da3] cursor-not-allowed"
                }`}
              >
                <span className="font-['Nunito'] font-bold text-[16px] leading-[24px]">Update</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
