
import { FeedPost } from "@/types/feed";

export const mockPosts: FeedPost[] = [
  {
    id: "1",
    author: "Sarah Chen",
    avatar: "",
    title: "Need help moving this weekend",
    description: "Looking for 2-3 people to help me move from downtown to the suburbs. Can provide lunch and gas money! This is quite urgent as my lease expires Monday.",
    category: "help-needed",
    timestamp: "2 hours ago",
    location: "Downtown area",
    responses: 3,
    likes: 12,
    shares: 2,
    isLiked: false,
    isBookmarked: false,
    isShared: false,
    urgency: "high",
    feeling: "worried",
    tags: ["moving", "urgent", "weekend"],
    visibility: "public",
    reactions: [
      { type: 'like', emoji: '👍', count: 8, hasReacted: false },
      { type: 'love', emoji: '❤️', count: 3, hasReacted: false },
      { type: 'wow', emoji: '😮', count: 1, hasReacted: false }
    ],
    comments: [
      {
        id: "c1",
        author: "Mike Johnson",
        avatar: "",
        content: "I can help! I have a truck and am free Saturday morning.",
        timestamp: "1 hour ago",
        likes: 2,
        isLiked: false
      },
      {
        id: "c2", 
        author: "Lisa Park",
        avatar: "",
        content: "Same here! What time works best?",
        timestamp: "45 minutes ago",
        likes: 1,
        isLiked: true
      }
    ]
  },
  {
    id: "2",
    author: "Mike Johnson",
    avatar: "",
    title: "Offering tutoring for high school math",
    description: "Certified math teacher available for free tutoring sessions on weekends. Specializing in algebra and geometry. I love helping students succeed!",
    category: "help-offered",
    timestamp: "4 hours ago",
    location: "Community Center",
    responses: 7,
    likes: 24,
    shares: 5,
    isLiked: true,
    isBookmarked: true,
    isShared: false,
    urgency: "low",
    feeling: "helpful",
    tags: ["education", "math", "tutoring", "free"],
    visibility: "public",
    reactions: [
      { type: 'like', emoji: '👍', count: 15, hasReacted: true },
      { type: 'love', emoji: '❤️', count: 8, hasReacted: false },
      { type: 'wow', emoji: '😮', count: 1, hasReacted: false }
    ],
    comments: [
      {
        id: "c3",
        author: "Parent Association",
        avatar: "",
        content: "This is amazing! We'll share this with our community.",
        timestamp: "3 hours ago",
        likes: 5,
        isLiked: false
      }
    ]
  },
  {
    id: "3",
    author: "Community Gardens",
    avatar: "",
    title: "Success: Garden project completed!",
    description: "Thanks to 15 amazing volunteers, we planted 200 vegetables and created a beautiful community space! The transformation is incredible and everyone worked so hard.",
    category: "success-story",
    timestamp: "1 day ago",
    location: "Riverside Park",
    responses: 12,
    likes: 45,
    shares: 8,
    isLiked: false,
    isBookmarked: false,
    isShared: false,
    urgency: "low",
    feeling: "grateful",
    tags: ["community", "gardening", "success", "volunteers"],
    visibility: "public",
    reactions: [
      { type: 'like', emoji: '👍', count: 25, hasReacted: false },
      { type: 'love', emoji: '❤️', count: 18, hasReacted: false },
      { type: 'wow', emoji: '😮', count: 2, hasReacted: false }
    ],
    comments: [
      {
        id: "c4",
        author: "Alex Rodriguez",
        avatar: "",
        content: "So proud to have been part of this! The community spirit was amazing.",
        timestamp: "22 hours ago",
        likes: 8,
        isLiked: false
      },
      {
        id: "c5",
        author: "Emma Thompson",
        avatar: "",
        content: "Can't wait to see the vegetables grow!",
        timestamp: "20 hours ago",
        likes: 3,
        isLiked: false
      }
    ]
  },
  {
    id: "4",
    author: "Alex Rodriguez",
    avatar: "",
    title: "Looking for someone to walk my dog",
    description: "My elderly dog needs daily walks while I recover from surgery. Willing to pay $20 per walk. She's very gentle and loves meeting new people!",
    category: "help-needed",
    timestamp: "6 hours ago",
    location: "Maple Street",
    responses: 5,
    likes: 8,
    shares: 1,
    isLiked: false,
    isBookmarked: false,
    isShared: false,
    urgency: "medium",
    feeling: "worried",
    tags: ["pets", "dog-walking", "paid", "recovery"],
    visibility: "public",
    reactions: [
      { type: 'like', emoji: '👍', count: 6, hasReacted: false },
      { type: 'love', emoji: '❤️', count: 2, hasReacted: false }
    ],
    comments: [
      {
        id: "c6",
        author: "Pet Lovers Group",
        avatar: "",
        content: "Hope you recover quickly! I'm sure someone will help.",
        timestamp: "5 hours ago",
        likes: 2,
        isLiked: false
      }
    ]
  },
  {
    id: "5",
    author: "Lisa Park",
    avatar: "",
    title: "Free coding workshops for beginners",
    description: "Teaching basic HTML, CSS, and JavaScript every Saturday at the library. All skill levels welcome! I'm excited to share my knowledge with the community.",
    category: "help-offered",
    timestamp: "8 hours ago",
    location: "Public Library",
    responses: 15,
    likes: 32,
    shares: 12,
    isLiked: true,
    isBookmarked: false,
    isShared: false,
    urgency: "low",
    feeling: "excited",
    tags: ["coding", "education", "free", "weekends", "library"],
    visibility: "public",
    reactions: [
      { type: 'like', emoji: '👍', count: 20, hasReacted: true },
      { type: 'love', emoji: '❤️', count: 10, hasReacted: false },
      { type: 'wow', emoji: '😮', count: 2, hasReacted: false }
    ],
    comments: [
      {
        id: "c7",
        author: "Tech Community",
        avatar: "",
        content: "This is fantastic! We need more people like you.",
        timestamp: "7 hours ago",
        likes: 6,
        isLiked: false
      },
      {
        id: "c8",
        author: "Sarah Chen", 
        avatar: "",
        content: "I'd love to attend! What time do they start?",
        timestamp: "6 hours ago",
        likes: 3,
        isLiked: false
      }
    ]
  }
];
