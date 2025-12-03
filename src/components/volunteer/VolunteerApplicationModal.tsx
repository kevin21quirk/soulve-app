import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Calendar, Loader2 } from 'lucide-react';
import { VolunteerManagementService, VolunteerOpportunity } from '@/services/volunteerManagementService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface VolunteerApplicationModalProps {
  opportunity: VolunteerOpportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const VolunteerApplicationModal = ({ opportunity, open, onOpenChange, onSuccess }: VolunteerApplicationModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    application_message: '',
    availability: '',
    relevant_experience: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!opportunity || !user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to apply.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await VolunteerManagementService.applyForOpportunity(opportunity.id, {
        application_message: formData.application_message,
        availability: formData.availability,
        relevant_experience: formData.relevant_experience
      });

      toast({
        title: 'Application Submitted!',
        description: 'Your volunteer application has been sent to the organisation.',
      });

      setFormData({ application_message: '', availability: '', relevant_experience: '' });
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Application error:', error);
      toast({
        title: 'Application Failed',
        description: error.message || 'Failed to submit application. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!opportunity) return null;

  const spotsRemaining = opportunity.max_volunteers 
    ? opportunity.max_volunteers - opportunity.current_volunteers 
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Apply to Volunteer</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {opportunity.title}
          </DialogDescription>
        </DialogHeader>

        {/* Opportunity Summary */}
        <div className="bg-accent/50 rounded-lg p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {opportunity.skills_needed?.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            {opportunity.time_commitment && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{opportunity.time_commitment}</span>
              </div>
            )}
            {opportunity.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{opportunity.is_remote ? 'Remote' : opportunity.location}</span>
              </div>
            )}
            {spotsRemaining !== null && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{spotsRemaining} spots remaining</span>
              </div>
            )}
            {opportunity.application_deadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Deadline: {new Date(opportunity.application_deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {(opportunity.background_check_required || opportunity.training_required) && (
            <div className="flex gap-2 pt-2 border-t border-border">
              {opportunity.background_check_required && (
                <Badge variant="outline" className="text-xs">Background Check Required</Badge>
              )}
              {opportunity.training_required && (
                <Badge variant="outline" className="text-xs">Training Required</Badge>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="application_message">Why do you want to volunteer? *</Label>
            <Textarea
              id="application_message"
              placeholder="Tell us why you're interested in this opportunity and what motivates you..."
              value={formData.application_message}
              onChange={(e) => setFormData({ ...formData, application_message: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Your Availability *</Label>
            <Input
              id="availability"
              placeholder="e.g., Weekends, Monday evenings, Flexible"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relevant_experience">Relevant Experience</Label>
            <Textarea
              id="relevant_experience"
              placeholder="Share any relevant skills or experience you have..."
              value={formData.relevant_experience}
              onChange={(e) => setFormData({ ...formData, relevant_experience: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VolunteerApplicationModal;
