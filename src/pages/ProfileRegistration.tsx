
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, User, Mail, MapPin, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import SouLVELogo from "@/components/SouLVELogo";

const ProfileRegistration = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration data:", formData);
    console.log("User type:", userType);
    // Here you would typically send the data to your backend
  };

  const userTypeOptions = [
    { value: "standard", label: "Standard User" },
    { value: "charity", label: "Charity" },
    { value: "community-group", label: "Community Group" },
    { value: "religious-group", label: "Religious Group" },
    { value: "business", label: "Business" },
    { value: "social-group", label: "Social Group" },
    { value: "ambassador", label: "Ambassador" },
    { value: "partnerships", label: "Partnerships" },
    { value: "expertise", label: "Expertise" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-6">
            <SouLVELogo size="small" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Become a Soulver</h1>
            <p className="text-xl text-teal-100">Join our community of changemakers and start making a difference today</p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
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
              {/* User Type Selection */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="h-6 w-6 text-teal-600" />
                  <h3 className="text-xl font-semibold text-gray-900">User Type</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userType" className="text-gray-700">What best describes you or your organization?</Label>
                  <Select onValueChange={setUserType} required>
                    <SelectTrigger className="border-gray-300 focus:border-teal-500">
                      <SelectValue placeholder="Select your user type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="h-6 w-6 text-teal-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="border-gray-300 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="border-gray-300 focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-gray-300 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-gray-300 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location (City, State)
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="border-gray-300 focus:border-teal-500"
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                </div>
              </div>

              {/* Skills & Interests */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Heart className="h-6 w-6 text-teal-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Your Skills & Interests</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-gray-700">Skills & Expertise</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    className="border-gray-300 focus:border-teal-500 min-h-[100px]"
                    placeholder="e.g., Teaching, Construction, Cooking, Technology, Healthcare, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-gray-700">Areas of Interest</Label>
                  <Textarea
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => handleInputChange("interests", e.target.value)}
                    className="border-gray-300 focus:border-teal-500 min-h-[100px]"
                    placeholder="e.g., Education, Environmental causes, Senior care, Youth mentoring, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-gray-700">Availability</Label>
                  <Select onValueChange={(value) => handleInputChange("availability", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-teal-500">
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekends">Weekends only</SelectItem>
                      <SelectItem value="evenings">Evenings after work</SelectItem>
                      <SelectItem value="flexible">Flexible schedule</SelectItem>
                      <SelectItem value="few-hours">A few hours per week</SelectItem>
                      <SelectItem value="several-hours">Several hours per week</SelectItem>
                      <SelectItem value="as-needed">As needed basis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Motivation */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-teal-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Your Why</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation" className="text-gray-700">What motivates you to help others?</Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => handleInputChange("motivation", e.target.value)}
                    className="border-gray-300 focus:border-teal-500 min-h-[120px]"
                    placeholder="Share what drives your passion for helping your community..."
                  />
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3 p-6 bg-gray-50 rounded-lg">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy. I understand that SouLVE will verify my identity and background to ensure community safety and trust.
                </Label>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!formData.agreeToTerms || !userType}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Complete Registration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileRegistration;
