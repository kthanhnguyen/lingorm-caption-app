"use client";

import type { Category } from "../types";
import TabXLingOrm from "./tabs/x/LingOrm";
import TabXLing from "./tabs/x/Ling";
import TabXOrm from "./tabs/x/Orm";

type TabXProps = { category: Category };

export default function TabX({ category }: TabXProps) {
  if (category === "ling") return <TabXLing />;
  if (category === "orm") return <TabXOrm />;
  return <TabXLingOrm />;
}
