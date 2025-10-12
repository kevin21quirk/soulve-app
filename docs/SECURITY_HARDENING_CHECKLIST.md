# Security Hardening Checklist

## Immediate Actions Required

### 1. Enable Leaked Password Protection
**Status**: ⚠️ Currently Disabled

**Action Required**:
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/auth/providers
2. Navigate to "Auth Providers" → "Email"
3. Find "Leaked Password Protection"
4. Enable the toggle
5. Save changes

**What This Does**:
- Checks passwords against known breach databases
- Prevents users from using compromised passwords
- Protects accounts from credential stuffing attacks

**Impact**: Low (improves security without breaking functionality)

---

## 2. Supabase Security Configuration

### Auth Settings
- [x] Email confirmation required (currently enabled)
- [ ] **Leaked password protection** (MUST ENABLE)
- [x] Rate limiting enabled
- [x] JWT expiry set appropriately
- [x] Secure password requirements

### Database Security
- [x] RLS enabled on all tables
- [x] Security definer functions use `SET search_path`
- [x] No raw SQL execution in edge functions
- [x] Proper foreign key constraints
- [x] Sensitive data encrypted

### Storage Security
- [x] RLS policies on storage.objects
- [x] File upload size limits (10MB)
- [x] File type validation
- [x] Bucket access controls properly configured

---

## 3. Application-Level Security

### Input Validation
- [x] XSS protection implemented (`src/utils/security.ts`)
- [x] SQL injection prevented (using Supabase client)
- [x] CSRF protection (via Supabase)
- [x] Email validation
- [x] URL validation
- [x] Search query sanitization

### Rate Limiting
**Implemented**:
- [x] Client-side rate limiter (`RateLimiter` class)
- [x] Database rate limit buckets
- [x] AI endpoint rate limiting
- [x] Edge function rate limits

**Limits Set**:
- Login attempts: 5 per hour
- Password reset: 3 per hour
- API calls: 50 per minute
- AI requests: 50 per hour

### Authentication
- [x] Secure session management
- [x] Password hashing (handled by Supabase)
- [x] Email/password validation
- [x] Session timeout (7 days default)
- [x] Refresh token rotation

---

## 4. Data Protection

### Encryption
- [x] HTTPS enforced (automatic via Lovable/Supabase)
- [x] JWT tokens encrypted
- [x] Sensitive data masked in logs
- [x] End-to-end encryption for safe space messages

### Privacy
- [x] User privacy settings implemented
- [x] Data export capability
- [x] Account deletion works
- [x] GDPR compliance ready
- [x] Cookie consent (if using analytics cookies)

### Access Control
- [x] RLS policies enforce user boundaries
- [x] Admin functions protected
- [x] Organization access controlled
- [x] File access controlled by RLS

---

## 5. Monitoring & Audit

### Security Logging
**Implemented Tables**:
- `security_audit_log` - All security events
- `message_access_log` - Message access tracking
- `fraud_detection_log` - Suspicious activity
- `red_flags` - User trust issues
- `point_decay_log` - Point manipulation tracking

### Monitoring Alerts
- [ ] Set up Sentry for security errors
- [ ] Alert on multiple failed logins
- [ ] Alert on unusual donation patterns
- [ ] Alert on bulk data exports
- [ ] Alert on admin actions

### Regular Reviews
- [ ] Weekly security log review
- [ ] Monthly access audit
- [ ] Quarterly security assessment
- [ ] Annual penetration test

---

## 6. Edge Function Security

### Best Practices Implemented
- [x] CORS headers configured
- [x] JWT verification (where needed)
- [x] Input validation
- [x] Error handling
- [x] Logging sensitive operations
- [x] Rate limiting

### Secrets Management
- [x] Environment variables used
- [x] No hardcoded secrets
- [x] Secrets encrypted in Supabase
- [ ] Add RESEND_API_KEY
- [ ] Add payment gateway keys (when ready)

---

## 7. Content Security

