import { HeroSection } from "@/components/hero-section";
import { FeaturedDestinationsSection } from "@/components/featured-destinations-section";
import { WhyChooseSection } from "@/components/why-choose-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CtaSection } from "@/components/cta-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <HeroSection />
      <FeaturedDestinationsSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
