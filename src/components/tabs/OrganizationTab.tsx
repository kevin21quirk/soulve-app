
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Users, Settings, Plus, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserOrganizations } from "@/services/organizationService";
import OrganizationDashboard from "@/components/organization/OrganizationDashboard";
import CreateOrganizationDialog from "@/components/organization/CreateOrganizationDialog";
import FindOrganizationsDialog from "@/components/organization/FindOrganizationsDialog";
import JoinOrganizationDialog from "@/components/organization/JoinOrganizationDialog";

interface UserOrganization {
  id: string;
  organizationId: string;
  organizationName: string;
  role: string;
  title?: string;
  isCurrent: boolean;
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
    if (!user) return;
    
    try {
      setLoading(true);
      const orgs = await fetchUserOrganizations(user.id);
      setOrganizations(orgs);
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
    const selectedOrgData = organizations.find(org => org.organizationId === selectedOrg);
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
            organizationName={selectedOrgData.organizationName}
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
          <h2 className="text-2xl font-bold text-gray-900">Organisation Tools</h2>
          <p className="text-gray-600">
            Comprehensive tools for charities, businesses, and civic organisations
          </p>
        </div>
      </div>

      {/* Tool Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Charity Tools</h3>
                <p className="text-sm text-gray-600">NGOs & Nonprofits</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Volunteer management, donor tracking, grant management, and fundraising analytics for charitable organizations.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">Volunteers</Badge>
              <Badge variant="secondary" className="text-xs">Donors</Badge>
              <Badge variant="secondary" className="text-xs">Grants</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Business Tools</h3>
                <p className="text-sm text-gray-600">Corporate & SMEs</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              ESG reporting, product management, employee engagement, CSR programs, and partnership management for businesses.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">ESG</Badge>
              <Badge variant="secondary" className="text-xs">CSR</Badge>
              <Badge variant="secondary" className="text-xs">Products</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Civic Tools</h3>
                <p className="text-sm text-gray-600">Councils & MPs</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Public engagement, policy tracking, citizen services, and community management for civic leaders.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">Engagement</Badge>
              <Badge variant="secondary" className="text-xs">Policy</Badge>
              <Badge variant="secondary" className="text-xs">Services</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Organizations Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">My Organisations</h3>
          <p className="text-gray-600">
            Organisations you're part of and manage
          </p>
        </div>
        <JoinOrganizationDialog onOrganizationJoined={loadUserOrganizations} />
      </div>

      {/* Organizations List */}
      {organizations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {organizations.map((orgMembership) => (
            <Card
              key={orgMembership.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedOrg(orgMembership.organizationId)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {orgMembership.organizationName}
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
                      <Building className="h-4 w-4" />
                      <span>Organization</span>
                      {orgMembership.isCurrent && (
                        <Badge variant="secondary" className="text-xs">Current</Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrg(orgMembership.organizationId);
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
              <CreateOrganizationDialog onOrganizationCreated={loadUserOrganizations} />
              <FindOrganizationsDialog onOrganizationJoined={loadUserOrganizations} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrganizationTab;
