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
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

const ExplorePage = () => {
  //Fetch current user for location...
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const router = useRouter();

  const { data: featuredEvents, isLoading: loadingFeatured } = useConvexQuery(
    api.event.getFeaturedEvents,
    { limit: 3 },
  );


  const { data: localEvents, isLoading: loadingLocal } = useConvexQuery(
    api.event.getEventsByLocation,
    {
      city: currentUser?.location?.city,
      state: currentUser?.location?.state,
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

                     <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/30" />

                     <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                        <Badge className={'w-fit mb-4'} variant={'secondary'}>
                          {event.city} , {event.city || event.country}
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                          {event.title}
                        </h2>
                        <p className="text-lg text-white/50 mb-5 max-w-2xl line-clamp-2">
                          {event.description}
                        </p>

                        <div className="flex items-center gap-4 text-white/80">
                            <div className="flex items-center gap-2">
                               <Calendar className="w-5 h-5" />
                               <span className="text-sm">
                                {format(event.startDate , "PPP")}
                               </span>
                            </div>

                            <div className="flex items-center gap-2">
                                 <MapPin className="w-5 h-5" />
                                 <span className="text-sm">{event.city}</span>
                            </div>

                            <div className="flex items-center gap-2">
                               <Users className="w-5 h-5" />
                               <span className="text-sm">{event.registrationCount}</span>
                            </div>

                        </div>
                     </div>


                    </div>
                </CarouselItem>

              ))}
            </CarouselContent>
            <CarouselPrevious className={'left-3'} />
            <CarouselNext className={'right-4'} />
          </Carousel>
        </div>
      )}

      {/* Local events */}
      {localEvents && localEvents.length > 0 && (
        <div>
          
        </div>
      )}

      {/* Browse events by category */}

      {/* Popular events across country */}

      {/* Empty state for no events */}
    </>
  );
};

export default ExplorePage;
