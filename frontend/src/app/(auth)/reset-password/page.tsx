"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "@/components/form/formField";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setError("");
    setLoading(true);

    try {
      await api("/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: data.password }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">Invalid Link</h2>
          <p>No reset token found. Please request a new reset link.</p>
          <Link href="/forgot-password" className="btn btn-primary mt-4">
            Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-success">Password Reset</h2>
          <p>Your password has been updated.</p>
          <Link href="/login" className="btn btn-primary mt-4">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-sm bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl justify-center mb-4">
          Reset Password
        </h2>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              name="password"
              label="New Password"
              type="password"
              minLength={8}
              autoComplete="new-password"
            />

            <FormField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              minLength={8}
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense
        fallback={
          <span className="loading loading-spinner loading-lg"></span>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
