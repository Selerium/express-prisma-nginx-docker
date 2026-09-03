"use client";

import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "@/components/form/formField";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const resendSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ResendFormData = z.infer<typeof resendSchema>;

function LoginForm() {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [resending, setResending] = useState(false);
  const { refreshUser } = useAuth();
  const searchParams = useSearchParams();

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const resendMethods = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
    defaultValues: { email: "" },
  });

  async function onResend(data: ResendFormData) {
    setResending(true);
    setResendMsg("");

    try {
      await api("/resend-verification", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setResendMsg(
        "If an account exists and isn't verified, a new verification email has been sent."
      );
    } catch (err: any) {
      setResendMsg(err.message || "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  }

  async function onSubmit(data: LoginFormData) {
    setServerError("");
    setLoading(true);

    try {
      await api("/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      await refreshUser();
      const redirect = searchParams.get("redirect");
      window.location.href = redirect || "/home";
    } catch (err: any) {
      setServerError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center mb-4">Log In</h2>

          {serverError && (
            <div className="alert alert-error mb-4">
              <span>{serverError}</span>
            </div>
          )}

          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField name="email" label="Email" type="email" placeholder="Email" />

            <FormField
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="divider text-sm">OR</div>

          <Link
            href="/forgot-password"
            className="link link-primary text-center text-sm"
          >
            Forgot password?
          </Link>

          {!showResend ? (
            <button
              type="button"
              onClick={() => setShowResend(true)}
              className="link link-primary text-center text-sm"
            >
              Resend verification email
            </button>
          ) : (
            <FormProvider {...resendMethods}>
              <form
                onSubmit={resendMethods.handleSubmit(onResend)}
                className="flex flex-col gap-3 border-t border-base-300 pt-4"
              >
                <h3 className="text-sm font-semibold text-center">
                  Resend Verification Email
                </h3>
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Email"
                />
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={resending}
                >
                  {resending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Send Verification Email"
                  )}
                </button>
                {resendMsg && (
                  <div className="text-xs text-center text-base-content/70">
                    {resendMsg}
                  </div>
                )}
              </form>
            </FormProvider>
          )}

          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="link link-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </FormProvider>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense
        fallback={
          <span className="loading loading-spinner loading-lg"></span>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
