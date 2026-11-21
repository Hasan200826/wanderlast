"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  /** The value that was thrown — may not be an `Error`, so narrow before use. */
  error: unknown;
  /** Re-fetches and re-renders the segment's children. */
  retry: () => void;
};

/**
 * Server-side errors are forwarded with an auto-generated `digest` hash so
 * they can be matched against server logs. It isn't part of the standard
 * `Error` type, so read it defensively.
 */
function readDigest(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;
  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" ? digest : null;
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === "development";
  const message = error instanceof Error ? error.message : null;
  const digest = readDigest(error);

  return (
    <main
      role="alert"
      className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-center dark:bg-black"
    >
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
      >
        <TriangleAlertIcon className="size-6" />
      </span>

      <h1 className="mt-6 text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">
        Something Went Wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        We hit a bump on the road while loading this page. It might be
        temporary. Try again, or head back home.
      </p>

      {/* The real message only surfaces in development. In production the
          digest is safe to show and matches the corresponding server log. */}
      {(isDevelopment && message) || digest ? (
        <p className="mt-6 max-w-lg rounded-lg border border-zinc-200 bg-white px-4 py-3 font-mono text-xs break-words text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          {isDevelopment && message ? message : null}
          {isDevelopment && message && digest ? " · " : null}
          {digest ? `Reference: ${digest}` : null}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {/* Attempt to recover by re-fetching and re-rendering the segment */}
        <Button
          type="button"
          onClick={() => retry()}
          className="h-10 bg-brand px-6 text-white hover:bg-brand/90"
        >
          Try Again
        </Button>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Back To Home
        </Link>
      </div>
    </main>
  );
}
