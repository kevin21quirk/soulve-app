
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

  // Mock GIF data - in production, integrate with GIPHY API
  const mockGifs: GifItem[] = [
    {
      id: "1",
      title: "Happy",
      url: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
      preview: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/200w.gif"
    },
    {
      id: "2", 
      title: "Excited",
      url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
      preview: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/200w.gif"
    },
    {
      id: "3",
      title: "Thank You",
      url: "https://media.giphy.com/media/ZfK4cXKJTTay1Ava29/giphy.gif", 
      preview: "https://media.giphy.com/media/ZfK4cXKJTTay1Ava29/200w.gif"
    },
    {
      id: "4",
      title: "Celebrate",
      url: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
      preview: "https://media.giphy.com/media/26u4cqiYI30juCOGY/200w.gif"
    },
    {
      id: "5",
      title: "Help",
      url: "https://media.giphy.com/media/l41lGvinEgARjB2HC/giphy.gif",
      preview: "https://media.giphy.com/media/l41lGvinEgARjB2HC/200w.gif"
    },
    {
      id: "6",
      title: "Love",
      url: "https://media.giphy.com/media/3oEjI1erPMTMBFmNHi/giphy.gif",
      preview: "https://media.giphy.com/media/3oEjI1erPMTMBFmNHi/200w.gif"
    }
  ];

  const searchGifs = async (query: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filtered = mockGifs.filter(gif => 
        gif.title.toLowerCase().includes(query.toLowerCase())
      );
      setGifs(filtered);
    } catch (error) {
      toast({
        title: "Error searching GIFs",
        description: "Failed to load GIFs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      searchGifs(searchQuery);
    } else {
      setGifs(mockGifs.slice(0, 6)); // Show trending GIFs
    }
  }, [searchQuery]);

  useEffect(() => {
    // Load trending GIFs on mount
    setGifs(mockGifs.slice(0, 6));
  }, []);

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
