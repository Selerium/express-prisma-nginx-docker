"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";

interface DropdownOption {
  key: string;
  value: string;
}

interface SearchableDropdownProps {
  name: string;
  label: string;
  options: DropdownOption[];
  placeholder?: string;
}

export default function SearchableDropdown({
  name,
  label,
  options,
  placeholder = "Search...",
}: SearchableDropdownProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const currentValue = (watch(name) as string) || "";
  const error = errors[name]?.message as string | undefined;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedOption = options.find((o) => o.value === currentValue);

  const filtered = debouncedSearch
    ? options.filter((o) =>
        o.key.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : options;

  const debounce = useCallback((value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
        setDebouncedSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  function handleSelect(value: string) {
    setValue(name, value, { shouldValidate: true });
    setOpen(false);
    setSearch("");
    setDebouncedSearch("");
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearch(val);
    debounce(val);
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        className={`input input-bordered w-full text-left flex items-center justify-between cursor-pointer ${
          error ? "input-error" : ""
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={selectedOption ? "" : "text-base-content/40"}>
          {selectedOption ? selectedOption.key : placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-base-100 rounded-box border border-base-300 shadow-xl max-h-72 overflow-hidden flex flex-col">
          <div className="p-2">
            <input
              ref={searchRef}
              type="text"
              className="input input-bordered w-full input-sm"
              placeholder={placeholder}
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <ul className="menu bg-base-100 rounded-box overflow-y-auto flex-1 block w-full">
            {filtered.length === 0 && (
              <li className="text-base-content/40 text-sm py-2 text-center">
                No results found
              </li>
            )}
            {filtered.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={option.value === currentValue ? "active" : ""}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.key}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <span className="text-error text-xs mt-1 block">{error}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
}
