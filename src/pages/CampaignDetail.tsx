import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { CampaignProgressBar } from '@/components/campaign/CampaignProgressBar';
import { CampaignStats } from '@/components/campaign/CampaignStats';
import { CampaignBadges } from '@/components/campaign/CampaignBadges';
import { DonorAvatarList } from '@/components/campaign/DonorAvatarList';
import { CampaignImpactPreview } from '@/components/campaign/CampaignImpactPreview';
import { CampaignQuickActions } from '@/components/campaign/CampaignQuickActions';
import { useCampaignStats } from '@/hooks/useCampaignStats';
import { useCampaignInteractions } from '@/hooks/useCampaignInteractions';
import { useToast } from '@/hooks/use-toast';
import { LoadingState } from '@/components/ui/loading-state';
import SEOHead from '@/components/seo/SEOHead';
import StructuredData from '@/components/seo/StructuredData';
import EnhancedPostReactions from '@/components/dashboard/EnhancedPostReactions';
import PostComments from '@/components/dashboard/PostComments';
import { useRealSocialFeed } from '@/hooks/useRealSocialFeed';
import { FeedPost } from '@/types/feed';
import { useState } from 'react';

const CampaignDetail = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [commentsExpanded, setCommentsExpanded] = useState(true);
  const { 
    handleLike: feedHandleLike, 
    handleShare: feedHandleShare, 
    handleAddComment: feedHandleAddComment, 
    handleBookmark: feedHandleBookmark 
  } = useRealSocialFeed();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!campaignId
  });

  const { stats } = useCampaignStats(
    campaignId || '',
    campaign?.goal_amount || 0,
    campaign?.current_amount || 0,
    campaign?.end_date
  );

  const { interactions, refetch: refetchInteractions } = useCampaignInteractions(campaignId || '');

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign?.title,
          text: campaign?.description,
          url: url,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Campaign link copied to clipboard"
      });
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading campaign..." />;
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Campaign not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Fetch creator profile separately
  const { data: creator } = useQuery({
    queryKey: ['creator', campaign?.creator_id],
    queryFn: async () => {
      if (!campaign?.creator_id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', campaign.creator_id)
        .single();
      return data;
    },
    enabled: !!campaign?.creator_id
  });

  const creatorName = creator
    ? `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Anonymous'
    : 'Anonymous';

  // Transform campaign to FeedPost format for social interactions
  const galleryImages = campaign?.gallery_images 
    ? (Array.isArray(campaign.gallery_images) 
        ? campaign.gallery_images 
        : []) as string[]
    : [];

  const campaignAsFeedPost: FeedPost = campaign ? {
    id: `campaign_${campaign.id}`,
    author: creatorName,
    authorId: campaign.creator_id,
    avatar: creator?.avatar_url || '',
    timestamp: campaign.created_at,
    title: campaign.title,
    description: campaign.description,
    category: campaign.category,
    urgency: campaign.urgency,
    location: campaign.location,
    tags: campaign.tags || [],
    media: galleryImages.map((url: string, i: number) => ({
      id: `${campaign.id}-${i}`,
      type: 'image' as const,
      url: url,
      filename: `image-${i}`
    })),
    likes: interactions.likes,
    responses: interactions.comments,
    shares: interactions.shares,
    isLiked: interactions.isLiked,
    isBookmarked: interactions.isBookmarked,
    isShared: false,
    comments: []
  } : {} as FeedPost;

  const handleCampaignLike = async (postId: string) => {
    await feedHandleLike(`campaign_${campaignId}`);
    refetchInteractions();
  };

  const handleCampaignShare = async (postId: string) => {
    await feedHandleShare(`campaign_${campaignId}`);
    refetchInteractions();
  };

  const handleCampaignComment = async (postId: string, content: string) => {
    await feedHandleAddComment(`campaign_${campaignId}`, content);
    refetchInteractions();
  };

  const handleCampaignReaction = async (postId: string, reactionType: string) => {
    await feedHandleLike(`campaign_${campaignId}`);
    refetchInteractions();
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${campaign.title} - Support This Campaign`}
        description={campaign.description.substring(0, 155)}
        keywords={[
          'campaign',
          campaign.category,
          'social impact',
          'fundraising',
          'charity',
          'donation',
          campaign.urgency === 'high' ? 'urgent' : 'community'
        ]}
        image={campaign.featured_image || 'https://join-soulve.com/og-image.png'}
        url={`https://join-soulve.com/campaigns/${campaignId}`}
        type="article"
        author={creatorName}
        publishedTime={campaign.created_at}
        modifiedTime={campaign.updated_at}
      />
      <StructuredData
        type="Campaign"
        data={{
          name: campaign.title,
          description: campaign.description,
          url: `https://join-soulve.com/campaigns/${campaignId}`,
          image: campaign.featured_image || 'https://join-soulve.com/og-image.png',
          startDate: campaign.created_at,
          endDate: campaign.end_date,
          location: campaign.location,
          organizer: {
            name: creatorName,
            url: `https://join-soulve.com/profile/${campaign.creator_id}`
          },
          offers: {
            price: 0,
            priceCurrency: campaign.currency
          }
        }}
      />
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Campaign Header */}
        <div className="mb-6">
          <CampaignBadges
            category={campaign.category}
            urgency={campaign.urgency as 'low' | 'medium' | 'high'}
            status={campaign.status}
            isOngoing={!campaign.end_date}
            daysRemaining={stats?.daysRemaining || null}
            isTrending={false}
          />
          <h1 className="text-4xl font-bold mt-4 mb-2">{campaign.title}</h1>
          <p className="text-muted-foreground">By {creatorName}</p>
        </div>

        {/* Featured Image */}
        {campaign.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={campaign.featured_image}
              alt={campaign.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">About this campaign</h2>
              <p className="text-foreground whitespace-pre-wrap">{campaign.description}</p>
            </div>

            {/* Story */}
            {campaign.story && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">The Story</h2>
                <p className="text-foreground whitespace-pre-wrap">{campaign.story}</p>
              </div>
            )}

            {/* Impact */}
            <CampaignImpactPreview
              description={campaign.description}
              category={campaign.category}
            />

            {/* Gallery */}
            {campaign.gallery_images && Array.isArray(campaign.gallery_images) && campaign.gallery_images.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {(campaign.gallery_images as string[]).map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Social Interactions Section */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-semibold mb-6">Engage with this Campaign</h2>
              
              <EnhancedPostReactions
                post={campaignAsFeedPost}
                onLike={handleCampaignLike}
                onShare={handleCampaignShare}
                onRespond={() => setCommentsExpanded(true)}
                onReaction={handleCampaignReaction}
              />

              <PostComments
                post={campaignAsFeedPost}
                onAddComment={handleCampaignComment}
                isExpanded={commentsExpanded}
              />
            </div>
          </div>

          {/* Right Column - Donation Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Progress */}
              <div className="bg-card border rounded-lg p-6">
                <CampaignProgressBar
                  currentAmount={campaign.current_amount || 0}
                  goalAmount={campaign.goal_amount || 0}
                  progressPercentage={stats?.progressPercentage || 0}
                  currency={campaign.currency}
                />

                <div className="mt-4">
                  <CampaignStats
                    donorCount={stats?.donorCount || 0}
                    recentDonations24h={stats?.recentDonations24h || 0}
                    daysRemaining={stats?.daysRemaining || null}
                    isOngoing={stats?.isOngoing || false}
                    urgency={campaign.urgency as 'low' | 'medium' | 'high'}
                  />
                </div>

                {/* Quick Actions */}
                <div className="mt-6">
                  <CampaignQuickActions
                    campaignId={campaign.id}
                    currency={campaign.currency}
                  />
                </div>

                {/* Donors */}
                {stats && stats.recentDonors.length > 0 && (
                  <div className="mt-6">
                    <DonorAvatarList
                      donors={stats.recentDonors}
                      totalCount={stats.donorCount}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
