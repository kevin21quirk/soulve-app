
import { FeedPost } from "@/types/feed";

export const mockPosts: FeedPost[] = [
  {
    id: "1",
    author: "Sarah Chen",
    avatar: "",
    title: "Need help moving this weekend",
    description: "Looking for 2-3 people to help me move from downtown to the suburbs. Can provide lunch and gas money!",
    category: "help-needed",
    timestamp: "2 hours ago",
    location: "Downtown area",
    responses: 3,
    likes: 12,
    isLiked: false
  },
  {
    id: "2",
    author: "Mike Johnson",
    avatar: "",
    title: "Offering tutoring for high school math",
    description: "Certified math teacher available for free tutoring sessions on weekends. Specializing in algebra and geometry.",
    category: "help-offered",
    timestamp: "4 hours ago",
    location: "Community Center",
    responses: 7,
    likes: 24,
    isLiked: true
  },
  {
    id: "3",
    author: "Community Gardens",
    avatar: "",
    title: "Success: Garden project completed!",
    description: "Thanks to 15 amazing volunteers, we planted 200 vegetables and created a beautiful community space!",
    category: "success-story",
    timestamp: "1 day ago",
    location: "Riverside Park",
    responses: 12,
    likes: 45,
    isLiked: false
  },
  {
    id: "4",
    author: "Alex Rodriguez",
    avatar: "",
    title: "Looking for someone to walk my dog",
    description: "My elderly dog needs daily walks while I recover from surgery. Willing to pay $20 per walk.",
    category: "help-needed",
    timestamp: "6 hours ago",
    location: "Maple Street",
    responses: 5,
    likes: 8,
    isLiked: false
  },
  {
    id: "5",
    author: "Lisa Park",
    avatar: "",
    title: "Free coding workshops for beginners",
    description: "Teaching basic HTML, CSS, and JavaScript every Saturday at the library. All skill levels welcome!",
    category: "help-offered",
    timestamp: "8 hours ago",
    location: "Public Library",
    responses: 15,
    likes: 32,
    isLiked: true
  }
];
