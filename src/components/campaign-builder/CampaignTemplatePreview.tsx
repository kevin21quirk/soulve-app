
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, Target, Users, Star, Share2, Heart } from "lucide-react";
import { CampaignTemplate } from "@/services/campaignTemplateService";

interface CampaignTemplatePreviewProps {
  template: CampaignTemplate;
  isOpen: boolean;
  onClose: () => void;
  onUse: () => void;
}

const CampaignTemplatePreview = ({ template, isOpen, onClose, onUse }: CampaignTemplatePreviewProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fundraising": return "💰";
      case "volunteer": return "🤝";
      case "awareness": return "📢";
      case "community": return "🏘️";
      case "petition": return "✊";
      case "social_cause": return "❤️";
      default: return "📋";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryIcon(template.category)}</span>
            <span>{template.name} Template</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Template Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{template.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm text-gray-900 mb-1">Duration</h5>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{template.estimatedDuration || `${template.template_data.duration_days || 60} days`}</span>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-900 mb-1">Target Amount</h5>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Target className="h-3 w-3" />
                        <span>${(template.targetAmount || template.template_data.suggested_goal_amount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-900 mb-1">Difficulty</h5>
                      <Badge className={template.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 
                                       template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                                       template.difficulty === 'advanced' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                        {template.difficulty || "intermediate"}
                      </Badge>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-900 mb-1">Usage</h5>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="h-3 w-3" />
                        <span>{template.usage_count} times</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm text-gray-900 mb-2">Tags</h5>
                    <div className="flex flex-wrap gap-1">
                      {template.template_data.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Expected Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {template.content?.goals && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Goals</h4>
                      <ul className="space-y-1">
                        {template.content.goals.map((goal, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {template.content?.impacts && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Expected Impacts</h4>
                      <ul className="space-y-1">
                        {template.content.impacts.map((impact, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{impact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pre-filled Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Campaign Title</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{template.template_data.title}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{template.template_data.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Campaign Story</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{template.template_data.story}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.socialStrategies && template.socialStrategies.length > 0 ? (
                  template.socialStrategies.map((strategy, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{strategy.platform}</h4>
                      <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded">{strategy.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {strategy.hashtags.map(hashtag => (
                          <Badge key={hashtag} variant="outline" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Social media strategies will be customized based on your campaign goals.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.milestones && template.milestones.length > 0 ? (
                  template.milestones.map((milestone, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <Badge variant="outline">{milestone.percentage}%</Badge>
                      </div>
                      <Progress value={milestone.percentage} className="mb-2" />
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                      {milestone.reward && (
                        <div className="mt-2 text-sm text-green-600 font-medium">
                          🎁 Reward: {milestone.reward}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Milestones will be set up based on your campaign type and goals.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Created by {template.createdBy}</span>
            <span>•</span>
            <span>{template.createdAt}</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onUse} className="flex items-center space-x-2">
              <span>Use This Template</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignTemplatePreview;
