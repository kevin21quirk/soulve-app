
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, Users, Zap, Share2, ArrowRight } from 'lucide-react';
import { useRealTimePoints } from '@/hooks/useRealTimePoints';

interface NetworkNode {
  id: string;
  label: string;
  type: 'user' | 'impact' | 'community';
  size: number;
  connections: string[];
  value: number;
}

interface RippleLevel {
  level: number;
  description: string;
  count: number;
  reach: number;
}

const NetworkEffectVisualization = () => {
  const { recentTransactions, totalPoints } = useRealTimePoints();
  const [selectedRipple, setSelectedRipple] = useState<number | null>(null);

  // Calculate network ripple effects
  const rippleLevels: RippleLevel[] = [
    {
      level: 1,
      description: "Direct Impact",
      count: recentTransactions.length,
      reach: recentTransactions.length
    },
    {
      level: 2,
      description: "Inspired Others",
      count: Math.floor(recentTransactions.length * 1.5),
      reach: Math.floor(recentTransactions.length * 2.3)
    },
    {
      level: 3,
      description: "Community Influence",
      count: Math.floor(recentTransactions.length * 0.8),
      reach: Math.floor(recentTransactions.length * 3.7)
    },
    {
      level: 4,
      description: "Widespread Change",
      count: Math.floor(recentTransactions.length * 0.4),
      reach: Math.floor(recentTransactions.length * 6.2)
    }
  ];

  const totalNetworkReach = rippleLevels.reduce((sum, level) => sum + level.reach, 0);
  const networkMultiplier = totalNetworkReach > 0 ? (totalNetworkReach / recentTransactions.length).toFixed(1) : "1.0";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Network className="h-6 w-6 text-purple-500" />
          <span>Network Effect</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Network Overview */}
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {networkMultiplier}x
            </div>
            <div className="text-lg font-medium text-gray-800 mb-2">
              Network Multiplier Effect
            </div>
            <div className="text-sm text-gray-600">
              Your actions inspire <strong>{totalNetworkReach}</strong> positive interactions
            </div>
          </div>

          {/* Ripple Effect Visualization */}
          <div className="relative">
            <h3 className="text-lg font-semibold mb-4 text-center">
              How Your Impact Creates Ripples
            </h3>
            
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Network className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Start making an impact to see your network effect!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rippleLevels.map((ripple, index) => {
                  const isSelected = selectedRipple === ripple.level;
                  const intensity = (ripple.reach / totalNetworkReach) * 100;
                  
                  return (
                    <div
                      key={ripple.level}
                      className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                      onClick={() => setSelectedRipple(isSelected ? null : ripple.level)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Ripple Circle */}
                          <div 
                            className="rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold shadow-lg"
                            style={{
                              width: `${40 + (ripple.level * 8)}px`,
                              height: `${40 + (ripple.level * 8)}px`,
                              opacity: 0.8 + (ripple.level * 0.05)
                            }}
                          >
                            {ripple.level}
                          </div>
                          
                          <div>
                            <div className="font-semibold text-gray-800">
                              Level {ripple.level}: {ripple.description}
                            </div>
                            <div className="text-sm text-gray-600">
                              {ripple.count} actions → {ripple.reach} people reached
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge 
                            variant="secondary" 
                            className="mb-1"
                            style={{
                              backgroundColor: `hsl(${260 + (ripple.level * 10)}, 70%, 90%)`,
                              color: `hsl(${260 + (ripple.level * 10)}, 70%, 30%)`
                            }}
                          >
                            {intensity.toFixed(1)}% reach
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {ripple.reach} people
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded Details */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-purple-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium text-purple-800">How it works:</h4>
                              <p className="text-sm text-purple-700">
                                {getNetworkDescription(ripple.level)}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium text-purple-800">Examples:</h4>
                              <ul className="text-sm text-purple-700 space-y-1">
                                {getNetworkExamples(ripple.level).map((example, idx) => (
                                  <li key={idx} className="flex items-start space-x-2">
                                    <ArrowRight className="h-3 w-3 mt-0.5 text-purple-500" />
                                    <span>{example}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-xl font-bold text-blue-600">{totalNetworkReach}</div>
              <div className="text-sm text-gray-600">Total Reach</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-xl font-bold text-green-600">{recentTransactions.length}</div>
              <div className="text-sm text-gray-600">Your Actions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Share2 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-xl font-bold text-purple-600">
                {Math.max(1, Math.floor(totalNetworkReach / Math.max(1, recentTransactions.length)))}
              </div>
              <div className="text-sm text-gray-600">Avg Multiplier</div>
            </div>
          </div>

          {/* Encouragement Message */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Keep Growing Your Impact!</span>
            </div>
            <p className="text-sm text-yellow-700">
              Every action you take creates a ripple effect that reaches far beyond what you can see. 
              Your {recentTransactions.length} actions have potentially influenced {totalNetworkReach} positive interactions in your community!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const getNetworkDescription = (level: number): string => {
  switch (level) {
    case 1:
      return "Your direct actions help specific individuals and create immediate positive impact.";
    case 2:
      return "People you've helped are inspired to help others, spreading kindness organically.";
    case 3:
      return "Your example influences community culture, making helping behavior more normal.";
    case 4:
      return "Systemic change emerges as helping becomes embedded in community values.";
    default:
      return "Every action creates positive change that extends beyond what we can measure.";
  }
};

const getNetworkExamples = (level: number): string[] => {
  switch (level) {
    case 1:
      return [
        "You help someone carry groceries",
        "You donate to a local cause",
        "You volunteer at an event"
      ];
    case 2:
      return [
        "Person you helped pays it forward",
        "They share your kindness story",
        "Friends see your volunteer posts"
      ];
    case 3:
      return [
        "Local groups adopt helping practices",
        "Community events get more volunteers",
        "Neighbors start checking on each other"
      ];
    case 4:
      return [
        "City implements new support programs",
        "Schools teach community service",
        "Business sponsor local initiatives"
      ];
    default:
      return ["Positive change continues to spread"];
  }
};

export default NetworkEffectVisualization;
