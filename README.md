# OrderOne Authentication App

This is a simple authentication example application using:
- **Backend**: FastAPI with Auth0 JWT validation
- **Frontend**: SolidJS with Auth0 authentication and Bootstrap styling

## Project Structure

```
OrderOne/
├── .env.example          # Example environment variables
├── backend/              # FastAPI backend
│   └── fastapi/          # FastAPI app
│       ├── auth.py       # Auth0 JWT validation
│       ├── main.py       # API endpoints
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
   cd OrderOne/backend/fastapi
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
   cd OrderOne/frontend/solid-app
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
   - `.env` file with the correct values

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