from Cookino_shop_2.Datenbanken_phase2.konto_shop import hat_berechtigung, nutzer_nach_email, alle_nutzer_anzeigen, alle_bestellungen
from fastapi import APIRouter, HTTPException, Depends
from app.routes.auth import verify_token

router = APIRouter()

def require_admin(email: str = Depends(verify_token)):
    nutzer = nutzer_nach_email(email)
    if nutzer is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    if not hat_berechtigung(nutzer["id"], "admin"):
        raise HTTPException(status_code=403, detail="Keine Berechtigung")
    return nutzer["id"]

@router.get("/admin/benutzer")
def alle_nutzer(admin_id: int = Depends(require_admin)):
    return alle_nutzer_anzeigen(admin_id)

@router.get("/admin/bestellungen")
def get_alle_bestellungen(admin_id: str = Depends(require_admin), status: str = None):
    return alle_bestellungen(status)