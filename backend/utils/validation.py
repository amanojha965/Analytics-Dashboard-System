import re
from fastapi import HTTPException

def validate_password(pwd: str):
    if len(pwd) < 8 or not re.search(r"[A-Z]", pwd) or not re.search(r"[a-z]", pwd) or not re.search(r"\d", pwd) or not re.search(r"[@$!%*?&#^_-]", pwd):
        raise HTTPException(
            status_code=400, 
            detail="Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
        )
