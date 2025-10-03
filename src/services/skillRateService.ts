import { supabase } from '@/integrations/supabase/client';
import { SkillCategory, POINTS_CONVERSION_RATE, MAX_WEEKLY_HOURS } from '@/types/skillCategories';

export class SkillRateService {
  /**
   * Get all skill categories
   */
  static async getSkillCategories(): Promise<SkillCategory[]> {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Get skill category by ID
   */
  static async getSkillCategory(skillCategoryId: string): Promise<SkillCategory | null> {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .eq('id', skillCategoryId)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Calculate points for volunteer work based on market rate
   * Formula: Points = (Market Rate × Hours) × Conversion Rate
   */
  static calculateVolunteerPoints(
    marketRate: number,
    hours: number,
    conversionRate: number = POINTS_CONVERSION_RATE
  ): number {
    const marketValue = marketRate * hours;
    return Math.round(marketValue * conversionRate);
  }

  /**
   * Calculate market value for volunteer work
   */
  static calculateMarketValue(marketRate: number, hours: number): number {
    return marketRate * hours;
  }

  /**
   * Validate hours contributed (max 40 hours per week per skill)
   */
  static async validateHours(
    userId: string,
    skillCategoryId: string,
    hours: number
  ): Promise<{ valid: boolean; message?: string }> {
    // Check if hours exceed maximum
    if (hours > MAX_WEEKLY_HOURS) {
      return {
        valid: false,
        message: `Cannot log more than ${MAX_WEEKLY_HOURS} hours per week for a single skill`
      };
    }

    // Check weekly hours for this skill
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('impact_activities')
      .select('hours_contributed')
      .eq('user_id', userId)
      .eq('skill_category_id', skillCategoryId)
      .gte('created_at', oneWeekAgo.toISOString());

    if (error) throw error;

    const weeklyHours = data.reduce((sum, activity) => 
      sum + (Number(activity.hours_contributed) || 0), 0
    );

    if (weeklyHours + hours > MAX_WEEKLY_HOURS) {
      return {
        valid: false,
        message: `Adding ${hours} hours would exceed the weekly limit of ${MAX_WEEKLY_HOURS} hours. Current: ${weeklyHours} hours this week.`
      };
    }

    return { valid: true };
  }

  /**
   * Get skills by category
   */
  static async getSkillsByCategory(category: string): Promise<SkillCategory[]> {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .eq('category', category)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Get top skills by market rate
   */
  static async getTopSkillsByRate(limit: number = 10): Promise<SkillCategory[]> {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('market_rate_gbp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Search skills by name
   */
  static async searchSkills(searchTerm: string): Promise<SkillCategory[]> {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name')
      .limit(20);
    
    if (error) throw error;
    return data || [];
  }
}
