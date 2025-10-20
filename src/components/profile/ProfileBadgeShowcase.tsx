import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Award, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BadgeAward {
  id: string;
  awarded_at: string;
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
    badge_category: string;
    event_identifier?: string;
    limited_edition: boolean;
  };
}

interface ProfileBadgeShowcaseProps {
  userId: string;
  maxDisplay?: number;
  showViewAll?: boolean;
}

const ProfileBadgeShowcase = ({ 
  userId, 
  maxDisplay = 5, 
  showViewAll = true 
}: ProfileBadgeShowcaseProps) => {
  const [badges, setBadges] = useState<BadgeAward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllDialog, setShowAllDialog] = useState(false);

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badge_award_log')
        .select(`
          id,
          awarded_at,
          badge:badges (
            id,
            name,
            description,
            icon,
            rarity,
            badge_category,
            event_identifier,
            limited_edition
          )
        `)
        .eq('user_id', userId)
        .eq('verification_status', 'verified')
        .is('revoked_at', null)
        .order('awarded_at', { ascending: false });

      if (error) throw error;

      // Prioritize event/legendary/limited edition badges
      const sortedBadges = (data || []).sort((a, b) => {
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
        const aScore = 
          (a.badge.badge_category === 'event' ? 100 : 0) +
          (a.badge.limited_edition ? 50 : 0) +
          (rarityOrder[a.badge.rarity as keyof typeof rarityOrder] || 0);
        const bScore = 
          (b.badge.badge_category === 'event' ? 100 : 0) +
          (b.badge.limited_edition ? 50 : 0) +
          (rarityOrder[b.badge.rarity as keyof typeof rarityOrder] || 0);
        return bScore - aScore;
      });

      setBadges(sortedBadges);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "bg-gradient-to-r from-yellow-400 to-orange-500";
      case "epic": return "bg-gradient-to-r from-purple-400 to-pink-500";
      case "rare": return "bg-gradient-to-r from-blue-400 to-cyan-500";
      default: return "bg-gradient-to-r from-gray-300 to-gray-400";
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "shadow-lg shadow-yellow-500/50";
      case "epic": return "shadow-lg shadow-purple-500/50";
      case "rare": return "shadow-lg shadow-blue-500/50";
      default: return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (badges.length === 0) {
    return null;
  }

  const displayedBadges = badges.slice(0, maxDisplay);
  const hasMore = badges.length > maxDisplay;

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {displayedBadges.map((award) => (
          <button
            key={award.id}
            onClick={() => setShowAllDialog(true)}
            className={`
              relative group flex items-center gap-2 px-3 py-2 rounded-lg
              ${getRarityColor(award.badge.rarity)}
              ${getRarityGlow(award.badge.rarity)}
              text-white hover:scale-105 transition-all duration-200
            `}
          >
            {award.badge.limited_edition && (
              <Sparkles className="h-3 w-3 absolute -top-1 -right-1 animate-pulse" />
            )}
            <span className="text-lg">{award.badge.icon}</span>
            <span className="text-sm font-semibold truncate max-w-[100px]">
              {award.badge.name}
            </span>
            {award.badge.badge_category === 'event' && (
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                Event
              </Badge>
            )}
          </button>
        ))}
        
        {hasMore && showViewAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllDialog(true)}
            className="border-dashed"
          >
            <Award className="h-4 w-4 mr-1" />
            +{badges.length - maxDisplay} more
          </Button>
        )}
      </div>

      <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              All Badges ({badges.length})
            </DialogTitle>
            <DialogDescription>
              Collection of earned achievements and recognitions
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {badges.map((award) => (
              <div
                key={award.id}
                className={`
                  relative p-4 rounded-lg border-2
                  ${getRarityColor(award.badge.rarity)}
                  ${getRarityGlow(award.badge.rarity)}
                `}
              >
                {award.badge.limited_edition && (
                  <Sparkles className="h-4 w-4 absolute top-2 right-2 text-white animate-pulse" />
                )}
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{award.badge.icon}</span>
                  <div className="flex-1 text-white">
                    <h4 className="font-bold text-sm">{award.badge.name}</h4>
                    <p className="text-xs opacity-90 mt-1">{award.badge.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                        {award.badge.rarity}
                      </Badge>
                      {award.badge.badge_category === 'event' && (
                        <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                          Event
                        </Badge>
                      )}
                      {award.badge.limited_edition && (
                        <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                          Limited
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs opacity-75 mt-2">
                      Earned {new Date(award.awarded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileBadgeShowcase;
