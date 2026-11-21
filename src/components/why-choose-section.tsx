import { HeadphonesIcon, MapIcon, ShieldCheckIcon } from "lucide-react";

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: MapIcon,
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="w-full bg-[#e9f7fc] px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-12 md:py-16">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-light tracking-tight text-zinc-900 md:text-4xl lg:text-5xl">
            Why Choose Wanderlust
          </h2>
          <p className="mt-3 text-xs text-zinc-500 md:text-sm">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white px-7 py-8 md:px-8 md:py-9"
            >
              <feature.icon
                className="size-7 text-brand"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <h3 className="mt-6 text-lg font-normal text-zinc-900 md:text-xl">
                {feature.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500 md:text-[13px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
