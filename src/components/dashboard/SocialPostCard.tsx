
import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageCircle, Share2, MapPin, Clock, Plus, CheckCircle, Building } from 'lucide-react';
import { FeedPost } from '@/types/feed';
import { usePostReactions } from '@/hooks/usePostReactions';
import { useImpactTracking } from '@/hooks/useImpactTracking';
import { useAuth } from '@/contexts/AuthContext';
import ModernReactionPicker from '@/components/ui/modern-reaction-picker';
import ReactionDisplay from '@/components/ui/reaction-display';
import PostActions from './PostActions';
import { ConnectToHelpButton } from '@/components/connect';
import SelectHelperDialog from '@/components/help-completion/SelectHelperDialog';
import { HelpCompletionService } from '@/services/helpCompletionService';
import { useToast } from '@/hooks/use-toast';
import PostDetailModal from './PostDetailModal';
import { usePostComments } from '@/hooks/usePostComments';
import YouTubeEmbed from './YouTubeEmbed';
import { logger } from '@/utils/logger';
import TaggedText from './tagging/TaggedText';
import { supabase } from '@/integrations/supabase/client';

interface SocialPostCardProps {
  post: FeedPost;
  onLike: () => void;
  onShare: () => void;
  onBookmark: () => void;
  onComment: (content: string) => void;
  onReaction?: (postId: string, reactionType: string) => void;
  onPostDeleted?: () => void;
}

