
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Users, Settings, Plus, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserOrganizations } from "@/services/organizationService";
import OrganizationDashboard from "@/components/organization/OrganizationDashboard";
import CharityToolsDashboard from "@/components/organization/CharityToolsDashboard";
import BusinessToolsDashboard from "@/components/organization/BusinessToolsDashboard";
import CreateOrganizationDialog from "@/components/organization/CreateOrganizationDialog";
import FindOrganizationsDialog from "@/components/organization/FindOrganizationsDialog";
import JoinOrganizationDialog from "@/components/organization/JoinOrganizationDialog";
import ESGDashboard from "@/components/dashboard/esg/ESGDashboard";
import BusinessCSRManagement from "@/components/organization/BusinessCSRManagement";
import TeamManagement from "@/components/organization/TeamManagement";
import DonorManagement from "@/components/organization/DonorManagement";
import VolunteerManagement from "@/components/organization/VolunteerManagement";
import GrantManagement from "@/components/organization/GrantManagement";
import PublicEngagement from "@/components/organization/PublicEngagement";
import PolicyTracking from "@/components/organization/PolicyTracking";
import CitizenServices from "@/components/organization/CitizenServices";
import CommunityManagement from "@/components/organization/CommunityManagement";

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
  const [selectedToolCategory, setSelectedToolCategory] = useState<string | null>(null);
  const [selectedBusinessTool, setSelectedBusinessTool] = useState<'esg' | 'csr'>('esg');
  const [selectedCharityTool, setSelectedCharityTool] = useState<'team' | 'donors' | 'volunteers' | 'grants'>('team');
  const [selectedCivicTool, setSelectedCivicTool] = useState<'engagement' | 'policy' | 'services' | 'community'>('engagement');

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

  // If a tool category is selected, show the tools view
  if (selectedToolCategory) {
    // Business Tools - Show mini-dashboard with ESG and CSR
    if (selectedToolCategory === 'business') {
      return (
        <div className="space-y-6">
          <Button
            variant="outline"
            onClick={() => setSelectedToolCategory(null)}
            size="sm"
            className="border-soulve-teal text-soulve-teal hover:bg-soulve-teal/10"
          >
            ← Back to Organisation Tools
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant={selectedBusinessTool === 'esg' ? undefined : 'outline'}
              onClick={() => setSelectedBusinessTool('esg')}
              className={selectedBusinessTool === 'esg' 
                ? 'bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none'
                : 'border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10'
              }
            >
              ESG Dashboard
            </Button>
            <Button
              variant={selectedBusinessTool === 'csr' ? undefined : 'outline'}
              onClick={() => setSelectedBusinessTool('csr')}
              className={selectedBusinessTool === 'csr' 
                ? 'bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none'
                : 'border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10'
              }
            >
              CSR Management
            </Button>
          </div>

          {selectedBusinessTool === 'esg' && (
            <ESGDashboard organizations={organizations} />
          )}
          
          {selectedBusinessTool === 'csr' && organizations.length > 0 && (
            <BusinessCSRManagement organizationId={organizations[0].organizationId} />
          )}
          
          {selectedBusinessTool === 'csr' && organizations.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Organizations Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create or join an organization to access CSR Management tools.
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
    }

    // Charity Tools - Show mini-dashboard with Team, Donors, Volunteers, Grants
    if (selectedToolCategory === 'charity') {
      return (
        <div className="space-y-6">
          <Button
            variant="outline"
            onClick={() => setSelectedToolCategory(null)}
            size="sm"
            className="border-soulve-teal text-soulve-teal hover:bg-soulve-teal/10"
          >
            ← Back to Organisation Tools
          </Button>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCharityTool === 'team' ? undefined : 'outline'}
              onClick={() => setSelectedCharityTool('team')}
              className={selectedCharityTool === 'team'
                ? 'bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none'
                : 'border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10'
              }
            >
              Team Management
            </Button>
            <Button
              variant={selectedCharityTool === 'donors' ? undefined : 'outline'}
              onClick={() => setSelectedCharityTool('donors')}
              className={selectedCharityTool === 'donors'
                ? 'bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none'
                : 'border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10'
              }
            >
              Donor Management
            </Button>
            <Button
              variant={selectedCharityTool === 'volunteers' ? undefined : 'outline'}
              onClick={() => setSelectedCharityTool('volunteers')}
              className={selectedCharityTool === 'volunteers'
                ? 'bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none'
                : 'border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10'
              }
            >
              Volunteer Management
            </Button>
            <Button
              variant={selectedCharityTool === 'grants' ? undefined : 'outline'}
              onClick={() => setSelectedCharityTool('grants')}
              className={selectedCharityTool === 'grants'
                ? 'bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none'
                : 'border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10'
              }
            >
              Grant Management
            </Button>
          </div>

          {organizations.length > 0 ? (
            <>
              {selectedCharityTool === 'team' && (
                <TeamManagement organizationId={organizations[0].organizationId} />
              )}
              
              {selectedCharityTool === 'donors' && (
                <DonorManagement organizationId={organizations[0].organizationId} />
              )}
              
              {selectedCharityTool === 'volunteers' && (
                <VolunteerManagement organizationId={organizations[0].organizationId} />
              )}
              
              {selectedCharityTool === 'grants' && (
                <GrantManagement organizationId={organizations[0].organizationId} />
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Organizations Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create or join a charity organization to access these management tools.
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
    }

    // Civic Tools - Show mini-dashboard with Engagement, Policy, Services, Community
    if (selectedToolCategory === 'civic') {
      return (
        <div className="space-y-6">
          <Button
            variant="outline"
            onClick={() => setSelectedToolCategory(null)}
            size="sm"
            className="border-soulve-teal text-soulve-teal hover:bg-soulve-teal/10"
          >
            ← Back to Organisation Tools
          </Button>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCivicTool === 'engagement' ? undefined : 'outline'}
              onClick={() => setSelectedCivicTool('engagement')}
              className={selectedCivicTool === 'engagement'
                ? 'bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none'
                : 'border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10'
              }
            >
              Public Engagement
            </Button>
            <Button
              variant={selectedCivicTool === 'policy' ? undefined : 'outline'}
              onClick={() => setSelectedCivicTool('policy')}
              className={selectedCivicTool === 'policy'
                ? 'bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none'
                : 'border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10'
              }
            >
              Policy Tracking
            </Button>
            <Button
              variant={selectedCivicTool === 'services' ? undefined : 'outline'}
              onClick={() => setSelectedCivicTool('services')}
              className={selectedCivicTool === 'services'
                ? 'bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none'
                : 'border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10'
              }
            >
              Citizen Services
            </Button>
            <Button
              variant={selectedCivicTool === 'community' ? undefined : 'outline'}
              onClick={() => setSelectedCivicTool('community')}
              className={selectedCivicTool === 'community'
                ? 'bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none'
                : 'border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10'
              }
            >
              Community Management
            </Button>
          </div>

          {organizations.length > 0 ? (
            <>
              {selectedCivicTool === 'engagement' && (
                <PublicEngagement organizationId={organizations[0].organizationId} />
              )}
              
              {selectedCivicTool === 'policy' && (
                <PolicyTracking organizationId={organizations[0].organizationId} />
              )}
              
              {selectedCivicTool === 'services' && (
                <CitizenServices organizationId={organizations[0].organizationId} />
              )}
              
              {selectedCivicTool === 'community' && (
                <CommunityManagement organizationId={organizations[0].organizationId} />
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Organizations Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create or join a civic organization to access these management tools.
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
    }

    // For other categories (fallback)
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => setSelectedToolCategory(null)}
          size="sm"
          className="border-soulve-teal text-soulve-teal hover:bg-soulve-teal/10"
        >
          ← Back to Organisation Tools
        </Button>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Organisation Tools
          </h2>
          <p className="text-gray-600">
            Select an organization to manage
          </p>
        </div>

        {/* Tool-specific Organizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {organizations.map((orgMembership) => (
              <Card
                key={orgMembership.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedOrg(orgMembership.organizationId);
                }}
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
                        <span>Click to access tools</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          
          {organizations.length === 0 && (
            <Card className="lg:col-span-2">
              <CardContent className="p-8 text-center">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Organizations Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create or join a {selectedToolCategory} organization to access these tools.
                </p>
                <div className="flex justify-center space-x-3">
                  <CreateOrganizationDialog onOrganizationCreated={loadUserOrganizations} />
                  <FindOrganizationsDialog onOrganizationJoined={loadUserOrganizations} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
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
              onClick={() => {
                setSelectedOrg(null);
                setSelectedToolCategory(null);
              }}
              size="sm"
              className="border-soulve-teal text-soulve-teal hover:bg-soulve-teal/10"
            >
              ← Back to {selectedToolCategory ? `${selectedToolCategory.charAt(0).toUpperCase() + selectedToolCategory.slice(1)} Tools` : 'Organisation Tools'}
            </Button>
          </div>
          
          {/* Render category-specific dashboard if coming from tool category */}
          {selectedToolCategory === 'charity' ? (
            <CharityToolsDashboard
              organizationId={selectedOrg}
              organizationName={selectedOrgData.organizationName}
            />
          ) : selectedToolCategory === 'business' ? (
            <BusinessToolsDashboard
              organizationId={selectedOrg}
              organizationName={selectedOrgData.organizationName}
            />
          ) : (
            <OrganizationDashboard
              organizationId={selectedOrg}
              organizationName={selectedOrgData.organizationName}
            />
          )}
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
        <Card 
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => setSelectedToolCategory('charity')}
        >
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

        <Card 
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => setSelectedToolCategory('business')}
        >
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

        <Card 
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => setSelectedToolCategory('civic')}
        >
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
