from jose import jwt
from jose.exceptions import JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
import os
from dotenv import load_dotenv
from database import get_or_create_user

# Load environment variables from .env file
load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE")
ALGORITHMS = ["RS256"]
JWKS_URL = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"

bearer = HTTPBearer()
_jwks_cache = None

async def get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        async with httpx.AsyncClient() as client:
            response = await client.get(JWKS_URL)
            _jwks_cache = response.json()
    return _jwks_cache

async def verify_jwt(token: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        jwks = await get_jwks()
        unverified_header = jwt.get_unverified_header(token.credentials)

        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }

        if rsa_key:
            try:
                # Decode the token to verify signature and claims
                payload = jwt.decode(
                    token.credentials,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer=f"https://{AUTH0_DOMAIN}/",
                )
                # Retrieve full user info from Auth0's /userinfo endpoint
                async with httpx.AsyncClient() as client:
                    userinfo_response = await client.get(
                        f"https://{AUTH0_DOMAIN}/userinfo",
                        headers={"Authorization": f"Bearer {token.credentials}"}
                    )
                    if userinfo_response.status_code != 200:
                        raise HTTPException(
                            status_code=401,
                            detail="Failed to retrieve user info from Auth0"
                        )
                    userinfo = userinfo_response.json()

                # Get or create user in Supabase using enriched user info
                user_data = await get_or_create_user(userinfo)

                # Add Supabase user data to returned context
                payload["supabase_user"] = user_data
                return payload

            except JWTError as e:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid token: {str(e)}"
                )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to find appropriate key"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}"
        )
