
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HelpCompletionRequest } from '@/types/helpCompletion';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import HelpCompletionReview from './HelpCompletionReview';
import DisputeResolutionDialog from './DisputeResolutionDialog';
import AutomatedPointsDisplay from './AutomatedPointsDisplay';

interface HelpApprovalCardProps {
  request: HelpCompletionRequest;
  helperName?: string;
  helperAvatar?: string;
  postTitle?: string;
}

const HelpApprovalCard = ({ request, helperName, helperAvatar, postTitle }: HelpApprovalCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showDispute, setShowDispute] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleDispute = (requestId: string) => {
    setShowDispute(true);
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Help Completion Review
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Pending Review
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={helperAvatar} alt={helperName} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              {helperName?.charAt(0) || 'H'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <p className="font-medium">{helperName || 'Helper'}</p>
            <p className="text-sm text-gray-600">completed helping with:</p>
            <p className="text-sm font-medium">{postTitle}</p>
          </div>
        </div>

        {request.helper_message && (
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-sm text-gray-600 mb-1">Helper's message:</p>
            <p className="text-sm">{request.helper_message}</p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Submitted {formatTimeAgo(request.created_at)}
        </div>

        {!expanded ? (
          <div className="flex gap-2">
            <Button
              onClick={() => setExpanded(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Review & Approve
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <HelpCompletionReview
              request={request}
              helperName={helperName}
              helperAvatar={helperAvatar}
              postTitle={postTitle}
              onDispute={handleDispute}
            />
            
            <AutomatedPointsDisplay
              completionRequest={request}
              helperName={helperName}
            />
            
            {showDispute && (
              <DisputeResolutionDialog completionRequestId={request.id} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HelpApprovalCard;
