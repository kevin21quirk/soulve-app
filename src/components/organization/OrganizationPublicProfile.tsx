import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchOrganizationProfile } from '@/services/organizationProfileService';
import { supabase } from '@/integrations/supabase/client';
import { ProfileSwitcher } from '@/components/profile/ProfileSwitcher';

export const OrganizationPublicProfile = () => {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (organizationId) {
      loadOrganizationProfile();
      checkAdminStatus();
    }
  }, [organizationId, user]);

  const loadOrganizationProfile = async () => {
    if (!organizationId) return;
    
    try {
      setLoading(true);
      const { data, error } = await fetchOrganizationProfile(organizationId);
      
      if (error) {
        console.error('Error loading organization:', error);
      } else {
        setOrganization(data);
      }
    } catch (error) {
      console.error('Error loading organization:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Organization Not Found
            </h2>
            <p className="text-gray-600">
              This organization doesn't exist or you don't have permission to view it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Profile Switcher */}
      <div className="flex justify-end">
        <ProfileSwitcher currentView="organization" currentOrgId={organizationId} />
      </div>

      {/* Banner & Avatar Section */}
      <Card className="overflow-hidden">
        <div className="relative h-64 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe]">
          {organization.banner_url && (
            <img
              src={organization.banner_url}
              alt="Organization banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 md:-mt-20">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={organization.avatar_url} />
              <AvatarFallback className="text-4xl bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                {organization.name?.[0] || 'O'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 md:pt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {organization.name}
                    {organization.is_verified && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </h1>
                  <p className="text-gray-600 capitalize">
                    {organization.organization_type?.replace('-', ' ')}
                  </p>
                </div>
                
                {isAdmin && (
                  <Button
                    onClick={() => navigate(`/dashboard?tab=organizations&org=${organizationId}`)}
                    className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Organization
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          {(organization.description || organization.mission || organization.vision) && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">About</h2>
                
                {organization.description && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Description</h3>
                    <p className="text-gray-600">{organization.description}</p>
                  </div>
                )}
                
                {organization.mission && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Mission</h3>
                    <p className="text-gray-600">{organization.mission}</p>
                  </div>
                )}
                
                {organization.vision && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Vision</h3>
                    <p className="text-gray-600">{organization.vision}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Details</h2>
              
              {organization.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-gray-900">{organization.location}</p>
                  </div>
                </div>
              )}
              
              {organization.established_year && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Established</p>
                    <p className="text-gray-900">{organization.established_year}</p>
                  </div>
                </div>
              )}
              
              {organization.registration_number && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Registration Number</p>
                    <p className="text-gray-900 font-mono text-sm">
                      {organization.registration_number}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Card */}
          {(organization.website || organization.contact_email || organization.contact_phone) && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
                
                {organization.website && (
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                  >
                    <Globe className="h-5 w-5" />
                    <span>Website</span>
                  </a>
                )}
                
                {organization.contact_email && (
                  <a
                    href={`mailto:${organization.contact_email}`}
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="truncate">{organization.contact_email}</span>
                  </a>
                )}
                
                {organization.contact_phone && (
                  <a
                    href={`tel:${organization.contact_phone}`}
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{organization.contact_phone}</span>
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Social Links Card */}
          {organization.social_links && Object.keys(organization.social_links).length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Social Media</h2>
                
                <div className="flex flex-wrap gap-3">
                  {organization.social_links.facebook && (
                    <a
                      href={organization.social_links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  
                  {organization.social_links.twitter && (
                    <a
                      href={organization.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  
                  {organization.social_links.instagram && (
                    <a
                      href={organization.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  
                  {organization.social_links.linkedin && (
                    <a
                      href={organization.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationPublicProfile;
