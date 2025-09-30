import { useState } from "react";
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
  MessageCircle
} from "lucide-react";

interface CommunityNeed {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  estimatedCost: number;
  beneficiaries: number;
  timeframe: string;
  tags: string[];
  created: string;
}

// Mock data to demonstrate functionality
const mockCommunityNeeds: CommunityNeed[] = [
  {
    id: '1',
    title: 'Winter Clothing Drive for Homeless Families',
    description: 'Local homeless shelter needs winter coats, blankets, and warm clothing for 150 families facing the harsh winter conditions.',
    author: 'City Homeless Shelter',
    category: 'emergency-relief',
    urgency: 'urgent',
    location: 'London, UK',
    estimatedCost: 15000,
    beneficiaries: 150,
    timeframe: '2 weeks',
    tags: ['clothing', 'winter', 'urgent'],
    created: '2 days ago'
  },
  {
    id: '2',
    title: 'Digital Literacy Program for Seniors',
    description: 'Community center seeking support to provide tablets and training for 80 senior citizens to stay connected with family.',
    author: 'Community Tech Center',
    category: 'education',
    urgency: 'medium',
    location: 'Manchester, UK',
    estimatedCost: 8000,
    beneficiaries: 80,
    timeframe: '3 months',
    tags: ['technology', 'seniors', 'education'],
    created: '5 days ago'
  },
  {
    id: '3',
    title: 'Food Bank Emergency Supplies',
    description: 'Local food bank urgently needs funding to purchase emergency food supplies for families affected by recent economic challenges.',
    author: 'North London Food Bank',
    category: 'emergency-relief',
    urgency: 'urgent',
    location: 'North London, UK',
    estimatedCost: 12000,
    beneficiaries: 300,
    timeframe: '1 week',
    tags: ['food', 'emergency', 'families'],
    created: '1 day ago'
  },
  {
    id: '4',
    title: 'Youth After-School Program Equipment',
    description: 'Local youth center needs sports equipment and educational materials to expand their after-school program for at-risk youth.',
    author: 'Birmingham Youth Center',
    category: 'education',
    urgency: 'medium',
    location: 'Birmingham, UK',
    estimatedCost: 5000,
    beneficiaries: 60,
    timeframe: '1 month',
    tags: ['youth', 'education', 'sports'],
    created: '1 week ago'
  }
];

const CommunityNeedsDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  const filteredNeeds = mockCommunityNeeds.filter(need => {
    const matchesSearch = need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         need.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || need.category === categoryFilter;
    const matchesUrgency = urgencyFilter === 'all' || need.urgency === urgencyFilter;
    return matchesSearch && matchesCategory && matchesUrgency;
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
                <SelectItem value="emergency-relief">Emergency Relief</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
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
        {filteredNeeds.map((need) => (
          <Card key={need.id} className="hover:shadow-lg transition-shadow">
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
                    {need.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{need.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{need.beneficiaries} people</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">£{need.estimatedCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{need.timeframe}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {need.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-xs text-muted-foreground">
                  Posted by {need.author} • {need.created}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                    <Handshake className="h-4 w-4 mr-2" />
                    Support This
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredNeeds.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Needs Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more community needs.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommunityNeedsDiscovery;
