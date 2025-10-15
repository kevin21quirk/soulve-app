import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ESG_EXTENDED_QUERY_KEYS } from '@/services/esgService';

interface UseESGRealtimeUpdatesProps {
  organizationId: string;
  enabled?: boolean;
}

export const useESGRealtimeUpdates = ({ 
  organizationId, 
  enabled = true 
}: UseESGRealtimeUpdatesProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    const setupRealtimeSubscription = () => {
      // Clean up existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const channel = supabase
        .channel('esg-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'esg_data_requests',
            filter: `requesting_org_id=eq.${organizationId}`
          },
          (payload) => {
            console.log('ESG data request update:', payload);
            
            // Invalidate data requests query
            queryClient.invalidateQueries({ 
              queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_DATA_REQUESTS(organizationId) 
            });

            if (payload.eventType === 'INSERT') {
              toast({
                title: "New Data Request",
                description: "A new ESG data request has been received",
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'stakeholder_data_contributions',
            filter: `organization_id=eq.${organizationId}`
          },
          (payload) => {
            console.log('Stakeholder contribution update:', payload);
            
            // Invalidate contributions query
            queryClient.invalidateQueries({ 
              queryKey: ESG_EXTENDED_QUERY_KEYS.STAKEHOLDER_CONTRIBUTIONS(organizationId) 
            });

            if (payload.eventType === 'INSERT') {
              toast({
                title: "New Contribution",
                description: "A stakeholder has submitted new ESG data",
              });
            } else if (payload.eventType === 'UPDATE') {
              const newStatus = (payload.new as any)?.verification_status;
              const oldStatus = (payload.old as any)?.verification_status;
              
              if (newStatus !== oldStatus && newStatus === 'approved') {
                // Recalculate initiative progress
                const initiativeId = (payload.new as any)?.initiative_id;
                if (initiativeId) {
                  queryClient.invalidateQueries({ 
                    queryKey: ['esg-initiatives', organizationId] 
                  });
                }
                
                toast({
                  title: "Contribution Approved",
                  description: "A stakeholder contribution has been approved",
                });
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'esg_initiatives',
            filter: `organization_id=eq.${organizationId}`
          },
          (payload) => {
            console.log('ESG initiative update:', payload);
            
            // Invalidate initiatives query
            queryClient.invalidateQueries({ 
              queryKey: ['esg-initiatives', organizationId] 
            });

            if (payload.eventType === 'INSERT') {
              toast({
                title: "Initiative Created",
                description: "A new ESG initiative has been created",
              });
            } else if (payload.eventType === 'UPDATE') {
              const newProgress = (payload.new as any)?.progress_percentage;
              const oldProgress = (payload.old as any)?.progress_percentage;
              
              if (newProgress !== oldProgress && newProgress > oldProgress) {
                const initiativeName = (payload.new as any)?.initiative_name;
                toast({
                  title: "Progress Update",
                  description: `Initiative "${initiativeName}" is now ${newProgress}% complete! 🎉`,
                });
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'esg_announcements',
            filter: `organization_id=eq.${organizationId}`
          },
          (payload) => {
            console.log('ESG announcement update:', payload);
            
            // Invalidate announcements query
            queryClient.invalidateQueries({ 
              queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_ANNOUNCEMENTS(organizationId) 
            });

            if (payload.eventType === 'INSERT') {
              toast({
                title: "New Announcement",
                description: "A new ESG announcement has been posted",
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'esg_reports',
            filter: `organization_id=eq.${organizationId}`
          },
          (payload) => {
            console.log('ESG report update:', payload);
            
            // Invalidate reports query
            queryClient.invalidateQueries({ 
              queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_REPORTS(organizationId) 
            });

            if (payload.eventType === 'INSERT') {
              toast({
                title: "Report Generated",
                description: "Your ESG report is ready for download",
              });
            } else if (payload.eventType === 'UPDATE') {
              const newStatus = (payload.new as any)?.status;
              const oldStatus = (payload.old as any)?.status;
              
              if (newStatus !== oldStatus && newStatus === 'approved') {
                toast({
                  title: "Report Approved",
                  description: "Your ESG report has been approved",
                });
              }
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('ESG real-time subscription established');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('ESG real-time channel error, attempting reconnection...');
            toast({
              title: "Connection Issue",
              description: "Reconnecting to live updates...",
              variant: "destructive"
            });
            
            setTimeout(() => {
              setupRealtimeSubscription();
            }, 3000);
          }
        });

      channelRef.current = channel;
    };

    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [organizationId, enabled, queryClient, toast]);
};
