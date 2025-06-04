
import { UserProfileData } from "./UserProfileTypes";
import UserProfileDisplay from "./UserProfileDisplay";

interface UserProfileDetailsProps {
  profileData: UserProfileData;
}

const UserProfileDetails = ({ profileData }: UserProfileDetailsProps) => {
  return <UserProfileDisplay profileData={profileData} />;
};

export default UserProfileDetails;
