"use client";

import { useState } from "react";
import { Card, CopyButton, useCopyToClipboard, TIKTOK_TAGS, CARD_SUBLABEL_CLASS } from "../../shared";

export default function TabTikTokOrm() {
  const [copied, setCopied] = useState(false);
  const copy = useCopyToClipboard();

  const { hashtags, tags } = TIKTOK_TAGS.orm;
  const copyText = `${hashtags}\n${tags}`;

  return (
    <div className="w-full">
      <Card title="TikTok" flex>
        <div className="flex flex-1 flex-col space-y-3 text-sm text-white/90">
          <div>
            <p className={`mb-1 ${CARD_SUBLABEL_CLASS}`}>Hashtags</p>
            <p className="whitespace-pre-line text-white/90">{hashtags}</p>
          </div>
          <div>
            <p className={`mb-1 ${CARD_SUBLABEL_CLASS}`}>Tags</p>
            <p className="whitespace-pre-line text-white/90">{tags}</p>
          </div>
          <div className="mt-auto flex flex-row items-center gap-2 pt-2">
            <CopyButton onCopy={() => copy(copyText, setCopied)} copied={copied} label="Copy hashtags" copiedLabel="Copied!" size="small" />
          </div>
        </div>
      </Card>
    </div>
  );
}
