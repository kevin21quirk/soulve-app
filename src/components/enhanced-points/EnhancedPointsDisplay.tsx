
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEnhancedPoints } from '@/hooks/useEnhancedPoints';
import { 
  Trophy, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Star,
  Zap,
  Clock,
  Award
} from 'lucide-react';

const EnhancedPointsDisplay = () => {
  const { 
    loading, 
    metrics, 
    trustDomains, 
    redFlags, 
    getTrustTier, 
    getTrustScoreBreakdown 
  } = useEnhancedPoints();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Impact Journey</h3>
          <p className="text-gray-600">Help others and make a difference to earn your first points!</p>
        </CardContent>
      </Card>
    );
  }

  const trustTier = getTrustTier();
  const trustBreakdown = getTrustScoreBreakdown();

  return (
    <div className="space-y-6">
      {/* Main Trust Score Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Trust Score</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Your community reputation</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{metrics.trust_score}</div>
              <div className="text-sm text-gray-600">/ 100</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={metrics.trust_score} className="h-3" />
            
            <div className="flex items-center justify-between">
              <Badge className={`${trustTier.bgColor} ${trustTier.color} border-0`}>
                <Award className="h-3 w-3 mr-1" />
                {trustTier.name}
              </Badge>
              {redFlags.length > 0 && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {redFlags.length} Active Flag{redFlags.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {/* Trust Score Breakdown */}
            {trustBreakdown && (
              <div className="bg-white/60 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Score Breakdown</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Lifetime Points (60%)</span>
                    <span className="font-medium">+{trustBreakdown.components.lifetime_points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Rating (30%)</span>
                    <span className="font-medium">+{trustBreakdown.components.average_rating}</span>
                  </div>
                  {trustBreakdown.components.red_flags_penalty > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Red Flags (10%)</span>
                      <span className="font-medium">-{trustBreakdown.components.red_flags_penalty}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Points and XP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>Impact Points</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {metrics.impact_score.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Lifetime earned</span>
            </div>
            {metrics.decay_applied_count > 0 && (
              <div className="mt-2 text-xs text-orange-600">
                Decay applied {metrics.decay_applied_count} time{metrics.decay_applied_count > 1 ? 's' : ''}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Zap className="h-5 w-5 text-purple-600" />
              <span>XP Points</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {metrics.xp_points.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Star className="h-4 w-4" />
              <span>Activity & engagement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{metrics.help_provided_count}</div>
              <div className="text-sm text-gray-600">Help Provided</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{metrics.volunteer_hours}</div>
              <div className="text-sm text-gray-600">Volunteer Hours</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">£{metrics.donation_amount}</div>
              <div className="text-sm text-gray-600">Donated</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{metrics.connections_count}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Average Rating</span>
              </span>
              <span className="font-medium">{metrics.average_rating.toFixed(1)}/5.0</span>
            </div>
            
            {metrics.last_activity_date && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Last Activity</span>
                </span>
                <span className="text-gray-600">
                  {new Date(metrics.last_activity_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trust Domains */}
      {trustDomains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Specialized Trust Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trustDomains.slice(0, 3).map((domain) => (
                <div key={domain.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium capitalize">
                      {domain.domain.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {domain.actions_count} actions • {domain.average_rating.toFixed(1)}/5 rating
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{domain.domain_score}%</div>
                    <div className="text-xs text-gray-500">Trust Level</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedPointsDisplay;
