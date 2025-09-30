import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus,
  Sparkles,
  Building,
  Target,
  Zap,
  Palette,
  Users,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CSRMarketplace = () => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    category: 'education',
    goal: '',
    timeframe: '',
    branding: 'white-label'
  });

  const handleCreateCampaign = () => {
    if (!campaignForm.title || !campaignForm.goal) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "CSR campaign created successfully",
    });
    setShowCreateDialog(false);
    setCampaignForm({ title: '', description: '', category: 'education', goal: '', timeframe: '', branding: 'white-label' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">CSR Marketplace & Creator</h3>
          <p className="text-muted-foreground">
            Create white-label campaigns and CSR opportunities tailored to your brand
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create White-Label CSR Campaign</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Campaign Details</TabsTrigger>
                <TabsTrigger value="branding">Branding Options</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div>
                  <Label htmlFor="title">Campaign Title *</Label>
                  <Input
                    id="title"
                    value={campaignForm.title}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="E.g., Tech for Good Initiative"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={campaignForm.category} onValueChange={(value) => setCampaignForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="community">Community Development</SelectItem>
                      <SelectItem value="emergency">Emergency Relief</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={campaignForm.description}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your CSR campaign goals and impact..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal">Budget Goal (£) *</Label>
                    <Input
                      id="goal"
                      type="number"
                      value={campaignForm.goal}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, goal: e.target.value }))}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Input
                      id="timeframe"
                      value={campaignForm.timeframe}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, timeframe: e.target.value }))}
                      placeholder="E.g., 6 months"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="branding" className="space-y-4">
                <div>
                  <Label htmlFor="branding">Branding Type</Label>
                  <Select value={campaignForm.branding} onValueChange={(value) => setCampaignForm(prev => ({ ...prev, branding: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white-label">White Label (Your Brand Only)</SelectItem>
                      <SelectItem value="co-branded">Co-Branded (Your Brand + Partner)</SelectItem>
                      <SelectItem value="platform">Platform Branded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-foreground">White Label Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Custom branding with your company logo and colors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Dedicated campaign URL with your domain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Custom impact reports and analytics dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Social media toolkit for promotion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Press release templates and media support</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign}>
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-foreground">Quick Launch</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Launch a pre-designed CSR campaign in minutes with our templates
            </p>
            <Badge variant="outline" className="mb-4">Most Popular</Badge>
            <ul className="space-y-2 text-xs text-muted-foreground mb-4">
              <li>• Template-based setup</li>
              <li>• 24-hour launch time</li>
              <li>• Basic customization</li>
            </ul>
            <Button variant="outline" className="w-full">
              Browse Templates
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-foreground">White Label</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Fully branded campaign with your company identity
            </p>
            <Badge className="mb-4 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">Recommended</Badge>
            <ul className="space-y-2 text-xs text-muted-foreground mb-4">
              <li>• Full brand customization</li>
              <li>• Dedicated support team</li>
              <li>• Premium features</li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              Create White Label
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Palette className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-foreground">Bespoke</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Custom-built campaign with strategic consultation
            </p>
            <Badge variant="outline" className="mb-4">Enterprise</Badge>
            <ul className="space-y-2 text-xs text-muted-foreground mb-4">
              <li>• Strategic planning</li>
              <li>• Custom development</li>
              <li>• Full-service support</li>
            </ul>
            <Button variant="outline" className="w-full">
              Request Consultation
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ROI Calculator Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold text-foreground">Impact ROI Calculator</h4>
              <p className="text-sm text-muted-foreground">
                Estimate the marketing value and social impact of your CSR initiative
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">£180K</p>
              <p className="text-xs text-muted-foreground">Estimated Media Value</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">2.5M</p>
              <p className="text-xs text-muted-foreground">Potential Reach</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">+45%</p>
              <p className="text-xs text-muted-foreground">Brand Sentiment Lift</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSRMarketplace;
