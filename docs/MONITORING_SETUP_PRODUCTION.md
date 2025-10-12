# Production Monitoring Setup Guide

## Overview
Complete guide for setting up production monitoring for SouLVE platform.

## 1. Error Tracking - Sentry

### Setup Steps
1. **Create Sentry Account**
   - Go to https://sentry.io
   - Sign up (free tier available)
   - Create new project: "SouLVE Production"
   - Select platform: "React"

2. **Get DSN**
   - Copy the DSN from project settings
   - Format: `https://[key]@[org].ingest.sentry.io/[project]`

3. **Update Code**
   ```typescript
   // src/utils/monitoring.ts line 8
   const SENTRY_DSN = "YOUR_SENTRY_DSN_HERE";
   ```

4. **Configure Alerts**
   - Go to Alerts → Create Alert
   - Set up:
     - Critical errors → Immediate notification
     - Error rate > 1% → Email alert
     - New issue → Slack notification

### What Gets Tracked
- ✅ JavaScript errors
- ✅ React component errors
- ✅ API failures
- ✅ Performance issues
- ✅ User sessions
- ✅ Breadcrumb trail

### Monitoring Dashboards
- **Error Rate**: Track errors per hour
- **Affected Users**: See how many users hit errors
- **Performance**: Monitor page load times
- **Release Tracking**: Compare error rates across deployments

## 2. Uptime Monitoring - UptimeRobot

### Setup Steps
1. **Create Account**
   - Go to https://uptimerobot.com
   - Free tier: 50 monitors, 5-minute checks

2. **Add Monitors**
   Create monitors for:
   ```
   Main App: https://join-soulve.com
   API Health: https://join-soulve.com/api/health
   Supabase: https://anuvztvypsihzlbkewci.supabase.co
   ```

3. **Configure Alerts**
   - Email alerts on downtime
   - SMS for critical services (paid)
   - Set check interval: 5 minutes
   - Alert contacts: Add team emails

### Alert Thresholds
- Down for 2 minutes → Alert
- Response time > 3s → Warning
- SSL certificate expires in 7 days → Alert

## 3. Application Performance Monitoring

### Already Implemented in Code
```typescript
// Automatic performance tracking
- Page loads tracked
- API requests monitored
- Component render times logged
- Database queries tracked
```

### View Performance Data
1. **Sentry Performance Tab**
   - See slowest transactions
   - Identify bottlenecks
   - Track Web Vitals (LCP, FID, CLS)

2. **Supabase Dashboard**
   - Database query performance
   - Edge function execution times
   - Storage bandwidth usage

## 4. Database Monitoring

### Supabase Built-in Monitoring
- **Database Health**: https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/reports/database
- **API Usage**: Monitor request counts
- **Storage Usage**: Track file uploads
- **Realtime Connections**: Active subscriptions

### Custom Monitoring (Already Implemented)
```sql
-- Query performance logs
SELECT * FROM query_monitor_stats;

-- Security audit log
SELECT * FROM security_audit_log 
WHERE created_at > now() - interval '24 hours';

-- Rate limit tracking
SELECT * FROM rate_limit_buckets;
```

## 5. Log Aggregation

### Supabase Logs
Access logs for:
- **Auth Logs**: User signups, logins, errors
- **Database Logs**: Query errors, slow queries
- **Edge Function Logs**: Execution logs, errors

View at: https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/logs

### Important Log Filters
```sql
-- Critical errors only
SELECT * FROM logs WHERE severity = 'error';

-- Payment-related logs
SELECT * FROM logs WHERE message LIKE '%payment%';

-- User authentication issues
SELECT * FROM logs WHERE event = 'auth_failure';
```

## 6. Alert Configuration

### Critical Alerts (Immediate Response)
- 🔴 **Payment Failures** > 5% → Email + SMS
- 🔴 **Site Down** → Email + SMS
- 🔴 **Database Offline** → Email + SMS
- 🔴 **Error Rate** > 5% → Email

