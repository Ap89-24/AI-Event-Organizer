"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Search } from "lucide-react";

export function UnsplashImagePicker({IsOpen , OnClose , OnSelect}) {

    const [query , setQuery] = useState("");
    const [images , setImages] = useState([]);
    const [loading , setLoading] = useState(false);

    //API call for searching images......
    const searchImages = async(searchQuery) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=12&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`);
            const data = await response.json();
            setImages(data.results || []);
        } catch (error) {
            console.error("Error in fetching images" , error);
        } finally {
            setLoading(false);
        }
    };

    console.log(images);

    const handleSearch = (e) => {
        e.preventDefault();
        searchImages(query);
    }

  return (
    <Dialog open={IsOpen} onOpenChange={OnClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Choose Cover Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for images..."
            className="flex-1"
            />
            <Button type="submit" disabled={loading}>
               {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
               ) : (
                 <Search className="w-5 h-5" /> 
               )}
            </Button>
          </form>

          <div className="overflow-y-auto flex -mx-6 px-6">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                   <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <div>

                </div>
            )}
            </div>          
        </DialogContent>
    </Dialog>
  )
}

