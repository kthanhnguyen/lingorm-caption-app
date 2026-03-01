"use client";

import { useState } from "react";

const CARD_CLASS =
  "flex flex-col bg-gradient-to-br from-indigo-800 via-indigo-900 to-purple-900 border border-indigo-400/30 shadow-[0_0_35px_rgba(99,102,241,0.4)] rounded-xl text-white p-6";

const IG_POST_HASHTAGS =
  "#LingOrmDiorAW26\n#DiorAW26\n#LinglingKwong\n#OrmKornnaphat #pfw";
const IG_POST_TAG = "@dior";
const IG_POST_COPY = `${IG_POST_HASHTAGS}\n${IG_POST_TAG}`;

const IG_STORY_HASHTAGS =
  "#LingOrmDiorAW26\n#DiorAW26 #pfw\n#LinglingKwong\n#OrmKornnaphat";

const TAG_IN_PHOTO_NOTE =
  "Tag in photo: @dior @mathildefavier @utzpeter @linglingkwong @orm.kornnaphat @parisfashionweek";

export default function TabIG() {
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedStoryHashtags, setCopiedStoryHashtags] = useState(false);

  const copy = async (text: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {/* IG Post */}
        <div className={CARD_CLASS}>
          <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
            IG Post
          </div>
          <div className="flex flex-1 flex-col space-y-3 text-sm text-white/90">
            <div>
              <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-white/80">
                Hashtags
              </p>
              <p className="whitespace-pre-line text-white/90">{IG_POST_HASHTAGS}</p>
            </div>
            <div>
              <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-white/80">
                Tag
              </p>
              <p className="text-white/90">{IG_POST_TAG}</p>
            </div>
            <div className="mt-auto flex flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => copy(IG_POST_COPY, setCopiedPost)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-white"
              >
                {copiedPost ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* IG Story Hashtag */}
        <div className={CARD_CLASS}>
          <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
            IG Story Hashtag
          </div>
          <div className="flex flex-1 flex-col space-y-3 text-sm text-white/90">
            <p className="whitespace-pre-line text-white/90">{IG_STORY_HASHTAGS}</p>
            <div className="mt-auto flex flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => copy(IG_STORY_HASHTAGS, setCopiedStoryHashtags)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-white"
              >
                {copiedStoryHashtags ? "Copied!" : "Copy hashtags"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-2 text-xs text-amber-100 mt-4">
        <p className="mb-0.5 font-semibold uppercase tracking-wider text-amber-200/90">Note</p>
        <p className="text-white/90">{TAG_IN_PHOTO_NOTE}</p>
      </div>
    </div>
  );
}
