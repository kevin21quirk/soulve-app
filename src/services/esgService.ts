import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUERY_KEYS } from "./queryKeys";
import { toast } from "@/hooks/use-toast";

export interface ESGFramework {
  id: string;
  name: string;
  code: string;
  version: string;
  description: string;
  official_url: string;
  is_active: boolean;
}

export interface ESGIndicator {
  id: string;
  framework_id: string;
  indicator_code: string;
  name: string;
  description: string;
  category: 'environmental' | 'social' | 'governance';
  subcategory: string;
  unit_of_measurement: string;
  materiality_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface OrganizationESGData {
  id: string;
  organization_id: string;
  indicator_id: string;
  reporting_period: string;
  value: number;
  text_value: string;
  unit: string;
  verification_status: 'unverified' | 'internal' | 'third_party';
  indicator: ESGIndicator;
}

export interface ESGComplianceStatus {
  framework_name: string;
  compliance_percentage: number;
  missing_indicators: number;
  last_update: string;
}

export interface ESGScoreBreakdown {
  environmental: number;
  social: number;
  governance: number;
  overall: number;
  trend: 'up' | 'down' | 'stable';
}

// Custom query keys for ESG data
export const ESG_QUERY_KEYS = {
  ESG_FRAMEWORKS: ['esg', 'frameworks'] as const,
  ESG_INDICATORS: ['esg', 'indicators'] as const,
  ORGANIZATION_ESG_DATA: (orgId: string) => ['esg', 'organization-data', orgId] as const,
  ESG_COMPLIANCE_STATUS: (orgId: string) => ['esg', 'compliance-status', orgId] as const,
  ESG_SCORE: (orgId: string, year: number) => ['esg', 'score', orgId, year] as const,
  CARBON_FOOTPRINT: (orgId: string) => ['esg', 'carbon-footprint', orgId] as const,
  STAKEHOLDER_ENGAGEMENT: (orgId: string) => ['esg', 'stakeholder-engagement', orgId] as const,
} as const;

export const ESG_EXTENDED_QUERY_KEYS = {
  ...ESG_QUERY_KEYS,
  ESG_DATA_REQUESTS: (orgId: string) => ['esg', 'data-requests', orgId] as const,
  ESG_ANNOUNCEMENTS: (orgId: string) => ['esg', 'announcements', orgId] as const,
  STAKEHOLDER_CONTRIBUTIONS: (orgId: string) => ['esg', 'contributions', orgId] as const,
  ESG_REPORTS: (orgId: string) => ['esg', 'reports', orgId] as const,
} as const;

export const useESGFrameworks = () => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.ESG_FRAMEWORKS,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_frameworks')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as ESGFramework[];
    },
    staleTime: 60 * 60 * 1000,
  });
};

export const useESGIndicators = (frameworkId?: string) => {
  return useQuery({
    queryKey: [...ESG_QUERY_KEYS.ESG_INDICATORS, frameworkId],
    queryFn: async () => {
      let query = supabase
        .from('esg_indicators')
        .select('*')
        .order('category', { ascending: true });
      
      if (frameworkId) {
        query = query.eq('framework_id', frameworkId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as ESGIndicator[];
    },
    staleTime: 60 * 60 * 1000,
  });
};

export const useOrganizationESGData = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.ORGANIZATION_ESG_DATA(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organization_esg_data')
        .select(`*, indicator:esg_indicators(*)`)
        .eq('organization_id', organizationId)
        .order('reporting_period', { ascending: false });
      
      if (error) throw error;
      return data as OrganizationESGData[];
    },
    enabled: !!organizationId,
  });
};

export const useESGScore = (organizationId: string, year: number = new Date().getFullYear()) => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.ESG_SCORE(organizationId, year),
    queryFn: async () => ({ environmental: 72, social: 68, governance: 85, overall: 75, trend: 'up' as const }),
    enabled: !!organizationId,
  });
};

export const useESGComplianceStatus = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.ESG_COMPLIANCE_STATUS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_esg_compliance_status', { org_id: organizationId });
      if (error) throw error;
      return data;
    },
    enabled: !!organizationId,
  });
};

export const useCarbonFootprint = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.CARBON_FOOTPRINT(organizationId),
    queryFn: async () => ({ totalEmissions: 0, scopeBreakdown: {}, monthlyData: [] }),
    enabled: !!organizationId,
  });
};

export const useStakeholderEngagement = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.STAKEHOLDER_ENGAGEMENT(organizationId),
    queryFn: async () => ({ stakeholderBreakdown: {}, overallEngagement: 0, totalStakeholders: 0 }),
    enabled: !!organizationId,
  });
};

