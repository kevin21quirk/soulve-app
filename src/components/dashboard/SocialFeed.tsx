
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, MapPin, Clock, Users, Calendar, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import UserModerationMenu from "@/components/moderation/UserModerationMenu";
import { useAuth } from "@/contexts/AuthContext";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface FeedPost {
  id: string;
  author: Author;
  createdAt: Date;
  content: string;
  likes: number;
  comments: number;
  category: 'help_needed' | 'announcement' | 'event';
  urgency?: 'high' | 'medium' | 'low';
  location?: string;
  eventDate?: Date;
  participants?: number;
}

const mockPosts: FeedPost[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    createdAt: new Date(Date.now() - 60000),
    content: 'Looking for volunteers to help clean up the park this weekend. Any help would be appreciated!',
    likes: 25,
    comments: 5,
    category: 'help_needed',
    urgency: 'high',
    location: 'Central Park'
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    createdAt: new Date(Date.now() - 3600000),
    content: 'Announcing our annual community event! Join us for a day of fun and games.',
    likes: 53,
    comments: 12,
    category: 'announcement',
    location: 'Community Center',
    eventDate: new Date(Date.now() + 86400000 * 7)
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Alice Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    createdAt: new Date(Date.now() - 7200000),
    content: 'Seeking donations for the local food bank. Every little bit helps!',
    likes: 18,
    comments: 3,
    category: 'help_needed',
    urgency: 'medium'
  },
  {
    id: '4',
    author: {
      id: 'user4',
      name: 'Bob Williams',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg'
    },
    createdAt: new Date(Date.now() - 10800000),
    content: 'Hosting a neighborhood cleanup event next Saturday. All are welcome!',
    likes: 32,
    comments: 8,
    category: 'event',
    location: 'Maple Street',
    eventDate: new Date(Date.now() + 86400000 * 6),
    participants: 15
  }
];

const SocialFeed = () => {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      return newLikedPosts;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'help_needed':
        return <Users className="h-4 w-4 mr-1" />;
      case 'announcement':
        return <Bell className="h-4 w-4 mr-1" />;
      case 'event':
        return <Calendar className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const renderPost = (post: FeedPost) => (
    <Card key={post.id} className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                {post.location && (
                  <>
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    <span>{post.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {user?.id !== post.author.id && (
            <UserModerationMenu
              userId={post.author.id}
              userName={post.author.name}
              postId={post.id}
            />
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center text-gray-600 mb-2">
            {getCategoryIcon(post.category)}
            <span>{post.category.replace('_', ' ')}</span>
            {post.urgency && (
              <>
                <span className="mx-2">•</span>
                <span className={`font-medium ${getUrgencyColor(post.urgency)}`}>
                  Urgency: {post.urgency}
                </span>
              </>
            )}
          </div>
          <p className="text-gray-800">{post.content}</p>
          {post.eventDate && (
            <div className="mt-2 text-sm text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{post.participants}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(post.id)}
              className={`flex items-center space-x-1 ${
                likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
              <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-500">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>

          {post.category === 'help_needed' && (
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              Offer Help
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Social Feed</h2>
        <Badge variant="secondary">5 New</Badge>
      </div>
      
      <div className="space-y-6">
        {mockPosts.map(renderPost)}
      </div>
    </div>
  );
};

export default SocialFeed;
