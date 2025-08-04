#!/bin/bash

# Script to start the FastAPI backend server

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check for virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install or update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check for .env file
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Creating from example..."
    if [ -f "../../.env.example" ]; then
        cp ../../.env.example .env
        echo "Created .env file from example. Please update with your Auth0 credentials."
    else
        echo "Error: Could not find .env.example file. Please create a .env file manually."
        echo "AUTH0_DOMAIN=your-domain.auth0.com" > .env
        echo "AUTH0_API_AUDIENCE=your-audience" >> .env
        echo "ALLOWED_ORIGINS=http://localhost:5173" >> .env
    fi
fi

# Start the FastAPI server
echo "Starting FastAPI server..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000
