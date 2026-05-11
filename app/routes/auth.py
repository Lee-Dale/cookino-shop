from fastapi import APIRouter, HTTPException, Depends
from jose import jwt
from app.models import UserRegister, UserLogin, KontoAendern, KontoLoeschen
from fastapi.security import OAuth2PasswordBearer
from Datenbanken_Cookinoshop.konto_shop import registrieren, login as konto_login, konto_aendern, konto_loeschen, logout, get_connection as konto_connection
from dotenv import load_dotenv
import os

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

ALGORITHM = "HS256"

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

@router.post("/logout")
def user_logout(email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    logout(nutzer_id=row["id"])
    return {"message": "Logout erfolgreich!"}

@router.put("/konto/aendern")
def update_konto(konto_daten: KontoAendern, email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    konto_aendern(
        row["id"],
        vorname=konto_daten.vorname,
        nachname=konto_daten.nachname,
        email=konto_daten.email,
        neues_passwort=konto_daten.neues_password
    )
    return {"message": "Kontodaten erfolgreich geändert!"}

@router.delete("/konto/loeschen")
def delete_konto(konto_daten: KontoLoeschen, email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    konto_loeschen(row["id"], konto_daten.password)
    return {"message": "Konto erfolgreich gelöscht!"}




