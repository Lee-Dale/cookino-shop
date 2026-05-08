from fastapi import APIRouter, HTTPException, Depends
from app.models import UserRegister, UserLogin
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from Datenbanken_Cookinoshop.konto_shop import registrieren, login as konto_login


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

@router.post("/register")
def user_registration(user: UserRegister):
    result = registrieren(user.vorname, user.nachname, user.email, user.password)
    if result is None:
        raise HTTPException(status_code=400, detail="Registrierung fehlgeschlagen")
    return {"message": "Registrierung erfolgreich!"}

@router.post("/login")
def user_login(user: UserLogin):
    nutzer = konto_login(user.email, user.password)
    if nutzer is None:
        raise HTTPException(status_code=401, detail="Login fehlgeschlagen")
    token = jwt.encode({"sub": nutzer["email"]}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

# Token-Überprüfung für geschützte Routen  
def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Ungültiger Token")
        return username
    except:
        raise HTTPException(status_code=401, detail="Ungültiger Token")