### Content Moderation
- [x] Report system implemented
- [x] Admin moderation queue
- [x] Automated flagging for suspicious content
- [x] Safeguarding alerts system

### File Upload Security
- [x] File type validation
- [x] Size limits enforced
- [x] Virus scanning (via client-side checks)
- [x] Malicious content detection
- [x] Storage quotas per user

---

## 8. API Security

### Endpoint Protection
- [x] All endpoints require authentication
- [x] Rate limiting on all endpoints
- [x] Input validation
- [x] Output sanitization
- [x] Error messages don't leak data

### Request Security
- [x] CORS properly configured
- [x] Request size limits
- [x] Timeout configured
- [x] Retry logic implemented

---

## 9. Vulnerability Management

### Regular Scans
- [ ] Run Supabase linter weekly
- [ ] Monitor npm audit results
- [ ] Check for outdated dependencies
- [ ] Review security advisories

### Penetration Testing
- [ ] Pre-launch security audit
- [ ] Quarterly pen tests
- [ ] Bug bounty program (future)

### Incident Response
- [x] Plan documented (`docs/MONITORING_SETUP.md`)
- [ ] Team trained
- [ ] Contact list updated
- [ ] Backup/restore tested

---

## 10. Compliance

### GDPR
- [x] Privacy policy page
- [x] Cookie consent
- [x] Data export function
- [x] Right to deletion
- [x] Data minimization
- [x] Consent records

### UK Charity Regulations
- [x] Gift Aid implemented
- [x] Donation receipts
- [x] Financial transparency
- [x] Audit trail

---

## 11. Infrastructure Security

### Supabase
- [x] 2FA enabled for admin accounts
- [x] API keys rotated regularly
- [x] Backup strategy defined
- [x] Disaster recovery plan

### Third-Party Services
- [ ] Resend: API key secured
- [ ] Sentry: DSN public (OK - designed for client)
- [ ] Payment gateway: PCI DSS compliant (when added)

---

## 12. Code Security

### Static Analysis
- [x] TypeScript strict mode
- [x] ESLint security rules
- [x] No console.log of sensitive data
- [x] No commented-out credentials

### Dependencies
- [x] Only trusted packages used
- [x] Minimal dependencies
- [x] Regular updates
- [ ] Automated vulnerability scanning

---

## Testing Requirements

### Security Test Cases
- [ ] SQL injection attempts blocked
- [ ] XSS attacks prevented
- [ ] CSRF protection works
- [ ] Rate limits enforced
- [ ] RLS policies can't be bypassed
- [ ] Session hijacking prevented
- [ ] File upload attacks blocked

### Penetration Testing Scenarios
1. Authentication bypass attempts
2. Privilege escalation
3. Data access violations
4. API abuse
5. File upload exploits
6. XSS payload injections
7. SQL injection attempts

---

## Launch Blockers (Must Fix)

### Critical
- [ ] **Enable leaked password protection** ⚠️

### High Priority
- [ ] Add RESEND_API_KEY
- [ ] Configure Sentry DSN
- [ ] Run full security test suite

### Medium Priority
- [ ] Set up security monitoring alerts
- [ ] Document incident response
- [ ] Train team on security

---

## Post-Launch Security

### Ongoing Tasks
- Monitor security logs daily
- Review failed login attempts
- Track suspicious donations
- Update dependencies weekly
- Rotate API keys quarterly
- Security training annually

### Security Metrics
- Failed login attempts per day
- Rate limit violations
- Security errors logged
- User reports of suspicious activity
- Time to respond to incidents

---

## Resources

- [Supabase Security Docs](https://supabase.com/docs/guides/platform/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [UK GDPR Guide](https://ico.org.uk/for-organisations/guide-to-data-protection/)
- [PCI DSS Standards](https://www.pcisecuritystandards.org/)

---

## Sign-Off

- [ ] Security Lead Approval
- [ ] Technical Lead Approval
- [ ] Legal Review Complete
- [ ] Insurance Updated (if applicable)

**Last Updated**: 2025-10-12  
**Next Review**: Before Launch  
**Owner**: Technical Team
