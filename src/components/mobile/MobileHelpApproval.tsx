
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHelpCompletion } from '@/hooks/useHelpCompletion';
import { CheckCircle, Clock, Star, ChevronDown, Eye, Flag } from 'lucide-react';
import { HelpCompletionRequest } from '@/types/helpCompletion';
import DisputeResolutionDialog from '@/components/help-completion/DisputeResolutionDialog';

const MobileHelpApproval = () => {
  const { pendingRequests, reviewCompletionRequest, loading } = useHelpCompletion();
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [showEvidence, setShowEvidence] = useState<Record<string, boolean>>({});

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

  const toggleEvidence = (requestId: string) => {
    setShowEvidence(prev => ({ ...prev, [requestId]: !prev[requestId] }));
  };

  const renderEvidence = (request: HelpCompletionRequest) => {
    if (!request.completion_evidence || Object.keys(request.completion_evidence).length === 0) {
      return <p className="text-xs text-gray-500">No evidence submitted</p>;
    }

    const evidence = request.completion_evidence as any;
    
    return (
      <div className="space-y-2 text-xs">
        {evidence.files && evidence.files.length > 0 && (
          <div>
            <span className="font-medium">Files:</span>
            <div className="space-y-1">
              {evidence.files.slice(0, 2).map((file: string, index: number) => (
                <a
                  key={index}
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline truncate"
                >
                  {file}
                </a>
              ))}
              {evidence.files.length > 2 && (
                <p className="text-gray-500">+{evidence.files.length - 2} more files</p>
              )}
            </div>
          </div>
        )}
        
        {evidence.location && (
          <div>
            <span className="font-medium">Location:</span>
            <span className="ml-1">{evidence.location}</span>
          </div>
        )}
        
        {evidence.timeSpent && (
          <div>
            <span className="font-medium">Time:</span>
            <span className="ml-1">{evidence.timeSpent}</span>
          </div>
        )}
      </div>
    );
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

            {/* Evidence Toggle */}
            {request.completion_evidence && Object.keys(request.completion_evidence).length > 0 && (
              <div className="mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEvidence(request.id)}
                  className="text-xs p-2 h-auto"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {showEvidence[request.id] ? 'Hide' : 'View'} Evidence
                </Button>
                
                {showEvidence[request.id] && (
                  <div className="bg-white p-3 rounded-lg border mt-2">
                    {renderEvidence(request)}
                  </div>
                )}
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

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm py-2"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve & Award Points
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      disabled={loading}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50 text-sm py-2"
                    >
                      Reject
                    </Button>
                    
                    <DisputeResolutionDialog completionRequestId={request.id}>
                      <Button
                        variant="outline"
                        className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 text-sm py-2"
                      >
                        <Flag className="h-4 w-4 mr-1" />
                        Dispute
                      </Button>
                    </DisputeResolutionDialog>
                  </div>
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
