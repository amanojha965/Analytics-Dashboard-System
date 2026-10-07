from fastapi import HTTPException
import sqlalchemy as sa
from sqlalchemy.sql import text
from datetime import timedelta
from models import UserCreate, UserLogin
from database import engine, init_db
from auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from utils.validation import validate_password

def register_user(user: UserCreate):
    validate_password(user.password)
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT id FROM users WHERE username = :username"), {"username": user.username}).fetchone()
            if result:
                raise HTTPException(status_code=400, detail="Username already registered")
            
            hashed_password = get_password_hash(user.password)
            conn.execute(
                text("INSERT INTO users (name, username, password_hash) VALUES (:name, :username, :password_hash)"),
                {"name": user.name, "username": user.username, "password_hash": hashed_password}
            )
            conn.commit()
        return {"message": "User registered successfully"}
    except sa.exc.OperationalError as e:
        raise HTTPException(status_code=503, detail="Database connection failed. The server might be temporarily unreachable.")
    except sa.exc.ProgrammingError as e:
        if "relation \"users\" does not exist" in str(e):
            init_db()
            raise HTTPException(status_code=500, detail="Database tables were just initialized. Please try registering again.")
        raise HTTPException(status_code=500, detail="A database schema error occurred.")

def login_user(user: UserLogin):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT id, username, password_hash FROM users WHERE username = :username"), {"username": user.username}).fetchone()
            
            if not result:
                raise HTTPException(status_code=404, detail="No account found with this email address.")
                
            if not verify_password(user.password, result[2]):
                raise HTTPException(status_code=401, detail="The password you entered is incorrect.")
                
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": result[1]}, expires_delta=access_token_expires
            )
            return {"access_token": access_token, "token_type": "bearer"}
    except sa.exc.OperationalError as e:
        raise HTTPException(status_code=503, detail="Database connection failed. The server might be temporarily unreachable.")
    except sa.exc.ProgrammingError as e:
        if "relation \"users\" does not exist" in str(e):
            init_db()
            raise HTTPException(status_code=500, detail="Database tables were just initialized. Please try logging in again.")
        raise HTTPException(status_code=500, detail="A database schema error occurred.")
