import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, CircleDot } from "lucide-react";
import { NotificationPriority } from "@/types/notifications";

interface NotificationPriorityBadgeProps {
  priority: NotificationPriority;
  showIcon?: boolean;
}

export const NotificationPriorityBadge = ({ priority, showIcon = true }: NotificationPriorityBadgeProps) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'urgent':
        return {
          variant: 'destructive' as const,
          icon: AlertCircle,
          label: 'Urgent',
          className: 'bg-red-500 text-white animate-pulse'
        };
      case 'high':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          label: 'High Priority',
          className: 'bg-orange-500 text-white'
        };
      case 'normal':
        return {
          variant: 'secondary' as const,
          icon: Info,
          label: 'Normal',
          className: ''
        };
      case 'low':
        return {
          variant: 'outline' as const,
          icon: CircleDot,
          label: 'Low',
          className: 'opacity-70'
        };
    }
  };

  const config = getPriorityConfig();
  const Icon = config.icon;

  if (priority === 'normal') return null; // Don't show badge for normal priority

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
};
