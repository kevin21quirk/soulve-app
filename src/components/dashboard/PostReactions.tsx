
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark, Send, Users } from "lucide-react";
import { FeedPost } from "@/types/feed";

interface PostReactionsProps {
  post: FeedPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: () => void;
  onBookmark: (postId: string) => void;
  onReaction: (postId: string, reactionType: string) => void;
}

const PostReactions = ({ 
  post, 
  onLike, 
  onShare, 
  onRespond, 
  onBookmark,
  onReaction
}: PostReactionsProps) => {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onLike(post.id)}
          className={`hover:scale-105 transition-transform ${
            post.isLiked ? "text-red-600 hover:text-red-700" : "text-gray-600 hover:text-red-600"
          }`}
        >
          <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-current" : ""}`} />
          <span>{post.likes}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onRespond}
          className="hover:scale-105 transition-transform text-gray-600 hover:text-blue-600"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          <span>{post.responses}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onShare(post.id)} 
          className={`hover:scale-105 transition-transform ${
            post.isShared ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <Share2 className="h-4 w-4 mr-2" />
          <span>{post.shares}</span>
        </Button>
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onBookmark(post.id)}
          className={`hover:scale-105 transition-transform ${
            post.isBookmarked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
        </Button>

        {/* Category-specific actions */}
        {post.category === "help-needed" && (
          <Button 
            size="sm" 
            onClick={onRespond} 
            className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white hover:from-[#0ce4af] hover:to-[#18a5fe] hover:scale-105 transition-all"
          >
            <Send className="h-4 w-4 mr-2" />
            Offer Help
          </Button>
        )}
        {post.category === "help-offered" && (
          <Button 
            size="sm" 
            onClick={onRespond} 
            className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white hover:from-[#0ce4af] hover:to-[#18a5fe] hover:scale-105 transition-all"
          >
            <Users className="h-4 w-4 mr-2" />
            Request Help
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostReactions;
