#!/bin/bash

# Metricly Setup Verification Script
# This script checks if your Metricly setup is correct before running

echo "🔍 Metricly Setup Verification"
echo "================================\n"

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "  ✓ Node.js $NODE_VERSION installed"
else
    echo "  ✗ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
echo "\n✓ Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "  ✓ npm $NPM_VERSION installed"
else
    echo "  ✗ npm not found"
    exit 1
fi

# Check .env.local
echo "\n✓ Checking environment variables..."
if [ -f .env.local ]; then
    echo "  ✓ .env.local exists"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "  ✓ NEXT_PUBLIC_SUPABASE_URL set"
    else
        echo "  ✗ NEXT_PUBLIC_SUPABASE_URL not set"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "  ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY set"
    else
        echo "  ✗ NEXT_PUBLIC_SUPABASE_ANON_KEY not set"
    fi
    
    if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
        echo "  ✓ SUPABASE_SERVICE_ROLE_KEY set"
    else
        echo "  ✗ SUPABASE_SERVICE_ROLE_KEY not set"
    fi
else
    echo "  ✗ .env.local not found. Copy .env.local.example to .env.local"
    exit 1
fi

# Check dependencies
echo "\n✓ Checking dependencies..."
if [ -d node_modules ]; then
    echo "  ✓ node_modules directory exists"
else
    echo "  ! node_modules not found. Run 'npm install'"
fi

# Check project files
echo "\n✓ Checking project structure..."
FILES=(
    "package.json"
    "tsconfig.json"
    "tailwind.config.js"
    "next.config.js"
    "postcss.config.js"
    ".eslintrc.json"
    "app/layout.tsx"
    "app/page.tsx"
    "app/dashboard/page.tsx"
)

for FILE in "${FILES[@]}"; do
    if [ -f "$FILE" ]; then
        echo "  ✓ $FILE"
    else
        echo "  ✗ $FILE missing"
    fi
done

# Check database schema
echo "\n✓ Checking database files..."
if [ -f "database/schema.sql" ]; then
    echo "  ✓ database/schema.sql exists"
    echo "  ⓘ Have you run this SQL in Supabase? If not, go to Supabase SQL Editor and paste the contents"
else
    echo "  ✗ database/schema.sql missing"
fi

echo "\n================================"
echo "✅ Setup verification complete!"
echo "\nNext steps:"
echo "1. Install dependencies: npm install"
echo "2. Start dev server: npm run dev"
echo "3. Open http://localhost:3000"
echo "4. Create an account to get started"
