"""Live-Prüfung für die gemeinsame PostgreSQL-/MongoDB-Datenbasis.

Ausführen, sobald beide Container auf Healty  sind:
    python db_smoketest.py
"""

from __future__ import annotations

import sys

from shop_main import get_connection, get_mongo_client, get_mongo_database


ERWARTETE_ANZAHLEN = {
    "rollen": 4,
    "groessen": 7,
    "kollektionen": 3,
    "produkte": 9,
    "produkt_varianten": 21,
}

ERWARTETE_MONGO_ANZAHLEN = {
    "produkt_inhalte": 9,
    "kollektion_inhalte": 3,
    "medien": 10,
}


def pruefen() -> None:
    """Prüft Seed-Anzahlen und die UUID-Verknüpfung beider Datenbanken."""
    with get_connection() as conn:
        postgres_anzahlen = {
            tabelle: conn.execute(
                f"SELECT COUNT(*) AS anzahl FROM {tabelle}"
            ).fetchone()["anzahl"]
            for tabelle in ERWARTETE_ANZAHLEN
        }
        postgres_produkt_ids = {
            str(row["id"])
            for row in conn.execute("SELECT id FROM produkte").fetchall()
        }
        postgres_kollektion_ids = {
            str(row["id"])
            for row in conn.execute("SELECT id FROM kollektionen").fetchall()
        }

    client = get_mongo_client()
    try:
        db = get_mongo_database(client)
        mongo_anzahlen = {
            collection: db[collection].count_documents({})
            for collection in ERWARTETE_MONGO_ANZAHLEN
        }
        mongo_produkt_ids = {
            document["produkt_id"]
            for document in db.produkt_inhalte.find({}, {"produkt_id": 1})
        }
        mongo_kollektion_ids = {
            document["kollektion_id"]
            for document in db.kollektion_inhalte.find({}, {"kollektion_id": 1})
        }
    finally:
        client.close()

    fehler: list[str] = []
    for name, erwartet in ERWARTETE_ANZAHLEN.items():
        if postgres_anzahlen[name] != erwartet:
            fehler.append(
                f"PostgreSQL {name}: {postgres_anzahlen[name]} statt {erwartet}"
            )

    for name, erwartet in ERWARTETE_MONGO_ANZAHLEN.items():
        if mongo_anzahlen[name] != erwartet:
            fehler.append(f"MongoDB {name}: {mongo_anzahlen[name]} statt {erwartet}")

    if postgres_produkt_ids != mongo_produkt_ids:
        fehler.append("Produkt-UUIDs in PostgreSQL und MongoDB stimmen nicht überein")
    if postgres_kollektion_ids != mongo_kollektion_ids:
        fehler.append("Kollektion-UUIDs in PostgreSQL und MongoDB stimmen nicht überein")

    if fehler:
        raise RuntimeError("\n".join(fehler))

    print("OK: PostgreSQL und MongoDB sind erreichbar.")
    print(f"OK: PostgreSQL-Seeds: {postgres_anzahlen}")
    print(f"OK: MongoDB-Seeds: {mongo_anzahlen}")
    print(f"OK: Produkt- und Kollektion-UUIDs stimmen überein.")
    print( "Alles läuft und wir haben gut gearbeitet!  yippiee🎉")


if __name__ == "__main__":
    try:
        pruefen()
    except Exception as exc:
        print(f"FEHLER: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
