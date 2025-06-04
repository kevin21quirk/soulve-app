
// Unified notification types for the application
export interface BaseNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at?: string;
  timestamp?: string;
  metadata?: any;
  sender_id?: string;
}

export interface OnlineNotification extends BaseNotification {
  is_read: boolean;
  created_at: string;
  timestamp: string;
}

export interface OfflineNotification extends BaseNotification {
  isRead: boolean;
  timestamp: string;
}

export interface UnifiedNotification extends BaseNotification {
  isRead: boolean;
  is_read: boolean;
  created_at?: string;
  timestamp?: string;
}

// Mobile notification item interface
export interface MobileNotificationProps {
  id: string;
  type: "donation" | "campaign" | "message" | "social" | "system" | string;
  title: string;
  message: string;
  timestamp?: string;
  created_at?: string;
  isRead?: boolean;
  is_read?: boolean;
  actionUrl?: string;
  metadata?: {
    amount?: number;
    donorName?: string;
    campaignTitle?: string;
    senderName?: string;
    actionType?: string;
  };
}
