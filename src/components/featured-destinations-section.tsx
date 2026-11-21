"use client";

import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = "http://localhost:8000/destination";

const FALLBACK_IMAGE = "/destinations/bali-paradise.jpg";

type FeaturedDestination = {
  id: string;
  name: string;
  location: string;
  price: number;
  duration: string;
  rating: number | null;
  image: string;
  alt: string;
};

/** Shape of a document returned by the backend API. */
type ApiDestination = {
  _id?: string;
  destinationName?: string;
  country?: string;
  price?: string | number;
  duration?: string;
  imageUrl?: string;
  rating?: number;
};

function mapFeaturedDestination(
  raw: ApiDestination,
  index: number,
): FeaturedDestination {
  const name = raw.destinationName?.trim() || "Untitled Destination";
  const location = raw.country?.trim() || "Unknown country";

  return {
    id: raw._id ?? `destination-${index}`,
    name,
    location,
    price: Number(raw.price) || 0,
    duration: raw.duration?.trim() || "",
    rating:
      typeof raw.rating === "number" && Number.isFinite(raw.rating)
        ? raw.rating
        : null,
    image: raw.imageUrl?.trim() || FALLBACK_IMAGE,
    alt: `${name}, ${location}`,
  };
}

function LoadingCards() {
  return (
    <div
      className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-2 lg:grid-cols-[45%_45%]"
      aria-busy="true"
      aria-label="Loading featured destinations"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="aspect-[16/10] w-full" />
          <div className="space-y-3 px-1 pt-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3 py-10 text-center md:mt-10">
      <p className="text-sm text-zinc-500">
        Couldn&apos;t load destinations. Make sure the API is running on
        localhost:8000.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="text-xs font-semibold tracking-widest text-brand uppercase transition-colors hover:text-brand/80"
      >
        Try Again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 flex flex-col items-center gap-3 py-10 text-center md:mt-10">
      <p className="text-sm text-zinc-500">No featured destinations yet.</p>
      <Link
        href="/add-destination"
        className="text-xs font-semibold tracking-widest text-brand uppercase transition-colors hover:text-brand/80"
      >
        Add One
      </Link>
    </div>
  );
}

export function FeaturedDestinationsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [destinations, setDestinations] = useState<FeaturedDestination[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data: unknown) => {
        if (cancelled) return;
        const items = Array.isArray(data) ? data : [];
        setDestinations(
          items.map((item, index) =>
            mapFeaturedDestination(item as ApiDestination, index),
          ),
        );
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("Failed to fetch featured destinations:", error);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  };

  useEffect(() => {
    if (!api) return;

    const onSelect = (carouselApi: CarouselApi) => {
      if (carouselApi) setCurrent(carouselApi.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="w-full bg-white px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-12 md:py-14">
        {/* Heading + "all destinations" link */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-3xl font-light tracking-tight text-zinc-900 md:text-4xl lg:text-5xl">
              Featured Destinations
            </h2>
            <p className="mt-3 text-xs text-zinc-500 md:text-sm">
              Hand-picked local experiences for the adventurous explorer
            </p>
          </div>
          <Link
            href="/destinations"
            className="inline-flex shrink-0 items-center gap-3 self-start rounded-lg border border-brand/50 px-5 py-2.5 text-xs font-semibold tracking-widest text-brand uppercase transition-colors hover:bg-brand/5"
          >
            All Destinations
            <ArrowRightIcon className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        {status === "loading" && <LoadingCards />}
        {status === "error" && <ErrorState onRetry={retry} />}
        {status === "ready" && destinations.length === 0 && <EmptyState />}

        {/* Destination cards */}
        {status === "ready" && destinations.length > 0 && (
          <Carousel opts={{ align: "start", loop: false }} setApi={setApi}>
            <CarouselContent className="mt-8 md:mt-10">
              {destinations.slice(0,4).map((destination) => (
                <CarouselItem
                  key={destination.id}
                  className="basis-full md:basis-1/2 lg:basis-[45%]"
                >
                  <article className="flex h-full flex-col">
                    {/* Image with rating + location badges */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={destination.image}
                        alt={destination.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {destination.rating !== null && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-sm">
                          {destination.rating.toFixed(1)}
                          <StarIcon
                            className="size-3 fill-zinc-900 text-zinc-900"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm">
                        <MapPinIcon
                          className="size-3 text-brand"
                          aria-hidden="true"
                        />
                        {destination.location}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col px-1 pt-4 pb-1">
                      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <MapPinIcon className="size-3.5" aria-hidden="true" />
                        {destination.location}
                      </p>

                      <div className="mt-1.5 flex items-baseline justify-between gap-3">
                        <h3 className="text-lg font-normal text-zinc-900 md:text-xl">
                          {destination.name}
                        </h3>
                        <p className="shrink-0 text-lg font-semibold text-zinc-900 md:text-xl">
                          ${destination.price}
                          <span className="text-xs font-normal text-zinc-500">
                            /night
                          </span>
                        </p>
                      </div>

                      {destination.duration && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                          <CalendarDaysIcon
                            className="size-3.5"
                            aria-hidden="true"
                          />
                          {destination.duration}
                        </p>
                      )}

                      <Link
                        href={`/destinations/${destination.id}`}
                        className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-semibold tracking-widest text-brand uppercase transition-colors hover:text-brand/80"
                      >
                        Book Now
                        <ArrowRightIcon
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Pagination counter + prev/next controls */}
            <div className="mt-8 flex items-center justify-between">
              <p
                className="text-sm text-zinc-500"
                aria-live="polite"
                aria-label={`Slide ${current + 1} of ${destinations.length}`}
              >
                {current + 1}/ 5
                {/* {destinations.length} */}
              </p>
              <div className="flex items-center gap-3">
                <CarouselPrevious className="static" size="icon-lg" />
                <CarouselNext className="static" size="icon-lg" />
              </div>
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
}
