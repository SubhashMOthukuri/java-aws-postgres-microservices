#!/bin/bash

echo "🎯 UI Screenshot Capture Helper"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📁 Created output-images folder for your screenshots"
echo ""

echo "🚀 Starting Frontend Application..."
echo "   This will open http://localhost:3000 in your browser"
echo ""

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo "🌐 Starting React development server..."
echo "   Press Ctrl+C to stop when you're done taking screenshots"
echo ""

echo "📸 Screenshot Instructions:"
echo "   1. Wait for http://localhost:3000 to open"
echo "   2. Navigate to each page and take screenshots:"
echo "      - Dashboard: http://localhost:3000"
echo "      - Clients: http://localhost:3000/clients"
echo "      - Goals: http://localhost:3000/goals"
echo "      - Auth: http://localhost:3000/auth"
echo "   3. Save screenshots to output-images/ folder with names:"
echo "      - client-management-ui.png"
echo "      - goals-management-ui.png"
echo "      - dashboard-ui.png"
echo "      - auth-ui.png"
echo ""

echo "🎬 Starting frontend server..."
cd frontend
npm start
