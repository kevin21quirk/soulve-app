import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import EnhancedLoadingState from "@/components/ui/EnhancedLoadingState";
import { format } from "date-fns";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  created_at: string;
  total_impact_points?: number;
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

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

  if (!profile) {
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

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous User';
  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-start space-x-6 mb-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={profile.avatar_url} alt={fullName} />
                <AvatarFallback className="text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{fullName}</h1>
                
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
                  </div>
                  {profile.total_impact_points !== undefined && (
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {profile.total_impact_points} Impact Points
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-foreground mb-4">{profile.bio}</p>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Message Button */}
            {user && user.id !== profile.id && (
              <div className="pt-4 border-t">
                <Button
                  onClick={() => navigate(`/?tab=messages&userId=${profile.id}`)}
                  className="w-full sm:w-auto"
                >
                  Send Message
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicProfile;
