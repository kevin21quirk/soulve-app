import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Target, Users, Megaphone, BarChart3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CampaignForm from "./CampaignForm";
import CampaignList from "./CampaignList";
import CampaignAnalytics from "./CampaignAnalytics";

const CampaignBuilder = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  if (showCreateForm) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaign Builder
          </Button>
        </div>
        <CampaignForm onSuccess={() => setShowCreateForm(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Builder</h1>
          <p className="text-lg text-gray-600">
            Create, manage, and deliver impactful campaigns that drive real change
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-teal-700">Total Campaigns</p>
                <p className="text-2xl font-bold text-teal-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Total Supporters</p>
                <p className="text-2xl font-bold text-blue-900">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Active Campaigns</p>
                <p className="text-2xl font-bold text-purple-900">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Total Raised</p>
                <p className="text-2xl font-bold text-green-900">$24,567</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Campaigns</h2>
          <p className="text-gray-600">Manage and track your campaign performance</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
                <CardDescription>
                  Get your campaign up and running in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-sm font-medium text-teal-600 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Define Your Goal</h4>
                    <p className="text-sm text-gray-600">Set clear objectives and target audience for your campaign</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-sm font-medium text-teal-600 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Create Compelling Content</h4>
                    <p className="text-sm text-gray-600">Tell your story with engaging text, images, and videos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-sm font-medium text-teal-600 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Launch & Promote</h4>
                    <p className="text-sm text-gray-600">Share your campaign and invite supporters to join</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Tips</CardTitle>
                <CardDescription>
                  Best practices for successful campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Use High-Quality Images</p>
                  <p className="text-xs text-blue-700">Visual content increases engagement by 94%</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Set Realistic Goals</p>
                  <p className="text-xs text-green-700">Achievable targets build trust and momentum</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">Regular Updates</p>
                  <p className="text-xs text-purple-700">Keep supporters engaged with progress updates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <CampaignList />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CampaignAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignBuilder;
