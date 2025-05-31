
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, MapPin, Clock, Users } from "lucide-react";

interface TrendingTopic {
  id: string;
  topic: string;
  count: number;
  growth: number;
  category: string;
  location?: string;
}

interface TrendingTopicsProps {
  onTopicClick: (topic: string) => void;
}

const TrendingTopics = ({ onTopicClick }: TrendingTopicsProps) => {
  const trendingTopics: TrendingTopic[] = [
    { id: '1', topic: 'moving help', count: 234, growth: 45, category: 'help-needed', location: 'London' },
    { id: '2', topic: 'pet sitting', count: 189, growth: 32, category: 'help-needed' },
    { id: '3', topic: 'tutoring math', count: 167, growth: 28, category: 'help-offered' },
    { id: '4', topic: 'elderly care', count: 143, growth: 15, category: 'help-offered' },
    { id: '5', topic: 'community garden', count: 98, growth: 67, category: 'volunteer', location: 'Manchester' },
    { id: '6', topic: 'tech support', count: 87, growth: 23, category: 'help-offered' },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'help-needed': return 'bg-red-100 text-red-700';
      case 'help-offered': return 'bg-green-100 text-green-700';
      case 'volunteer': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicClick(topic.topic)}
            className="w-full text-left p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium group-hover:text-blue-600 transition-colors">
                {topic.topic}
              </span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  +{topic.growth}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={`text-xs ${getCategoryColor(topic.category)}`}>
                  {topic.category.replace('-', ' ')}
                </Badge>
                {topic.location && (
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {topic.location}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{topic.count}</span>
              </div>
            </div>
          </button>
        ))}
        
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Updated 5 minutes ago
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
