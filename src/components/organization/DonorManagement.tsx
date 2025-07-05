
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  Search, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Users,
  Mail,
  Phone,
  Calendar,
  Filter,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DonorManagementService, Donor } from "@/services/donorManagementService";

interface DonorManagementProps {
  organizationId: string;
}

const DonorManagement = ({ organizationId }: DonorManagementProps) => {
  const { toast } = useToast();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  
  const [newDonor, setNewDonor] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    donor_type: 'individual',
    preferred_contact_method: 'email',
    notes: ''
  });

  useEffect(() => {
    loadDonorData();
  }, [organizationId]);

  useEffect(() => {
    filterDonors();
  }, [donors, searchQuery, selectedSegment]);

  const loadDonorData = async () => {
    try {
      setLoading(true);
      const [donorList, donorAnalytics] = await Promise.all([
        DonorManagementService.getDonors(organizationId),
        DonorManagementService.getDonorAnalytics(organizationId)
      ]);
      
      setDonors(donorList);
      setAnalytics(donorAnalytics);
    } catch (error) {
      console.error('Error loading donor data:', error);
      toast({
        title: "Error",
        description: "Failed to load donor data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDonors = async () => {
    let filtered = donors;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(donor =>
        donor.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by segment
    if (selectedSegment !== "all") {
      try {
        const segmentDonors = await DonorManagementService.getDonorsBySegment(organizationId, selectedSegment);
        const segmentIds = new Set(segmentDonors.map(d => d.id));
        filtered = filtered.filter(donor => segmentIds.has(donor.id));
      } catch (error) {
        console.error('Error filtering by segment:', error);
      }
    }

    setFilteredDonors(filtered);
  };

  const handleAddDonor = async () => {
    if (!newDonor.email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await DonorManagementService.createDonor(organizationId, newDonor);
      
      toast({
        title: "Donor Added",
        description: "New donor has been added successfully",
      });

      setNewDonor({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        donor_type: 'individual',
        preferred_contact_method: 'email',
        notes: ''
      });
      setShowAddDialog(false);
      loadDonorData();
    } catch (error) {
      console.error('Error adding donor:', error);
      toast({
        title: "Error",
        description: "Failed to add donor",
        variant: "destructive"
      });
    }
  };

  const getDonorTier = (totalDonated: number) => {
    if (totalDonated >= 10000) return { label: 'Platinum', color: 'bg-purple-100 text-purple-800' };
    if (totalDonated >= 5000) return { label: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    if (totalDonated >= 1000) return { label: 'Silver', color: 'bg-gray-100 text-gray-800' };
    return { label: 'Bronze', color: 'bg-orange-100 text-orange-800' };
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Donor Management</h2>
          <p className="text-gray-600">Manage and engage with your donors</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Donor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Donor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={newDonor.first_name}
                    onChange={(e) => setNewDonor(prev => ({ ...prev, first_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={newDonor.last_name}
                    onChange={(e) => setNewDonor(prev => ({ ...prev, last_name: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newDonor.email}
                  onChange={(e) => setNewDonor(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newDonor.phone}
                  onChange={(e) => setNewDonor(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="donor_type">Donor Type</Label>
                <Select value={newDonor.donor_type} onValueChange={(value) => setNewDonor(prev => ({ ...prev, donor_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newDonor.notes}
                  onChange={(e) => setNewDonor(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDonor}>
                  Add Donor
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Donors</p>
                  <p className="text-2xl font-bold">{analytics.totalDonors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Raised</p>
                  <p className="text-2xl font-bold">£{analytics.totalRaised.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg Donation</p>
                  <p className="text-2xl font-bold">£{Math.round(analytics.averageDonation)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Retention Rate</p>
                  <p className="text-2xl font-bold">{Math.round(analytics.retentionRate)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search donors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedSegment} onValueChange={setSelectedSegment}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Donors</SelectItem>
            <SelectItem value="major">Major Donors</SelectItem>
            <SelectItem value="recurring">Recurring Donors</SelectItem>
            <SelectItem value="new">New Donors</SelectItem>
            <SelectItem value="lapsed">Lapsed Donors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Donors List */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredDonors.map((donor, index) => {
              const tier = getDonorTier(donor.total_donated);
              return (
                <div key={donor.id} className={`p-4 hover:bg-gray-50 ${index !== filteredDonors.length - 1 ? 'border-b' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {donor.first_name?.[0] || donor.email[0].toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">
                            {donor.first_name} {donor.last_name} {!donor.first_name && donor.email}
                          </p>
                          <Badge className={tier.color}>{tier.label}</Badge>
                          {donor.donation_count > 5 && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{donor.email}</span>
                          </div>
                          {donor.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{donor.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Since {new Date(donor.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        £{donor.total_donated.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {donor.donation_count} donation{donor.donation_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredDonors.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No donors found</h3>
                <p className="text-gray-600">
                  {searchQuery || selectedSegment !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Start building your donor base by adding your first donor"
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorManagement;
