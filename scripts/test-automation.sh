#!/bin/bash

# Automated testing script for SouLVE pre-launch checks
# Run this script to perform automated tests before deploying

set -e  # Exit on error

echo "🚀 SouLVE Pre-Launch Automated Tests"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠ WARNING${NC}: $1"
    ((WARNINGS++))
}

echo "1️⃣  Checking Build..."
echo "--------------------"

# Test: Build succeeds
if npm run build > /dev/null 2>&1; then
    print_result 0 "Build completes successfully"
else
    print_result 1 "Build failed"
fi

# Test: No TypeScript errors
if npx tsc --noEmit > /dev/null 2>&1; then
    print_result 0 "No TypeScript errors"
else
    print_result 1 "TypeScript errors detected"
fi

echo ""
echo "2️⃣  Checking Dependencies..."
echo "---------------------------"

# Test: All dependencies installed
if [ -d "node_modules" ]; then
    print_result 0 "Dependencies installed"
else
    print_result 1 "Missing node_modules"
fi

# Test: No security vulnerabilities
AUDIT_OUTPUT=$(npm audit --json 2>/dev/null || echo '{"vulnerabilities":{}}')
HIGH_VULNS=$(echo $AUDIT_OUTPUT | grep -o '"high":[0-9]*' | grep -o '[0-9]*' || echo "0")
CRITICAL_VULNS=$(echo $AUDIT_OUTPUT | grep -o '"critical":[0-9]*' | grep -o '[0-9]*' || echo "0")

if [ "$HIGH_VULNS" -eq "0" ] && [ "$CRITICAL_VULNS" -eq "0" ]; then
    print_result 0 "No critical security vulnerabilities"
else
    print_result 1 "Security vulnerabilities detected (High: $HIGH_VULNS, Critical: $CRITICAL_VULNS)"
fi

echo ""
echo "3️⃣  Checking Files..."
echo "--------------------"

# Test: Required files exist
required_files=(
    "public/manifest.json"
    "public/robots.txt"
    "public/sitemap.xml"
    "src/components/legal/CookieConsent.tsx"
    "src/pages/TermsOfService.tsx"
    "src/pages/PrivacyPolicy.tsx"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_result 0 "Required file exists: $file"
    else
        print_result 1 "Missing required file: $file"
    fi
done

echo ""
echo "4️⃣  Checking Configuration..."
echo "----------------------------"

# Test: Environment variables
if [ -f ".env" ]; then
    print_warning "Found .env file (ensure production uses proper secrets)"
else
    print_result 0 "No .env file (production ready)"
fi

# Test: Supabase config exists
if [ -f "supabase/config.toml" ]; then
    print_result 0 "Supabase config exists"
else
    print_result 1 "Missing supabase/config.toml"
fi

echo ""
echo "5️⃣  Checking Accessibility..."
echo "----------------------------"

# Test: Check for basic accessibility issues
if grep -r "onClick" src/ | grep -v "onKeyDown" | grep -v "button" | grep -v "Button" > /dev/null; then
    print_warning "Found onClick without keyboard support in some components"
else
    print_result 0 "No obvious keyboard accessibility issues"
fi

# Test: Images have alt text (basic check)
if grep -r "<img" src/ | grep -v "alt=" > /dev/null; then
    print_warning "Some images may be missing alt text"
else
    print_result 0 "All images appear to have alt attributes"
fi

echo ""
echo "6️⃣  Checking SEO..."
echo "------------------"

# Test: Meta tags in index.html
if grep -q "meta.*description" index.html; then
    print_result 0 "Meta description found"
else
    print_result 1 "Missing meta description"
fi

if grep -q "meta.*og:" index.html; then
    print_result 0 "Open Graph tags found"
else
    print_warning "Open Graph tags not found in index.html"
fi

echo ""
echo "7️⃣  Checking Security..."
echo "-----------------------"

# Test: No hardcoded secrets
if grep -r "sk_live_" src/ > /dev/null; then
    print_result 1 "Found hardcoded Stripe live keys"
else
    print_result 0 "No hardcoded Stripe keys"
fi

if grep -r "password.*=.*[\"']" src/ | grep -v "password:" | grep -v "password'" > /dev/null; then
    print_warning "Found potential hardcoded passwords"
else
    print_result 0 "No obvious hardcoded passwords"
fi

echo ""
echo "8️⃣  Checking Performance..."
echo "-------------------------"

# Test: Bundle size (basic check)
if [ -d "dist" ]; then
    BUNDLE_SIZE=$(du -sh dist | cut -f1)
    print_warning "Bundle size: $BUNDLE_SIZE (check if acceptable)"
fi

echo ""
echo "=================================="
echo "📊 Test Summary"
echo "=================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical tests passed!${NC}"
    echo "⚠️  Please review warnings and complete manual testing"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please fix issues before deploying.${NC}"
    exit 1
fi
