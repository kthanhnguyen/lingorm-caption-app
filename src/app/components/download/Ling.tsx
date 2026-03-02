"use client";

import type { ImageItem } from "./DownloadImagesGrid";
import DownloadImagesGrid from "./DownloadImagesGrid";

function buildList(folder: string, count: number, prefix: string): ImageItem[] {
  return Array.from({ length: count }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return {
      id: `${folder}-${num}`,
      src: `/images/img/${folder}/${num}.png`,
      label: `${prefix}_${i + 1}`,
    };
  });
}

const IMAGES = buildList("Ling", 9, "Ling");

export default function DownloadImagesLing() {
  return (
    <DownloadImagesGrid
      imageList={IMAGES}
      title="Download images"
      description="Download and use trending images for social media content (Ling)."
      footer="Designed images by Kiu"
    />
  );
}
