"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-indigo-400/30 bg-indigo-900/40 p-6 text-center text-white">
        <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
        <p className="text-sm text-white/80 mb-4">
          Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
