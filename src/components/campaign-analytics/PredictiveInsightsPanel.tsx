
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Calendar, DollarSign, Users, AlertTriangle, CheckCircle } from "lucide-react";

const PredictiveInsightsPanel = () => {
  // Mock predictive data
  const predictions = {
    goalCompletion: {
      probability: 87,
      expectedDate: "Feb 15, 2024",
      confidence: "High",
      finalAmount: 22500
    },
    donorGrowth: {
      predictedDonors: 245,
      growthRate: 15.2,
      peakPeriod: "Next 2 weeks"
    },
    riskFactors: [
      { factor: "Seasonal decline", impact: "Medium", probability: 35 },
      { factor: "Competition", impact: "Low", probability: 20 },
      { factor: "Economic factors", impact: "Medium", probability: 45 }
    ],
    recommendations: [
      {
        type: "marketing",
        priority: "High",
        action: "Increase social media promotion",
        expectedImpact: "+18% reach"
      },
      {
        type: "timing",
        priority: "Medium",
        action: "Send email campaign on weekends",
        expectedImpact: "+12% conversion"
      },
      {
        type: "content",
        priority: "High",
        action: "Share more impact stories",
        expectedImpact: "+25% engagement"
      }
    ]
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "Medium": return <Target className="h-4 w-4 text-yellow-500" />;
      case "Low": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Goal Completion Prediction */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span>Goal Completion Forecast</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{predictions.goalCompletion.probability}%</div>
              <div className="text-sm text-gray-600">Success Probability</div>
              <Badge className={getConfidenceColor(predictions.goalCompletion.confidence)}>
                {predictions.goalCompletion.confidence} Confidence
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{predictions.goalCompletion.expectedDate}</div>
              <div className="text-sm text-gray-600">Expected Completion</div>
              <div className="flex items-center justify-center mt-1">
                <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-xs">18 days ahead of schedule</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${predictions.goalCompletion.finalAmount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Projected Final Amount</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs">12.5% above goal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donor Growth Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Donor Growth Forecast</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold">{predictions.donorGrowth.predictedDonors}</div>
              <div className="text-sm text-gray-600">Projected Total Donors</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold">+{predictions.donorGrowth.growthRate}%</div>
              <div className="text-sm text-gray-600">Monthly Growth Rate</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold">{predictions.donorGrowth.peakPeriod}</div>
              <div className="text-sm text-gray-600">Peak Activity Period</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Risk Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {predictions.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{risk.factor}</div>
                  <div className="text-sm text-gray-600">Impact: {risk.impact}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{risk.probability}%</div>
                  <Progress value={risk.probability} className="w-20 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {predictions.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                {getPriorityIcon(rec.priority)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{rec.action}</div>
                    <Badge variant={rec.priority === "High" ? "destructive" : rec.priority === "Medium" ? "default" : "secondary"}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Expected impact: {rec.expectedImpact}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Score */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle>Campaign Performance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-600 mb-2">92</div>
            <div className="text-lg text-gray-700 mb-4">Excellent Performance</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium">Funding</div>
                <div className="text-green-600">95/100</div>
              </div>
              <div>
                <div className="font-medium">Engagement</div>
                <div className="text-blue-600">88/100</div>
              </div>
              <div>
                <div className="font-medium">Reach</div>
                <div className="text-purple-600">91/100</div>
              </div>
              <div>
                <div className="font-medium">Growth</div>
                <div className="text-orange-600">94/100</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveInsightsPanel;
