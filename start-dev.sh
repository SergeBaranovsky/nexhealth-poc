#!/bin/bash

# NexHealth Explorer - Development Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting NexHealth Explorer Development Servers..."
echo ""

# Check if .env exists
if [ ! -f explorer/backend/.env ]; then
  echo "❌ Error: .env file not found in explorer/backend/"
  echo "   Please copy .env.example to .env and configure your credentials"
  exit 1
fi

# Function to check if port is in use
check_port() {
  lsof -ti:$1 > /dev/null 2>&1
}

# Check ports
if check_port 8000; then
  echo "⚠️  Warning: Port 8000 is already in use (backend)"
  echo "   Kill the process or use a different port"
  exit 1
fi

if check_port 5173; then
  echo "⚠️  Warning: Port 5173 is already in use (frontend)"
  echo "   Kill the process or use a different port"
  exit 1
fi

echo "📦 Checking dependencies..."

# Check backend dependencies
if [ ! -d "explorer/backend/node_modules" ]; then
  echo "   Installing backend dependencies..."
  cd explorer/backend && npm install && cd ../..
fi

# Check frontend dependencies
if [ ! -d "explorer/frontend/node_modules" ]; then
  echo "   Installing frontend dependencies..."
  cd explorer/frontend && npm install && cd ../..
fi

echo ""
echo "✅ Starting servers..."
echo ""
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start backend in background
cd explorer/backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend in background  
cd ../frontend
npm run dev &
FRONTEND_PID=$!

cd ../..

# Trap Ctrl+C to kill both processes
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Wait for both processes
wait
