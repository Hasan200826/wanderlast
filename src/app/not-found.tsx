import type { Metadata } from "next";
import Link from "next/link";
import { CompassIcon, HouseIcon, MapIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | Wanderlast",
  description:
    "The page you are looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-20 text-center">
      <div className="w-full max-w-md">
        {/* Decorative compass */}
        <span
          aria-hidden="true"
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand/10"
        >
          <CompassIcon className="size-8 text-brand" />
        </span>

        <p className="mt-6 font-serif text-7xl leading-none font-bold tracking-tight text-brand">
          404
        </p>

        <h1 className="mt-4 text-3xl font-light tracking-tight text-zinc-900">
          Page not found
        </h1>

        <p className="mt-3 text-sm text-zinc-500 md:text-base">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved, or the link might be broken.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <HouseIcon className="size-4" aria-hidden="true" />
            Back to Home
          </Link>
          <Link
            href="/destinations"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            <MapIcon className="size-4" aria-hidden="true" />
            Browse Destinations
          </Link>
        </div>
      </div>
    </main>
  );
}
