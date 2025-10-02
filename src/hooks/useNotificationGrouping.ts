import { useMemo } from 'react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at?: string;
  timestamp?: string;
  group_key?: string;
  grouped_with?: string;
  metadata?: any;
}

interface GroupedNotification extends Notification {
  groupCount: number;
  groupedItems: Notification[];
  isGroup: boolean;
}

export const useNotificationGrouping = (notifications: Notification[]) => {
  const groupedNotifications = useMemo(() => {
    const groups = new Map<string, Notification[]>();
    const ungrouped: Notification[] = [];

    // First pass: identify groups
    notifications.forEach((notification) => {
      if (notification.group_key) {
        const existing = groups.get(notification.group_key) || [];
        groups.set(notification.group_key, [...existing, notification]);
      } else {
        ungrouped.push(notification);
      }
    });

    // Second pass: create grouped notifications
    const result: GroupedNotification[] = [];

    groups.forEach((items) => {
      if (items.length > 1) {
        // Create a group notification
        const latest = items[0];
        const groupedNotification: GroupedNotification = {
          ...latest,
          groupCount: items.length,
          groupedItems: items,
          isGroup: true,
          title: `${items.length} ${latest.type} notifications`,
          message: items.map(item => item.message).join(', ')
        };
        result.push(groupedNotification);
      } else {
        // Single item, add as ungrouped
        result.push({
          ...items[0],
          groupCount: 1,
          groupedItems: [],
          isGroup: false
        });
      }
    });

    // Add ungrouped notifications
    ungrouped.forEach((notification) => {
      result.push({
        ...notification,
        groupCount: 1,
        groupedItems: [],
        isGroup: false
      });
    });

    // Sort by most recent
    return result.sort((a, b) => {
      const dateA = new Date(a.created_at || a.timestamp || 0).getTime();
      const dateB = new Date(b.created_at || b.timestamp || 0).getTime();
      return dateB - dateA;
    });
  }, [notifications]);

  const groupByType = (type: string) => {
    return groupedNotifications.filter((n) => n.type === type);
  };

  const getGroupCount = (groupKey: string) => {
    const group = groupedNotifications.find((n) => n.group_key === groupKey && n.isGroup);
    return group?.groupCount || 0;
  };

  return {
    groupedNotifications,
    groupByType,
    getGroupCount
  };
};
