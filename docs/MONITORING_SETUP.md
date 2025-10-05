# Production Monitoring Setup Guide

This guide covers setting up production monitoring for the SouLVE platform.

## Table of Contents
- [Sentry Error Tracking](#sentry-error-tracking)
- [Performance Monitoring](#performance-monitoring)
- [Database Query Monitoring](#database-query-monitoring)
- [Log Aggregation](#log-aggregation)
- [Uptime Monitoring](#uptime-monitoring)

---

## Sentry Error Tracking

### Setup

1. **Create Sentry Account**
   - Go to [sentry.io](https://sentry.io) and create an account
   - Create a new project for "React"

2. **Get Your DSN**
   - Copy your Sentry DSN from the project settings
   - Add it to `src/utils/monitoring.ts`:
   ```typescript
   const SENTRY_DSN = "https://your-dsn@sentry.io/your-project-id";
   ```

3. **Initialize Sentry**
   - Sentry is automatically initialized in `src/main.tsx`
   - User context is tracked via `useMonitoring` hook

### Features Enabled

- **Error Tracking**: Automatic capture of unhandled errors
- **Performance Monitoring**: Transaction tracing (10% sample rate)
- **Session Replay**: Visual playback of user sessions with errors
- **Breadcrumbs**: Detailed event timeline before errors
- **User Context**: Automatic user identification in error reports

### Usage

```typescript
import { logError, logMessage, addBreadcrumb } from "@/utils/monitoring";

// Log errors
try {
  // risky operation
} catch (error) {
  logError(error, { context: "additional info" });
}

// Log messages
logMessage("Important event occurred", "info", { userId: "123" });

// Add breadcrumbs for debugging
addBreadcrumb("User clicked submit button", "user-action");
```

---

## Performance Monitoring

### Automatic Monitoring

Performance metrics are automatically tracked for:
- Page load times
- API requests
- Database queries
- Component render times

### Manual Performance Tracking

```typescript
import { PerformanceMonitor, measureAsync } from "@/utils/monitoring";

// Track sync operations
const monitor = new PerformanceMonitor("Operation Name");
// ... do work ...
monitor.end({ metadata: "value" });

// Track async operations
const result = await measureAsync(
  "Async Operation",
  async () => {
    // ... async work ...
  },
  { context: "info" }
);
```

### Performance Thresholds

- **API Requests**: Logged if > 1000ms
- **Database Queries**: Logged if > 2000ms
- **Component Renders**: Logged if > 100ms

---

## Database Query Monitoring

### Query Performance Tracking

```typescript
import { QueryMonitor } from "@/utils/monitoring";

// Track a query
const startTime = performance.now();
const result = await supabase.from('table').select('*');
const duration = performance.now() - startTime;
QueryMonitor.track('table_select', duration);

// Get statistics
const stats = QueryMonitor.getStats();
console.log('Average query time:', stats.avgDuration);
```

### Admin Dashboard

Access the performance dashboard at `/admin/performance` (admin-only) to view:
- Total queries executed
- Average query duration
- Slowest queries
- Performance guidelines

---

## Log Aggregation

### Supabase Analytics

View logs in Supabase Dashboard:
- **Auth Logs**: Authentication events and errors
- **Database Logs**: SQL queries and errors
- **Edge Function Logs**: Function invocation logs

Access: https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/logs

### Log Levels

```typescript
// Info logs
console.log("Info message");

// Warning logs
console.warn("Warning message");

// Error logs
console.error("Error message");

// Sentry message logs
logMessage("Message", "warning", { context: "data" });
```

---

## Uptime Monitoring

### Recommended Services

1. **UptimeRobot** (Free)
   - Monitor: https://bf52b470-070e-4c4a-ac1a-978a0d3d9af7.lovableproject.com
   - Check interval: 5 minutes
   - Alert via: Email, SMS, Slack

2. **Pingdom** (Paid)
   - More detailed performance metrics
   - Geographic monitoring
   - Transaction monitoring

3. **Better Uptime** (Paid)
   - Status pages
   - Incident management
   - On-call scheduling

### Setup Instructions

1. **Create Account** on chosen service
2. **Add Monitor**:
   - URL: `https://bf52b470-070e-4c4a-ac1a-978a0d3d9af7.lovableproject.com`
   - Check type: HTTPS
   - Check interval: 5 minutes
3. **Configure Alerts**:
   - Email notifications
   - SMS for critical failures
   - Slack webhook integration

### Health Check Endpoint

Create a health check endpoint:

```typescript
// supabase/functions/health-check/index.ts
serve(async (req) => {
  const checks = {
    database: await checkDatabase(),
    storage: await checkStorage(),
    auth: await checkAuth(),
  };
  
  const healthy = Object.values(checks).every(c => c.status === 'ok');
  
  return new Response(
    JSON.stringify({
      status: healthy ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString()
    }),
    { 
      status: healthy ? 200 : 503,
      headers: { 'Content-Type': 'application/json' }
    }
  );
});
```

---

## Alert Configuration

### Critical Alerts

Set up alerts for:
- **Error rate > 5%**: Immediate notification
- **Response time > 3s**: Warning notification
- **Database connection errors**: Immediate notification
- **Uptime < 99%**: Daily summary

### Alert Channels

1. **Email**: Primary notification method
2. **SMS**: For critical issues only
3. **Slack**: Team notifications
4. **PagerDuty**: On-call escalation

---

## Monitoring Checklist

- [ ] Sentry DSN configured in `src/utils/monitoring.ts`
- [ ] Error tracking tested with sample errors
- [ ] Performance monitoring verified in Sentry dashboard
- [ ] Database query monitoring enabled
- [ ] Uptime monitoring service configured
- [ ] Alert channels tested (email, SMS, Slack)
- [ ] Health check endpoint deployed
- [ ] Admin performance dashboard accessible
- [ ] Log aggregation reviewed in Supabase
- [ ] Monitoring documentation shared with team

---

## Troubleshooting

### Sentry Not Capturing Errors

1. Verify DSN is correct
2. Check browser console for Sentry errors
3. Ensure `initMonitoring()` is called in `main.tsx`
4. Check Sentry project settings allow your domain

### Slow Query Alerts Not Working

1. Verify `QueryMonitor.track()` is called after queries
2. Check threshold settings in `monitoring.ts`
3. Ensure Sentry performance monitoring is enabled

### Uptime Monitor False Alarms

1. Increase check interval to reduce load
2. Whitelist monitor IP addresses in firewall
3. Check if health endpoint is accessible
4. Review timeout settings

---

## Best Practices

1. **Don't Log Sensitive Data**: Never log passwords, tokens, or PII
2. **Use Appropriate Log Levels**: Info for normal, Warning for issues, Error for failures
3. **Add Context to Errors**: Include relevant metadata in error logs
4. **Monitor Business Metrics**: Track conversion rates, user engagement
5. **Set Up Alerts Wisely**: Too many alerts lead to alert fatigue
6. **Review Logs Regularly**: Weekly review of errors and performance
7. **Clean Up Old Data**: Configure retention policies for logs

---

## Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Supabase Monitoring](https://supabase.com/docs/guides/platform/metrics)
- [Web Performance Best Practices](https://web.dev/performance/)
- [Error Handling Best Practices](https://www.honeybadger.io/blog/javascript-error-handling/)
