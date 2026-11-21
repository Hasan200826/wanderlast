import { Suspense } from "react";
import {
  CalendarDaysIcon,
  CircleCheckIcon,
  ClockIcon,
  EyeIcon,
  InfoIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import BookingItemDeleteBtn from "@/components/BookingItemDeleteBtn";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";

type BookingStatus = "confirmed" | "pending";

/** Raw shape of a booking returned by the backend API. */
type ApiBooking = {
  _id: string;
  reference?: string;
  title?: string;
  destinationName?: string;
  imageUrl?: string;
  alt?: string;
  bookingDate?: string;
  departureDate?: string;
  price?: string | number;
  status?: string;
};

/** Normalized shape the UI renders. */
type Booking = {
  id: string;
  reference: string;
  title: string;
  imageUrl: string;
  alt: string;
  departure: string;
  price: number;
  status: BookingStatus;
};

const FALLBACK_IMAGE = "/destinations/detail-hero.jpg";

function toBooking(raw: ApiBooking): Booking {
  const title =
    raw.title?.trim() || raw.destinationName?.trim() || "Untitled destination";
  const imageUrl = raw.imageUrl?.trim() || FALLBACK_IMAGE;

  return {
    id: raw._id,
    reference: raw.reference?.trim() || "—",
    title,
    imageUrl,
    alt: raw.alt?.trim() || `${title} travel destination`,
    departure: raw.bookingDate?.trim() || raw.departureDate?.trim() || "—",
    price: Number(raw.price) || 0,
    status: raw.status === "pending" ? "pending" : "confirmed",
  };
}

async function fetchBookings(email: string): Promise<Booking[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/my-destinations/${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    return (data as ApiBooking[])
      .filter((item) => item && typeof item._id === "string")
      .map(toBooking);
  } catch {
    // Backend unreachable — show the empty state instead of crashing the page.
    return [];
  }
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const confirmed = status === "confirmed";
  return (
    <span
      className={
        confirmed
          ? "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-green-600 bg-green-100"
          : "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-amber-600 bg-amber-100"
      }
    >
      {confirmed ? (
        <CircleCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {confirmed ? "Confirmed" : "Pending"}
    </span>
  );
}

export default function BookingsPage() {
  return (
    <main>
      <div className="mx-auto max-w-6xl p-4 md:p-10 lg:p-16">
        <div className=" px-5 pt-5">
          <header className="-mt-5 -ml-5 pb-8">
            <h1 className="text-3xl font-light text-zinc-900 md:text-4xl lg:text-5xl">
              My Bookings
            </h1>
            <p className="mt-4 text-sm text-zinc-500 md:text-base">
              Manage and view your upcoming travel plans
            </p>
          </header>

          {/* Session + fetch read runtime data, so they stream behind Suspense */}
          <Suspense fallback={<BookingsListFallback />}>
            <BookingsList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function BookingsList() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;
  if (!email) redirect("/login");

  const bookings = await fetchBookings(email);

  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 px-6 py-12 text-center">
        <h2 className="font-serif text-xl font-bold text-zinc-900">
          No bookings yet
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          When you book a trip, it will show up here.
        </p>
        <Link
          href="/destinations"
          className="mt-5 inline-flex h-10 items-center justify-center bg-brand px-4 text-sm text-white hover:opacity-90"
        >
          Browse destinations
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-5">
      {bookings.map((booking) => (
        <li
          key={booking.id}
          className="flex flex-col gap-4 border-t border-b border-zinc-100 pt-5 pb-4 sm:flex-row"
        >
          <Image
            src={booking.imageUrl}
            alt={booking.alt}
            width={320}
            height={180}
            className=" aspect-video w-full object-cover sm:w-80"
          />

          <div className="flex flex-1 flex-col">
            <StatusBadge status={booking.status} />

            <h2 className="mt-1 font-serif text-2xl font-bold text-zinc-900 md:text-3xl">
              {booking.title}
            </h2>

            <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-500">
              <p className="flex items-center gap-2">
                <CalendarDaysIcon
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                Departure: {booking.departure}
              </p>
              <p className="flex items-center gap-2">
                <InfoIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                Booking ID: {booking.reference}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <span className="text-3xl font-bold text-brand">
                ${booking.price}
              </span>
              <div className="flex gap-3">
                <BookingItemDeleteBtn booking={booking} />
                <Link
                  href={`/destinations/${booking.id}`}
                  className=" flex items-center justify-center h-10 gap-2 bg-brand px-4 text-white hover:opacity-90"
                >
                  <EyeIcon className="h-4 w-4" aria-hidden="true" />
                  View
                </Link>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function BookingsListFallback() {
  return (
    <ul className="space-y-5">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="flex flex-col gap-4 border-t border-b border-zinc-100 pt-5 pb-4 sm:flex-row"
        >
          <Skeleton className="aspect-video w-full sm:w-80" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
            <div className="mt-auto flex items-center justify-between gap-4">
              <Skeleton className="h-9 w-24" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
