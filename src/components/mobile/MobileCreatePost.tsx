
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Smile } from "lucide-react";
import { FeedPost } from "@/types/feed";

interface MobileCreatePostProps {
  onPostCreated: (post: FeedPost) => void;
}

const MobileCreatePost = ({ onPostCreated }: MobileCreatePostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder-avatar.jpg" alt="You" />
          <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
            Y
          </AvatarFallback>
        </Avatar>
        
        <button
          onClick={() => setIsExpanded(true)}
          className="flex-1 bg-gray-50 rounded-full px-4 py-3 text-left text-gray-500 text-sm hover:bg-gray-100 transition-colors"
        >
          What's on your mind?
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="p-2">
            <Camera className="h-5 w-5 text-green-500" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <MapPin className="h-5 w-5 text-red-500" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <Smile className="h-5 w-5 text-yellow-500" />
          </Button>
        </div>
        
        <Button 
          size="sm"
          className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white px-4 py-2 text-sm font-medium"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default MobileCreatePost;
