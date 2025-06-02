
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GifItem {
  id: string;
  title: string;
  url: string;
  preview: string;
}

interface GifPickerProps {
  onGifSelect: (gif: GifItem) => void;
  onClose: () => void;
}

const GifPicker = ({ onGifSelect, onClose }: GifPickerProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGif, setSelectedGif] = useState<GifItem | null>(null);

  // GIPHY API configuration
  const GIPHY_API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65"; // Public beta key
  const GIPHY_BASE_URL = "https://api.giphy.com/v1/gifs";

  const searchGifs = async (query: string) => {
    setLoading(true);
    try {
      const endpoint = query 
        ? `${GIPHY_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=12&rating=g`
        : `${GIPHY_BASE_URL}/trending?api_key=${GIPHY_API_KEY}&limit=12&rating=g`;
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch GIFs');
      
      const data = await response.json();
      const transformedGifs = data.data.map((gif: any) => ({
        id: gif.id,
        title: gif.title || 'Untitled GIF',
        url: gif.images.original.url,
        preview: gif.images.fixed_width_small.url
      }));
      
      setGifs(transformedGifs);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
      toast({
        title: "Error loading GIFs",
        description: "Failed to load GIFs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load trending GIFs on mount
    searchGifs("");
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const debounceTimer = setTimeout(() => {
        searchGifs(searchQuery);
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else if (searchQuery.length === 0) {
      searchGifs("");
    }
  }, [searchQuery]);

  const handleGifSelect = (gif: GifItem) => {
    setSelectedGif(gif);
    onGifSelect(gif);
    toast({
      title: "GIF selected!",
      description: `"${gif.title}" has been added to your post.`,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Choose a GIF</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search GIFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                onClick={() => handleGifSelect(gif)}
                className={`relative rounded overflow-hidden hover:opacity-80 transition-opacity ${
                  selectedGif?.id === gif.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img
                  src={gif.preview}
                  alt={gif.title}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                  {gif.title}
                </div>
              </button>
            ))}
          </div>
        )}
        
        {gifs.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <p>No GIFs found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GifPicker;
