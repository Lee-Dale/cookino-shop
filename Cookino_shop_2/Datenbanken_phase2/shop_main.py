"""Datenzugriff für Shop, Kollektionen und Produktkatalog.

PostgreSQL ist die führende Datenbank für strukturierte Shopdaten wie Preis,
Varianten und Lagerbestand. MongoDB ergänzt flexible Produktinhalte und
Verweise auf Bilder im S3-Bucket. Bilddateien werden nicht in MongoDB
gespeichert.

Benötigte Pakete:
    psycopg[binary]
    pymongo
    python-dotenv
"""

from __future__ import annotations

import os
from collections import OrderedDict
from decimal import Decimal
from typing import Any
from uuid import UUID

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row
from pymongo import MongoClient
from pymongo.database import Database


load_dotenv()

MONGO_DATABASE = (
    os.getenv("MONGO_DATABASE")
    or os.getenv("MONGO_DB")
    or os.getenv("MONGO_INITDB_DATABASE")
    or "cookino_shop"
)
MONGO_PRODUCT_COLLECTION = os.getenv(
    "MONGO_PRODUCT_COLLECTION", "produkt_inhalte"
)
MONGO_COLLECTION_COLLECTION = os.getenv(
    "MONGO_COLLECTION_COLLECTION", "kollektion_inhalte"
)
MONGO_MEDIA_COLLECTION = os.getenv("MONGO_MEDIA_COLLECTION", "medien")

S3_BASE_URL = (
    os.getenv("CLOUDFRONT_URL")
    or os.getenv("S3_BASE_URL")
    or ""
).rstrip("/")


def get_connection() -> psycopg.Connection:
    """Öffnet eine PostgreSQL-Verbindung mit Dictionary-Zeilen."""
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return psycopg.connect(database_url, row_factory=dict_row)

    return psycopg.connect(
        host=os.getenv("POSTGRES_HOST", "postgres"),
        port=int(os.getenv("POSTGRES_PORT", "5432")),
        dbname=os.getenv("POSTGRES_DB", "cookino_shop"),
        user=os.getenv("POSTGRES_USER", "cookino"),
        password=os.getenv("POSTGRES_PASSWORD", "cookino"),
        row_factory=dict_row,
    )


def get_mongo_client() -> MongoClient:
    """Öffnet den MongoDB-Client."""
    mongo_uri = os.getenv("MONGO_URI")
    if mongo_uri:
        return MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)

    return MongoClient(
        host=os.getenv("MONGO_HOST", "mongo"),
        port=int(os.getenv("MONGO_PORT", "27017")),
        username=os.getenv("MONGO_USER") or os.getenv("MONGO_INITDB_ROOT_USERNAME"),
        password=os.getenv("MONGO_PASSWORD")
        or os.getenv("MONGO_INITDB_ROOT_PASSWORD"),
        authSource=os.getenv("MONGO_AUTH_SOURCE", "admin"),
        serverSelectionTimeoutMS=5000,
    )


def get_mongo_database(client: MongoClient | None = None) -> Database:
    client = client or get_mongo_client()
    return client[MONGO_DATABASE]


def create_tables() -> None:
    """Alter Kompatibilitätsname; ``schema.sql`` übernimmt die Erstellung."""
    return None


def insert_beispieldaten() -> None:
    """Alter Kompatibilitätsname; ``seed.sql`` und Mongo-Seeds übernehmen dies."""
    return None


def _s3_url(s3_key: str | None) -> str | None:
    """Erzeugt aus einem S3-Key eine auslieferbare URL."""
    if not s3_key:
        return None
    if s3_key.startswith(("http://", "https://")):
        return s3_key
    if not S3_BASE_URL:
        return s3_key
    return f"{S3_BASE_URL}/{s3_key.lstrip('/')}"


def _mongo_ohne_id(document: dict[str, Any] | None) -> dict[str, Any]:
    if not document:
        return {}
    result = dict(document)
    result.pop("_id", None)
    return result


def _bilder_normalisieren(bilder: list[dict[str, Any]] | None) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for bild in bilder or []:
        eintrag = dict(bild)
        key = eintrag.get("s3_key") or eintrag.get("bild_key") or eintrag.get("url")
        eintrag["s3_key"] = key
        eintrag["url"] = _s3_url(key)
        result.append(eintrag)
    return sorted(result, key=lambda item: item.get("position", 0))


