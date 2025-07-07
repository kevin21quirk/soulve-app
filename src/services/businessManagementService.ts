import { supabase } from '@/integrations/supabase/client';

export interface BusinessProduct {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  category: string;
  price_range?: string;
  target_audience?: string;
  launch_date?: string;
  status: string;
  features: string[];
  images: string[];
  social_impact_statement?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessPartnership {
  id: string;
  organization_id: string;
  partner_name: string;
  partnership_type: string;
  description?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  contact_person?: string;
  contact_email?: string;
  objectives: string[];
  deliverables: string[];
  created_at: string;
  updated_at: string;
}

export interface EmployeeEngagement {
  id: string;
  organization_id: string;
  employee_id: string;
  activity_type: string;
  title: string;
  description?: string;
  hours_contributed: number;
  impact_points: number;
  verification_status: string;
  completed_at?: string;
  created_at: string;
  profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export interface CSRInitiative {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  budget_allocated?: number;
  budget_spent?: number;
  start_date?: string;
  end_date?: string;
  target_beneficiaries?: number;
  actual_beneficiaries?: number;
  impact_metrics: Record<string, any>;
  sdg_goals: string[];
  created_at: string;
  updated_at: string;
}

export class BusinessManagementService {
  static async getProducts(organizationId: string): Promise<BusinessProduct[]> {
    const { data, error } = await supabase
      .from('business_products' as any)
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((product: any) => ({
      ...product,
      features: Array.isArray(product.features) ? product.features : [],
      images: Array.isArray(product.images) ? product.images : []
    }));
  }

  static async createProduct(organizationId: string, productData: Partial<BusinessProduct>) {
    const { data, error } = await supabase
      .from('business_products' as any)
      .insert({
        organization_id: organizationId,
        name: productData.name || '',
        description: productData.description,
        category: productData.category || 'general',
        price_range: productData.price_range,
        target_audience: productData.target_audience,
        launch_date: productData.launch_date,
        status: productData.status || 'active',
        features: productData.features || [],
        images: productData.images || [],
        social_impact_statement: productData.social_impact_statement
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPartnerships(organizationId: string): Promise<BusinessPartnership[]> {
    const { data, error } = await supabase
      .from('business_partnerships' as any)
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((partnership: any) => ({
      ...partnership,
      objectives: Array.isArray(partnership.objectives) ? partnership.objectives : [],
      deliverables: Array.isArray(partnership.deliverables) ? partnership.deliverables : []
    }));
  }

  static async createPartnership(organizationId: string, partnershipData: Partial<BusinessPartnership>) {
    const { data, error } = await supabase
      .from('business_partnerships' as any)
      .insert({
        organization_id: organizationId,
        partner_name: partnershipData.partner_name || '',
        partnership_type: partnershipData.partnership_type || 'strategic',
        description: partnershipData.description,
        status: partnershipData.status || 'active',
        start_date: partnershipData.start_date,
        end_date: partnershipData.end_date,
        value: partnershipData.value,
        contact_person: partnershipData.contact_person,
        contact_email: partnershipData.contact_email,
        objectives: partnershipData.objectives || [],
        deliverables: partnershipData.deliverables || []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getEmployeeEngagement(organizationId: string): Promise<EmployeeEngagement[]> {
    const { data, error } = await supabase
      .from('employee_engagement' as any)
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Get profiles for all employees
    const engagementData = data || [];
    const employeeIds = engagementData.map((engagement: any) => engagement.employee_id);
    
    if (employeeIds.length === 0) return [];
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', employeeIds);
    
    if (profileError) throw profileError;
    
    const profileMap = new Map(profiles?.map(profile => [profile.id, profile]) || []);
    
    return engagementData.map((engagement: any) => {
      const profile = profileMap.get(engagement.employee_id);
      return {
        ...engagement,
        profile: profile ? {
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          avatar_url: profile.avatar_url
        } : undefined
      };
    });
  }

  static async getCSRInitiatives(organizationId: string): Promise<CSRInitiative[]> {
    const { data, error } = await supabase
      .from('csr_initiatives' as any)
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((initiative: any) => ({
      ...initiative,
      impact_metrics: typeof initiative.impact_metrics === 'string' 
        ? JSON.parse(initiative.impact_metrics) 
        : initiative.impact_metrics || {},
      sdg_goals: Array.isArray(initiative.sdg_goals) ? initiative.sdg_goals : []
    }));
  }

  static async createCSRInitiative(organizationId: string, initiativeData: Partial<CSRInitiative>) {
    const { data, error } = await supabase
      .from('csr_initiatives' as any)
      .insert({
        organization_id: organizationId,
        title: initiativeData.title || '',
        description: initiativeData.description || '',
        category: initiativeData.category || 'community',
        status: initiativeData.status || 'planning',
        budget_allocated: initiativeData.budget_allocated,
        budget_spent: initiativeData.budget_spent || 0,
        start_date: initiativeData.start_date,
        end_date: initiativeData.end_date,
        target_beneficiaries: initiativeData.target_beneficiaries,
        actual_beneficiaries: initiativeData.actual_beneficiaries || 0,
        impact_metrics: initiativeData.impact_metrics || {},
        sdg_goals: initiativeData.sdg_goals || []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getBusinessAnalytics(organizationId: string) {
    const [products, partnerships, engagements, csrInitiatives] = await Promise.all([
      this.getProducts(organizationId),
      this.getPartnerships(organizationId),
      this.getEmployeeEngagement(organizationId),
      this.getCSRInitiatives(organizationId)
    ]);

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const totalPartnerships = partnerships.length;
    const activePartnerships = partnerships.filter(p => p.status === 'active').length;
    const totalEmployeeHours = engagements.reduce((sum, e) => sum + e.hours_contributed, 0);
    const totalCSRBudget = csrInitiatives.reduce((sum, i) => sum + (i.budget_allocated || 0), 0);
    const totalCSRSpent = csrInitiatives.reduce((sum, i) => sum + (i.budget_spent || 0), 0);

    return {
      totalProducts,
      activeProducts,
      totalPartnerships,
      activePartnerships,
      totalEmployeeHours,
      totalCSRBudget,
      totalCSRSpent,
      csrUtilization: totalCSRBudget > 0 ? (totalCSRSpent / totalCSRBudget) * 100 : 0,
      employeeEngagementRate: engagements.length > 0 ? 85 : 0, // Placeholder calculation
      socialImpactScore: Math.min(100, (totalEmployeeHours * 2) + (csrInitiatives.length * 10))
    };
  }
}