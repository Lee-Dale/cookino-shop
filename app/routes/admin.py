from Datenbanken_Cookinoshop.konto_shop import hat_berechtigung, get_connection as konto_connection
from fastapi import APIRouter, HTTPException, Depends
from app.routes.auth import verify_token

router = APIRouter()

def require_admin(email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    if not hat_berechtigung(row["id"], "admin"):
        raise HTTPException(status_code=403, detail="Keine Berechtigung")
    return row["id"]

@router.get("/admin/benutzer")
def alle_nutzer(admin_id: int = Depends(require_admin)):
    connection = konto_connection()
    nutzer = connection.execute("SELECT vorname, nachname, email, rollen_id, aktiv FROM nutzer").fetchall()
    return [{"vorname": row["vorname"], "nachname": row["nachname"], "email": row["email"], "rollen_id": row["rollen_id"], "aktiv": row["aktiv"]} for row in nutzer]

@router.get("/admin/bestellungen")
def alle_bestellungen(admin_id: int = Depends(require_admin)):
    connection = konto_connection()
    bestellungen = connection.execute("SELECT id, nutzer_id, gesamt_preis, status, bestellt_am FROM bestellungen").fetchall()
    return [{"id": row["id"], "nutzer_id": row["nutzer_id"], "gesamt_preis": row["gesamt_preis"], "status": row["status"], "bestellt_am": row["bestellt_am"]} for row in bestellungen]