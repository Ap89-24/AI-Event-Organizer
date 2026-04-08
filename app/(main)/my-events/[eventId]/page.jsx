"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const EventDashboard = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId;

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQrScanner, setShowQrScanner] = useState(false);

  const { data: DashboardData, isLoading } = useConvexQuery(
    api.dashboard.getEventDashboard,
    { eventId },
  );

  //? Fetch registrations

  const { data: registrations, isLoading: registrationsLoading } =
    useConvexQuery(api.registrations.getEventRegistrations, { eventId });

  if (isLoading || registrationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!DashboardData) {
     return <div>No Dashboard Data Found</div>;
  }

// console.log("DashboardData:", DashboardData);
// console.log("eventId:", eventId);

  const {event , stats} = DashboardData;

  //! Filter registrations based on active tab and search query...
  const filterRegistrations = registrations.filter((reg) => {
    const matchesSearch = reg.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.qrCode.toLowerCase().includes(searchQuery.toLowerCase());

        if(activeTab === "all"){
            return matchesSearch && reg.status === "registered";
        };

        if(activeTab === "checked-in"){
            return matchesSearch && reg.checkedIn && reg.status === "registered";
        };

        if(activeTab === "pending"){
            return matchesSearch && !reg.checkedIn && reg.status === "registered";
        };

        return matchesSearch;
  });

  return <div className="min-h-screen pb-20 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
         <Button
         variant="ghost"
         onClick={() => router.push("/my-events")}
         className="gap-2 -ml-2"
         >
          <ArrowLeft className="w-5 h-5" />
          Back to My Events
         </Button>
      </div>

      {event.coverImage && (
        <div className="relative h-[350px] rounded-2xl overflow-hidden mb-6">
           <Image
           src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
           />
        </div>
      )}

      <div className="flex flex-col gap-5 sm:flex-row items-start justify-between mb-4">
         <div className="flex-1">
           <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
         </div>
      </div>

    </div>

    {/* OR Scanner model */}
  </div>;
};

export default EventDashboard;
