
import { useState } from "react";
import { Heart, Tag, Plus, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MobileInterestsStepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const MobileInterestsStep = ({ onNext, onPrevious, currentStep, totalSteps }: MobileInterestsStepProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showingInterests, setShowingInterests] = useState(true);
  const [customInput, setCustomInput] = useState("");

  const quickInterests = [
    "Community Building", "Education", "Environment", "Healthcare",
    "Senior Care", "Youth Mentoring", "Animal Welfare", "Food Security",
    "Mental Health", "Technology", "Arts & Culture", "Social Justice"
  ];

  const quickSkills = [
    "Teaching", "Counseling", "Technology", "Cooking", "Healthcare",
    "Transportation", "Event Planning", "Writing", "Translation",
    "Home Repair", "Childcare", "Financial Planning"
  ];

  const toggleItem = (item: string, isInterest: boolean) => {
    if (isInterest) {
      setSelectedInterests(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    } else {
      setSelectedSkills(prev => 
        prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
      );
    }
  };

  const addCustomItem = () => {
    if (customInput.trim()) {
      const item = customInput.trim();
      if (showingInterests && !selectedInterests.includes(item)) {
        setSelectedInterests(prev => [...prev, item]);
      } else if (!showingInterests && !selectedSkills.includes(item)) {
        setSelectedSkills(prev => [...prev, item]);
      }
      setCustomInput("");
    }
  };

  const removeItem = (item: string, isInterest: boolean) => {
    if (isInterest) {
      setSelectedInterests(prev => prev.filter(i => i !== item));
    } else {
      setSelectedSkills(prev => prev.filter(s => s !== item));
    }
  };

  const handleNext = () => {
    onNext({ 
      interests: selectedInterests,
      skills: selectedSkills
    });
  };

  const currentItems = showingInterests ? quickInterests : quickSkills;
  const selectedItems = showingInterests ? selectedInterests : selectedSkills;
  const isFormValid = selectedInterests.length > 0 || selectedSkills.length > 0;

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-gray-900">Your Interests & Skills</h1>
        <p className="text-sm text-gray-600">
          Help us connect you with the right opportunities
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setShowingInterests(true)}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            showingInterests 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600"
          }`}
        >
          <Heart className="h-4 w-4 inline mr-1" />
          Interests
        </button>
        <button
          onClick={() => setShowingInterests(false)}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            !showingInterests 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600"
          }`}
        >
          <Tag className="h-4 w-4 inline mr-1" />
          Skills
        </button>
      </div>

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Selected {showingInterests ? 'interests' : 'skills'}:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <Badge key={item} variant="secondary" className="pr-1">
                {item}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item, showingInterests)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Quick Selection Grid */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">
          Quick select {showingInterests ? 'interests' : 'skills'}:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {currentItems.map((item) => (
            <Button
              key={item}
              variant={selectedItems.includes(item) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleItem(item, showingInterests)}
              className={`h-auto py-3 text-xs ${
                selectedItems.includes(item) 
                  ? showingInterests ? "bg-teal-600 hover:bg-teal-700" : "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-gray-50"
              }`}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Add custom {showingInterests ? 'interest' : 'skill'}:
        </p>
        <div className="flex space-x-2">
          <Input
            placeholder={`Enter a ${showingInterests ? 'interest' : 'skill'}...`}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
            className="text-sm"
          />
          <Button onClick={addCustomItem} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-3 rounded-lg border border-teal-200">
        <p className="text-xs text-gray-700">
          <strong>💡 Tip:</strong> Select at least one interest or skill to help us find your perfect matches. You can always add more later!
        </p>
      </div>

      {/* Navigation */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex-1 h-12"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          className="flex-1 bg-teal-600 hover:bg-teal-700 h-12"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MobileInterestsStep;
