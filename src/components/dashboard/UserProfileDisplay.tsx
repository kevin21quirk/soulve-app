
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { UserProfileData } from "./UserProfileTypes";

interface UserProfileDisplayProps {
  profileData: UserProfileData;
}

const UserProfileDisplay = ({ profileData }: UserProfileDisplayProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Mail className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">Email</p>
            <p className="text-sm text-gray-600">{profileData.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Phone className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">Phone</p>
            <p className="text-sm text-gray-600">{profileData.phone}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
        <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profileData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {profileData.interests.map((interest, index) => (
            <Badge key={index} variant="outline" className="px-3 py-1">
              {interest}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserProfileDisplay;
