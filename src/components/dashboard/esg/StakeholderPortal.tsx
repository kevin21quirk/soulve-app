import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Building2, 
  DollarSign, 
  Heart, 
  Send, 
  Download,
  Eye,
  MessageCircle,
  Bell,
  TrendingUp,
  Globe,
  Share2,
  FileText,
  CheckCircle,
  Clock,
  UserPlus
} from "lucide-react";
import { useESGDataRequests, useStakeholderContributions, useSubmitESGContribution, useESGAnnouncements, useESGInitiatives } from "@/services/esgService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import InviteStakeholderModal from "./InviteStakeholderModal";
import { useESGRealtimeUpdates } from "@/hooks/esg/useESGRealtimeUpdates";
import DynamicDataForm from "./DynamicDataForm";
import InitiativeContextCard from "./InitiativeContextCard";
import { saveDraft, getDraftByRequestId } from "@/services/esgContributionService";

interface StakeholderGroup {
  id: string;
  name: string;
  type: 'investors' | 'employees' | 'suppliers' | 'community';
  count: number;
  engagementLevel: 'high' | 'medium' | 'low';
  lastInteraction: string;
  keyInterests: string[];
}

interface Announcement {
  id: string;
  title: string;
  type: 'achievement' | 'update' | 'target' | 'event';
  date: string;
  audienceTypes: string[];
  views: number;
  engagement: number;
}

interface StakeholderPortalProps {
  organizationId: string;
}

