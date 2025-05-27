
import { Bell } from "lucide-react";

const EmptyNotifications = () => {
  return (
    <div className="p-6 text-center text-gray-500">
      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
      <p>No notifications in this category</p>
      <p className="text-xs mt-1">You're all caught up!</p>
    </div>
  );
};

export default EmptyNotifications;
