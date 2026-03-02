"use client";

import { useCallback } from "react";

const COPIED_RESET_MS = 1500;

/**
 * Returns a function that copies text to clipboard and flips a "copied" state for COPIED_RESET_MS.
 * Pass your setState so the button can show "Copied!" then revert.
 */
export function useCopyToClipboard() {
  return useCallback(async (text: string, setCopied: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      // ignore
    }
  }, []);
}
