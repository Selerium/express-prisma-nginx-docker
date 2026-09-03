"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "@/components/form/formField";

const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setError("");
    setLoading(true);

    try {
      await api("/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setSuccess(data.email);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Check your email</h2>
            <p className="text-base-content/60">
              We sent a verification link to <strong>{success}</strong>.
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
              Create Account
            </h2>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField name="fullName" label="Full Name" />

              <FormField name="email" label="Email" type="email" placeholder="Email" />

              <FormField
                name="password"
                label="Password"
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
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
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
