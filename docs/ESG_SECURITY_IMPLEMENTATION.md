# ESG Security Implementation Guide

## Overview
This document details the comprehensive security implementation for the ESG data verification workflow, including authentication, authorization, rate limiting, and audit logging.

## Table of Contents
1. [Data Verification Workflow](#data-verification-workflow)
2. [Security Hardening](#security-hardening)
3. [Error Handling](#error-handling)
4. [Email Notifications](#email-notifications)
5. [AI Credit Management](#ai-credit-management)
6. [Testing Guidelines](#testing-guidelines)

---

## Data Verification Workflow

### Database Schema

#### stakeholder_data_contributions
Stores ESG data submitted by stakeholders for verification.

```sql
CREATE TABLE public.stakeholder_data_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  contributor_id UUID REFERENCES auth.users(id),
  indicator_id UUID REFERENCES public.esg_indicators(id),
  data_value NUMERIC NOT NULL,
  reporting_period DATE NOT NULL,
  verification_status TEXT DEFAULT 'pending',
  verification_notes TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### verification_audit_log
Tracks all verification actions for audit purposes.

```sql
CREATE TABLE public.verification_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID REFERENCES public.stakeholder_data_contributions(id),
  action TEXT NOT NULL,
  performed_by UUID NOT NULL REFERENCES auth.users(id),
  previous_status TEXT,
  new_status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row-Level Security (RLS) Policies

**stakeholder_data_contributions:**
- Contributors can view their own submissions
- Organization admins can view all contributions for their organization
- Organization admins can update verification status

**verification_audit_log:**
- Organization admins can view audit logs for their organization
- System can insert audit records

### Frontend Components

#### DataVerificationPanel
Location: `src/components/dashboard/esg/DataVerificationPanel.tsx`

Features:
- Tab-based interface for pending, approved, rejected, and revision-required contributions
- Verification dialog with actions: Approve, Reject, Request Revision
- Real-time status updates
- Audit trail integration

Usage:
```tsx
import { DataVerificationPanel } from '@/components/dashboard/esg/DataVerificationPanel';

<DataVerificationPanel organizationId={organizationId} />
```

#### useVerifyContribution Hook
Location: `src/hooks/esg/useVerifyContribution.ts`

Features:
- Mutation hook for verifying contributions
- Automatic audit log creation
- Toast notifications
- Query invalidation for real-time updates

Usage:
```tsx
import { useVerifyContribution } from '@/hooks/esg/useVerifyContribution';

const { mutate: verifyContribution } = useVerifyContribution();

verifyContribution({
  contributionId: 'uuid',
  status: 'approved',
  notes: 'Verified and approved',
});
```

---

## Security Hardening

### Rate Limiting

#### Database Schema
```sql
CREATE TABLE public.ai_endpoint_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_rate_limits_user_endpoint 
ON public.ai_endpoint_rate_limits(user_id, endpoint, window_start);
```

#### Rate Limit Function
```sql
CREATE OR REPLACE FUNCTION public.check_ai_rate_limit(
  p_user_id UUID,
  p_endpoint TEXT,
  p_max_requests INTEGER,
  p_window_minutes INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMPTZ;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  SELECT COALESCE(SUM(request_count), 0)
  INTO v_count
  FROM public.ai_endpoint_rate_limits
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint
    AND window_start > v_window_start;
  
  IF v_count >= p_max_requests THEN
    -- Log violation
    INSERT INTO public.security_audit_log (
      user_id, action_type, severity, details
    ) VALUES (
      p_user_id, 'rate_limit_exceeded', 'medium',
      jsonb_build_object('endpoint', p_endpoint, 'attempts', v_count)
    );
    RETURN FALSE;
  END IF;
  
  -- Record request
  INSERT INTO public.ai_endpoint_rate_limits (
    user_id, endpoint, request_count, window_start
  ) VALUES (
    p_user_id, p_endpoint, 1, now()
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Edge Function Security

#### AI ESG Insights Function
Location: `supabase/functions/ai-esg-insights/index.ts`

Security Features:
1. **Authentication**: Verifies user authentication via JWT
2. **Authorization**: Checks organization membership
3. **Input Validation**: Sanitizes and validates all inputs
4. **Rate Limiting**: 50 requests per hour per user
5. **Audit Logging**: Logs all requests and errors

Example Implementation:
```typescript
// Authentication check
const authHeader = req.headers.get("Authorization");
if (!authHeader) {
  throw new Error("Missing authorization header");
}

const { data: { user }, error: authError } = await supabase.auth.getUser(
  authHeader.replace("Bearer ", "")
);

// Authorization check
const { data: membership } = await supabase
  .from('organization_members')
  .select('role')
  .eq('organization_id', organizationId)
  .eq('user_id', user.id)
  .single();

if (!membership) {
  throw new Error("User not authorized for this organization");
}

// Rate limiting
const { data: canProceed } = await supabase
  .rpc('check_ai_rate_limit', {
    p_user_id: user.id,
    p_endpoint: 'ai-esg-insights',
    p_max_requests: 50,
    p_window_minutes: 60
  });

if (!canProceed) {
  throw new Error("AI_RATE_LIMIT");
}
```

### RLS Policy Updates

**organization_invitations:**
- Prevents invitation token enumeration
- Only invited users can view their pending invitations
- Invitation tokens are not directly selectable

**esg_data_requests:**
- Both requesting and requested-from organization members can view requests
- Admins can update request status

---

## Error Handling

### Generic UI Components

#### LoadingState
Location: `src/components/ui/loading-state.tsx`

Usage:
```tsx
import { LoadingState } from '@/components/ui/loading-state';

<LoadingState message="Loading ESG data..." />
```

#### EmptyState
Location: `src/components/ui/empty-state.tsx`

Usage:
```tsx
import { EmptyState } from '@/components/ui/empty-state';
import { AlertCircle } from 'lucide-react';

<EmptyState
  icon={AlertCircle}
  title="No Data Available"
  description="Try adjusting your filters or adding new data."
  action={{
    label: "Add Data",
    onClick: () => console.log("Add data")
  }}
/>
```

### Error Boundary
Location: `src/components/ErrorBoundary.tsx`

Features:
- Catches React component errors
- Displays user-friendly error message
- Shows error details in development mode
- Provides recovery options

Usage:
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Enhanced Hook Error Handling

#### useAIESGRecommendations
Location: `src/hooks/esg/useAIESGRecommendations.ts`

Features:
- Specific error handling for rate limits, credit depletion, unauthorized access
- User-friendly toast notifications
- Smart retry logic
- Response parsing with fallbacks

Error Types Handled:
- `AI_RATE_LIMIT`: Rate limit exceeded
- `AI_CREDITS_DEPLETED`: AI credits exhausted
- `UNAUTHORIZED`: User not authorized
- Generic errors with fallback messages

---

## Email Notifications

### Edge Function
Location: `supabase/functions/send-esg-notification/index.ts`

#### Notification Types

1. **contribution_submitted**: New contribution received
2. **contribution_verified**: Contribution reviewed
3. **invitation_sent**: ESG data invitation
4. **data_request**: ESG data request received

#### Setup Requirements

1. Add RESEND_API_KEY secret:
   ```bash
   # In Supabase Dashboard > Project Settings > Edge Functions
   RESEND_API_KEY=your_api_key_here
   ```

2. Verify email domain at [resend.com/domains](https://resend.com/domains)

3. Update "from" address in edge function:
   ```typescript
   from: "Your Org <notifications@yourdomain.com>",
   ```

#### Frontend Hook
Location: `src/hooks/esg/useESGNotifications.ts`

Usage:
```tsx
import { useSendESGNotification } from '@/hooks/esg/useESGNotifications';

const { mutate: sendNotification } = useSendESGNotification();

sendNotification({
  to: 'user@example.com',
  type: 'contribution_verified',
  data: {
    recipientName: 'John Doe',
    organizationName: 'Acme Corp',
    verificationStatus: 'Approved',
    verificationNotes: 'Data verified successfully',
  },
});
```

#### Integration Points

1. **DataVerificationPanel**: Send notification when verifying contributions
2. **ESG Invitations**: Send notification when creating invitations
3. **Data Requests**: Send notification when requesting data

---

## AI Credit Management

### Component
Location: `src/components/dashboard/esg/AICreditManagement.tsx`

Features:
- Real-time credit usage display
- Monthly usage progress bar
- Low credit warnings
- Recent AI request history
- Credit reset date display

Usage:
```tsx
import { AICreditManagement } from '@/components/dashboard/esg/AICreditManagement';

<AICreditManagement organizationId={organizationId} />
```

### Credit Tracking

Current implementation uses `ai_endpoint_rate_limits` table to track requests. Each request = 10 credits (configurable).

For production:
1. Create dedicated credit tracking table
2. Implement credit deduction in edge functions
3. Add credit purchase/upgrade flow
4. Set up automatic credit renewal

---

## Testing Guidelines

### Manual Testing Checklist

#### Data Verification Workflow
- [ ] Submit a new contribution as a stakeholder
- [ ] View pending contributions as organization admin
- [ ] Approve a contribution and verify notification sent
- [ ] Reject a contribution with notes
- [ ] Request revision for a contribution
- [ ] Verify audit log entries are created
- [ ] Check RLS policies prevent unauthorized access

#### Security Features
- [ ] Test rate limiting by making rapid API calls
- [ ] Verify authentication checks in edge functions
- [ ] Test authorization for different user roles
- [ ] Check security audit logs are populated
- [ ] Verify input validation rejects malformed data

#### Error Handling
- [ ] Test error boundary with intentional error
- [ ] Verify toast notifications for different error types
- [ ] Test loading states during data fetching
- [ ] Verify empty states display correctly
- [ ] Check error recovery mechanisms

#### Email Notifications
- [ ] Send test notification for each type
- [ ] Verify email content and formatting
- [ ] Check notification logs in security_audit_log
- [ ] Test email delivery failures are handled gracefully

#### AI Credit Management
- [ ] View credit usage dashboard
- [ ] Make AI requests and verify credit deduction
- [ ] Test low credit warning display
- [ ] Verify recent usage history accuracy

### Automated Testing

#### Database Tests
```sql
-- Test rate limit function
SELECT public.check_ai_rate_limit(
  'test-user-id'::UUID,
  'ai-esg-insights',
  50,
  60
);

-- Verify RLS policies
SET ROLE authenticated;
SET request.jwt.claims.sub = 'user-id';
SELECT * FROM stakeholder_data_contributions;
```

#### Integration Tests
```typescript
// Test verification mutation
const { result } = renderHook(() => useVerifyContribution());

act(() => {
  result.current.mutate({
    contributionId: 'test-id',
    status: 'approved',
    notes: 'Test verification',
  });
});

// Verify mutation succeeded
expect(result.current.isSuccess).toBe(true);
```

### Performance Testing
- Monitor edge function response times
- Check database query performance with explain analyze
- Test rate limiting under load
- Verify caching strategies are effective

---

## Security Best Practices

1. **Never expose sensitive data** in error messages
2. **Always validate input** on both client and server
3. **Use parameterized queries** to prevent SQL injection
4. **Implement rate limiting** on all public endpoints
5. **Log security events** for audit and monitoring
6. **Use RLS policies** for data access control
7. **Encrypt sensitive data** at rest and in transit
8. **Regularly rotate secrets** and API keys
9. **Monitor for anomalous patterns** in audit logs
10. **Keep dependencies updated** for security patches

---

## Troubleshooting

### Common Issues

**Rate Limit False Positives:**
- Check `ai_endpoint_rate_limits` table for stale records
- Run cleanup function: `SELECT public.cleanup_old_rate_limits();`

**Email Notifications Not Sending:**
- Verify RESEND_API_KEY is set in Supabase
- Check email domain verification
- Review edge function logs

**RLS Policy Denials:**
- Verify user authentication
- Check organization membership
- Review policy conditions in schema

**AI Credits Not Tracking:**
- Ensure edge functions call rate limit function
- Verify `ai_endpoint_rate_limits` table exists
- Check index performance

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor security audit logs for anomalies
- Check rate limit violation patterns

**Weekly:**
- Review credit usage and adjust limits
- Clean up old rate limit records
- Analyze error logs and patterns

**Monthly:**
- Audit RLS policies for coverage
- Review and update security documentation
- Test disaster recovery procedures
- Update dependencies and security patches

### Monitoring Queries

```sql
-- Recent security violations
SELECT * FROM security_audit_log
WHERE severity IN ('high', 'critical')
ORDER BY created_at DESC
LIMIT 100;

-- Rate limit violations by user
SELECT user_id, COUNT(*) as violation_count
FROM security_audit_log
WHERE action_type = 'rate_limit_exceeded'
AND created_at > now() - interval '24 hours'
GROUP BY user_id
ORDER BY violation_count DESC;

-- Verification activity
SELECT 
  DATE(created_at) as date,
  action,
  COUNT(*) as count
FROM verification_audit_log
WHERE created_at > now() - interval '30 days'
GROUP BY date, action
ORDER BY date DESC;
```

---

## Support and Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Lovable AI Features](https://docs.lovable.dev/features/ai)
- [Resend Email Documentation](https://resend.com/docs)
- [PostgreSQL RLS Guide](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

## Changelog

### 2025-01-05
- Initial implementation of data verification workflow
- Added comprehensive RLS policies
- Implemented rate limiting for AI endpoints
- Created email notification system
- Added AI credit management UI
- Enhanced error handling across the application
