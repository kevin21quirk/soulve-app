
import { Message, Conversation } from "@/types/messaging";

export const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "",
    lastMessage: "Thanks for offering to help with the move!",
    timestamp: "2m ago",
    unread: 2,
    isActive: true,
    isTyping: false,
    type: "direct",
    isPinned: true,
    participants: [
      {
        id: "sarah_1",
        name: "Sarah Chen",
        avatar: "",
        isActive: true,
        lastSeen: "2m ago"
      }
    ]
  },
  {
    id: "2",
    name: "Mike Johnson",
    avatar: "",
    lastMessage: "When would be a good time for tutoring?",
    timestamp: "1h ago",
    unread: 0,
    isActive: false,
    isTyping: true,
    type: "direct",
    participants: [
      {
        id: "mike_1",
        name: "Mike Johnson",
        avatar: "",
        isActive: false,
        lastSeen: "1h ago"
      }
    ]
  },
  {
    id: "3",
    name: "Community Helpers",
    avatar: "",
    lastMessage: "The garden project was amazing!",
    timestamp: "2h ago",
    unread: 1,
    isActive: false,
    isTyping: false,
    type: "group",
    description: "Local community helpers coordination group",
    participants: [
      {
        id: "maria_1",
        name: "Maria Santos",
        avatar: "",
        role: "admin",
        isActive: true,
        lastSeen: "2h ago"
      },
      {
        id: "john_1",
        name: "John Davis",
        avatar: "",
        role: "member",
        isActive: false,
        lastSeen: "5h ago"
      },
      {
        id: "emma_1",
        name: "Emma Wilson",
        avatar: "",
        role: "member",
        isActive: true,
        lastSeen: "30m ago"
      }
    ]
  },
  {
    id: "4",
    name: "Tech Support Group",
    avatar: "",
    lastMessage: "Issue resolved, thanks everyone!",
    timestamp: "1d ago",
    unread: 0,
    isActive: false,
    isTyping: false,
    type: "group",
    isArchived: true,
    description: "Tech support and digital literacy help",
    participants: [
      {
        id: "alex_1",
        name: "Alex Rivera",
        avatar: "",
        role: "admin",
        isActive: false,
        lastSeen: "1d ago"
      }
    ]
  }
];

export const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Sarah Chen",
    content: "Hi! I saw your response to my moving request. Are you still available this Saturday?",
    timestamp: "10:30 AM",
    isOwn: false,
    status: "read",
    type: "text"
  },
  {
    id: "2",
    sender: "You",
    content: "Yes, I'm free on Saturday! What time works best for you?",
    timestamp: "10:35 AM",
    isOwn: true,
    status: "read",
    type: "text"
  },
  {
    id: "3",
    sender: "Sarah Chen",
    content: "Perfect! How about 9 AM? I'll provide breakfast and lunch for everyone helping.",
    timestamp: "10:37 AM",
    isOwn: false,
    status: "read",
    type: "text",
    reactions: [
      { emoji: "👍", userId: "you", userName: "You", timestamp: "2023-12-01T10:38:00Z" },
      { emoji: "❤️", userId: "mike_1", userName: "Mike Johnson", timestamp: "2023-12-01T10:39:00Z" }
    ]
  },
  {
    id: "4",
    sender: "You",
    content: "Sounds great! Should I bring any specific equipment?",
    timestamp: "10:40 AM",
    isOwn: true,
    status: "delivered",
    type: "text"
  },
  {
    id: "5",
    sender: "Sarah Chen",
    content: "Thanks for offering to help with the move!",
    timestamp: "10:42 AM",
    isOwn: false,
    status: "sent",
    type: "text"
  }
];
