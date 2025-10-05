# ESG Platform Testing Guide

## Quick Testing Checklist

### 1. Data Verification Workflow Testing

#### Setup Test Data
```sql
-- Create test organization
INSERT INTO organizations (id, name, type, industry_sector)
VALUES ('test-org-123', 'Test Organization', 'company', 'technology');

-- Add test organization member (admin)
INSERT INTO organization_members (organization_id, user_id, role, is_active)
VALUES ('test-org-123', auth.uid(), 'admin', true);

-- Create test ESG indicator
INSERT INTO esg_indicators (id, name, category, unit)
VALUES ('test-indicator-123', 'Carbon Emissions', 'environmental', 'tonnes CO2');

-- Submit test contribution
INSERT INTO stakeholder_data_contributions (
  organization_id,
  contributor_user_id,
  indicator_id,
  data_value,
  reporting_period,
  contribution_status
) VALUES (
  'test-org-123',
  auth.uid(),
  'test-indicator-123',
  1000.50,
  '2024-01-01',
  'pending'
);
```

#### Test Verification Actions
1. **Navigate to Admin Hub** → ESG Management tab
2. **Verify Pending Tab** shows the test contribution
3. **Click "Verify" button** on a contribution
4. **Test Approve Action:**
   - Select "Approve"
   - Add verification notes
   - Click Confirm
   - Verify status changes to "Approved"
   - Check toast notification appears

5. **Test Reject Action:**
   - Create another test contribution
   - Select "Reject"
   - Add rejection reason
   - Verify status changes to "Rejected"

6. **Test Request Revision:**
   - Create another test contribution
   - Select "Request Revision"
   - Add revision notes
   - Verify status changes to "Needs Revision"

### 2. Security Testing

#### Rate Limiting
```typescript
// Test rate limiting by making rapid requests
const testRateLimit = async () => {
  const requests = Array(60).fill(null).map(() => 
    supabase.functions.invoke('ai-esg-insights', {
      body: { organizationId: 'test-org', analysisType: 'report' }
    })
  );
  
  const results = await Promise.allSettled(requests);
  const rateLimited = results.filter(r => 
    r.status === 'rejected' && r.reason?.message?.includes('rate limit')
  );
  
  console.log(`Rate limited after ${60 - rateLimited.length} requests`);
};
```

#### RLS Policy Testing
```sql
-- Test as non-admin user (should fail)
SET LOCAL role TO 'authenticated';
SET LOCAL request.jwt.claims.sub TO 'non-admin-user-id';

UPDATE stakeholder_data_contributions 
SET contribution_status = 'approved'
WHERE id = 'test-contribution-id';
-- Should fail with RLS violation

-- Test as admin user (should succeed)
SET LOCAL request.jwt.claims.sub TO 'admin-user-id';

UPDATE stakeholder_data_contributions 
SET contribution_status = 'approved'
WHERE id = 'test-contribution-id';
-- Should succeed
```

### 3. Email Notification Testing

#### Test Email Sending
1. **Set up Resend:**
   - Create account at resend.com
   - Verify domain at https://resend.com/domains
   - Create API key at https://resend.com/api-keys
   - Add RESEND_API_KEY secret in Supabase

2. **Test Notification Types:**

```typescript
// Test contribution verified notification
await supabase.functions.invoke('send-esg-notification', {
  body: {
    to: 'test@example.com',
    type: 'contribution_verified',
    data: {
      recipientName: 'John Doe',
      organizationName: 'Test Org',
      verificationStatus: 'Approved',
      verificationNotes: 'Data looks good!',
    }
  }
});

// Check edge function logs
// https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/functions/send-esg-notification/logs
```

### 4. AI Credit Management Testing

#### View Credit Usage
1. Navigate to Admin Hub → ESG tab
2. Verify AI Credit Management card displays
3. Check that it shows:
   - Total credits
   - Used credits
   - Remaining credits
   - Recent usage list

#### Test Credit Tracking
```typescript
// Make AI request
await supabase.functions.invoke('ai-esg-insights', {
  body: {
    organizationId: 'test-org',
    analysisType: 'recommendations'
  }
});

// Check rate_limits table
const { data } = await supabase
  .from('ai_endpoint_rate_limits')
  .select('*')
  .eq('endpoint_name', 'ai-esg-insights')
  .order('created_at', { ascending: false })
  .limit(1);

console.log('Latest AI request:', data);
```

### 5. Error Boundary Testing

#### Trigger Error Boundary
```typescript
// Add to any component temporarily
const TestErrorBoundary = () => {
  throw new Error('Test error for boundary');
  return <div>Should not render</div>;
};

// Wrap in ErrorBoundary
<ErrorBoundary>
  <TestErrorBoundary />
</ErrorBoundary>
```

#### Verify Error Handling
1. Should display user-friendly error message
2. Should show error details in development mode
3. Should provide "Try Again" and "Refresh Page" buttons
4. Should not crash the entire app

### 6. UI Component Testing

#### Loading States
```typescript
// Test loading state
<LoadingState message="Loading ESG data..." />
```

