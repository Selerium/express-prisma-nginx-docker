"use client";

import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "@/components/form/formField";

interface Profile {
  createdAt: string;
  user: { name: string; email: string };
  role: string;
  firstTime: boolean;
  gender: string | null;
  dob: string | null;
  nationality: string | null;
  phone: string | null;
}

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  nationality: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "", nationality: "" },
  });

  useEffect(() => {
    api<Profile>("/profile")
      .then((res) => {
        setProfile(res.data);
        methods.reset({
          name: res.data.user.name,
          phone: res.data.phone || "",
          nationality: res.data.nationality || "",
        });
      })
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(data: ProfileFormData) {
    setSaving(true);
    setError("");

    try {
      const res = await api<Profile>("/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setProfile(res.data);
      await refreshUser();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <FormProvider {...methods}>
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <h2 className="card-title">Personal Info</h2>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField name="name" label="Name" />

              <FormField name="phone" label="Phone" type="tel" />

              <FormField name="nationality" label="Nationality" />

              <div className="text-sm text-base-content/60">
                <p>Email: {profile?.user.email}</p>
                <p>Role: {profile?.role}</p>
              </div>

              <button
                type="submit"
                className="btn btn-primary self-start"
                disabled={saving}
              >
                {saving ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
