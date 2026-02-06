import React from 'react'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { getCategoryIcon } from '@/lib/data'
import { format } from 'date-fns'
import { MapPin, Users } from 'lucide-react'
import { Badge } from './ui/badge'

const EventCard = ({
    event,
    onClick,
    showActions = false,
    onDelete,
    variant = "grid",
    className = ''
}) => {

    if(variant === "list"){
        return (
            <Card
            className={`py-0 group cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 ${className}`}
            onClick={onClick}
            >
                <CardContent className={'p-3 flex gap-3'}>
                     <div className='w-20 h-20 rounded-lg shrink-0 overflow-hidden relative'>
                         {event.coverImage ? (<Image src={event.coverImage} alt={event.title} fill className="object-cover" priority/> 
                         ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-3xl" style={{backgroundColor: event.themeColor}}>
                            {getCategoryIcon(event.category)}
                         </div>
                        )}
                     </div>

                     <div className="flex-1 min-w-0">
                         <h3 className="font-semibold text-sm mb-1 group-hover:text-purple-400 transition-colors line-clamp-2">
                            {event.title}
                         </h3>

                         <p className="text-sm text-muted-foreground mb-1">
                             {format(event.startDate , "EEE, dd MMM, HH:mm")}
                         </p>

                         <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <MapPin className='w-3 h-3' />
                            <span className="'line-clamp-1">
                                {event.locationType ==="online" ? "Online Event" : event.city}
                            </span>
                         </div>

                         <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Users className='w-3 h-3' />
    
                            <span>{event.registrationCount} attending</span>
                         </div>
                     </div>
                </CardContent>
            </Card>
        )
    }

  return (
    <Card
            className={`overflow-hidden group pt-0 ${onClick ? "cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50" : ""} ${className}`}
            onClick={onClick}
            >

            <div className='relative h-48 overflow-hidden'>
                         {event.coverImage ? (
                            <Image 
                            src={event.coverImage} 
                            alt={event.title} 
                            fill 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            priority/> 
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl" 
                            style={{backgroundColor: event.themeColor}}>
                            {getCategoryIcon(event.category)}
                         </div>
                        )}
                        <div className='absolute top-3 right-3'>
                          <Badge variant="secondary">
                            {event.ticketType === "free" ? "Free" : "Paid"}
                          </Badge>
                        </div>
                     </div>

                <CardContent className='space-y-3'>
                      
                </CardContent>
            </Card>
  )
}

export default EventCard
