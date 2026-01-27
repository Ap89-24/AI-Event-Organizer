import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";





export default defineSchema({
    //Users table
    users: defineTable({
          name: v.string(),
          tokenIdentifier: v.string(),   //clerk ID fro authentication
            email: v.string(),
            profileImageUrl: v.optional(v.string()),

            //Onboarding fields
            hasCompletedOnboarding: v.boolean(),

            //Location fields
            location: v.optional(
                v.object({
                    city: v.string(),
                    state: v.optional(v.string()),
                    country: v.string(),
                })
            ),

            //Interest fields
            interests: v.optional(v.array(v.string())),

            //Organizer tracking 
            freeEventsCreated: v.number(),

            createdAt: v.number(),
            updatedAt: v.number(),
    }).index("by_token", ["tokenIdentifier"]),
})