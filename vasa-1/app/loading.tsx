import React from "react";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

        {/* Text */}
        <p className="text-gray-600 text-sm">Loading, please wait...</p>
      </div>
    </div>
  );
}
