"use client";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Loader2 } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const EventDashboard = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId;

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQrScanner, setShowQrScanner] = useState(false);

  const { data: DashboardData, isLoading } = useConvexQuery(
    api.dashboard.getEventDashboard,
    { eventId },
  );

  //? Fetch registrations

  const { data: registrations, isLoading: registrationsLoading } =
    useConvexQuery(api.registrations.getMyRegistrations, { eventId });

  if (isLoading || registrationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!DashboardData) {
    notFound();
  }

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

  return <div>
    <div>
        
    </div>

    {/* OR Scanner model */}
  </div>;
};

export default EventDashboard;
