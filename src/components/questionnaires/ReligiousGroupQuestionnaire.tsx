
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

const ReligiousGroupQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    organizationName: "",
    religiousTradition: "",
    yearEstablished: "",
    membershipSize: "",
    communityServicesOffered: [],
    currentChallenges: [],
    outreachPrograms: [],
    volunteerManagement: "",
    communicationMethods: [],
    interfaithCollaboration: "",
    youthPrograms: [],
    seniorPrograms: [],
    socialJusticeInitiatives: [],
    platformFeatures: {
      communityOutreach: "",
      eventManagement: "",
      volunteerCoordination: "",
      interfaithNetworking: "",
      resourceSharing: "",
      impactTracking: ""
    },
    partnershipInterest: "",
    supportNeeds: [],
    spiritualCareServices: [],
    educationalPrograms: [],
    communitySupport: "",
    diversityInclusion: "",
    environmentalStewardship: [],
    crisisResponse: "",
    culturalActivities: [],
    healthWellnessPrograms: [],
    economicSupport: [],
    advocacyAreas: [],
    leadershipDevelopment: "",
    missionAlignment: "",
    communityNeeds: "",
    futureGoals: "",
    contactName: "",
    contactPosition: "",
    contactEmail: "",
    contactPhone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Religious Group Questionnaire data:", formData);
  };

  return (
    <QuestionnaireLayout 
      title="Religious Organization Registration"
      description="Help us understand your religious organization's community work and how SouLVE can support your mission"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE</h4>
        <p className="text-gray-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-gray-600 mb-6">
          Our platform recognizes the vital role religious organizations play in community support and aims to amplify your positive impact through enhanced coordination and resource sharing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Organization Information</h3>
          
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
            <Label htmlFor="organizationName">Organization Name *</Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="religiousTradition">Religious Tradition/Denomination *</Label>
            <Input
              id="religiousTradition"
              value={formData.religiousTradition}
              onChange={(e) => setFormData(prev => ({ ...prev, religiousTradition: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearEstablished">Year Established *</Label>
            <Input
              id="yearEstablished"
              type="number"
              value={formData.yearEstablished}
              onChange={(e) => setFormData(prev => ({ ...prev, yearEstablished: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Membership/Congregation Size *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, membershipSize: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select membership size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-50">Under 50 members</SelectItem>
                <SelectItem value="50-150">50-150 members</SelectItem>
                <SelectItem value="151-500">151-500 members</SelectItem>
                <SelectItem value="501-1000">501-1000 members</SelectItem>
                <SelectItem value="over-1000">Over 1000 members</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="missionAlignment">How does community service align with your organization's mission? *</Label>
            <Textarea
              id="missionAlignment"
              value={formData.missionAlignment}
              onChange={(e) => setFormData(prev => ({ ...prev, missionAlignment: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Community Services & Programs</h3>
          
          <div className="space-y-2">
            <Label>What community services does your organization currently offer? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Food bank/pantry",
                "Homeless shelter/support",
                "Youth programs",
                "Senior care",
                "Counseling services",
                "Educational programs",
                "Healthcare services",
                "Disaster relief",
                "Addiction support",
                "Community meals",
                "Clothing distribution",
                "Financial assistance",
                "Immigration support",
                "Job training",
                "Childcare services",
                "Mental health support"
              ].map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.communityServicesOffered.includes(service)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, communityServicesOffered: [...prev.communityServicesOffered, service] }));
                      } else {
                        setFormData(prev => ({ ...prev, communityServicesOffered: prev.communityServicesOffered.filter(item => item !== service) }));
                      }
                    }}
                  />
                  <Label htmlFor={service}>{service}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What outreach programs do you operate? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Community evangelism",
                "Social justice advocacy",
                "Environmental stewardship",
                "Prison ministry",
                "Hospital visitation",
                "Street ministry",
                "Campus ministry",
                "Workplace chaplaincy",
                "Crisis intervention",
                "Grief counseling",
                "Marriage/family support",
                "Community organizing"
              ].map((program) => (
                <div key={program} className="flex items-center space-x-2">
                  <Checkbox
                    id={program}
                    checked={formData.outreachPrograms.includes(program)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, outreachPrograms: [...prev.outreachPrograms, program] }));
                      } else {
                        setFormData(prev => ({ ...prev, outreachPrograms: prev.outreachPrograms.filter(item => item !== program) }));
                      }
                    }}
                  />
                  <Label htmlFor={program}>{program}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What youth programs do you offer? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Sunday school/religious education",
                "Youth groups",
                "Summer camps",
                "Mentoring programs",
                "Sports activities",
                "Music/arts programs",
                "Community service projects",
                "Leadership development",
                "Scholarship programs",
                "After-school programs",
                "Teen counseling",
                "Career guidance"
              ].map((program) => (
                <div key={program} className="flex items-center space-x-2">
                  <Checkbox
                    id={program}
                    checked={formData.youthPrograms.includes(program)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, youthPrograms: [...prev.youthPrograms, program] }));
                      } else {
                        setFormData(prev => ({ ...prev, youthPrograms: prev.youthPrograms.filter(item => item !== program) }));
                      }
                    }}
                  />
                  <Label htmlFor={program}>{program}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What programs do you offer for seniors? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Senior fellowship groups",
                "Meals on wheels",
                "Transportation services",
                "Health and wellness programs",
                "Social activities",
                "Home visits",
                "Technology training",
                "Intergenerational programs",
                "Caregiver support",
                "Memory care activities",
                "Financial planning assistance",
                "End-of-life support"
              ].map((program) => (
                <div key={program} className="flex items-center space-x-2">
                  <Checkbox
                    id={program}
                    checked={formData.seniorPrograms.includes(program)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, seniorPrograms: [...prev.seniorPrograms, program] }));
                      } else {
                        setFormData(prev => ({ ...prev, seniorPrograms: prev.seniorPrograms.filter(item => item !== program) }));
                      }
                    }}
                  />
                  <Label htmlFor={program}>{program}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Social Justice & Community Action</h3>
          
          <div className="space-y-2">
            <Label>What social justice initiatives is your organization involved in? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Racial justice",
                "Economic justice",
                "Environmental justice",
                "Immigration advocacy",
                "LGBTQ+ inclusion",
                "Gender equality",
                "Disability rights",
                "Criminal justice reform",
                "Housing advocacy",
                "Healthcare access",
                "Education equity",
                "Human trafficking prevention"
              ].map((initiative) => (
                <div key={initiative} className="flex items-center space-x-2">
                  <Checkbox
                    id={initiative}
                    checked={formData.socialJusticeInitiatives.includes(initiative)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, socialJusticeInitiatives: [...prev.socialJusticeInitiatives, initiative] }));
                      } else {
                        setFormData(prev => ({ ...prev, socialJusticeInitiatives: prev.socialJusticeInitiatives.filter(item => item !== initiative) }));
                      }
                    }}
                  />
                  <Label htmlFor={initiative}>{initiative}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What environmental stewardship activities do you participate in? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Community gardens",
                "Recycling programs",
                "Energy conservation",
                "Climate action advocacy",
                "Sustainable practices",
                "Environmental education",
                "Clean-up initiatives",
                "Tree planting",
                "Water conservation",
                "Green building practices",
                "Carbon footprint reduction",
                "Wildlife protection"
              ].map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={activity}
                    checked={formData.environmentalStewardship.includes(activity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, environmentalStewardship: [...prev.environmentalStewardship, activity] }));
                      } else {
                        setFormData(prev => ({ ...prev, environmentalStewardship: prev.environmentalStewardship.filter(item => item !== activity) }));
                      }
                    }}
                  />
                  <Label htmlFor={activity}>{activity}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>In what advocacy areas is your organization active? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Peace and non-violence",
                "Poverty alleviation",
                "Religious freedom",
                "Human rights",
                "Healthcare reform",
                "Education policy",
                "Immigration policy",
                "Criminal justice",
                "Mental health awareness",
                "Substance abuse prevention",
                "Family support",
                "Community development"
              ].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={formData.advocacyAreas.includes(area)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, advocacyAreas: [...prev.advocacyAreas, area] }));
                      } else {
                        setFormData(prev => ({ ...prev, advocacyAreas: prev.advocacyAreas.filter(item => item !== area) }));
                      }
                    }}
                  />
                  <Label htmlFor={area}>{area}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Specialized Services</h3>
          
          <div className="space-y-2">
            <Label>What spiritual care services do you provide? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Pastoral counseling",
                "Spiritual direction",
                "Chaplaincy services",
                "Grief counseling",
                "Marriage counseling",
                "Family therapy",
                "Crisis intervention",
                "Prayer ministry",
                "Healing services",
                "Meditation/contemplation",
                "Retreat programs",
                "Spiritual education"
              ].map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.spiritualCareServices.includes(service)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, spiritualCareServices: [...prev.spiritualCareServices, service] }));
                      } else {
                        setFormData(prev => ({ ...prev, spiritualCareServices: prev.spiritualCareServices.filter(item => item !== service) }));
                      }
                    }}
                  />
                  <Label htmlFor={service}>{service}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What educational programs do you offer? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Religious education classes",
                "Adult education",
                "Literacy programs",
                "Language classes",
                "Computer skills training",
                "Financial literacy",
                "Parenting classes",
                "Life skills training",
                "GED preparation",
                "College preparation",
                "Vocational training",
                "Professional development"
              ].map((program) => (
                <div key={program} className="flex items-center space-x-2">
                  <Checkbox
                    id={program}
                    checked={formData.educationalPrograms.includes(program)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, educationalPrograms: [...prev.educationalPrograms, program] }));
                      } else {
                        setFormData(prev => ({ ...prev, educationalPrograms: prev.educationalPrograms.filter(item => item !== program) }));
                      }
                    }}
                  />
                  <Label htmlFor={program}>{program}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What health and wellness programs do you provide? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Health screenings",
                "Mental health support",
                "Addiction recovery programs",
                "Fitness classes",
                "Nutrition education",
                "Health education",
                "Support groups",
                "Wellness workshops",
                "Stress management",
                "Chronic disease support",
                "Preventive care education",
                "Alternative healing practices"
              ].map((program) => (
                <div key={program} className="flex items-center space-x-2">
                  <Checkbox
                    id={program}
                    checked={formData.healthWellnessPrograms.includes(program)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, healthWellnessPrograms: [...prev.healthWellnessPrograms, program] }));
                      } else {
                        setFormData(prev => ({ ...prev, healthWellnessPrograms: prev.healthWellnessPrograms.filter(item => item !== program) }));
                      }
                    }}
                  />
                  <Label htmlFor={program}>{program}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What economic support do you provide to the community? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Emergency financial assistance",
                "Microfinance programs",
                "Job placement services",
                "Entrepreneurship support",
                "Financial counseling",
                "Affordable housing initiatives",
                "Credit building programs",
                "Debt counseling",
                "Small business support",
                "Economic development projects",
                "Community investment",
                "Fair trade initiatives"
              ].map((support) => (
                <div key={support} className="flex items-center space-x-2">
                  <Checkbox
                    id={support}
                    checked={formData.economicSupport.includes(support)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, economicSupport: [...prev.economicSupport, support] }));
                      } else {
                        setFormData(prev => ({ ...prev, economicSupport: prev.economicSupport.filter(item => item !== support) }));
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Operations & Challenges</h3>
          
          <div className="space-y-2">
            <Label>What are your organization's biggest challenges? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Volunteer recruitment",
                "Volunteer retention",
                "Funding/resources",
                "Community outreach",
                "Interfaith collaboration",
                "Youth engagement",
                "Senior care needs",
                "Technology adoption",
                "Administrative burden",
                "Facility maintenance",
                "Program sustainability",
                "Leadership development",
                "Communication coordination",
                "Impact measurement"
              ].map((challenge) => (
                <div key={challenge} className="flex items-center space-x-2">
                  <Checkbox
                    id={challenge}
                    checked={formData.currentChallenges.includes(challenge)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, currentChallenges: [...prev.currentChallenges, challenge] }));
                      } else {
                        setFormData(prev => ({ ...prev, currentChallenges: prev.currentChallenges.filter(item => item !== challenge) }));
                      }
                    }}
                  />
                  <Label htmlFor={challenge}>{challenge}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volunteerManagement">How do you currently manage volunteers? *</Label>
            <Textarea
              id="volunteerManagement"
              value={formData.volunteerManagement}
              onChange={(e) => setFormData(prev => ({ ...prev, volunteerManagement: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>How do you communicate with your congregation and community? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Weekly bulletins",
                "Email newsletters",
                "Website updates",
                "Social media",
                "Phone calls",
                "Text messaging",
                "Community boards",
                "Direct mail",
                "Mobile apps",
                "Video announcements",
                "Radio/podcast",
                "Print materials"
              ].map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={method}
                    checked={formData.communicationMethods.includes(method)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, communicationMethods: [...prev.communicationMethods, method] }));
                      } else {
                        setFormData(prev => ({ ...prev, communicationMethods: prev.communicationMethods.filter(item => item !== method) }));
                      }
                    }}
                  />
                  <Label htmlFor={method}>{method}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interfaithCollaboration">Describe your experience with interfaith collaboration *</Label>
            <Textarea
              id="interfaithCollaboration"
              value={formData.interfaithCollaboration}
              onChange={(e) => setFormData(prev => ({ ...prev, interfaithCollaboration: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crisisResponse">How does your organization respond to community crises? *</Label>
            <Textarea
              id="crisisResponse"
              value={formData.crisisResponse}
              onChange={(e) => setFormData(prev => ({ ...prev, crisisResponse: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Community & Culture</h3>
          
          <div className="space-y-2">
            <Label>What cultural activities does your organization host? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Religious festivals",
                "Cultural celebrations",
                "Music concerts",
                "Art exhibitions",
                "Theater productions",
                "Food festivals",
                "Cultural education",
                "Heritage preservation",
                "Language preservation",
                "Traditional crafts",
                "Storytelling events",
                "Dance performances"
              ].map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={activity}
                    checked={formData.culturalActivities.includes(activity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, culturalActivities: [...prev.culturalActivities, activity] }));
                      } else {
                        setFormData(prev => ({ ...prev, culturalActivities: prev.culturalActivities.filter(item => item !== activity) }));
                      }
                    }}
                  />
                  <Label htmlFor={activity}>{activity}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="communitySupport">How does your organization support community building? *</Label>
            <Textarea
              id="communitySupport"
              value={formData.communitySupport}
              onChange={(e) => setFormData(prev => ({ ...prev, communitySupport: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diversityInclusion">How does your organization promote diversity and inclusion? *</Label>
            <Textarea
              id="diversityInclusion"
              value={formData.diversityInclusion}
              onChange={(e) => setFormData(prev => ({ ...prev, diversityInclusion: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadershipDevelopment">How do you develop leaders within your organization and community? *</Label>
            <Textarea
              id="leadershipDevelopment"
              value={formData.leadershipDevelopment}
              onChange={(e) => setFormData(prev => ({ ...prev, leadershipDevelopment: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Future Vision & Goals</h3>
          
          <div className="space-y-2">
            <Label htmlFor="communityNeeds">What are the most pressing needs in your community? *</Label>
            <Textarea
              id="communityNeeds"
              value={formData.communityNeeds}
              onChange={(e) => setFormData(prev => ({ ...prev, communityNeeds: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="futureGoals">What are your organization's goals for the next 3-5 years? *</Label>
            <Textarea
              id="futureGoals"
              value={formData.futureGoals}
              onChange={(e) => setFormData(prev => ({ ...prev, futureGoals: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">SouLVE Platform Features - How valuable would these be? (1-5 scale)</h3>
          
          {[
            { key: "communityOutreach", label: "Community outreach coordination tools" },
            { key: "eventManagement", label: "Religious and community event management system" },
            { key: "volunteerCoordination", label: "Volunteer coordination and scheduling platform" },
            { key: "interfaithNetworking", label: "Interfaith networking and collaboration tools" },
            { key: "resourceSharing", label: "Resource sharing with other religious organizations" },
            { key: "impactTracking", label: "Community impact tracking and reporting" }
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Partnership & Support</h3>
          
          <div className="space-y-2">
            <Label>Would your organization be interested in partnering with SouLVE? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, partnershipInterest: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
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
            <Label>What support would your organization need most? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Volunteer coordination",
                "Community outreach",
                "Event planning",
                "Technology training",
                "Grant writing assistance",
                "Interfaith dialogue facilitation",
                "Youth program development",
                "Senior care resources",
                "Crisis response planning",
                "Leadership development",
                "Communication strategies",
                "Impact measurement",
                "Resource sharing networks",
                "Professional development"
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

export default ReligiousGroupQuestionnaire;
