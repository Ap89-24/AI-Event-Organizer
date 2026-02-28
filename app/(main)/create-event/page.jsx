"use client";

import React from 'react'
import z from 'zod';


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
  return (
    <div>
      event
    </div>
  )
}

export default CreateEvent
