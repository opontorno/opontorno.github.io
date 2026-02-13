#!/bin/bash
# Quick build and open script

echo "🔨 Building standalone version..."
python3 build.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo ""
    echo "Opening in browser..."
    
    # Detect OS and open file
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open index-standalone.html 2>/dev/null || echo "Please open index-standalone.html manually"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open index-standalone.html
    else
        echo "Please open index-standalone.html in your browser"
    fi
else
    echo "❌ Build failed"
    exit 1
fi
