"use client";

import { BTN_COPY_CLASS, BTN_COPY_LARGE_CLASS, BTN_COPY_SMALL_CLASS } from "./styles";

type CopyButtonProps = {
  onCopy: () => void;
  copied: boolean;
  label: string;
  copiedLabel?: string;
  disabled?: boolean;
  size?: "default" | "large" | "small";
  className?: string;
};

const sizeClass = {
  default: BTN_COPY_CLASS,
  large: BTN_COPY_LARGE_CLASS,
  small: BTN_COPY_SMALL_CLASS,
};

export default function CopyButton({
  onCopy,
  copied,
  label,
  copiedLabel = "Copied!",
  disabled,
  size = "default",
  className = "",
}: CopyButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onCopy}
      className={`${sizeClass[size]} ${className}`.trim()}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
