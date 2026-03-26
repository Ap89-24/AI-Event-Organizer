"use client";
import { Badge } from '@/components/ui/badge';
import { api } from '@/convex/_generated/api';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { getCategoryIcon, getCategoryLabel } from '@/lib/data';
import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns';
import { Calendar, Loader2 } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'

const EventPage = () => {
   
    const params = useParams();
    const router = useRouter();

    const {user} = useUser();
    const [showRegistrationModal , setShowRegistrationModal] = useState(false);

    const slug = Array.isArray(params.slug) 
  ? params.slug[0] 
  : params.slug;

    const {data: event , isLoading} = useConvexQuery(api.events.getEventBySlug , 
        slug ? {slug} : "skip"
    );
  


    const {data: registration} = useConvexQuery(api.registrations.checkRegistration,
        event?._id ? {eventId: event._id} : "skip"
    );

    if(isLoading){
        return(
            <div className="min-h-screen flex items-center justify-center">
               <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        )
    };

    console.log("EVENT:", event);
console.log("SLUG:", params.slug);

if (event === undefined) {
  return <div>Loading...</div>; // ⏳
}

if (event === null) {
  notFound(); // ❌
}



const style = event?.themeColor?.includes("gradient")
  ? { background: event.themeColor }
  : { backgroundColor: event?.themeColor || "#1e3a8a" };

  return (
    <div
    style={style}
    className="min-h-screen w-full pt-6 md:pt-16 lg:mx-5"
    >
      {/* UI */}
      <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
             <Badge variant="secondary" className="mb-5">
                 {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
             </Badge>
             <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>

             <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                   <Calendar className="w-5 h-5" />
                   <span>{format(event.startDate , "EEEE, MMM dd, yyyy")}</span>
                </div>
             </div>
          </div>
      </div>

      {/* Register Modal */}
    </div>
  )
}

export default EventPage
