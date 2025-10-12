import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CampaignProgressBarProps {
  currentAmount: number;
  goalAmount: number;
  progressPercentage: number;
  currency?: string;
}

export const CampaignProgressBar = ({ 
  currentAmount, 
  goalAmount, 
  progressPercentage,
  currency = 'GBP'
}: CampaignProgressBarProps) => {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const getMilestoneColor = () => {
    if (progressPercentage >= 100) return 'hsl(var(--success))';
    if (progressPercentage >= 75) return 'hsl(var(--primary))';
    if (progressPercentage >= 50) return 'hsl(var(--accent))';
    return 'hsl(var(--muted-foreground))';
  };

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            boxShadow: '0 0 10px hsla(var(--primary), 0.5)'
          }}
        />
        
        {/* Milestone markers */}
        {[25, 50, 75].map(milestone => (
          <div
            key={milestone}
            className="absolute top-0 bottom-0 w-[2px] bg-background"
            style={{ left: `${milestone}%` }}
          />
        ))}
      </div>

      {/* Amount Display */}
      <div className="flex items-baseline justify-between">
        <div className="space-y-0.5">
          <motion.div 
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {formatter.format(currentAmount)}
          </motion.div>
          <div className="text-sm text-muted-foreground">
            raised of {formatter.format(goalAmount)} goal
          </div>
        </div>
        
        <motion.div 
          className={cn(
            "text-3xl font-bold",
            progressPercentage >= 100 ? "text-success" : "text-primary"
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          {Math.round(progressPercentage)}%
        </motion.div>
      </div>

      {/* Remaining Amount */}
      {progressPercentage < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          Just <span className="font-semibold text-foreground">
            {formatter.format(goalAmount - currentAmount)}
          </span> away from goal!
        </motion.div>
      )}
    </div>
  );
};
