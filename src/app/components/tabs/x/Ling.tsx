"use client";

import { useState } from "react";
import { Card, CopyButton, TAG_BOX_CLASS, COPY_FORMAT_BOX_CLASS, useCopyToClipboard, X_TAGS } from "../../shared";

export type CaptionProps = {
  caption: string;
  captionLoading: boolean;
  captionError: string | null;
  onGenerateCaption: () => Promise<void>;
};

export default function TabXLing({ caption, captionLoading, captionError }: CaptionProps) {
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedCaptionWithTags, setCopiedCaptionWithTags] = useState(false);
  const copy = useCopyToClipboard();

  const tags = X_TAGS.ling;
  const handleCopyCaptionWithTags = () => {
    if (!caption) return;
    copy(`${caption}\r\n\r\n${tags}`, setCopiedCaptionWithTags);
  };

  return (
    <>
      <Card title="Tags">
        <p className="mb-4 text-sm text-white/80">Copy hashtags for your post (Ling).</p>
        <div className="space-y-3">
          <div className={TAG_BOX_CLASS}>{tags}</div>
          <CopyButton
            onCopy={() => copy(tags, setCopiedTags)}
            copied={copiedTags}
            label="Copy tags"
            copiedLabel="Copied tags"
          />
        </div>
      </Card>

      <Card title="Caption + Tags">
        <div className={COPY_FORMAT_BOX_CLASS}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2">Copy format</p>
          <p className="text-white/90">Your caption</p>
          <p className="text-white/50 text-xs mt-1">(blank line)</p>
          <p className="text-white/90 mt-1">Hashtags</p>
        </div>
        <div className="space-y-3">
          {captionError ? <p className="text-xs text-red-400 mb-2">{captionError}</p> : null}
          <CopyButton
            onCopy={handleCopyCaptionWithTags}
            copied={copiedCaptionWithTags}
            label="Copy caption + tags"
            copiedLabel="Copied!"
            disabled={!caption || captionLoading}
            size="large"
          />
        </div>
      </Card>
    </>
  );
}
