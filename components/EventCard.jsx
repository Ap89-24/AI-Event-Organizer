import React from 'react'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { getCategoryIcon } from '@/lib/data'

const EventCard = ({
    event,
    onClick,
    showActions = false,
    onDelete,
    variant = 'grid',
    className = ''
}) => {

    if(variant === 'list'){
        return (
            <Card
            className={`py-0 group cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 ${className}`}
            onClick={onClick}
            >
                <CardContent className={'p-3 flex gap-3'}>
                     <div className='w-20 h-20 relative rounded-lg shrink-0 overflow-hidden'>
                         {event.coverImage ? (<Image src={event.coverImage} alt={event.title} fill className="object-cover" priority/> ): (<div className="absolute inset-0 flex items-center justify-center text-3xl" style={{backgroundColor: event.themeColor}}>
                            {getCategoryIcon(event.category)}
                         </div>)}
                     </div>
                </CardContent>
            </Card>
        )
    }

  return (
    <div>
      EventCard
    </div>
  )
}

export default EventCard
