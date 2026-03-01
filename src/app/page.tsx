import { useState } from "react";
import Image from "next/image";
import TabX from "./components/TabX";
import TabIG from "./components/TabIG";
import TabTikTok from "./components/TabTikTok";
import TabFacebook from "./components/TabFacebook";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"x" | "ig" | "tiktok" | "facebook">("x");

  return (
    <main className="min-h-screen text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-3">
        {/* Logo — outside tabs */}
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

        {/* Tabs: X (Twitter) | IG | TikTok | Facebook */}
        <div className="flex rounded-lg border border-indigo-400/30 bg-indigo-900/40 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("x")}
            className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "x"
                ? "bg-white text-gray-900 shadow"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            X (Twitter)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ig")}
            className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "ig"
                ? "bg-white text-gray-900 shadow"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            IG
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tiktok")}
            className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "tiktok"
                ? "bg-white text-gray-900 shadow"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            TikTok
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("facebook")}
            className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "facebook"
                ? "bg-white text-gray-900 shadow"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Facebook
          </button>
        </div>

        {activeTab === "x" && <TabX />}
        {activeTab === "ig" && <TabIG />}
        {activeTab === "tiktok" && <TabTikTok />}
        {activeTab === "facebook" && <TabFacebook />}

        {/* Footer — outside tabs */}
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white">
          Create by{" "}
          <a
            href="https://x.com/LingOrm_Vbots"
            target="_blank"
            className="text-white underline"
          >
            LingOrm_Vbots
          </a>{" "}
          - Z
        </p>
      </div>
    </main>
  );
}
