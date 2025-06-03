
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Heart, Users, Clock, Star, AlertTriangle, Construction } from "lucide-react";
import SafeSpaceRequest from "./SafeSpaceRequest";
import SafeSpaceHelperDashboard from "./SafeSpaceHelperDashboard";
import SafeSpaceSession from "./SafeSpaceSession";
import { useSafeSpace } from "@/hooks/useSafeSpace";

const SafeSpaceTab = () => {
  const [activeView, setActiveView] = useState("request");
  const { 
    currentSession, 
    isHelper, 
    helperStatus, 
    queuePosition,
    availableHelpers 
  } = useSafeSpace();

  // If user has an active session, show the session interface
  if (currentSession) {
    return <SafeSpaceSession session={currentSession} />;
  }

  return (
    <div className="space-y-6">
      {/* Development Status Banner */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Construction className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Safe Space - In Development</p>
              <p>
                This feature is currently being developed. UI and basic flow are complete, but real-time matching, 
                notifications, and verification processes are coming soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Safe Space</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A secure, anonymous environment for confidential peer-to-peer support with verified helpers.
        </p>
        
        {/* Quick Stats */}
        <div className="flex justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{availableHelpers} helpers online</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span>100% anonymous</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>24/7 support</span>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Important Safety Information</p>
              <p>
                This service provides peer support but is not a substitute for professional help. 
                If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="request" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            <Heart className="h-4 w-4" />
            <span>Request Support</span>
          </TabsTrigger>
          <TabsTrigger 
            value="helper" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            <Shield className="h-4 w-4" />
            <span>Become a Helper</span>
            {isHelper && (
              <Badge variant="outline" className="ml-1">
                {helperStatus}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="mt-6">
          <SafeSpaceRequest queuePosition={queuePosition} />
        </TabsContent>

        <TabsContent value="helper" className="mt-6">
          <SafeSpaceHelperDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SafeSpaceTab;
