"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

const CARD_CLASS =
  "bg-gradient-to-br from-indigo-800 via-indigo-900 to-purple-900 border border-indigo-400/30 shadow-[0_0_35px_rgba(99,102,241,0.4)] rounded-xl text-white p-6";

export type ImageItem = { id: string; src: string; label: string };

type DownloadImagesGridProps = {
  imageList: ImageItem[];
  title?: string;
  description?: string;
  footer?: string;
};

export default function DownloadImagesGrid({
  imageList,
  title = "Download images",
  description = "Download and use trending images for social media content.",
  footer = "Designed images by Kiu",
}: DownloadImagesGridProps) {
  const [fullImage, setFullImage] = useState<{ src: string; label: string } | null>(null);
  const [fullImageLoaded, setFullImageLoaded] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsIOS(/iP(hone|ad|od)/.test(navigator.userAgent));
    }
  }, []);

  // When full-size modal is open, prevent background scroll
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!fullImage) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [fullImage]);

  const preloadFullImage = useCallback((src: string) => {
    const img = new window.Image();
    img.src = src;
  }, []);

  const handleDownload = async (src: string, label: string) => {
    const isIOS =
      typeof navigator !== "undefined" && /iP(hone|ad|od)/.test(navigator.userAgent);

    try {
      const res = await fetch(src);
      const blob = await res.blob();

      // iOS Web Share API: lets user choose "Save Image" from the share sheet → Photos
      const navAny = navigator as any;
      if (isIOS && navAny.canShare && navAny.share) {
        const file = new File([blob], `${label}.png`, { type: "image/png" });
        if (navAny.canShare({ files: [file] })) {
          await navAny.share({
            files: [file],
            title: label,
          });
          return;
        }
      }

      // Desktop / Android (or iOS without Web Share files support): regular download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${label}.png`;
      link.rel = "noopener noreferrer";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading/sharing:", error);
      // Fallback last resort: open image in new tab
      window.open(src, "_blank");
    }
  };

  return (
    <div className={CARD_CLASS}>
      <div className="mb-3 text-[16px] font-bold uppercase tracking-[0.18em] text-white">
        {title}
      </div>
      <p className="mb-4 text-sm text-white/80">
        {description}
      </p>
      {isIOS && (
        <p className="mt-2 text-[11px] text-white/70 mb-4">
          On iPhone/iPad: you can click <span className="font-semibold">Download File</span> to open the share menu
          (choose &quot;Save Image&quot;), or long press the image (view full size) and choose &quot;Save Image&quot; to add to Photos.
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {imageList.map(({ id, src, label }) => (
          <div
            key={id}
            className="flex flex-col items-center gap-2 rounded-lg border border-white/20 bg-white/5 p-2"
          >
            <button
              type="button"
              onClick={() => {
                setFullImage({ src, label });
                setFullImageLoaded(false);
              }}
              onMouseEnter={() => preloadFullImage(src)}
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

      {fullImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setFullImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="View full image"
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col items-center gap-4 overflow-y-auto rounded-xl bg-black/20 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button, pinned inside modal */}
            <button
              type="button"
              onClick={() => setFullImage(null)}
              className="absolute top-3 right-3 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white/25"
            >
              ✕
            </button>

            {/* Image area */}
            <div className="mt-6 flex w-full justify-center">
              {/* Hint for saving */}
              <p className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-white/60 uppercase whitespace-nowrap">
                Long press the image to save to your library
              </p>

              <img
                src={fullImage.src}
                alt={fullImage.label}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl select-none"
                style={{
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "default",
                }}
                onLoad={() => setFullImageLoaded(true)}
                onContextMenu={(e) => e.stopPropagation()}
              />
            </div>

            <p className="mt-2 text-sm font-medium text-white">{fullImage.label}</p>

            {/* Download button for Android/PC, still available on iOS */}
            <button
              type="button"
              onClick={() => handleDownload(fullImage.src, fullImage.label)}
              className="mt-1 rounded-full bg-white px-6 py-2 text-sm font-bold text-black shadow-md hover:bg-gray-100"
            >
              Download File
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-white/80">
        {footer}
      </p>
    </div>
  );
}
