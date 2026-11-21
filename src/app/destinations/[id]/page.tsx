import { Suspense } from "react";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import EditDestination from "@/components/EditDestination";
import DeleteDestination from "@/components/deleteDestination";
import BookNowBtn from "@/components/BookNowBtn";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type PageProps = {
  params: Promise<{ id: string }>;
};

/** Shape of a destination document returned by the backend API. */
type ApiDestination = {
  destinationName?: string;
  country?: string;
  price?: string | number;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
};

const overviewText =
  "Discover the magic of Bali with pristine beaches, ancient temples, and vibrant culture. Experience luxury resorts, tropical landscapes, and unforgettable sunsets.";

const highlights = [
  "Luxury beachfront accommodation",
  "Private guided temple tours",
  "Daily breakfast included",
  "Airport transfers included",
  "Sunset cruise experience",
  "Spa and wellness access",
  "Island hopping boat trip",
  "Romantic beachfront dinner",
];

const includedFeatures = [
  "Free cancellation available",
  "Travel insurance included",
  "24/7 customer support",
];


async function fetchDestination(id: string): Promise<ApiDestination | null> {
  try {
    const jwtToken = await auth.api.getToken({
     headers:await headers(),
    })

    console.log(jwtToken?.token);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/${id}`,{
      headers:{
        authorization:`Bearer ${jwtToken.token}`
      }
    });
    if (!res.ok) return null;

    // The API answers with an empty body when the destination doesn't exist.
    const text = await res.text();
    if (!text) return null;

    const data: unknown = JSON.parse(text);
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return data as ApiDestination;
    }
    return null;
  } catch {
    // Backend unreachable — fall back to the demo content below.
    return null;
  }
}

export default async function DestinationDetailsPage({ params }: PageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6">
      {/* Toolbar — params/fetch must stay inside Suspense for prerendering */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-700 transition-colors hover:text-brand"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          Back to Destinations
        </Link>
        <div className="flex items-center gap-2">
          <Suspense fallback={<ToolbarActionsFallback />}>
            <ToolbarActions params={params} />
          </Suspense>
        </div>
      </div>

      {/* Data-dependent content (params + fetch must live inside Suspense) */}
      <Suspense fallback={<DetailsFallback />}>
        <DestinationDetails params={params} />
      </Suspense>
    </div>
  );
}

/** Edit/Delete buttons need the fetched destination — streamed separately. */
async function ToolbarActions({ params }: PageProps) {
  const { id } = await params;
  const destination = await fetchDestination(id);

  return (
    <>
      <EditDestination destination={destination} />
      <DeleteDestination destination={destination} />
    </>
  );
}

function ToolbarActionsFallback() {
  return (
    <>
      <Skeleton className="h-9 w-20 rounded-lg" />
      <Skeleton className="h-9 w-20 rounded-lg" />
    </>
  );
}

async function DestinationDetails({ params }: PageProps) {
  const { id } = await params;
  const destination = await fetchDestination(id);

  const name = destination?.destinationName?.trim() || "Bali Paradise";
  const duration = destination?.duration?.trim() || "7 Days / 6 Nights";
  const price = destination ? Number(destination.price) || 0 : 1299;
  const overview = destination?.description?.trim() || overviewText;
  const heroImage = destination?.imageUrl?.trim() || "/destinations/detail-hero.jpg";
  const heroAlt = destination?.imageUrl
    ? `${name} travel destination`
    : "Airplane wing soaring above the clouds at sunset";

  return (
    <>
      {/* Hero image */}
      <div className="mt-4 overflow-hidden rounded-lg">
        <Image
          src={heroImage}
          alt={heroAlt}
          width={1400}
          height={930}
          priority
          sizes="(max-width: 1024px) 100vw, 1152px"
          className="h-56 w-full object-cover md:h-72 lg:h-80"
        />
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main column */}
        <div>
          <h1 className="text-3xl font-light tracking-tight text-zinc-900 md:text-4xl">
            {name}
          </h1>

          {/* Rating + duration */}
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600">
            <span className="flex items-center gap-1.5">
              <StarIcon
                className="size-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              <span className="font-medium text-zinc-900">4.9</span>
              <span className="text-zinc-500">(34 reviews)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDaysIcon
                className="size-4 text-zinc-500"
                aria-hidden="true"
              />
              {duration}
            </span>
          </div>

          {/* Overview */}
          <section className="mt-6">
            <h2 className="text-sm font-semibold text-zinc-900">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              {overview}
            </p>
          </section>

          {/* Highlights */}
          <section className="mt-6">
            <h2 className="text-sm font-semibold text-zinc-900">Highlights</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              {overview}
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-zinc-600"
                >
                  <CheckIcon
                    className="mt-0.5 size-4 shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Booking sidebar */}
        <aside className="border-t border-zinc-200 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          {/* Price */}
          <div className="text-center">
            <p className="text-xs text-zinc-500">Starting from</p>
            <p className="mt-1 text-3xl font-bold text-green-600">${price}</p>
            <p className="mt-1 text-xs text-zinc-500">per person</p>
          </div>

          {/* Booking form */}
          <div className="mt-5 border-t border-zinc-200 pt-5">
            <BookNowBtn destination={destination} />

            <ul className="mt-5 space-y-2.5">
              {includedFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-zinc-600"
                >
                  <CheckIcon
                    className="size-4 shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}

function DetailsFallback() {
  return (
    <div>
      <Skeleton className="h-56 w-full rounded-lg md:h-72 lg:h-80" />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-2/3 max-w-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="mx-auto h-8 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}
