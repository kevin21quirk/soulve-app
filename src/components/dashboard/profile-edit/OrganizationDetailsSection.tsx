
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfileData } from "../UserProfileTypes";

interface OrganizationDetailsSectionProps {
  editData: UserProfileData;
  onOrganizationInfoChange: (field: string, value: string) => void;
}

const OrganizationDetailsSection = ({ 
  editData, 
  onOrganizationInfoChange 
}: OrganizationDetailsSectionProps) => {
  return (
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
  );
};

export default OrganizationDetailsSection;
