import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import EnhancedLoadingState from "@/components/ui/EnhancedLoadingState";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import UserProfileDisplay from "@/components/dashboard/UserProfileDisplay";

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profileData, loading, error, canView } = usePublicProfile(userId || '');

  // If viewing own profile, redirect to dashboard with profile tab
  useEffect(() => {
    if (user?.id && userId && user.id === userId) {
      navigate('/dashboard?tab=profile', { replace: true });
    }
  }, [user?.id, userId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EnhancedLoadingState message="Loading profile..." />
      </div>
    );
  }

  if (error || !canView) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {error ? 'Profile Not Found' : 'Private Profile'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {error || 'This profile is private. Connect with this user to view their profile.'}
            </p>
            <Button onClick={() => navigate('/')}>
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
            <p className="text-muted-foreground mb-4">
              This user profile doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')}>
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Full Profile Display */}
        <UserProfileDisplay profileData={profileData} />

        {/* Message Button - Only show for other users */}
        {user && user.id !== profileData.id && (
          <div className="mt-6">
            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={() => navigate(`/?tab=messages&userId=${profileData.id}`)}
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
