/* eslint-disable react-hooks/purity */
"use client";

import EventCard from '@/components/EventCard';
import { api } from '@/convex/_generated/api';
import { useConvexMutation, useConvexQuery } from '@/hooks/use-convex-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const MyTicketsPage = () => {

    const [selectedTicket , setSelectedTicket] = useState(null);
    const router = useRouter();

    const {data: registrations , isLoading} = useConvexQuery(
        api.registrations.getMyRegistrations
    );

    const {mutate: cancelRegistration , isLoading: isCancelling} = useConvexMutation(
        api.registrations.cancelRegistration
    );

    
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  };

  const now = Date.now();

  const upcomingTickets = registrations?.filter(
    (reg) => 
        reg.event && reg.event.startDate >= now && reg.status === "confirmed"
  );

    const pastTickets = registrations?.filter(
    (reg) => 
        reg.event && (reg.event.startDate < now || reg.status === "cancelled")
  );

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-2">My Tickets</h1>
            <p className="text-muted-foreground">View and manage your event registrations</p>
          </div>

        {/* Upcoming tickets */}
        {upcomingTickets?.length > 0 && (
          <div className="mb-12">
            <h1 className="text-2xl font-semibold mb-4">Upcoming Events</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {upcomingTickets.map((registration) => (
                <EventCard key={registration._id} event={registration.event} />
               ))}
            </div>
          </div>
        )}

        {/* Past tickets */}

        {/* Empty state */}

      </div>

      {/* qr code modal */}
    </div>
  )
}

export default MyTicketsPage
