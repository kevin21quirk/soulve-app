import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Heart,
  Award,
  Newspaper,
  Globe,
  Target
} from "lucide-react";

const CSRAnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Impact Analytics Dashboard</h3>
        <p className="text-muted-foreground">
          Track real community impact and measure your CSR success
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lives Impacted</p>
                <p className="text-2xl font-bold text-foreground">1,247</p>
                <p className="text-xs text-green-600">+23% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CSR Investment</p>
                <p className="text-2xl font-bold text-foreground">£156K</p>
                <p className="text-xs text-blue-600">£42K this quarter</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Partnerships</p>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-purple-600">3 new this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employee Hours</p>
                <p className="text-2xl font-bold text-foreground">842</p>
                <p className="text-xs text-orange-600">volunteer hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Impact by Category
            </h4>
            <div className="space-y-4">
              {[
                { category: 'Education', amount: 45000, impact: '320 students', percentage: 29 },
                { category: 'Environment', amount: 38000, impact: '12 projects', percentage: 24 },
                { category: 'Healthcare', amount: 35000, impact: '450 people', percentage: 22 },
                { category: 'Emergency Relief', amount: 38000, impact: '285 families', percentage: 25 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{item.category}</span>
                    <span className="text-sm text-muted-foreground">£{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-20">{item.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Media Coverage & Reach
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Press Mentions</p>
                  <p className="text-xs text-muted-foreground">National & Local Media</p>
                </div>
                <p className="text-2xl font-bold text-foreground">18</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Social Media Reach</p>
                  <p className="text-xs text-muted-foreground">Across All Platforms</p>
                </div>
                <p className="text-2xl font-bold text-foreground">2.3M</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Engagement Rate</p>
                  <p className="text-xs text-muted-foreground">Likes, Shares, Comments</p>
                </div>
                <p className="text-2xl font-bold text-foreground">8.4%</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Media Value</p>
                  <p className="text-xs text-muted-foreground">Estimated PR Value</p>
                </div>
                <p className="text-2xl font-bold text-green-600">£485K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Success Stories */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Recent Success Stories
          </h4>
          <div className="space-y-4">
            {[
              {
                title: 'Tech Training Programme Graduation',
                description: '45 young adults completed our coding bootcamp, 38 secured employment',
                date: '2 days ago',
                impact: 'high',
                media: 'Featured in Tech Times'
              },
              {
                title: 'Community Garden Network Launch',
                description: '5 new community gardens opened, serving 400+ families with fresh produce',
                date: '1 week ago',
                impact: 'medium',
                media: 'Local BBC coverage'
              },
              {
                title: 'Winter Relief Campaign Success',
                description: 'Provided warm clothing and shelter to 180 families during harsh winter',
                date: '2 weeks ago',
                impact: 'high',
                media: 'Guardian article'
              }
            ].map((story, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="font-semibold text-foreground">{story.title}</h5>
                    <Badge variant={story.impact === 'high' ? 'default' : 'outline'} className="text-xs">
                      {story.impact} impact
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{story.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{story.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Newspaper className="h-3 w-3" />
                      {story.media}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ESG Integration */}
      <Card className="border-2 border-primary">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-foreground mb-2">ESG Reporting Integration</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Your CSR activities automatically contribute to your ESG reporting metrics
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Social Impact Score</p>
                  <p className="text-2xl font-bold text-foreground">87</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Governance Score</p>
                  <p className="text-2xl font-bold text-foreground">92</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Community Score</p>
                  <p className="text-2xl font-bold text-foreground">95</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSRAnalyticsDashboard;
