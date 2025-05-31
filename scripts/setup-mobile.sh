
#!/bin/bash

echo "🚀 Setting up SouLVE mobile app..."

# Check if we're in a git repository (meaning this is run locally after GitHub export)
if [ ! -d ".git" ]; then
    echo "❌ This script should be run after exporting to GitHub and cloning locally"
    echo "Please:"
    echo "1. Export this project to GitHub using the GitHub button in Lovable"
    echo "2. Clone the repository locally"
    echo "3. Run this script from the project root"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the web app
echo "🏗️ Building web app..."
npm run build

# Check if Capacitor is already initialized
if [ ! -f "ios/App/App.xcodeproj/project.pbxproj" ] && [ ! -f "android/app/build.gradle" ]; then
    echo "📱 Adding mobile platforms..."
    
    # Add Android platform
    echo "🤖 Adding Android platform..."
    npx cap add android
    
    # Add iOS platform (only on macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "🍎 Adding iOS platform..."
        npx cap add ios
    else
        echo "⚠️ Skipping iOS platform (requires macOS)"
    fi
else
    echo "📱 Mobile platforms already exist"
fi

# Sync the web app with native platforms
echo "🔄 Syncing web app to native platforms..."
npx cap sync

echo "✅ Mobile setup complete!"
echo ""
echo "Next steps:"
echo "🤖 For Android: npx cap open android"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 For iOS: npx cap open ios"
fi
echo ""
echo "📖 Read more about mobile development: https://lovable.dev/blogs/TODO"
