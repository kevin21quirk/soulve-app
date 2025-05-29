
import { StoryGroup } from "@/types/stories";

export const mockStoryGroups: StoryGroup[] = [
  {
    userId: "user-1",
    username: "Your Story",
    avatar: "",
    isOwn: true,
    hasUnviewedStories: false,
    stories: []
  },
  {
    userId: "user-2", 
    username: "Sarah Chen",
    avatar: "",
    isOwn: false,
    hasUnviewedStories: true,
    stories: [
      {
        id: "story-1",
        userId: "user-2",
        username: "Sarah Chen",
        avatar: "",
        mediaUrl: "/placeholder.svg",
        mediaType: "image",
        caption: "Just finished volunteering at the local food bank! 🥫❤️",
        timestamp: "2 hours ago",
        duration: 15,
        isViewed: false,
        viewCount: 12,
        location: "Downtown Food Bank",
        category: "success-story"
      }
    ]
  },
  {
    userId: "user-3",
    username: "Marcus Johnson", 
    avatar: "",
    isOwn: false,
    hasUnviewedStories: true,
    stories: [
      {
        id: "story-2",
        userId: "user-3", 
        username: "Marcus Johnson",
        avatar: "",
        mediaUrl: "/placeholder.svg",
        mediaType: "image",
        caption: "Teaching kids coding at the community center today!",
        timestamp: "4 hours ago",
        duration: 15,
        isViewed: false,
        viewCount: 24,
        location: "Tech Hub Community Center",
        category: "help-offered"
      }
    ]
  },
  {
    userId: "user-4",
    username: "Local Food Bank",
    avatar: "",
    isOwn: false, 
    hasUnviewedStories: true,
    stories: [
      {
        id: "story-3",
        userId: "user-4",
        username: "Local Food Bank",
        avatar: "",
        mediaUrl: "/placeholder.svg", 
        mediaType: "image",
        caption: "We need volunteers this weekend! Help us serve the community 🙏",
        timestamp: "6 hours ago",
        duration: 15,
        isViewed: true,
        viewCount: 89,
        location: "Main Street Food Bank",
        category: "help-needed"
      }
    ]
  },
  {
    userId: "user-5",
    username: "Community Center",
    avatar: "",
    isOwn: false,
    hasUnviewedStories: false,
    stories: [
      {
        id: "story-4", 
        userId: "user-5",
        username: "Community Center",
        avatar: "",
        mediaUrl: "/placeholder.svg",
        mediaType: "image", 
        caption: "Thank you to everyone who joined our cleanup event!",
        timestamp: "1 day ago",
        duration: 15,
        isViewed: true,
        viewCount: 156,
        location: "Riverside Park",
        category: "announcement"
      }
    ]
  }
];
