import { supabase } from "@/integrations/supabase/client";

export interface YapilyPaymentConsent {
  consentId: string;
  authorisationUrl: string;
  status: string;
}

export interface YapilyPaymentRequest {
  amount: number;
  currency: string;
  description: string;
  reference: string;
  userId?: string;
  organisationId?: string;
}

export class YapilyService {
  /**
   * Create a payment consent for one-off payments
   */
  static async createPaymentConsent(
    paymentRequest: YapilyPaymentRequest
  ): Promise<YapilyPaymentConsent> {
    const { data, error } = await supabase.functions.invoke('yapily-create-payment', {
      body: paymentRequest
    });

    if (error) throw error;
    return data;
  }

  /**
   * Create recurring payment consent for subscriptions
   */
  static async createRecurringConsent(
    userId: string,
    planId: string,
    billingCycle: 'monthly' | 'annual'
  ): Promise<YapilyPaymentConsent> {
    const { data, error } = await supabase.functions.invoke('yapily-create-payment', {
      body: {
        type: 'recurring',
        userId,
        planId,
        billingCycle
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Check payment status
   */
  static async getPaymentStatus(paymentId: string): Promise<any> {
    const { data, error } = await supabase
      .from('platform_payments')
      .select('*')
      .eq('yapily_payment_id', paymentId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Generate payment reference for manual bank transfer
   */
  static async generatePaymentReference(
    amount: number,
    paymentType: string,
    userId?: string,
    organisationId?: string
  ): Promise<{ reference: string; bankDetails: any }> {
    const { data, error } = await supabase.functions.invoke('generate-payment-reference', {
      body: {
        amount,
        paymentType,
        userId,
        organisationId
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Get user's current subscription
   */
  static async getUserSubscription(userId: string) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string) {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ 
        cancel_at_period_end: true,
        status: 'cancelling'
      })
      .eq('id', subscriptionId);

    if (error) throw error;
  }

  /**
   * Get payment history
   */
  static async getPaymentHistory(userId: string, organisationId?: string) {
    let query = supabase
      .from('platform_payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (organisationId) {
      query = query.eq('organisation_id', organisationId);
    } else {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }
}
