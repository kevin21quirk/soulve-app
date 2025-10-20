import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Clock, Mail, Phone, Building, Users, Link as LinkIcon, Trash2, Copy, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DemoRequestDetailsDialogProps {
  request: any;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const DemoRequestDetailsDialog = ({ request, open, onClose, onUpdate }: DemoRequestDetailsDialogProps) => {
  const [status, setStatus] = useState(request.status);
  const [priority, setPriority] = useState(request.priority);
  const [scheduledDate, setScheduledDate] = useState(request.scheduled_date || '');
  const [meetingLink, setMeetingLink] = useState(request.meeting_link || '');
  const [adminNotes, setAdminNotes] = useState(request.admin_notes || '');
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (request.id) {
      loadActivityLog();
    }
  }, [request.id]);

  const loadActivityLog = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_request_activity_log')
        .select('*')
        .eq('demo_request_id', request.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivityLog(data || []);
    } catch (error) {
      console.error('Error loading activity log:', error);
    }
  };

  const sendNotificationEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-demo-notification', {
        body: {
          email: request.email,
          fullName: request.full_name,
          companyName: request.company_name,
          status,
          meetingLink: meetingLink || undefined,
          scheduledDate: scheduledDate || undefined,
          adminNotes: adminNotes || undefined
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending notification email:', error);
      // Don't show error to admin - just log it
      console.warn('Email notification failed but request was saved');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const statusChanged = status !== request.status;
    const shouldSendEmail = statusChanged && ['scheduled', 'completed', 'cancelled', 'no_show'].includes(status);
    
    try {
      const updates: any = {
        status,
        priority,
        scheduled_date: scheduledDate || null,
        meeting_link: meetingLink || null,
        admin_notes: adminNotes || null
      };

      const { error } = await supabase
        .from('demo_requests')
        .update(updates)
        .eq('id', request.id);

      if (error) throw error;

      // Log the activity
      await supabase.from('demo_request_activity_log').insert({
        demo_request_id: request.id,
        action_type: 'updated',
        new_value: updates,
        notes: `Admin updated request details${shouldSendEmail ? ' - Email notification sent' : ''}`
      });

      // Send email notification if status changed
      if (shouldSendEmail) {
        await sendNotificationEmail();
      }

      toast({ 
        title: 'Success', 
        description: shouldSendEmail 
          ? 'Demo request updated and email notification sent' 
          : 'Demo request updated successfully' 
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating demo request:', error);
      toast({ title: 'Error', description: 'Failed to update demo request', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this demo request?')) return;

    try {
      const { error } = await supabase
        .from('demo_requests')
        .delete()
        .eq('id', request.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Demo request deleted' });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting demo request:', error);
      toast({ title: 'Error', description: 'Failed to delete demo request', variant: 'destructive' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Copied to clipboard' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Demo Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <p className="text-sm font-medium">{request.full_name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{request.email}</p>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(request.email)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {request.phone_number && (
                <div>
                  <Label>Phone</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{request.phone_number}</p>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(request.phone_number)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              {request.company_name && (
                <div>
                  <Label>Company</Label>
                  <p className="text-sm font-medium">{request.company_name}</p>
                </div>
              )}
              {request.job_title && (
                <div>
                  <Label>Job Title</Label>
                  <p className="text-sm font-medium">{request.job_title}</p>
                </div>
              )}
              {request.organization_size && (
                <div>
                  <Label>Organization Size</Label>
                  <Badge variant="outline">{request.organization_size} employees</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Request Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Request Details</h3>
            {request.preferred_date && (
              <div>
                <Label>Preferred Date</Label>
                <p className="text-sm">{format(new Date(request.preferred_date), 'PPP')}</p>
              </div>
            )}
            {request.preferred_time && (
              <div>
                <Label>Preferred Time</Label>
                <Badge variant="outline">{request.preferred_time}</Badge>
              </div>
            )}
            {request.interest_areas && request.interest_areas.length > 0 && (
              <div>
                <Label>Interest Areas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {request.interest_areas.map((area: string, i: number) => (
                    <Badge key={i} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </div>
            )}
            {request.message && (
              <div>
                <Label>Message</Label>
                <p className="text-sm bg-muted p-3 rounded-lg mt-2">{request.message}</p>
              </div>
            )}
          </div>

          {/* Admin Actions */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Admin Actions</h3>
            
            {/* Email notification preview */}
            {status !== request.status && ['scheduled', 'completed', 'cancelled', 'no_show'].includes(status) && (
              <Alert>
                <Send className="h-4 w-4" />
                <AlertTitle>Email Notification</AlertTitle>
                <AlertDescription>
                  When you save, <strong>{request.email}</strong> will receive an email notification about this status change.
                  {status === 'scheduled' && meetingLink && scheduledDate && (
                    <span className="block mt-1 text-sm">
                      The email will include the meeting link and scheduled date.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Scheduled Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Meeting Link</Label>
                <Input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Admin Notes</Label>
              <Textarea
                placeholder="Add notes about this demo request..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Activity Timeline</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activityLog.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity yet</p>
              ) : (
                activityLog.map((log) => (
                  <div key={log.id} className="flex gap-3 text-sm">
                    <div className="flex-shrink-0">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{log.action_type}</p>
                      {log.notes && <p className="text-muted-foreground">{log.notes}</p>}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), 'PPP p')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 border-t pt-4 text-sm text-muted-foreground">
            <p>Source: {request.source}</p>
            {request.utm_source && <p>UTM Source: {request.utm_source}</p>}
            {request.utm_campaign && <p>UTM Campaign: {request.utm_campaign}</p>}
            <p>Created: {format(new Date(request.created_at), 'PPP p')}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between border-t pt-4">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Request
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};