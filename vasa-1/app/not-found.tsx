"use client";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Oops! Page not found
      </h2>
      <p className="mt-2 text-gray-600 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.  
        Try navigating back to the dashboard.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
