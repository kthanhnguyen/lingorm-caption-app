import type { Category } from "../../types";

/**
 * Single source of truth for all platform tags by category.
 * Edit here to update every tab component.
 */

// --- X (Twitter) ---
export const X_TAGS: Record<Exclude<Category, "lingorm">, string> = {
  ling: "#LinglingKwong \n#Dior #DiorAW26 #PFW\n@Dior @linglingsirilak",
  orm: "#OrmKornnaphat \n#Dior #DiorAW26 #PFW\n@Dior @ormmormm",
};

export const X_LINGORM_PRESETS = [
  { id: "before", label: "Before 02 MAR 2026 3:30 PM BKK TIME", tags: "#LinglingKwong #OrmKornnaphat\n#LingOrm #Dior #DiorAW26 #PFW\n@Dior @linglingsirilak @ormmormm", notes: "" },
  { id: "airport", label: "Airport - 02 MAR 2026 3:30 PM BKK TIME", tags: "LINGORM TAKEOFF TO DIORAW26\n#LingOrmDiorAW26APTLook", notes: "" },
  { id: "airport-rank-1", label: "Airport - 02 MAR 2026 3:30 PM BKK TIME - After Rank #1", tags: "LINGORM TAKEOFF TO DIORAW26\n#LingOrmDiorAW26APTLook\n#LinglingKwong #OrmKornnaphat #LingOrm\n#Dior #DiorAW26 #PFW\n@Dior @linglingsirilak @ormmormm", notes: "After hashtag #LingOrmDiorAW26APTLook rank 1 on X use this preset." },
  { id: "during", label: "03 MAR 2026", tags: "#LingOrmDiorAW26 #DiorAW26\n#LinglingKwong #OrmKornnaphat #PFW", notes: "" },
] as const;

// --- IG ---
export type IGCategoryConfig = {
  postHashtags: string;
  postTag: string;
  storyHashtags: string;
  tagInPhotoNote: string;
};

export const IG_TAGS: Record<Category, IGCategoryConfig> = {
  ling: {
    postHashtags: "#LinglingKwong #LingOrmDiorAW26 \n#Dior #DiorAW26 #pfw",
    postTag: "@dior @linglingkwong",
    storyHashtags: "#LinglingKwong #LingOrmDiorAW26 \n#Dior #DiorAW26 #pfw",
    tagInPhotoNote: "Tag in photo: @dior @mathildefavier @utzpeter @linglingkwong @parisfashionweek",
  },
  orm: {
    postHashtags: "#OrmKornnaphat #LingOrmDiorAW26 \n#Dior #DiorAW26 #pfw",
    postTag: "@dior @orm.kornnaphat",
    storyHashtags: "#OrmKornnaphat #LingOrmDiorAW26 \n#Dior #DiorAW26 #pfw",
    tagInPhotoNote: "Tag in photo: @dior @mathildefavier @utzpeter @orm.kornnaphat @parisfashionweek",
  },
  lingorm: {
    postHashtags: "#LingOrmDiorAW26\n#DiorAW26\n#LinglingKwong\n#OrmKornnaphat #pfw",
    postTag: "@dior",
    storyHashtags: "#LingOrmDiorAW26\n#DiorAW26 #pfw\n#LinglingKwong\n#OrmKornnaphat",
    tagInPhotoNote: "Tag in photo: @dior @mathildefavier @utzpeter @linglingkwong @orm.kornnaphat @parisfashionweek",
  },
};

// --- TikTok ---
export type TikTokCategoryConfig = { hashtags: string; tags: string };

export const TIKTOK_TAGS: Record<Category, TikTokCategoryConfig> = {
  ling: { hashtags: "#LinglingKwong #LingOrmDiorAW26 \n#Dior #DiorAW26 #pfw", tags: "@dior\n@linglingkwong" },
  orm: { hashtags: "#OrmKornnaphat #LingOrmDiorAW26 \n#Dior #DiorAW26 #pfw", tags: "@dior\n@ormkornnaphat" },
  lingorm: { hashtags: "#LingOrmDiorAW26\n#DiorAW26\n#LinglingKwong\n#OrmKornnaphat #pfw", tags: "@dior\n@linglingkwong\n@ormkornnaphat" },
};

// --- Facebook ---
export const FACEBOOK_TAGS: Record<Category, string> = {
  ling: "#LinglingKwong #LingOrmDiorAW26 \n#Dior #DiorAW26 #pfw",
  orm: "#OrmKornnaphat #LingOrmDiorAW26 \n#Dior #DiorAW26 #pfw",
  lingorm: "#LingOrmDiorAW26\n#DiorAW26\n#LinglingKwong\n#OrmKornnaphat #pfw",
};
