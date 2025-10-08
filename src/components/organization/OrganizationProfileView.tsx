import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building,
  MapPin,
  Calendar,
  Globe,
  Mail,
  Phone,
  Settings,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  Share2,
  Edit,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchOrganizationProfile } from '@/services/organizationProfileService';
import { supabase } from '@/integrations/supabase/client';
import OrganizationTrustScoreDisplay from './OrganizationTrustScoreDisplay';
import OrganizationImpactDashboard from './OrganizationImpactDashboard';
import OrganizationActivityFeed from './OrganizationActivityFeed';
import OrganizationTeamSection from './OrganizationTeamSection';
import OrganizationReviews from './OrganizationReviews';
import OrganizationFollowButton from './OrganizationFollowButton';
import { OrganizationProfileEditMode } from './OrganizationProfileEditMode';
import { fetchOrganizationTrustScore } from '@/services/organizationTrustScoreService';

interface OrganizationProfileViewProps {
  organizationId: string;
}

export const OrganizationProfileView = ({ organizationId }: OrganizationProfileViewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [impactMetrics, setImpactMetrics] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (organizationId) {
      loadAllData();
      checkAdminStatus();
    }
  }, [organizationId, user]);

  const loadAllData = async () => {
    if (!organizationId) return;
    
    try {
      setLoading(true);
      await Promise.all([
        loadOrganizationProfile(),
        loadTrustScore(),
        loadImpactMetrics(),
        loadActivities(),
        loadTeamMembers(),
        loadReviews(),
        loadVerifications(),
        loadFollowerCount(),
      ]);
    } catch (error) {
      console.error('Error loading organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizationProfile = async () => {
    if (!organizationId) return;
    const { data, error } = await fetchOrganizationProfile(organizationId);
    if (!error && data) setOrganization(data);
  };

  const loadTrustScore = async () => {
    if (!organizationId) return;
    const score = await fetchOrganizationTrustScore(organizationId);
    setTrustScore(score?.overall_score || null);
  };

  const loadImpactMetrics = async () => {
    if (!organizationId) return;
    const { data } = await supabase
      .from('organization_impact_metrics')
      .select('*')
      .eq('organization_id', organizationId)
      .single();
    setImpactMetrics(data);
  };

  const loadActivities = async () => {
    if (!organizationId) return;
    const { data } = await supabase
      .from('organization_activities')
      .select('*')
      .eq('organization_id', organizationId)
      .order('published_at', { ascending: false })
      .limit(10);
    setActivities(data || []);
  };

  const loadTeamMembers = async () => {
    if (!organizationId) return;
    const { data } = await supabase
      .from('organization_members')
      .select(`
        user_id,
        role,
        title,
        user:profiles!user_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .eq('is_public', true)
      .order('created_at', { ascending: true })
      .limit(6);
    setTeamMembers(data || []);
  };

  const loadReviews = async () => {
    if (!organizationId) return;
    const { data } = await supabase
      .from('organization_reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    setReviews(data || []);
    
    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setAverageRating(avg);
    }
  };

  const loadVerifications = async () => {
    if (!organizationId) return;
    const { data } = await supabase
      .from('organization_verifications')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'approved');
    setVerifications(data || []);
  };

  const loadFollowerCount = async () => {
    if (!organizationId) return;
    const { count } = await supabase
      .from('organization_followers')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);
    setFollowerCount(count || 0);
  };

  const checkAdminStatus = async () => {
    if (!user || !organizationId) return;
    
    const { data } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();
    
    setIsAdmin(data?.role === 'admin' || data?.role === 'owner');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    loadOrganizationProfile();
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-48 bg-muted rounded mb-4"></div>
          <div className="h-6 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!organization) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Organization Not Found</h2>
          <p className="text-muted-foreground">
            This organization doesn't exist or you don't have permission to view it.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show edit mode if editing
  if (isEditing) {
    return (
      <OrganizationProfileEditMode
        organization={organization}
        onSave={handleSaveProfile}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section with Banner */}
      <Card className="overflow-hidden">
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-[hsl(var(--soulve-teal))] to-[hsl(var(--soulve-blue))]">
          {organization.banner_url && (
            <img
              src={organization.banner_url}
              alt="Organization banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 -mt-12 md:-mt-20">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl">
              <AvatarImage src={organization.avatar_url} />
              <AvatarFallback className="text-2xl md:text-4xl bg-gradient-to-r from-[hsl(var(--soulve-teal))] to-[hsl(var(--soulve-blue))] text-white">
                {organization.name?.[0] || 'O'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 md:pt-8 w-full">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl md:text-3xl font-bold">
                        {organization.name}
                      </h1>
                      {verifications.length > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground capitalize">
                      {organization.organization_type?.replace('-', ' ')} • {organization.location}
                    </p>
                    {trustScore !== null && (
                      <OrganizationTrustScoreDisplay score={trustScore} size="md" />
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Admin Actions - Primary Row */}
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setIsEditing(true)}
                          size="sm"
                          variant="outline"
                          className="gap-2 flex-1 sm:flex-none"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </Button>
                        <Button
                          onClick={() => navigate(`/dashboard?tab=organisation-tools&org=${organizationId}`)}
                          size="sm"
                          className="gap-2 flex-1 sm:flex-none"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Manage</span>
                        </Button>
                      </div>
                    )}
                    
                    {/* Public Actions - Secondary Row */}
                    <div className="flex gap-2">
                      <OrganizationFollowButton
                        organizationId={organizationId}
                        followerCount={followerCount}
                        onFollowChange={loadFollowerCount}
                      />
                      <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {verifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {verifications.map((v) => (
                      <Badge key={v.id} variant="outline" className="text-xs">
                        {v.verification_type.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {impactMetrics && (
        <OrganizationImpactDashboard metrics={impactMetrics} />
      )}

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {(organization.description || organization.mission || organization.vision) && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">About</h2>
                    {organization.description && (
                      <div>
                        <h3 className="font-medium mb-1">Description</h3>
                        <p className="text-muted-foreground">{organization.description}</p>
                      </div>
                    )}
                    {organization.mission && (
                      <div>
                        <h3 className="font-medium mb-1">Mission</h3>
                        <p className="text-muted-foreground">{organization.mission}</p>
                      </div>
                    )}
                    {organization.vision && (
                      <div>
                        <h3 className="font-medium mb-1">Vision</h3>
                        <p className="text-muted-foreground">{organization.vision}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Details</h2>
                  {organization.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{organization.location}</p>
                      </div>
                    </div>
                  )}
                  {organization.established_year && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Established</p>
                        <p className="font-medium">{organization.established_year}</p>
                      </div>
                    </div>
                  )}
                  {organization.registration_number && (
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Registration Number</p>
                        <p className="font-mono text-sm">{organization.registration_number}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {(organization.website || organization.contact_email || organization.contact_phone) && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Contact</h2>
                    {organization.website && (
                      <a href={organization.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary hover:underline">
                        <Globe className="h-5 w-5" />
                        <span>Website</span>
                      </a>
                    )}
                    {organization.contact_email && (
                      <a href={`mailto:${organization.contact_email}`} className="flex items-center gap-3 text-primary hover:underline">
                        <Mail className="h-5 w-5" />
                        <span className="truncate">{organization.contact_email}</span>
                      </a>
                    )}
                    {organization.contact_phone && (
                      <a href={`tel:${organization.contact_phone}`} className="flex items-center gap-3 text-primary hover:underline">
                        <Phone className="h-5 w-5" />
                        <span>{organization.contact_phone}</span>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              {organization.social_links && Object.keys(organization.social_links).length > 0 && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Social Media</h2>
                    <div className="flex flex-wrap gap-3">
                      {organization.social_links.facebook && (
                        <a href={organization.social_links.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors">
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {organization.social_links.twitter && (
                        <a href={organization.social_links.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors">
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {organization.social_links.linkedin && (
                        <a href={organization.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {organization.social_links.instagram && (
                        <a href={organization.social_links.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors">
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <OrganizationActivityFeed activities={activities} />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <OrganizationTeamSection members={teamMembers} totalMembers={teamMembers.length} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <OrganizationReviews
            organizationId={organizationId}
            reviews={reviews}
            averageRating={averageRating}
            totalReviews={reviews.length}
            onReviewAdded={loadReviews}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
