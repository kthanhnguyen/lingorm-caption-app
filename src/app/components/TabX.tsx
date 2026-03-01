"use client";

import { useEffect, useState } from "react";

const CARD_CLASS =
  "bg-gradient-to-br from-indigo-800 via-indigo-900 to-purple-900 border border-indigo-400/30 shadow-[0_0_35px_rgba(99,102,241,0.4)] rounded-xl text-white p-6";

export default function TabX() {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedBeforeTags, setCopiedBeforeTags] = useState(false);
  const [copiedDuringTags, setCopiedDuringTags] = useState(false);
  const [copiedCaptionWithBefore, setCopiedCaptionWithBefore] = useState(false);
  const [copiedCaptionWithDuring, setCopiedCaptionWithDuring] = useState(false);

  const copyCaptionWithTags = async (
    hashtags: string,
    setCopied: (value: boolean) => void
  ) => {
    if (!caption) return;
    const text = `${caption}\r\n\r\n${hashtags}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const generateCaption = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", { method: "POST" });
    const data = await res.json();
    setCaption(data.caption);
    setLoading(false);
  };

  useEffect(() => {
    generateCaption();
  }, []);

  return (
    <>
      {/* Caption card */}
      <div className={CARD_CLASS}>
        <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
          Caption
        </div>
        <div className="h-40 rounded-lg border border-gray-200/70 bg-background/80 p-4 text-md leading-relaxed shadow-sm overflow-y-auto text-gray-500">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gray-500">
              <div
                className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"
                aria-hidden="true"
              />
              <span>Generating caption...</span>
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
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
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
            disabled={!caption || loading}
            onClick={async () => {
              if (!caption) return;
              try {
                await navigator.clipboard.writeText(caption);
                setCopiedCaption(true);
                setTimeout(() => setCopiedCaption(false), 1500);
              } catch {
                // ignore
              }
            }}
            className="flex-1 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center text-gray-500">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <rect
                  x="9"
                  y="9"
                  width="11"
                  height="13"
                  rx="2"
                  className="fill-current"
                  opacity="0.9"
                />
                <rect
                  x="4"
                  y="4"
                  width="11"
                  height="13"
                  rx="2"
                  className="fill-current"
                  opacity="0.5"
                />
              </svg>
            </span>
            {copiedCaption ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Tags card */}
      <div className={CARD_CLASS}>
        <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
          Tags
        </div>
        <div className="grid grid-cols-1 gap-4 text-xs text-white sm:grid-cols-2">
          <div className="space-y-2">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white">
              Before the show
            </p>
            <p>#LinglingKwong #OrmKornnaphat</p>
            <p>#LingOrm #DiorAW26 #Dior</p>
            <button
              type="button"
              onClick={async () => {
                const tags =
                  "#LinglingKwong #OrmKornnaphat\n#LingOrm #DiorAW26 #Dior";
                try {
                  await navigator.clipboard.writeText(tags);
                  setCopiedBeforeTags(true);
                  setTimeout(() => setCopiedBeforeTags(false), 1500);
                } catch {
                  // ignore
                }
              }}
              className="mt-1 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white/80 px-2.5 py-1 text-[12px] font-medium text-gray-700 shadow-sm transition-colors hover:bg-white"
            >
              {copiedBeforeTags ? "Copied tags" : "Copy tags"}
            </button>
          </div>
          <div className="space-y-2">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white">
              During the show
            </p>
            <p>#LingOrmDiorAW26 #DiorAW26</p>
            <p>#LinglingKwong #OrmKornnaphat #PFW</p>
            <button
              type="button"
              onClick={async () => {
                const tags =
                  "#LingOrmDiorAW26 #DiorAW26\n#LinglingKwong #OrmKornnaphat #PFW";
                try {
                  await navigator.clipboard.writeText(tags);
                  setCopiedDuringTags(true);
                  setTimeout(() => setCopiedDuringTags(false), 1500);
                } catch {
                  // ignore
                }
              }}
              className="mt-1 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white/80 px-2.5 py-1 text-[12px] font-medium text-gray-700 shadow-sm transition-colors hover:bg-white"
            >
              {copiedDuringTags ? "Copied tags" : "Copy tags"}
            </button>
          </div>
        </div>
      </div>

      {/* Caption + Tags card */}
      <div className={CARD_CLASS}>
        <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
          Caption + Tags
        </div>
        <div className="rounded-lg border border-white/20 bg-white/5 p-4 mb-4 text-sm text-white/90">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2">Copy format</p>
          <p className="text-white/90">Your caption</p>
          <p className="text-white/50 text-xs mt-1">(blank line)</p>
          <p className="text-white/90 mt-1">Hashtags</p>
          <p className="text-[11px] text-white/60 mt-2">Each button below copies caption + one set of hashtags in this order.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled={!caption || loading}
            onClick={() =>
              copyCaptionWithTags(
                "#LinglingKwong #OrmKornnaphat\r\n#LingOrm #DiorAW26 #Dior",
                setCopiedCaptionWithBefore
              )
            }
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white/80 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {copiedCaptionWithBefore ? "Copied!" : "Copy"}
          </button>
          <button
            type="button"
            disabled={!caption || loading}
            onClick={() =>
              copyCaptionWithTags(
                "#LingOrmDiorAW26 #DiorAW26\r\n#LinglingKwong #OrmKornnaphat #PFW",
                setCopiedCaptionWithDuring
              )
            }
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white/80 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {copiedCaptionWithDuring ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </>
  );
}
