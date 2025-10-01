
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Target, Users, Calendar, Settings } from "lucide-react";
import CampaignForm from "./CampaignForm";

const CustomCampaignBuilder = () => {
  const [activeStep, setActiveStep] = useState("basics");
  
  const steps = [
    { id: "basics", label: "Basic Info", icon: Target },
    { id: "content", label: "Content", icon: Sparkles },
    { id: "audience", label: "Audience", icon: Users },
    { id: "timeline", label: "Timeline", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleCampaignCreated = (title: string, description: string, type: 'fundraising' | 'volunteer' | 'awareness' | 'community') => {
    // Campaign created successfully
  };

  const handleSuccess = () => {
    // Campaign creation successful
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Custom Campaign Builder</h2>
          <p className="text-gray-600 mt-1">Build your campaign from scratch with full customization</p>
        </div>
        <Badge variant="soulve" className="px-3 py-1">
          <Sparkles className="h-3 w-3 mr-1" />
          Advanced Builder
        </Badge>
      </div>

      <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <TabsTrigger key={step.id} value={step.id} className="flex items-center space-x-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{step.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Basics</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignForm 
                onCampaignCreated={handleCampaignCreated}
                onSuccess={handleSuccess}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Content customization coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Audience targeting coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Timeline planning coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Advanced settings coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomCampaignBuilder;
