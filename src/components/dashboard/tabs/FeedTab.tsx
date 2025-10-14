import RealSocialFeed from '../RealSocialFeed';

interface FeedTabProps {
  organizationId?: string | null;
}

const FeedTab = ({ organizationId }: FeedTabProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <RealSocialFeed organizationId={organizationId} />
    </div>
  );
};

export default FeedTab;
