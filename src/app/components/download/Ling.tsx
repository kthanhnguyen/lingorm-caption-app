"use client";

import { buildList } from "./buildList";
import DownloadImagesGrid from "./DownloadImagesGrid";

const IMAGES = buildList("Ling", 18, "Ling", "desc");

export default function DownloadImagesLing() {
  return (
    <DownloadImagesGrid
      imageList={IMAGES}
      initialVisible={8}
      title="Download images"
      description="Download and use trending images for social media content (Ling)."
      footer="Designed images by Kiu"
    />
  );
}
