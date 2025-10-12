import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Share2, ExternalLink, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CampaignQuickActionsProps {
  campaignId: string;
  onDonate?: () => void;
  onShare?: () => void;
  currency?: string;
}

export const CampaignQuickActions = ({ 
  campaignId, 
  onDonate,
  onShare,
  currency = 'GBP'
}: CampaignQuickActionsProps) => {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  
  const quickAmounts = [5, 10, 25, 50];

  const handleQuickDonate = (amount: number) => {
    setSelectedAmount(amount);
    toast({
      title: "Quick Donate",
      description: `Processing ${currency}${amount} donation...`,
    });
    // In real implementation, this would trigger donation flow
    if (onDonate) onDonate();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Support this campaign',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Campaign link copied to clipboard",
      });
    }
    if (onShare) onShare();
  };

  return (
    <div className="space-y-3">
      {/* Quick Amount Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground flex-shrink-0">Quick donate:</span>
        <div className="flex gap-2 flex-wrap">
          {quickAmounts.map((amount, index) => (
            <motion.div
              key={amount}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDonate(amount)}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {currency === 'GBP' ? '£' : '$'}{amount}
              </Button>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: quickAmounts.length * 0.05 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onDonate}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Custom
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex gap-2">
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onDonate}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <Heart className="h-4 w-4 mr-2 group-hover:fill-current transition-all" />
            <span className="relative z-10">Donate Now</span>
            <Sparkles className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(`/campaigns/${campaignId}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
