
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Send, MapPin } from "lucide-react";
import { Story, StoryGroup } from "@/types/stories";

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  storyGroups: StoryGroup[];
  initialGroupIndex: number;
  initialStoryIndex: number;
}

const StoryViewer = ({ 
  isOpen, 
  onClose, 
  storyGroups, 
  initialGroupIndex, 
  initialStoryIndex 
}: StoryViewerProps) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (currentStory.duration * 10));
        if (newProgress >= 100) {
          handleNext();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentStory, currentGroupIndex, currentStoryIndex]);

  const handleNext = () => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else if (currentGroupIndex < storyGroups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    } else if (currentGroupIndex > 0) {
      const prevGroup = storyGroups[currentGroupIndex - 1];
      setCurrentGroupIndex(currentGroupIndex - 1);
      setCurrentStoryIndex(prevGroup.stories.length - 1);
      setProgress(0);
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors = {
      "help-needed": "bg-red-100 text-red-700 border-red-200",
      "help-offered": "bg-green-100 text-green-700 border-green-200",
      "success-story": "bg-blue-100 text-blue-700 border-blue-200",
      "announcement": "bg-purple-100 text-purple-700 border-purple-200",
      "update": "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (!currentStory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-black border-0 w-full h-full max-w-none max-h-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
            {currentGroup.stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <Progress 
                  value={
                    index < currentStoryIndex ? 100 
                    : index === currentStoryIndex ? progress 
                    : 0
                  }
                  className="h-full bg-white"
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between mt-6">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 ring-2 ring-white">
                <AvatarImage src={currentStory.avatar} alt={currentStory.username} />
                <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
                  {currentStory.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-sm">{currentStory.username}</span>
                  {currentStory.category && (
                    <Badge className={`${getCategoryColor(currentStory.category)} text-xs px-1.5 py-0.5 border`}>
                      {currentStory.category.replace('-', ' ')}
                    </Badge>
                  )}
                </div>
                <span className="text-white/80 text-xs">{currentStory.timestamp}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Story content */}
          <div 
            className="relative w-full h-full bg-black cursor-pointer"
            onClick={() => setIsPaused(!isPaused)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <img 
              src={currentStory.mediaUrl} 
              alt="Story content"
              className="w-full h-full object-cover"
            />
            
            {/* Navigation areas */}
            <div 
              className="absolute left-0 top-0 w-1/3 h-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            />
            <div 
              className="absolute right-0 top-0 w-1/3 h-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            />
          </div>

          {/* Caption and location */}
          {(currentStory.caption || currentStory.location) && (
            <div className="absolute bottom-20 left-4 right-4 z-20">
              {currentStory.location && (
                <div className="flex items-center space-x-1 mb-2">
                  <MapPin className="h-3 w-3 text-white/80" />
                  <span className="text-white/80 text-xs">{currentStory.location}</span>
                </div>
              )}
              {currentStory.caption && (
                <p className="text-white text-sm leading-relaxed bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                  {currentStory.caption}
                </p>
              )}
            </div>
          )}

          {/* Bottom actions */}
          <div className="absolute bottom-6 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white/80 text-xs">{currentStory.viewCount} views</span>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation arrows */}
          {currentGroupIndex > 0 || currentStoryIndex > 0 ? (
            <Button
              variant="ghost" 
              size="sm"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 p-2 z-20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          ) : null}
          
          {(currentGroupIndex < storyGroups.length - 1 || currentStoryIndex < currentGroup.stories.length - 1) ? (
            <Button
              variant="ghost"
              size="sm" 
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 p-2 z-20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryViewer;
