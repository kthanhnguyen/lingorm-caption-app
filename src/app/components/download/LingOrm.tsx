"use client";

import { buildList } from "./buildList";
import DownloadImagesGrid from "./DownloadImagesGrid";

const IMAGES = buildList("LingOrm", 21, "LingOrm", "desc");

export default function DownloadImagesLingOrm() {
  return (
    <DownloadImagesGrid
      imageList={IMAGES}
      initialVisible={8}
      title="Download images"
      description="Download and use trending images for social media content (LingOrm)."
      footer="Designed images by Kiu"
    />
  );
}
