import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "My Bookings", href: "/bookings" },
  { label: "My Profile", href: "/profile" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const socialLinks = [
  {
    label: "X",
    href: "https://x.com",
    variant: "fill",
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    variant: "fill",
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    variant: "stroke",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-10 md:pt-16">
        {/* Brand */}
        <div>
          <p className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Wanderlast
          </p>
          <p className="mt-3 max-w-md text-sm text-zinc-400">
            Your gateway to extraordinary travel experiences around the world.
          </p>
        </div>

        {/* Columns */}
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr] lg:gap-8">
          {/* Newsletter */}
          <div>
            <h2 className="text-xs font-semibold tracking-widest text-white uppercase">
              Newsletter
            </h2>
            <p className="mt-4 max-w-xs text-sm text-zinc-400">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <div className="mt-5 flex h-11 max-w-[240px] items-center rounded-sm bg-zinc-800 pr-2 pl-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Enter email
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter email"
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none"
              />
              <button
                type="button"
                aria-label="Subscribe to newsletter"
                className="flex h-8 w-8 shrink-0 items-center justify-center text-zinc-400 transition-colors hover:text-white"
              >
                <ArrowUpRightIcon className="size-4" />
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-xs font-semibold tracking-widest text-white uppercase">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h2 className="text-xs font-semibold tracking-widest text-white uppercase">
              Support
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xs font-semibold tracking-widest text-white uppercase">
              Contact Us
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="tel:7869911022"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  786-991-1022
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@wanderland.com"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  info@wanderland.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-6xl border-t border-white/10 px-6">
        <div className="flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-xs text-zinc-500">
            © 2026 Wanderlast. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-zinc-400 transition-colors hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill={social.variant === "stroke" ? "none" : "currentColor"}
                  stroke={social.variant === "stroke" ? "currentColor" : "none"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
