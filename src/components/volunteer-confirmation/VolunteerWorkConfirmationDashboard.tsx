import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVolunteerWorkConfirmation } from '@/hooks/useVolunteerWorkConfirmation';
import { supabase } from '@/integrations/supabase/client';
import VolunteerWorkConfirmationCard from './VolunteerWorkConfirmationCard';
import { CheckCircle, Clock, Award, XCircle } from 'lucide-react';

const VolunteerWorkConfirmationDashboard = () => {
  const { pendingConfirmations, mySubmissions, loading, confirmWork, rejectWork } = useVolunteerWorkConfirmation();
  const [volunteerProfiles, setVolunteerProfiles] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadVolunteerProfiles = async () => {
      if (pendingConfirmations.length === 0) return;

      const volunteerIds = [...new Set(pendingConfirmations.map(act => act.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', volunteerIds);

      if (profiles) {
        const profilesMap = profiles.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);
        setVolunteerProfiles(profilesMap);
      }
    };

    loadVolunteerProfiles();
  }, [pendingConfirmations]);

  if (loading && pendingConfirmations.length === 0 && mySubmissions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const confirmedSubmissions = mySubmissions.filter(s => s.confirmation_status === 'confirmed');
  const rejectedSubmissions = mySubmissions.filter(s => s.confirmation_status === 'rejected');
  const pendingSubmissions = mySubmissions.filter(s => s.confirmation_status === 'pending');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold">{pendingConfirmations.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Pending</p>
                <p className="text-2xl font-bold">{pendingSubmissions.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{confirmedSubmissions.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold">
                  {confirmedSubmissions.reduce((sum, s) => sum + s.points_earned, 0)}
                </p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Confirmations */}
      {pendingConfirmations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Awaiting Your Confirmation ({pendingConfirmations.length})
          </h3>
          <div className="space-y-4">
            {pendingConfirmations.map((activity) => {
              const volunteer = volunteerProfiles[activity.user_id];
              const volunteerName = volunteer 
                ? `${volunteer.first_name || ''} ${volunteer.last_name || ''}`.trim() 
                : 'Volunteer';

              return (
                <VolunteerWorkConfirmationCard
                  key={activity.id}
                  activity={activity}
                  volunteerName={volunteerName}
                  volunteerAvatar={volunteer?.avatar_url}
                  onConfirm={confirmWork}
                  onReject={rejectWork}
                  loading={loading}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* My Submissions */}
      {mySubmissions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" />
            My Volunteer Work Submissions ({mySubmissions.length})
          </h3>
          <div className="space-y-4">
            {mySubmissions.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{activity.description}</h4>
                        <Badge
                          variant={
                            activity.confirmation_status === 'confirmed' ? 'default' :
                            activity.confirmation_status === 'rejected' ? 'destructive' : 'secondary'
                          }
                          className={
                            activity.confirmation_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            activity.confirmation_status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {activity.confirmation_status === 'confirmed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {activity.confirmation_status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                          {activity.confirmation_status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {activity.confirmation_status === 'confirmed' ? 'Confirmed' :
                           activity.confirmation_status === 'rejected' ? 'Declined' : 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{activity.hours_contributed} hours</span>
                        <span>•</span>
                        <span>£{activity.market_value_gbp.toFixed(2)}</span>
                        <span>•</span>
                        <span className="text-primary font-semibold">
                          {activity.confirmation_status === 'confirmed' ? '✓ ' : ''}
                          {activity.points_earned} points
                        </span>
                      </div>

                      {activity.rejection_reason && (
                        <p className="text-sm text-red-600 mt-2">
                          Reason: {activity.rejection_reason}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted {new Date(activity.created_at).toLocaleString()}
                        {activity.confirmed_at && ` • Reviewed ${new Date(activity.confirmed_at).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingConfirmations.length === 0 && mySubmissions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Volunteer Work Confirmations</h3>
            <p className="text-gray-600">
              When you log skill-based volunteer work or when others need to confirm your contributions, they'll appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VolunteerWorkConfirmationDashboard;
