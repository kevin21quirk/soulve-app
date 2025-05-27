
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Image, Video, MapPin, Clock, Globe, Users, Lock } from "lucide-react";
import { FeedPost } from "@/types/feed";
import { getCategoryColor, getCategoryLabel } from "@/utils/postUtils";
import PostActions from "./PostActions";
import { FEELINGS, URGENCY_LEVELS } from "./CreatePostTypes";

interface FeedPostCardProps {
  post: FeedPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReaction: (postId: string, reactionType: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onCommentReaction?: (postId: string, commentId: string, reactionType: string) => void;
}

const FeedPostCard = ({ 
  post, 
  onLike, 
  onShare, 
  onRespond, 
  onBookmark,
  onReaction,
  onAddComment,
  onLikeComment
}: FeedPostCardProps) => {
  const renderMediaGrid = () => {
    if (!post.media || post.media.length === 0) return null;

    const mediaCount = post.media.length;
    
    return (
      <div className={`mt-4 grid gap-2 ${
        mediaCount === 1 ? 'grid-cols-1' : 
        mediaCount === 2 ? 'grid-cols-2' :
        mediaCount === 3 ? 'grid-cols-3' :
        'grid-cols-2'
      }`}>
        {post.media.slice(0, 4).map((media, index) => (
          <div 
            key={media.id} 
            className={`relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer ${
              mediaCount === 1 ? 'aspect-video' : 'aspect-square'
            }`}
          >
            {media.type === 'image' ? (
              <>
                <img
                  src={media.url}
                  alt={media.filename}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <Image className="h-4 w-4 text-white drop-shadow-lg" />
                </div>
              </>
            ) : (
              <>
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  controls={false}
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer hover:bg-opacity-20 transition-all">
                  <Video className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute top-2 right-2">
                  <Video className="h-4 w-4 text-white drop-shadow-lg" />
                </div>
              </>
            )}
            
            {/* Show count overlay for 4+ media items */}
            {index === 3 && mediaCount > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  +{mediaCount - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getVisibilityIcon = () => {
    switch (post.visibility) {
      case 'public': return <Globe className="h-3 w-3" />;
      case 'friends': return <Users className="h-3 w-3" />;
      case 'private': return <Lock className="h-3 w-3" />;
      default: return <Globe className="h-3 w-3" />;
    }
  };

  const urgencyConfig = post.urgency ? 
    URGENCY_LEVELS.find(level => level.value === post.urgency) : null;

  const feelingConfig = post.feeling ? 
    FEELINGS.find(feeling => feeling.value === post.feeling) : null;

  return (
    <Card className={`border-l-4 ${getCategoryColor(post.category)} hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="hover:scale-110 transition-transform">
              <AvatarImage src={post.avatar} />
              <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg hover:text-blue-600 transition-colors cursor-pointer">{post.title}</CardTitle>
              <CardDescription className="flex items-center space-x-2 flex-wrap">
                <span>{post.author}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.timestamp}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{post.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  {getVisibilityIcon()}
                </span>
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(post.category)}
            </Badge>
            {urgencyConfig && post.urgency !== 'low' && (
              <Badge className={urgencyConfig.color + " text-xs"}>
                {urgencyConfig.icon} {urgencyConfig.label}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{post.description}</p>
        
        {/* Post Metadata */}
        {(feelingConfig || (post.tags && post.tags.length > 0)) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {feelingConfig && (
              <Badge variant="secondary" className="text-xs">
                {feelingConfig.emoji} Feeling {feelingConfig.label}
              </Badge>
            )}
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Media Content */}
        {renderMediaGrid()}
        
        <div className="mt-4">
          <PostActions 
            post={post}
            onLike={onLike}
            onShare={onShare}
            onRespond={onRespond}
            onBookmark={onBookmark}
            onReaction={onReaction}
            onAddComment={onAddComment}
            onLikeComment={onLikeComment}
            onCommentReaction={(postId, commentId, reactionType) => {
              // This will be handled by the parent component
              console.log('Comment reaction:', { postId, commentId, reactionType });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedPostCard;
