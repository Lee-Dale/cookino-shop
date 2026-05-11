from fastapi import APIRouter, HTTPException, Depends
from Datenbanken_Cookinoshop.konto_shop import get_connection as konto_connection
from Datenbanken_Cookinoshop.warenkorb import get_connection as warenkorb_connection, artikel_hinzufuegen, warenkorb_anzeigen, artikel_entfernen, bestellung_abschliessen, warenkorb_leeren, menge_aendern, bestellungen_anzeigen
from app.routes.auth import verify_token
from app.models import ArtikelHinzufuegen, ArtikelAendern

router = APIRouter()

@router.get("/warenkorb")
def anzeigen_warenkorb(email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    warenkorb = warenkorb_anzeigen(row["id"])
    return {"warenkorb": warenkorb}

@router.post("/warenkorb/artikel")
def hinzufuegen_artikel(artikel_daten: ArtikelHinzufuegen, email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    artikel_hinzufuegen(row["id"], artikel_daten.artikel_id, artikel_daten.menge)
    return {"message": "Artikel zum Warenkorb hinzugefügt"}

@router.put("/warenkorb/artikel/aendern")
def aendern_artikel(artikel_daten: ArtikelAendern, email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    menge_aendern(row["id"], artikel_daten.artikel_id, artikel_daten.neue_menge)
    return {"message": "Artikel im Warenkorb aktualisiert"}

@router.delete("/warenkorb/artikel/{artikel_id}")
def entfernen_artikel(artikel_id: int, email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    artikel_entfernen(row["id"], artikel_id)
    return {"message": "Artikel aus dem Warenkorb entfernt"}

@router.delete("/warenkorb/leeren")
def leeren_warenkorb(email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    warenkorb_leeren(row["id"])
    return {"message": "Warenkorb geleert"}

@router.post("/warenkorb/checkout")
def checkout(email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    result = bestellung_abschliessen(row["id"])
    return {"bestell_id": result}

@router.get("/warenkorb/history")
def bestellung_anzeigen(email: str = Depends(verify_token)):
    row = konto_connection().execute("SELECT id FROM nutzer WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    history = bestellungen_anzeigen(row["id"])
    return {"history": history}