
import { UserProfileData } from "./UserProfileTypes";
import UserProfileDisplay from "./UserProfileDisplay";

interface UserProfileDetailsProps {
  profileData: UserProfileData;
  onPostsClick?: () => void;
}

const UserProfileDetails = ({ profileData, onPostsClick }: UserProfileDetailsProps) => {
  return <UserProfileDisplay profileData={profileData} onPostsClick={onPostsClick} />;
};

export default UserProfileDetails;
