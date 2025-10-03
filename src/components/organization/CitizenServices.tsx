import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ClipboardList, Clock, CheckCircle, AlertTriangle, TrendingUp, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CitizenServicesProps {
  organizationId: string;
}

const CitizenServices = ({ organizationId }: CitizenServicesProps) => {
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);

  // Mock data - replace with real data from Supabase
  const serviceMetrics = [
    { label: "Open Requests", value: 42, trend: "+8" },
    { label: "In Progress", value: 28, trend: "+5" },
    { label: "Resolved Today", value: 15, trend: "+3" },
    { label: "Avg Response Time", value: "2.4h", trend: "-0.3h" },
  ];

  const serviceRequests = [
    {
      id: 1,
      title: "Street Light Repair",
      category: "Infrastructure",
      status: "in-progress",
      priority: "high",
      location: "Oak Street, Block 4",
      submittedBy: "John Davies",
      submittedAt: "2 hours ago",
      assignedTo: "Maintenance Team A"
    },
    {
      id: 2,
      title: "Waste Collection Missed",
      category: "Sanitation",
      status: "open",
      priority: "medium",
      location: "Elm Avenue, Zone 2",
      submittedBy: "Emma Watson",
      submittedAt: "4 hours ago",
      assignedTo: "Unassigned"
    },
    {
      id: 3,
      title: "Pothole on Main Road",
      category: "Roads",
      status: "urgent",
      priority: "high",
      location: "Main Road, Junction 5",
      submittedBy: "Mike Johnson",
      submittedAt: "6 hours ago",
      assignedTo: "Road Repair Team"
    },
  ];

  const serviceCategories = [
    { name: "Infrastructure", count: 15, avgTime: "3.2 days" },
    { name: "Sanitation", count: 8, avgTime: "1.5 days" },
    { name: "Roads", count: 12, avgTime: "4.1 days" },
    { name: "Parks & Recreation", count: 7, avgTime: "2.8 days" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-700';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-700';
      case 'urgent': return 'bg-red-500/10 text-red-700';
      case 'resolved': return 'bg-green-500/10 text-green-700';
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
      case 'open': return <ClipboardList className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'urgent': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <ClipboardList className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Citizen Services</h2>
          <p className="text-muted-foreground">
            Manage citizen requests and service delivery
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>View All Requests</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>All Service Requests</DialogTitle>
              <DialogDescription>
                Complete list of citizen service requests with filtering options.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {serviceRequests.map((request) => (
                <div key={request.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{request.title}</h4>
                      <p className="text-sm text-muted-foreground">{request.location}</p>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline">Export to CSV</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {serviceMetrics.map((metric) => (
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

      {/* Service Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceRequests.map((request) => (
              <Collapsible
                key={request.id}
                open={expandedRequest === request.id}
                onOpenChange={(open) => setExpandedRequest(open ? request.id : null)}
              >
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{request.title}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{request.status}</span>
                        </Badge>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{request.location}</span>
                        </span>
                        <span>{request.category}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Submitted by {request.submittedBy} • {request.submittedAt}
                      </div>
                      <div className="text-sm font-medium mt-1">
                        Assigned to: {request.assignedTo}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm">
                          {expandedRequest === request.id ? (
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
                      {request.assignedTo === "Unassigned" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">Assign</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Request</DialogTitle>
                              <DialogDescription>
                                Assign "{request.title}" to a team member.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-sm text-muted-foreground mb-2">Select team:</p>
                              <div className="space-y-2">
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start"
                                  onClick={() => {
                                    toast({
                                      title: "Request Assigned",
                                      description: "Assigned to Maintenance Team A",
                                    });
                                  }}
                                >
                                  Maintenance Team A
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start"
                                  onClick={() => {
                                    toast({
                                      title: "Request Assigned",
                                      description: "Assigned to Road Repair Team",
                                    });
                                  }}
                                >
                                  Road Repair Team
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start"
                                  onClick={() => {
                                    toast({
                                      title: "Request Assigned",
                                      description: "Assigned to Sanitation Department",
                                    });
                                  }}
                                >
                                  Sanitation Department
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                  
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Full Description</h4>
                      <p className="text-sm text-muted-foreground">
                        The reported issue requires immediate attention to ensure public safety 
                        and maintain service standards. This request has been escalated based on 
                        priority level and location factors.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Status History</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-muted rounded text-sm">
                          <p className="font-medium">Request Submitted</p>
                          <p className="text-muted-foreground text-xs">{request.submittedAt}</p>
                        </div>
                        {request.status !== 'open' && (
                          <div className="p-3 bg-muted rounded text-sm">
                            <p className="font-medium">Assigned to Team</p>
                            <p className="text-muted-foreground text-xs">1 hour ago</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">Update Status</Button>
                      <Button size="sm" variant="outline">Add Comment</Button>
                      <Button size="sm" variant="outline">View Photos</Button>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Service Categories Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {serviceCategories.map((category) => (
              <div
                key={category.name}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="font-semibold mb-2">{category.name}</div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {category.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg: {category.avgTime}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitizenServices;
