import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PolicyTrackingProps {
  organizationId: string;
}

const PolicyTracking = ({ organizationId }: PolicyTrackingProps) => {
  const [expandedPolicy, setExpandedPolicy] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with real data from Supabase
  const policyMetrics = [
    { label: "Active Policies", value: 15, trend: "+3" },
    { label: "Under Review", value: 7, trend: "+2" },
    { label: "Implemented", value: 42, trend: "+5" },
    { label: "Pending Approval", value: 4, trend: "+1" },
  ];

  const activePolicies = [
    {
      id: 1,
      title: "Green Energy Transition Plan",
      category: "Environment",
      status: "in-progress",
      progress: 65,
      deadline: "2025-06-30",
      assignee: "Environmental Committee",
      priority: "high"
    },
    {
      id: 2,
      title: "Affordable Housing Initiative",
      category: "Housing",
      status: "under-review",
      progress: 30,
      deadline: "2025-08-15",
      assignee: "Housing Department",
      priority: "high"
    },
    {
      id: 3,
      title: "Digital Infrastructure Upgrade",
      category: "Technology",
      status: "in-progress",
      progress: 80,
      deadline: "2025-05-20",
      assignee: "IT Department",
      priority: "medium"
    },
  ];

  const recentMilestones = [
    {
      id: 1,
      policy: "Traffic Management System",
      milestone: "Phase 2 Complete",
      date: "2025-03-25",
      impact: "Reduced congestion by 15%"
    },
    {
      id: 2,
      policy: "Community Health Program",
      milestone: "Rollout to 3 districts",
      date: "2025-03-20",
      impact: "500+ residents enrolled"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-500/10 text-blue-700';
      case 'under-review': return 'bg-yellow-500/10 text-yellow-700';
      case 'completed': return 'bg-green-500/10 text-green-700';
      case 'delayed': return 'bg-red-500/10 text-red-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-700';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700';
      case 'low': return 'bg-green-500/10 text-green-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'under-review': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Policy Tracking</h2>
          <p className="text-muted-foreground">
            Monitor and manage policy initiatives and implementation
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Policy</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
              <DialogDescription>
                Add a new policy initiative to track and manage implementation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="policy-title">Policy Title</Label>
                <Input id="policy-title" placeholder="e.g., Green Energy Transition Plan" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy-category">Category</Label>
                <Input id="policy-category" placeholder="e.g., Environment, Housing, Technology" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy-description">Description</Label>
                <Textarea id="policy-description" placeholder="Describe the policy objectives..." rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="policy-priority">Priority</Label>
                  <Input id="policy-priority" placeholder="High / Medium / Low" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="policy-deadline">Deadline</Label>
                  <Input id="policy-deadline" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy-assignee">Assignee</Label>
                <Input id="policy-assignee" placeholder="Team or department name" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setIsSubmitting(true);
                  setTimeout(() => {
                    setIsSubmitting(false);
                    setIsDialogOpen(false);
                    toast({
                      title: "Policy Created",
                      description: "Your policy has been added to tracking successfully.",
                    });
                  }, 1000);
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Policy"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Policy Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {policyMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">{metric.value}</span>
                <span className="text-sm text-green-600">{metric.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Active Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activePolicies.map((policy) => (
              <Collapsible
                key={policy.id}
                open={expandedPolicy === policy.id}
                onOpenChange={(open) => setExpandedPolicy(open ? policy.id : null)}
              >
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{policy.title}</h3>
                        <Badge className={getStatusColor(policy.status)}>
                          {getStatusIcon(policy.status)}
                          <span className="ml-1">{policy.status.replace('-', ' ')}</span>
                        </Badge>
                        <Badge className={getPriorityColor(policy.priority)}>
                          {policy.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {policy.category} • Deadline: {policy.deadline}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Assigned to: {policy.assignee}
                      </div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm">
                        {expandedPolicy === policy.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            View Details
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{policy.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${policy.progress}%` }}
                      />
                    </div>
                  </div>

                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Policy Description</h4>
                      <p className="text-sm text-muted-foreground">
                        This policy initiative focuses on implementing comprehensive measures 
                        to achieve strategic objectives. The implementation involves multiple 
                        phases with specific milestones and deliverables tracked over time.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Recent Updates</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-muted rounded text-sm">
                          <p className="font-medium text-green-600">✓ Phase 1 Completed</p>
                          <p className="text-muted-foreground text-xs">Completed 2 weeks ago</p>
                        </div>
                        <div className="p-3 bg-muted rounded text-sm">
                          <p className="font-medium text-blue-600">→ Phase 2 In Progress</p>
                          <p className="text-muted-foreground text-xs">Started 1 week ago</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">View Timeline</Button>
                      <Button size="sm" variant="outline">Edit Policy</Button>
                      <Button size="sm" variant="outline">Download Report</Button>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-start space-x-4 p-4 border rounded-lg"
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{milestone.milestone}</div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {milestone.policy}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {milestone.impact}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {milestone.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyTracking;
