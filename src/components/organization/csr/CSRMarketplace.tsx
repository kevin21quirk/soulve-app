import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus,
  Target,
  Users,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const CSRMarketplace = () => {
  const { toast } = useToast();
  const { user, organizationId } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!organizationId) {
      toast({
        title: "Organization Required",
        description: "You need to be part of an organization to create CSR campaigns",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          story: formData.get('story') as string,
          category: formData.get('category') as string,
          organization_type: 'corporate',
          goal_type: 'monetary',
          goal_amount: parseFloat(formData.get('goal') as string),
          location: formData.get('location') as string,
          urgency: formData.get('urgency') as string,
          start_date: new Date().toISOString(),
          end_date: formData.get('endDate') as string,
          visibility: 'public',
          status: 'active',
          creator_id: user.id,
          tags: [],
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Campaign Created",
        description: "Your CSR campaign is now live on the platform.",
      });

      // Navigate to the campaign
      navigate(`/campaigns/${data.id}`);
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Create CSR Campaign</h3>
        <p className="text-muted-foreground">
          Launch corporate-led campaigns to address community needs and track measurable impact
        </p>
      </div>

      {/* Campaign Creation Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="E.g., Tech for Good Initiative"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="community-development">Community Development</SelectItem>
                  <SelectItem value="emergency-relief">Emergency Relief</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your CSR campaign goals and impact..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="story">Campaign Story</Label>
              <Textarea
                id="story"
                name="story"
                placeholder="Tell the story behind your CSR initiative..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal">Budget Target (£) *</Label>
                <Input
                  id="goal"
                  name="goal"
                  type="number"
                  placeholder="50000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="E.g., London, UK"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Urgency</Label>
                <Select name="urgency" defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Campaign...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Launch Campaign
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold text-foreground">CSR Campaign Guidelines</h4>
              <p className="text-sm text-muted-foreground">
                Create meaningful campaigns that connect with communities and demonstrate real social impact
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Align campaigns with UN Sustainable Development Goals (SDGs)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Set clear, measurable outcomes for community benefit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Track and report progress transparently to stakeholders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Integrate CSR metrics with your ESG reporting framework</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSRMarketplace;
