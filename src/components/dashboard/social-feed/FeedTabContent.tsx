
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
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
  const tabConfigs = [
    {
      value: "for-you",
      title: "For You",
      icon: Sparkles,
      color: "purple",
      description: "Your personalized feed is being prepared! Try connecting with more people or following topics you're interested in.",
      showCreate: true,
      showRecommendations: true
    },
    {
      value: "urgent",
      title: "Urgent Help Needed",
      icon: Zap,
      color: "red",
      description: "These requests need immediate attention. Your quick response could make a real difference!",
      emptyMessage: "No urgent requests at the moment. Check back soon or explore other tabs!"
    },
    {
      value: "nearby",
      title: "Help Nearby",
      icon: MapPin,
      color: "blue",
      description: "Find opportunities to help people in your local area. Building stronger communities starts close to home!",
      emptyMessage: "No local requests found. Try expanding your search radius or check other areas!"
    },
    {
      value: "trending",
      title: "Trending Now",
      icon: TrendingUp,
      color: "green",
      description: "See what's getting the most attention in your community right now!",
      emptyMessage: "Nothing trending right now. Be the first to start something amazing!"
    },
    {
      value: "following",
      title: "People You Follow",
      icon: Users,
      color: "purple",
      description: "Stay updated with posts from people you've connected with and topics you follow.",
      emptyMessage: "Follow more people to see their posts here. Build your network in the Connections tab!"
    }
  ];

  return (
    <>
      {tabConfigs.map((config) => (
        <TabsContent key={config.value} value={config.value} className="space-y-6">
          {config.showCreate && <CreatePost onPostCreated={onPostCreated} />}
          {config.showRecommendations && <SmartRecommendations />}
          
          <Card className={`border-${config.color}-200 bg-${config.color}-50`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center space-x-2 text-${config.color}-800`}>
                <config.icon className="h-5 w-5" />
                <span>{config.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className={`text-sm text-${config.color}-700`}>
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
            emptyMessage={config.emptyMessage || config.description}
          />
        </TabsContent>
      ))}
    </>
  );
};

export default FeedTabContent;
