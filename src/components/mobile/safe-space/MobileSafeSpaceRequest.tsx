
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Clock, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSafeSpace } from "@/hooks/useSafeSpace";

const MobileSafeSpaceRequest = () => {
  const { toast } = useToast();
  const { requestSupport, isRequestingSupport, queuePosition } = useSafeSpace();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("medium");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const categories = [
    { value: "mental_health", label: "Mental Health", emoji: "🧠" },
    { value: "relationships", label: "Relationships", emoji: "💕" },
    { value: "work_life", label: "Work & Life", emoji: "⚖️" },
    { value: "addiction", label: "Addiction", emoji: "🆘" },
    { value: "trauma", label: "Trauma", emoji: "🛡️" },
    { value: "identity", label: "Identity", emoji: "🌟" },
    { value: "general", label: "General", emoji: "🤝" }
  ];

  const urgencyLevels = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" }
  ];

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast({
        title: "Please select a category",
        description: "We need to know what kind of support you're looking for.",
        variant: "destructive"
      });
      return;
    }

    try {
      await requestSupport(selectedCategory, selectedUrgency, additionalInfo);
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
      <div className="space-y-4">
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-2">#{queuePosition}</div>
          <p className="text-blue-800 font-medium mb-1">Position in queue</p>
          <Badge variant="outline" className="bg-white">
            ~{Math.max(queuePosition * 5, 5)} min wait
          </Badge>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">
            We're matching you with the best available helper for your needs. 
            You'll receive a notification when connected.
          </p>
        </div>
        
        <Button variant="outline" className="w-full">
          Cancel Request
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Safety Notice */}
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Crisis Support</p>
            <p>If you're in immediate danger, please contact emergency services (999) or a crisis hotline.</p>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">What would you like support with?</h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedCategory === category.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="text-lg mb-1">{category.emoji}</div>
              <div className="text-sm font-medium">{category.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Urgency Selection */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">How urgent is this?</h3>
        <div className="grid grid-cols-3 gap-2">
          {urgencyLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSelectedUrgency(level.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedUrgency === level.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Badge className={`${level.color} w-full`}>
                {level.label}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Additional context (optional)</h3>
        <Textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Any additional information that might help..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Privacy Notice */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">100% Anonymous & Safe</p>
            <ul className="space-y-1 text-xs">
              <li>• Completely anonymous conversations</li>
              <li>• Messages auto-delete after 24 hours</li>
              <li>• Verified & background-checked helpers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isRequestingSupport || !selectedCategory}
        className="w-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white h-12"
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
    </div>
  );
};

export default MobileSafeSpaceRequest;
