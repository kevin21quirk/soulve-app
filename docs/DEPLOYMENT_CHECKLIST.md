# Deployment Checklist

## Pre-Deployment

### 1. Environment Configuration

- [ ] **Supabase Secrets Configured**
  - [ ] `LOVABLE_API_KEY` (auto-configured)
  - [ ] `RESEND_API_KEY` (for email notifications)
  - [ ] Verify at: https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/settings/functions

### 2. Database

- [ ] **All Migrations Applied**
  ```sql
  -- Check migration history
  SELECT * FROM supabase_migrations.schema_migrations
  ORDER BY version DESC;
  ```

- [ ] **RLS Policies Active**
  ```sql
  -- Verify RLS is enabled on critical tables
  SELECT schemaname, tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public' 
  AND rowsecurity = false;
  -- Should return no rows for critical tables
  ```

- [ ] **Indexes Optimized**
  ```sql
  -- Check for missing indexes on frequently queried columns
  SELECT schemaname, tablename, indexname 
  FROM pg_indexes 
  WHERE schemaname = 'public'
  ORDER BY tablename;
  ```

- [ ] **Database Backup Configured**
  - Enable Point-in-Time Recovery (PITR)
  - Set up automated daily backups
  - Test backup restoration process

### 3. Edge Functions

- [ ] **All Edge Functions Deployed**
  - [ ] `ai-esg-insights`
  - [ ] `send-esg-notification`
  - Verify at: https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/functions

- [ ] **Edge Function Logs Monitored**
  - Set up log alerts for errors
  - Configure log retention period

### 4. Security

- [ ] **Rate Limiting Active**
  ```sql
  -- Test rate limit function
  SELECT check_ai_rate_limit(
    auth.uid(),
    'ai-esg-insights',
    50,
    60
  );
  ```

- [ ] **Audit Logging Enabled**
  ```sql
  -- Verify audit log table exists and is capturing events
  SELECT COUNT(*) FROM security_audit_log;
  ```

- [ ] **Input Validation Implemented**
  - All user inputs sanitized
  - SQL injection protection verified
  - XSS protection in place

- [ ] **Authentication Required**
  - All protected routes require auth
  - JWT validation on edge functions
  - Session management configured

### 5. Email Configuration

- [ ] **Resend Domain Verified**
  - Verify at: https://resend.com/domains
  - DNS records added and validated

- [ ] **Email Templates Tested**
  - Send test emails for all notification types
  - Verify email deliverability
  - Check spam folder placement

- [ ] **Email Error Handling**
  - Failed email delivery logged
  - Retry logic implemented
  - User notification on failure

### 6. Performance

- [ ] **Query Performance Optimized**
  ```sql
  -- Check slow queries
  SELECT query, calls, mean_exec_time, total_exec_time
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10;
  ```

- [ ] **Database Connection Pooling**
  - Connection pool size configured
  - Idle timeout set appropriately
  - Max connections monitored

- [ ] **Frontend Performance**
  - [ ] Lazy loading implemented
  - [ ] Code splitting configured
  - [ ] Images optimized
  - [ ] Bundle size < 500KB
  - [ ] First contentful paint < 2s

### 7. Monitoring

- [ ] **Error Tracking Configured**
  - Sentry or similar service set up
  - Error alerts configured
  - Source maps uploaded

- [ ] **Analytics Configured**
  - User behavior tracking
  - Performance monitoring
  - Conversion tracking

- [ ] **Uptime Monitoring**
  - Health check endpoint created
  - Uptime monitor configured
  - Alert notifications set up

- [ ] **Database Monitoring**
  ```sql
  -- Set up monitoring for:
  -- 1. Connection count
  -- 2. Query performance
  -- 3. Table sizes
  -- 4. Index usage
  SELECT * FROM pg_stat_database WHERE datname = 'postgres';
  ```

### 8. Testing

- [ ] **All Tests Passing**
  - Unit tests
  - Integration tests
  - End-to-end tests

- [ ] **Security Tests Passed**
  - Penetration testing complete
  - Vulnerability scan clean
  - RLS policies validated

- [ ] **Load Testing Complete**
  - Concurrent user testing
  - API endpoint stress testing
  - Database load testing

- [ ] **Browser Compatibility**
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)
  - Mobile browsers

### 9. Documentation

