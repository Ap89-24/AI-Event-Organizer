"use client"
import React from 'react'
import {useQuery} from "convex/react";
import { api } from '@/convex/_generated/api';

const ExplorePage = () => {

  const data = useQuery(api.event.getFeaturedEvents);
  console.log("Featured Events:",data);

  return (
    <div>
      explore
    </div>
  )
}

export default ExplorePage
