import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp,
  Search,
  AlertCircle,
  Handshake,
  MessageCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchCommunityNeeds, 
  subscribeToCommunityNeeds, 
  createCSROpportunity,
  trackCSRLead,
  type CommunityNeed 
} from "@/services/csrService";

const CommunityNeedsDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [needs, setNeeds] = useState<CommunityNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { organizationId } = useAuth();

  // Fetch community needs
  useEffect(() => {
    loadNeeds();
  }, [categoryFilter, urgencyFilter]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToCommunityNeeds(() => {
      loadNeeds();
    });
    return unsubscribe;
  }, [categoryFilter, urgencyFilter]);

  const loadNeeds = async () => {
    try {
      setLoading(true);
      const data = await fetchCommunityNeeds({
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        urgency: urgencyFilter !== 'all' ? urgencyFilter : undefined,
      });
      setNeeds(data);
    } catch (error) {
      console.error('Error loading community needs:', error);
      toast({
        title: "Error",
        description: "Failed to load community needs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (need: CommunityNeed) => {
    // Navigate to messages with the need author
    navigate(`/messages?user=${need.author_id}`);
  };

  const handleSupport = async (need: CommunityNeed) => {
    if (!organizationId) {
      toast({
        title: "Organization Required",
        description: "You need to be part of an organization to support community needs",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCSROpportunity(organizationId, need.id);
      toast({
        title: "Interest Registered!",
        description: "We've notified the community member. You can now contact them directly.",
      });
    } catch (error) {
      console.error('Error creating CSR opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to register interest",
        variant: "destructive",
      });
    }
  };

  const trackView = (need: CommunityNeed) => {
    if (organizationId) {
      trackCSRLead(organizationId, 'view', need.id);
    }
  };

  const filteredNeeds = needs.filter(need => {
    const matchesSearch = need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         need.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Community Needs Discovery</h3>
        <p className="text-muted-foreground">
          Real-time feed of community needs seeking corporate support
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search needs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="help-needed">Help Needed</SelectItem>
                <SelectItem value="emergency-relief">Emergency Relief</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Urgency Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency Levels</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Community Needs Feed */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : filteredNeeds.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Needs Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more community needs.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNeeds.map((need) => (
            <Card 
              key={need.id} 
              className="hover:shadow-lg transition-shadow"
              onClick={() => trackView(need)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{need.title}</h4>
                      <Badge className={getUrgencyColor(need.urgency)}>
                        {need.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {need.content}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{need.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{new Date(need.created_at).toLocaleDateString()}</span>
                  </div>
                  {need.tags.length > 0 && (
                    <div className="flex items-center gap-2 text-sm col-span-2 md:col-span-1">
                      {need.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-muted-foreground">
                    Posted by {need.author_name}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContact(need)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                      onClick={() => handleSupport(need)}
                    >
                      <Handshake className="h-4 w-4 mr-2" />
                      Support This
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityNeedsDiscovery;
