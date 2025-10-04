
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageCircle, Share2, Bookmark, MapPin, Clock, Plus, CheckCircle } from 'lucide-react';
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
import PostComments from './PostComments';

interface SocialPostCardProps {
  post: FeedPost;
  onLike: () => void;
  onShare: () => void;
  onBookmark: () => void;
  onComment: (content: string) => void;
  onReaction?: (postId: string, reactionType: string) => void;
  onPostDeleted?: () => void;
}

const SocialPostCard = ({ post, onLike, onShare, onBookmark, onComment, onReaction, onPostDeleted }: SocialPostCardProps) => {
  console.log('🎨 [SocialPostCard] Rendered with post:', {
    id: post.id,
    author: post.author,
    authorId: post.authorId,
    hasAuthorId: !!post.authorId
  });
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
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
      console.error('Error confirming help:', error);
      toast({
        title: "Error",
        description: "Failed to confirm help completion.",
        variant: "destructive"
      });
    }
  };

  const handleProfileClick = () => {
    console.log('👆 [SocialPostCard] Profile click:', {
      postId: post.id,
      authorId: post.authorId,
      willNavigate: !!post.authorId,
      navigateTo: post.authorId ? `/profile/${post.authorId}` : 'NOWHERE - authorId missing!'
    });
    
    if (post.authorId) {
      navigate(`/profile/${post.authorId}`);
    } else {
      console.error('❌ [SocialPostCard] Cannot navigate - authorId is missing!');
    }
  };

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(newComment.trim());
      setNewComment('');
      trackCommunityEngagement('post_comment', `Commented on ${post.author}'s post`);
    }
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
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          {post.title && (
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
          )}
          <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
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
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
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
                  className={`flex items-center space-x-1 hover:scale-105 transition-all px-2 ${
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
                className="text-gray-600 hover:text-blue-600 hover:scale-105 transition-all px-2"
                title="More reactions"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="text-xs">React</span>
              </Button>
            </ModernReactionPicker>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.responses}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 px-2"
            >
              <Share2 className="h-4 w-4" />
              <span>{post.shares}</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmark}
            className={`${
              post.isBookmarked ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </Button>
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

        {/* Comments Section */}
        <PostComments
          post={post}
          onAddComment={(postId, content) => onComment(content)}
          isExpanded={showComments}
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
};

export default SocialPostCard;
