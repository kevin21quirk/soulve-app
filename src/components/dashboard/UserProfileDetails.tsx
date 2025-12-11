import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, Target, Eye } from "lucide-react";
import { UserProfileData } from "./UserProfileTypes";

interface UserProfileDetailsProps {
  profileData: UserProfileData;
  onPostsClick?: () => void;
}

const UserProfileDetails = ({ profileData }: UserProfileDetailsProps) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'website': return <Globe className="h-4 w-4" />;
      case 'facebook': return <div className="h-4 w-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">f</div>;
      case 'twitter': return <div className="h-4 w-4 bg-blue-400 rounded text-white text-xs flex items-center justify-center">X</div>;
      case 'instagram': return <div className="h-4 w-4 bg-pink-500 rounded text-white text-xs flex items-center justify-center">IG</div>;
      case 'linkedin': return <div className="h-4 w-4 bg-blue-700 rounded text-white text-xs flex items-center justify-center">in</div>;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const formatUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const hasSocialLinks = Object.values(profileData.socialLinks).some(link => link);
  const hasOrgInfo = profileData.organizationInfo.organizationType && 
                     profileData.organizationInfo.organizationType !== 'individual';

  return (
    <div className="space-y-4">
      {/* Bio */}
      {profileData.bio && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">About</h4>
          <p className="text-foreground leading-relaxed">{profileData.bio}</p>
        </div>
      )}

      {/* Skills & Interests Combined */}
      {(profileData.skills.length > 0 || profileData.interests.length > 0) && (
        <div className="flex flex-wrap gap-4">
          {profileData.skills.length > 0 && (
            <div className="flex-1 min-w-[200px]">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {profileData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {profileData.interests.length > 0 && (
            <div className="flex-1 min-w-[200px]">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Interests</h4>
              <div className="flex flex-wrap gap-1.5">
                {profileData.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact & Social - Compact Row */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {profileData.email && (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {profileData.email}
          </span>
        )}
        {profileData.phone && (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Phone className="h-4 w-4" />
            {profileData.phone}
          </span>
        )}
        {hasSocialLinks && (
          <div className="flex gap-1.5">
            {Object.entries(profileData.socialLinks).map(([platform, url]) => {
              if (!url) return null;
              return (
                <Button
                  key={platform}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
                >
                  <a href={formatUrl(url)} target="_blank" rel="noopener noreferrer">
                    {getSocialIcon(platform)}
                  </a>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Organisation Info - Only if applicable */}
      {hasOrgInfo && (
        <div className="pt-2 border-t">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Organisation</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize text-xs">
                {profileData.organizationInfo.organizationType?.replace('-', ' ')}
              </Badge>
              {profileData.organizationInfo.establishedYear && (
                <span className="text-muted-foreground">Est. {profileData.organizationInfo.establishedYear}</span>
              )}
              {profileData.organizationInfo.registrationNumber && (
                <span className="text-muted-foreground">Reg: {profileData.organizationInfo.registrationNumber}</span>
              )}
            </div>
            {profileData.organizationInfo.mission && (
              <p className="text-muted-foreground flex items-start gap-2">
                <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {profileData.organizationInfo.mission}
              </p>
            )}
            {profileData.organizationInfo.vision && (
              <p className="text-muted-foreground flex items-start gap-2">
                <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {profileData.organizationInfo.vision}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDetails;

