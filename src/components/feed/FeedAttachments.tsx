import { usePostAttachments } from '@/hooks/usePostAttachments';
import PollDisplay from './PollDisplay';
import EventDisplay from './EventDisplay';
import GifDisplay from './GifDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { Component, ReactNode } from 'react';

// Error boundary to prevent attachment errors from crashing the feed
class AttachmentErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('FeedAttachments error:', error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Silently fail - don't show broken attachment
    }
    return this.props.children;
  }
}

interface FeedAttachmentsProps {
  postId: string;
}

export const FeedAttachments = ({ postId }: FeedAttachmentsProps) => {
  const { pollData, eventData, gifData, isLoading } = usePostAttachments(postId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (!pollData && !eventData && !gifData) {
    return null;
  }

  return (
    <AttachmentErrorBoundary>
      <div className="space-y-4 mb-4">
        {gifData && <GifDisplay gifData={gifData} />}
        {pollData && <PollDisplay postId={postId} pollData={pollData} />}
        {eventData && <EventDisplay postId={postId} eventData={eventData} />}
      </div>
    </AttachmentErrorBoundary>
  );
};

export default FeedAttachments;
