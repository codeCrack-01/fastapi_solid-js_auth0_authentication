import os
from supabase import acreate_client, AsyncClient
from dotenv import load_dotenv
from datetime import datetime
from typing import Dict, Any, Optional

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL: str = os.getenv("SUPABASE_URL") #type: ignore
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY") #type: ignore --Service role key

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env file")



async def get_user_by_auth0_id(auth0_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a user from the Supabase database by Auth0 ID
    """
    supabase: AsyncClient = await acreate_client(SUPABASE_URL, SUPABASE_KEY)

    response = await supabase.table("users").select("*").eq("auth0_id", auth0_id).execute()
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

async def create_user_from_auth0(auth0_user: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new user in Supabase based on Auth0 user information
    """
    supabase: AsyncClient = await acreate_client(SUPABASE_URL, SUPABASE_KEY)
    user_data = {
        "auth0_id": auth0_user["sub"],
        "email": auth0_user.get("email"),
        "name": auth0_user.get("name") or auth0_user.get("nickname"),  # fallback to nickname
        "nickname": auth0_user.get("nickname"),
        "last_login": datetime.now().isoformat(),
        "created_at": datetime.now().isoformat()
    }

    try:
        response = await supabase.table("users").insert(user_data).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None #type: ignore
    except Exception as e:
        print(f"Error creating user in Supabase: {str(e)}")
        # Return a minimal user object to prevent cascading errors
        return {"auth0_id": auth0_user["sub"], "error": str(e)}
    return None #type:ignore

async def update_user_login(auth0_id: str) -> None:
    """
    Update user's last login timestamp
    """
    supabase: AsyncClient = await acreate_client(SUPABASE_URL, SUPABASE_KEY)
    await supabase.table("users").update(
        {"last_login": datetime.now().isoformat()}
    ).eq("auth0_id", auth0_id).execute()

async def get_or_create_user(auth0_user: Dict[str, Any]) -> Dict[str, Any]:
    """
    Get a user from Supabase or create if not exists
    """
    user = await get_user_by_auth0_id(auth0_user["sub"])
    if user:
        await update_user_login(auth0_user["sub"])
        return user
    return await create_user_from_auth0(auth0_user)