### Warning Alerts (1 hour response)
- 🟡 **Slow Response Times** > 3s → Email
- 🟡 **Email Delivery** < 95% → Email
- 🟡 **High API Usage** → Email
- 🟡 **SSL Expires** < 7 days → Email

### Info Alerts (Daily digest)
- 🟢 **Daily User Signups**
- 🟢 **Donation Volume**
- 🟢 **Campaign Creations**
- 🟢 **System Health Summary**

## 7. Monitoring Checklist

### Daily
- [ ] Check Sentry for new critical errors
- [ ] Review Supabase API usage
- [ ] Verify email delivery rates
- [ ] Check uptime status

### Weekly
- [ ] Review performance trends
- [ ] Analyze slow queries
- [ ] Check storage usage growth
- [ ] Review security audit log
- [ ] Verify backup integrity

### Monthly
- [ ] Performance optimization review
- [ ] Cost analysis (Supabase, Sentry, etc.)
- [ ] Security review
- [ ] Capacity planning

## 8. Dashboard Setup

### Recommended Tools
1. **Grafana** (Advanced users)
   - Create custom dashboards
   - Combine multiple data sources
   - Set up custom alerts

2. **Datadog** (Enterprise)
   - Full-stack monitoring
   - APM + logs + metrics
   - Costs more but comprehensive

3. **Simple Dashboard** (Start here)
   - Use Sentry's built-in dashboards
   - Supabase dashboard
   - UptimeRobot status page

## 9. Incident Response Plan

### When Alert Fires
1. **Acknowledge Alert** (within 5 minutes)
2. **Assess Severity**
   - Critical: Fix immediately
   - High: Fix within 1 hour
   - Medium: Fix within 4 hours
   - Low: Fix within 24 hours

3. **Debug**
   - Check Sentry for stack trace
   - Review recent deployments
   - Check Supabase logs
   - Test locally if possible

4. **Fix & Deploy**
   - Make minimal fix
   - Test thoroughly
   - Deploy to production
   - Monitor closely

5. **Post-Mortem**
   - Document what happened
   - Update monitoring if needed
   - Prevent recurrence

## 10. Cost Monitoring

### Current Setup Costs
- **Supabase**: Free tier (upgrade at $25/month)
- **Resend**: Free tier (upgrade at $20/month)
- **Sentry**: Free tier (upgrade at $26/month)
- **UptimeRobot**: Free tier

### Upgrade Triggers
- Supabase: > 500MB database
- Resend: > 3,000 emails/month
- Sentry: > 5,000 errors/month
- Total estimate: ~$100/month at scale

## 11. Testing Monitoring

### Verify Setup
```typescript
// Test error tracking
import { logError } from '@/utils/monitoring';
logError(new Error('Test error for monitoring'), {
  test: true,
  timestamp: Date.now()
});

// Test performance tracking
import { PerformanceMonitor } from '@/utils/monitoring';
const monitor = new PerformanceMonitor('test-operation');
// ... do work
monitor.end();
```

### Smoke Tests
- [ ] Trigger test error → Appears in Sentry
- [ ] Slow API call → Shows in performance tab
- [ ] Site down → UptimeRobot alerts
- [ ] Database error → Appears in Supabase logs

## 12. Security Monitoring

### Already Implemented
```typescript
// Security audit logging
- Failed login attempts
- Permission violations
- Rate limit violations
- Unusual activity patterns
```

### Security Alerts
- Multiple failed logins from same IP
- Unusual donation patterns
- Large data exports
- Admin action logs

## Support & Resources

- **Sentry Docs**: https://docs.sentry.io
- **UptimeRobot Docs**: https://uptimerobot.com/help
- **Supabase Monitoring**: https://supabase.com/docs/guides/platform/metrics
- **Web Vitals**: https://web.dev/vitals/

## Quick Start Commands

```bash
# View Sentry errors
https://sentry.io/organizations/[org]/issues/

# View Supabase logs
https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/logs

# Check uptime status
https://uptimerobot.com/dashboard

# View edge function logs
https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/functions
```
