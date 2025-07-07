import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Building, MapPin, Globe, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchOrganizations, joinOrganization } from "@/services/organizationService";

interface Organization {
  id: string;
  name: string;
  organization_type: string;
  location?: string;
  avatar_url?: string;
  description?: string;
  website?: string;
  contact_email?: string;
}

interface FindOrganizationsDialogProps {
  onOrganizationJoined?: () => void;
}

const FindOrganizationsDialog = ({ onOrganizationJoined }: FindOrganizationsDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchOrganizations(searchQuery);
      setOrganizations(results);
    } catch (error) {
      console.error('Error searching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to search organizations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrganization = async (orgId: string, orgName: string) => {
    setJoiningId(orgId);
    try {
      await joinOrganization(orgId, 'member');
      toast({
        title: "Success",
        description: `Successfully requested to join ${orgName}`
      });
      onOrganizationJoined?.();
      setOpen(false);
    } catch (error) {
      console.error('Error joining organization:', error);
      toast({
        title: "Error",
        description: "Failed to join organization",
        variant: "destructive"
      });
    } finally {
      setJoiningId(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'charity':
        return 'bg-red-100 text-red-800';
      case 'business':
        return 'bg-blue-100 text-blue-800';
      case 'government':
        return 'bg-purple-100 text-purple-800';
      case 'educational':
        return 'bg-green-100 text-green-800';
      case 'healthcare':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
          <Users className="h-4 w-4 mr-2" />
          Find Organizations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Find Organizations</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Section */}
          <div className="flex space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by organization name..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Results Section */}
          {organizations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Search Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizations.map((org) => (
                  <Card key={org.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg flex items-center justify-center">
                          {org.avatar_url ? (
                            <img
                              src={org.avatar_url}
                              alt={org.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building className="h-6 w-6 text-white" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{org.name}</h4>
                            <Badge className={getTypeColor(org.organization_type)}>
                              {org.organization_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          {org.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {org.description}
                            </p>
                          )}
                          
                          <div className="space-y-1">
                            {org.location && (
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {org.location}
                              </div>
                            )}
                            {org.website && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Globe className="h-3 w-3 mr-1" />
                                <a href={org.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  {org.website}
                                </a>
                              </div>
                            )}
                            {org.contact_email && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Mail className="h-3 w-3 mr-1" />
                                {org.contact_email}
                              </div>
                            )}
                          </div>
                          
                          <Button
                            onClick={() => handleJoinOrganization(org.id, org.name)}
                            disabled={joiningId === org.id}
                            className="mt-3 w-full"
                            size="sm"
                          >
                            {joiningId === org.id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Joining...
                              </>
                            ) : (
                              'Request to Join'
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {searchQuery && organizations.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No organizations found matching "{searchQuery}"</p>
              <p className="text-sm">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindOrganizationsDialog;