"use client";

import { buildList } from "./buildList";
import DownloadImagesGrid from "./DownloadImagesGrid";

const IMAGES = buildList("Orm", 16, "Orm", "desc");

export default function DownloadImagesOrm() {
  return (
    <DownloadImagesGrid
      imageList={IMAGES}
      initialVisible={8}
      title="Download images"
      description="Download and use trending images for social media content (Orm)."
      footer="Designed images by Kiu"
    />
  );
}
