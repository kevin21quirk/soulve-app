import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, Send, Heart, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FeedFilters from "./FeedFilters";
import CreatePost from "./CreatePost";

interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  description: string;
  category: "help-needed" | "help-offered" | "success-story";
  timestamp: string;
  location: string;
  responses: number;
  likes: number;
  isLiked: boolean;
}

const SocialFeed = () => {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState("all");
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: "1",
      author: "Sarah Chen",
      avatar: "",
      title: "Need help moving this weekend",
      description: "Looking for 2-3 people to help me move from downtown to the suburbs. Can provide lunch and gas money!",
      category: "help-needed",
      timestamp: "2 hours ago",
      location: "Downtown area",
      responses: 3,
      likes: 12,
      isLiked: false
    },
    {
      id: "2",
      author: "Mike Johnson",
      avatar: "",
      title: "Offering tutoring for high school math",
      description: "Certified math teacher available for free tutoring sessions on weekends. Specializing in algebra and geometry.",
      category: "help-offered",
      timestamp: "4 hours ago",
      location: "Community Center",
      responses: 7,
      likes: 24,
      isLiked: true
    },
    {
      id: "3",
      author: "Community Gardens",
      avatar: "",
      title: "Success: Garden project completed!",
      description: "Thanks to 15 amazing volunteers, we planted 200 vegetables and created a beautiful community space!",
      category: "success-story",
      timestamp: "1 day ago",
      location: "Riverside Park",
      responses: 12,
      likes: 45,
      isLiked: false
    },
    {
      id: "4",
      author: "Alex Rodriguez",
      avatar: "",
      title: "Looking for someone to walk my dog",
      description: "My elderly dog needs daily walks while I recover from surgery. Willing to pay $20 per walk.",
      category: "help-needed",
      timestamp: "6 hours ago",
      location: "Maple Street",
      responses: 5,
      likes: 8,
      isLiked: false
    },
    {
      id: "5",
      author: "Lisa Park",
      avatar: "",
      title: "Free coding workshops for beginners",
      description: "Teaching basic HTML, CSS, and JavaScript every Saturday at the library. All skill levels welcome!",
      category: "help-offered",
      timestamp: "8 hours ago",
      location: "Public Library",
      responses: 15,
      likes: 32,
      isLiked: true
    }
  ]);

  const handlePostCreated = (newPost: FeedPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleShare = (postId: string) => {
    toast({
      title: "Post shared!",
      description: "This post has been shared with your network.",
    });
  };

  const handleRespond = (postId: string) => {
    toast({
      title: "Response sent!",
      description: "Your offer to help has been sent to the requester.",
    });
  };

  const filteredPosts = activeFilter === "all" 
    ? posts 
    : posts.filter(post => post.category === activeFilter);

  const getPostCounts = () => ({
    all: posts.length,
    "help-needed": posts.filter(p => p.category === "help-needed").length,
    "help-offered": posts.filter(p => p.category === "help-offered").length,
    "success-story": posts.filter(p => p.category === "success-story").length,
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "help-needed": return "border-l-red-500 bg-red-50";
      case "help-offered": return "border-l-green-500 bg-green-50";
      case "success-story": return "border-l-blue-500 bg-blue-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "help-needed": return "Help Needed";
      case "help-offered": return "Help Offered";
      case "success-story": return "Success Story";
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h2>
        <p className="text-gray-600">See what your community needs and how you can help</p>
      </div>

      <CreatePost onPostCreated={handlePostCreated} />

      <FeedFilters 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        postCounts={getPostCounts()}
      />

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className={`border-l-4 ${getCategoryColor(post.category)} hover:shadow-lg transition-shadow`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
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
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={post.isLiked ? "text-red-500 border-red-200" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-red-500" : ""}`} />
                    {post.isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleShare(post.id)}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                  {post.category === "help-needed" && (
                    <Button size="sm" onClick={() => handleRespond(post.id)}>
                      <Send className="h-4 w-4 mr-2" />
                      Offer Help
                    </Button>
                  )}
                  {post.category === "help-offered" && (
                    <Button size="sm" onClick={() => handleRespond(post.id)}>
                      <Users className="h-4 w-4 mr-2" />
                      Request Help
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found for this category.</p>
          <p className="text-gray-400">Try selecting a different filter above.</p>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
