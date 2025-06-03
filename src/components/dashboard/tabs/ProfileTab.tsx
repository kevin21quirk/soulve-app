
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '../UserProfile';

const ProfileTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <UserProfile />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
