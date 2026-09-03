"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Calendar } from "vanilla-calendar-pro";
import type { FormatDateString } from "vanilla-calendar-pro";

interface DateFieldProps {
  name: string;
  label: string;
  maxDate?: string;
}

function localToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DateField({ name, label, maxDate }: DateFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const calendarInstance = useRef<Calendar | null>(null);

  const value = (watch(name) as string) || "";
  const error = errors[name]?.message as string | undefined;
  const inputId = `${name}-input`;
  const max = (maxDate || localToday()) as FormatDateString;

  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input) return;

    const calendar = new Calendar(input, {
      inputMode: true,
      positionToInput: "auto",
      selectedDates: value ? [value] : [],
      dateMax: max,
      onClickDate: (self) => {
        const next = self.context.selectedDates[0] || "";
        setValue(name, next, { shouldValidate: true });
      },
    });
    calendar.init();
    calendarInstance.current = calendar;

    return () => {
      calendar.destroy();
      calendarInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const calendar = calendarInstance.current;
    if (calendar) {
      calendar.set({ selectedDates: value ? [value] : [] }, { month: false, year: false });
    }
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (input) input.value = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full">
      <input
        id={inputId}
        readOnly
        placeholder={label}
        className={`input input-bordered w-full cursor-pointer pr-10 ${error ? "input-error" : ""}`}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      {error && <span className="text-error text-xs mt-1 block">{error}</span>}
    </div>
  );
}
