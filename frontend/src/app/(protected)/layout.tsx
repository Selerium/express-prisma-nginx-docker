"use client";

import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) return null;

  if (user.firstTime && pathname !== "/onboarding") {
    window.location.href = "/onboarding";
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      {children}
    </div>
  );
}
