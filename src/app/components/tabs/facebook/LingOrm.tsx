"use client";

import { useState } from "react";

const CARD_CLASS =
  "flex flex-col bg-gradient-to-br from-indigo-800 via-indigo-900 to-purple-900 border border-indigo-400/30 shadow-[0_0_35px_rgba(99,102,241,0.4)] rounded-xl text-white p-6";

const HASHTAGS =
  "#LingOrmDiorAW26\n#DiorAW26\n#LinglingKwong\n#OrmKornnaphat #pfw";

export default function TabFacebookLingOrm() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(HASHTAGS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full">
      <div className={CARD_CLASS}>
        <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
          Facebook
        </div>
        <div className="flex flex-1 flex-col space-y-3 text-sm text-white/90">
          <div>
            <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-white/80">
              Hashtags
            </p>
            <p className="whitespace-pre-line text-white/90">{HASHTAGS}</p>
          </div>
          <div className="mt-auto flex flex-row items-center gap-2 pt-2">
            <button
              type="button"
              onClick={copy}
              className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-white"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
