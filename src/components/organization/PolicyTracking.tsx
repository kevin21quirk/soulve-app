import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

interface PolicyTrackingProps {
  organizationId: string;
}

const PolicyTracking = ({ organizationId }: PolicyTrackingProps) => {
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
        <Button>
          Create New Policy
        </Button>
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
              <div
                key={policy.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
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
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
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
              </div>
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
