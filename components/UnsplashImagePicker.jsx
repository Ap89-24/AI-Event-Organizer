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
import Image from "next/image";

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
                <div className="grid grid-cols-3 gap-4 py-4">
                      {images.map((image , index) => (
                        <button
                        key={image.id}
                        onClick={() => OnSelect(image.urls.regular)}
                        className="relative aspect-video overflow-hidden rounded-lg border-2 border-transparent hover:border-purple-500 transition-all"
                        >
                          <Image
                           src={image.urls.small}
                           alt={image.description || "Unsplash Images"}
                           className="w-full h-full object-cover"
                           width={400}
                           height={300}
                          />
                        </button>
                      ))}
                </div>
            )}

            {!loading && images.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                  Search for images to get started
              </div>
            )}
            </div>      

            <p className="text-xs text-muted-foreground">
               Photos from {" "}
               <a 
               href="http://unsplash.com"
               target="_blank"
               rel="noopener noreferrer"
               className="underline"
               >
                Unsplash
               </a>
              </p>    
        </DialogContent>
    </Dialog>
  )
}

