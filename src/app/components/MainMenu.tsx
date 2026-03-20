"use client";

type MainPage = "generate" | "download";

type MainMenuProps = {
  mainPage: MainPage;
  onChange: (page: MainPage) => void;
};

export default function MainMenu({ mainPage, onChange }: MainMenuProps) {
  return (
    <nav className="flex border-b border-white/20" aria-label="Main">
      <button
        type="button"
        onClick={() => onChange("generate")}
        className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
          mainPage === "generate"
            ? "border-white text-white"
            : "border-transparent text-white/60 hover:text-white"
        }`}
      >
        Generate
      </button>
      <button
        type="button"
        onClick={() => onChange("download")}
        className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
          mainPage === "download"
            ? "border-white text-white"
            : "border-transparent text-white/60 hover:text-white"
        }`}
      >
        Download images
      </button>
    </nav>
  );
}
