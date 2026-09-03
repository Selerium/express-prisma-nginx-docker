"use client";

import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, refreshUser } = useAuth();
  const pathname = usePathname();

  async function handleLogout() {
    try {
      await api("/logout", { method: "POST" });
    } catch {
      // logout clears cookies regardless
    }
    await refreshUser();
    window.location.href = "/login";
  }

  const navLinkClass = (href: string) =>
    `btn btn-ghost btn-sm ${
      pathname === href ? "btn-active" : ""
    }`;

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/home" className="btn btn-ghost text-xl">
          sampledomain
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/home" className={navLinkClass("/home")}>
              Home
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar placeholder"
          >
            <div className="bg-neutral text-neutral-content w-10 rounded-full">
              <span className="text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li className="menu-title">
              <span>{user?.name}</span>
            </li>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-error">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
