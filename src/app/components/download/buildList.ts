import type { ImageItem } from "./DownloadImagesGrid";

export function buildList(
  folder: string,
  count: number,
  prefix: string,
  order: "asc" | "desc" = "asc"
): ImageItem[] {
  const list = Array.from({ length: count }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return {
      id: `${folder}-${num}`,
      src: `/images/img/${folder}/${num}.png`,
      label: `${prefix}_${i + 1}`,
    };
  });
  return order === "desc" ? list.reverse() : list;
}
