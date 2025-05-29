
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Image, Settings, Share2 } from "lucide-react";

const CustomCampaignBuilder = () => {
  const buildingSteps = [
    {
      id: "basic",
      title: "Basic Information",
      description: "Campaign title, category, and basic details",
      icon: FileText,
      completed: false
    },
    {
      id: "content",
      title: "Content & Story",
      description: "Campaign description, story, and goals",
      icon: FileText,
      completed: false
    },
    {
      id: "media",
      title: "Media & Visuals",
      description: "Upload images, videos, and create gallery",
      icon: Image,
      completed: false
    },
    {
      id: "settings",
      title: "Campaign Settings",
      description: "Target amount, duration, and privacy settings",
      icon: Settings,
      completed: false
    },
    {
      id: "promotion",
      title: "Promotion Strategy",
      description: "Social sharing, outreach, and marketing plan",
      icon: Share2,
      completed: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Build Your Custom Campaign</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Create a completely custom campaign from scratch. Follow our step-by-step guide to build 
          a compelling and effective fundraising campaign.
        </p>
        <Button size="lg" className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Start Building</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildingSteps.map((step, index) => (
          <Card key={step.id} className="hover:shadow-lg transition-all duration-200 group cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <step.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">Step {index + 1}</span>
                    {step.completed && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{step.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                {step.completed ? "Edit Step" : "Start Step"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help Getting Started?</h3>
              <p className="text-gray-600">
                Check out our campaign building guide or browse successful campaigns for inspiration.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View Guide
              </Button>
              <Button size="sm">
                Browse Examples
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomCampaignBuilder;
