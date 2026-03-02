"use client";

import type { Category } from "../types";
import TabTikTokLingOrm from "./tabs/tiktok/LingOrm";
import TabTikTokLing from "./tabs/tiktok/Ling";
import TabTikTokOrm from "./tabs/tiktok/Orm";

type TabTikTokProps = { category: Category };

export default function TabTikTok({ category }: TabTikTokProps) {
  if (category === "ling") return <TabTikTokLing />;
  if (category === "orm") return <TabTikTokOrm />;
  return <TabTikTokLingOrm />;
}
