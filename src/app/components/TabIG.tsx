"use client";

import type { Category } from "../types";
import TabIGLingOrm from "./tabs/ig/LingOrm";
import TabIGLing from "./tabs/ig/Ling";
import TabIGOrm from "./tabs/ig/Orm";

type TabIGProps = { category: Category; caption?: string };

export default function TabIG({ category, caption }: TabIGProps) {
  if (category === "ling") return <TabIGLing />;
  if (category === "orm") return <TabIGOrm />;
  return <TabIGLingOrm />;
}