const StakeholderPortal = ({ organizationId }: StakeholderPortalProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [announcementText, setAnnouncementText] = useState('');
  const [contributionData, setContributionData] = useState<Record<string, string>>({});
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  
  // Fetch real data
  const { data: dataRequests, isLoading: loadingRequests } = useESGDataRequests(organizationId);
  const { data: contributions, isLoading: loadingContributions } = useStakeholderContributions(organizationId);
  const { data: orgAnnouncements, isLoading: loadingAnnouncements } = useESGAnnouncements(organizationId);
  const { data: initiatives, isLoading: loadingInitiatives } = useESGInitiatives(organizationId);
  const submitContribution = useSubmitESGContribution();
  
  // Group data requests by initiative
  const requestsByInitiative = dataRequests?.reduce((acc: any, request: any) => {
    const initiativeId = request.initiative_id || 'ungrouped';
    if (!acc[initiativeId]) acc[initiativeId] = [];
    acc[initiativeId].push(request);
    return acc;
  }, {}) || {};
  
  // Enable real-time updates
  useESGRealtimeUpdates({ organizationId, enabled: true });
  
  // Get current user and check role
  const [currentUser, setCurrentUser] = useState<any>(null);
  supabase.auth.getUser().then(async ({ data }) => {
    if (data.user && !currentUser) {
      setCurrentUser(data.user);
      
      // Check if user is org admin
      const { data: membership } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', organizationId)
        .eq('user_id', data.user.id)
        .eq('is_active', true)
        .single();
      
      if (membership && ['admin', 'owner'].includes(membership.role)) {
        setIsOrgAdmin(true);
      }
    }
  });

  // Mock stakeholder groups data
  const stakeholderGroups: StakeholderGroup[] = [
    {
      id: 'investors',
      name: 'Investors',
      type: 'investors',
      count: 127,
      engagementLevel: 'high',
      lastInteraction: '2 days ago',
      keyInterests: ['Financial Performance', 'Risk Management', 'ESG Compliance']
    },
    {
      id: 'employees',
      name: 'Employees',
      type: 'employees',
      count: 2840,
      engagementLevel: 'medium',
      lastInteraction: '1 week ago',
      keyInterests: ['Workplace Diversity', 'Professional Development', 'Sustainability Initiatives']
    },
    {
      id: 'suppliers',
      name: 'Suppliers',
      type: 'suppliers',
      count: 156,
      engagementLevel: 'medium',
      lastInteraction: '3 days ago',
      keyInterests: ['Supply Chain Standards', 'Certification Requirements', 'Sustainability Goals']
    },
    {
      id: 'community',
      name: 'Community',
      type: 'community',
      count: 890,
      engagementLevel: 'low',
      lastInteraction: '2 weeks ago',
      keyInterests: ['Environmental Impact', 'Local Employment', 'Community Programs']
    }
  ];

  // Mock announcements data
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Q4 2024 Sustainability Achievements',
      type: 'achievement',
      date: '2024-01-15',
      audienceTypes: ['investors', 'employees'],
      views: 2847,
      engagement: 89
    },
    {
      id: '2',
      title: 'New Carbon Neutrality Target for 2030',
      type: 'target',
      date: '2024-01-10',
      audienceTypes: ['all'],
      views: 3621,
      engagement: 156
    },
    {
      id: '3',
      title: 'Supplier Code of Conduct Update',
      type: 'update',
      date: '2024-01-08',
      audienceTypes: ['suppliers'],
      views: 789,
      engagement: 23
    },
    {
      id: '4',
      title: 'Annual Stakeholder Town Hall - Save the Date',
      type: 'event',
      date: '2024-01-05',
      audienceTypes: ['all'],
      views: 1456,
      engagement: 67
    }
  ];

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'investors': return DollarSign;
      case 'employees': return Users;
      case 'suppliers': return Building2;
      case 'community': return Heart;
      default: return Users;
    }
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-green-100 text-green-800';
      case 'target': return 'bg-blue-100 text-blue-800';
      case 'update': return 'bg-orange-100 text-orange-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAnnouncements = selectedGroup === 'all' 
    ? announcements 
    : announcements.filter(announcement => 
        announcement.audienceTypes.includes(selectedGroup) || announcement.audienceTypes.includes('all')
      );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary" />
            Stakeholder Engagement Portal
          </h2>
          <p className="text-muted-foreground mt-1">
            Centralized communication and engagement with all stakeholder groups
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isOrgAdmin && (
            <>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="gradient" size="sm" onClick={() => setInviteModalOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Stakeholder
              </Button>
              <Button variant="gradient" size="sm">
                <Send className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="engagement"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Data Requests
          </TabsTrigger>
          <TabsTrigger 
            value="announcements"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Announcements
          </TabsTrigger>
          <TabsTrigger 
            value="communication"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Communication
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Stakeholder Groups Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stakeholderGroups.map((group) => {
              const GroupIcon = getGroupIcon(group.type);
              return (
                <Card key={group.id} className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg">
                      <GroupIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{group.name}</h3>
                      <Badge variant="outline" className={getEngagementColor(group.engagementLevel)}>
                        {group.engagementLevel} engagement
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Total Members</span>
                      <span className="font-semibold">{group.count.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Last Interaction</span>
                      <span className="font-medium text-sm">{group.lastInteraction}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground text-sm">Key Interests</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {group.keyInterests.slice(0, 2).map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {group.keyInterests.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{group.keyInterests.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button variant="gradient" className="w-full mt-4" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Engage
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Recent Activity Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">15</div>
                <div className="text-sm text-blue-600">Communications Sent</div>
                <div className="text-xs text-blue-500 mt-1">This month</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">89%</div>
                <div className="text-sm text-green-600">Engagement Rate</div>
                <div className="text-xs text-green-500 mt-1">+5% vs last month</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">4,312</div>
                <div className="text-sm text-purple-600">Total Interactions</div>
                <div className="text-xs text-purple-500 mt-1">Across all channels</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create New Communication */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Create Announcement</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Target Audience</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option value="all">All Stakeholders</option>
                      <option value="investors">Investors</option>
                      <option value="employees">Employees</option>
                      <option value="suppliers">Suppliers</option>
                      <option value="community">Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option value="update">Update</option>
                      <option value="achievement">Achievement</option>
                      <option value="target">New Target</option>
                      <option value="event">Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      className="w-full mt-1 p-2 border rounded-md resize-none"
                      rows={4}
                      placeholder="Enter your message..."
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                    />
                  </div>

                  <Button variant="gradient" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Announcement
                  </Button>
                </div>
              </Card>
            </div>

            {/* Communication History */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Communication History</h3>
                  <div className="flex items-center space-x-2">
                    {['all', 'investors', 'employees', 'suppliers', 'community'].map((group) => (
                      <Button
                        key={group}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedGroup(group)}
                        className={selectedGroup === group ? "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-transparent hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90" : ""}
                      >
                        {group.charAt(0).toUpperCase() + group.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{announcement.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className={getAnnouncementTypeColor(announcement.type)}>
                              {announcement.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{announcement.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>{announcement.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <span>{announcement.engagement} interactions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{announcement.audienceTypes.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          {loadingRequests || loadingInitiatives ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(requestsByInitiative).map(([initiativeId, requests]: [string, any]) => {
                const initiative = initiatives?.find((i: any) => i.id === initiativeId);
                const pendingRequests = requests.filter((req: any) => req.status === 'pending');
                
                if (pendingRequests.length === 0) return null;
                
                return (
                  <div key={initiativeId} className="space-y-4">
                    {initiative && (
                      <InitiativeContextCard 
                        initiative={initiative}
                        userProgress={{
                          completed: contributions?.filter((c: any) => 
                            pendingRequests.some((r: any) => r.id === c.data_request_id)
                          ).length || 0,
                          total: pendingRequests.length
                        }}
                      />
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {pendingRequests.map((request: any) => (
                        <Card key={request.id} className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{request.indicator?.name || 'Data Request'}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{request.indicator?.description}</p>
                            </div>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-4">
                            <p>Period: {request.reporting_period}</p>
                            <p>Category: {request.indicator?.category}</p>
                          </div>
                          
                          <DynamicDataForm
                            indicator={request.indicator || {
                              id: request.indicator_id,
                              name: 'Data Request',
                              data_type: 'text'
                            }}
                            requestId={request.id}
                            onSubmit={async (data) => {
                              submitContribution.mutate({
                                data_request_id: request.id,
                                contributor_id: currentUser?.id,
                                data_value: JSON.stringify(data.value),
                                data_source: 'manual_entry',
                                verification_status: 'pending',
                                supporting_documents: data.files || []
                              }, {
                                onSuccess: () => {
                                  toast({ title: "Contribution submitted successfully" });
                                }
                              });
                            }}
                            onSaveDraft={async (data) => {
                              if (!currentUser) return;
                              await saveDraft(request.id, {
                                request_id: request.id,
                                indicator_id: request.indicator_id,
                                draft_data: data,
                                contributor_user_id: currentUser.id
                              });
                              toast({ title: "Draft saved" });
                            }}
                            isSubmitting={submitContribution.isPending}
                          />
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {dataRequests && dataRequests.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No pending data requests</p>
              )}
            </div>
          )}
          
          {/* Your Contributions */}
          <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Your Contributions
              </h3>
              {loadingContributions ? (
                <p className="text-muted-foreground">Loading contributions...</p>
              ) : contributions && contributions.length > 0 ? (
                <div className="space-y-3">
                  {contributions.slice(0, 5).map((contribution: any) => (
                    <div key={contribution.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{contribution.data_request?.indicator?.name}</span>
                        <Badge variant="outline" className={
                          contribution.verification_status === 'approved' 
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : contribution.verification_status === 'rejected'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                        }>
                          {contribution.verification_status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(contribution.submitted_at).toLocaleDateString()}
                      </p>
                      {contribution.reviewer_notes && (
                        <p className="text-xs bg-blue-50 p-2 rounded border border-blue-200">
                          Notes: {contribution.reviewer_notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No contributions yet</p>
              )}
            </Card>
        </TabsContent>
        
        <TabsContent value="announcements" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              Organization Announcements
            </h3>
            {loadingAnnouncements ? (
              <p className="text-muted-foreground">Loading announcements...</p>
            ) : orgAnnouncements && orgAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {orgAnnouncements.map((announcement: any) => (
                  <div key={announcement.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(announcement.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{announcement.announcement_type}</Badge>
                      {announcement.target_stakeholder_types?.map((type: string) => (
                        <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No announcements available</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="legacy-engagement" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800">ESG Strategy Survey</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                  <p className="text-blue-600 text-sm mb-3">
                    Collecting feedback on our 2024 ESG priorities
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 text-sm">Response Rate: 67%</span>
                    <Button variant="outline" size="sm" className="hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent">
                      View Results
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">Quarterly Check-in</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <p className="text-green-600 text-sm mb-3">
                    Q4 2024 stakeholder satisfaction survey
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 text-sm">Average Score: 4.2/5</span>
                    <Button variant="outline" size="sm" className="hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent">
                      <Download className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Trends */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Engagement Trends
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="text-xl font-bold text-green-700">+15%</div>
                    <div className="text-sm text-green-600">vs Last Quarter</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="text-xl font-bold text-blue-700">4.2/5</div>
                    <div className="text-sm text-blue-600">Satisfaction Score</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Channel Performance</h4>
                  <div className="space-y-2">
                    {[
                      { channel: 'Email Newsletters', engagement: 78 },
                      { channel: 'Stakeholder Portal', engagement: 65 },
                      { channel: 'Direct Meetings', engagement: 92 },
                      { channel: 'Webinars', engagement: 54 }
                    ].map((item) => (
                      <div key={item.channel} className="flex justify-between items-center">
                        <span className="text-sm">{item.channel}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                              style={{ width: `${item.engagement}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{item.engagement}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Communication Impact */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                Communication Impact
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                    <div className="text-sm text-purple-600 mb-1">Total Reach</div>
                    <div className="text-2xl font-bold text-purple-700">12,847</div>
                    <div className="text-xs text-purple-500">Unique stakeholders reached</div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                    <div className="text-sm text-orange-600 mb-1">Response Rate</div>
                    <div className="text-2xl font-bold text-orange-700">23%</div>
                    <div className="text-xs text-orange-500">Above industry average</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Top Performing Content</h4>
                  <div className="space-y-2">
                    {[
                      { title: 'Carbon Neutrality Roadmap', views: 3621 },
                      { title: 'Employee Diversity Report', views: 2847 },
                      { title: 'Supply Chain Updates', views: 1892 }
                    ].map((content) => (
                      <div key={content.title} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{content.title}</span>
                        <span className="text-sm text-muted-foreground">{content.views} views</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Invite Stakeholder Modal */}
      <InviteStakeholderModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        organizationId={organizationId}
      />
    </div>
  );
};

export default StakeholderPortal;