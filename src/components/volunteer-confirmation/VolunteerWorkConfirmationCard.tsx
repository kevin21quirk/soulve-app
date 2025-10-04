import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Clock, CheckCircle, XCircle, Award } from 'lucide-react';
import { VolunteerWorkActivity } from '@/services/volunteerWorkConfirmationService';

interface VolunteerWorkConfirmationCardProps {
  activity: VolunteerWorkActivity;
  volunteerName: string;
  volunteerAvatar?: string;
  onConfirm: (activityId: string) => Promise<any>;
  onReject: (activityId: string, reason: string) => Promise<any>;
  loading?: boolean;
}

const VolunteerWorkConfirmationCard = ({
  activity,
  volunteerName,
  volunteerAvatar,
  onConfirm,
  onReject,
  loading = false
}: VolunteerWorkConfirmationCardProps) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleConfirm = async () => {
    await onConfirm(activity.id);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    await onReject(activity.id, rejectionReason);
    setShowRejectForm(false);
    setRejectionReason('');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={volunteerAvatar} />
            <AvatarFallback>{volunteerName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">{volunteerName}</h4>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Review
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>{activity.hours_contributed} hours contributed</span>
                <span>•</span>
                <span>Market Value: £{activity.market_value_gbp.toFixed(2)}</span>
                <span>•</span>
                <span className="text-primary font-semibold">
                  <Award className="h-3 w-3 inline mr-1" />
                  {activity.points_earned} points
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Description:</span> {activity.description}
              </p>

              {activity.metadata?.skill_name && (
                <Badge variant="outline" className="mb-2">
                  Skill: {activity.metadata.skill_name}
                </Badge>
              )}

              <p className="text-xs text-muted-foreground">
                Submitted {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>

            {!showRejectForm ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm & Award Points
                </Button>
                <Button
                  onClick={() => setShowRejectForm(true)}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea
                  placeholder="Reason for declining (optional)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleReject}
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    Confirm Decline
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason('');
                    }}
                    disabled={loading}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VolunteerWorkConfirmationCard;
