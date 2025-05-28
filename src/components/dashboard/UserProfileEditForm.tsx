
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UserProfileData } from "./UserProfileTypes";

interface UserProfileEditFormProps {
  editData: UserProfileData;
  onInputChange: (field: keyof UserProfileData, value: string) => void;
  onSkillsChange: (value: string) => void;
  onInterestsChange: (value: string) => void;
  onSocialLinksChange: (field: string, value: string) => void;
  onOrganizationInfoChange: (field: string, value: string) => void;
}

const UserProfileEditForm = ({ 
  editData, 
  onInputChange, 
  onSkillsChange, 
  onInterestsChange,
  onSocialLinksChange,
  onOrganizationInfoChange
}: UserProfileEditFormProps) => {
  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name / Organization Name</Label>
            <Input
              id="name"
              value={editData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={editData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={editData.location}
              onChange={(e) => onInputChange("location", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="bio">Bio / About</Label>
          <Textarea
            id="bio"
            value={editData.bio}
            onChange={(e) => onInputChange("bio", e.target.value)}
            rows={4}
            placeholder="Tell others about yourself or your organization..."
          />
        </div>
      </div>

      <Separator />

      {/* Organization Information */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Organization Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organizationType">Organization Type</Label>
            <Select
              value={editData.organizationInfo.organizationType || ""}
              onValueChange={(value) => onOrganizationInfoChange("organizationType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="charity">Charity</SelectItem>
                <SelectItem value="community-group">Community Group</SelectItem>
                <SelectItem value="religious-group">Religious Group</SelectItem>
                <SelectItem value="social-group">Social Group</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="establishedYear">Established Year</Label>
            <Input
              id="establishedYear"
              value={editData.organizationInfo.establishedYear || ""}
              onChange={(e) => onOrganizationInfoChange("establishedYear", e.target.value)}
              placeholder="e.g., 2020"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number (if applicable)</Label>
            <Input
              id="registrationNumber"
              value={editData.organizationInfo.registrationNumber || ""}
              onChange={(e) => onOrganizationInfoChange("registrationNumber", e.target.value)}
              placeholder="Charity/Business registration number"
            />
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              value={editData.organizationInfo.mission || ""}
              onChange={(e) => onOrganizationInfoChange("mission", e.target.value)}
              rows={3}
              placeholder="What is your mission or purpose?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vision">Vision Statement</Label>
            <Textarea
              id="vision"
              value={editData.organizationInfo.vision || ""}
              onChange={(e) => onOrganizationInfoChange("vision", e.target.value)}
              rows={3}
              placeholder="What is your vision for the future?"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Social Media Links */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Social Media & Website</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={editData.socialLinks.website || ""}
              onChange={(e) => onSocialLinksChange("website", e.target.value)}
              placeholder="https://your-website.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={editData.socialLinks.facebook || ""}
              onChange={(e) => onSocialLinksChange("facebook", e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter/X</Label>
            <Input
              id="twitter"
              value={editData.socialLinks.twitter || ""}
              onChange={(e) => onSocialLinksChange("twitter", e.target.value)}
              placeholder="https://twitter.com/youraccount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={editData.socialLinks.instagram || ""}
              onChange={(e) => onSocialLinksChange("instagram", e.target.value)}
              placeholder="https://instagram.com/youraccount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={editData.socialLinks.linkedin || ""}
              onChange={(e) => onSocialLinksChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Skills and Interests */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Skills & Interests</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={editData.skills.join(', ')}
              onChange={(e) => onSkillsChange(e.target.value)}
              placeholder="e.g., Moving Help, Tutoring, Pet Care"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input
              id="interests"
              value={editData.interests.join(', ')}
              onChange={(e) => onInterestsChange(e.target.value)}
              placeholder="e.g., Community Service, Technology"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEditForm;
