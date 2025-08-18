import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUERY_KEYS } from "./queryKeys";

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
    staleTime: 60 * 60 * 1000, // 1 hour
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
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useOrganizationESGData = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.ORGANIZATION_ESG_DATA(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organization_esg_data')
        .select(`
          *,
          indicator:esg_indicators(*)
        `)
        .eq('organization_id', organizationId)
        .gte('reporting_period', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('reporting_period', { ascending: false });
      
      if (error) throw error;
      return data as OrganizationESGData[];
    },
    enabled: !!organizationId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useESGComplianceStatus = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.ESG_COMPLIANCE_STATUS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_esg_compliance_status', { org_id: organizationId });
      
      if (error) throw error;
      return data as ESGComplianceStatus[];
    },
    enabled: !!organizationId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useESGScore = (organizationId: string, assessmentYear: number = new Date().getFullYear()) => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.ESG_SCORE(organizationId, assessmentYear),
    queryFn: async () => {
      // Get the calculated ESG score
      const { data: scoreData, error: scoreError } = await supabase
        .rpc('calculate_esg_score', { 
          org_id: organizationId, 
          assessment_year: assessmentYear 
        });

      if (scoreError) throw scoreError;

      // Get category breakdown from materiality assessments
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('materiality_assessments')
        .select(`
          indicator:esg_indicators(category),
          business_impact,
          stakeholder_importance
        `)
        .eq('organization_id', organizationId)
        .eq('assessment_year', assessmentYear);

      if (assessmentError) throw assessmentError;

      // Calculate category scores
      const categoryScores = assessmentData?.reduce((acc, assessment) => {
        const category = assessment.indicator?.category || 'governance';
        const score = (assessment.business_impact || 0) * (assessment.stakeholder_importance || 0);
        
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0 };
        }
        acc[category].total += score;
        acc[category].count += 1;
        
        return acc;
      }, {} as Record<string, { total: number; count: number }>) || {};

      // Calculate weighted averages
      const environmental = categoryScores.environmental ? 
        Math.round((categoryScores.environmental.total / categoryScores.environmental.count) * 10) : 0;
      const social = categoryScores.social ? 
        Math.round((categoryScores.social.total / categoryScores.social.count) * 10) : 0;
      const governance = categoryScores.governance ? 
        Math.round((categoryScores.governance.total / categoryScores.governance.count) * 10) : 0;

      const overall = Math.round(scoreData || 0);
      
      // Mock trend calculation - in real implementation, compare with previous year
      const trend: 'up' | 'down' | 'stable' = overall > 65 ? 'up' : overall < 45 ? 'down' : 'stable';

      return {
        environmental,
        social,
        governance,
        overall,
        trend
      } as ESGScoreBreakdown;
    },
    enabled: !!organizationId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useCarbonFootprint = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.CARBON_FOOTPRINT(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carbon_footprint_data')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('reporting_period', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('reporting_period', { ascending: false });
      
      if (error) throw error;
      
      // Group by scope and calculate totals
      const scopeData = data?.reduce((acc, item) => {
        const scope = `Scope ${item.scope_type}`;
        if (!acc[scope]) {
          acc[scope] = { total: 0, sources: [] };
        }
        acc[scope].total += item.co2_equivalent || 0;
        acc[scope].sources.push({
          source: item.emission_source,
          co2_equivalent: item.co2_equivalent,
          reporting_period: item.reporting_period
        });
        return acc;
      }, {} as Record<string, { total: number; sources: any[] }>) || {};

      return {
        totalEmissions: Object.values(scopeData).reduce((sum, scope) => sum + scope.total, 0),
        scopeBreakdown: scopeData,
        monthlyData: data?.map(item => ({
          month: new Date(item.reporting_period).toLocaleDateString('en-US', { month: 'short' }),
          emissions: item.co2_equivalent,
          scope: item.scope_type
        })) || []
      };
    },
    enabled: !!organizationId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useStakeholderEngagement = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_QUERY_KEYS.STAKEHOLDER_ENGAGEMENT(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stakeholder_engagement_metrics')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('measurement_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('measurement_date', { ascending: false });
      
      if (error) throw error;
      
      // Group by stakeholder type
      const stakeholderData = data?.reduce((acc, metric) => {
        const type = metric.stakeholder_type;
        if (!acc[type]) {
          acc[type] = {
            averageSatisfaction: 0,
            responseRate: 0,
            totalMetrics: 0,
            engagementMethods: new Set()
          };
        }
        
        acc[type].averageSatisfaction += metric.satisfaction_score || 0;
        acc[type].responseRate += metric.response_rate || 0;
        acc[type].totalMetrics += 1;
        
        if (metric.engagement_method) {
          acc[type].engagementMethods.add(metric.engagement_method);
        }
        
        return acc;
      }, {} as Record<string, any>) || {};

      // Calculate averages
      Object.keys(stakeholderData).forEach(type => {
        const data = stakeholderData[type];
        data.averageSatisfaction = Math.round((data.averageSatisfaction / data.totalMetrics) * 10) / 10;
        data.responseRate = Math.round((data.responseRate / data.totalMetrics) * 10) / 10;
        data.engagementMethods = Array.from(data.engagementMethods);
      });

      return {
        stakeholderBreakdown: stakeholderData,
        overallEngagement: Object.values(stakeholderData).reduce((sum: number, data: any) => sum + data.averageSatisfaction, 0) / Object.keys(stakeholderData).length || 0,
        totalStakeholders: Object.keys(stakeholderData).length
      };
    },
    enabled: !!organizationId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Mock data for development
export const getMockESGData = () => ({
  esgScore: {
    environmental: 78,
    social: 85,
    governance: 72,
    overall: 78,
    trend: 'up' as const
  },
  complianceStatus: [
    { framework_name: 'Global Reporting Initiative', compliance_percentage: 85, missing_indicators: 3, last_update: '2024-01-15' },
    { framework_name: 'UN Sustainable Development Goals', compliance_percentage: 72, missing_indicators: 5, last_update: '2024-01-10' },
    { framework_name: 'SASB Standards', compliance_percentage: 68, missing_indicators: 8, last_update: '2024-01-08' },
    { framework_name: 'TCFD Framework', compliance_percentage: 45, missing_indicators: 12, last_update: '2024-01-05' }
  ],
  carbonFootprint: {
    totalEmissions: 2450,
    scopeBreakdown: {
      'Scope 1': { total: 850, sources: [] },
      'Scope 2': { total: 920, sources: [] },
      'Scope 3': { total: 680, sources: [] }
    },
    monthlyData: [
      { month: 'Jan', emissions: 220, scope: 1 },
      { month: 'Feb', emissions: 195, scope: 1 },
      { month: 'Mar', emissions: 245, scope: 1 },
      { month: 'Apr', emissions: 210, scope: 1 },
      { month: 'May', emissions: 230, scope: 1 },
      { month: 'Jun', emissions: 205, scope: 1 }
    ]
  },
  stakeholderEngagement: {
    stakeholderBreakdown: {
      employees: { averageSatisfaction: 4.2, responseRate: 78, totalMetrics: 12, engagementMethods: ['survey', 'focus_group'] },
      community: { averageSatisfaction: 3.8, responseRate: 65, totalMetrics: 8, engagementMethods: ['interview', 'digital_platform'] },
      suppliers: { averageSatisfaction: 4.0, responseRate: 85, totalMetrics: 15, engagementMethods: ['survey'] },
      investors: { averageSatisfaction: 4.5, responseRate: 92, totalMetrics: 6, engagementMethods: ['interview'] }
    },
    overallEngagement: 4.1,
    totalStakeholders: 4
  }
});