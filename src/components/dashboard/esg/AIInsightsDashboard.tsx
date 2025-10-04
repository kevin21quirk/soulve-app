import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  Bot,
  Zap,
  BarChart3,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: 'environmental' | 'social' | 'governance';
  priority: number;
  actionable: boolean;
  estimatedTime: string;
}

interface PredictiveAnalysis {
  metric: string;
  currentValue: number;
  predicted3Month: number;
  predicted6Month: number;
  predicted12Month: number;
  confidence: number;
  trend: 'improving' | 'declining' | 'stable';
  unit: string;
}

const AIInsightsDashboard = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Mock AI insights data
  const aiInsights: AIInsight[] = [
    {
      id: '1',
      type: 'anomaly',
      title: 'Unusual Energy Consumption Spike',
      description: 'Energy consumption increased by 23% in the last month, significantly above the seasonal average. This could indicate equipment inefficiency or operational changes.',
      confidence: 87,
      impact: 'high',
      category: 'environmental',
      priority: 1,
      actionable: true,
      estimatedTime: '1-2 weeks'
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'Optimize Supply Chain Sustainability',
      description: 'Analysis suggests switching to 3 alternative suppliers could reduce carbon footprint by 15% while maintaining cost efficiency.',
      confidence: 92,
      impact: 'high',
      category: 'environmental',
      priority: 2,
      actionable: true,
      estimatedTime: '2-3 months'
    },
    {
      id: '3',
      type: 'trend',
      title: 'Improving Employee Diversity Metrics',
      description: 'Gender diversity in leadership positions has shown consistent improvement over the last 6 months, exceeding industry benchmarks.',
      confidence: 94,
      impact: 'medium',
      category: 'social',
      priority: 3,
      actionable: false,
      estimatedTime: 'Ongoing'
    },
    {
      id: '4',
      type: 'prediction',
      title: 'ESG Score Trajectory',
      description: 'Based on current initiatives, your overall ESG score is predicted to reach 85/100 within 12 months, placing you in the top quartile.',
      confidence: 78,
      impact: 'high',
      category: 'governance',
      priority: 4,
      actionable: false,
      estimatedTime: '12 months'
    }
  ];

  // Mock predictive analysis data
  const predictiveAnalysis: PredictiveAnalysis[] = [
    {
      metric: 'Carbon Intensity',
      currentValue: 2.1,
      predicted3Month: 1.9,
      predicted6Month: 1.7,
      predicted12Month: 1.5,
      confidence: 85,
      trend: 'improving',
      unit: 'tCO2e/M revenue'
    },
    {
      metric: 'Employee Satisfaction',
      currentValue: 78,
      predicted3Month: 80,
      predicted6Month: 82,
      predicted12Month: 84,
      confidence: 73,
      trend: 'improving',
      unit: '%'
    },
    {
      metric: 'Board Independence',
      currentValue: 75,
      predicted3Month: 75,
      predicted6Month: 80,
      predicted12Month: 85,
      confidence: 91,
      trend: 'improving',
      unit: '%'
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return AlertTriangle;
      case 'recommendation': return Lightbulb;
      case 'trend': return TrendingUp;
      case 'prediction': return Target;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'anomaly': return 'bg-red-100 text-red-800 border-red-200';
      case 'recommendation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'trend': return 'bg-green-100 text-green-800 border-green-200';
      case 'prediction': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environmental': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-blue-100 text-blue-800';
      case 'governance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const filteredInsights = activeCategory === 'all' 
    ? aiInsights 
    : aiInsights.filter(insight => insight.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center">
            <Brain className="h-6 w-6 mr-2 text-primary" />
            AI-Powered ESG Insights
          </h2>
          <p className="text-muted-foreground mt-1">
            Intelligent analysis and recommendations for ESG performance optimization
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <Bot className="h-3 w-3 mr-1" />
            AI Active
          </Badge>
          <Button variant="gradient" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger 
            value="insights"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            AI Insights
          </TabsTrigger>
          <TabsTrigger 
            value="predictions"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Predictions
          </TabsTrigger>
          <TabsTrigger 
            value="automation"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-6">
          {/* Category Filter */}
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-sm font-medium">Filter by category:</span>
            {['all', 'environmental', 'social', 'governance'].map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-transparent hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90" : ""}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInsights.map((insight) => {
              const InsightIcon = getInsightIcon(insight.type);
              return (
                <Card key={insight.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                        <InsightIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{insight.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getCategoryColor(insight.category)}>
                            {insight.category}
                          </Badge>
                          <Badge variant="outline" className={getInsightColor(insight.type)}>
                            {insight.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Priority #{insight.priority}</div>
                      <div className={`text-xs ${getImpactColor(insight.impact)}`}>
                        {insight.impact} impact
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{insight.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Confidence: </span>
                        <span className="font-medium">{insight.confidence}%</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Timeline: </span>
                        <span className="font-medium">{insight.estimatedTime}</span>
                      </div>
                    </div>
                    {insight.actionable && (
                      <Button size="sm" variant="gradient">
                        Take Action
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>

                  {/* Confidence Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${insight.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="mt-6">
          <div className="space-y-6">
            {predictiveAnalysis.map((prediction) => (
              <Card key={prediction.metric} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{prediction.metric}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={`${getTrendColor(prediction.trend)} border-current`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {prediction.trend}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {prediction.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {prediction.currentValue}{prediction.unit}
                    </div>
                    <div className="text-sm text-muted-foreground">Current</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-700">
                      {prediction.predicted3Month}{prediction.unit}
                    </div>
                    <div className="text-sm text-blue-600">3 Months</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-700">
                      {prediction.predicted6Month}{prediction.unit}
                    </div>
                    <div className="text-sm text-green-600">6 Months</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                    <div className="text-lg font-bold text-purple-700">
                      {prediction.predicted12Month}{prediction.unit}
                    </div>
                    <div className="text-sm text-purple-600">12 Months</div>
                  </div>
                </div>

                {/* Prediction Timeline */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Now</span>
                    <span>12 months</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 relative">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                    {/* Milestone markers */}
                    <div className="absolute top-0 left-1/4 w-1 h-3 bg-blue-500 rounded"></div>
                    <div className="absolute top-0 left-1/2 w-1 h-3 bg-green-500 rounded"></div>
                    <div className="absolute top-0 left-3/4 w-1 h-3 bg-purple-500 rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Automated Tasks */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Data Collection</h3>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Active
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Automatically collecting ESG data from 15 connected systems
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Energy meters</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>HR systems</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Financial data</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </Card>

            {/* Report Generation */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Report Generation</h3>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    Scheduled
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Monthly ESG reports automatically generated and distributed
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Next report</span>
                  <span className="font-medium">Jan 31, 2024</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recipients</span>
                  <span className="font-medium">12 stakeholders</span>
                </div>
              </div>
            </Card>

            {/* Anomaly Detection */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Anomaly Detection</h3>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                    Monitoring
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Real-time monitoring for unusual patterns in ESG data
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Last alert</span>
                  <span className="font-medium">2 days ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sensitivity</span>
                  <span className="font-medium">High</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIInsightsDashboard;