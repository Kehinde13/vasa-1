"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    businessName: "",
    phone: "",
    timeZone: "",
    businessType: "",
    services: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return <p className="text-center mt-20 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-gray-900">
          My Profile
        </h1>

        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm sm:text-base text-green-800 font-medium">
              Profile updated successfully!
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 md:p-10">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 border-b border-gray-200">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-gray-100">
              <Image
                src={session.user?.image || "/assets/images/profile-placeholder.png"}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {session.user?.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 break-all">
                {session.user?.email}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                placeholder="e.g. VAsA HQ"
                value={form.businessName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-3 text-black text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+234-123-456-789"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-3 text-black text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                Time Zone
              </label>
              <input
                type="text"
                name="timeZone"
                placeholder="e.g. GMT+1"
                value={form.timeZone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-3 text-sm text-black sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                Business Type
              </label>
              <input
                type="text"
                name="businessType"
                placeholder="Virtual Assistance, Consulting, etc."
                value={form.businessType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-3 text-sm text-black sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                Services
              </label>
              <input
                type="text"
                name="services"
                placeholder="Task Tracking, Client Management..."
                value={form.services}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg sm:rounded-xl text-black p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 px-6 rounded-lg sm:rounded-xl font-medium w-full sm:w-auto transition-colors duration-200 text-sm sm:text-base shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}