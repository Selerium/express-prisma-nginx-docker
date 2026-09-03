"use client";

import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "@/components/form/formField";
import DateField from "@/components/form/dateField";

const onboardingSchema = z.object({
  gender: z.enum(["MALE", "FEMALE"]),
  dob: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  phone: z.string().min(1, "Phone is required"),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      gender: "MALE",
      dob: "",
      nationality: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user && !user.firstTime) {
      router.replace("/home");
    }
  }, [user, router]);

  async function onSubmit(data: OnboardingFormData) {
    setError("");
    setLoading(true);

    try {
      await api("/profile/first-time", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await refreshUser();
      router.replace("/home");
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <FormProvider {...methods}>
        <div className="card w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl justify-center mb-2">
              Complete Your Profile
            </h2>
            <p className="text-base-content/60 text-center mb-4">
              Tell us a bit about yourself to get started.
            </p>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    className="radio radio-primary"
                    value="MALE"
                    {...methods.register("gender")}
                  />
                  Male
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    className="radio radio-primary"
                    value="FEMALE"
                    {...methods.register("gender")}
                  />
                  Female
                </label>
              </div>

              <DateField name="dob" label="Date of Birth" />

              <FormField name="nationality" label="Nationality" placeholder="Nationality" />

              <FormField name="phone" label="Phone" type="tel" placeholder="Phone Number" />

              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Get Started"
                )}
              </button>
            </form>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
