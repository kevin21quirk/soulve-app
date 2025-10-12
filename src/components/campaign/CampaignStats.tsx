import { Users, TrendingUp, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CampaignStatsProps {
  donorCount: number;
  recentDonations24h: number;
  daysRemaining: number | null;
  isOngoing: boolean;
  urgency: 'low' | 'medium' | 'high';
}

export const CampaignStats = ({ 
  donorCount, 
  recentDonations24h, 
  daysRemaining,
  isOngoing,
  urgency
}: CampaignStatsProps) => {
  const stats = [
    {
      icon: Users,
      label: 'donors',
      value: donorCount,
      show: true
    },
    {
      icon: TrendingUp,
      label: 'today',
      value: recentDonations24h > 0 ? `+${recentDonations24h}` : '0',
      show: recentDonations24h > 0,
      highlight: true
    },
    {
      icon: isOngoing ? Target : Clock,
      label: isOngoing ? 'ongoing' : 'left',
      value: isOngoing ? '∞' : daysRemaining,
      show: true,
      urgency: !isOngoing && daysRemaining !== null && daysRemaining <= 7
    }
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {stats.filter(stat => stat.show).map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "flex items-center gap-1.5 text-sm",
            stat.highlight && "text-success font-medium",
            stat.urgency && "text-destructive font-medium"
          )}
        >
          <div className="p-1.5 rounded-full bg-gradient-to-r from-[#0ce4af]/10 to-[#18a5fe]/10">
            <stat.icon className="h-4 w-4" />
          </div>
          <span className="font-semibold">{stat.value}</span>
          <span className="text-muted-foreground">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
};
