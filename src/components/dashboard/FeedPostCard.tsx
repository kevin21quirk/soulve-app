
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.responses} responses</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes} likes</span>
            </span>
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
