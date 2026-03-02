"use client";

import { useState } from "react";
import {
  Card,
  CopyButton,
  useCopyToClipboard,
  IG_TAGS,
  NOTE_BOX_CLASS,
  NOTE_BOX_TITLE_CLASS,
  CARD_SUBLABEL_CLASS,
} from "../../shared";

export default function TabIGLing() {
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedStory, setCopiedStory] = useState(false);
  const copy = useCopyToClipboard();

  const { postHashtags, postTag, storyHashtags, tagInPhotoNote } = IG_TAGS.ling;
  const postCopy = `${postHashtags}\n${postTag}`;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Card title="IG Post" flex>
          <div className="flex flex-1 flex-col space-y-3 text-sm text-white/90">
            <div>
              <p className={`mb-1 ${CARD_SUBLABEL_CLASS}`}>Hashtags</p>
              <p className="whitespace-pre-line text-white/90">{postHashtags}</p>
            </div>
            <div>
              <p className={`mb-1 ${CARD_SUBLABEL_CLASS}`}>Tag</p>
              <p className="text-white/90">{postTag}</p>
            </div>
            <div className="mt-auto flex flex-row items-center gap-2 pt-2">
              <CopyButton
                onCopy={() => copy(postCopy, setCopiedPost)}
                copied={copiedPost}
                label="Copy hashtags"
                copiedLabel="Copied!"
                size="small"
              />
            </div>
          </div>
        </Card>

        <Card title="IG Story Hashtag" flex>
          <div className="flex flex-1 flex-col space-y-3 text-sm text-white/90">
            <p className="whitespace-pre-line text-white/90">{storyHashtags}</p>
            <div className="mt-auto flex flex-row items-center gap-2 pt-2">
              <CopyButton
                onCopy={() => copy(storyHashtags, setCopiedStory)}
                copied={copiedStory}
                label="Copy hashtags"
                copiedLabel="Copied!"
                size="small"
              />
            </div>
          </div>
        </Card>
      </div>
      <div className={NOTE_BOX_CLASS}>
        <p className={NOTE_BOX_TITLE_CLASS}>Note</p>
        <p className="text-white/90">{tagInPhotoNote}</p>
      </div>
    </div>
  );
}
