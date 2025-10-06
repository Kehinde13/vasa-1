"use client";

import React from "react";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
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
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <AlertTriangle className="text-red-500 mb-4" size={48} />
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-gray-600 mb-6">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
