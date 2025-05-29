
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
  mentions?: string[];
  priority?: "low" | "normal" | "high" | "urgent";
  isForwarded?: boolean;
  forwardedFrom?: string;
  threadId?: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  type: "image" | "file" | "audio" | "video";
  url: string;
  name: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  timestamp: string;
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
  settings?: ConversationSettings;
  tags?: string[];
  lastActivity?: string;
}

export interface ConversationSettings {
  allowInvites: boolean;
  messageApproval: boolean;
  readReceipts: boolean;
  typingIndicators: boolean;
  mediaSharing: boolean;
  fileSharing: boolean;
  maxFileSize: number;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  avatar: string;
  role?: "admin" | "moderator" | "member";
  isActive: boolean;
  lastSeen?: string;
  permissions?: ParticipantPermissions;
  joinedAt?: string;
}

export interface ParticipantPermissions {
  canInvite: boolean;
  canRemove: boolean;
  canEditSettings: boolean;
  canPin: boolean;
  canDelete: boolean;
}

export interface MessageThread {
  id: string;
  parentMessageId: string;
  messages: Message[];
  participantCount: number;
  lastActivity: string;
  isActive: boolean;
}

export interface ConversationFilters {
  type: "all" | "direct" | "group" | "archived" | "unread" | "pinned";
  searchQuery?: string;
  tags?: string[];
  participants?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  conversationId: string;
  timestamp: string;
}

export interface MessageSearchResult {
  message: Message;
  conversation: Conversation;
  context: Message[];
  highlights: string[];
}

export interface VoiceMessage {
  id: string;
  url: string;
  duration: number;
  waveform: number[];
  transcript?: string;
}
