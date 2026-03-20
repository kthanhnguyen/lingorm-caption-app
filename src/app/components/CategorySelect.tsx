"use client";

import type { Category } from "../types";

type CategorySelectProps = {
  category: Category;
  onChange: (category: Category) => void;
};

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "lingorm", label: "LingOrm" },
  { value: "ling", label: "Ling" },
  { value: "orm", label: "Orm" },
];

export default function CategorySelect({ category, onChange }: CategorySelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="category-select" className="text-xs uppercase tracking-wider text-white/70">
        Category
      </label>
      <select
        id="category-select"
        value={category}
        onChange={(e) => onChange(e.target.value as Category)}
        className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm font-medium text-white focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        aria-label="Select category"
      >
        {CATEGORIES.map(({ value, label }) => (
          <option key={value} value={value} className="bg-gray-900 text-white">
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
