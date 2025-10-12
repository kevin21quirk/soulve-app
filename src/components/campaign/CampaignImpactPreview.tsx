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
      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-[#0ce4af]/5 to-[#18a5fe]/5 border-2 border-transparent bg-origin-border"
      style={{
        backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(12, 228, 175, 0.2), rgba(24, 165, 254, 0.2))',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#0ce4af]/20 to-[#18a5fe]/20 flex items-center justify-center">
          <Icon className="h-4 w-4 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent" />
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
