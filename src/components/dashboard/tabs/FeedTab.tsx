
import RealSocialFeed from '../RealSocialFeed';
import MyESGImpact from '../MyESGImpact';

interface FeedTabProps {
  organizationId?: string | null;
}

const FeedTab = ({ organizationId }: FeedTabProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <MyESGImpact />
      <RealSocialFeed organizationId={organizationId} />
    </div>
  );
};

export default FeedTab;
