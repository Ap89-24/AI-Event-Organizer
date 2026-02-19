"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const SearchLocationBar = () => {

  const router = useRouter();
  const [searchQuery , setSearchQuery] = useState("");
  const [showSearchResult , setShowSearchResult] = useState(false);

  return (
    <div>
      search bar
    </div>
  )
}

export default SearchLocationBar
