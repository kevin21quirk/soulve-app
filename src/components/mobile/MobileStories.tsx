
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

const MobileStories = () => {
  const stories = [
    { id: 1, user: "Your Story", avatar: "", isOwn: true },
    { id: 2, user: "Sarah Chen", avatar: "", hasStory: true },
    { id: 3, user: "Marcus Johnson", avatar: "", hasStory: true },
    { id: 4, user: "Local Food Bank", avatar: "", hasStory: true },
    { id: 5, user: "Community Center", avatar: "", hasStory: true },
  ];

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
            <div className="relative">
              {story.isOwn ? (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                  <Plus className="h-6 w-6 text-gray-500" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-full p-0.5">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={story.avatar} alt={story.user} />
                    <AvatarFallback className="bg-white text-gray-600">
                      {story.user.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-700 text-center max-w-[64px] truncate">
              {story.isOwn ? "Add Story" : story.user}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileStories;
