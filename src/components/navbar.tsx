"use client";

import { MenuIcon, UserIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "cn";
import { authClient } from "@/lib/auth-client";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "My Bookings", href: "/bookings" },
  { label: "Add-Destination", href: "/add-destination" },
];

const authLinks = [
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white">
      <div className="mx-auto grid h-14 w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
        {/* Left: hamburger (mobile) + primary navigation (desktop) */}
        <nav className="justify-self-start">
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center text-zinc-700 transition-colors hover:text-brand md:hidden"
          >
            {isMenuOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors hover:text-brand",
                    isActive ? "font-medium text-brand" : "text-zinc-700"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Center: brand */}
        <Link
          href="/"
          className="justify-self-center font-serif text-2xl font-bold tracking-tight text-brand"
        >
          Wanderlast
        </Link>

        {/* Right: profile + auth */}
        <div className="flex items-center justify-end gap-5">
          <Link
            href="/profile"
            className="hidden items-center gap-1.5 text-sm text-zinc-700 transition-colors hover:text-brand sm:flex"
          >
            <UserIcon className="size-4" />
            Profile
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name ?? "User"}
                />
                <AvatarFallback>
                  {getInitials(session.user.name ?? "U")}
                </AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
              <h2 className="hidden text-sm font-medium text-zinc-700 sm:block">
                {session.user.name}
              </h2>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-700 transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-black/5 bg-white md:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    "py-2.5 text-sm transition-colors hover:text-brand",
                    isActive ? "font-medium text-brand" : "text-zinc-700"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="my-1.5 h-px bg-black/5" />
            <Link
              href="/profile"
              onClick={closeMenu}
              className="flex items-center gap-1.5 py-2.5 text-sm text-zinc-700 transition-colors hover:text-brand"
            >
              <UserIcon className="size-4" />
              Profile
            </Link>
            {!session?.user && (
              <>
                <div className="my-1.5 h-px bg-black/5" />
                {authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="py-2.5 text-sm text-zinc-700 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
