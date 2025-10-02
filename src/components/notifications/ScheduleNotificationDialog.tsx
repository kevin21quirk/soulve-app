import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useScheduledNotifications } from '@/hooks/useScheduledNotifications';
import { useNotificationTemplates } from '@/hooks/useNotificationTemplates';

interface ScheduleNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
}

const ScheduleNotificationDialog = ({
  open,
  onOpenChange,
  recipientId,
}: ScheduleNotificationDialogProps) => {
  const { scheduleNotification } = useScheduledNotifications();
  const { templates, renderTemplate } = useNotificationTemplates();
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('system');
  const [priority, setPriority] = useState<'urgent' | 'high' | 'normal' | 'low'>('normal');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('12:00');

  const handleSubmit = async () => {
    if (!scheduledDate || !title || !message) return;

    const [hours, minutes] = scheduledTime.split(':');
    const scheduledFor = new Date(scheduledDate);
    scheduledFor.setHours(parseInt(hours), parseInt(minutes));

    await scheduleNotification({
      recipient_id: recipientId,
      template_id: useTemplate ? selectedTemplateId : undefined,
      title,
      message,
      type,
      priority,
      scheduled_for: scheduledFor.toISOString(),
      metadata: {},
    });

    onOpenChange(false);
    resetForm();
  };

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    const rendered = await renderTemplate(templateId, {});
    if (rendered) {
      setTitle(rendered.title);
      setMessage(rendered.message);
      setType(rendered.type);
      setPriority(rendered.priority as 'urgent' | 'high' | 'normal' | 'low');
    }
  };

  const resetForm = () => {
    setUseTemplate(false);
    setSelectedTemplateId('');
    setTitle('');
    setMessage('');
    setType('system');
    setPriority('normal');
    setScheduledDate(undefined);
    setScheduledTime('12:00');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Notification</DialogTitle>
          <DialogDescription>
            Schedule a notification to be sent at a later time
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useTemplate"
              checked={useTemplate}
              onChange={(e) => setUseTemplate(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="useTemplate">Use Template</Label>
          </div>

          {useTemplate && (
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="message">Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as 'urgent' | 'high' | 'normal' | 'low')}>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !message || !scheduledDate}>
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleNotificationDialog;
