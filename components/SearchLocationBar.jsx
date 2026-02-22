/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { api } from "@/convex/_generated/api";
import { query } from "@/convex/_generated/server";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { City, State } from "country-state-city";
import { Badge, Calendar, Loader2, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";
import { debounce } from "lodash";
import { getCategoryIcon } from "@/lib/data";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { createLocationSlug } from "@/lib/location-util";

const SearchLocationBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const searchRef = useRef();
  const [selectedStates, setSelectedStates] = useState("");
  const [selectedCities, setSelectedCities] = useState("");

  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser,
  );
  const { mutate: updateLocation } = useConvexMutation(
    api.users.completeOnboarding,
  );

  const { data: searchResult } = useConvexQuery(
    api.search.searchEvents,
    typeof searchQuery === "string" && searchQuery.trim().length >= 2
      ? { query: searchQuery, limit: 5 }
      : "skip",
  );

  const isSearching =
    searchQuery.trim().length >= 2 && searchResult === undefined;

  // console.log("searchLoading:", isSearching);
  // console.log("showSearchResult:", showSearchResult);
  const indianStates = State.getStatesOfCountry("IN");

  const cities = useMemo(() => {
    if (!selectedStates) return [];
    const state = indianStates.find((s) => s.name === selectedStates);
    if (!state) return [];
    return City.getCitiesOfState("IN", state.isoCode);
  }, [selectedStates, indianStates]);

  useEffect(() => {
    if (currentUser?.location) {
      setSelectedStates(currentUser.location.state || "");
      setSelectedCities(currentUser.location.city || "");
    }
  }, [currentUser, isLoading]);

  const debouncedSetQuery = useRef(
    debounce((value) => setSearchQuery(value), 300),
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
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResult(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleLocationSelect =  async(city,state) => {
    try {
      if(currentUser?.interests && currentUser?.location){
        await updateLocation({
          location: {city,state,country:"India"},
          interests: currentUser.interests || [],
        })
      }

      const slug = createLocationSlug(city, state);
      router.push(`/explore/${slug}`);
    } catch (error) {
      console.error("Fail to update location" , error);
    }
  }

  return (
    <div className="flex items-center">
      <div className="relative flex w-full" ref={searchRef}>
        <div className="flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search Events....👀👀"
            onFocus={() => {
              if (searchQuery.length >= 2) setShowSearchResult(true);
            }}
            onChange={handleSearchInput}
            className="pl-10 w-full h-9 rounded-none rounded-l-md"
          />
        </div>

        {showSearchResult && (
          <div className="absolute top-full mt-2 w-96 bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
            {isSearching ? (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="w-7 h-7 animate-spin text-purple-500" />
              </div>
            ) : searchResult && searchResult.length > 0 ? (
              <div className="py-2">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                  SEARCH RESULT
                </p>
                {searchResult.map((event) => (
                  <button
                    key={event._id}
                    className="w-full px-4 py-3 hover:bg-muted/55 text-left transition-colors"
                    onClick={() => handleEventClick(event.slug)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl mt-0.5">
                        {getCategoryIcon(event.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1 line-clamp-1">
                          {event.title}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(event.startDate, "MMM dd")}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.city}
                          </span>
                        </div>
                      </div>

                      {event.ticketType === "free" && (
                        <Badge variant="secondary" className="text-xs">
                          Free
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <Select
        value={selectedStates}
        onValueChange={(value) => {
          setSelectedStates(value);
          setSelectedCities("");
        }}
      >
        <SelectTrigger id="state" className="w-32 h-9 border-l-0 rounded-none">
          <SelectValue placeholder="State" />
        </SelectTrigger>
        <SelectContent>
          {indianStates.map((state) => (
            <SelectItem key={state.isoCode} value={state.name}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedCities}
        onValueChange={(value) => {
          setSelectedCities(value);
          if(value && selectedStates){
            handleLocationSelect(value , selectedStates);
          }
        }}
        disabled={!selectedStates}
      >
        <SelectTrigger id="city" className="w-32 h-9 rounded-none rounded-r-md">
          <SelectValue
            placeholder="City"
          />
        </SelectTrigger>
        <SelectContent>
           {
            cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))
           }
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchLocationBar;
