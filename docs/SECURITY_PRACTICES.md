# Security Best Practices Guide

## Environment Variables & Secrets Management

### Public vs Private Keys

#### ✅ Safe for Client-Side (.env file)
These can be exposed in your frontend code:
- `VITE_SUPABASE_PROJECT_ID` - Public project identifier
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Anon/publishable key for client auth
- `VITE_SUPABASE_URL` - Public API endpoint
- Any `VITE_*` prefixed variables are bundled into client code

#### ❌ NEVER in .env or Client Code
These must stay server-side only:
- `SUPABASE_SERVICE_ROLE_KEY` - Full admin access to database
- `OPENAI_API_KEY` - Your OpenAI API key
- `STRIPE_SECRET_KEY` - Stripe payment secrets
- Any third-party API secrets/tokens

### Using Secrets in Edge Functions

**Correct Usage**:
```typescript
// supabase/functions/my-function/index.ts
Deno.serve(async (req) => {
  // ✅ Access via environment variables
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  // Use the secrets...
});
```

**How to Add Secrets**:
1. Go to [Supabase Edge Functions Settings](https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/settings/functions)
2. Add your secret (e.g., `OPENAI_API_KEY=sk-...`)
3. Secrets are automatically available to all edge functions via `Deno.env.get()`

---

## Git & Version Control

### .gitignore Configuration

**Required entries**:
```gitignore
# Environment variables
.env
.env.local
.env.*.local
.env.production
.env.development

# Secrets and keys
*.pem
*.key
secrets/
```

### Before Committing

**Always check**:
```bash
# Review what you're about to commit
git diff

# Never commit these patterns
git diff | grep -i "api_key\|secret\|password\|token"

# Check if .env is tracked
git status | grep ".env"
```

### If You Accidentally Committed a Secret

1. **Immediately rotate the secret** (generate new key, revoke old one)
2. **Remove from Git history**:
   ```bash
   # WARNING: This rewrites history, coordinate with team
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** (only if safe to do so)
4. **Notify team members** to re-clone repository

---

## Code Security Patterns

### Input Validation

**Always validate user input**:
```typescript
import { validateInput } from '@/utils/security';

// ✅ Validate before using
const email = validateInput.email(userInput.email);
const safeText = validateInput.text(userInput.message);
const safeQuery = validateInput.searchQuery(userInput.search);
```

### SQL Injection Prevention

**Use Supabase client methods** (never raw SQL in edge functions):
```typescript
// ✅ Safe - parameterized queries
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail);

// ❌ NEVER DO THIS in edge functions
// const { data } = await supabase.rpc('execute_sql', {
//   query: `SELECT * FROM users WHERE email = '${userEmail}'`
// });
```

### XSS Prevention

**Sanitize HTML content**:
```typescript
import { sanitizeHtml } from '@/utils/security';

// ✅ Sanitize user-generated content
const safeContent = sanitizeHtml(userInput.html);
```

### Rate Limiting

**Protect against abuse**:
```typescript
import { rateLimiter } from '@/utils/security';

// ✅ Implement rate limits
if (!rateLimiter.isAllowed(userId, 10, 60000)) {
  throw new Error('Rate limit exceeded');
}
```

---

## Database Security (RLS)

### Row Level Security (RLS)

**Always enable RLS** on tables with user data:
```sql
-- ✅ Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ✅ Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

### Common RLS Patterns

```sql
-- Public read, authenticated write
CREATE POLICY "Anyone can read" ON posts FOR SELECT USING (true);
CREATE POLICY "Auth users can write" ON posts FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Owner-only access
CREATE POLICY "Owner only" ON documents FOR ALL
  USING (auth.uid() = owner_id);

-- Organization-based access
CREATE POLICY "Org members only" ON org_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = org_data.org_id
        AND user_id = auth.uid()
    )
  );
```

---

## API Security

### Authentication in Edge Functions

**Always verify user identity**:
```typescript
// ✅ Authenticate the user
const { data: { user }, error } = await supabaseClient.auth.getUser();

if (error || !user) {
  return new Response('Unauthorized', { status: 401 });
}

// Use user.id for user-specific operations
```

### CORS Configuration

**Set appropriate CORS headers**:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specific domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle preflight
if (req.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders });
}
```

---

## Audit Logging

### Security-Relevant Events

**Log important actions**:
```typescript
import { securityAuditService } from '@/services/securityAuditService';

// ✅ Log authentication events
await securityAuditService.logAuthEvent('login_success');
await securityAuditService.logAuthEvent('login_failed', { email });

// ✅ Log data access
await securityAuditService.logDataAccess('profiles', profileId, 'view');

// ✅ Log security violations
await securityAuditService.logSecurityViolation('xss_attempt', { input });

// ✅ Log admin actions
await securityAuditService.logAdminAction('user_banned', 'user', userId);
```

---

## Dependency Management

### Regular Updates

```bash
# Check for security vulnerabilities
npm audit

# Update packages
npm update

# Update major versions carefully
npm outdated
npm install package@latest
```

### Security Scanning

**Add to CI/CD**:
```yaml
# .github/workflows/security.yml
- name: Run security audit
  run: npm audit --audit-level=moderate
```

---

## Incident Response

### If You Discover a Vulnerability

1. **Assess severity** (Critical, High, Medium, Low)
2. **Document the issue** (steps to reproduce, impact)
3. **Fix immediately** if critical
4. **Notify team** via secure channel
5. **Review similar patterns** across codebase
6. **Update this guide** with lessons learned

### Security Checklist for New Features

- [ ] User input validated and sanitized
- [ ] RLS policies configured for new tables
- [ ] No secrets hardcoded in code
- [ ] Rate limiting implemented where needed
- [ ] Audit logging for sensitive operations
- [ ] Authentication required where appropriate
- [ ] Error messages don't leak sensitive info
- [ ] Third-party integrations use environment variables

---

## Resources

### Documentation
- [Supabase Security Best Practices](https://supabase.com/docs/guides/database/securing-your-data)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Tools
- [Supabase Dashboard - Edge Functions Secrets](https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/settings/functions)
- [Git Secret Scanning](https://github.com/features/security)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)

---

## Team Onboarding

### For New Developers

1. **Never commit `.env` files**
2. **Copy `.env.example` to `.env` locally**
3. **Ask team lead for Supabase project access**
4. **Review this security guide**
5. **Set up pre-commit hooks** (if configured)

### For Code Reviews

Check for:
- [ ] No hardcoded secrets or API keys
- [ ] Input validation on user data
- [ ] RLS policies for new database tables
- [ ] Proper error handling (no sensitive data in errors)
- [ ] Authentication checks in protected routes/functions

---

*Last Updated: 2025-01-28*  
*Next Review: 2025-04-28*
