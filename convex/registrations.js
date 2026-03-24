import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";


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
            registeredAt: new Date.now(),
        })

        //Update the event Registration count.....
        await ctx.db.patch(args.eventId , {
            registrationCount: event.registrationCount + 1,
        });

        return registrationId;
    },
})

//Check if user is registered for a event or not.....
export const checkRegistration = mutation({
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
})