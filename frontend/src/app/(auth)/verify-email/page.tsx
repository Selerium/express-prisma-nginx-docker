"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    api("/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(() => {
        setStatus("success");
        setMessage("Email verified successfully!");
      })
      .catch((err: any) => {
        setStatus("error");
        setMessage(err.message || "Verification failed.");
      });
  }, [token]);

  return (
    <div className="card w-full max-w-sm bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        {status === "loading" && (
          <>
            <span className="loading loading-spinner loading-lg"></span>
            <p>Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="card-title text-success">Verified!</h2>
            <p>{message}</p>
            <Link href="/login" className="btn btn-primary mt-4">
              Log In
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="card-title text-error">Verification Failed</h2>
            <p>{message}</p>
            <Link href="/login" className="btn btn-primary mt-4">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense
        fallback={
          <span className="loading loading-spinner loading-lg"></span>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
