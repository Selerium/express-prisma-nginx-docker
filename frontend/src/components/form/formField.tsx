"use client";

import { useState, ReactNode } from "react";
import { useFormContext } from "react-hook-form";

interface FormFieldProps {
  name: string;
  label: string;
  type?: "email" | "password" | string;
  placeholder?: string;
  minLength?: number;
  step?: string | number;
  autoComplete?: string;
  icon?: ReactNode;
}

const MailIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const LockIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 8 10 8a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
    <path d="m10.58 10.58a2 2 0 0 0 2.83 2.83" />
  </svg>
);

export default function FormField({
  name,
  label,
  type = "text",
  placeholder,
  minLength,
  step,
  autoComplete,
  icon,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [visible, setVisible] = useState(false);
  const error = errors[name]?.message as string | undefined;

  const isEmail = type === "email";
  const isPassword = type === "password";
  const effectiveType = isPassword ? (visible ? "text" : "password") : type;
  const effectivePlaceholder = placeholder || (isEmail ? "Email" : (isPassword ? "Password" : "Enter text"));

  return (
    <div className="w-full">
      <label
        className={`input input-bordered flex items-center gap-2 w-full ${error ? "input-error" : ""}`}
      >
        {icon && <span className="text-base-content/40">{icon}</span>}
        {!icon && !isPassword && isEmail && (
          <span className="text-base-content/40">{MailIcon}</span>
        )}
        {!icon && isPassword && (
          <span className="text-base-content/40">{LockIcon}</span>
        )}
        <input
          type={effectiveType}
          className="grow"
          placeholder={effectivePlaceholder}
          minLength={minLength}
          step={step}
          autoComplete={autoComplete}
          {...register(name)}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            className="text-base-content/40 hover:text-base-content"
          >
            {visible ? EyeOffIcon : EyeIcon}
          </button>
        )}
      </label>
      {error && <span className="text-error text-xs mt-1 block">{error}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
}
