
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";
import { mockStoryGroups } from "@/data/mockStories";
import StoryViewer from "./StoryViewer";

const MobileStories = () => {
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<number | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);

  const handleStoryClick = (groupIndex: number) => {
    const group = mockStoryGroups[groupIndex];
    if (group.isOwn && group.stories.length === 0) {
      // Handle create story for own story
      console.log("Create new story");
      return;
    }
    
    setSelectedStoryGroup(groupIndex);
    setShowStoryViewer(true);
  };

  const handleCloseViewer = () => {
    setShowStoryViewer(false);
    setSelectedStoryGroup(null);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          {mockStoryGroups.map((storyGroup, index) => (
            <button
              key={storyGroup.userId}
              onClick={() => handleStoryClick(index)}
              className="flex flex-col items-center space-y-1 flex-shrink-0 transition-transform duration-200 hover:scale-105"
            >
              <div className="relative">
                {storyGroup.isOwn ? (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#18a5fe] transition-colors">
                    <div className="relative">
                      <Camera className="h-6 w-6 text-gray-500" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#18a5fe] rounded-full flex items-center justify-center">
                        <Plus className="h-2.5 w-2.5 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`w-16 h-16 rounded-full p-0.5 ${
                      storyGroup.hasUnviewedStories 
                        ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe]' 
                        : 'bg-gray-300'
                    }`}
                  >
                    <div className="w-full h-full bg-white rounded-full p-0.5">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={storyGroup.avatar} alt={storyGroup.username} />
                        <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-sm">
                          {storyGroup.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                )}
                
                {/* Story count indicator */}
                {!storyGroup.isOwn && storyGroup.stories.length > 1 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#18a5fe] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{storyGroup.stories.length}</span>
                  </div>
                )}
              </div>
              
              <span className="text-xs text-gray-700 text-center max-w-[64px] truncate font-medium">
                {storyGroup.isOwn ? "Your Story" : storyGroup.username}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      {showStoryViewer && selectedStoryGroup !== null && (
        <StoryViewer
          isOpen={showStoryViewer}
          onClose={handleCloseViewer}
          storyGroups={mockStoryGroups.filter(group => !group.isOwn || group.stories.length > 0)}
          initialGroupIndex={selectedStoryGroup >= 1 ? selectedStoryGroup - 1 : selectedStoryGroup}
          initialStoryIndex={0}
        />
      )}
    </>
  );
};

export default MobileStories;
