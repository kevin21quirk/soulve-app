
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Clock } from 'lucide-react';
import { FeedPost } from '@/types/feed';

interface SocialPostCardProps {
  post: FeedPost;
  onLike: () => void;
  onShare: () => void;
  onBookmark: () => void;
  onComment: (content: string) => void;
}

const SocialPostCard = ({ post, onLike, onShare, onBookmark, onComment }: SocialPostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(newComment.trim());
      setNewComment('');
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

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.avatar} />
            <AvatarFallback>
              {post.author.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{post.author}</h3>
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

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={`flex items-center space-x-2 ${
                post.isLiked ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.responses}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="flex items-center space-x-2 text-gray-600"
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
                      <div className="flex items-center space-x-4 mt-1">
                        <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-auto p-1">
                          <Heart className="h-3 w-3 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-auto p-1">
                          Reply
                        </Button>
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
