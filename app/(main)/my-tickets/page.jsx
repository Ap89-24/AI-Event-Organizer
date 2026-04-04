/* eslint-disable react-hooks/purity */
"use client";

import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Loader2, Ticket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const MyTicketsPage = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const router = useRouter();
  console.log("selected ticket: " , selectedTicket);

  const { data: registrations, isLoading } = useConvexQuery(
    api.registrations.getMyRegistrations,
  );

  const { mutate: cancelRegistration, isLoading: isCancelling } =
    useConvexMutation(api.registrations.deleteRegistration);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  const now = Date.now();

  const upcomingTickets = registrations?.filter(
    (reg) =>
      reg.event && reg.event.startDate >= now && reg.status === "registered",
  );

  const pastTickets = registrations?.filter(
    (reg) =>
      reg.event && (reg.event.startDate < now || reg.status === "cancelled"),
  );

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm("Are you sure you want to cancel this registration?")) {
      return;
    }

    try {
      await cancelRegistration({ registrationId });
      toast.success("Registration cancelled successfully");
    } catch (error) {
      toast.error(error.message || "Failed to cancel registration");
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            View and manage your event registrations
          </p>
        </div>

        {/* Upcoming tickets */}
        {upcomingTickets?.length > 0 && (
          <div className="mb-12">
            <h1 className="text-2xl font-semibold mb-4">Upcoming Events</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTickets.map((registration) => (
                <EventCard
                  key={registration._id}
                  event={registration.event}
                  action="ticket"
                  onClick={() => setSelectedTicket(registration)}
                  onDelete={() => handleCancelRegistration(registration._id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past tickets */}

        {pastTickets?.length > 0 && (
          <div className="mb-12">
            <h1 className="text-2xl font-semibold mb-4">Past Events</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((registration) => (
                <EventCard
                  key={registration._id}
                  event={registration.event}
                  action={""}
                  className="cursor-default opacity-60"
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}

        {upcomingTickets?.length === 0 && pastTickets?.length === 0 && (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-7xl mb-2">🎟️</div>
              <h2 className="text-3xl font-semibold">No Ticket Found</h2>
              <p className="text-muted-foreground">
                You haven't registered for any events yet. 🚀 Book Your Spot now
              </p>
              <Button asChild className="gap-2">
                <Link href="/explore">
                  <Ticket className="w-5 h-5" />
                  Browse Events 🔍🔍
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* qr code modal */}
      {selectedTicket && (
        <Dialog
        open={!!selectedTicket}
        onOpenChange={() => 
            setSelectedTicket(null)
          }
        >
         
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyTicketsPage;
