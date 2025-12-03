import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, MapPin, Users, Calendar, CheckCircle2, Briefcase, HandHeart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { VolunteerOpportunity } from '@/services/volunteerManagementService';
import VolunteerApplicationModal from './VolunteerApplicationModal';
import { useAuth } from '@/contexts/AuthContext';

interface VolunteerOpportunityCardProps {
  opportunityId: string;
}

const VolunteerOpportunityCard = ({ opportunityId }: VolunteerOpportunityCardProps) => {
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const { data, error } = await supabase
          .from('volunteer_opportunities')
          .select('*')
          .eq('id', opportunityId)
          .single();

        if (error) throw error;
        setOpportunity(data as VolunteerOpportunity);

        // Check if user has already applied
        if (user?.id) {
          const { data: application } = await supabase
            .from('volunteer_applications')
            .select('id')
            .eq('opportunity_id', opportunityId)
            .eq('user_id', user.id)
            .single();

          setHasApplied(!!application);
        }
      } catch (error) {
        console.error('Error fetching opportunity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (opportunityId) {
      fetchOpportunity();
    }
  }, [opportunityId, user?.id]);

  if (isLoading || !opportunity) {
    return (
      <div className="bg-accent/30 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-accent rounded w-3/4 mb-2" />
        <div className="h-3 bg-accent rounded w-1/2" />
      </div>
    );
  }

  const spotsRemaining = opportunity.max_volunteers 
    ? opportunity.max_volunteers - opportunity.current_volunteers 
    : null;

  const progressPercentage = opportunity.max_volunteers 
    ? (opportunity.current_volunteers / opportunity.max_volunteers) * 100 
    : 0;

  const isDeadlinePassed = opportunity.application_deadline 
    ? new Date(opportunity.application_deadline) < new Date() 
    : false;

  const isFull = spotsRemaining !== null && spotsRemaining <= 0;

  return (
    <>
      <div className="bg-gradient-to-br from-primary/5 to-accent/30 rounded-lg p-4 border border-primary/20">
        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground">
            <HandHeart className="h-3 w-3 mr-1" />
            Volunteer Opportunity
          </Badge>
          {opportunity.is_remote && (
            <Badge variant="outline" className="text-xs">Remote</Badge>
          )}
          {opportunity.status === 'active' && !isFull && !isDeadlinePassed && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              Accepting Applications
            </Badge>
          )}
        </div>

        {/* Skills Needed */}
        {opportunity.skills_needed && opportunity.skills_needed.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {opportunity.skills_needed.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
            {opportunity.skills_needed.length > 5 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{opportunity.skills_needed.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          {opportunity.time_commitment && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{opportunity.time_commitment}</span>
            </div>
          )}
          {opportunity.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{opportunity.is_remote ? 'Remote' : opportunity.location}</span>
            </div>
          )}
          {opportunity.application_deadline && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className={isDeadlinePassed ? 'text-destructive' : ''}>
                {isDeadlinePassed ? 'Deadline passed' : `Apply by ${new Date(opportunity.application_deadline).toLocaleDateString()}`}
              </span>
            </div>
          )}
          {spotsRemaining !== null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className={isFull ? 'text-destructive' : ''}>
                {isFull ? 'No spots remaining' : `${spotsRemaining} spot${spotsRemaining === 1 ? '' : 's'} left`}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {opportunity.max_volunteers && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{opportunity.current_volunteers} volunteer{opportunity.current_volunteers === 1 ? '' : 's'} joined</span>
              <span>Goal: {opportunity.max_volunteers}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Requirements Badges */}
        {(opportunity.background_check_required || opportunity.training_required) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {opportunity.background_check_required && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Background Check Required
              </Badge>
            )}
            {opportunity.training_required && (
              <Badge variant="outline" className="text-xs">
                <Briefcase className="h-3 w-3 mr-1" />
                Training Required
              </Badge>
            )}
          </div>
        )}

        {/* Apply Button */}
        <Button 
          className="w-full"
          onClick={() => setShowApplicationModal(true)}
          disabled={hasApplied || isFull || isDeadlinePassed}
        >
          {hasApplied ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Application Submitted
            </>
          ) : isFull ? (
            'Opportunity Full'
          ) : isDeadlinePassed ? (
            'Deadline Passed'
          ) : (
            <>
              <HandHeart className="h-4 w-4 mr-2" />
              Apply Now
            </>
          )}
        </Button>
      </div>

      <VolunteerApplicationModal
        opportunity={opportunity}
        open={showApplicationModal}
        onOpenChange={setShowApplicationModal}
        onSuccess={() => setHasApplied(true)}
      />
    </>
  );
};

export default VolunteerOpportunityCard;
