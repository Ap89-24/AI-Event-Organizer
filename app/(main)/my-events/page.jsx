"use client";
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useConvexMutation, useConvexQuery } from '@/hooks/use-convex-query';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

const MyEventPage = () => {

    const router = useRouter();
    const {data: events , isLoading} = useConvexQuery(api.events.getEventsByOrg);
    const {mutate: deleteEvent} = useConvexMutation(api.events.deleteEvent);

      const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteEvent({ eventId });
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
    }
  };

    if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  const handleEventClick = (eventId) => {
    router.push(`/my-events/${eventId}`);
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">My Events</h1>
          <p className="text-muted-foreground">
            Manage your created Events
          </p>
        </div>
        </div>

        {events?.length === 0 ? (
        <Card>
                         <div className="max-w-md mx-auto space-y-4">
              <div className="text-7xl mb-2">🎟️</div>
              <h2 className="text-3xl font-semibold">No Events Yet</h2>
              <p className="text-muted-foreground">
                Create your first event and start organizing unforgettable experiences for your attendees!
              </p>
              <Button asChild className="gap-2">
                <Link href="/explore">
                  <Plus className="w-5 h-5" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
        </Card>) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events?.map((event) => (
                    <EventCard
                    key={event._id}
                    event={event}
                    action="event"
                    onClick={() => handleEventClick(event._id)}
                    onDelete={handleDeleteEvent}
                    />
                ))}
            </div>)}
        </div>
  )
}

export default MyEventPage
