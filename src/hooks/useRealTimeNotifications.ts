import { useNotificationState } from "./useNotificationState";
import { useNotificationGenerator } from "./useNotificationGenerator";

const mockNotifications = [
  {
    id: "1",
    type: "donation" as const,
    title: "New Donation Received!",
    message: "Sarah Johnson donated $50 to Community Garden Project",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isRead: false,
    metadata: {
      amount: 50,
      donorName: "Sarah Johnson",
      campaignTitle: "Community Garden Project"
    }
  },
  {
    id: "2",
    type: "campaign" as const,
    title: "Campaign Milestone Reached",
    message: "Your campaign has reached 75% of its goal!",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isRead: false,
    metadata: {
      campaignTitle: "Educational Technology for Schools"
    }
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    message: "You have a new message from Alex Chen",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: true,
    metadata: {
      senderName: "Alex Chen"
    }
  },
  {
    id: "4",
    type: "social",
    title: "Post Interaction",
    message: "Mike Wilson liked your post about environmental action",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isRead: false,
    metadata: {
      senderName: "Mike Wilson",
      actionType: "liked"
    }
  },
  {
    id: "5",
    type: "donation",
    title: "Recurring Donation",
    message: "Monthly donation of $25 processed successfully",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    isRead: true,
    metadata: {
      amount: 25,
      donorName: "Anonymous",
      campaignTitle: "Local Food Bank Support"
    }
  }
];

export const useRealTimeNotifications = () => {
  const notificationState = useNotificationState(mockNotifications);
  
  // Enable real-time notification generation
  useNotificationGenerator({
    addNotification: notificationState.addNotification,
    isEnabled: true
  });

  return notificationState;
};
