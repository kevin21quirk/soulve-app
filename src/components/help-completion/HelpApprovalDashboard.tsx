
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHelpCompletion } from '@/hooks/useHelpCompletion';
import { supabase } from '@/integrations/supabase/client';
import HelpApprovalCard from './HelpApprovalCard';
import { CheckCircle, Clock, Award } from 'lucide-react';

const HelpApprovalDashboard = () => {
  const { pendingRequests, myRequests, loading } = useHelpCompletion();
  const [helperProfiles, setHelperProfiles] = useState<Record<string, any>>({});
  const [postTitles, setPostTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadHelperData = async () => {
      if (pendingRequests.length === 0) return;

      // Load helper profiles
      const helperIds = [...new Set(pendingRequests.map(req => req.helper_id))].filter(id => typeof id === 'string') as string[];
      if (helperIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', helperIds);

        if (profiles) {
          const profilesMap = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as Record<string, any>);
          setHelperProfiles(profilesMap);
        }
      }

      // Load post titles
      const postIds = [...new Set(pendingRequests.map(req => req.post_id))].filter(id => typeof id === 'string') as string[];
      if (postIds.length > 0) {
        const { data: posts } = await supabase
          .from('posts')
          .select('id, title')
          .in('id', postIds);

        if (posts) {
          const titlesMap = posts.reduce((acc, post) => {
            acc[post.id] = post.title;
            return acc;
          }, {} as Record<string, string>);
          setPostTitles(titlesMap);
        }
      }
    };

    loadHelperData();
  }, [pendingRequests]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Submissions</p>
                <p className="text-2xl font-bold">{myRequests.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved This Week</p>
                <p className="text-2xl font-bold">
                  {myRequests.filter(req => req.status === 'approved').length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Your Review ({pendingRequests.length})
          </h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => {
              const helper = helperProfiles[request.helper_id];
              const helperName = helper ? `${helper.first_name || ''} ${helper.last_name || ''}`.trim() : 'Helper';
              const postTitle = postTitles[request.post_id] || 'Help Request';

              return (
                <HelpApprovalCard
                  key={request.id}
                  request={request}
                  helperName={helperName}
                  helperAvatar={helper?.avatar_url}
                  postTitle={postTitle}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* My Submissions Status */}
      {myRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            My Help Submissions ({myRequests.length})
          </h3>
          <div className="space-y-4">
            {myRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{postTitles[request.post_id] || 'Help Request'}</p>
                      <p className="text-sm text-gray-600">
                        Submitted {new Date(request.created_at).toLocaleDateString()}
                      </p>
                      {request.helper_message && (
                        <p className="text-sm text-gray-500 mt-1">"{request.helper_message}"</p>
                      )}
                    </div>
                    <Badge
                      variant={
                        request.status === 'approved' ? 'default' :
                        request.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                      className={
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {request.status === 'approved' ? 'Approved' :
                       request.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {pendingRequests.length === 0 && myRequests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Help Completions</h3>
            <p className="text-gray-600">
              When someone helps you or you help others, completion requests will appear here for review.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HelpApprovalDashboard;
