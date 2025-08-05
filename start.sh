#!/bin/bash

# Application Startup Script

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables if .env exists
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
fi

# Use PROJECT_NAME from env or default to OrderOne
PROJECT_NAME=${PROJECT_NAME:-MyProject}

# Print header
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ${PROJECT_NAME} Application Startup Script   ${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo -e "${RED}tmux is not installed. This script uses tmux to run both frontend and backend.${NC}"
    echo -e "${YELLOW}Install tmux with: sudo apt install tmux (Ubuntu/Debian) or brew install tmux (macOS)${NC}"
    exit 1
fi

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Define paths
BACKEND_DIR="$SCRIPT_DIR/backend/fastapi"
FRONTEND_DIR="$SCRIPT_DIR/frontend/solid-app"

# Check if directories exist
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}Backend directory not found: $BACKEND_DIR${NC}"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Frontend directory not found: $FRONTEND_DIR${NC}"
    exit 1
fi

# Check for .env file
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    if [ -f "$SCRIPT_DIR/.env.example" ]; then
        echo -e "${YELLOW}Warning: .env file not found. Creating from example...${NC}"
        cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
        echo -e "${GREEN}Created .env file from example. Please update with your Auth0 credentials.${NC}"
    else
        echo -e "${RED}Error: Could not find .env or .env.example file.${NC}"
        echo -e "${YELLOW}Creating a basic .env file. Please update with your Auth0 credentials.${NC}"
        echo "AUTH0_DOMAIN=your-domain.auth0.com" > "$SCRIPT_DIR/.env"
        echo "AUTH0_API_AUDIENCE=your-audience" >> "$SCRIPT_DIR/.env"
        echo "AUTH0_CLIENT_ID=your-client-id" >> "$SCRIPT_DIR/.env"
        echo "ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173" >> "$SCRIPT_DIR/.env"
    fi
fi

# Copy .env to backend if it doesn't exist
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}Copying .env file to backend directory...${NC}"
    cp "$SCRIPT_DIR/.env" "$BACKEND_DIR/.env"
fi

# Create a new tmux session
echo -e "${GREEN}Starting ${PROJECT_NAME} application in tmux session...${NC}"
SESSION_NAME="$(echo ${PROJECT_NAME} | tr '[:upper:]' '[:lower:]' | tr ' ' '_')"

# Kill existing session if it exists
tmux kill-session -t $SESSION_NAME 2>/dev/null

# Create a new session with backend
tmux new-session -d -s $SESSION_NAME -n "Backend" "cd $BACKEND_DIR && ./start.sh; bash"

# Create window for frontend
tmux new-window -t $SESSION_NAME:1 -n "Frontend" "cd $FRONTEND_DIR && ./start.sh; bash"

# Display info
echo -e "${GREEN}${PROJECT_NAME} application started in tmux session: $SESSION_NAME${NC}"
echo -e "${YELLOW}To attach to the session, run: tmux attach-session -t $SESSION_NAME${NC}"
echo -e "${YELLOW}To switch between windows: Ctrl+B then window number (0 for Backend, 1 for Frontend)${NC}"
echo -e "${YELLOW}To detach from session: Ctrl+B then D${NC}"
echo -e "${YELLOW}Backend runs on: http://localhost:8000${NC}"
echo -e "${YELLOW}Frontend runs on: http://localhost:5173${NC}"

# Attach to the session
echo -e "${GREEN}Attaching to tmux session...${NC}"
tmux attach-session -t $SESSION_NAME