def _mongo_produktdaten(produkt_ids: list[UUID]) -> dict[str, dict[str, Any]]:
    """Lädt Produktinhalte und Medienverweise gesammelt aus MongoDB."""
    ids = [str(produkt_id) for produkt_id in produkt_ids]
    if not ids:
        return {}

    client = get_mongo_client()
    try:
        db = get_mongo_database(client)
        inhalte = {
            str(doc["produkt_id"]): _mongo_ohne_id(doc)
            for doc in db[MONGO_PRODUCT_COLLECTION].find(
                {"produkt_id": {"$in": ids}}
            )
        }

        medien_pro_produkt: dict[str, list[dict[str, Any]]] = {}
        medien_filter = {
            "$or": [
                {"produkt_id": {"$in": ids}},
                {"owner_typ": "produkt", "owner_id": {"$in": ids}},
            ]
        }
        for medium in db[MONGO_MEDIA_COLLECTION].find(medien_filter):
            medium = _mongo_ohne_id(medium)
            produkt_id = str(medium.get("produkt_id") or medium.get("owner_id"))
            medien_pro_produkt.setdefault(produkt_id, []).append(medium)

        for produkt_id in ids:
            inhalt = inhalte.setdefault(produkt_id, {"produkt_id": produkt_id})
            bilder = medien_pro_produkt.get(produkt_id) or inhalt.get("bilder", [])
            inhalt["bilder"] = _bilder_normalisieren(bilder)

        return inhalte
    finally:
        client.close()


def alle_kollektionen() -> list[dict[str, Any]]:
    """Liefert aktive Kollektionen aus PostgreSQL plus MongoDB-Inhalte."""
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, name, slug, aktiv, erstellt_am
            FROM kollektionen
            WHERE aktiv = TRUE
            ORDER BY name
            """
        ).fetchall()

    client = get_mongo_client()
    try:
        db = get_mongo_database(client)
        ids = [str(row["id"]) for row in rows]
        slugs = [row["slug"] for row in rows]
        dokumente = db[MONGO_COLLECTION_COLLECTION].find(
            {
                "$or": [
                    {"kollektion_id": {"$in": ids}},
                    {"slug": {"$in": slugs}},
                ]
            }
        )
        mongo_map: dict[str, dict[str, Any]] = {}
        for doc in dokumente:
            doc = _mongo_ohne_id(doc)
            key = str(doc.get("kollektion_id") or doc.get("slug"))
            doc["bilder"] = _bilder_normalisieren(doc.get("bilder", []))
            mongo_map[key] = doc
    finally:
        client.close()

    ergebnis = []
    for row in rows:
        item = dict(row)
        inhalt = mongo_map.get(str(row["id"])) or mongo_map.get(row["slug"], {})
        for feld in ("beschreibung", "geschichte", "charakter", "bilder"):
            if feld in inhalt:
                item[feld] = inhalt[feld]
        ergebnis.append(item)
    return ergebnis


def _produkte_laden(
    *,
    kollektion: str | None = None,
    produkt_id: UUID | str | None = None,
) -> list[dict[str, Any]]:
    bedingungen = ["p.aktiv = TRUE"]
    parameter: list[Any] = []

    if kollektion:
        bedingungen.append("(LOWER(k.name) = LOWER(%s) OR LOWER(k.slug) = LOWER(%s))")
        parameter.extend([kollektion, kollektion])
    if produkt_id:
        bedingungen.append("p.id = %s")
        parameter.append(str(produkt_id))

    where = " AND ".join(bedingungen)
    query = f"""
        SELECT
            p.id AS produkt_id,
            p.name,
            p.preis,
            p.aktiv,
            p.kollektion_id,
            k.name AS kollektion_name,
            k.slug AS kollektion_slug,
            pv.id AS produkt_variante_id,
            pv.artikelnummer,
            pv.farbe,
            pv.lagerbestand,
            pv.aktiv AS variante_aktiv,
            g.id AS groesse_id,
            g.code AS groesse_code,
            g.anzeigename AS groesse_anzeigename,
            g.sortierung AS groesse_sortierung
        FROM produkte p
        JOIN kollektionen k ON k.id = p.kollektion_id
        LEFT JOIN produkt_varianten pv
               ON pv.produkt_id = p.id AND pv.aktiv = TRUE
        LEFT JOIN groessen g ON g.id = pv.groesse_id
        WHERE {where}
        ORDER BY p.name, g.sortierung NULLS LAST, pv.farbe
    """

    with get_connection() as conn:
        rows = conn.execute(query, parameter).fetchall()

    gruppiert: OrderedDict[str, dict[str, Any]] = OrderedDict()
    for row in rows:
        key = str(row["produkt_id"])
        if key not in gruppiert:
            gruppiert[key] = {
                "id": row["produkt_id"],
                "name": row["name"],
                "preis": float(row["preis"]),
                "aktiv": row["aktiv"],
                "kollektion_id": row["kollektion_id"],
                "kollektion_name": row["kollektion_name"],
                "kollektion_slug": row["kollektion_slug"],
                "lagerbestand": 0,
                "varianten": [],
            }

        if row["produkt_variante_id"] is not None:
            lagerbestand = row["lagerbestand"] or 0
            gruppiert[key]["lagerbestand"] += lagerbestand
            gruppiert[key]["varianten"].append(
                {
                    "id": row["produkt_variante_id"],
                    "artikelnummer": row["artikelnummer"],
                    "farbe": row["farbe"],
                    "lagerbestand": lagerbestand,
                    "aktiv": row["variante_aktiv"],
                    "groesse": {
                        "id": row["groesse_id"],
                        "code": row["groesse_code"],
                        "anzeigename": row["groesse_anzeigename"],
                    },
                }
            )

    produkte = list(gruppiert.values())
    mongo_map = _mongo_produktdaten([produkt["id"] for produkt in produkte])

    flexible_felder = (
        "beschreibung",
        "kurzbeschreibung",
        "charakter",
        "tags",
        "material",
        "pflegehinweise",
        "details",
        "bilder",
    )
    for produkt in produkte:
        inhalt = mongo_map.get(str(produkt["id"]), {})
        for feld in flexible_felder:
            if feld in inhalt:
                produkt[feld] = inhalt[feld]
        produkt.setdefault("bilder", [])

    return produkte


def alle_produkte() -> list[dict[str, Any]]:
    return _produkte_laden()


def artikel_nach_kollektion(kollektion_name: str) -> list[dict[str, Any]]:
    """Kompatibler alter Funktionsname; liefert jetzt Produkte mit Varianten."""
    return _produkte_laden(kollektion=kollektion_name)


def produkt_nach_id(produkt_id: UUID | str) -> dict[str, Any] | None:
    produkte = _produkte_laden(produkt_id=produkt_id)
    return produkte[0] if produkte else None


def shop_uebersicht() -> list[dict[str, Any]]:
    """Aggregierte Übersicht direkt aus PostgreSQL."""
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                k.id,
                k.name AS kollektion,
                COUNT(DISTINCT p.id) AS produkt_anzahl,
                COUNT(pv.id) AS varianten_anzahl,
                MIN(p.preis) AS preis_ab,
                COALESCE(SUM(pv.lagerbestand), 0) AS gesamt_lager
            FROM kollektionen k
            LEFT JOIN produkte p
                   ON p.kollektion_id = k.id AND p.aktiv = TRUE
            LEFT JOIN produkt_varianten pv
                   ON pv.produkt_id = p.id AND pv.aktiv = TRUE
            WHERE k.aktiv = TRUE
            GROUP BY k.id, k.name
            ORDER BY k.name
            """
        ).fetchall()

    return [
        {
            **dict(row),
            "preis_ab": float(row["preis_ab"]) if isinstance(row["preis_ab"], Decimal) else row["preis_ab"],
        }
        for row in rows
    ]


