"use client";

import { useState } from "react";
import Image from "next/image";

const CARD_CLASS =
  "bg-gradient-to-br from-indigo-800 via-indigo-900 to-purple-900 border border-indigo-400/30 shadow-[0_0_35px_rgba(99,102,241,0.4)] rounded-xl text-white p-6";

type ImageItem = { id: string; src: string; label: string };

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

const IMAGE_CATEGORIES = [
  { id: 0, label: "LingOrm", images: buildList("LingOrm", 8, "LingOrm") },
  { id: 1, label: "Ling", images: buildList("Ling", 6, "Ling") },
  { id: 2, label: "Orm", images: buildList("Orm", 6, "Orm") },
] as const;

type CategoryId = (typeof IMAGE_CATEGORIES)[number]["id"];

export default function DownloadImages() {
  const [category, setCategory] = useState<CategoryId>(0);
  const [fullImage, setFullImage] = useState<{ src: string; label: string } | null>(null);

  const currentCategory = IMAGE_CATEGORIES.find((c) => c.id === category) ?? IMAGE_CATEGORIES[0];
  const imageList = currentCategory.images;

  const handleDownload = async (src: string, label: string) => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${label}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(src, "_blank");
    }
  };

  return (
    <div className={CARD_CLASS}>
      <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
        Download images
      </div>
      <p className="mb-4 text-sm text-white/80">
        Select a category and download images.
      </p>
      {/* Category tabs */}
      <div className="mb-4 flex rounded-lg border border-indigo-400/30 bg-indigo-900/40 p-1">
        {IMAGE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              category === c.id
                ? "bg-white text-gray-900 shadow"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {imageList.map(({ id, src, label }) => (
          <div
            key={id}
            className="flex flex-col items-center gap-2 rounded-lg border border-white/20 bg-white/5 p-2"
          >
            <button
              type="button"
              onClick={() => setFullImage({ src, label })}
              className="relative aspect-square w-full overflow-hidden rounded-md bg-white/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-indigo-900"
            >
              <Image
                src={src}
                alt={label}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 20vw"
                loading="lazy"
              />
            </button>
            <span className="text-xs font-medium text-white/90">{label}</span>
            <button
              type="button"
              onClick={() => handleDownload(src, label)}
              className="w-full rounded-md border border-gray-300 bg-white/80 px-2 py-1.5 text-[11px] font-medium text-gray-800 transition-colors hover:bg-white"
            >
              Download
            </button>
          </div>
        ))}
      </div>

      {/* Full image lightbox */}
      {fullImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setFullImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="View full image"
        >
          <div
            className="relative w-[min(90vw,42rem)] max-h-[90vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFullImage(null)}
              className="absolute -top-10 right-0 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative h-[75vh] w-full min-w-0 overflow-hidden rounded-lg bg-white/5">
              <Image
                src={fullImage.src}
                alt={fullImage.label}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 672px"
                loading="eager"
              />
            </div>
            <p className="text-sm font-medium text-white/90">{fullImage.label}</p>
            <button
              type="button"
              onClick={() => handleDownload(fullImage.src, fullImage.label)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-100"
            >
              Download
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-white/80">
        Design by Kiu
      </p>
    </div>
  );
}
