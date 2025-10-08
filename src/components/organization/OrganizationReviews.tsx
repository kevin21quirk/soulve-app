import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  reviewer_type: string;
  is_verified: boolean;
  is_anonymous: boolean;
  helpful_count: number;
  created_at: string;
  reviewer?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

interface OrganizationReviewsProps {
  organizationId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onReviewAdded: () => void;
}

const OrganizationReviews = ({
  organizationId,
  reviews,
  averageRating,
  totalReviews,
  onReviewAdded,
}: OrganizationReviewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!user) {
      toast({ title: 'Please sign in to leave a review', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('organization_reviews').insert({
      organization_id: organizationId,
      reviewer_id: user.id,
      rating,
      review_text: reviewText || null,
    });

    setIsSubmitting(false);

    if (error) {
      toast({ title: 'Failed to submit review', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Review submitted successfully!' });
      setReviewText('');
      setRating(5);
      onReviewAdded();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reviews & Ratings</span>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-[hsl(var(--soulve-orange))] text-[hsl(var(--soulve-orange))]'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({totalReviews})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Submit Review */}
        <div className="space-y-3 p-4 border rounded-lg">
          <h4 className="font-semibold">Leave a Review</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 cursor-pointer transition-colors ${
                    star <= rating
                      ? 'fill-[hsl(var(--soulve-orange))] text-[hsl(var(--soulve-orange))]'
                      : 'text-muted hover:text-[hsl(var(--soulve-orange))]'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Share your experience with this organization..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
          />
          <Button onClick={handleSubmitReview} disabled={isSubmitting}>
            Submit Review
          </Button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.reviewer?.avatar_url || ''} />
                    <AvatarFallback>
                      {review.is_anonymous ? 'A' : review.reviewer?.first_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {review.is_anonymous
                        ? 'Anonymous'
                        : `${review.reviewer?.first_name} ${review.reviewer?.last_name}`}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? 'fill-[hsl(var(--soulve-orange))] text-[hsl(var(--soulve-orange))]'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(review.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {review.is_verified && <Badge variant="secondary">Verified</Badge>}
                  <Badge variant="outline">{review.reviewer_type}</Badge>
                </div>
              </div>
              {review.review_text && (
                <p className="text-sm text-muted-foreground">{review.review_text}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Button variant="ghost" size="sm" className="h-7 gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  Helpful ({review.helpful_count})
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationReviews;
