# ${PROJECT_NAME} Authentication Web App

This is a modern authentication example application using:
- **Backend**: FastAPI
- **Frontend**: Solid-JS
- **Authentication**: Auht0 with Supabase Integration

## Project Structure

```
${PROJECT_NAME}/
├── .env                  # Environment variables including PROJECT_NAME
├── backend/              # FastAPI backend
│   └── fastapi/          # FastAPI app
│       ├── auth.py       # Auth0 JWT validation
│       ├── main.py       # API endpoints
|       ├── databse.py    # Supabase Setup
│       └── requirements.txt # Python dependencies
└── frontend/             # SolidJS frontend
    └── solid-app/        # SolidJS application
        ├── src/          # Source code
        │   ├── components/ # Components
        │   │   ├── Auth.ts # Auth0 authentication
        │   │   └── Protected.tsx # Protected component
        │   ├── App.tsx   # Main application
        │   └── index.tsx # Entry point
        └── package.json  # Node.js dependencies
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```
   cd ${PROJECT_NAME}/backend/fastapi
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Copy the `.env.example` file to `.env` and update with your Auth0 credentials:
   ```
   cp ../../.env.example .env
   ```

5. Run the FastAPI server:
   ```
   uvicorn main:app --reload
   ```
   The API will be available at http://localhost:8000

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ${PROJECT_NAME}/frontend/solid-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```
   The application will be available at http://localhost:5173

## Auth0 Configuration

1. Create an Auth0 account if you don't have one
2. Create a new API in Auth0 dashboard
   - Set the identifier to match your `AUTH0_API_AUDIENCE` value
3. Create a new Single Page Application in Auth0 dashboard
   - Set the allowed callback URLs to include your frontend URL (http://localhost:5173)
   - Set the allowed logout URLs to include your frontend URL
   - Set the allowed web origins to include your frontend URL
4. Update the Auth0 configuration in the following files:
   - `frontend/solid-app/src/components/Auth.ts` - Update domain and clientId
   - `.env` file with the correct values including PROJECT_NAME

## Environment Variables

The following environment variables should be set in your `.env` file:

- `PROJECT_NAME` - The name of your project (defaults to "OrderOne" if not set)
- `AUTH0_DOMAIN` - Your Auth0 domain
- `AUTH0_API_AUDIENCE` - Your Auth0 API audience
- `AUTH0_CLIENT_ID` - Your Auth0 client ID
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins for CORS
- `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL`

## Features

- User authentication with Auth0
- Protected API routes
- Responsive Bootstrap styling
- Error handling for authentication failures
- Token-based API access

## Troubleshooting

- **Auth0 Login Issues**: Ensure your Auth0 application has the correct callback URLs
- **API Authentication Errors**: Check that your Auth0 API audience and domain match in both frontend and backend
- **CORS Errors**: Ensure the `ALLOWED_ORIGINS` in your .env file includes your frontend URL

## License

This project is licensed under the MIT License.
