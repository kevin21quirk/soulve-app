
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, MapPin, TrendingUp, Users, Sparkles } from "lucide-react";
import CreatePost from "../CreatePost";
import SmartRecommendations from "../SmartRecommendations";
import FeedContent from "./FeedContent";
import { FeedPost } from "@/types/feed";

interface FeedTabContentProps {
  activeTab: string;
  posts: FeedPost[];
  isLoading: boolean;
  onPostCreated: (post: any) => void;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onRespond: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReaction: (postId: string, reactionType: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onCommentReaction?: (postId: string, commentId: string, reactionType: string) => void;
}

const FeedTabContent = ({
  activeTab,
  posts,
  isLoading,
  onPostCreated,
  onLike,
  onShare,
  onRespond,
  onBookmark,
  onReaction,
  onAddComment,
  onLikeComment,
  onCommentReaction
}: FeedTabContentProps) => {
  console.log("FeedTabContent Debug:", {
    activeTab,
    postsCount: posts.length,
    isLoading,
    posts: posts.map(p => ({ id: p.id, title: p.title }))
  });

  const getTabConfig = (tabValue: string) => {
    switch (tabValue) {
      case "for-you":
        return {
          title: "For You",
          icon: Sparkles,
          colour: "purple",
          description: "Your personalised feed is being prepared! Try connecting with more people or following topics you're interested in.",
          showCreate: true,
          showRecommendations: true,
          emptyMessage: "Your personalised feed is being prepared! Try connecting with more people or following topics you're interested in."
        };
      case "urgent":
        return {
          title: "Urgent Help Needed",
          icon: Zap,
          colour: "red",
          description: "These requests need immediate attention. Your quick response could make a real difference!",
          emptyMessage: "No urgent requests at the moment. Check back soon or explore other tabs!"
        };
      case "nearby":
        return {
          title: "Help Nearby",
          icon: MapPin,
          colour: "blue",
          description: "Find opportunities to help people in your local area. Building stronger communities starts close to home!",
          emptyMessage: "No local requests found. Try expanding your search radius or check other areas!"
        };
      case "trending":
        return {
          title: "Trending Now",
          icon: TrendingUp,
          colour: "green",
          description: "See what's getting the most attention in your community right now!",
          emptyMessage: "Nothing trending right now. Be the first to start something amazing!"
        };
      case "following":
        return {
          title: "People You Follow",
          icon: Users,
          colour: "purple",
          description: "Stay updated with posts from people you've connected with and topics you follow.",
          emptyMessage: "Follow more people to see their posts here. Build your network in the Connections tab!"
        };
      default:
        return {
          title: "For You",
          icon: Sparkles,
          colour: "purple",
          description: "Your personalised feed is being prepared!",
          emptyMessage: "No posts available."
        };
    }
  };

  const config = getTabConfig(activeTab);

  return (
    <div className="space-y-6">
      {config.showCreate && <CreatePost onPostCreated={onPostCreated} />}
      {config.showRecommendations && <SmartRecommendations />}
      
      <Card className={`border-${config.colour}-200 bg-${config.colour}-50`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-centre space-x-2 text-${config.colour}-800`}>
            <config.icon className="h-5 w-5" />
            <span>{config.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className={`text-sm text-${config.colour}-700`}>
          {config.description}
        </CardContent>
      </Card>

      <FeedContent
        posts={posts}
        isLoading={isLoading}
        onLike={onLike}
        onShare={onShare}
        onRespond={onRespond}
        onBookmark={onBookmark}
        onReaction={onReaction}
        onAddComment={onAddComment}
        onLikeComment={onLikeComment}
        onCommentReaction={onCommentReaction}
        emptyMessage={config.emptyMessage}
      />
    </div>
  );
};

export default FeedTabContent;
