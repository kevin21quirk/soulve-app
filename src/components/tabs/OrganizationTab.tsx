
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Users, Settings, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import OrganizationDashboard from "@/components/organization/OrganizationDashboard";

interface UserOrganization {
  id: string;
  organization_id: string;
  organization: {
    id: string;
    name: string;
    organization_type: string;
    description?: string;
    avatar_url?: string;
  };
  role: string;
  title?: string;
  is_active: boolean;
}

const OrganizationTab = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserOrganizations();
    }
  }, [user]);

  const loadUserOrganizations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          organization_id,
          role,
          title,
          is_active,
          organization:organizations(
            id,
            name,
            organization_type,
            description,
            avatar_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'staff':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrgTypeIcon = (type: string) => {
    return <Building className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // If an organization is selected, show its dashboard
  if (selectedOrg) {
    const selectedOrgData = organizations.find(org => org.organization_id === selectedOrg);
    if (selectedOrgData) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setSelectedOrg(null)}
              size="sm"
            >
              ← Back to Organizations
            </Button>
          </div>
          <OrganizationDashboard
            organizationId={selectedOrg}
            organizationName={selectedOrgData.organization.name}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Organizations</h2>
          <p className="text-gray-600">
            Organizations you're part of and manage
          </p>
        </div>
        <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Join Organization
        </Button>
      </div>

      {/* Organizations List */}
      {organizations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {organizations.map((orgMembership) => (
            <Card
              key={orgMembership.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedOrg(orgMembership.organization_id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg flex items-center justify-center">
                    {orgMembership.organization.avatar_url ? (
                      <img
                        src={orgMembership.organization.avatar_url}
                        alt={orgMembership.organization.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Building className="h-6 w-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {orgMembership.organization.name}
                      </h3>
                      <Badge className={getRoleColor(orgMembership.role)}>
                        {orgMembership.role}
                      </Badge>
                    </div>
                    
                    {orgMembership.title && (
                      <p className="text-sm text-gray-600 mb-2">
                        {orgMembership.title}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {getOrgTypeIcon(orgMembership.organization.organization_type)}
                      <span className="capitalize">
                        {orgMembership.organization.organization_type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {orgMembership.organization.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {orgMembership.organization.description}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrg(orgMembership.organization_id);
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Organizations Yet
            </h3>
            <p className="text-gray-600 mb-4">
              You're not currently part of any organizations. Join or create one to get started.
            </p>
            <div className="flex justify-center space-x-3">
              <Button variant="outline">
                <Building className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
              <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                <Users className="h-4 w-4 mr-2" />
                Find Organizations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrganizationTab;
