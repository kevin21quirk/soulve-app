
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalyticsTracking } from '@/services/analyticsService';
import EnhancedCampaignAnalytics from './EnhancedCampaignAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

const CampaignAnalyticsWrapper = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackView } = useAnalyticsTracking();
  
  // Ensure we have a campaign ID
  const validCampaignId = campaignId || '';

  // Create a session ID for tracking unique views
  const [sessionId] = useState(`session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

  // Fetch campaign details
  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['campaign', validCampaignId],
    queryFn: async () => {
      if (!validCampaignId) throw new Error('No campaign ID provided');
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', validCampaignId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!validCampaignId,
  });

  // Track page view
  useEffect(() => {
    if (campaign && validCampaignId) {
      // Get user's session
      supabase.auth.getSession().then(({ data }) => {
        const userId = data.session?.user?.id;
        
        // Track the view
        trackView(validCampaignId, {
          userId,
          sessionId,
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent
        });
      });
    }
  }, [campaign, validCampaignId, sessionId, trackView]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full mt-6" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 mb-6">
            The campaign you're looking for either doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Calculate days remaining
  const daysRemaining = campaign.end_date 
    ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
    : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <EnhancedCampaignAnalytics 
        campaignId={validCampaignId}
        campaignTitle={campaign.title}
        goalAmount={campaign.goal_amount}
        currentAmount={campaign.current_amount}
        daysRemaining={daysRemaining}
      />
    </div>
  );
};

export default CampaignAnalyticsWrapper;
