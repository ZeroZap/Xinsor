#!/bin/bash
# XinSor Bot - Linux/Mac Start Script

echo "🚀 Starting XinSor Agents..."

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your DISCORD_TOKEN"
    exit 1
fi

node src/index.js
