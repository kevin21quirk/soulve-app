import { supabase } from '@/integrations/supabase/client';

export interface SecurityAuditEntry {
  action_type: string;
  resource_type?: string;
  resource_id?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, any>;
}

class SecurityAuditService {
  /**
   * Log a security-relevant action for audit purposes
   */
  async logAction(entry: SecurityAuditEntry): Promise<void> {
    try {
      // Get client IP and user agent if available
      const details = {
        ...entry.details,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      };

      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          action_type: entry.action_type,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id,
          severity: entry.severity,
          details
        });

      if (error) {
        console.error('Failed to log security audit entry:', error);
      }
    } catch (error) {
      console.error('Security audit logging error:', error);
    }
  }

  /**
   * Log user authentication events
   */
  async logAuthEvent(event: string, details?: Record<string, any>): Promise<void> {
    await this.logAction({
      action_type: `auth_${event}`,
      severity: event.includes('failed') ? 'medium' : 'low',
      details
    });
  }

  /**
   * Log data access events
   */
  async logDataAccess(resourceType: string, resourceId: string, action: string): Promise<void> {
    await this.logAction({
      action_type: 'data_access',
      resource_type: resourceType,
      resource_id: resourceId,
      severity: 'low',
      details: { action }
    });
  }

  /**
   * Log security violations
   */
  async logSecurityViolation(violation: string, details?: Record<string, any>): Promise<void> {
    await this.logAction({
      action_type: 'security_violation',
      severity: 'high',
      details: { violation, ...details }
    });
  }

  /**
   * Log content moderation events
   */
  async logContentModeration(contentType: string, contentId: string, action: string, reason?: string): Promise<void> {
    await this.logAction({
      action_type: 'content_moderation',
      resource_type: contentType,
      resource_id: contentId,
      severity: action === 'blocked' ? 'medium' : 'low',
      details: { action, reason }
    });
  }

  /**
   * Log administrative actions
   */
  async logAdminAction(action: string, targetType?: string, targetId?: string, details?: Record<string, any>): Promise<void> {
    await this.logAction({
      action_type: 'admin_action',
      resource_type: targetType,
      resource_id: targetId,
      severity: 'medium',
      details: { action, ...details }
    });
  }
}

export const securityAuditService = new SecurityAuditService();