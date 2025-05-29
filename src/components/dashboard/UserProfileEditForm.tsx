
import { Separator } from "@/components/ui/separator";
import { UserProfileData } from "./UserProfileTypes";
import BasicInformationSection from "./profile-edit/BasicInformationSection";
import OrganizationDetailsSection from "./profile-edit/OrganizationDetailsSection";
import SocialMediaSection from "./profile-edit/SocialMediaSection";
import SkillsInterestsSection from "./profile-edit/SkillsInterestsSection";

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
      <BasicInformationSection 
        editData={editData}
        onInputChange={onInputChange}
      />

      <Separator />

      <OrganizationDetailsSection
        editData={editData}
        onOrganizationInfoChange={onOrganizationInfoChange}
      />

      <Separator />

      <SocialMediaSection
        editData={editData}
        onSocialLinksChange={onSocialLinksChange}
      />

      <Separator />

      <SkillsInterestsSection
        editData={editData}
        onSkillsChange={onSkillsChange}
        onInterestsChange={onInterestsChange}
      />
    </div>
  );
};

export default UserProfileEditForm;
