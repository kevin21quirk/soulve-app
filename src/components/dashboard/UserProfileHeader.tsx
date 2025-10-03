import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Award, TrendingUp, Shield } from "lucide-react";
import { UserProfileData } from "./UserProfileTypes";
import { getTrustScoreColor } from "@/utils/trustScoreUtils";
import AvatarUpload from "./AvatarUpload";
import VerificationBadges from "./verification/VerificationBadges";
import { useVerifications } from "@/hooks/useVerifications";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfileHeaderProps {
  profileData: UserProfileData;
  isEditing: boolean;
  onViewPointsDetails?: () => void;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
}

const UserProfileHeader = ({ 
  profileData, 
  isEditing, 
  onViewPointsDetails,
  onAvatarUpdate 
}: UserProfileHeaderProps) => {
  const { verifications, trustScore } = useVerifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is viewing their own profile and is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      setIsAdmin(!!data);
    };
    
    checkAdminStatus();
  }, [user?.id]);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
      <AvatarUpload
        currentAvatar={profileData.avatar}
        userName={profileData.name}
        onAvatarUpdate={onAvatarUpdate || (() => {})}
        isEditing={isEditing}
      />
      
      <div className="flex-1 space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{profileData.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {profileData.joinDate}</span>
            </div>
          </div>
        </div>
        
        {/* Verification Badges */}
        <VerificationBadges verifications={verifications} size="sm" />
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            className={`${getTrustScoreColor(trustScore || profileData.trustScore)} cursor-pointer hover:scale-105 transition-transform`}
            onClick={onViewPointsDetails}
            disabled={isEditing}
          >
            <Award className="h-4 w-4 mr-1" />
            {trustScore || profileData.trustScore}% Trust Score
            {!isEditing && <TrendingUp className="h-3 w-3 ml-1" />}
          </Button>
          
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Users className="h-3 w-3 mr-1" />
            {profileData.helpCount} people helped
          </Badge>

          {isAdmin && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:opacity-90 transition-opacity"
              onClick={() => navigate('/admin')}
            >
              <Shield className="h-4 w-4 mr-1" />
              Admin Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
