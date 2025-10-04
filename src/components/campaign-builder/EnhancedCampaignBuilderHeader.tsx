
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const EnhancedCampaignBuilderHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
          Campaign Center
        </h1>
        <p className="text-gray-600 mt-2">Create, manage, and analyze your fundraising campaigns</p>
      </div>
      <Badge variant="soulve" className="px-4 py-2">
        <Sparkles className="h-4 w-4 mr-2" />
        Enhanced Builder
      </Badge>
    </div>
  );
};

export default EnhancedCampaignBuilderHeader;
