
import { Button } from "@/components/ui/button";
import { Heart, Share, MessageSquare, Send, Users } from "lucide-react";
import { FeedPost } from "@/types/feed";

interface PostActionsProps {
  post: FeedPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
}

const PostActions = ({ post, onLike, onShare, onRespond }: PostActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onLike(post.id)}
        className={`transition-all duration-200 ${post.isLiked ? "text-red-500 border-red-200 bg-red-50" : "hover:scale-105"}`}
      >
        <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-red-500" : ""}`} />
        {post.isLiked ? "Liked" : "Like"}
      </Button>
      <Button variant="outline" size="sm" onClick={() => onShare(post.id)} className="hover:scale-105 transition-transform">
        <Share className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
        <MessageSquare className="h-4 w-4 mr-2" />
        Comment
      </Button>
      {post.category === "help-needed" && (
        <Button size="sm" onClick={() => onRespond(post.id)} className="hover:scale-105 transition-transform">
          <Send className="h-4 w-4 mr-2" />
          Offer Help
        </Button>
      )}
      {post.category === "help-offered" && (
        <Button size="sm" onClick={() => onRespond(post.id)} className="hover:scale-105 transition-transform">
          <Users className="h-4 w-4 mr-2" />
          Request Help
        </Button>
      )}
    </div>
  );
};

export default PostActions;
