
# 📱 SouLVE Mobile App Setup

This guide will help you set up the SouLVE mobile app for iOS and Android.

## Prerequisites

- Node.js (v16 or later)
- For Android: Android Studio
- For iOS: macOS with Xcode (iOS development requires Mac)

## Quick Setup

1. **Export to GitHub** (if not done already)
   - Click the GitHub button in Lovable
   - Connect your GitHub account
   - Create repository

2. **Clone and setup locally**
   ```bash
   git clone [your-repo-url]
   cd [your-project-name]
   chmod +x scripts/setup-mobile.sh
   ./scripts/setup-mobile.sh
   ```

## Manual Setup Steps

If you prefer to run commands manually:

```bash
# Install dependencies
npm install

# Build the web app
npm run build

# Add platforms
npx cap add android
npx cap add ios  # macOS only

# Sync web assets to native apps
npx cap sync

# Open in native IDEs
npx cap open android  # Opens Android Studio
npx cap open ios      # Opens Xcode (macOS only)
```

## Development Workflow

1. **Make changes** in Lovable or your local IDE
2. **Build** the web app: `npm run build`
3. **Sync** to native apps: `npx cap sync`
4. **Test** in Android Studio or Xcode

## Hot Reload Development

The app is configured to connect to your Lovable development server for hot reload during development. This means you can make changes in Lovable and see them immediately on your mobile device.

## App Configuration

- **App ID**: `app.lovable.bf52b470070e4c4aac1a978a0d3d9af7`
- **App Name**: SouLVE
- **Development URL**: Configured for Lovable hot reload

## Troubleshooting

- **Build errors**: Make sure you have the latest Android Studio and Xcode
- **Sync issues**: Try `npx cap sync --force`
- **iOS issues**: Ensure you're on macOS with Xcode installed

For more help, visit: https://lovable.dev/blogs/TODO
