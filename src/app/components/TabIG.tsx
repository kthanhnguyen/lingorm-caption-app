"use client";

import type { Category } from "../types";
import TabIGLingOrm from "./tabs/ig/LingOrm";
import TabIGLing from "./tabs/ig/Ling";
import TabIGOrm from "./tabs/ig/Orm";

type TabIGProps = { category: Category };

export default function TabIG({ category }: TabIGProps) {
  if (category === "ling") return <TabIGLing />;
  if (category === "orm") return <TabIGOrm />;
  return <TabIGLingOrm />;
}
