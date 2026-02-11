"use client"
import { api } from '@/convex/_generated/api';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { CATEGORIES } from '@/lib/data';
import { parseLocationSlug } from '@/lib/location-util';
import { Loader2 } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation'
import React from 'react'

const DynamicExplorePage = () => {

  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  //check if it is a valid category or not
  const categoryInfo = CATEGORIES.find((cat) => cat.id === slug);
  const isCategory = !!categoryInfo;

  //If it is not a category validate location...
  
  const { city, state, isValid } = !isCategory ? parseLocationSlug(slug) : {city: null, state: null, isValid: false};

  if(!isCategory && !isValid) {
    notFound();
  }

   const { data: events, isLoading } = useConvexQuery(
      isCategory
      ? api.event.getEventsByCategory
      : api.event.getEventsByLocation,
      isCategory
      ? {category: slug , limit: 50}
      : city && state
      ? {city,state, limit: 50}
      : "skip"
    );

    const handleEventClick = (eventslug) => {
    router.push(`/event/${eventslug}`);
  }

  if(isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  if(isCategory) {
    return (
      <>
      <div className="pb-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl">{categoryInfo.icon}</div>
          <div>
          <h1 className="text-5xl md:text-6xl font-bold">
              {categoryInfo.label}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">{categoryInfo.description}</p>
          </div>
        </div>
      </div>
      </>
    )
  }

  return (
    <div>
      dynamic explore page
    </div>
  )
}

export default DynamicExplorePage
