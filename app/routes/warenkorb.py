from fastapi import APIRouter, HTTPException, Depends
from Cookino_shop_2.Datenbanken_phase2.konto_shop import nutzer_nach_email
from Cookino_shop_2.Datenbanken_phase2.warenkorb import artikel_hinzufuegen, warenkorb_anzeigen, artikel_entfernen, bestellung_abschliessen, warenkorb_leeren, menge_aendern, bestellungen_anzeigen
from app.routes.auth import verify_token
from app.models import ArtikelHinzufuegen, ArtikelAendern

router = APIRouter()

@router.get("/warenkorb")
def anzeigen_warenkorb(email: str = Depends(verify_token)):
    nutzer = nutzer_nach_email(email)
    if nutzer is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    warenkorb = warenkorb_anzeigen(nutzer["id"])
    return {"warenkorb": warenkorb}

@router.post("/warenkorb/artikel")
def hinzufuegen_artikel(artikel_daten: ArtikelHinzufuegen, email: str = Depends(verify_token)):
    nutzer = nutzer_nach_email(email)
    if nutzer is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    artikel_hinzufuegen(nutzer["id"], artikel_daten.produkt_variante_id, artikel_daten.menge)
    return {"message": "Artikel zum Warenkorb hinzugefügt"}

@router.put("/warenkorb/artikel/aendern")
def aendern_artikel(artikel_daten: ArtikelAendern, email: str = Depends(verify_token)):
    nutzer = nutzer_nach_email(email)
    if nutzer is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    menge_aendern(nutzer["id"], artikel_daten.produkt_variante_id, artikel_daten.neue_menge)
    return {"message": "Artikel im Warenkorb aktualisiert"}

@router.delete("/warenkorb/artikel/{produkt_variante_id}")
def entfernen_artikel(produkt_variante_id: str, email: str = Depends(verify_token)):
    nutzer = nutzer_nach_email(email)
    if nutzer is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    artikel_entfernen(nutzer["id"], produkt_variante_id)
    return {"message": "Artikel aus dem Warenkorb entfernt"}

@router.delete("/warenkorb/leeren")
def leeren_warenkorb(email: str = Depends(verify_token)):
    nutzer = nutzer_nach_email(email)
    if nutzer is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    warenkorb_leeren(nutzer["id"])
    return {"message": "Warenkorb geleert"}

@router.post("/warenkorb/checkout")
def checkout(email: str = Depends(verify_token)):
    nutzer = nutzer_nach_email(email)
    if nutzer is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    result = bestellung_abschliessen(nutzer["id"])
    return {"bestell_id": result}

@router.get("/warenkorb/history")
def bestellung_anzeigen(email: str = Depends(verify_token)):
    nutzer = nutzer_nach_email(email)
    if nutzer is None:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")
    history = bestellungen_anzeigen(nutzer["id"])
    return {"history": history}