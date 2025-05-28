
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileRegistrationHeader from "@/components/profile-registration/ProfileRegistrationHeader";
import UserTypeSection from "@/components/profile-registration/UserTypeSection";
import PersonalInfoSection from "@/components/profile-registration/PersonalInfoSection";
import SkillsInterestsSection from "@/components/profile-registration/SkillsInterestsSection";
import MotivationSection from "@/components/profile-registration/MotivationSection";
import TermsAgreementSection from "@/components/profile-registration/TermsAgreementSection";
import SubmitSection from "@/components/profile-registration/SubmitSection";

const ProfileRegistration = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    interests: "",
    availability: "",
    motivation: "",
    agreeToTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserTypeChange = (selectedUserType: string) => {
    setUserType(selectedUserType);
    
    // Navigate immediately when user type is selected
    switch (selectedUserType) {
      case "standard":
        navigate("/questionnaire/standard-user");
        break;
      case "charity":
        navigate("/questionnaire/charity");
        break;
      case "community-group":
        navigate("/questionnaire/community-group");
        break;
      case "religious-group":
        navigate("/questionnaire/religious-group");
        break;
      case "business":
        navigate("/questionnaire/business");
        break;
      case "social-group":
        navigate("/questionnaire/social-group");
        break;
      case "ambassador":
        navigate("/questionnaire/ambassador");
        break;
      case "partnerships":
        navigate("/questionnaire/partnerships");
        break;
      case "expertise":
        navigate("/questionnaire/expertise");
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This is now only used if someone manually submits the form
    if (!userType) {
      console.log("Please select a user type");
      return;
    }
    
    // Store the basic registration data (you might want to use localStorage or a context)
    console.log("Registration data:", formData);
    console.log("User type:", userType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <ProfileRegistrationHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl text-gray-900 mb-4">Create Your Soulver Profile</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Tell us about yourself so we can connect you with the right opportunities to help your community
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <UserTypeSection userType={userType} setUserType={handleUserTypeChange} />
              
              <PersonalInfoSection 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />

              <SkillsInterestsSection 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />

              <MotivationSection 
                motivation={formData.motivation} 
                handleInputChange={handleInputChange} 
              />

              <TermsAgreementSection 
                agreeToTerms={formData.agreeToTerms} 
                handleInputChange={handleInputChange} 
              />

              <SubmitSection 
                agreeToTerms={formData.agreeToTerms} 
                userType={userType} 
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileRegistration;