#### Empty States
```typescript
// Test empty state
<EmptyState
  icon={AlertCircle}
  title="No Data Available"
  description="No contributions have been submitted yet."
  action={{
    label: "Submit Data",
    onClick: () => console.log("Submit clicked")
  }}
/>
```

### 7. Integration Testing

#### End-to-End Workflow
1. **Stakeholder submits contribution:**
   ```typescript
   await supabase.from('stakeholder_data_contributions').insert({
     organization_id: 'test-org',
     indicator_id: 'test-indicator',
     data_value: 500,
     reporting_period: '2024-01-01',
   });
   ```

2. **Admin receives notification** (if email configured)

3. **Admin reviews in dashboard:**
   - Navigate to Admin Hub → ESG
   - See contribution in Pending tab

4. **Admin verifies contribution:**
   - Click Verify
   - Select action (Approve/Reject/Revision)
   - Add notes
   - Submit

5. **Contributor receives notification** (if email configured)

6. **Audit log created:**
   ```sql
   SELECT * FROM esg_verification_audit_log
   WHERE contribution_id = 'test-contribution-id'
   ORDER BY created_at DESC;
   ```

7. **Security audit logged:**
   ```sql
   SELECT * FROM security_audit_log
   WHERE action_type IN ('esg_data_access', 'data_verification')
   ORDER BY created_at DESC
   LIMIT 10;
   ```

## Performance Testing

### 1. Query Performance
```sql
-- Check query performance
EXPLAIN ANALYZE
SELECT * FROM stakeholder_data_contributions
WHERE organization_id = 'test-org'
AND contribution_status = 'pending';

-- Should use index, execution time < 50ms
```

### 2. Rate Limit Performance
```sql
-- Check rate limit function performance
EXPLAIN ANALYZE
SELECT check_ai_rate_limit(
  'test-user-id'::uuid,
  'ai-esg-insights',
  50,
  60
);

-- Should complete in < 10ms
```

### 3. Frontend Performance
```typescript
// Measure component render time
import { Profiler } from 'react';

<Profiler id="DataVerificationPanel" onRender={(id, phase, actualDuration) => {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}}>
  <DataVerificationPanel organizationId={orgId} />
</Profiler>
```

## Security Testing Checklist

- [ ] RLS policies prevent unauthorized access
- [ ] Rate limiting blocks excessive requests
- [ ] Input validation rejects malformed data
- [ ] Authentication required for all protected endpoints
- [ ] CSRF protection enabled
- [ ] SQL injection prevention verified
- [ ] XSS protection in place
- [ ] Sensitive data encrypted
- [ ] Audit logs capture all critical actions
- [ ] Error messages don't leak sensitive info

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Form labels properly associated
- [ ] Error messages announced
- [ ] Loading states announced
- [ ] Modal dialogs trap focus

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Common Issues & Solutions

### Issue: Rate limit not working
**Solution:** Check that `check_ai_rate_limit` function exists and rate_limits table has proper indexes.

### Issue: Email notifications not sending
**Solution:** 
1. Verify RESEND_API_KEY is set
2. Check domain verification at resend.com
3. Review edge function logs for errors

### Issue: RLS policy violations
**Solution:**
1. Verify user authentication
2. Check organization membership
3. Review policy conditions
4. Use `EXPLAIN` to debug policy matching

### Issue: AI requests failing
**Solution:**
1. Check LOVABLE_API_KEY is set
2. Verify rate limits not exceeded
3. Check edge function logs
4. Verify organization membership

### Issue: Verification not updating
**Solution:**
1. Check RLS policies allow updates
2. Verify user has admin role
3. Check contribution_id is valid
4. Review audit logs for errors

## Production Readiness Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Performance benchmarks met
- [ ] Security audit complete
- [ ] Email notifications configured
- [ ] Rate limiting tested
- [ ] Error handling verified
- [ ] Documentation complete
- [ ] Backup procedures established
- [ ] Monitoring configured
- [ ] SSL certificates valid
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] API keys secured
- [ ] CORS configured correctly

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Rate Limit Violations:**
   ```sql
   SELECT COUNT(*) as violations
   FROM security_audit_log
   WHERE action_type = 'rate_limit_exceeded'
   AND created_at > now() - interval '1 hour';
   ```

2. **Failed Verifications:**
   ```sql
   SELECT COUNT(*) as failures
   FROM esg_verification_audit_log
   WHERE action = 'rejected'
   AND created_at > now() - interval '24 hours';
   ```

3. **Email Failures:**
   ```sql
   SELECT COUNT(*) as failures
   FROM security_audit_log
   WHERE action_type = 'email_notification_sent'
   AND severity = 'high'
   AND created_at > now() - interval '24 hours';
   ```

4. **AI Request Volume:**
   ```sql
   SELECT 
     endpoint_name,
     COUNT(*) as requests,
     AVG(request_count) as avg_per_user
   FROM ai_endpoint_rate_limits
   WHERE created_at > now() - interval '1 hour'
   GROUP BY endpoint_name;
   ```

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Lovable AI Documentation](https://docs.lovable.dev/features/ai)
- [Project Implementation Guide](./ESG_SECURITY_IMPLEMENTATION.md)
