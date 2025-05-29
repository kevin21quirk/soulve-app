
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfileData } from "../UserProfileTypes";

interface SocialMediaSectionProps {
  editData: UserProfileData;
  onSocialLinksChange: (field: string, value: string) => void;
}

const SocialMediaSection = ({ 
  editData, 
  onSocialLinksChange 
}: SocialMediaSectionProps) => {
  return (
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
  );
};

export default SocialMediaSection;
