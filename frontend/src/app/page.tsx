"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) {
      window.location.href = user.firstTime ? "/onboarding" : "/home";
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-5xl font-bold">sampledomain</h1>
      <p className="text-lg text-base-content/60">
        Connect, collaborate, and grow together.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="btn btn-primary btn-lg">
          Log In
        </Link>
        <Link href="/register" className="btn btn-outline btn-lg">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
