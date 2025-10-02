
// Unified notification types for the application
export type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low';
export type NotificationActionType = 'accept' | 'decline' | 'reply' | 'view' | 'like' | 'share';
export type DeliveryStatus = 'pending' | 'delivered' | 'read' | 'failed';

export interface BaseNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at?: string;
  timestamp?: string;
  metadata?: any;
  sender_id?: string;
  priority?: NotificationPriority;
  action_url?: string;
  action_type?: NotificationActionType;
  group_key?: string;
  grouped_with?: string;
  delivery_status?: DeliveryStatus;
  read_at?: string;
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
  groupCount?: number;
  groupedItems?: BaseNotification[];
  isGroup?: boolean;
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
