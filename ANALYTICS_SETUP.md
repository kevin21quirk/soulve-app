# Google Analytics 4 Setup Guide

## Overview
This application includes dual-tracking analytics:
- **Internal Analytics**: Logs events to Supabase tables for detailed user behavior tracking
- **Google Analytics 4**: Provides web traffic insights, demographics, and conversion tracking

Both systems work independently and in parallel.

## Configuration

### Step 1: Get Your GA4 Measurement ID
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use an existing one)
3. Navigate to: Admin → Data Streams → Web
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Add to Supabase Secrets
Add your GA4 Measurement ID as an environment variable:

```bash
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**In Supabase Dashboard:**
1. Go to Project Settings → Edge Functions → Environment Variables
2. Add: `VITE_GA4_MEASUREMENT_ID` with your measurement ID
3. Redeploy your application

**For local development (.env file):**
```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## What Gets Tracked

### Automatic Tracking
- **Page views**: Every route change is logged to GA4
- **User sessions**: Tracked automatically by GA4
- **Device/browser info**: Collected by GA4

### Custom Events (via useAnalytics hook)
All events sent through the `useAnalytics` hook are tracked in both systems:

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

const { trackEvent, trackPageView, trackDonation } = useAnalytics();

// Example: Track a campaign view
trackEvent('campaign_view', { 
  campaign_id: campaignId,
  category: 'campaigns'
});

// Example: Track a donation
trackDonation(campaignId, amount);
```

### Events Being Tracked
- Page views
- Campaign views
- Donations
- User actions (shares, likes, comments)
- Campaign creation
- User registration

## Verification

### In Google Analytics
1. Go to Reports → Realtime
2. Navigate through your app
3. You should see active users and page views in real-time

### In Browser Console
- All events are logged to console for debugging
- Look for: `Analytics Event: { event_name: '...', ... }`

## Data Privacy

### Cookie Consent
The app includes a cookie consent banner. GA4 will only initialize after user consent.

### GDPR Compliance
- IP anonymization is enabled by default
- User IDs are hashed before sending to GA4
- Users can opt-out via cookie settings

## Troubleshooting

### GA4 Not Receiving Data
1. Check that `VITE_GA4_MEASUREMENT_ID` is set correctly
2. Verify the Measurement ID format (`G-XXXXXXXXXX`)
3. Check browser console for any errors
4. Ensure cookies are enabled
5. Wait 24-48 hours for data to appear in standard reports (Realtime shows immediately)

### Internal Analytics Not Working
- Check Supabase connection
- Verify RLS policies allow authenticated users to insert analytics
- Check browser console for Supabase errors

## Support
For issues with:
- **Google Analytics**: Visit [GA4 Help Center](https://support.google.com/analytics/)
- **Internal Analytics**: Check Supabase logs and RLS policies
