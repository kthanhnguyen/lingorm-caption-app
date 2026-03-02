"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import TabX from "./components/TabX";
import TabIG from "./components/TabIG";
import TabTikTok from "./components/TabTikTok";
import TabFacebook from "./components/TabFacebook";
import DownloadImages from "./components/DownloadImages";
import { CARD_CLASS } from "./components/shared";
import type { Category } from "./types";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "lingorm", label: "LingOrm" },
  { value: "ling", label: "Ling" },
  { value: "orm", label: "Orm" },
];

export default function Home() {
  const [category, setCategory] = useState<Category>("lingorm");
  const [mainPage, setMainPage] = useState<"generate" | "download">("generate");
  const [activeTab, setActiveTab] = useState<"x" | "ig" | "tiktok" | "facebook">("x");
  const [caption, setCaption] = useState("");
  const [captionLoading, setCaptionLoading] = useState(false);
  const [captionError, setCaptionError] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const generateCaption = useCallback(async () => {
    setCaptionLoading(true);
    setCaptionError(null);
    try {
      const res = await fetch(`/api/generate?category=${category}`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCaptionError("Could not load caption. Try again.");
        setCaption("");
        return;
      }
      setCaption(typeof data?.caption === "string" ? data.caption : "");
    } catch {
      setCaptionError("Network error. Check connection and try again.");
      setCaption("");
    } finally {
      setCaptionLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (mainPage !== "generate") return;
    generateCaption();
  }, [mainPage, category, generateCaption]);

  const copyCaption = async () => {
    if (!caption) return;
    try {
      await navigator.clipboard.writeText(caption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-3">
        {/* Logo — outside tabs */}
        <div>
          <div className="flex justify-center">
            <Image
              src="/images/logo_vbots.png"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
          <p className="text-center text-xl uppercase tracking-[0.2em] mt-2">
            <a
              href="https://x.com/LingOrm_Vbots"
              target="_blank"
              className="text-white font-bold"
            >
              LingOrm_Vbots
            </a>
          </p>
        </div>

        {/* Category select: LingOrm | Ling | Orm — content follows selection */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category-select" className="text-xs uppercase tracking-wider text-white/70">
            Category
          </label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm font-medium text-white focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            aria-label="Select category"
          >
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value} className="bg-gray-900 text-white">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Main menu: Generate | Download images — content follows category */}
        <nav className="flex border-b border-white/20" aria-label="Main">
          <button
            type="button"
            onClick={() => setMainPage("generate")}
            className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              mainPage === "generate"
                ? "border-white text-white"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Generate
          </button>
          <button
            type="button"
            onClick={() => setMainPage("download")}
            className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              mainPage === "download"
                ? "border-white text-white"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Download images
          </button>
        </nav>

        {mainPage === "download" && <DownloadImages category={category} />}

        {mainPage === "generate" && (
          <>
        {/* Shared caption by category — all platforms use this */}
        <div className={CARD_CLASS}>
          <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
            Caption
          </div>
          <div className="h-35 min-h-[80px] rounded-lg border border-gray-200/70 bg-background/80 p-4 text-md leading-relaxed shadow-sm overflow-y-auto text-gray-500">
            {captionLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gray-500">
                <div
                  className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"
                  aria-hidden="true"
                />
                <span>Generating caption...</span>
              </div>
            ) : captionError ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-sm">
                <span className="text-red-400">{captionError}</span>
                <button
                  type="button"
                  onClick={generateCaption}
                  className="rounded-md border border-gray-300 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  Retry
                </button>
              </div>
            ) : caption ? (
              caption
            ) : (
              <span className="text-sm text-gray-400">
                Caption will appear here after generation.
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={generateCaption}
              disabled={captionLoading}
              className="flex-1 inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {captionLoading ? (
                <>
                  <span
                    className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
                    aria-hidden="true"
                  />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </button>
            <button
              type="button"
              disabled={!caption || captionLoading}
              onClick={copyCaption}
              className="flex-1 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="mr-2 inline-flex h-4 w-4 items-center justify-center text-gray-500">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <rect x="9" y="9" width="11" height="13" rx="2" className="fill-current" opacity="0.9" />
                  <rect x="4" y="4" width="11" height="13" rx="2" className="fill-current" opacity="0.5" />
                </svg>
              </span>
              {copiedCaption ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Platform: choose where to copy caption + tags */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/90">
              Platform
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/50">
              Caption + tags per platform
            </span>
          </div>
          <div
            className="flex rounded-xl border border-indigo-400/30 bg-indigo-950/50 p-1.5 gap-1"
            role="tablist"
            aria-label="Select platform"
          >
            {[
              {
                id: "x" as const,
                label: "X",
                fullLabel: "X (Twitter)",
                icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
              {
                id: "ig" as const,
                label: "IG",
                fullLabel: "Instagram",
                icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                ),
              },
              {
                id: "tiktok" as const,
                label: "TikTok",
                fullLabel: "TikTok",
                icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                ),
              },
              {
                id: "facebook" as const,
                label: "FB",
                fullLabel: "Facebook",
                icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                ),
              },
            ].map(({ id, label, fullLabel, icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                aria-label={fullLabel}
                onClick={() => setActiveTab(id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-white text-gray-900 shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === "x" && (
          <TabX
            category={category}
            caption={caption}
            captionLoading={captionLoading}
            captionError={captionError}
            onGenerateCaption={generateCaption}
          />
        )}
        {activeTab === "ig" && <TabIG category={category} caption={caption} />}
        {activeTab === "tiktok" && <TabTikTok category={category} caption={caption} />}
        {activeTab === "facebook" && <TabFacebook category={category} caption={caption} />}
          </>
        )}

        {/* Footer — outside tabs */}
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white">
          Create by Z
        </p>
      </div>
    </main>
  );
}
