
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHelpCompletion } from '@/hooks/useHelpCompletion';
import { CheckCircle, Clock, Star, ChevronDown } from 'lucide-react';
import { HelpCompletionRequest } from '@/types/helpCompletion';

const MobileHelpApproval = () => {
  const { pendingRequests, reviewCompletionRequest, loading } = useHelpCompletion();
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleApprove = async (requestId: string) => {
    await reviewCompletionRequest(requestId, {
      status: 'approved',
      feedback_rating: ratings[requestId] || 5
    });
    setExpandedRequest(null);
  };

  const handleReject = async (requestId: string) => {
    await reviewCompletionRequest(requestId, {
      status: 'rejected'
    });
    setExpandedRequest(null);
  };

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
        <p className="text-gray-600 text-sm">
          When someone helps you, their completion requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Help Approvals</h2>
        <Badge variant="secondary">{pendingRequests.length} pending</Badge>
      </div>

      {pendingRequests.map((request) => (
        <Card key={request.id} className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Help Completed</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedRequest(
                  expandedRequest === request.id ? null : request.id
                )}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  expandedRequest === request.id ? 'rotate-180' : ''
                }`} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {request.helper_message && (
              <div className="bg-white p-3 rounded-lg mb-3 text-sm">
                "{request.helper_message}"
              </div>
            )}

            {expandedRequest === request.id && (
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm font-medium mb-2">Rate the help (1-5 stars)</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRatings(prev => ({ ...prev, [request.id]: star }))}
                        className={`p-1 ${
                          star <= (ratings[request.id] || 5) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(request.id)}
                    disabled={loading}
                    className="border-red-300 text-red-600 hover:bg-red-50 text-sm py-2"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )}

            {expandedRequest !== request.id && (
              <Button
                onClick={() => setExpandedRequest(request.id)}
                variant="outline"
                className="w-full text-sm"
              >
                Review & Approve
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MobileHelpApproval;
