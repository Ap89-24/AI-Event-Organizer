/* eslint-disable react-hooks/incompatible-library */
"use client";

import { api } from '@/convex/_generated/api';
import { useConvexMutation, useConvexQuery } from '@/hooks/use-convex-query';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { City, State } from 'country-state-city';


// HH:MM in 24h
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
    title: z.string().min(5 , "Title must be at least 5 character long"),
    description: z
          .string()
          .min(20 , "Description must be at least 20 character long"),
    category: z.string().min(1 , "Please select a category"),

    startDate: z.date({required_error: "Start date in require"}),
    endDate: z.date({required_error: "End date in require"}),
    startTime: z.string().regex(timeRegex , "Start time must be HH:MM"),
    endTime: z.string().regex(timeRegex , "End time must be HH:MM"),

    locationType: z.enum(["physical" , "online"]).default("physical"),
    venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    address: z.string().optional(),
    city: z.string().min(1 , "City is required"),
    state: z.string().optional(),

    capacity: z.number().min(1 , "Capacity must be at least 1"),
    ticketType: z.enum(["free" , "paid"]).default("free"),
    ticketPrice: z.number().optional(),
    coverImage: z.string().optional(),
    themeColor: z.string().default("#1e3a8a"),
});
const CreateEvent = () => {

  const router = useRouter();
  
  const [showImagePicker , setShowImagePicker] = useState(false);
  const [showUpgradeModal , setShowUpgradeModal] = useState(false);
  const [upgradeReason , setUpgradeReason] = useState("limit");   //limit or color......

  //check if user has a pro plan oe not....
  const { has } = useAuth();
  const hasPro = has?.({plan: "pro"});

  const {data: currentUser} = useConvexQuery(api.users.getCurrentUser);
  const {mutate: createEvent , isLoading} = useConvexMutation(api.event.CreateEvent);


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: {errors},
  } =  useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      locationType: "physical",
      ticketType: "free",
      capacity: 50,
      themeColor: "1e3a8a",
      category: "",
      state: "",
      city: "",
      startTime: "",
      endTime: "",
    }
  });

  const themeColor = watch("themeColor");
  const ticketType = watch("ticketType");
  const selectedState = watch("state");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const coverImage = watch("coverImage");

   const IndianStates = State.getStatesOfCountry("IN");

  const cities = useMemo(() => {
    if (!selectedState) return [];
    const st = IndianStates.find((s) => s.name === selectedState);
    if (!st) return [];
    return City.getCitiesOfState("IN", st.isoCode);
  }, [selectedState, IndianStates]);

  //Color presets = show all for pro users and default for free ones....
  const colorPresets = [
    "#1e3a8a",
    ...(hasPro ? ["#4c1d95", "#065f46", "#92400e", "#7f1d1d", "#831843"] : [])
  ]

  return (
    <div>
      event
    </div>
  )
}

export default CreateEvent
