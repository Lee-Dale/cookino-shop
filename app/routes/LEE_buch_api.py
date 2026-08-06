"""
FÜR LEE
========
Diese Datei als ``app/routes/buch_api.py`` einfügen.

In ``app/__init__.py`` ergänzen:

    from app.routes import buch_api
    app.include_router(buch_api.router, prefix="/api")

In ``requirements.txt`` ergänzen:

    google-genai>=2.3,<3
    pymongo>=4.6,<5

In der Backend-.env ergänzen. Den Key niemals in React eintragen:

    GEMINI_API_KEY=DEIN_KEY
    GEMINI_MODEL=gemini-3.5-flash-lite

Der Code verwendet Chris' vorhandene ``Datenbanken_phase2/shop_main.py`` und
die MongoDB-Collection ``buch_wissen`` aus Chris' neuer JS-Datei.
"""

from __future__ import annotations

import os
from collections import defaultdict, deque
from threading import Lock
from time import monotonic
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Request
from google import genai
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

try:
    # Passt direkt zum aktuell hochgeladenen Cookino-Shop-2.0-Ordner.
    from Datenbanken_phase2.shop_main import (
        alle_produkte,
        get_mongo_client,
        get_mongo_database,
    )
except ImportError:
    # Falls Chris' Datenbankmodule später sauber ins Backend verschoben werden.
    from app.db.shop_main import alle_produkte, get_mongo_client, get_mongo_database


router = APIRouter(prefix="/buch", tags=["Allwissendes Buch"])
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
ANFRAGEN_PRO_MINUTE = int(os.getenv("BUCH_RATE_LIMIT_PRO_MINUTE", "10"))


class BuchFrage(BaseModel):
    frage: str = Field(min_length=2, max_length=500)
    sitzungs_id: str | None = Field(default=None, max_length=64)


class MinutenLimiter:
    def __init__(self, limit: int) -> None:
        self.limit = max(1, limit)
        self.zugriffe: dict[str, deque[float]] = defaultdict(deque)
        self.lock = Lock()

    def erlaubt(self, client: str) -> bool:
        jetzt = monotonic()
        with self.lock:
            zeiten = self.zugriffe[client]
            while zeiten and zeiten[0] < jetzt - 60:
                zeiten.popleft()
            if len(zeiten) >= self.limit:
                return False
            zeiten.append(jetzt)
            return True


limiter = MinutenLimiter(ANFRAGEN_PRO_MINUTE)


SYSTEM_ANWEISUNG = """
Du bist „Das Flüsternde Buch“ aus der magischen Cookino-Welt.
Antworte auf Deutsch, freundlich, verspielt und meistens in zwei bis fünf Sätzen.
Wenn du nach der Technik gefragt wirst, sage ehrlich, dass du KI-gestützt bist.
Für Preise, Varianten, Lagerbestände und Cookino-Fakten gilt nur der gelieferte Kontext.
Erfinde niemals Shopdaten. Wenn eine Information fehlt, sage das ehrlich.
Allgemeine Wissensfragen darfst du mit deinem allgemeinen Wissen beantworten.
Behaupte nicht, einen Live-Internetzugriff zu besitzen.
Fordere niemals Passwörter, Zahlungsdaten oder persönliche Daten an.
""".strip()


def _cookino_wissen() -> tuple[list[str], list[str]]:
    client = get_mongo_client()
    try:
        dokumente = list(
            get_mongo_database(client)["buch_wissen"]
            .find({"aktiv": True}, {"_id": 0, "titel": 1, "inhalt": 1})
            .sort("prioritaet", -1)
            .limit(8)
        )
    finally:
        client.close()

    zeilen = [f"- {doc['titel']}: {doc['inhalt']}" for doc in dokumente]
    quellen = [f"MongoDB: {doc['titel']}" for doc in dokumente]
    return zeilen, quellen


def _produkt_wissen() -> tuple[list[str], list[str]]:
    produkte = alle_produkte()
    zeilen = []
    quellen = []
    for produkt in produkte[:12]:
        varianten = ", ".join(
            f"{variante.get('groesse', {}).get('code') or 'ONE'} / "
            f"{variante.get('farbe', 'Standard')} / Bestand {variante.get('lagerbestand', 0)}"
            for variante in produkt.get("varianten", [])
        )
        zeilen.append(
            f"- {produkt['name']} | {float(produkt['preis']):.2f} EUR | "
            f"Kollektion {produkt.get('kollektion_name')} | "
            f"Gesamtbestand {produkt.get('lagerbestand', 0)} | "
            f"Varianten: {varianten or 'keine'} | "
            f"Beschreibung: {produkt.get('beschreibung', 'nicht hinterlegt')}"
        )
        quellen.append(f"Datenbanken: {produkt['name']}")
    return zeilen, quellen


def _antwort_erzeugen(frage: str) -> tuple[str, list[str]]:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY fehlt im FastAPI-Backend.")

    wissenszeilen, wissensquellen = _cookino_wissen()
    produktzeilen, produktquellen = _produkt_wissen()
    kontext = (
        "COOKINO-WISSEN AUS MONGODB:\n"
        + "\n".join(wissenszeilen)
        + "\n\nAKTUELLE PRODUKTE AUS POSTGRESQL UND MONGODB:\n"
        + "\n".join(produktzeilen)
        + f"\n\nFRAGE DES BESUCHERS:\n{frage}"
    )

    client = genai.Client(api_key=api_key)
    interaction = client.interactions.create(
        model=GEMINI_MODEL,
        input=kontext,
        system_instruction=SYSTEM_ANWEISUNG,
        generation_config={"temperature": 0.55, "max_output_tokens": 500},
        store=False,
    )
    antwort = (interaction.output_text or "").strip()
    if not antwort:
        raise RuntimeError("Gemini hat keine Antwort geliefert.")
    return antwort, wissensquellen + produktquellen


@router.get("/startfragen")
def startfragen() -> dict:
    return {
        "fragen": [
            "Wer gehört zur Cookie Crew?",
            "Welche Hoodies habt ihr?",
            "Erzähl mir etwas über Moniki Kicherkrähe.",
        ]
    }


@router.post("/fragen")
async def buch_fragen(daten: BuchFrage, request: Request) -> dict:
    client_ip = request.headers.get("x-forwarded-for") or (
        request.client.host if request.client else "unbekannt"
    )
    if not limiter.erlaubt(client_ip.split(",")[0].strip()):
        raise HTTPException(
            status_code=429,
            detail="Das Buch braucht kurz Ruhe. Bitte in einer Minute erneut fragen.",
        )

    try:
        antwort, quellen = await run_in_threadpool(_antwort_erzeugen, daten.frage.strip())
    except Exception as exc:
        # Der technische Fehler bleibt auf dem Server; Besucher sehen keine Zugangsdaten.
        print(f"Buch-Fehler: {type(exc).__name__}")
        raise HTTPException(
            status_code=503,
            detail="Das Buch ist gerade nicht erreichbar oder das kostenlose Limit ist erreicht.",
        ) from exc

    return {
        "antwort": antwort,
        "sitzungs_id": daten.sitzungs_id or str(uuid4()),
        "quellen": quellen,
    }
