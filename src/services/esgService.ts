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
// New interface definitions for additional ESG data
export interface ESGDataEntry {
  id: string;
  organization_id: string;
  indicator_id: string;
  reporting_period: string;
  value: number;
  text_value: string;
  unit: string;
  data_source: string;
  verification_status: 'unverified' | 'internal' | 'third_party';
  supporting_documents: any[];
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ESGGoal {
  id: string;
  organization_id: string;
  indicator_id: string;
  goal_name: string;
  description: string;
  target_value: number;
  target_unit: string;
  baseline_value: number;
  baseline_year: number;
  target_year: number;
  current_value: number;
  progress_percentage: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  category: 'environmental' | 'social' | 'governance';
  milestones: any[];
  responsible_team: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ESGReport {
  id: string;
  organization_id: string;
  report_name: string;
  report_type: 'gri' | 'sasb' | 'tcfd' | 'ungc' | 'integrated' | 'custom';
  framework_version: string;
  reporting_period_start: string;
  reporting_period_end: string;
  status: 'draft' | 'in_review' | 'approved' | 'published';
  template_data: any;
  generated_content: string;
  cover_image: string;
  executive_summary: string;
  created_by: string;
  approved_by: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ESGRecommendation {
  id: string;
  organization_id: string;
  recommendation_type: 'improvement' | 'risk_mitigation' | 'best_practice' | 'compliance' | 'efficiency';
  priority_score: number;
  title: string;
  description: string;
  recommended_actions: any[];
  potential_impact: string;
  implementation_effort: 'low' | 'medium' | 'high';
  estimated_cost_range: string;
  related_indicators: any[];
  data_sources: any[];
  confidence_score: number;
  status: 'new' | 'reviewed' | 'accepted' | 'rejected' | 'implemented';
  reviewed_by: string;
  reviewed_at: string;
  implementation_date: string;
  created_at: string;
  updated_at: string;
}

export interface ESGRisk {
  id: string;
  organization_id: string;
  risk_name: string;
  risk_category: 'environmental' | 'social' | 'governance';
  risk_type: 'physical' | 'transition' | 'regulatory' | 'reputational' | 'operational';
  description: string;
  probability_score: number;
  impact_score: number;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  mitigation_strategies: any[];
  residual_risk_score: number;
  owner_department: string;
  review_frequency: string;
  last_reviewed: string;
  next_review_date: string;
  status: 'active' | 'mitigated' | 'transferred' | 'accepted';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface StakeholderGroup {
  id: string;
  organization_id: string;
  group_name: string;
  stakeholder_type: 'employees' | 'investors' | 'customers' | 'suppliers' | 'community' | 'regulators' | 'ngos';
  description: string;
  engagement_methods: any[];
  contact_frequency: string;
  key_interests: any[];
  influence_level: 'low' | 'medium' | 'high';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ESGBenchmark {
  id: string;
  industry_sector: string;
  indicator_id: string;
  benchmark_type: 'industry_average' | 'top_quartile' | 'best_practice' | 'regulatory_minimum';
  value: number;
  unit: string;
  data_source: string;
  reporting_year: number;
  geographical_scope: string;
  sample_size: number;
  created_at: string;
  updated_at: string;
}

// Extended query keys
export const ESG_EXTENDED_QUERY_KEYS = {
  ...ESG_QUERY_KEYS,
  ESG_DATA_ENTRIES: (orgId: string) => ['esg', 'data-entries', orgId] as const,
  ESG_GOALS: (orgId: string) => ['esg', 'goals', orgId] as const,
  ESG_REPORTS: (orgId: string) => ['esg', 'reports', orgId] as const,
  ESG_RECOMMENDATIONS: (orgId: string) => ['esg', 'recommendations', orgId] as const,
  ESG_RISKS: (orgId: string) => ['esg', 'risks', orgId] as const,
  STAKEHOLDER_GROUPS: (orgId: string) => ['esg', 'stakeholder-groups', orgId] as const,
  ESG_BENCHMARKS: (industrySelector: string) => ['esg', 'benchmarks', industrySelector] as const,
} as const;

// New service functions for additional ESG features
export const useESGDataEntries = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_DATA_ENTRIES(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_data_entries')
        .select(`
          *,
          indicator:esg_indicators(*)
        `)
        .eq('organization_id', organizationId)
        .order('reporting_period', { ascending: false });
      
      if (error) throw error;
      return data as ESGDataEntry[];
    },
    enabled: !!organizationId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useESGGoals = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_GOALS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_goals')
        .select(`
          *,
          indicator:esg_indicators(*)
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ESGGoal[];
    },
    enabled: !!organizationId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useESGReports = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_REPORTS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_reports')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ESGReport[];
    },
    enabled: !!organizationId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useESGRecommendations = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_RECOMMENDATIONS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_recommendations')
        .select('*')
        .eq('organization_id', organizationId)
        .order('priority_score', { ascending: false });
      
      if (error) throw error;
      return data as ESGRecommendation[];
    },
    enabled: !!organizationId,
    staleTime: 30 * 60 * 1000,
  });
};

export const useESGRisks = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_RISKS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_risks')
        .select('*')
        .eq('organization_id', organizationId)
        .order('risk_score', { ascending: false });
      
      if (error) throw error;
      return data as ESGRisk[];
    },
    enabled: !!organizationId,
    staleTime: 30 * 60 * 1000,
  });
};

export const useStakeholderGroups = (organizationId: string) => {
  return useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.STAKEHOLDER_GROUPS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stakeholder_groups')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('influence_level', { ascending: false });
      
      if (error) throw error;
      return data as StakeholderGroup[];
    },
    enabled: !!organizationId,
    staleTime: 30 * 60 * 1000,
  });
};

export const useESGBenchmarks = (industrySelector: string) => {
  return useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_BENCHMARKS(industrySelector),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_benchmarks')
        .select(`
          *,
          indicator:esg_indicators(*)
        `)
        .eq('industry_sector', industrySelector)
        .order('reporting_year', { ascending: false });
      
      if (error) throw error;
      return data as ESGBenchmark[];
    },
    enabled: !!industrySelector,
    staleTime: 60 * 60 * 1000,
  });
};

// Mock data for development (enhanced)
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
  },
  // Additional mock data for new features
  goals: [
    {
      id: '1',
      goal_name: 'Carbon Neutrality',
      target_value: 0,
      target_year: 2030,
      current_value: 2450,
      progress_percentage: 15,
      status: 'active',
      category: 'environmental',
      priority_level: 'critical'
    },
    {
      id: '2',
      goal_name: 'Employee Diversity',
      target_value: 50,
      target_year: 2025,
      current_value: 35,
      progress_percentage: 70,
      status: 'active',
      category: 'social',
      priority_level: 'high'
    }
  ],
  recommendations: [
    {
      id: '1',
      title: 'Implement LED Lighting',
      recommendation_type: 'efficiency',
      priority_score: 85,
      description: 'Replace traditional lighting with LED systems to reduce energy consumption by 40%',
      implementation_effort: 'medium',
      potential_impact: 'High energy savings and reduced carbon footprint',
      status: 'new'
    },
    {
      id: '2',
      title: 'Supplier ESG Assessment',
      recommendation_type: 'best_practice',
      priority_score: 78,
      description: 'Implement comprehensive ESG screening for all suppliers',
      implementation_effort: 'high',
      potential_impact: 'Improved supply chain sustainability',
      status: 'new'
    }
  ],
  risks: [
    {
      id: '1',
      risk_name: 'Climate Change Physical Risk',
      risk_category: 'environmental',
      risk_type: 'physical',
      probability_score: 4,
      impact_score: 5,
      risk_score: 20,
      risk_level: 'critical',
      description: 'Increased frequency of extreme weather events affecting operations'
    },
    {
      id: '2',
      risk_name: 'Data Privacy Regulations',
      risk_category: 'governance',
      risk_type: 'regulatory',
      probability_score: 3,
      impact_score: 4,
      risk_score: 12,
      risk_level: 'medium',
      description: 'Evolving data protection regulations may require significant compliance updates'
    }
  ]
});

// ============= MUTATION HOOKS FOR ESG DATA =============

export interface CreateESGDataInput {
  organization_id: string;
  indicator_id: string;
  reporting_period: string;
  value?: number;
  text_value?: string;
  unit?: string;
  data_source: string;
  verification_status: 'unverified' | 'internal' | 'third_party';
  notes?: string;
  supporting_documents?: string[];
}

export interface UpdateESGDataInput extends Partial<CreateESGDataInput> {
  id: string;
}

// Create ESG Data Entry
export const useCreateESGData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CreateESGDataInput) => {
      const { data, error } = await supabase
        .from('organization_esg_data')
        .insert([input])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch ESG data queries
      queryClient.invalidateQueries({ 
        queryKey: ESG_QUERY_KEYS.ORGANIZATION_ESG_DATA(data.organization_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: ESG_QUERY_KEYS.ESG_SCORE(data.organization_id, new Date().getFullYear()) 
      });
      queryClient.invalidateQueries({ 
        queryKey: ESG_QUERY_KEYS.ESG_COMPLIANCE_STATUS(data.organization_id) 
      });
      
      toast({
        title: "ESG Data Saved",
        description: "Your ESG data entry has been successfully saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Saving Data",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Update ESG Data Entry
export const useUpdateESGData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateESGDataInput) => {
      const { data, error } = await supabase
        .from('organization_esg_data')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ESG_QUERY_KEYS.ORGANIZATION_ESG_DATA(data.organization_id) 
      });
      
      toast({
        title: "Data Updated",
        description: "ESG data entry has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Updating Data",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Delete ESG Data Entry
export const useDeleteESGData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, organizationId }: { id: string; organizationId: string }) => {
      const { error } = await supabase
        .from('organization_esg_data')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id, organizationId };
    },
    onSuccess: ({ organizationId }) => {
      queryClient.invalidateQueries({ 
        queryKey: ESG_QUERY_KEYS.ORGANIZATION_ESG_DATA(organizationId) 
      });
      
      toast({
        title: "Data Deleted",
        description: "ESG data entry has been deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Deleting Data",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Upload file to Supabase Storage
export const useUploadESGDocument = () => {
  return useMutation({
    mutationFn: async ({ file, organizationId }: { file: File; organizationId: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${organizationId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('esg-documents')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('esg-documents')
        .getPublicUrl(fileName);
      
      return { path: data.path, publicUrl };
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Create ESG Report
export const useCreateESGReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: Omit<ESGReport, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('esg_reports')
        .insert([input])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_REPORTS(data.organization_id) 
      });
      
      toast({
        title: "Report Created",
        description: "ESG report has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Report",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Update ESG Report
export const useUpdateESGReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<ESGReport>) => {
      const { data, error } = await supabase
        .from('esg_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_REPORTS(data.organization_id) 
      });
      
      toast({
        title: "Report Updated",
        description: "ESG report has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Updating Report",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};