from fastapi import Depends, HTTPException, Request
from .auth import session_manager, SESSION_COOKIE_NAME

def get_current_user(request: Request):
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return session  # Returns {'user_id': x, 'username': y}