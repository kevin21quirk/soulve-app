
import React from "react";
import { Bell } from "lucide-react";

const NotificationEmptyState = () => {
  return (
    <div className="p-8 text-center text-gray-500">
      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      <h3 className="font-medium mb-2">No notifications</h3>
      <p className="text-sm">You're all caught up!</p>
    </div>
  );
};

export default NotificationEmptyState;
