import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Star, TrendingUp, MessageSquare, Target, Heart } from "lucide-react";

interface StakeholderEngagementData {
  stakeholderBreakdown: Record<string, {
    averageSatisfaction: number;
    responseRate: number;
    totalMetrics: number;
    engagementMethods: string[];
  }>;
  overallEngagement: number;
  totalStakeholders: number;
}

interface StakeholderEngagementCardProps {
  engagementData: StakeholderEngagementData;
  isLoading?: boolean;
}

const StakeholderEngagementCard = ({ engagementData, isLoading = false }: StakeholderEngagementCardProps) => {
  const stakeholderIcons = {
    employees: Users,
    community: Heart,
    suppliers: Target,
    investors: TrendingUp,
    customers: MessageSquare
  };

  const stakeholderColors = {
    employees: { bg: 'from-blue-50 to-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    community: { bg: 'from-green-50 to-green-100', text: 'text-green-700', border: 'border-green-200' },
    suppliers: { bg: 'from-purple-50 to-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    investors: { bg: 'from-yellow-50 to-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    customers: { bg: 'from-pink-50 to-pink-100', text: 'text-pink-700', border: 'border-pink-200' }
  };

  const getSatisfactionLevel = (score: number) => {
    if (score >= 4.5) return { level: 'Excellent', color: 'text-green-600' };
    if (score >= 4.0) return { level: 'Very Good', color: 'text-blue-600' };
    if (score >= 3.5) return { level: 'Good', color: 'text-yellow-600' };
    if (score >= 3.0) return { level: 'Fair', color: 'text-orange-600' };
    return { level: 'Needs Improvement', color: 'text-red-600' };
  };

  const formatEngagementMethods = (methods: string[]) => {
    return methods.map(method => 
      method.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ).join(', ');
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 border-0 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-foreground">Stakeholder Engagement</h3>
        </div>
        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
          {engagementData?.totalStakeholders || 0} Groups Tracked
        </Badge>
      </div>

      {/* Overall Engagement Score */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-800">Overall Engagement Score</span>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-lg font-bold text-purple-700">
              {engagementData?.overallEngagement?.toFixed(1) || '0.0'}/5.0
            </span>
          </div>
        </div>
        <Progress 
          value={(engagementData?.overallEngagement || 0) * 20} 
          className="h-2 bg-purple-200" 
        />
      </div>

      {/* Stakeholder Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(engagementData?.stakeholderBreakdown || {}).map(([stakeholder, data]) => {
          const IconComponent = stakeholderIcons[stakeholder as keyof typeof stakeholderIcons] || Users;
          const colors = stakeholderColors[stakeholder as keyof typeof stakeholderColors] || stakeholderColors.employees;
          const satisfaction = getSatisfactionLevel(data.averageSatisfaction);

          return (
            <div 
              key={stakeholder} 
              className={`p-4 rounded-lg bg-gradient-to-br ${colors.bg} border ${colors.border}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-4 w-4 ${colors.text}`} />
                  <span className={`font-medium text-sm capitalize ${colors.text}`}>
                    {stakeholder}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className={`text-sm font-semibold ${satisfaction.color}`}>
                    {data.averageSatisfaction.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Satisfaction Level</span>
                  <span className={`font-medium ${satisfaction.color}`}>
                    {satisfaction.level}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Response Rate</span>
                  <span className={`font-medium ${colors.text}`}>
                    {data.responseRate}%
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-1">Engagement Methods</div>
                  <div className="text-xs text-gray-500">
                    {formatEngagementMethods(data.engagementMethods)}
                  </div>
                </div>

                <Progress 
                  value={data.averageSatisfaction * 20} 
                  className="h-1.5 mt-2" 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Engagement Insights */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-800">Engagement Insights</span>
        </div>
        <p className="text-xs text-indigo-700">
          {engagementData?.overallEngagement >= 4.0 
            ? "Strong stakeholder engagement across all groups. Consider sharing best practices internally."
            : engagementData?.overallEngagement >= 3.5
            ? "Good engagement levels with room for improvement. Focus on lower-scoring stakeholder groups."
            : "Stakeholder engagement needs attention. Develop targeted engagement strategies for each group."
          }
        </p>
      </div>

      {engagementData?.totalStakeholders === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No stakeholder engagement data available</p>
          <p className="text-xs mt-1">Start collecting stakeholder feedback to track engagement</p>
        </div>
      )}
    </Card>
  );
};

export default StakeholderEngagementCard;