"use client";
import { api } from '@/convex/_generated/api';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'

const EventPage = () => {
   
    const params = useParams();
    const router = useRouter();

    const {user} = useUser();
    const [showRegistrationModal , setShowRegistrationModal] = useState(false);

    const {data: event , isLoading} = useConvexQuery(api.createEvents.getEventBySlug , {
        slug: params.slug,
    });
  


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

        console.log("PARAMS:", params);
    console.log("SLUG:", params?.slug);
    console.log("EVENT:", event);
    console.log("THEME COLOR:", event?.themeColor);

    if(!isLoading && !event){
        notFound();
    };




  return (
    <div
    style={{backgroundColor: event.themeColor || "#1e3a8a",}}
    className="min-h-screen py-8 -mt-6 md:-mt-16 lg:-mx-5"
    >
      event
    </div>
  )
}

export default EventPage
