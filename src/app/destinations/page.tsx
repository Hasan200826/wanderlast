"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = `${process.env.NEXT_PUBLIC_API_URI}/destination`;

const FALLBACK_IMAGE = "/destinations/bali-paradise.jpg";

type Category =
  | "beach"
  | "mountain"
  | "city"
  | "adventure"
  | "cultural"
  | "wildlife";

type Destination = {
  id: string;
  name: string;
  country: string;
  category: Category;
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
  category?: string;
  price?: string | number;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
  rating?: number;
};

function mapDestination(raw: ApiDestination, index: number): Destination {
  const name = raw.destinationName?.trim() || "Untitled Destination";
  const country = raw.country?.trim() || "Unknown country";
  const category = raw.category?.trim().toLowerCase() ?? "";

  return {
    id: raw._id ?? `destination-${index}`,
    name,
    country,
    // Unknown or empty categories simply never match a specific filter.
    category: category as Category,
    price: Number(raw.price) || 0,
    duration: raw.duration?.trim() || "",
    rating:
      typeof raw.rating === "number" && Number.isFinite(raw.rating)
        ? raw.rating
        : null,
    image: raw.imageUrl?.trim() || FALLBACK_IMAGE,
    alt: `${name}, ${country}`,
  };
}

const categoryOptions = [
  { value: "all", label: "Category" },
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "city", label: "City" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "wildlife", label: "Wildlife" },
];

const priceOptions = [
  { value: "all", label: "Price Range" },
  { value: "under-2000", label: "Under $2,000" },
  { value: "2000-3000", label: "$2,000 - $3,000" },
  { value: "over-3000", label: "Over $3,000" },
];

const sortOptions = [
  { value: "featured", label: "Sort By" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const filterTriggerClassName =
  "h-11 w-full justify-between rounded-lg border-zinc-200 bg-white px-4 text-xs font-medium tracking-widest text-zinc-500 uppercase shadow-none";

function LoadingGrid() {
  return (
    <div
      className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading destinations"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-zinc-200 bg-white"
        >
          <Skeleton className="aspect-[16/10] w-full" />
          <div className="space-y-3 p-4">
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
    <div className="mt-16 flex flex-col items-center gap-3 text-center">
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

function NoDestinationsState() {
  return (
    <div className="mt-16 flex flex-col items-center gap-3 text-center">
      <p className="text-sm text-zinc-500">No destinations available yet.</p>
      <Link
        href="/add-destination"
        className="text-xs font-semibold tracking-widest text-brand uppercase transition-colors hover:text-brand/80"
      >
        Add One
      </Link>
    </div>
  );
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [reloadKey, setReloadKey] = useState(0);

  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

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
            mapDestination(item as ApiDestination, index),
          ),
        );
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("Failed to fetch destinations:", error);
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

  const filteredDestinations = useMemo(() => {
    let results = destinations.filter(
      (destination) => category === "all" || destination.category === category,
    );

    if (priceRange === "under-2000") {
      results = results.filter((destination) => destination.price < 2000);
    } else if (priceRange === "2000-3000") {
      results = results.filter(
        (destination) =>
          destination.price >= 2000 && destination.price <= 3000,
      );
    } else if (priceRange === "over-3000") {
      results = results.filter((destination) => destination.price > 3000);
    }

    if (sortBy === "price-asc") {
      results = [...results].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      results = [...results].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      results = [...results].sort(
        (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
      );
    }

    return results;
  }, [destinations, category, priceRange, sortBy]);

  const resetFilters = () => {
    setCategory("all");
    setPriceRange("all");
    setSortBy("featured");
  };

  let content: ReactNode;
  if (status === "loading") {
    content = <LoadingGrid />;
  } else if (status === "error") {
    content = <ErrorState onRetry={retry} />;
  } else if (destinations.length === 0) {
    content = <NoDestinationsState />;
  } else if (filteredDestinations.length > 0) {
    content = (
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDestinations.map((destination) => (
          <article
            key={destination.id}
            className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md"
          >
            {/* Image + rating badge */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={destination.image}
                alt={destination.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            </div>

            {/* Card body */}
            <div className="p-4">
              <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                <MapPinIcon className="size-3.5" aria-hidden="true" />
                {destination.country.toLocaleUpperCase()}
              </p>

              <div className="mt-2 flex items-baseline justify-between gap-3">
                <h2 className="text-base font-medium text-zinc-900 md:text-lg">
                  {destination.name.toLocaleUpperCase()}
                </h2>
                <p className="shrink-0 text-base font-semibold text-zinc-900 md:text-lg">
                  ${destination.price}
                  <span className="text-xs font-normal text-zinc-500">
                    /person
                  </span>
                </p>
              </div>

              <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                <CalendarDaysIcon className="size-3.5" aria-hidden="true" />
                {destination.duration}
              </p>

              <Link
                href={`/destinations/${destination.id}`}
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium tracking-widest text-brand uppercase transition-colors hover:text-brand/80"
              >
                Book Now
                <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    );
  } else {
    content = (
      <div className="mt-16 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-zinc-500">
          No destinations match your filters.
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-semibold tracking-widest text-brand uppercase transition-colors hover:text-brand/80"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      {/* Heading */}
      <h1 className="text-3xl font-light tracking-tight text-zinc-900 md:text-4xl">
        Explore All Destinations
      </h1>
      <p className="mt-3 text-xs text-zinc-500 md:text-sm">
        Find your perfect travel experience from our curated collection
      </p>

      {/* Filters */}
      <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Select
          value={category}
          onValueChange={(value) => setCategory(value ?? "all")}
        >
          <SelectTrigger
            aria-label="Filter by category"
            className={filterTriggerClassName}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priceRange}
          onValueChange={(value) => setPriceRange(value ?? "all")}
        >
          <SelectTrigger
            aria-label="Filter by price range"
            className={filterTriggerClassName}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value ?? "featured")}
        >
          <SelectTrigger
            aria-label="Sort destinations"
            className={filterTriggerClassName}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="mt-6 text-xs text-zinc-500 md:text-sm" aria-live="polite">
        {status === "ready" ? (
          <>
            Showing {filteredDestinations.length}{" "}
            {filteredDestinations.length === 1 ? "destination" : "destinations"}
          </>
        ) : (
          "Loading destinations..."
        )}
      </p>

      {/* Results */}
      {content}
    </div>
  );
}
