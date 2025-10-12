import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { AlertCircle, Flame, TrendingUp, Infinity as InfinityIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignBadgesProps {
  category: string;
  urgency: 'low' | 'medium' | 'high';
  status: string;
  isOngoing: boolean;
  daysRemaining: number | null;
  isTrending?: boolean;
}

export const CampaignBadges = ({ 
  category, 
  urgency, 
  status,
  isOngoing,
  daysRemaining,
  isTrending 
}: CampaignBadgesProps) => {
  const getUrgencyConfig = () => {
    switch (urgency) {
      case 'high':
        return { 
          label: 'Urgent', 
          className: 'bg-destructive/10 text-destructive border-destructive/20',
          icon: AlertCircle
        };
      case 'medium':
        return { 
          label: 'High Priority', 
          className: 'bg-warning/10 text-warning border-warning/20',
          icon: Flame
        };
      default:
        return null;
    }
  };

  const urgencyConfig = getUrgencyConfig();
  const isEndingSoon = !isOngoing && daysRemaining !== null && daysRemaining <= 7;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Active Campaign Badge */}
      {status === 'active' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
        >
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mr-1"
            >
              ●
            </motion.span>
            Active Campaign
          </Badge>
        </motion.div>
      )}

      {/* Ongoing Badge */}
      {isOngoing && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.15 }}
        >
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            <InfinityIcon className="h-3 w-3 mr-1" />
            Ongoing
          </Badge>
        </motion.div>
      )}

      {/* Ending Soon Badge */}
      {isEndingSoon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            <Clock className="h-3 w-3 mr-1" />
            Ending Soon
          </Badge>
        </motion.div>
      )}

      {/* Urgency Badge */}
      {urgencyConfig && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.25 }}
        >
          <Badge variant="outline" className={urgencyConfig.className}>
            <urgencyConfig.icon className="h-3 w-3 mr-1" />
            {urgencyConfig.label}
          </Badge>
        </motion.div>
      )}

      {/* Trending Badge */}
      {isTrending && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
        >
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
        </motion.div>
      )}

      {/* Category Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.35 }}
      >
        <Badge variant="secondary">
          {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      </motion.div>
    </div>
  );
};
