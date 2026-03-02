"use client";

import { useState } from "react";
import {
  Card,
  CopyButton,
  TAG_BOX_CLASS,
  COPY_FORMAT_BOX_CLASS,
  useCopyToClipboard,
  X_LINGORM_PRESETS,
  SELECT_CLASS,
} from "../../shared";

export type CaptionProps = {
  caption: string;
  captionLoading: boolean;
  captionError: string | null;
  onGenerateCaption: () => Promise<void>;
};

type PresetId = (typeof X_LINGORM_PRESETS)[number]["id"];

export default function TabXLingOrm({ caption, captionLoading, captionError }: CaptionProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<PresetId>(X_LINGORM_PRESETS[1].id);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedCaptionWithTags, setCopiedCaptionWithTags] = useState(false);
  const copy = useCopyToClipboard();

  const preset = X_LINGORM_PRESETS.find((p) => p.id === selectedPresetId) ?? X_LINGORM_PRESETS[0];

  const handleCopyCaptionWithTags = () => {
    if (!caption) return;
    copy(`${caption}\r\n\r\n${preset.tags}`, setCopiedCaptionWithTags);
  };

  return (
    <>
      <Card title="Tags">
        <p className="mb-4 text-sm text-white/80">Choose a preset below to copy hashtags for your post.</p>
        <div className="space-y-3">
          <label className="block text-[12px] font-semibold uppercase tracking-[0.18em] text-white">Preset</label>
          <select
            value={selectedPresetId}
            onChange={(e) => setSelectedPresetId(e.target.value as PresetId)}
            className={SELECT_CLASS}
          >
            {X_LINGORM_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <div className={TAG_BOX_CLASS}>{preset.tags}</div>
          {preset.notes ? (
            <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
              <p className="mb-1 font-semibold uppercase tracking-wider text-amber-200/90">Notes</p>
              <p className="text-white/90">{preset.notes}</p>
            </div>
          ) : null}
          <CopyButton
            onCopy={() => copy(preset.tags, setCopiedTags)}
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
          <p className="text-[11px] text-white/60 mt-2">Uses the preset selected in the Tags card. Copy caption + hashtags in this order.</p>
        </div>
        <div className="space-y-3">
          <p className="text-xs text-white/80">Preset: <strong>{preset.label}</strong></p>
          {preset.notes ? <p className="text-xs text-amber-100/90 italic">Note: {preset.notes}</p> : null}
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
