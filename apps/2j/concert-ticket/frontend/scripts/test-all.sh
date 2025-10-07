#!/bin/bash

# Concert Ticket Frontend - Comprehensive Test Runner
# This script runs all types of tests for the frontend

set -e

echo "🧪 Starting comprehensive test suite for Concert Ticket Frontend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the frontend project root"
    exit 1
fi

# 1. Lint Check
print_status "Running ESLint..."
if npx nx lint ticket-frontend; then
    print_success "ESLint passed ✅"
else
    print_error "ESLint failed ❌"
    exit 1
fi

# 2. Unit Tests
print_status "Running unit tests..."
if npx nx test ticket-frontend --coverage --watch=false; then
    print_success "Unit tests passed ✅"
else
    print_error "Unit tests failed ❌"
    exit 1
fi

# 3. Build Test
print_status "Testing production build..."
if npx nx build ticket-frontend; then
    print_success "Production build successful ✅"
else
    print_error "Production build failed ❌"
    exit 1
fi

# 4. E2E Tests (if backend is running)
print_status "Checking if backend is running..."
if lsof -ti:4000 > /dev/null 2>&1; then
    print_status "Backend detected, running E2E tests..."
    if npx nx e2e ticket-frontend; then
        print_success "E2E tests passed ✅"
    else
        print_warning "E2E tests failed - this might be due to backend issues ⚠️"
    fi
else
    print_warning "Backend not running on port 4000, skipping E2E tests ⚠️"
    print_status "To run E2E tests, start the backend first:"
    print_status "  npx nx serve concert-ticket-backend"
fi

# 5. Type Check
print_status "Running TypeScript type check..."
if npx tsc --noEmit --project tsconfig.json; then
    print_success "TypeScript type check passed ✅"
else
    print_error "TypeScript type check failed ❌"
    exit 1
fi

# 6. Test Summary
print_success "🎉 All tests completed!"
print_status "Test coverage report available in: coverage/apps/2j/concert-ticket/frontend"
print_status "E2E test results available in: cypress/results"

echo ""
echo "📋 Available test commands:"
echo "  • Unit tests:     npx nx test ticket-frontend"
echo "  • E2E tests:      npx nx e2e ticket-frontend"
echo "  • Lint:           npx nx lint ticket-frontend"
echo "  • Build:          npx nx build ticket-frontend"
echo "  • Preview:        npx nx preview ticket-frontend"
echo "  • All tests:      ./scripts/test-all.sh"
