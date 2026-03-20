"use client";

import Image from "next/image";
import { useState } from "react";
import CategorySelect from "./components/CategorySelect";
import MainMenu from "./components/MainMenu";
import type { Category } from "./types";

export default function Home() {
  const [category, setCategory] = useState<Category>("lingorm");
  const [mainPage, setMainPage] = useState<"generate" | "download">("generate");

  return (
    <main className="min-h-screen text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-6">
        <div>
          <div className="flex justify-center">
            <Image
              src="/images/logo_vbots.png"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
          <p className="text-center text-xl uppercase tracking-[0.2em] mt-2">
            <a
              href="https://x.com/LingOrm_Vbots"
              target="_blank"
              className="text-white font-bold"
            >
              LingOrm_Vbots
            </a>
          </p>
        </div>

        <div className="rounded-xl border border-white/20 bg-black/30 p-6 text-center space-y-3 my-4">
          <p className="text-2xl font-bold uppercase tracking-[0.12em] text-white">
            Paris Fashion Week Dior AW26
          </p>
          <p className="text-sm text-white/80">
            This campaign has ended. To be continued at the next event in October.
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">
            See you soon
          </p>
        </div>

        {/* <CategorySelect
          category={category}
          onChange={(nextCategory) => {
            setCategory(nextCategory);
          }}
        />

        <MainMenu mainPage={mainPage} onChange={setMainPage} /> */}
       

        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white">
          Create by Z
        </p>
      </div>
    </main>
  );
}
