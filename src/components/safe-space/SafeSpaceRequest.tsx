
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSafeSpace } from "@/hooks/useSafeSpace";

interface SafeSpaceRequestProps {
  queuePosition?: number;
}

const SafeSpaceRequest = ({ queuePosition }: SafeSpaceRequestProps) => {
  const { toast } = useToast();
  const { requestSupport, isRequestingSupport } = useSafeSpace();
  const [formData, setFormData] = useState({
    issueCategory: "",
    urgencyLevel: "medium",
    additionalInfo: ""
  });

  const issueCategories = [
    { value: "mental_health", label: "Mental Health & Wellbeing", description: "Anxiety, depression, stress management" },
    { value: "relationships", label: "Relationships & Family", description: "Relationship issues, family conflicts" },
    { value: "work_life", label: "Work & Life Balance", description: "Career stress, life transitions" },
    { value: "addiction", label: "Addiction Support", description: "Substance abuse, behavioral addictions" },
    { value: "trauma", label: "Trauma & Crisis", description: "PTSD, recent traumatic events" },
    { value: "identity", label: "Identity & Self-Worth", description: "Self-esteem, identity exploration" },
    { value: "general", label: "General Support", description: "Any other support needs" }
  ];

  const urgencyLevels = [
    { value: "low", label: "Low", description: "Can wait for the right match", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", description: "Would like support soon", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", description: "Need support urgently", color: "bg-red-100 text-red-800" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.issueCategory) {
      toast({
        title: "Please select a category",
        description: "We need to know what kind of support you're looking for.",
        variant: "destructive"
      });
      return;
    }

    try {
      await requestSupport(formData.issueCategory, formData.urgencyLevel, formData.additionalInfo);
      
      toast({
        title: "Support Request Submitted",
        description: "We're connecting you with a verified helper. You'll be notified when matched.",
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (queuePosition !== undefined && queuePosition > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>You're in the queue</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-blue-600">#{queuePosition}</div>
            <p className="text-gray-600">Position in queue</p>
            <Badge variant="outline" className="px-3 py-1">
              Estimated wait: {Math.max(queuePosition * 5, 5)} minutes
            </Badge>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              We're matching you with the best available helper for your needs. 
              You'll receive a notification when connected.
            </p>
          </div>
          
          <Button variant="outline" className="w-full">
            Cancel Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-pink-600" />
          <span>Request Anonymous Support</span>
        </CardTitle>
        <p className="text-gray-600">
          Connect with a verified helper for confidential peer support. All conversations are anonymous and temporary.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="issueCategory">What would you like support with?</Label>
            <Select value={formData.issueCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, issueCategory: value }))}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {issueCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="urgencyLevel">How urgent is this?</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {urgencyLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, urgencyLevel: level.value }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.urgencyLevel === level.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <Badge className={level.color}>{level.label}</Badge>
                    <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="additionalInfo">Additional context (optional)</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
              placeholder="Any additional information that might help us match you with the right helper..."
              className="mt-2"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              This information helps us find the most suitable helper. It remains anonymous.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Your Privacy & Safety</p>
                <ul className="space-y-1 text-xs">
                  <li>• All conversations are completely anonymous</li>
                  <li>• Messages are automatically deleted after 24 hours</li>
                  <li>• Helpers are verified and background checked</li>
                  <li>• You can end the session at any time</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isRequestingSupport}
            className="w-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
          >
            {isRequestingSupport ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Request Support
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SafeSpaceRequest;
