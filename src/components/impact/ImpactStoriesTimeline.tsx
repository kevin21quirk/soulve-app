
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Heart, MapPin, Calendar, Users, Trophy, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimePoints } from '@/hooks/useRealTimePoints';
import { useToast } from '@/hooks/use-toast';

interface ImpactStory {
  id: string;
  title: string;
  description: string;
  impact: string;
  date: string;
  location?: string;
  category: string;
  points: number;
  rippleEffect?: {
    directImpact: number;
    secondaryImpact: number;
    communityReach: number;
  };
}

const ImpactStoriesTimeline = () => {
  const { user } = useAuth();
  const { recentTransactions } = useRealTimePoints();
  const { toast } = useToast();
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  // Convert transactions to impact stories
  const impactStories: ImpactStory[] = recentTransactions.map((transaction, index) => ({
    id: transaction.id,
    title: transaction.description,
    description: `You made a positive impact in your community`,
    impact: `This action helped strengthen community bonds and created positive change`,
    date: transaction.timestamp,
    location: transaction.metadata?.location || 'Local Community',
    category: transaction.category,
    points: transaction.points,
    rippleEffect: {
      directImpact: 1,
      secondaryImpact: Math.floor(Math.random() * 3) + 1,
      communityReach: Math.floor(Math.random() * 10) + 5
    }
  }));

  const handleShareStory = (story: ImpactStory) => {
    const shareText = `I just made an impact: ${story.title} - earning ${story.points} points! 🌟`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Impact Story',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Story copied to clipboard!",
        description: "Share your impact with others",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'help_completed': return Users;
      case 'donation': return Heart;
      case 'volunteer_work': return Zap;
      default: return Trophy;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'help_completed': return 'from-blue-400 to-blue-600';
      case 'donation': return 'from-green-400 to-green-600';
      case 'volunteer_work': return 'from-purple-400 to-purple-600';
      default: return 'from-orange-400 to-orange-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span>Your Impact Journey</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200"></div>
          
          <div className="space-y-6">
            {impactStories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Start making an impact to see your journey here!</p>
              </div>
            ) : (
              impactStories.map((story) => {
                const CategoryIcon = getCategoryIcon(story.category);
                const gradientColors = getCategoryColor(story.category);
                const isExpanded = selectedStory === story.id;
                
                return (
                  <div key={story.id} className="relative flex items-start space-x-6">
                    {/* Timeline dot */}
                    <div className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-br ${gradientColors} flex items-center justify-center shadow-lg`}>
                      <CategoryIcon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Story card */}
                    <Card className="flex-1 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {story.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(story.date).toLocaleDateString()}</span>
                              </div>
                              {story.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{story.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            +{story.points} pts
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-3">{story.description}</p>
                        
                        {/* Ripple Effect Visualization */}
                        {story.rippleEffect && (
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              🌊 Ripple Effect
                            </h4>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-bold text-blue-600">{story.rippleEffect.directImpact}</div>
                                <div className="text-gray-600">Direct</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-purple-600">{story.rippleEffect.secondaryImpact}</div>
                                <div className="text-gray-600">Secondary</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-pink-600">{story.rippleEffect.communityReach}</div>
                                <div className="text-gray-600">Community</div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="border-t pt-3 mt-3">
                            <p className="text-sm text-gray-600 mb-3">{story.impact}</p>
                            <div className="bg-yellow-50 p-3 rounded-lg">
                              <p className="text-sm text-yellow-800">
                                ✨ This action contributed to building a stronger, more connected community
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedStory(isExpanded ? null : story.id)}
                          >
                            {isExpanded ? 'Show Less' : 'Learn More'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShareStory(story)}
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactStoriesTimeline;
