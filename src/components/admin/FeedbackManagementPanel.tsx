import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Bug, Sparkles, Palette, Zap, MessageSquare, Eye, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface Feedback {
  id: string;
  user_id: string;
  feedback_type: 'bug' | 'feature_request' | 'ui_issue' | 'performance' | 'general';
  title: string;
  description: string;
  page_url: string | null;
  page_section: string | null;
  screenshot_url: string | null;
  browser_info: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_review' | 'in_progress' | 'resolved' | 'wont_fix';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const typeIcons = {
  bug: Bug,
  feature_request: Sparkles,
  ui_issue: Palette,
  performance: Zap,
  general: MessageSquare,
};

const statusColors = {
  new: "bg-blue-500",
  in_review: "bg-yellow-500",
  in_progress: "bg-purple-500",
  resolved: "bg-green-500",
  wont_fix: "bg-gray-500",
};

const priorityColors = {
  low: "bg-gray-400",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

export const FeedbackManagementPanel = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [filterStatus, setFilterStatus] = useState<Feedback['status'] | 'all'>("all");
  const [filterType, setFilterType] = useState<Feedback['feedback_type'] | 'all'>("all");
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState<Feedback['status']>("new");
  const [newPriority, setNewPriority] = useState<Feedback['priority']>("medium");
  
  const queryClient = useQueryClient();

  const { data: feedbackList, isLoading } = useQuery({
    queryKey: ['admin-feedback', filterStatus, filterType],
    queryFn: async () => {
      let query = supabase
        .from('platform_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      if (filterType !== 'all') {
        query = query.eq('feedback_type', filterType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Feedback[];
    },
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Feedback> }) => {
      const { error } = await supabase
        .from('platform_feedback')
        .update({
          ...updates,
          resolved_at: updates.status === 'resolved' ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      toast({ title: "Feedback updated successfully" });
      setSelectedFeedback(null);
    },
    onError: (error: Error) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  const handleUpdateFeedback = () => {
    if (!selectedFeedback) return;
    
    updateFeedbackMutation.mutate({
      id: selectedFeedback.id,
      updates: {
        status: newStatus,
        priority: newPriority,
        admin_notes: adminNotes || selectedFeedback.admin_notes,
      },
    });
  };

  const openFeedbackDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setAdminNotes(feedback.admin_notes || "");
    setNewStatus(feedback.status);
    setNewPriority(feedback.priority);
  };

  const stats = {
    total: feedbackList?.length || 0,
    new: feedbackList?.filter(f => f.status === 'new').length || 0,
    inProgress: feedbackList?.filter(f => f.status === 'in_progress').length || 0,
    resolved: feedbackList?.filter(f => f.status === 'resolved').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Feedback</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New</p>
              <p className="text-2xl font-bold">{stats.new}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">{stats.resolved}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <Label>Status Filter</Label>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="wont_fix">Won't Fix</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Type Filter</Label>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="ui_issue">UI Issue</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Feedback List */}
      <Card>
        <div className="divide-y">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading feedback...</div>
          ) : feedbackList && feedbackList.length > 0 ? (
            feedbackList.map((feedback) => {
              const Icon = typeIcons[feedback.feedback_type];
              return (
                <div
                  key={feedback.id}
                  className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => openFeedbackDetails(feedback)}
                >
                  <div className="flex items-start gap-4">
                    <Icon className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold truncate">{feedback.title}</h4>
                        <Badge className={`${statusColors[feedback.status]} text-white`}>
                          {feedback.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={`${priorityColors[feedback.priority]} text-white`}>
                          {feedback.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {feedback.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{format(new Date(feedback.created_at), 'MMM dd, yyyy HH:mm')}</span>
                        {feedback.page_section && <span>Section: {feedback.page_section}</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No feedback found matching your filters
            </div>
          )}
        </div>
      </Card>

      {/* Feedback Detail Modal */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = typeIcons[selectedFeedback.feedback_type];
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {selectedFeedback.title}
                </DialogTitle>
                <DialogDescription>
                  Submitted {format(new Date(selectedFeedback.created_at), 'PPP')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1">{selectedFeedback.description}</p>
                </div>

                {selectedFeedback.page_section && (
                  <div>
                    <Label>Page Section</Label>
                    <p className="text-sm mt-1">{selectedFeedback.page_section}</p>
                  </div>
                )}

                {selectedFeedback.page_url && (
                  <div>
                    <Label>Page URL</Label>
                    <a
                      href={selectedFeedback.page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline block mt-1 truncate"
                    >
                      {selectedFeedback.page_url}
                    </a>
                  </div>
                )}

                {selectedFeedback.screenshot_url && (
                  <div>
                    <Label>Screenshot</Label>
                    <img
                      src={selectedFeedback.screenshot_url}
                      alt="Feedback screenshot"
                      className="mt-2 rounded-lg border max-h-64 object-contain"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={newStatus} onValueChange={(v: any) => setNewStatus(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="wont_fix">Won't Fix</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={newPriority} onValueChange={(v: any) => setNewPriority(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateFeedback} disabled={updateFeedbackMutation.isPending}>
                    {updateFeedbackMutation.isPending ? 'Updating...' : 'Update Feedback'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
