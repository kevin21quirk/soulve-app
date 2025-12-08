import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Users,
  Target,
  Clock,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface CampaignDetailSheetProps {
  campaignId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CampaignDetails {
  id: string;
  title: string;
  description: string | null;
  story: string | null;
  goal_amount: number | null;
  current_amount: number | null;
  featured_image: string | null;
  category: string;
  status: string;
  urgency: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  creator_id: string;
  enable_comments: boolean | null;
  total_views: number | null;
  total_shares: number | null;
  creator?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

const CampaignDetailSheet = ({ campaignId, isOpen, onClose }: CampaignDetailSheetProps) => {
  const { toast } = useToast();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign-detail', campaignId],
    queryFn: async () => {
      if (!campaignId) return null;
      
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          creator:profiles!campaigns_creator_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      
      // Transform creator array to single object
      const creatorArray = data.creator as unknown as Array<{first_name: string | null; last_name: string | null; avatar_url: string | null}>;
      return {
        ...data,
        creator: creatorArray?.[0] || null,
      } as CampaignDetails;
    },
    enabled: !!campaignId && isOpen,
  });

  const progress = campaign?.goal_amount 
    ? Math.min(((campaign.current_amount || 0) / campaign.goal_amount) * 100, 100)
    : 0;

  const daysRemaining = campaign?.end_date
    ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: campaign?.title,
        text: campaign?.description || '',
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Campaign link copied to clipboard",
      });
    }
  };

  const handleDonate = () => {
    toast({
      title: "Donation",
      description: "Donation feature coming soon",
    });
  };

  const creatorName = campaign?.creator
    ? `${campaign.creator.first_name || ''} ${campaign.creator.last_name || ''}`.trim() || 'Anonymous'
    : 'Anonymous';

  const creatorInitials = campaign?.creator
    ? `${campaign.creator.first_name?.[0] || ''}${campaign.creator.last_name?.[0] || ''}`.toUpperCase() || 'A'
    : 'A';

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4 pt-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : campaign ? (
          <>
            <SheetHeader className="pb-4">
              <SheetTitle className="text-xl font-bold text-left">
                {campaign.title}
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6">
              {/* Featured Image */}
              {campaign.featured_image && (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={campaign.featured_image}
                    alt={campaign.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge 
                    className="absolute top-2 right-2"
                    variant={campaign.urgency === 'critical' ? 'destructive' : 'secondary'}
                  >
                    {campaign.urgency}
                  </Badge>
                </div>
              )}

              {/* Creator Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={campaign.creator?.avatar_url || undefined} />
                  <AvatarFallback>{creatorInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{creatorName}</p>
                  <p className="text-xs text-muted-foreground">Campaign Organiser</p>
                </div>
              </div>

              {/* Progress Section */}
              {campaign.goal_amount && (
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      £{(campaign.current_amount || 0).toLocaleString()} raised
                    </span>
                    <span className="text-muted-foreground">
                      of £{campaign.goal_amount.toLocaleString()} goal
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(progress)}% funded</span>
                    {daysRemaining !== null && (
                      <span>{daysRemaining} days remaining</span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{campaign.total_views || 0}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Share2 className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{campaign.total_shares || 0}</p>
                  <p className="text-xs text-muted-foreground">Shares</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Target className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{campaign.category}</p>
                  <p className="text-xs text-muted-foreground">Category</p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="space-y-2 text-sm">
                {campaign.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{campaign.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Started {format(new Date(campaign.start_date), 'dd MMM yyyy')}</span>
                </div>
                {campaign.end_date && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Ends {format(new Date(campaign.end_date), 'dd MMM yyyy')}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {campaign.description && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {campaign.description}
                  </p>
                </div>
              )}

              {/* Story */}
              {campaign.story && (
                <div>
                  <h3 className="font-semibold mb-2">Our Story</h3>
                  <div 
                    className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: campaign.story }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleDonate} className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Donate
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground">Campaign not found</p>
            <Button variant="outline" onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CampaignDetailSheet;
