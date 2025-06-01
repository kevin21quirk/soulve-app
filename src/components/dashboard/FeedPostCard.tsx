
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { PostWithProfile } from "@/services/realPostsService";
import { usePostInteraction } from "@/services/realPostsService";
import { useOptimisticUpdates } from "@/hooks/useOptimisticUpdates";

interface FeedPostCardProps {
  post: PostWithProfile;
}

const FeedPostCard = ({ post }: FeedPostCardProps) => {
  const postInteraction = usePostInteraction();
  const { optimisticLike } = useOptimisticUpdates();

  const handleLike = async () => {
    const newLikedState = !post.interactions?.user_liked;
    
    // Optimistic update
    optimisticLike(post.id, newLikedState);
    
    // Send to server
    try {
      await postInteraction.mutateAsync({
        postId: post.id,
        interactionType: 'like'
      });
    } catch (error) {
      console.error('Failed to like post:', error);
      // Revert optimistic update on error
      optimisticLike(post.id, !newLikedState);
    }
  };

  const handleComment = () => {
    console.log('Comment on post:', post.id);
  };

  const handleShare = () => {
    console.log('Share post:', post.id);
  };

  const handleBookmark = () => {
    console.log('Bookmark post:', post.id);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.author_profile.avatar_url} />
            <AvatarFallback>
              {post.author_profile.first_name?.[0] || 'U'}
              {post.author_profile.last_name?.[0] || ''}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">
              {post.author_profile.first_name} {post.author_profile.last_name}
            </p>
            <p className="text-sm text-gray-500">{post.created_at}</p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline">{post.category}</Badge>
            <Badge variant="secondary">{post.urgency}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
        <p className="text-gray-700 mb-4">{post.content}</p>
        
        {post.location && (
          <p className="text-sm text-gray-500 mb-4">📍 {post.location}</p>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                post.interactions?.user_liked ? 'text-red-500' : ''
              }`}
            >
              <Heart className={`h-4 w-4 ${post.interactions?.user_liked ? 'fill-current' : ''}`} />
              <span>{post.interactions?.like_count || 0}</span>
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleComment} className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.interactions?.comment_count || 0}</span>
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center space-x-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleBookmark}>
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedPostCard;
