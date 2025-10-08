import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Globe, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface OrganizationData {
  description?: string;
  mission?: string;
  vision?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  location?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  tags?: string[];
}

interface OrganizationProfileDetailsProps {
  organization: OrganizationData;
}

const OrganizationProfileDetails = ({ organization }: OrganizationProfileDetailsProps) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const formatUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="space-y-6">
      {/* About Section */}
      {organization.description && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{organization.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Mission & Vision */}
      {(organization.mission || organization.vision) && (
        <Card>
          <CardHeader>
            <CardTitle>Mission & Vision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {organization.mission && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Mission</h4>
                <p className="text-gray-700">{organization.mission}</p>
              </div>
            )}
            {organization.vision && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Vision</h4>
                <p className="text-gray-700">{organization.vision}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      {(organization.contact_email || organization.contact_phone || organization.website) && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {organization.contact_email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <a 
                  href={`mailto:${organization.contact_email}`}
                  className="text-blue-600 hover:underline"
                >
                  {organization.contact_email}
                </a>
              </div>
            )}
            {organization.contact_phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <a 
                  href={`tel:${organization.contact_phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {organization.contact_phone}
                </a>
              </div>
            )}
            {organization.website && (
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <a 
                  href={formatUrl(organization.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {organization.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Social Media Links */}
      {organization.social_links && Object.keys(organization.social_links).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(organization.social_links).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={formatUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {getSocialIcon(platform)}
                    <span className="capitalize">{platform}</span>
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags/Categories */}
      {organization.tags && organization.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {organization.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrganizationProfileDetails;
