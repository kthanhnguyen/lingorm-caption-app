"use client";

import type { Category } from "../types";
import DownloadImagesLingOrm from "./download/LingOrm";
import DownloadImagesLing from "./download/Ling";
import DownloadImagesOrm from "./download/Orm";

type DownloadImagesProps = { category: Category };

export default function DownloadImages({ category }: DownloadImagesProps) {
  if (category === "ling") return <DownloadImagesLing />;
  if (category === "orm") return <DownloadImagesOrm />;
  return <DownloadImagesLingOrm />;
}
