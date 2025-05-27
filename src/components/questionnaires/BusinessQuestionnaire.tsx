
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

const BusinessQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    businessName: "",
    industry: "",
    businessSize: "",
    location: "",
    csrPrograms: [],
    communityInvolvement: [],
    csrBudget: "",
    csrChallenges: [],
    employeeEngagement: "",
    partnershipGoals: [],
    platformFeatures: {
      csrTracking: "",
      employeeVolunteering: "",
      communityPartnerships: "",
      impactMeasurement: "",
      brandAlignment: "",
      stakeholderEngagement: ""
    },
    investmentInterest: "",
    partnershipType: "",
    supportNeeds: [],
    sustainabilityInitiatives: [],
    stakeholderEngagement: "",
    impactMeasurement: "",
    csrReporting: "",
    employeeVolunteeringPrograms: "",
    communityPartnershipExperience: "",
    brandValues: "",
    socialImpactGoals: "",
    innovationInterest: "",
    technologyAdoption: "",
    marketingApproach: "",
    competitiveDifferentiation: "",
    customerEngagement: "",
    futureVision: "",
    contactName: "",
    contactPosition: "",
    contactEmail: "",
    contactPhone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Business Questionnaire data:", formData);
  };

  return (
    <QuestionnaireLayout 
      title="Business Partnership Registration"
      description="Help us understand how your business can partner with SouLVE to create positive community impact"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE</h4>
        <p className="text-gray-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-gray-600 mb-6">
          Our platform offers businesses unique opportunities to demonstrate genuine community commitment, engage employees in meaningful CSR activities, and measure real social impact.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Business Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry/Sector *</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Business Size *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, businessSize: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select business size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                <SelectItem value="small">Small (11-50 employees)</SelectItem>
                <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
                <SelectItem value="large">Large (251-1000 employees)</SelectItem>
                <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Primary Location/Region *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandValues">What are your company's core values and mission? *</Label>
            <Textarea
              id="brandValues"
              value={formData.brandValues}
              onChange={(e) => setFormData(prev => ({ ...prev, brandValues: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Current CSR & Community Involvement</h3>
          
          <div className="space-y-2">
            <Label>What CSR or community programs does your business currently support? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Employee Volunteering",
                "Local Sponsorships",
                "Environmental Initiatives",
                "Education Programs",
                "Community Events",
                "Charitable Donations",
                "Skills-based Volunteering",
                "Disaster Relief",
                "Youth Development",
                "Health & Wellness",
                "Diversity & Inclusion",
                "Social Enterprises",
                "Mentoring Programs",
                "Pro Bono Services",
                "Community Infrastructure",
                "Research & Development for Good"
              ].map((program) => (
                <div key={program} className="flex items-center space-x-2">
                  <Checkbox
                    id={program}
                    checked={formData.csrPrograms.includes(program)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, csrPrograms: [...prev.csrPrograms, program] }));
                      } else {
                        setFormData(prev => ({ ...prev, csrPrograms: prev.csrPrograms.filter(item => item !== program) }));
                      }
                    }}
                  />
                  <Label htmlFor={program}>{program}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>How does your business currently engage with the community? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Direct partnerships with charities",
                "Employee volunteer programs",
                "Community event sponsorship",
                "Local business collaboration",
                "Educational workshops",
                "Mentoring programs",
                "Resource sharing",
                "Pro bono services",
                "Community advisory boards",
                "Local hiring initiatives",
                "Supply chain partnerships",
                "Innovation challenges"
              ].map((involvement) => (
                <div key={involvement} className="flex items-center space-x-2">
                  <Checkbox
                    id={involvement}
                    checked={formData.communityInvolvement.includes(involvement)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, communityInvolvement: [...prev.communityInvolvement, involvement] }));
                      } else {
                        setFormData(prev => ({ ...prev, communityInvolvement: prev.communityInvolvement.filter(item => item !== involvement) }));
                      }
                    }}
                  />
                  <Label htmlFor={involvement}>{involvement}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeVolunteeringPrograms">Describe your current employee volunteering programs *</Label>
            <Textarea
              id="employeeVolunteeringPrograms"
              value={formData.employeeVolunteeringPrograms}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeVolunteeringPrograms: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="communityPartnershipExperience">What has been your experience with community partnerships? *</Label>
            <Textarea
              id="communityPartnershipExperience"
              value={formData.communityPartnershipExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, communityPartnershipExperience: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>What is your approximate annual CSR/community investment budget? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, csrBudget: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-5k">Under £5,000</SelectItem>
                <SelectItem value="5k-25k">£5,000 - £25,000</SelectItem>
                <SelectItem value="25k-100k">£25,000 - £100,000</SelectItem>
                <SelectItem value="100k-500k">£100,000 - £500,000</SelectItem>
                <SelectItem value="over-500k">Over £500,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What are your biggest CSR challenges? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Finding authentic partnerships",
                "Measuring impact",
                "Employee engagement",
                "Time management",
                "Budget allocation",
                "Identifying opportunities",
                "Communication/reporting",
                "Stakeholder alignment",
                "Compliance requirements",
                "ROI demonstration",
                "Long-term sustainability",
                "Cultural integration"
              ].map((challenge) => (
                <div key={challenge} className="flex items-center space-x-2">
                  <Checkbox
                    id={challenge}
                    checked={formData.csrChallenges.includes(challenge)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, csrChallenges: [...prev.csrChallenges, challenge] }));
                      } else {
                        setFormData(prev => ({ ...prev, csrChallenges: prev.csrChallenges.filter(item => item !== challenge) }));
                      }
                    }}
                  />
                  <Label htmlFor={challenge}>{challenge}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeEngagement">How do your employees currently engage in community activities? *</Label>
            <Textarea
              id="employeeEngagement"
              value={formData.employeeEngagement}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeEngagement: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Sustainability & Impact</h3>
          
          <div className="space-y-2">
            <Label>What sustainability initiatives does your business have? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Carbon neutral/net zero goals",
                "Sustainable supply chain",
                "Waste reduction programs",
                "Renewable energy use",
                "Sustainable packaging",
                "Water conservation",
                "Biodiversity protection",
                "Circular economy practices",
                "Sustainable transportation",
                "Green building practices",
                "Sustainable product design",
                "Environmental reporting"
              ].map((initiative) => (
                <div key={initiative} className="flex items-center space-x-2">
                  <Checkbox
                    id={initiative}
                    checked={formData.sustainabilityInitiatives.includes(initiative)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, sustainabilityInitiatives: [...prev.sustainabilityInitiatives, initiative] }));
                      } else {
                        setFormData(prev => ({ ...prev, sustainabilityInitiatives: prev.sustainabilityInitiatives.filter(item => item !== initiative) }));
                      }
                    }}
                  />
                  <Label htmlFor={initiative}>{initiative}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="impactMeasurement">How do you currently measure your social and environmental impact? *</Label>
            <Textarea
              id="impactMeasurement"
              value={formData.impactMeasurement}
              onChange={(e) => setFormData(prev => ({ ...prev, impactMeasurement: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="csrReporting">What CSR reporting frameworks do you use? *</Label>
            <Textarea
              id="csrReporting"
              value={formData.csrReporting}
              onChange={(e) => setFormData(prev => ({ ...prev, csrReporting: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialImpactGoals">What are your social impact goals for the next 3 years? *</Label>
            <Textarea
              id="socialImpactGoals"
              value={formData.socialImpactGoals}
              onChange={(e) => setFormData(prev => ({ ...prev, socialImpactGoals: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Partnership Goals & Strategy</h3>
          
          <div className="space-y-2">
            <Label>What are your main goals for community partnerships? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Brand reputation enhancement",
                "Employee engagement",
                "Community impact measurement",
                "Customer loyalty building",
                "Stakeholder relations",
                "Innovation opportunities",
                "Talent attraction/retention",
                "Market expansion",
                "Risk management",
                "Regulatory compliance",
                "Competitive advantage",
                "Long-term sustainability"
              ].map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.partnershipGoals.includes(goal)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, partnershipGoals: [...prev.partnershipGoals, goal] }));
                      } else {
                        setFormData(prev => ({ ...prev, partnershipGoals: prev.partnershipGoals.filter(item => item !== goal) }));
                      }
                    }}
                  />
                  <Label htmlFor={goal}>{goal}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stakeholderEngagement">How do you engage with stakeholders on social impact? *</Label>
            <Textarea
              id="stakeholderEngagement"
              value={formData.stakeholderEngagement}
              onChange={(e) => setFormData(prev => ({ ...prev, stakeholderEngagement: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEngagement">How do you engage customers in your social impact initiatives? *</Label>
            <Textarea
              id="customerEngagement"
              value={formData.customerEngagement}
              onChange={(e) => setFormData(prev => ({ ...prev, customerEngagement: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competitiveDifferentiation">How does social impact differentiate you from competitors? *</Label>
            <Textarea
              id="competitiveDifferentiation"
              value={formData.competitiveDifferentiation}
              onChange={(e) => setFormData(prev => ({ ...prev, competitiveDifferentiation: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Innovation & Technology</h3>
          
          <div className="space-y-2">
            <Label htmlFor="innovationInterest">What role does innovation play in your social impact strategy? *</Label>
            <Textarea
              id="innovationInterest"
              value={formData.innovationInterest}
              onChange={(e) => setFormData(prev => ({ ...prev, innovationInterest: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologyAdoption">How does your business currently use technology for social good? *</Label>
            <Textarea
              id="technologyAdoption"
              value={formData.technologyAdoption}
              onChange={(e) => setFormData(prev => ({ ...prev, technologyAdoption: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketingApproach">How do you communicate your social impact to the market? *</Label>
            <Textarea
              id="marketingApproach"
              value={formData.marketingApproach}
              onChange={(e) => setFormData(prev => ({ ...prev, marketingApproach: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="futureVision">What is your vision for your business's social impact in 5 years? *</Label>
            <Textarea
              id="futureVision"
              value={formData.futureVision}
              onChange={(e) => setFormData(prev => ({ ...prev, futureVision: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">SouLVE Platform Features - How valuable would these be? (1-5 scale)</h3>
          
          {[
            { key: "csrTracking", label: "CSR activity tracking and reporting dashboard" },
            { key: "employeeVolunteering", label: "Employee volunteering coordination system" },
            { key: "communityPartnerships", label: "Verified community partnership matching" },
            { key: "impactMeasurement", label: "Real-time impact measurement and analytics" },
            { key: "brandAlignment", label: "Brand values alignment verification" },
            { key: "stakeholderEngagement", label: "Stakeholder engagement and communication tools" }
          ].map((feature) => (
            <div key={feature.key} className="space-y-2">
              <Label>{feature.label} *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                platformFeatures: { ...prev.platformFeatures, [feature.key]: value }
              }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating (1-5)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Not valuable</SelectItem>
                  <SelectItem value="2">2 - Slightly valuable</SelectItem>
                  <SelectItem value="3">3 - Moderately valuable</SelectItem>
                  <SelectItem value="4">4 - Very valuable</SelectItem>
                  <SelectItem value="5">5 - Extremely valuable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Investment & Partnership Interest</h3>
          
          <div className="space-y-2">
            <Label>Would you be interested in investment opportunities with SouLVE? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, investmentInterest: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select interest level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="very-interested">Very interested</SelectItem>
                <SelectItem value="somewhat-interested">Somewhat interested</SelectItem>
                <SelectItem value="need-more-info">Need more information</SelectItem>
                <SelectItem value="not-interested">Not interested at this time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What type of partnership would interest you most? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, partnershipType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select partnership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strategic">Strategic Partnership</SelectItem>
                <SelectItem value="sponsorship">Sponsorship</SelectItem>
                <SelectItem value="technology">Technology Integration</SelectItem>
                <SelectItem value="investment">Investment Opportunity</SelectItem>
                <SelectItem value="pilot">Pilot Program</SelectItem>
                <SelectItem value="co-development">Co-development</SelectItem>
                <SelectItem value="licensing">Licensing Agreement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What support would your business need most? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "CSR strategy development",
                "Impact measurement tools",
                "Employee engagement programs",
                "Community partnership facilitation",
                "Reporting and analytics",
                "Brand integration guidance",
                "Training and onboarding",
                "Custom feature development",
                "Stakeholder communication",
                "Compliance support",
                "Innovation partnerships",
                "Market research"
              ].map((support) => (
                <div key={support} className="flex items-center space-x-2">
                  <Checkbox
                    id={support}
                    checked={formData.supportNeeds.includes(support)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, supportNeeds: [...prev.supportNeeds, support] }));
                      } else {
                        setFormData(prev => ({ ...prev, supportNeeds: prev.supportNeeds.filter(item => item !== support) }));
                      }
                    }}
                  />
                  <Label htmlFor={support}>{support}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Contact Information (optional)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPosition">Position/Title</Label>
              <Input
                id="contactPosition"
                value={formData.contactPosition}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPosition: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl"
          >
            Submit Registration
          </Button>
        </div>
      </form>
    </QuestionnaireLayout>
  );
};

export default BusinessQuestionnaire;
