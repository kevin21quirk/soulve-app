# Email System Setup Guide

## Overview
SouLVE uses Resend.com for transactional emails. The system is fully implemented but requires API key configuration.

## Setup Steps

### 1. Create Resend Account
1. Go to https://resend.com
2. Sign up for an account
3. Choose the appropriate plan (Free tier supports 3,000 emails/month)

### 2. Verify Domain
**CRITICAL**: You must verify your domain to send emails from @join-soulve.com

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter: `join-soulve.com`
4. Add the provided DNS records to your domain registrar:
   - TXT record for verification
   - DKIM records for authentication
   - SPF record for sender authorization
5. Wait for DNS propagation (can take up to 48 hours)
6. Verify domain in Resend dashboard

### 3. Generate API Key
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: "SouLVE Production"
4. Select permission: "Sending access"
5. Copy the API key (starts with `re_`)

### 4. Add to Supabase
1. In Lovable, use the "Add Secret" button or go to Supabase dashboard
2. Add secret: `RESEND_API_KEY`
3. Paste the API key value
4. Save

### 5. Update Edge Function Configuration
The following edge functions use email:
- `send-welcome-email`
- `send-donation-receipt`
- `send-campaign-update`
- `send-connection-notification`
- `send-help-request-notification`
- `send-password-reset`
- `send-emergency-alert`
- `send-weekly-digest`

All are configured to use `RESEND_API_KEY` from environment variables.

## Email Types Implemented

### 1. Welcome Email (`send-welcome-email`)
- **Trigger**: New user signup
- **From**: welcome@join-soulve.com
- **Template**: Includes getting started guide, dashboard link

### 2. Donation Receipt (`send-donation-receipt`)
- **Trigger**: Successful donation
- **From**: donations@join-soulve.com
- **Includes**: Tax receipt, donation details, campaign info, formatted amounts

### 3. Waitlist Email (`send-waitlist-email`)
- **Trigger**: Waitlist approval/denial
- **From**: noreply@join-soulve.com
- **Types**: Approval or denial with reason

### 4. Demo Notification (`send-demo-notification`)
- **Trigger**: Demo request received
- **From**: demo@join-soulve.com
- **Recipients**: Demo requesters

### 5. ESG Notification (`send-esg-notification`)
- **Trigger**: ESG data contributions, invitations, requests
- **From**: esg@join-soulve.com
- **Types**: contribution_submitted, contribution_verified, invitation_sent, data_request

### 6. Emergency Alert (`send-emergency-alert`)
- **Trigger**: Critical Safe Space alerts
- **From**: alerts@join-soulve.com
- **Recipients**: Safeguarding leads (currently matt@join-soulve.com)

### 7. Safe Space Reference (`send-reference-request`)
- **Trigger**: Safe Space helper application reference checks
- **From**: safespace@join-soulve.com
- **Includes**: Verification link with 14-day expiry

### 8. General Notifications (`send-notification-email`)
- **Trigger**: In-app notifications via email
- **From**: notifications@join-soulve.com
- **Types**: Instant or daily digest

## Testing

### Test in Development
```bash
# Use Resend test mode
# In Supabase edge function, temporarily set:
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

# Call edge function with test data
supabase.functions.invoke('send-welcome-email', {
  body: { email: 'test@example.com', name: 'Test User' }
});
```

### Production Testing Checklist
- [ ] Send test email to your own address
- [ ] Verify email arrives in inbox (not spam)
- [ ] Check all links work
- [ ] Verify styling renders correctly
- [ ] Test on mobile email clients
- [ ] Test on desktop email clients (Gmail, Outlook)
- [ ] Verify unsubscribe link works
- [ ] Test all 8 email types

## Monitoring

### Email Deliverability
- Monitor bounce rates in Resend dashboard
- Check spam reports
- Review delivery rates
- Monitor API errors

### Alerts
Set up alerts for:
- Email delivery failures > 5%
- API rate limit warnings
- Domain authentication issues
- High bounce rates

## Troubleshooting

### Emails Not Sending
1. Check `RESEND_API_KEY` is set in Supabase secrets
2. Verify domain is verified in Resend
3. Check edge function logs for errors
4. Verify API key has correct permissions

### Emails Going to Spam
1. Ensure domain is verified
2. Add all DNS records (DKIM, SPF, DMARC)
3. Warm up domain gradually (increase volume slowly)
4. Monitor sender reputation

### API Rate Limits
- Free tier: 100 emails/day, 3,000/month
- If hitting limits, upgrade plan or implement queue system

## Best Practices

1. **Sender Reputation**
   - Start with low volume
   - Gradually increase sending
   - Monitor bounce rates
   - Remove invalid addresses

2. **Content Quality**
   - Clear subject lines
   - Relevant content
   - Easy unsubscribe
   - Mobile-friendly design

3. **Compliance**
   - Include physical address
   - Honor unsubscribe requests
   - Follow GDPR/PECR guidelines
   - Keep records of consent

## Cost Management

**Free Tier**: 3,000 emails/month
**Pro Tier**: $20/month for 50,000 emails

Monitor usage and upgrade when needed.

## Support

- **Resend Docs**: https://resend.com/docs
- **Resend Status**: https://status.resend.com
- **Support**: support@resend.com
