from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from jose import jwt
from Datenbanken_Cookinoshop.shop_main import get_connection
from app.models import User, UserRegister, UserLogin

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

@router.post("/register")
def user_registration(user: UserRegister):
    hashed_password = pwd_context.hash(user.password)
    new_user = User(
        email=user.email,
        username=user.username,
        password=hashed_password
    )
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO user (email, username, password) VALUES (?, ?, ?)",
            (new_user.email, new_user.username, new_user.password)
        )
    return {"message": "User Registration Bestätigt!" }

@router.post("/login")
def user_login(user: UserLogin):
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM user WHERE username = ?", (user.username,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User nicht gefuden. Bitte Registrien!")
        if not pwd_context.verify(user.password, row["password"]):
            raise HTTPException(status_code=401, detail="Password Falsch")
        token = jwt.encode({"sub": user.username}, SECRET_KEY, algorithm=ALGORITHM)
        
    