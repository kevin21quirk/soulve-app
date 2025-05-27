
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
    isTyping: false
  },
  {
    id: "2",
    name: "Mike Johnson",
    avatar: "",
    lastMessage: "When would be a good time for tutoring?",
    timestamp: "1h ago",
    unread: 0,
    isActive: false,
    isTyping: true
  },
  {
    id: "3",
    name: "Maria Santos",
    avatar: "",
    lastMessage: "The garden project was amazing!",
    timestamp: "2h ago",
    unread: 1,
    isActive: false,
    isTyping: false
  }
];

export const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Sarah Chen",
    content: "Hi! I saw your response to my moving request. Are you still available this Saturday?",
    timestamp: "10:30 AM",
    isOwn: false,
    status: "read"
  },
  {
    id: "2",
    sender: "You",
    content: "Yes, I'm free on Saturday! What time works best for you?",
    timestamp: "10:35 AM",
    isOwn: true,
    status: "read"
  },
  {
    id: "3",
    sender: "Sarah Chen",
    content: "Perfect! How about 9 AM? I'll provide breakfast and lunch for everyone helping.",
    timestamp: "10:37 AM",
    isOwn: false,
    status: "read"
  },
  {
    id: "4",
    sender: "You",
    content: "Sounds great! Should I bring any specific equipment?",
    timestamp: "10:40 AM",
    isOwn: true,
    status: "delivered"
  },
  {
    id: "5",
    sender: "Sarah Chen",
    content: "Thanks for offering to help with the move!",
    timestamp: "10:42 AM",
    isOwn: false,
    status: "sent"
  }
];
