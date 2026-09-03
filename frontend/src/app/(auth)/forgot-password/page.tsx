"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "@/components/form/formField";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setLoading(true);

    try {
      await api("/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      // Backend always returns 200 to prevent enumeration
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  }

  if (submitted) {
    const email = methods.getValues("email");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Check your email</h2>
            <p className="text-base-content/60">
              If an account exists for <strong>{email}</strong>, we sent a
              password reset link.
            </p>
            <Link href="/login" className="btn btn-primary mt-4">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <FormProvider {...methods}>
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl justify-center mb-4">
              Forgot Password
            </h2>
            <p className="text-base-content/60 text-center mb-4">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField name="email" label="Email" type="email" placeholder="Email" />

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Remember your password?{" "}
              <Link href="/login" className="link link-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
