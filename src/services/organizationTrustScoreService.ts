import { supabase } from '@/integrations/supabase/client';

export interface OrganizationTrustScore {
  id: string;
  organization_id: string;
  overall_score: number;
  verification_score: number;
  transparency_score: number;
  engagement_score: number;
  esg_score: number;
  review_score: number;
  calculated_at: string;
}

export const fetchOrganizationTrustScore = async (
  organizationId: string
): Promise<OrganizationTrustScore | null> => {
  const { data, error } = await supabase
    .from('organization_trust_scores')
    .select('*')
    .eq('organization_id', organizationId)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching organization trust score:', error);
    return null;
  }

  return data;
};

export const calculateOrganizationTrustScore = async (
  organizationId: string
): Promise<number | null> => {
  const { data, error } = await supabase.rpc('calculate_organization_trust_score', {
    org_id: organizationId,
  });

  if (error) {
    console.error('Error calculating organization trust score:', error);
    return null;
  }

  return data;
};

export const getTrustScoreColor = (score: number) => {
  if (score >= 90) return 'from-[hsl(var(--soulve-green))] to-[hsl(var(--soulve-teal))]';
  if (score >= 80) return 'from-[hsl(var(--soulve-teal))] to-[hsl(var(--soulve-blue))]';
  if (score >= 70) return 'from-[hsl(var(--soulve-blue))] to-[hsl(var(--soulve-purple))]';
  if (score >= 60) return 'from-[hsl(var(--soulve-purple))] to-[hsl(var(--soulve-pink))]';
  return 'from-muted to-muted-foreground';
};

export const getTrustScoreLabel = (score: number) => {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Developing';
};