- [ ] **User Documentation**
  - [ ] Getting started guide
  - [ ] Feature documentation
  - [ ] FAQ section
  - [ ] Troubleshooting guide

- [ ] **Admin Documentation**
  - [ ] Admin panel guide
  - [ ] Data verification workflow
  - [ ] User management
  - [ ] System configuration

- [ ] **Technical Documentation**
  - [ ] API documentation
  - [ ] Database schema
  - [ ] Architecture overview
  - [ ] Security implementation

- [ ] **Runbooks Created**
  - [ ] Incident response
  - [ ] Backup restoration
  - [ ] Database migration
  - [ ] System recovery

## Deployment

### 1. Pre-Deployment Verification

- [ ] Create deployment checklist
- [ ] Review all changes
- [ ] Verify staging environment
- [ ] Schedule deployment window
- [ ] Notify stakeholders

### 2. Deployment Steps

1. **Database Migrations**
   ```bash
   # Apply migrations in order
   supabase db push
   ```

2. **Edge Functions**
   ```bash
   # Deploy edge functions
   supabase functions deploy ai-esg-insights
   supabase functions deploy send-esg-notification
   ```

3. **Frontend Deployment**
   - Build production bundle
   - Deploy to hosting provider
   - Verify deployment

4. **DNS Configuration**
   - Update DNS records
   - Verify SSL certificates
   - Test domain resolution

### 3. Post-Deployment Verification

- [ ] **Health Checks**
  ```bash
  # Test critical endpoints
  curl https://your-domain.com/api/health
  curl https://your-domain.com
  ```

- [ ] **Smoke Tests**
  - [ ] User login
  - [ ] Data verification workflow
  - [ ] Email notifications
  - [ ] AI recommendations
  - [ ] Admin panel access

- [ ] **Performance Monitoring**
  - Check response times
  - Monitor error rates
  - Verify database connections

- [ ] **Security Verification**
  - SSL/TLS working
  - Security headers present
  - CORS configured correctly

## Post-Deployment

### 1. Monitoring

- [ ] Watch error logs for 24 hours
- [ ] Monitor performance metrics
- [ ] Check database query performance
- [ ] Verify email delivery rates

### 2. User Communication

- [ ] Send deployment announcement
- [ ] Update status page
- [ ] Notify support team
- [ ] Update documentation

### 3. Rollback Plan

- [ ] Document rollback procedure
- [ ] Test rollback process
- [ ] Keep previous version ready
- [ ] Monitor for issues

## Rollback Procedure

### If Issues Occur:

1. **Assess Severity**
   - Critical: Immediate rollback
   - High: Fix within 1 hour or rollback
   - Medium: Schedule fix
   - Low: Add to backlog

2. **Execute Rollback**
   ```bash
   # Revert edge functions
   supabase functions deploy ai-esg-insights --project-ref previous-ref
   
   # Revert database (if needed)
   supabase db reset --db-url previous-version
   
   # Redeploy frontend
   # (process depends on hosting provider)
   ```

3. **Verify Rollback**
   - Test critical functionality
   - Verify no data loss
   - Check system stability

4. **Post-Mortem**
   - Document what went wrong
   - Identify root cause
   - Update procedures
   - Schedule fix

## Ongoing Maintenance

### Daily

- [ ] Review error logs
- [ ] Check system health
- [ ] Monitor performance
- [ ] Verify backups

### Weekly

- [ ] Security updates
- [ ] Performance analysis
- [ ] Capacity planning
- [ ] User feedback review

### Monthly

- [ ] Security audit
- [ ] Database optimization
- [ ] Dependency updates
- [ ] Documentation review

## Emergency Contacts

- **Development Team:** [contact info]
- **DevOps:** [contact info]
- **Security Team:** [contact info]
- **Support Team:** [contact info]

## Key Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/anuvztvypsihzlbkewci
- **Edge Function Logs:** https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/functions
- **Database Logs:** https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/logs/postgres-logs
- **Documentation:** [link to docs]
- **Status Page:** [link to status page]

## Sign-Off

- [ ] **Development Lead:** __________________ Date: __________
- [ ] **Security Team:** __________________ Date: __________
- [ ] **DevOps:** __________________ Date: __________
- [ ] **Project Manager:** __________________ Date: __________

---

**Deployment Date:** __________
**Deployment Version:** __________
**Deployed By:** __________
