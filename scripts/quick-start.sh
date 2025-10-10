#!/bin/bash

# TrendRadar SaaS BI - Quick Start Script
# This script sets up the development environment in one command

set -e  # Exit on error

echo "🚀 TrendRadar SaaS BI Platform - Quick Start"
echo "==========================================="
echo ""

# Check Node version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18 or higher is required"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi
echo "✅ Dependencies installed"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
if command -v yarn &> /dev/null; then
    yarn migrate
else
    npm run migrate
fi
echo "✅ Migrations completed"
echo ""

# Seed data
echo "🌱 Seeding test data..."
node scripts/seed_dummy.js full
echo "✅ Test data seeded"
echo ""

# Success message
echo "✨ Setup complete!"
echo ""
echo "📧 Test Accounts:"
echo "  👑 Admin:   admin@example.com / admin123"
echo "  🏢 Owner:   owner@example.com / owner123"
echo "  📊 Analyst: analyst@example.com / analyst123"
echo "  👀 Viewer:  viewer@example.com / viewer123"
echo ""
echo "🎯 Next steps:"
echo "  1. Start dev server: npm run dev (or yarn dev)"
echo "  2. Open browser: http://localhost:3000/login"
echo "  3. Login with any test account above"
echo ""
echo "📚 Documentation:"
echo "  - README.md - Quick start guide"
echo "  - ACCEPTANCE_CRITERIA.md - Testing checklist"
echo "  - IMPLEMENTATION_SUMMARY.md - Full implementation details"
echo ""
echo "Happy coding! 🎉"

