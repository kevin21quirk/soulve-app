import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, X, ArrowLeft } from 'lucide-react';
import { FeedPost } from '@/types/feed';
import ReactionDisplay from '@/components/ui/reaction-display';
import { usePostReactions } from '@/hooks/usePostReactions';
import MobilePostComments from './MobilePostComments';
import { useNavigate } from 'react-router-dom';

interface MobilePostDetailModalProps {
  post: FeedPost;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (postId: string, content: string) => void;
}

const MobilePostDetailModal = ({ post, isOpen, onClose, onAddComment }: MobilePostDetailModalProps) => {
  const navigate = useNavigate();
  const { reactions, toggleReaction } = usePostReactions(post.id);

  const handleProfileClick = () => {
    if (post.authorId) {
      onClose();
      navigate(`/profile/${post.authorId}`);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "help-needed": "bg-red-100 text-red-700 border-red-200",
      "help-offered": "bg-green-100 text-green-700 border-green-200",
      "success-story": "bg-blue-100 text-blue-700 border-blue-200",
      "announcement": "bg-purple-100 text-purple-700 border-purple-200",
      "question": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "recommendation": "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-full max-h-screen w-full max-w-full m-0 p-0 rounded-none overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <div className="px-4 py-3 border-b bg-white flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar 
            className="h-8 w-8 cursor-pointer"
            onClick={handleProfileClick}
          >
            <AvatarImage src={post.avatar} />
            <AvatarFallback>
              {post.author.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 
              className="font-semibold text-sm truncate cursor-pointer"
              onClick={handleProfileClick}
            >
              {post.author}
            </h3>
            <div className="flex items-center text-xs text-gray-500 space-x-1">
              <Clock className="h-3 w-3" />
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="bg-white p-4 mb-2">
            {/* Category Badge */}
            <div className="mb-3">
              <Badge className={`${getCategoryColor(post.category)} text-xs px-2 py-1 border`}>
                {post.category.replace('-', ' ')}
              </Badge>
              {post.location && (
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{post.location}</span>
                </div>
              )}
            </div>

            {/* Content */}
            {post.title && (
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
            )}
            <p className="text-gray-700 text-sm whitespace-pre-wrap mb-3">{post.description}</p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div className="mb-3">
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
              <div className="pt-3 border-t">
                <ReactionDisplay
                  reactions={reactions}
                  onReactionClick={toggleReaction}
                />
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-white p-4 h-[50vh] flex flex-col">
            <MobilePostComments
              post={post}
              onAddComment={onAddComment}
              isExpanded={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobilePostDetailModal;
