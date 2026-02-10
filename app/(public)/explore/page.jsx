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
import { ArrowRight, Calendar, Loader, Loader2, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { createLocationSlug } from "@/lib/location-util";
import EventCard from "@/components/EventCard";
import { CATEGORIES } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

const ExplorePage = () => {
  //Fetch current user for location...
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  const router = useRouter();

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

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

  const categoryWithCounts = CATEGORIES.map((cat) => {
    return {
      ...cat,
      count: categoryCounts?.[cat.id] || 0,
    }
  })

  const handleEventClick = (slug) => {
    router.push(`/event/${slug}`);
  }

  const handleCategoryClick = (categoryid) => {
    router.push(`/event/${categoryid}`);
  }

  const handleViewLocalEvents = () => {
     const city = currentUser?.location?.city;
     const state = currentUser?.location?.state;

     const slug = createLocationSlug(city, state);
     router.push(`/explore/${slug}`);
  }

  //Loading state....
  const isLoading = loadingFeatured || loadingLocal || popularLoading;
  if(isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
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
          <Carousel plugins={[plugin.current]}
          className={'w-full'}
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
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
             <div>
              <h2 className="text-4xl font-bold mb-2">Events Near You</h2>
              <p className="text-muted-foreground">
                 Happening in {currentUser?.location?.city || "Your City"}
              </p>
             </div>

             <Button
             variant="outline"
             className={'gap-2'}
             onClick={handleViewLocalEvents}
             >
               View All  <ArrowRight className="w-4 h-4"/>
             </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {localEvents.map((event) => {
              <EventCard
              key={event._id}
              event={event}
              variant="grid"
              onClick={() => handleEventClick(event.slug)}
              />
            })}
          </div>
        </div>
      )}

      {/* Browse events by category */}

      <div className="mb-16">
        <h2 className="text-4xl font-bold mb-4">Browse by Category</h2>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryWithCounts.map((category) => {
            <Card
            key={category.id}
            className="py-2 group cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50"
            onClick={() => handleCategoryClick(category.id)}
            >
            <CardContent className="px-3 sm:p-6 flex items-center gap-4">
              <div className="text-3xl sm:text-4xl">{category.icon}</div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1.5 group-hover:text-purple-400 transition-colors">
                  {category.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {category.count} Event{category.count !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
            </Card>
          })}
       </div>

      </div>

      {/* Popular events across country */}

      {/* Empty state for no events */}
    </>
  );
};

export default ExplorePage;
