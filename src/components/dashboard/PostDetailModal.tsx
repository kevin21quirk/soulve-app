import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, X } from 'lucide-react';
import { FeedPost } from '@/types/feed';
import ReactionDisplay from '@/components/ui/reaction-display';
import { usePostReactions } from '@/hooks/usePostReactions';
import PostComments from './PostComments';
import { useNavigate } from 'react-router-dom';

interface PostDetailModalProps {
  post: FeedPost;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (postId: string, content: string) => void;
}

const PostDetailModal = ({ post, isOpen, onClose, onAddComment }: PostDetailModalProps) => {
  const navigate = useNavigate();
  const { reactions, toggleReaction } = usePostReactions(post.id);

  const handleProfileClick = () => {
    if (post.authorId) {
      onClose();
      navigate(`/profile/${post.authorId}`);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar 
                className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={handleProfileClick}
              >
                <AvatarImage src={post.avatar} />
                <AvatarFallback>
                  {post.author.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 
                  className="font-semibold text-gray-900 cursor-pointer hover:underline"
                  onClick={handleProfileClick}
                >
                  {post.author}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{post.timestamp}</span>
                  {post.location && (
                    <>
                      <span>•</span>
                      <MapPin className="h-3 w-3" />
                      <span>{post.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {/* Category and Urgency */}
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="outline" className={getCategoryColor(post.category)}>
                {post.category.replace('-', ' ')}
              </Badge>
              {post.urgency && post.urgency !== 'medium' && (
                <div className={`w-2 h-2 rounded-full ${getUrgencyColor(post.urgency)}`} title={`${post.urgency} priority`} />
              )}
            </div>

            {/* Content */}
            {post.title && (
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h2>
            )}
            <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.description}</p>

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
                  {post.media.map((media) => (
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reactions Summary */}
            {reactions.length > 0 && (
              <div className="mb-4 pb-4 border-b">
                <ReactionDisplay
                  reactions={reactions}
                  onReactionClick={toggleReaction}
                />
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t pt-4">
              <PostComments
                post={post}
                onAddComment={onAddComment}
                isExpanded={true}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailModal;
