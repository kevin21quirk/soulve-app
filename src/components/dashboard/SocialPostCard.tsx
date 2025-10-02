
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageCircle, Share2, Bookmark, MapPin, Clock, Plus } from 'lucide-react';
import { FeedPost } from '@/types/feed';
import { usePostReactions } from '@/hooks/usePostReactions';
import ModernReactionPicker from '@/components/ui/modern-reaction-picker';
import ReactionDisplay from '@/components/ui/reaction-display';
import PostActions from './PostActions';
import { ConnectToHelpButton } from '@/components/connect';

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
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { reactions, toggleReaction } = usePostReactions(post.id);

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
    }
  };

  const handleReactionSelect = (emoji: string) => {
    toggleReaction(emoji);
    if (onReaction) {
      onReaction(post.id, emoji);
    }
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
            <ModernReactionPicker onReactionSelect={handleReactionSelect}>
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

        {/* Connect to Help Button */}
        {(post.category === 'help-needed' || post.category === 'campaign') && (
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
        {showComments && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Add Comment */}
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <Button size="sm" onClick={handleComment}>
                  Post
                </Button>
              </div>
            </div>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback>
                        {comment.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialPostCard;
