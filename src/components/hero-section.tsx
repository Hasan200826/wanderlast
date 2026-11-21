import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const searchFields = [
  { label: "Location", placeholder: "Dhaka,Bangladesh" },
  { label: "Date/Duration", placeholder: "Anytime/3 Days" },
  { label: "Budget", placeholder: "$0-$3000" },
  { label: "People", placeholder: "5-10" },
];



export function HeroSection() {
  return (
    <section className="relative flex min-h-[560px] w-full flex-col overflow-hidden md:min-h-[640px]">
      {/* Background image + overlay */}
      <Image
        src="/hero-beach.jpg"
        alt="Aerial view of a turquoise beach cove surrounded by green hills"
        fill
        loading="eager"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      {/* Centered hero content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="max-w-3xl text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-3 bg-brand px-7 py-3.5 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand/90"
          >
            Explore Now
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-3 bg-white/20 px-7 py-3.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            View Destination
          </Link>
        </div>
      </div>

      {/* Search bar pinned to the bottom of the hero */}
      <div className="relative z-10 border-t border-white/20 bg-black/50 backdrop-blur-sm">
        <div className="grid w-full grid-cols-2 md:grid-cols-[repeat(4,1fr)_auto]">
          {searchFields.map((field) => (
            <div
              key={field.label}
              className="border-b border-white/10 px-6 py-4 md:border-r md:border-b-0"
            >
              <p className="text-sm font-semibold text-white">{field.label}</p>
              <p className="mt-0.5 text-xs text-white/70">
                {field.placeholder}
              </p>
            </div>
          ))}
          <button
            type="button"
            className="col-span-2 flex items-center justify-center bg-brand px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-brand/90 md:col-span-1"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
