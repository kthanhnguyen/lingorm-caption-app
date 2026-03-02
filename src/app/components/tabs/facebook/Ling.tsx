"use client";

import { useState } from "react";
import { Card, CopyButton, useCopyToClipboard, FACEBOOK_TAGS, CARD_SUBLABEL_CLASS } from "../../shared";

export default function TabFacebookLing() {
  const [copied, setCopied] = useState(false);
  const copy = useCopyToClipboard();

  const hashtags = FACEBOOK_TAGS.ling;

  return (
    <div className="w-full">
      <Card title="Facebook" flex>
        <div className="flex flex-1 flex-col space-y-3 text-sm text-white/90">
          <div>
            <p className={`mb-1 ${CARD_SUBLABEL_CLASS}`}>Hashtags</p>
            <p className="whitespace-pre-line text-white/90">{hashtags}</p>
          </div>
          <div className="mt-auto flex flex-row items-center gap-2 pt-2">
            <CopyButton onCopy={() => copy(hashtags, setCopied)} copied={copied} label="Copy hashtags" copiedLabel="Copied!" size="small" />
          </div>
        </div>
      </Card>
    </div>
  );
}
