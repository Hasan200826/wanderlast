import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned, The Resorts Were Luxurious, And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!",
    name: "Sarah Johnson",
    location: "New York, USA",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "Exploring The Ancient Temples Of Kyoto Was A Dream Come True. Every Corner Revealed Something New, And The Local Cuisine Was Absolutely Outstanding.",
    name: "Emma Williams",
    location: "London, UK",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote:
      "The Safari In Tanzania Was Beyond Anything We Had Imagined. Spotting The Big Five At Sunrise And Staying In Tented Lodges Made It Pure Magic.",
    name: "David Kim",
    location: "Seoul, South Korea",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "From The Streets Of Marrakech To The Sahara Dunes, Every Moment Was Perfectly Organized. The Team Truly Cares About Making Your Trip Special.",
    name: "Sofia Rodriguez",
    location: "Barcelona, Spain",
    photo: "https://randomuser.me/api/portraits/women/26.jpg",
  },
];

export function TestimonialsSection() {
  return (
    <section className="w-full bg-white px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-12 md:py-14">
        <Carousel opts={{ align: "start" }}>
          {/* Heading + prev/next controls */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-3xl font-light tracking-tight text-zinc-900 md:text-4xl lg:text-5xl">
                What Travelers Say
              </h2>
              <p className="mt-3 text-xs text-zinc-500 md:text-sm">
                Real experiences from our happy travelers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CarouselPrevious className="static" size="icon-lg" />
              <CarouselNext className="static" size="icon-lg" />
            </div>
          </div>

          {/* Testimonial slides */}
          <CarouselContent className="mt-9 md:mt-12">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.name} className="md:basis-1/2">
                <figure className="flex h-full overflow-hidden border border-zinc-100 bg-white shadow-sm">
                  <div className="flex flex-1 flex-col px-6 py-6 md:px-7 md:py-7">
                    <blockquote className="text-sm leading-relaxed text-zinc-800">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                    <figcaption className="mt-6 md:mt-auto md:pt-6">
                      <p className="text-sm text-brand">
                        — {testimonial.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {testimonial.location}
                      </p>
                    </figcaption>
                  </div>
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.name}
                    width={180}
                    height={220}
                    sizes="(max-width: 768px) 128px, 176px"
                    className="h-full w-32 shrink-0 object-cover md:w-44"
                  />
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
