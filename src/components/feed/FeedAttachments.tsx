import { usePostAttachments } from '@/hooks/usePostAttachments';
import PollDisplay from './PollDisplay';
import EventDisplay from './EventDisplay';
import GifDisplay from './GifDisplay';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="space-y-4 mb-4">
      {gifData && <GifDisplay gifData={gifData} />}
      {pollData && <PollDisplay postId={postId} pollData={pollData} />}
      {eventData && <EventDisplay postId={postId} eventData={eventData} />}
    </div>
  );
};

export default FeedAttachments;
