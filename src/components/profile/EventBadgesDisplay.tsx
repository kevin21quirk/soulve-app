import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Trophy, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface EventBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badge: {
    name: string;
    description: string;
    icon: string;
    rarity: string;
    badge_category: string;
    event_identifier?: string;
    limited_edition: boolean;
    current_award_count?: number;
    max_awards?: number;
  };
  contribution_details?: any;
}

interface EventBadgesDisplayProps {
  badges: EventBadge[];
}

const EventBadgesDisplay = ({ badges }: EventBadgesDisplayProps) => {
  const [selectedBadge, setSelectedBadge] = useState<EventBadge | null>(null);

  const eventBadges = badges.filter(b => 
    b.badge.badge_category === 'event' || 
    b.badge.limited_edition || 
    b.badge.event_identifier
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'shadow-lg shadow-yellow-500/50';
      case 'epic': return 'shadow-lg shadow-purple-500/50';
      case 'rare': return 'shadow-md shadow-blue-500/50';
      default: return '';
    }
  };

  if (eventBadges.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Special Recognition Badges
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {eventBadges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${getRarityGlow(badge.badge.rarity)}`}
              >
                <div className="bg-card border-2 rounded-xl p-4 text-center relative overflow-hidden">
                  {badge.badge.limited_edition && (
                    <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-bl-lg font-bold">
                      LIMITED
                    </div>
                  )}
                  
                  <div className="text-5xl mb-2 group-hover:animate-bounce">
                    {badge.badge.icon}
                  </div>
                  
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                    {badge.badge.name}
                  </h4>
                  
                  <Badge 
                    className={`${getRarityColor(badge.badge.rarity)} text-xs`} 
                    variant="secondary"
                  >
                    {badge.badge.rarity}
                  </Badge>
                  
                  {badge.badge.event_identifier && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {badge.badge.event_identifier}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="text-6xl text-center mb-4">
              {selectedBadge?.badge.icon}
            </div>
            <DialogTitle className="text-center text-2xl">
              {selectedBadge?.badge.name}
            </DialogTitle>
            <DialogDescription className="text-center">
              {selectedBadge?.badge.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              <Badge className={getRarityColor(selectedBadge?.badge.rarity || '')}>
                {selectedBadge?.badge.rarity}
              </Badge>
              {selectedBadge?.badge.limited_edition && (
                <Badge variant="destructive">Limited Edition</Badge>
              )}
              {selectedBadge?.badge.badge_category && (
                <Badge variant="outline" className="capitalize">
                  {selectedBadge.badge.badge_category}
                </Badge>
              )}
            </div>

            {selectedBadge?.badge.event_identifier && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium text-center">
                  <Trophy className="inline h-4 w-4 mr-1" />
                  Event: {selectedBadge.badge.event_identifier}
                </p>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Earned on {format(new Date(selectedBadge?.earned_at || ''), 'PPP')}
                </span>
              </div>

              {selectedBadge?.badge.max_awards && (
                <p className="text-center text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {selectedBadge.badge.current_award_count || 0}
                  </span>
                  {' / '}
                  <span className="font-semibold text-foreground">
                    {selectedBadge.badge.max_awards}
                  </span>
                  {' '}holders worldwide
                </p>
              )}
            </div>

            {selectedBadge?.contribution_details && 
             Object.keys(selectedBadge.contribution_details).length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Your Contribution:</p>
                <div className="text-xs text-muted-foreground">
                  {Object.entries(selectedBadge.contribution_details).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-medium text-foreground">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventBadgesDisplay;
