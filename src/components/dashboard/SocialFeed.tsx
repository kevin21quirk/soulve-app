
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
}

const SocialFeed = () => {
  const { toast } = useToast();
  const [posts] = useState<FeedPost[]>([
    {
      id: "1",
      author: "Sarah Chen",
      avatar: "",
      title: "Need help moving this weekend",
      description: "Looking for 2-3 people to help me move from downtown to the suburbs. Can provide lunch and gas money!",
      category: "help-needed",
      timestamp: "2 hours ago",
      location: "Downtown area",
      responses: 3
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
      responses: 7
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
      responses: 12
    }
  ]);

  const handleRespond = (postId: string) => {
    toast({
      title: "Response sent!",
      description: "Your offer to help has been sent to the requester.",
    });
  };

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

      <div className="space-y-4">
        {posts.map((post) => (
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
                </div>
                <div className="flex space-x-2">
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
    </div>
  );
};

export default SocialFeed;
