#!/bin/bash

# Script to start the SampleApp SolidJS frontend app

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm and try again."
    exit 1
fi

# Install or update dependencies
echo "Installing dependencies..."
npm install

# Check for package.json
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Make sure you're in the correct directory."
    exit 1
fi

# Install Bootstrap if not already installed
if ! grep -q '"bootstrap"' package.json; then
    echo "Installing Bootstrap..."
    npm install bootstrap
fi

# Start the development server
echo "Starting SampleApp frontend development server..."
npm run dev -- --host 0.0.0.0
