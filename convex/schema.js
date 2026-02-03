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
                    country: v.optional(v.string()),
                })
            ),

            //Interest fields
            interests: v.optional(v.array(v.string())),

            //Organizer tracking 
            freeEventsCreated: v.number(),

            createdAt: v.number(),
            updatedAt: v.number(),
    }).index("by_token", ["tokenIdentifier"]),

    ///Events Table...
    events: defineTable({
        title: v.string(),
        description: v.string(),
        slug: v.string(),

        //Organizer reference
        organizerId: v.id("users"),
        organizerName: v.string(),

        //Events details..
        category: v.string(),
        tags: v.array(v.string()),

        //Date and Time...
        startDate: v.number(),
        endDate: v.number(),
        timezone: v.string(),

        //Location..
        locationtype:  v.union(v.literal("physical"), v.literal("online")),
        venue: v.optional(v.string()),
        address: v.optional(v.string()),
        city: v.string(),
        state: v.optional(v.string()),
        country: v.optional(v.string()),

        //Capacity and tickets..
        capacity: v.number(),
        ticketType: v.union(v.literal("free"), v.literal("paid")),
        ticketPrice: v.optional(v.number()),  //Paid at event offline
        registrationCount: v.number(),

        //Customization...
        coverImage: v.optional(v.string()),
        themeColor: v.optional(v.string()),

        //Timestamps
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_organizer", ["organizerId"])
      .index("by_category", ["category"])
      .index("by_start_date" , ["startDate"])
      .index("by_slug", ["slug"])
      .searchIndex("search_tittle" , {searchField: "title"}),

    //Registrations Table...
    registrations: defineTable({
        //id of the event..
        eventId: v.id("events"),
        //id of the user..
        userId: v.id("users"),

        //Attendee details..
        attendeeName: v.string(),
        attendeeEmail: v.string(),

        //QR Code Information
        qrCode: v.string(),  //unique id for qr code generation

        //Check-in status...
        checkedIn: v.boolean(),
        checkedInAt: v.optional(v.number()),

        //Status....
        status: v.union(v.literal("registered"), v.literal("cancelled")),
        registeredAt: v.number(),



    })
    .index("by_user", ["userId"])
    .index("by_event", ["eventId"])
    .index("by_event_user", ["eventId", "userId"])
    .index("by_qrCode", ["qrCode"]),
})