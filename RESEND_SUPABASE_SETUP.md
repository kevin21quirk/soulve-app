# Resend Email Setup for New Supabase Database

## Overview
Your new Supabase database needs to be configured to send registration/auth emails using your existing Resend account.

---

## Step 1: Get Resend SMTP Credentials

### Option A: Using Resend SMTP (Recommended for Supabase Auth)

1. **Log in to Resend**: https://resend.com/login
2. **Go to SMTP Settings**: https://resend.com/settings/smtp
3. **Get your SMTP credentials**:
   - **Host**: `smtp.resend.com`
   - **Port**: `465` (SSL) or `587` (TLS)
   - **Username**: `resend`
   - **Password**: Your API key (starts with `re_`)

### Option B: Get/Create API Key

1. **Go to API Keys**: https://resend.com/api-keys
2. **Create new key** (or use existing):
   - Click "Create API Key"
   - Name: "SouLVE Supabase Auth"
   - Permission: "Sending access"
   - Copy the key (starts with `re_`)

---

## Step 2: Configure Supabase Auth Email Settings

### Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/btwuqhrkhbblszuipumg
2. Navigate to: **Authentication** → **Email Templates**
3. Or direct link: https://supabase.com/dashboard/project/btwuqhrkhbblszuipumg/auth/templates

### Configure SMTP Settings

1. Go to: **Project Settings** → **Auth** → **SMTP Settings**
2. Or direct link: https://supabase.com/dashboard/project/btwuqhrkhbblszuipumg/settings/auth

3. **Enable Custom SMTP**:
   - Toggle "Enable Custom SMTP" to **ON**

4. **Enter SMTP Details**:
   ```
   Sender email: noreply@join-soulve.com
   Sender name: SouLVE
   Host: smtp.resend.com
   Port: 465
   Username: resend
   Password: [Your Resend API Key - re_xxxxx]
   ```

5. **Click "Save"**

---

## Step 3: Verify Domain in Resend (CRITICAL)

**You MUST verify your domain to send emails from @join-soulve.com**

### Add Domain to Resend

1. **Go to Domains**: https://resend.com/domains
2. **Click "Add Domain"**
3. **Enter**: `join-soulve.com`

### Add DNS Records

Resend will provide DNS records to add to your domain registrar (where you manage join-soulve.com DNS):

**Required Records:**

1. **TXT Record** (Domain Verification)
   ```
   Type: TXT
   Name: @ or join-soulve.com
   Value: [Provided by Resend]
   ```

2. **DKIM Records** (Email Authentication)
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [Provided by Resend]
   ```

3. **SPF Record** (Sender Authorization)
   ```
   Type: TXT
   Name: @ or join-soulve.com
   Value: v=spf1 include:_spf.resend.com ~all
   ```

4. **DMARC Record** (Optional but recommended)
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@join-soulve.com
   ```

### Wait for Verification

- DNS propagation can take **15 minutes to 48 hours**
- Check verification status in Resend dashboard
- Once verified, you'll see a green checkmark

---

## Step 4: Test Email Sending

### Test Registration Email

1. **Open your app**: https://main.d3s4q5q5q5q5q5.amplifyapp.com (or your Amplify URL)
2. **Try to register** with a test email
3. **Check your inbox** for the confirmation email

### If Emails Don't Arrive

**Check Supabase Logs:**
1. Go to: https://supabase.com/dashboard/project/btwuqhrkhbblszuipumg/logs/edge-logs
2. Look for SMTP errors

**Common Issues:**
- ❌ Domain not verified in Resend → Verify domain
- ❌ Wrong SMTP credentials → Double-check API key
- ❌ DNS records not propagated → Wait longer or check DNS
- ❌ Emails in spam → Add all DNS records (DKIM, SPF, DMARC)

---

## Step 5: Customize Email Templates (Optional)

### Update Supabase Email Templates

1. Go to: **Authentication** → **Email Templates**
2. Customize these templates:
   - **Confirm signup** (registration email)
   - **Magic Link** (passwordless login)
   - **Change Email Address**
   - **Reset Password**

### Template Variables Available:
- `{{ .ConfirmationURL }}` - Confirmation link
- `{{ .Token }}` - Verification token
- `{{ .Email }}` - User's email
- `{{ .SiteURL }}` - Your app URL

### Example Custom Template:
```html
<h2>Welcome to SouLVE!</h2>
<p>Thanks for signing up. Click the link below to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

---

## Quick Reference

### Supabase Project Details
- **Project ID**: `btwuqhrkhbblszuipumg`
- **Project URL**: `https://btwuqhrkhbblszuipumg.supabase.co`
- **Dashboard**: https://supabase.com/dashboard/project/btwuqhrkhbblszuipumg

### Resend Account
- **Dashboard**: https://resend.com/overview
- **SMTP Settings**: https://resend.com/settings/smtp
- **API Keys**: https://resend.com/api-keys
- **Domains**: https://resend.com/domains

### Email Addresses to Configure
- `noreply@join-soulve.com` - Auth emails (signup, password reset)
- `welcome@join-soulve.com` - Welcome emails (optional)
- `notifications@join-soulve.com` - App notifications (optional)

---

## Troubleshooting

### "SMTP Error: Authentication failed"
- ✅ Verify you're using the correct Resend API key
- ✅ Ensure API key has "Sending access" permission
- ✅ Username should be exactly `resend`

### "Domain not verified"
- ✅ Add all DNS records to your domain registrar
- ✅ Wait for DNS propagation (up to 48 hours)
- ✅ Check verification status in Resend dashboard

### Emails going to spam
- ✅ Verify domain in Resend
- ✅ Add DKIM records
- ✅ Add SPF record
- ✅ Add DMARC record
- ✅ Start with low volume and gradually increase

### Still not working?
1. Check Supabase logs: https://supabase.com/dashboard/project/btwuqhrkhbblszuipumg/logs
2. Check Resend logs: https://resend.com/logs
3. Test SMTP connection manually
4. Contact Resend support: support@resend.com

---

## Next Steps After Setup

1. ✅ Test registration flow
2. ✅ Test password reset flow
3. ✅ Test magic link login (if enabled)
4. ✅ Monitor email deliverability in Resend dashboard
5. ✅ Set up email alerts for failures

---

## Cost & Limits

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day
- Perfect for testing and early launch

**Upgrade when needed:**
- Pro: $20/month for 50,000 emails
- Monitor usage: https://resend.com/overview

---

## Support Resources

- **Resend Documentation**: https://resend.com/docs
- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Resend Status**: https://status.resend.com
- **Supabase Status**: https://status.supabase.com
