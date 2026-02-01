"use client";
import React, { useRef } from "react";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ExplorePage = () => {
  //Fetch current user for location...
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const router = useRouter();

  const { data: featuredEvents, isLoading: featuredLoading } = useConvexQuery(
    api.event.getFeaturedEvents,
    { limit: 3 },
  );


  const { data: localEvents, isLoading: localLoading } = useConvexQuery(
    api.event.getFeaturedEvents,
    {
      limit: 4,
    },
  );

  const { data: popularEvents, isLoading: popularLoading } = useConvexQuery(
    api.event.getPopularEvents,
    { limit: 5 },
  );

  const { data: categoryCounts } = useConvexQuery(api.event.getCategoryCount);

  const handleEventClick = (slug) => {
    router.push(`/event/${slug}`);
  }

  return (
    <>
      <div className="pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-5">Discover Events</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore featured events, find what&apos;s happening locally, or browse
          events across India
        </p>
      </div>

      {/* Featured carousel */}

      {featuredEvents && featuredEvents.length > 0 && (
        <div className="mb-16">
          <Carousel className={'w-full'} plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {featuredEvents.map((event) => (
                <CarouselItem key={event._id}>
                    <div
                    onClick={() => handleEventClick(event.slug)}
                    className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
                    >
                     {event.coverImage ? (<Image src={event.coverImage} alt={event.title} fill className="object-cover" priority/> ): (<div className="absolute inset-0" style={{backgroundColor: event.themeColor}}/>)}
                    </div>
                </CarouselItem>

              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {/* Local events */}

      {/* Browse events by category */}

      {/* Popular events across country */}

      {/* Empty state for no events */}
    </>
  );
};

export default ExplorePage;
