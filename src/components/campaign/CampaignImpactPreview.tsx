import { motion } from 'framer-motion';
import { Lightbulb, Heart, Users, Zap } from 'lucide-react';

interface CampaignImpactPreviewProps {
  description: string;
  category: string;
}

export const CampaignImpactPreview = ({ description, category }: CampaignImpactPreviewProps) => {
  const getImpactIcon = () => {
    switch (category) {
      case 'fundraising':
        return Heart;
      case 'volunteer':
        return Users;
      case 'awareness':
        return Lightbulb;
      default:
        return Zap;
    }
  };

  const Icon = getImpactIcon();

  // Extract first sentence or first 100 characters as impact statement
  const getImpactStatement = () => {
    const firstSentence = description.split(/[.!?]/)[0];
    if (firstSentence.length > 100) {
      return firstSentence.slice(0, 100) + '...';
    }
    return firstSentence;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground mb-0.5">Impact</p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {getImpactStatement()}
        </p>
      </div>
    </motion.div>
  );
};
