import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, MapPin, Clock, RefreshCw } from "lucide-react";
import RecommendationCard from "./RecommendationCard";
import FeedPostCard from "../dashboard/FeedPostCard";
import { usePosts } from "@/services/realPostsService";

interface DiscoverFeedProps {
  searchQuery: string;
  activeFilters: string[];
  selectedCategory?: string;
}

const DiscoverFeed = ({ searchQuery, activeFilters, selectedCategory }: DiscoverFeedProps) => {
  const [activeTab, setActiveTab] = useState("recommended");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { data: posts = [], isLoading: postsLoading, refetch } = usePosts();

  // Mock recommendations - in real app this would come from API
  useEffect(() => {
    const mockRecommendations = [
      {
        id: '1',
        type: 'help_opportunity',
        title: 'Help elderly neighbor with grocery shopping',
        description: 'Looking for someone to help with weekly grocery runs for my 85-year-old neighbor who has mobility issues.',
        author: {
          name: 'Sarah Chen',
          avatar: 'https://avatar.vercel.sh/sarah.png',
          trustScore: 94
        },
        location: 'Downtown District',
        urgency: 'medium',
        timeCommitment: '2 hours/week',
        skills: ['Transportation', 'Patience', 'Care'],
        category: 'help_needed',
        metadata: {
          likes: 12,
          responses: 3,
          deadline: 'This week',
          compensation: 'Volunteer'
        },
        confidenceScore: 87,
        reasoning: 'Matches your location and previous volunteering with elderly care'
      },
      {
        id: '2',
        type: 'connection',
        title: 'Connect with Maria Rodriguez',
        description: 'Social worker specializing in community outreach with 8 years experience. Active in local food bank initiatives.',
        author: {
          name: 'Maria Rodriguez',
          avatar: 'https://avatar.vercel.sh/maria.png',
          trustScore: 96
        },
        location: 'Central District',
        skills: ['Social Work', 'Community Outreach', 'Food Security'],
        category: 'professional',
        metadata: {
          likes: 24,
          responses: 15
        },
        confidenceScore: 92,
        reasoning: 'Shares your interest in community service and social impact'
      },
      {
        id: '3',
        type: 'volunteer',
        title: 'Weekend Food Distribution Volunteer',
        description: 'Join our team distributing meals to families in need every Saturday morning. Great team environment!',
        author: {
          name: 'Community Food Bank',
          avatar: 'https://avatar.vercel.sh/foodbank.png',
          trustScore: 98
        },
        location: 'Eastside Community Center',
        urgency: 'high',
        timeCommitment: '4 hours/weekend',
        skills: ['Organization', 'Teamwork', 'Physical Activity'],
        category: 'volunteer',
        metadata: {
          likes: 45,
          responses: 23,
          deadline: 'Ongoing'
        },
        confidenceScore: 79,
        reasoning: 'Matches your availability and passion for fighting food insecurity'
      }
    ];
    setRecommendations(mockRecommendations);
  }, [searchQuery, activeFilters, selectedCategory]);

  const handleInteract = (id: string, action: string) => {
    console.log(`${action} on recommendation ${id}`);
    // Handle interaction logic here
  };

  const handlePostInteraction = (postId: string, action: string) => {
    console.log(`${action} on post ${postId}`);
    // Handle post interaction logic here
  };

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!post.title.toLowerCase().includes(query) && 
          !post.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    if (selectedCategory && post.category !== selectedCategory) {
      return false;
    }

    if (activeFilters.includes('urgent') && post.urgency !== 'urgent') {
      return false;
    }

    if (activeFilters.includes('nearby') && !post.location) {
      return false;
    }

    return true;
  });

  const filteredRecommendations = recommendations.filter(rec => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!rec.title.toLowerCase().includes(query) && 
          !rec.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    if (selectedCategory && rec.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="recommended" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>For You</span>
              <Badge variant="secondary">{filteredRecommendations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
              <Badge variant="secondary">{filteredPosts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="nearby" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Nearby</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Recent</span>
            </TabsTrigger>
          </TabsList>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <TabsContent value="recommended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span>Recommended for You</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRecommendations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recommendations match your current filters.</p>
                  <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecommendations.map((recommendation) => (
                    <RecommendationCard
                      key={recommendation.id}
                      recommendation={recommendation}
                      onInteract={handleInteract}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Trending Now</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading trending posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No trending posts match your filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.slice(0, 10).map((post) => (
                    <FeedPostCard
                      key={post.id}
                      post={post}
                      onLike={() => handlePostInteraction(post.id, 'like')}
                      onShare={() => handlePostInteraction(post.id, 'share')}
                      onRespond={() => handlePostInteraction(post.id, 'respond')}
                      onBookmark={() => handlePostInteraction(post.id, 'bookmark')}
                      onReaction={() => handlePostInteraction(post.id, 'reaction')}
                      onAddComment={() => handlePostInteraction(post.id, 'comment')}
                      onLikeComment={() => {}}
                      onCommentReaction={() => {}}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nearby" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Near You</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">Location-based recommendations coming soon!</p>
                <p className="text-sm text-gray-400 mt-2">We're working on showing you opportunities in your area.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <FeedPostCard
                    key={post.id}
                    post={post}
                    onLike={() => handlePostInteraction(post.id, 'like')}
                    onShare={() => handlePostInteraction(post.id, 'share')}
                    onRespond={() => handlePostInteraction(post.id, 'respond')}
                    onBookmark={() => handlePostInteraction(post.id, 'bookmark')}
                    onReaction={() => handlePostInteraction(post.id, 'reaction')}
                    onAddComment={() => handlePostInteraction(post.id, 'comment')}
                    onLikeComment={() => {}}
                    onCommentReaction={() => {}}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscoverFeed;
