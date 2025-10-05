import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

const WelcomeWizard = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    bio: "",
    skills: [] as string[],
    interests: [] as string[],
  });

  const skillOptions = [
    "Project Management",
    "Marketing",
    "Design",
    "Development",
    "Writing",
    "Teaching",
    "Healthcare",
    "Finance",
  ];

  const interestOptions = [
    "Education",
    "Environment",
    "Healthcare",
    "Poverty",
    "Animal Welfare",
    "Human Rights",
    "Arts & Culture",
    "Technology",
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          location: formData.location,
          bio: formData.bio,
        })
        .eq("id", user?.id);

      if (profileError) throw profileError;

      // Save preferences
      const preferences = [
        ...formData.skills.map((skill) => ({
          user_id: user?.id,
          preference_type: "skill",
          preference_value: skill,
        })),
        ...formData.interests.map((interest) => ({
          user_id: user?.id,
          preference_type: "interest",
          preference_value: interest,
        })),
      ];

      const { error: prefError } = await supabase
        .from("user_preferences")
        .insert(preferences);

      if (prefError) throw prefError;

      toast({
        title: "Welcome to SouLVE!",
        description: "Your profile has been set up successfully.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="London, UK"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bio">Tell us about yourself</Label>
              <textarea
                id="bio"
                className="w-full min-h-[120px] p-3 border rounded-md"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="I'm passionate about making a difference..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Label>What skills can you offer?</Label>
            <div className="grid grid-cols-2 gap-3">
              {skillOptions.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.skills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  />
                  <label htmlFor={skill} className="text-sm cursor-pointer">
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Label>What causes interest you?</Label>
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <label htmlFor={interest} className="text-sm cursor-pointer">
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to SouLVE! 🌟</CardTitle>
          <CardDescription>
            Let's set up your profile in a few quick steps (Step {step} of 4)
          </CardDescription>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeWizard;
