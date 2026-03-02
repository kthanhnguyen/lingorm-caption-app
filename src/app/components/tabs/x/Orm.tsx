"use client";

import { useEffect, useState } from "react";

const CARD_CLASS =
  "bg-gradient-to-br from-indigo-800 via-indigo-900 to-purple-900 border border-indigo-400/30 shadow-[0_0_35px_rgba(99,102,241,0.4)] rounded-xl text-white p-6";

const TAG_PRESETS = [
  {
    id: "orm-default",
    label: "Orm — Default",
    tags: "#OrmKornnaphat #Orm\n#Dior #DiorAW26 #PFW\n@Dior @ormmormm",
    notes: "",
  },
  {
    id: "orm-event",
    label: "Orm — Event",
    tags: "#OrmKornnaphat #Orm\n#DiorAW26 #PFW\n@Dior @ormmormm",
    notes: "",
  },
] as const;

type TagPresetId = (typeof TAG_PRESETS)[number]["id"];

export default function TabXOrm() {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [selectedTagPreset, setSelectedTagPreset] = useState<TagPresetId>(TAG_PRESETS[0].id);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedCaptionWithTags, setCopiedCaptionWithTags] = useState(false);

  const selectedPreset = TAG_PRESETS.find((p) => p.id === selectedTagPreset) ?? TAG_PRESETS[0];

  const copyTags = async (tags: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(tags);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const copyCaptionWithTagsHandler = async () => {
    if (!caption) return;
    await copyTags(`${caption}\r\n\r\n${selectedPreset.tags}`, setCopiedCaptionWithTags);
  };

  const generateCaption = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate?category=orm", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError("Could not load caption. Try again.");
        setCaption("");
        return;
      }
      setCaption(typeof data?.caption === "string" ? data.caption : "");
    } catch {
      setError("Network error. Check connection and try again.");
      setCaption("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateCaption();
  }, []);

  return (
    <>
      <div className={CARD_CLASS}>
        <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
          Caption
        </div>
        <div className="h-30 rounded-lg border border-gray-200/70 bg-background/80 p-4 text-md leading-relaxed shadow-sm overflow-y-auto text-gray-500">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gray-500">
              <div
                className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"
                aria-hidden="true"
              />
              <span>Generating caption...</span>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm">
              <span className="text-red-400">{error}</span>
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
                <rect x="9" y="9" width="11" height="13" rx="2" className="fill-current" opacity="0.9" />
                <rect x="4" y="4" width="11" height="13" rx="2" className="fill-current" opacity="0.5" />
              </svg>
            </span>
            {copiedCaption ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
          Tags
        </div>
        <p className="mb-4 text-sm text-white/80">
          Choose a preset below to copy hashtags for your post (Orm).
        </p>
        <div className="space-y-3">
          <label className="block text-[12px] font-semibold uppercase tracking-[0.18em] text-white">
            Preset
          </label>
          <select
            value={selectedTagPreset}
            onChange={(e) => setSelectedTagPreset(e.target.value as TagPresetId)}
            className="w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            {TAG_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <div className="rounded-lg border border-white/20 bg-white/5 p-3 text-xs text-white/90 whitespace-pre-line">
            {selectedPreset.tags}
          </div>
          {selectedPreset.notes ? (
            <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
              <p className="mb-1 font-semibold uppercase tracking-wider text-amber-200/90">Notes</p>
              <p className="text-white/90">{selectedPreset.notes}</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => copyTags(selectedPreset.tags, setCopiedTags)}
            className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-white"
          >
            {copiedTags ? "Copied tags" : "Copy tags"}
          </button>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
          Caption + Tags
        </div>
        <div className="rounded-lg border border-white/20 bg-white/5 p-4 mb-4 text-sm text-white/90">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2">Copy format</p>
          <p className="text-white/90">Your caption</p>
          <p className="text-white/50 text-xs mt-1">(blank line)</p>
          <p className="text-white/90 mt-1">Hashtags</p>
          <p className="text-[11px] text-white/60 mt-2">Uses the preset selected in the Tags card.</p>
        </div>
        <div className="space-y-3">
          <p className="text-xs text-white/80">Preset: <strong>{selectedPreset.label}</strong></p>
          <button
            type="button"
            disabled={!caption || loading}
            onClick={copyCaptionWithTagsHandler}
            className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white/80 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {copiedCaptionWithTags ? "Copied!" : "Copy caption + tags"}
          </button>
        </div>
      </div>
    </>
  );
}
