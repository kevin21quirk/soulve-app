import { CardContent } from "@/components/ui/card";
import OrganizationProfileBanner from "./OrganizationProfileBanner";
import OrganizationProfileHeader from "./OrganizationProfileHeader";
import OrganizationProfileDetails from "./OrganizationProfileDetails";

interface OrganizationData {
  id: string;
  name: string;
  organization_type?: string;
  description?: string;
  mission?: string;
  vision?: string;
  website?: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
  established_year?: number;
  registration_number?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  tags?: string[];
  avatar_url?: string;
  banner_url?: string;
  created_at: string;
  trust_score?: number;
  follower_count?: number;
  member_count?: number;
  post_count?: number;
  is_verified?: boolean;
}

interface OrganizationProfileDisplayModeProps {
  organization: OrganizationData;
  isFollowing?: boolean;
  isMember?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onJoin?: () => void;
  onShare?: () => void;
}

const OrganizationProfileDisplayMode = ({
  organization,
  isFollowing,
  isMember,
  onFollow,
  onMessage,
  onJoin,
  onShare,
}: OrganizationProfileDisplayModeProps) => {
  return (
    <CardContent className="p-0">
      {/* Banner + Header with overlap */}
      <div className="relative">
        <OrganizationProfileBanner
          banner={organization.banner_url || null}
          isEditing={false}
        />
        
        <OrganizationProfileHeader 
          organization={organization}
          isEditing={false}
          isFollowing={isFollowing}
          isMember={isMember}
          onFollow={onFollow}
          onMessage={onMessage}
          onJoin={onJoin}
          onShare={onShare}
        />
      </div>
      
      {/* Details sections with spacing */}
      <div className="px-6 space-y-6 pb-6">
        <OrganizationProfileDetails organization={organization} />
      </div>
    </CardContent>
  );
};

export default OrganizationProfileDisplayMode;
