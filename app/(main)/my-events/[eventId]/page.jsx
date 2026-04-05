"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'

const EventDashboard = () => {

    const params = useParams();
    const router = useRouter();
    const eventId = params.eventId;

    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showQrScanner , setShowQrScanner] = useState(false);

  return (
    <div>
      
    </div>
  )
}

export default EventDashboard
