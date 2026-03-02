"use client";

import { useState } from "react";
import Image from "next/image";
import TabX from "./components/TabX";
import TabIG from "./components/TabIG";
import TabTikTok from "./components/TabTikTok";
import TabFacebook from "./components/TabFacebook";
import DownloadImages from "./components/DownloadImages";
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
        {/* Tabs: X | IG | TikTok | Facebook — with platform icons */}
        <div className="flex rounded-lg border border-indigo-400/30 bg-indigo-900/40 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("x")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "x"
                ? "bg-white text-gray-900 shadow"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            aria-label="X (Twitter)"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Twitter</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ig")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "ig"
                ? "bg-white text-gray-900 shadow"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Instagram"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>IG</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tiktok")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "tiktok"
                ? "bg-white text-gray-900 shadow"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            aria-label="TikTok"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            <span>TikTok</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("facebook")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "facebook"
                ? "bg-white text-gray-900 shadow"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Facebook"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>FB</span>
          </button>
        </div>

        {activeTab === "x" && <TabX category={category} />}
        {activeTab === "ig" && <TabIG category={category} />}
        {activeTab === "tiktok" && <TabTikTok category={category} />}
        {activeTab === "facebook" && <TabFacebook category={category} />}
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