export const useCreateESGData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (esgData: any) => {
      const { data, error } = await supabase.from('organization_esg_data').insert(esgData).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ESG_QUERY_KEYS.ORGANIZATION_ESG_DATA(data.organization_id) });
      toast({ title: "ESG Data Created", description: "Data saved successfully." });
    },
  });
};

export const useUploadESGDocument = () => {
  return useMutation({
    mutationFn: async ({ file, organizationId }: { file: File; organizationId: string }) => {
      const path = `${organizationId}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('esg-documents').upload(path, file);
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('esg-documents').getPublicUrl(path);
      
      return { ...data, publicUrl };
    },
  });
};

export const useESGDataRequests = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_DATA_REQUESTS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase.from('esg_data_requests').select('*').or(`organization_id.eq.${organizationId},requested_from_org_id.eq.${organizationId}`);
      if (error) throw error;
      return data;
    },
    enabled: !!organizationId,
  });
};

export const useSendESGInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invitationData: any) => {
      const { data, error } = await supabase.functions.invoke('send-esg-invitation', { body: invitationData });
      if (error) throw error;
      return data;
    },
    onSuccess: () => toast({ title: "Invitation Sent" }),
  });
};

export const useGenerateESGReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportData: any) => {
      const { data, error } = await supabase.functions.invoke('generate-esg-report', { body: reportData });
      if (error) throw error;
      return data;
    },
    onSuccess: () => toast({ title: "Report Generated" }),
  });
};

export const useStakeholderContributions = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.STAKEHOLDER_CONTRIBUTIONS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stakeholder_data_contributions')
        .select('*, data_request:esg_data_requests(*, indicator:esg_indicators(*))')
        .eq('data_request.organization_id', organizationId)
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!organizationId,
  });
};

export const useSubmitESGContribution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contributionData: any) => {
      const { data, error } = await supabase
        .from('stakeholder_data_contributions')
        .insert(contributionData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg', 'contributions'] });
      toast({ title: "Contribution submitted successfully" });
    },
  });
};

export const useESGAnnouncements = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_ANNOUNCEMENTS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_announcements')
        .select('*')
        .eq('organization_id', organizationId)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!organizationId,
  });
};

export const useESGInitiatives = (organizationId: string) => {
  return useQuery({
    queryKey: ['esg-initiatives', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_initiatives')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!organizationId,
  });
};

export const useCreateESGAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (announcementData: any) => {
      const { data, error } = await supabase
        .from('esg_announcements')
        .insert(announcementData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg', 'announcements'] });
      toast({ title: "Announcement published" });
    },
  });
};

export const getMockESGData = () => ({
  esgScore: {
    environmental: 72,
    social: 68,
    governance: 85,
    overall: 75,
    trend: 'up' as const
  },
  complianceStatus: [
    { framework_name: 'GRI Standards', compliance_percentage: 85, missing_indicators: 5, last_update: '2024-03-15' },
    { framework_name: 'SASB', compliance_percentage: 72, missing_indicators: 12, last_update: '2024-03-10' }
  ],
  carbonFootprint: {
    totalEmissions: 12450,
    scopeBreakdown: {
      'Scope 1': { total: 3200, sources: [] },
      'Scope 2': { total: 5800, sources: [] },
      'Scope 3': { total: 3450, sources: [] }
    },
    monthlyData: []
  },
  stakeholderEngagement: {
    stakeholderBreakdown: {
      investors: { averageSatisfaction: 4.5, responseRate: 85, totalMetrics: 10, engagementMethods: ['Annual Report', 'Quarterly Calls'] },
      employees: { averageSatisfaction: 4.2, responseRate: 78, totalMetrics: 15, engagementMethods: ['Surveys', 'Town Halls'] }
    },
    overallEngagement: 4.3,
    totalStakeholders: 2
  },
  goals: [
    { 
      id: '1', 
      goal_name: 'Carbon Neutrality by 2030',
      target_value: 0,
      target_year: 2030,
      current_value: 12450,
      progress_percentage: 45,
      status: 'active', 
      category: 'environmental',
      priority_level: 'critical'
    }
  ],
  recommendations: [
    { 
      id: '1', 
      title: 'Improve Water Management',
      recommendation_type: 'efficiency',
      priority_score: 85,
      description: 'Implement water recycling systems to reduce consumption',
      implementation_effort: 'medium',
      potential_impact: 'Reduce water usage by 30%',
      status: 'new'
    }
  ],
  risks: [
    { 
      id: '1', 
      risk_name: 'Climate Change Impact',
      risk_category: 'environmental',
      risk_type: 'physical',
      probability_score: 8,
      impact_score: 9,
      risk_score: 72,
      risk_level: 'high',
      description: 'Increased frequency of extreme weather events affecting operations'
    }
  ]
});