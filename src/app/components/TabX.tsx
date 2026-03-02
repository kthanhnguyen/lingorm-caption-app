"use client";

import type { Category } from "../types";
import TabXLingOrm from "./tabs/x/LingOrm";
import TabXLing from "./tabs/x/Ling";
import TabXOrm from "./tabs/x/Orm";

export type CaptionProps = {
  caption: string;
  captionLoading: boolean;
  captionError: string | null;
  onGenerateCaption: () => Promise<void>;
};

type TabXProps = { category: Category } & CaptionProps;

export default function TabX({ category, caption, captionLoading, captionError, onGenerateCaption }: TabXProps) {
  const captionProps: CaptionProps = { caption, captionLoading, captionError, onGenerateCaption };
  if (category === "ling") return <TabXLing {...captionProps} />;
  if (category === "orm") return <TabXOrm {...captionProps} />;
  return <TabXLingOrm {...captionProps} />;
}
