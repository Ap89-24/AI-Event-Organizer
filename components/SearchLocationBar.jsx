/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { api } from '@/convex/_generated/api';
import { query } from '@/convex/_generated/server';
import { useConvexMutation, useConvexQuery } from '@/hooks/use-convex-query';
import { City, State } from 'country-state-city';
import { Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Input } from './ui/input';
import { debounce } from 'lodash';

const SearchLocationBar = () => {

  const router = useRouter();
  const [searchQuery , setSearchQuery] = useState("");
  const [showSearchResult , setShowSearchResult] = useState(false);
  const searchRef = useRef();
  const [selectedStates , setSelectedStates] = useState("");
  const [selectedCities , setSelectedCities] = useState("");


  const {data: currentUser  , isLoading} = useConvexQuery(
    api.users.getCurrentUser,
  );
  const {mutate: updateLocation} = useConvexMutation(
    api.users.completeOnboarding,
  );

  const {data:searchResult} = useConvexQuery(
    api.search.searchEvents,
    typeof searchQuery === "string" && searchQuery.trim().length >= 2 ? {query: searchQuery , limit: 5} : "skip"
  )

  const isSearching =
  searchQuery.trim().length >= 2 &&
  searchResult === undefined;

  console.log("searchLoading:", isSearching);
  console.log("showSearchResult:", showSearchResult);
  const indianStates =  State.getStatesOfCountry("IN");

    const cities = useMemo(() => {
    if (!selectedStates) return [];
    const state = indianStates.find((s) => s.name === selectedStates);
    if (!state) return [];
    return City.getCitiesOfState("IN", state);
  },[selectedStates,indianStates]);

  useEffect(() => {
    if(currentUser?.location){
      setSelectedStates(currentUser.location.state || "")
      setSelectedCities(currentUser.location.city || "")
    }
  },[currentUser,isLoading]);

  const debouncedSetQuery = useRef(
    debounce((value) => setSearchQuery(value) ,300)
  ).current;

  const handleSearchInput = (e) => {
    const value = e.target.value;
    debouncedSetQuery(value);
    setShowSearchResult(value.length >= 2);
  };

    const handleEventClick = (slug) => {
      setShowSearchResult(false);
      setSearchQuery("");
    router.push(`/events/${slug}`);
  }


  return (
    <div className="flex items-center">
       <div className="relative flex w-full" ref={searchRef}>
          <div className="flex-1">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input
             placeholder="Search Events....👀👀"
             onFocus={() => {
              if(searchQuery.length >= 2) setShowSearchResult(true);
             }}
             onChange={handleSearchInput}
             className="pl-10 w-full h-9 rounded-none rounded-l-md" />
          </div>

          {showSearchResult && (
            <div className="absolute top-full mt-2 w-96 bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 flex items-center justify-center">
                     <Loader2 className="w-7 h-7 animate-spin text-purple-500" />
                  </div>
                ) : searchResult && searchResult.length > 0 ? (
                    <div className ="py-2">
                        <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                            SEARCH RESULT
                        </p>
                        {searchResult.map((event) => (
                          <button key={event._id}
                          className="w-full px-4 py-3 hover:bg-muted/55 text-left transition-colors"
                          >

                          </button>
                        ))}
                    </div>
                ) : null}
            </div>
          )}
       </div>
    </div>
  )
}

export default SearchLocationBar
