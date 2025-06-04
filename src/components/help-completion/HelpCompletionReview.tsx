
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ThumbsUp, ThumbsDown, Flag, Eye } from 'lucide-react';
import { useHelpCompletion } from '@/hooks/useHelpCompletion';
import { HelpCompletionRequest } from '@/types/helpCompletion';

interface HelpCompletionReviewProps {
  request: HelpCompletionRequest;
  helperName?: string;
  helperAvatar?: string;
  postTitle?: string;
  onDispute?: (requestId: string) => void;
}

const HelpCompletionReview = ({ 
  request, 
  helperName, 
  helperAvatar, 
  postTitle,
  onDispute 
}: HelpCompletionReviewProps) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState('');
  const [showEvidence, setShowEvidence] = useState(false);
  const { reviewCompletionRequest, loading } = useHelpCompletion();

  const handleApprove = async () => {
    await reviewCompletionRequest(request.id, {
      status: 'approved',
      feedback_rating: rating,
      feedback_message: feedback || undefined
    });
  };

  const handleReject = async () => {
    await reviewCompletionRequest(request.id, {
      status: 'rejected',
      feedback_message: feedback || "Work did not meet expectations"
    });
  };

  const renderStarRating = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating(star)}
          className={`p-1 transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          <Star className="h-5 w-5 fill-current" />
        </button>
      ))}
    </div>
  );

  const renderEvidence = () => {
    if (!request.completion_evidence || Object.keys(request.completion_evidence).length === 0) {
      return <p className="text-sm text-gray-500">No evidence submitted</p>;
    }

    const evidence = request.completion_evidence as any;
    
    return (
      <div className="space-y-3">
        {evidence.files && evidence.files.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Files:</Label>
            <div className="space-y-1">
              {evidence.files.map((file: string, index: number) => (
                <a
                  key={index}
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline truncate"
                >
                  {file}
                </a>
              ))}
            </div>
          </div>
        )}
        
        {evidence.location && (
          <div>
            <Label className="text-sm font-medium">Location:</Label>
            <p className="text-sm">{evidence.location}</p>
          </div>
        )}
        
        {evidence.timeSpent && (
          <div>
            <Label className="text-sm font-medium">Time Spent:</Label>
            <p className="text-sm">{evidence.timeSpent}</p>
          </div>
        )}
        
        {evidence.description && (
          <div>
            <Label className="text-sm font-medium">Description:</Label>
            <p className="text-sm">{evidence.description}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Review Help Completion</CardTitle>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending Review
          </Badge>
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
            <p className="text-sm text-gray-600 mb-1">Helper's completion message:</p>
            <p className="text-sm">{request.helper_message}</p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Evidence Submitted</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEvidence(!showEvidence)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {showEvidence ? 'Hide' : 'View'} Evidence
            </Button>
          </div>
          
          {showEvidence && (
            <div className="bg-white p-3 rounded-lg border">
              {renderEvidence()}
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Rate the help (1-5 stars)</Label>
          {renderStarRating()}
        </div>

        <div>
          <Label htmlFor="feedback">Feedback (Optional)</Label>
          <Textarea
            id="feedback"
            placeholder="Leave feedback for the helper..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleApprove}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {loading ? "Processing..." : "Approve & Award Points"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={loading}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Reject
          </Button>
          
          {onDispute && (
            <Button
              variant="outline"
              onClick={() => onDispute(request.id)}
              disabled={loading}
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <Flag className="h-4 w-4 mr-2" />
              Dispute
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpCompletionReview;
