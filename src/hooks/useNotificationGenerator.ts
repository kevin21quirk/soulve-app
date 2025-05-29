
import { useEffect } from "react";

interface NotificationGenerator {
  addNotification: (notification: any) => void;
  isEnabled?: boolean;
}

export const useNotificationGenerator = ({ addNotification, isEnabled = true }: NotificationGenerator) => {
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      // Randomly add new notifications
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const notificationTypes = ["donation", "campaign", "message", "social"];
        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        const newNotification = {
          type: randomType as any,
          title: "New Activity",
          message: "You have new activity on your account",
          isRead: false
        };
        
        addNotification(newNotification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification, isEnabled]);
};
