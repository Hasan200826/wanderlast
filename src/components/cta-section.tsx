import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden px-4 py-14 md:py-20">
      {/* Background image + overlay */}
      <Image
        src="/hero-beach.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {/* Dashed content box */}
      <div className="relative mx-auto max-w-5xl px-6 py-12 text-center md:py-16">
        <h2 className="text-3xl font-light tracking-tight text-white md:text-4xl lg:text-5xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-3 text-xs leading-relaxed text-white/80 md:text-sm">
          Join thousands of travelers who have discovered the world with us.
        </p>
        <Link
          href="/destinations"
          className="mt-8 inline-flex items-center gap-3 bg-white px-7 py-3.5 text-xs font-semibold tracking-widest text-zinc-900 uppercase transition-colors hover:bg-white/90"
        >
          Book Your Trip Today
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  );
}
