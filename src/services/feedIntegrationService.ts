
import { FeedPost } from "@/types/feed";
import { useSocialFeed } from "@/hooks/useSocialFeed";

export interface HelpCenterPost {
  id: string;
  title: string;
  description: string;
  author: string;
  category: 'help-needed' | 'help-offered';
  location?: string;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
}

export interface CampaignUpdate {
  id: string;
  title: string;
  description: string;
  campaignId: string;
  author: string;
  type: 'fundraising' | 'volunteer' | 'awareness' | 'community';
  location?: string;
  tags?: string[];
}

export const convertHelpCenterToFeedPost = (helpPost: HelpCenterPost): FeedPost => {
  return {
    id: `help-${helpPost.id}`,
    author: helpPost.author,
    authorId: `help-author-${helpPost.id}`,
    avatar: "",
    title: helpPost.title,
    description: helpPost.description,
    category: helpPost.category,
    timestamp: "Just now",
    location: helpPost.location || "Community",
    responses: 0,
    likes: 0,
    shares: 0,
    isLiked: false,
    isBookmarked: false,
    isShared: false,
    urgency: helpPost.urgency || 'medium',
    tags: [...(helpPost.tags || []), 'help-center'],
    visibility: 'public'
  };
};

export const convertCampaignToFeedPost = (campaign: CampaignUpdate): FeedPost => {
  return {
    id: `campaign-${campaign.id}`,
    author: campaign.author,
    authorId: `campaign-author-${campaign.id}`,
    avatar: "",
    title: campaign.title,
    description: campaign.description,
    category: "announcement",
    timestamp: "Just now",
    location: campaign.location || "Community",
    responses: 0,
    likes: 0,
    shares: 0,
    isLiked: false,
    isBookmarked: false,
    isShared: false,
    urgency: 'medium',
    tags: [...(campaign.tags || []), 'campaign', campaign.type],
    visibility: 'public'
  };
};

export const autoPublishToFeed = (
  content: HelpCenterPost | CampaignUpdate,
  type: 'help-center' | 'campaign',
  onPostCreated: (post: FeedPost) => void
) => {
  let feedPost: FeedPost;
  
  if (type === 'help-center') {
    feedPost = convertHelpCenterToFeedPost(content as HelpCenterPost);
  } else {
    feedPost = convertCampaignToFeedPost(content as CampaignUpdate);
  }
  
  // Auto-publish to feed
  onPostCreated(feedPost);
  
  console.log(`Auto-published ${type} content to feed:`, feedPost.title);
  
  return feedPost;
};
