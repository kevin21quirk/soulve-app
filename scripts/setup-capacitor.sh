
#!/bin/bash

echo "Setting up Capacitor for native mobile development..."

# Build the web app first
npm run build

# Initialize Capacitor (this creates the native project structure)
npx cap init

# Add platforms (run these commands when ready to develop for specific platforms)
echo "To add iOS platform, run: npx cap add ios"
echo "To add Android platform, run: npx cap add android"

# Sync web assets to native projects
echo "After adding platforms, run: npx cap sync"

echo "Capacitor setup complete!"
echo "Next steps:"
echo "1. Export this project to GitHub"
echo "2. Clone locally and run 'npm install'"
echo "3. Run 'npx cap add ios' and/or 'npx cap add android'"
echo "4. Run 'npm run build && npx cap sync'"
echo "5. Run 'npx cap run ios' or 'npx cap run android'"
