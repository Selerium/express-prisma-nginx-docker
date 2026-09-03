"use client";

import { api } from "@/lib/api";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "@/components/form/formField";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const emailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  emailPassword: z.string().min(1, "Password is required"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function SettingsPage() {
  const [passwordMsg, setPasswordMsg] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [emailMsg, setEmailMsg] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  const passwordMethods = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const emailMethods = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newEmail: "", emailPassword: "" },
  });

  async function onPasswordChange(data: PasswordFormData) {
    setChangingPassword(true);
    setPasswordMsg("");

    try {
      await api("/profile/password", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setPasswordMsg("Password updated successfully.");
      passwordMethods.reset();
    } catch (err: any) {
      setPasswordMsg(err.message);
    } finally {
      setChangingPassword(false);
    }
  }

  async function onEmailChange(data: EmailFormData) {
    setChangingEmail(true);
    setEmailMsg("");

    try {
      await api("/profile/email", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: data.emailPassword,
          newEmail: data.newEmail,
        }),
      });
      setEmailMsg("Email updated successfully.");
      emailMethods.reset();
    } catch (err: any) {
      setEmailMsg(err.message);
    } finally {
      setChangingEmail(false);
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Change Password */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <h2 className="card-title">Change Password</h2>
          {passwordMsg && (
            <div
              className={`alert ${passwordMsg.includes("success") ? "alert-success" : "alert-error"} mb-2`}
            >
              <span>{passwordMsg}</span>
            </div>
          )}
          <FormProvider {...passwordMethods}>
            <form
              onSubmit={passwordMethods.handleSubmit(onPasswordChange)}
              className="flex flex-col gap-4"
            >
              <FormField
                name="currentPassword"
                label="Current Password"
                type="password"
                autoComplete="current-password"
              />

              <FormField
                name="newPassword"
                label="New Password"
                type="password"
                minLength={8}
                autoComplete="new-password"
              />

              <button
                type="submit"
                className="btn btn-primary self-start"
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>

      {/* Change Email */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Change Email</h2>
          {emailMsg && (
            <div
              className={`alert ${emailMsg.includes("success") ? "alert-success" : "alert-error"} mb-2`}
            >
              <span>{emailMsg}</span>
            </div>
          )}
          <FormProvider {...emailMethods}>
            <form
              onSubmit={emailMethods.handleSubmit(onEmailChange)}
              className="flex flex-col gap-4"
            >
              <FormField name="newEmail" label="New Email" type="email" placeholder="Email" />

              <FormField
                name="emailPassword"
                label="Current Password"
                type="password"
                autoComplete="current-password"
              />

              <button
                type="submit"
                className="btn btn-primary self-start"
                disabled={changingEmail}
              >
                {changingEmail ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Update Email"
                )}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
