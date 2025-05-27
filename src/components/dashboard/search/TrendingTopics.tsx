
import { TrendingUp, Hash, Users, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrendingTopic {
  id: string;
  hashtag: string;
  posts: number;
  growth: number;
  category: string;
}

interface TrendingTopicsProps {
  onTopicClick: (topic: string) => void;
}

const trendingTopics: TrendingTopic[] = [
  { id: '1', hashtag: '#MovingHelp', posts: 2847, growth: 23, category: 'Help Needed' },
  { id: '2', hashtag: '#CommunityLove', posts: 1956, growth: 18, category: 'Success Story' },
  { id: '3', hashtag: '#TutoringSupport', posts: 1523, growth: 31, category: 'Help Offered' },
  { id: '4', hashtag: '#PetCareHelp', posts: 1342, growth: 15, category: 'Help Needed' },
  { id: '5', hashtag: '#LocalHeroes', posts: 1098, growth: 27, category: 'Success Story' },
  { id: '6', hashtag: '#TechHelp', posts: 987, growth: 12, category: 'Help Offered' },
];

const TrendingTopics = ({ onTopicClick }: TrendingTopicsProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Help Needed': return 'bg-red-100 text-red-800';
      case 'Help Offered': return 'bg-blue-100 text-blue-800';
      case 'Success Story': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => onTopicClick(topic.hashtag)}
              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group border border-transparent hover:border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{topic.hashtag.slice(1)}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {topic.posts.toLocaleString()} posts
                      </div>
                      <Badge variant="outline" className={getCategoryColor(topic.category)}>
                        {topic.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{topic.growth}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">24h growth</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
