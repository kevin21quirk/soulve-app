import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfileData } from "./UserProfileTypes";
import UserProfileTabs from "./UserProfileTabs";
import UserProfilePointsDetails from "./UserProfilePointsDetails";
import ProfileManagementTabs from "../profile/ProfileManagementTabs";
import UserPostsTimeline from "./profile/UserPostsTimeline";
import RealImpactJourney from "./profile/RealImpactJourney";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileNavBar from "./profile/ProfileNavBar";
import { useQuery } from "@tanstack/react-query";

const UserProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profileData, loading, updating, error, updateProfile } = useUserProfile();
  const [showPointsDetails, setShowPointsDetails] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  // Fetch ESG score
  const { data: esgData } = useQuery({
    queryKey: ['esg-score', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id);
      
      if (!data?.length) return { avgScore: 0 };
      
      const orgIds = data.map(m => m.organization_id);
      const { data: scores } = await supabase
        .from('organization_trust_scores')
        .select('esg_score')
        .in('organization_id', orgIds);
      
      const avgScore = scores?.length 
        ? Math.round(scores.reduce((sum, s) => sum + (s.esg_score || 0), 0) / scores.length)
        : 0;
      
      return { avgScore };
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) {
        console.log('[ADMIN CHECK] No user ID, skipping admin check');
        return;
      }
      console.log('[ADMIN CHECK] Checking admin status for user:', user.id);
      const { data, error } = await supabase.rpc('is_admin', { user_uuid: user.id });
      console.log('[ADMIN CHECK] RPC result:', { data, error });
      if (!error && data === true) {
        console.log('[ADMIN CHECK] User is admin, setting isAdmin to true');
        setIsAdmin(true);
      } else {
        console.log('[ADMIN CHECK] User is NOT admin or error occurred');
      }
    };
    checkAdmin();
  }, [user?.id]);

  const handleViewPointsDetails = () => {
    setShowPointsDetails(true);
    toast({
      title: "Points Breakdown",
      description: "Viewing detailed points and trust score breakdown...",
    });
  };

  const handleProfileUpdate = async (updatedData: UserProfileData) => {
    try {
      await updateProfile(updatedData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClosePointsDetails = () => {
    setShowPointsDetails(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load profile data</p>
          <p className="text-muted-foreground text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'posts':
        return <UserPostsTimeline />;
      case 'impact':
        return <RealImpactJourney />;
      case 'settings':
        return (
          <ProfileManagementTabs
            profileData={profileData}
            onProfileUpdate={handleProfileUpdate}
          />
        );
      default:
        return (
          <UserProfileTabs
            profileData={profileData}
            onProfileUpdate={handleProfileUpdate}
            onViewPointsDetails={handleViewPointsDetails}
            onPostsClick={() => setActiveSection('posts')}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {updating && (
        <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm z-50">
          Updating profile...
        </div>
      )}

      {/* Unified Navigation Bar */}
      <ProfileNavBar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isAdmin={isAdmin}
        esgScore={esgData?.avgScore}
      />

      {/* Content Section */}
      <div className="mt-4">
        {renderContent()}
      </div>

      <UserProfilePointsDetails
        profileData={profileData}
        showPointsDetails={showPointsDetails}
        onClose={handleClosePointsDetails}
      />
    </div>
  );
};

export default UserProfile;
