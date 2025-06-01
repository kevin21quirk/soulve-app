
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HelpCompletionRequest } from '@/types/helpCompletion';
import { useHelpCompletion } from '@/hooks/useHelpCompletion';
import { CheckCircle, XCircle, Clock, Star } from 'lucide-react';

interface HelpApprovalCardProps {
  request: HelpCompletionRequest;
  helperName?: string;
  helperAvatar?: string;
  postTitle?: string;
}

const HelpApprovalCard = ({ request, helperName, helperAvatar, postTitle }: HelpApprovalCardProps) => {
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState('');
  const { reviewCompletionRequest, loading } = useHelpCompletion();

  const handleApprove = async () => {
    await reviewCompletionRequest(request.id, {
      status: 'approved',
      feedback_rating: rating,
      feedback_message: feedback || undefined
    });
    setShowReview(false);
  };

  const handleReject = async () => {
    await reviewCompletionRequest(request.id, {
      status: 'rejected',
      feedback_message: feedback || undefined
    });
    setShowReview(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Help Completion Review
          </CardTitle>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending Review
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
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

        {!showReview ? (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowReview(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Review & Approve
            </Button>
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={loading}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        ) : (
          <div className="space-y-4 border-t pt-4">
            <div>
              <Label className="text-sm font-medium">Rate the help (1-5 stars)</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                ))}
              </div>
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

            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "Processing..." : "Approve & Award Points"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReview(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HelpApprovalCard;
