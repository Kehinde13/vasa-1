"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/common/Button";
import { Loader2 } from "lucide-react"; // spinner icon

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Error during sign-in:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="p-8 bg-white shadow-lg rounded-2xl text-center w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2">Welcome Back 👋</h1>
        <p className="text-gray-500 mb-6">
          Sign in or create an account using your Google account
        </p>

        <Button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full py-2 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
              Signing in...
            </>
          ) : (
            "Continue with Google"
          )}
        </Button>

        <p className="text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up with Google
          </button>
        </p>
      </div>
    </div>
  );
}
