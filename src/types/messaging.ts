
export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
  type?: "text" | "image" | "file" | "voice" | "system";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyTo?: string;
  reactions?: MessageReaction[];
  isEdited?: boolean;
  editedAt?: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isActive: boolean;
  isTyping?: boolean;
  type: "direct" | "group";
  participants?: ConversationParticipant[];
  isArchived?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  description?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  avatar: string;
  role?: "admin" | "member";
  isActive: boolean;
  lastSeen?: string;
}

export interface MessageThread {
  id: string;
  parentMessageId: string;
  messages: Message[];
  participantCount: number;
}

export interface ConversationFilters {
  type: "all" | "direct" | "group" | "archived" | "unread";
  searchQuery?: string;
}
