
import { useParams } from "react-router-dom";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import PublicProfileView from "@/components/profile/PublicProfileView";
import { useToast } from "@/hooks/use-toast";

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const { profileData, loading, error, canView } = usePublicProfile(userId || '');

  const handleMessage = () => {
    toast({
      title: "Messaging",
      description: "Opening chat...",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !canView) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || "Profile not accessible"}
            </h2>
            <p className="text-gray-600">
              This profile is private or you need to be connected to view it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Profile not found
            </h2>
            <p className="text-gray-600">
              The user profile you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PublicProfileView 
        profileData={profileData} 
        onMessage={handleMessage}
      />
    </div>
  );
};

export default PublicProfile;
