
from fastapi import APIRouter
from Datenbanken_Cookinoshop.shop_main import alle_kollektionen, artikel_nach_kollektion, bestellung_aufgeben
from app.models import Artikel, Kollektion, OrderRequest


router = APIRouter()

@router.get("/kollektionen")
def get_kollektionen():
    return {"kollektionen": [Kollektion(**k) for k in alle_kollektionen()]}


@router.get("/artikel/{kollektion_name}")
def get_kollektion_name(kollektion_name: str):
    return {"kollektion_name": [Artikel(**k) for k in artikel_nach_kollektion(kollektion_name)]}

@router.post("/order")
def place_order(order: OrderRequest):
    result = bestellung_aufgeben(order.artikel_id, order.menge)
    return {"bestell_id": result}