def datenbanken_pruefen() -> dict[str, str]:
    """Kann vom FastAPI-/health-Endpunkt verwendet werden."""
    status = {"postgresql": "nicht erreichbar", "mongodb": "nicht erreichbar"}

    with get_connection() as conn:
        conn.execute("SELECT 1").fetchone()
    status["postgresql"] = "ok"

    client = get_mongo_client()
    try:
        client.admin.command("ping")
        status["mongodb"] = "ok"
    finally:
        client.close()

    return status


def bestellung_aufgeben(
    produkt_variante_id: UUID | str,
    menge: int = 1,
    nutzer_id: UUID | str | None = None,
) -> UUID:
    """Kompatibilitätsfunktion für alten Code.

    Neue Bestellungen benötigen zwingend einen Nutzer und eine konkrete
    Produktvariante. Intern wird der normale Warenkorb-/Checkout-Ablauf genutzt.
    """
    if nutzer_id is None:
        raise ValueError("Für eine Bestellung wird eine nutzer_id benötigt.")

    try:
        from .warenkorb import artikel_hinzufuegen, bestellung_abschliessen
    except ImportError:
        from warenkorb import artikel_hinzufuegen, bestellung_abschliessen

    if not artikel_hinzufuegen(nutzer_id, produkt_variante_id, menge):
        raise ValueError("Produktvariante konnte nicht zum Warenkorb hinzugefügt werden.")

    bestellung_id = bestellung_abschliessen(nutzer_id)
    if bestellung_id is None:
        raise ValueError("Bestellung konnte nicht abgeschlossen werden.")
    return bestellung_id
