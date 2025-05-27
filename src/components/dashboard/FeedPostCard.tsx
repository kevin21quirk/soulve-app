
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Image, Video } from "lucide-react";
import { FeedPost } from "@/types/feed";
import { getCategoryColor, getCategoryLabel } from "@/utils/postUtils";
import PostActions from "./PostActions";

interface FeedPostCardProps {
  post: FeedPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
}

const FeedPostCard = ({ post, onLike, onShare, onRespond }: FeedPostCardProps) => {
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
            className={`relative rounded-lg overflow-hidden bg-gray-100 ${
              mediaCount === 1 ? 'aspect-video' : 'aspect-square'
            }`}
          >
            {media.type === 'image' ? (
              <>
                <img
                  src={media.url}
                  alt={media.filename}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
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
              <CardDescription className="flex items-center space-x-2">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.timestamp}</span>
                <span>•</span>
                <span>{post.location}</span>
              </CardDescription>
            </div>
          </div>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-white border">
            {getCategoryLabel(post.category)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{post.description}</p>
        
        {/* Media Content */}
        {renderMediaGrid()}
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.responses} responses</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes} likes</span>
            </span>
            {post.media && post.media.length > 0 && (
              <span className="flex items-center space-x-1">
                <Image className="h-4 w-4" />
                <span>{post.media.length} media</span>
              </span>
            )}
          </div>
          <PostActions 
            post={post}
            onLike={onLike}
            onShare={onShare}
            onRespond={onRespond}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedPostCard;
