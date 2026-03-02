"use client";

import type { Category } from "../types";
import TabFacebookLingOrm from "./tabs/facebook/LingOrm";
import TabFacebookLing from "./tabs/facebook/Ling";
import TabFacebookOrm from "./tabs/facebook/Orm";

type TabFacebookProps = { category: Category };

export default function TabFacebook({ category }: TabFacebookProps) {
  if (category === "ling") return <TabFacebookLing />;
  if (category === "orm") return <TabFacebookOrm />;
  return <TabFacebookLingOrm />;
}
