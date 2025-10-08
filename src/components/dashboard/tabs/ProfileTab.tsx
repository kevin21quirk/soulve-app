import { useSearchParams } from "react-router-dom";
import UserProfile from "../UserProfile";
import { OrganizationProfileView } from "@/components/organization/OrganizationProfileView";

const ProfileTab = () => {
  const [searchParams] = useSearchParams();
  const context = searchParams.get('context');
  const orgId = searchParams.get('orgId');

  // If viewing organization context, show organization profile
  if (context === 'org' && orgId) {
    return (
      <div className="space-y-6">
        <OrganizationProfileView organizationId={orgId} />
      </div>
    );
  }

  // Otherwise show user profile
  return (
    <div className="space-y-6">
      {/* Enhanced Profile Content */}
      <UserProfile />
    </div>
  );
};

export default ProfileTab;
