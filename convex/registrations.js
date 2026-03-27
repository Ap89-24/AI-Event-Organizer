import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {  internal } from "./_generated/api";


const generateQRCode = () => {
    return `EVT-${Date.now()}-${Math.random().toString(36).substr(2,9).toUpperCase()}`;
}

export const registerForEvent = mutation({
    args: {
        eventId: v.id("events"),
        attendeeName: v.string(),
        attendeeEmail: v.string(),
    },

    handler: async(ctx , args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);

        const event = await ctx.db.get(args.eventId);
        if(!event){
            throw new Error("Event not found...");
        }

        //Check if event is full...
        if(event.registrationCount >= event.capacity){
            throw new Error("Event is Full...");
        }

        //check for existing user in the event.....
        const existingUser = await ctx.db
            .query("registrations")
            .withIndex("by_event_user" , (q) =>
            q.eq("eventId" , args.eventId).eq("userId" , user?.id)
            )
            .unique();

        if(existingUser){
            throw new Error("You are already register in this event...");
        };
        
        const qrCode = generateQRCode();
        const registrationId = await ctx.db.insert("registrations" , {
            eventId: args.eventId,
            userId: user._id,
            attendeeName: args.attendeeName,
            attendeeEmail: args.attendeeEmail,
            qrCode: qrCode,
            checkedIn: false,
            status: "Confirmed",
            registeredAt: Date.now(),
        })

        //Update the event Registration count.....
        await ctx.db.patch(args.eventId , {
            registrationCount: event.registrationCount + 1,
        });

        return registrationId;
    },
})

//Check if user is registered for a event or not.....
export const checkRegistration = query({
    args: {
        eventId: v.id("events"),
    },
    handler: async(ctx , args) => {
       const user = await ctx.runQuery(internal.users.getCurrentUser);
       
       const registration = ctx.db
       .query("registrations")
       .withIndex("by_event_user" , (q) => 
    q.eq("eventId" , args.eventId).eq("userId" , user?.id)
    )
    .unique();

    return registration;
    },
});

export  const getMyRegistrations = query({
    handler: async(ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);

        if (!user) {
            throw new Error("User not found");
        }
        const registrations = await ctx.db
          .query("registrations")
          .withIndex("by_user" , (q) => q.eq("userId" , user?._id))
          .order("desc")
          .collect();

        const registrationWithEvent = await Promise.all(
            registrations.map(async (reg) => {
                const event = await ctx.db.get(reg.eventId);
                return {...reg , event};
            })
        );
        
        return  registrationWithEvent;
    },
});

export const deleteRegistration = mutation({
    args: {
        registrationId: v.id("registrations")
    },

    handler: async(ctx , args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);

        const registration = await ctx.db.get(args.registrationId);
        if (!registration) {
            throw new Error("Registration not found");
        };

        if(registration.userId !== user?._id){
            throw new Error("You can only cancel your own registration");
        };

        const event = await ctx.db.get(registration.eventId);
        if (!event) {
            throw new Error("Event not found");
        };

        //Update registration status
        await ctx.db.patch(args.registrationId , {
            status: "cancelled",
        });
        
        //Decrement in registration count....
        if(event.registrationCount > 0){
            await ctx.db.patch(registration.eventId , {
                registrationCount: event.registrationCount - 1,
            });
        };

        return {success: true};
    },
})

