
from fastapi import APIRouter
from Cookino_shop_2.Datenbanken_phase2.shop_main import alle_kollektionen, artikel_nach_kollektion, bestellung_aufgeben
from Cookino_shop_2.Datenbanken_phase2.konto_shop import nutzer_nach_email 
from app.models import OrderRequest
from fastapi import Depends
from app.routes.auth import verify_token


router = APIRouter()

@router.get("/kollektionen")
def get_kollektionen():
    return {"kollektionen": alle_kollektionen()}


@router.get("/artikel/{kollektion_name}")
def get_kollektion_name(kollektion_name: str):
    return {"kollektion_name": artikel_nach_kollektion(kollektion_name)}

@router.post("/order")
def place_order(order: OrderRequest, username: str = Depends(verify_token)):
    nutzer = nutzer_nach_email(username)
    result = bestellung_aufgeben(order.artikel_id, order.menge, nutzer["id"])
    return {"bestell_id": result, "ordered_by": username}