const SocialPostCard = memo(({ post, onLike, onShare, onBookmark, onComment, onReaction, onPostDeleted }: SocialPostCardProps) => {
  logger.debug('SocialPostCard rendered', {
    id: post.id,
    author: post.author,
    hasAuthorId: !!post.authorId
  });
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [showSelectHelper, setShowSelectHelper] = useState(false);
  const { reactions, toggleReaction } = usePostReactions(post.id);
  const { trackCommunityEngagement, trackHelpProvided } = useImpactTracking();

  const handleHelperSelected = async (helperId: string, helperName: string) => {
    try {
      if (!user?.id) return;
      
      // Create completion request
      await HelpCompletionService.createCompletionRequest(
        post.id,
        helperId,
        user.id,
        {
          post_id: post.id,
          helper_message: 'Marked as complete by requester'
        }
      );

      // Quick approve it immediately
      const completionRequest = await HelpCompletionService.getCompletionRequestForPost(post.id);
      if (completionRequest) {
        await HelpCompletionService.reviewCompletionRequest(completionRequest.id, {
          status: 'approved',
          feedback_rating: 5,
          feedback_message: 'Quick confirmed by requester'
        });
      }

      // Track the help provided
      await trackHelpProvided(post.title, {
        post_id: post.id,
        helper_id: helperId,
        requester_id: user.id
      });

      toast({
        title: "Help Confirmed! 🎉",
        description: `${helperName} has been awarded points for helping you.`,
      });
    } catch (error) {
      logger.error('Error confirming help', error);
      toast({
        title: "Error",
        description: "Failed to confirm help completion.",
        variant: "destructive"
      });
    }
  };

  const { comments } = usePostComments(post.id);

  const handleProfileClick = () => {
    logger.debug('SocialPostCard profile click', {
      postId: post.id,
      authorId: post.authorId,
      willNavigate: !!post.authorId
    });
    
    if (post.authorId) {
      navigate(`/profile/${post.authorId}`);
    } else {
      logger.warn('SocialPostCard cannot navigate - missing authorId');
    }
  };

  const handleUserTagClick = async (username: string) => {
    try {
      // Try to find user first
      const { data: userData } = await supabase
        .from('profiles')
        .select('id')
        .or(`first_name.ilike.%${username.split('_')[0]}%,last_name.ilike.%${username.split('_')[1] || username.split('_')[0]}%`)
        .single();
      
      if (userData?.id) {
        navigate(`/profile/${userData.id}`);
        return;
      }

      // Try to find organization
      const { data: orgData } = await supabase
        .from('organizations')
        .select('id')
        .ilike('name', `%${username.replace(/_/g, ' ')}%`)
        .single();
      
      if (orgData?.id) {
        navigate(`/organization/${orgData.id}`);
      }
    } catch (error) {
      logger.error('Failed to resolve tagged entity', error);
    }
  };

  const handleCommentClick = () => {
    setShowPostDetail(true);
    trackCommunityEngagement('view_post', `Viewed ${post.author}'s post`);
  };

  const handleReactionSelect = (emoji: string) => {
    toggleReaction(emoji);
    if (onReaction) {
      onReaction(post.id, emoji);
    }
    trackCommunityEngagement('post_like', `Reacted to ${post.author}'s post with ${emoji}`);
  };

  const handleShare = () => {
    const shareEventData = {
      originalPost: {
        id: post.id || '',
        author: post.author || 'Unknown Author',
        title: post.title || 'Untitled Post',
        description: post.description || '',
        category: post.category || 'announcement',
        avatar: post.avatar || '',
        location: post.location || '',
        tags: Array.isArray(post.tags) ? post.tags : [],
        timestamp: post.timestamp || 'Unknown time',
        urgency: post.urgency || 'medium'
      },
      type: 'share'
    };
    
    try {
      const shareEvent = new CustomEvent('sharePost', {
        detail: shareEventData
      });
      
      window.dispatchEvent(shareEvent);
      onShare();
      trackCommunityEngagement('post_share', `Shared ${post.author}'s post`);
    } catch (error) {
      // Error handling for share event
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'help-needed':
        return 'bg-red-100 text-red-800';
      case 'help-offered':
        return 'bg-green-100 text-green-800';
      case 'success-story':
        return 'bg-blue-100 text-blue-800';
      case 'community-update':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Quick reaction buttons (most common ones)
  const quickReactions = ['👍', '❤️', '😂', '🔥'];

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar 
              className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              onClick={handleProfileClick}
            >
              <AvatarImage src={post.avatar} />
              <AvatarFallback>
                {post.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 
                  className="font-semibold text-gray-900 cursor-pointer hover:underline"
                  onClick={handleProfileClick}
                >
                  {post.author}
                </h3>
                {(post as any).organization_id && (
                  <Badge variant="secondary" className="gap-1">
                    <Building className="h-3 w-3" />
                    <span className="text-xs">Organization</span>
                  </Badge>
                )}
                <Badge variant="outline" className={getCategoryColor(post.category)}>
                  {post.category.replace('-', ' ')}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.timestamp}</span>
                </div>
                
                {post.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{post.location}</span>
                  </div>
                )}
                
                <div className={`w-2 h-2 rounded-full ${getUrgencyColor(post.urgency)}`} title={`${post.urgency} priority`} />
              </div>
            </div>
          </div>

          <PostActions
            postId={post.id}
            authorId={post.authorId || post.id}
            onPostDeleted={onPostDeleted}
            onReportPost={() => {}}
            onBookmark={onBookmark}
            isBookmarked={post.isBookmarked}
          />
        </div>

        {/* Imported YouTube Video */}
        {post.import_source === 'youtube' && post.external_id ? (
          <div className="mb-4 space-y-2">
            <YouTubeEmbed 
              url={post.external_id} 
              title={post.import_metadata?.sourceTitle || post.title}
              thumbnailUrl={post.import_metadata?.thumbnailUrl}
            />
            {post.import_metadata?.sourceAuthor && (
              <p className="text-xs text-muted-foreground px-2">
                Original by {post.import_metadata.sourceAuthor}
              </p>
            )}
          </div>
        ) : null}

        {/* Imported Content Badge (non-YouTube) */}
        {post.import_source && post.import_source !== 'youtube' && post.external_id && (
          <div className="mb-4 px-4 py-2 bg-primary/5 border-l-4 border-primary flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Share2 className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Imported from <span className="font-medium capitalize">{post.import_source}</span>
                {post.import_metadata?.sourceAuthor && (
                  <span className="text-xs ml-1">by {post.import_metadata.sourceAuthor}</span>
                )}
              </span>
              <a 
                href={post.external_id} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-xs"
              >
                View original
              </a>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mb-4">
          {post.title && (
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              <TaggedText text={post.title} onUserClick={handleUserTagClick} />
            </h2>
          )}
          <TaggedText 
            text={post.description} 
            className="text-gray-700 whitespace-pre-wrap"
            onUserClick={handleUserTagClick}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {post.media.slice(0, 4).map((media, index) => (
                <div key={media.id} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                  {index === 3 && post.media.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        +{post.media.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reaction Display */}
        {reactions.length > 0 && (
          <div className="mb-4">
            <ReactionDisplay
              reactions={reactions}
              onReactionClick={toggleReaction}
            />
          </div>
        )}

        {/* Actions - Modern Reaction System */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t">
          <div className="flex items-center flex-wrap gap-2 min-w-0">
            {/* Quick Reaction Buttons with reduced spacing */}
            {quickReactions.map((emoji) => {
              const reaction = reactions.find(r => r.emoji === emoji);
              const hasReacted = reaction?.userReacted || false;
              const count = reaction?.count || 0;
              
              return (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReactionSelect(emoji)}
                  className={`flex items-center space-x-1 hover:scale-105 transition-all px-2 flex-shrink-0 ${
                    hasReacted ? 'bg-blue-100 border border-blue-300 text-blue-700' : 'text-gray-600 hover:text-blue-600'
                  }`}
                  title={`React with ${emoji}`}
                >
                  <span className="text-base">{emoji}</span>
                  {count > 0 && <span className="text-xs ml-1">{count}</span>}
                </Button>
              );
            })}
            
            {/* More Reactions Picker */}
            <ModernReactionPicker 
              onReactionSelect={handleReactionSelect}
              userReactedEmojis={reactions.filter(r => r.userReacted).map(r => r.emoji)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600 hover:scale-105 transition-all px-2 flex-shrink-0"
                title="More reactions"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="text-xs">React</span>
              </Button>
            </ModernReactionPicker>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCommentClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-2 flex-shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{comments.length}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 px-2 flex-shrink-0"
            >
              <Share2 className="h-4 w-4" />
              <span>{post.shares}</span>
            </Button>
          </div>
        </div>

        {/* Connect to Help Button or Mark Complete Button */}
        {post.category === 'help-needed' && user?.id === post.authorId && (
          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={() => setShowSelectHelper(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Complete ✓
            </Button>
          </div>
        )}

        {(post.category === 'help-needed' || post.category === 'campaign') && user?.id !== post.authorId && (
          <div className="mt-4 pt-4 border-t">
            <ConnectToHelpButton
              postId={post.id}
              postTitle={post.title}
              postAuthor={{
                name: post.author,
                avatar: post.avatar,
                id: post.authorId,
              }}
              category={post.category}
            />
          </div>
        )}

        {/* View Comments Button */}
        {comments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCommentClick}
              className="text-gray-600 hover:text-blue-600 w-full"
            >
              View {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </Button>
          </div>
        )}

        {/* Post Detail Modal */}
        <PostDetailModal
          post={post}
          isOpen={showPostDetail}
          onClose={() => setShowPostDetail(false)}
          onAddComment={(postId, content) => onComment(content)}
        />

        {/* Select Helper Dialog */}
        <SelectHelperDialog
          open={showSelectHelper}
          onOpenChange={setShowSelectHelper}
          postId={post.id}
          postTitle={post.title}
          onHelperSelected={handleHelperSelected}
        />
      </CardContent>
    </Card>
  );
});

SocialPostCard.displayName = 'SocialPostCard';

export default SocialPostCard;
