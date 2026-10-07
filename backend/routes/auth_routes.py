from fastapi import APIRouter
from models import UserCreate, UserLogin, Token
from controllers.auth_controller import register_user, login_user

router = APIRouter(tags=["Auth"])

@router.post("/auth/register")
async def register(user: UserCreate):
    return register_user(user)

@router.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    return login_user(user)
