#!/bin/bash
# XinSor Bot - Linux/Mac Stop Script

echo "🛑 Stopping XinSor Agents..."
pkill -f "node src/index.js" 2>/dev/null || true
echo "XinSor stopped."
