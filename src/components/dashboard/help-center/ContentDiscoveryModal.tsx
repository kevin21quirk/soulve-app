import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  MapPin,
  Clock,
  Users,
  PoundSterling,
  Heart,
  HandHeart,
  ExternalLink,
  Filter,
  X,
  Share2,
  Check,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ContentDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  contentType: "posts" | "campaigns";
  initialCategory?: string;
  initialUrgency?: string;
  showShareActions?: boolean;
}

interface PostResult {
  id: string;
  title: string;
  content: string | null;
  location: string | null;
  category: string | null;
  urgency: string | null;
  created_at: string;
  author_id: string;
}

interface CampaignResult {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string;
  urgency: string;
  created_at: string;
  current_amount: number | null;
  goal_amount: number | null;
  creator_id: string;
}

const ContentDiscoveryModal = ({
  isOpen,
  onClose,
  title,
  description,
  contentType,
  initialCategory,
  initialUrgency,
  showShareActions = false,
}: ContentDiscoveryModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = async (item: any, type: 'post' | 'campaign') => {
    const shareUrl = `${window.location.origin}/dashboard?tab=${type === 'post' ? 'feed' : 'campaigns'}&${type}=${item.id}`;
    const shareText = type === 'post' 
      ? `Check out this: ${item.title || item.content?.substring(0, 50)}...`
      : `Support this campaign: ${item.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title || 'Check this out',
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or share failed, fall back to copy
        await copyToClipboard(item.id, shareUrl);
      }
    } else {
      await copyToClipboard(item.id, shareUrl);
    }
  };

  const copyToClipboard = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast({
        title: "Link copied!",
        description: "Share this link with your network"
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        variant: "destructive"
      });
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(initialCategory || "all");
  const [urgency, setUrgency] = useState(initialUrgency || "all");
  const [showFilters, setShowFilters] = useState(false);

  // Reset filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setCategory(initialCategory || "all");
      setUrgency(initialUrgency || "all");
    }
  }, [isOpen, initialCategory, initialUrgency]);

  // Fetch posts
  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ["discovery-posts", searchQuery, category, urgency],
    queryFn: async (): Promise<PostResult[]> => {
      let query = supabase
        .from("posts")
        .select(`
          id,
          title,
          content,
          location,
          category,
          urgency,
          created_at,
          author_id
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      if (urgency && urgency !== "all") {
        query = query.eq("urgency", urgency);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as PostResult[];
    },
    enabled: isOpen && contentType === "posts",
  });

  // Fetch campaigns
  const { data: campaigns, isLoading: loadingCampaigns } = useQuery({
    queryKey: ["discovery-campaigns", searchQuery, category, urgency],
    queryFn: async (): Promise<CampaignResult[]> => {
      let query = supabase
        .from("campaigns")
        .select(`
          id,
          title,
          description,
          location,
          category,
          urgency,
          created_at,
          current_amount,
          goal_amount,
          creator_id
        `)
        .in("status", ["active", "published"])
        .order("created_at", { ascending: false })
        .limit(20);

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      if (urgency && urgency !== "all") {
        query = query.eq("urgency", urgency);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as CampaignResult[];
    },
    enabled: isOpen && contentType === "campaigns",
  });

  const handleViewPost = (postId: string) => {
    onClose();
    navigate(`/dashboard?tab=feed&post=${postId}`);
  };

  const handleViewCampaign = (campaignId: string) => {
    onClose();
    navigate(`/dashboard?tab=campaigns&campaign=${campaignId}`);
  };

  const getUrgencyColor = (urgencyLevel: string | null) => {
    switch (urgencyLevel) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
  };

  const getCategoryLabel = (cat: string | null) => {
    const labels: Record<string, string> = {
      volunteer: "Volunteer",
      "help-needed": "Help Needed",
      "help-offered": "Help Offered",
      community: "Community",
      fundraising: "Fundraising",
      education: "Education",
      environment: "Environment",
      health: "Health",
      homelessness: "Homelessness",
    };
    return cat ? labels[cat] || cat : "General";
  };

  const isLoading = contentType === "posts" ? loadingPosts : loadingCampaigns;
  const results = contentType === "posts" ? posts : campaigns;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {contentType === "posts" ? (
              <HandHeart className="h-5 w-5 text-green-600" />
            ) : (
              <PoundSterling className="h-5 w-5 text-blue-600" />
            )}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${contentType === "posts" ? "opportunities" : "campaigns"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-muted" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="flex gap-2 flex-wrap">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {contentType === "posts" ? (
                    <>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="help-needed">Help Needed</SelectItem>
                      <SelectItem value="help-offered">Help Offered</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="fundraising">Fundraising</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="homelessness">Homelessness</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {(category !== "all" || urgency !== "all" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategory("all");
                    setUrgency("all");
                    setSearchQuery("");
                  }}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <ScrollArea className="flex-1 min-h-0 mt-4">
          <div className="space-y-3 pr-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg" />
              ))
            ) : results && results.length > 0 ? (
              contentType === "posts" ? (
                (results as PostResult[]).map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewPost(post.id)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-foreground line-clamp-1 flex-1">
                        {post.title || "Untitled"}
                      </h4>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryLabel(post.category)}
                        </Badge>
                        {post.urgency && (
                          <Badge className={getUrgencyColor(post.urgency)}>
                            {post.urgency}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {post.content || "No description"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {post.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {post.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                (results as CampaignResult[]).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewCampaign(campaign.id)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-foreground line-clamp-1 flex-1">
                        {campaign.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryLabel(campaign.category)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {campaign.description || "No description"}
                    </p>
                    
                    {/* Donation progress */}
                    {campaign.goal_amount && campaign.goal_amount > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            £{(campaign.current_amount || 0).toLocaleString()} raised
                          </span>
                          <span className="font-medium">
                            £{campaign.goal_amount.toLocaleString()} goal
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            ((campaign.current_amount || 0) / campaign.goal_amount) * 100,
                            100
                          )}
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {campaign.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {campaign.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {showShareActions ? (
                          <Button 
                            size="sm" 
                            className="text-xs bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(campaign, 'campaign');
                            }}
                          >
                            {copiedId === campaign.id ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <Share2 className="h-3 w-3 mr-1" />
                            )}
                            {copiedId === campaign.id ? 'Copied!' : 'Share'}
                          </Button>
                        ) : (
                          <Button size="sm" className="text-xs bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                            <PoundSterling className="h-3 w-3 mr-1" />
                            Donate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {contentType === "posts" ? (
                  <>
                    <HandHeart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No opportunities found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </>
                ) : (
                  <>
                    <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No campaigns found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDiscoveryModal;
