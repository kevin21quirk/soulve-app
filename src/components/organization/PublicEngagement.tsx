import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageSquare, ThumbsUp, Share2, Calendar, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PublicEngagementProps {
  organizationId: string;
}

const PublicEngagement = ({ organizationId }: PublicEngagementProps) => {
  const [expandedConsultation, setExpandedConsultation] = useState<number | null>(null);
  const [feedbackLikes, setFeedbackLikes] = useState<Record<number, number>>({
    1: 24,
    2: 18
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with real data from Supabase
  const engagementMetrics = [
    { label: "Active Consultations", value: 8, trend: "+2" },
    { label: "Public Comments", value: 342, trend: "+45" },
    { label: "Event Attendees", value: 1250, trend: "+120" },
    { label: "Survey Responses", value: 567, trend: "+89" },
  ];

  const activeConsultations = [
    {
      id: 1,
      title: "Local Park Renovation Plan",
      status: "active",
      responses: 145,
      deadline: "2025-04-15",
      engagement: "high"
    },
    {
      id: 2,
      title: "Transport Infrastructure Review",
      status: "active",
      responses: 89,
      deadline: "2025-04-20",
      engagement: "medium"
    },
    {
      id: 3,
      title: "Community Safety Initiative",
      status: "closing-soon",
      responses: 203,
      deadline: "2025-04-02",
      engagement: "high"
    },
  ];

  const recentFeedback = [
    {
      id: 1,
      author: "Sarah Mitchell",
      topic: "Park Renovation",
      comment: "Love the new accessibility features in the design!",
      likes: 24,
      date: "2 hours ago"
    },
    {
      id: 2,
      author: "James Wilson",
      topic: "Transport Review",
      comment: "We need better cycling infrastructure on Main Street.",
      likes: 18,
      date: "5 hours ago"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700';
      case 'closing-soon': return 'bg-orange-500/10 text-orange-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'bg-blue-500/10 text-blue-700';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700';
      case 'low': return 'bg-gray-500/10 text-gray-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Public Engagement</h2>
          <p className="text-muted-foreground">
            Manage consultations, surveys, and citizen feedback
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Start New Consultation</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Start New Consultation</DialogTitle>
              <DialogDescription>
                Create a new public consultation to gather citizen feedback.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Consultation Title</Label>
                <Input id="title" placeholder="e.g., Local Park Renovation Plan" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe what feedback you're seeking..." rows={4} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., Environment, Transport, Housing" />
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
                      title: "Consultation Created",
                      description: "Your public consultation has been published successfully.",
                    });
                  }, 1000);
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Consultation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {engagementMetrics.map((metric) => (
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

      {/* Active Consultations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeConsultations.map((consultation) => (
              <Collapsible
                key={consultation.id}
                open={expandedConsultation === consultation.id}
                onOpenChange={(open) => setExpandedConsultation(open ? consultation.id : null)}
              >
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{consultation.title}</h3>
                        <Badge className={getStatusColor(consultation.status)}>
                          {consultation.status.replace('-', ' ')}
                        </Badge>
                        <Badge className={getEngagementColor(consultation.engagement)}>
                          {consultation.engagement} engagement
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{consultation.responses} responses</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Closes {consultation.deadline}</span>
                        </span>
                      </div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm">
                        {expandedConsultation === consultation.id ? (
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
                  
                  <CollapsibleContent className="mt-4 space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Full Description</h4>
                      <p className="text-sm text-muted-foreground">
                        This consultation seeks public input on proposed changes and improvements. 
                        Your feedback will help shape the final implementation plan and ensure 
                        community needs are met effectively.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Recent Responses</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-muted rounded text-sm">
                          <p className="font-medium">Community Member A</p>
                          <p className="text-muted-foreground">Great initiative! Looking forward to seeing this implemented.</p>
                        </div>
                        <div className="p-3 bg-muted rounded text-sm">
                          <p className="font-medium">Community Member B</p>
                          <p className="text-muted-foreground">Have you considered accessibility requirements?</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">View All Responses</Button>
                      <Button size="sm" variant="outline">Download Report</Button>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Public Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Public Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{feedback.author}</div>
                    <div className="text-sm text-muted-foreground">
                      on {feedback.topic}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{feedback.date}</span>
                </div>
                <p className="text-sm mb-3">{feedback.comment}</p>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setFeedbackLikes(prev => ({
                        ...prev,
                        [feedback.id]: (prev[feedback.id] || feedback.likes) + 1
                      }));
                      toast({
                        description: "Feedback liked!",
                      });
                    }}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {feedbackLikes[feedback.id] || feedback.likes}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Reply to Comment",
                        description: `Replying to ${feedback.author}...`,
                      });
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`Comment by ${feedback.author}: ${feedback.comment}`);
                      toast({
                        description: "Comment copied to clipboard!",
                      });
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicEngagement;
