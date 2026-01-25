from supabase import create_client
import os

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

def get_user_from_token(token: str):
    try:
        user = supabase.auth.get_user(token)
        return user.user
    except Exception:
        return None
