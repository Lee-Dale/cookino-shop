"""PostgreSQL-Warenkorb und transaktionssicherer Checkout.

Der Lagerbestand liegt auf ``produkt_varianten``. Deshalb verarbeitet dieses
Modul keine allgemeine Produkt-ID, sondern immer die konkrete Variante aus
Größe und Farbe.
"""

from __future__ import annotations

from decimal import Decimal
from typing import Any
from uuid import UUID

import psycopg

try:
    from .konto_shop import get_connection
except ImportError:
    from konto_shop import get_connection


def get_shop_connection() -> psycopg.Connection:
    """Alter Kompatibilitätsname: Es gibt jetzt nur noch PostgreSQL."""
    return get_connection()


def create_warenkorb_tables() -> None:
    """Alter Kompatibilitätsname; ``schema.sql`` übernimmt die Erstellung."""
    return None


def _nutzer_existiert(conn: psycopg.Connection, nutzer_id: UUID | str) -> bool:
    row = conn.execute(
        "SELECT id FROM nutzer WHERE id = %s AND aktiv = TRUE",
        (str(nutzer_id),),
    ).fetchone()
    return row is not None


def _aktiver_warenkorb(
    conn: psycopg.Connection,
    nutzer_id: UUID | str,
    *,
    erstellen: bool = False,
) -> dict[str, Any] | None:
    warenkorb = conn.execute(
        """
        SELECT id, nutzer_id, status
        FROM warenkoerbe
        WHERE nutzer_id = %s AND status = 'aktiv'
        """,
        (str(nutzer_id),),
    ).fetchone()
    if warenkorb or not erstellen:
        return warenkorb

    return conn.execute(
        """
        INSERT INTO warenkoerbe (nutzer_id, status)
        VALUES (%s, 'aktiv')
        RETURNING id, nutzer_id, status
        """,
        (str(nutzer_id),),
    ).fetchone()


def _variante_sperren(
    conn: psycopg.Connection,
    produkt_variante_id: UUID | str,
) -> dict[str, Any] | None:
    return conn.execute(
        """
        SELECT
            pv.id,
            pv.produkt_id,
            pv.artikelnummer,
            pv.farbe,
            pv.lagerbestand,
            pv.aktiv,
            p.name AS produktname,
            p.preis,
            p.aktiv AS produkt_aktiv,
            g.code AS groesse
        FROM produkt_varianten pv
        JOIN produkte p ON p.id = pv.produkt_id
        LEFT JOIN groessen g ON g.id = pv.groesse_id
        WHERE pv.id = %s
        FOR UPDATE OF pv
        """,
        (str(produkt_variante_id),),
    ).fetchone()


def artikel_hinzufuegen(
    nutzer_id: UUID | str,
    produkt_variante_id: UUID | str,
    menge: int = 1,
) -> bool:
    if menge <= 0:
        return False

    with get_connection() as conn:
        if not _nutzer_existiert(conn, nutzer_id):
            return False

        variante = _variante_sperren(conn, produkt_variante_id)
        if (
            variante is None
            or not variante["aktiv"]
            or not variante["produkt_aktiv"]
        ):
            return False

        warenkorb = _aktiver_warenkorb(conn, nutzer_id, erstellen=True)
        vorhanden = conn.execute(
            """
            SELECT menge
            FROM warenkorb_artikel
            WHERE warenkorb_id = %s AND produkt_variante_id = %s
            """,
            (warenkorb["id"], str(produkt_variante_id)),
        ).fetchone()

        zielmenge = menge + (vorhanden["menge"] if vorhanden else 0)
        if variante["lagerbestand"] < zielmenge:
            return False

        conn.execute(
            """
            INSERT INTO warenkorb_artikel
                (warenkorb_id, produkt_variante_id, menge)
            VALUES (%s, %s, %s)
            ON CONFLICT (warenkorb_id, produkt_variante_id)
            DO UPDATE SET menge = EXCLUDED.menge
            """,
            (warenkorb["id"], str(produkt_variante_id), zielmenge),
        )
        return True


def warenkorb_anzeigen(nutzer_id: UUID | str) -> list[dict[str, Any]]:
    with get_connection() as conn:
        warenkorb = _aktiver_warenkorb(conn, nutzer_id)
        if warenkorb is None:
            return []

        rows = conn.execute(
            """
            SELECT
                wa.produkt_variante_id,
                pv.produkt_id,
                p.name,
                p.preis,
                pv.artikelnummer,
                pv.farbe,
                g.code AS groesse,
                wa.menge,
                (p.preis * wa.menge) AS zwischensumme,
                wa.hinzugefuegt_am
            FROM warenkorb_artikel wa
            JOIN produkt_varianten pv ON pv.id = wa.produkt_variante_id
            JOIN produkte p ON p.id = pv.produkt_id
            LEFT JOIN groessen g ON g.id = pv.groesse_id
            WHERE wa.warenkorb_id = %s
            ORDER BY wa.hinzugefuegt_am
            """,
            (warenkorb["id"],),
        ).fetchall()

    return [
        {
            **dict(row),
            "preis": float(row["preis"]),
            "zwischensumme": float(row["zwischensumme"]),
        }
        for row in rows
    ]


def menge_aendern(
    nutzer_id: UUID | str,
    produkt_variante_id: UUID | str,
    neue_menge: int,
) -> bool:
    if neue_menge <= 0:
        return artikel_entfernen(nutzer_id, produkt_variante_id)

    with get_connection() as conn:
        warenkorb = _aktiver_warenkorb(conn, nutzer_id)
        if warenkorb is None:
            return False

        variante = _variante_sperren(conn, produkt_variante_id)
        if variante is None or variante["lagerbestand"] < neue_menge:
            return False

        cursor = conn.execute(
            """
            UPDATE warenkorb_artikel
            SET menge = %s
            WHERE warenkorb_id = %s AND produkt_variante_id = %s
            """,
            (neue_menge, warenkorb["id"], str(produkt_variante_id)),
        )
        return cursor.rowcount == 1


def artikel_entfernen(
    nutzer_id: UUID | str,
    produkt_variante_id: UUID | str,
) -> bool:
    with get_connection() as conn:
        warenkorb = _aktiver_warenkorb(conn, nutzer_id)
        if warenkorb is None:
            return False

        cursor = conn.execute(
            """
            DELETE FROM warenkorb_artikel
            WHERE warenkorb_id = %s AND produkt_variante_id = %s
            """,
            (warenkorb["id"], str(produkt_variante_id)),
        )
        return cursor.rowcount == 1


def warenkorb_leeren(nutzer_id: UUID | str) -> bool:
    with get_connection() as conn:
        warenkorb = _aktiver_warenkorb(conn, nutzer_id)
        if warenkorb is None:
            return False
        conn.execute(
            "DELETE FROM warenkorb_artikel WHERE warenkorb_id = %s",
            (warenkorb["id"],),
        )
        return True


def bestellung_abschliessen(nutzer_id: UUID | str) -> UUID | None:
    """Erstellt Bestellung, reduziert Lager und schließt Warenkorb atomar ab."""
    with get_connection() as conn:
        nutzer = conn.execute(
            """
            SELECT n.id, r.name AS rolle
            FROM nutzer n
            JOIN rollen r ON r.id = n.rollen_id
            WHERE n.id = %s AND n.aktiv = TRUE
            """,
            (str(nutzer_id),),
        ).fetchone()
        if nutzer is None or nutzer["rolle"] == "gast":
            return None

        warenkorb = _aktiver_warenkorb(conn, nutzer_id)
        if warenkorb is None:
            return None

        positionen = conn.execute(
            """
            SELECT
                wa.produkt_variante_id,
                wa.menge,
                pv.artikelnummer,
                pv.farbe,
                pv.lagerbestand,
                pv.aktiv AS variante_aktiv,
                p.name AS produktname,
                p.preis,
                p.aktiv AS produkt_aktiv,
                g.code AS groesse
            FROM warenkorb_artikel wa
            JOIN produkt_varianten pv ON pv.id = wa.produkt_variante_id
            JOIN produkte p ON p.id = pv.produkt_id
            LEFT JOIN groessen g ON g.id = pv.groesse_id
            WHERE wa.warenkorb_id = %s
            ORDER BY wa.hinzugefuegt_am
            FOR UPDATE OF pv
            """,
            (warenkorb["id"],),
        ).fetchall()

        if not positionen:
            return None

        for position in positionen:
            if (
                not position["variante_aktiv"]
                or not position["produkt_aktiv"]
                or position["lagerbestand"] < position["menge"]
            ):
                return None

        gesamtpreis = sum(
            (position["preis"] * position["menge"] for position in positionen),
            Decimal("0.00"),
        )

        bestellung = conn.execute(
            """
            INSERT INTO bestellungen (nutzer_id, status, gesamtpreis)
            VALUES (%s, 'offen', %s)
            RETURNING id
            """,
            (str(nutzer_id), gesamtpreis),
        ).fetchone()

        for position in positionen:
            conn.execute(
                """
                INSERT INTO bestellung_artikel
                    (
                        bestellung_id,
                        produkt_variante_id,
                        produktname,
                        artikelnummer,
                        groesse,
                        farbe,
                        menge,
                        einzelpreis
                    )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    bestellung["id"],
                    position["produkt_variante_id"],
                    position["produktname"],
                    position["artikelnummer"],
                    position["groesse"],
                    position["farbe"],
                    position["menge"],
                    position["preis"],
                ),
            )
            conn.execute(
                """
                UPDATE produkt_varianten
                SET lagerbestand = lagerbestand - %s
                WHERE id = %s
                """,
                (position["menge"], position["produkt_variante_id"]),
            )

        conn.execute(
            """
            UPDATE warenkoerbe
            SET status = 'bestellt', geaendert_am = CURRENT_TIMESTAMP
            WHERE id = %s
            """,
            (warenkorb["id"],),
        )

        return bestellung["id"]


def bestellungen_anzeigen(nutzer_id: UUID | str) -> list[dict[str, Any]]:
    with get_connection() as conn:
        bestellungen = conn.execute(
            """
            SELECT id, gesamtpreis, status, bestellt_am, geaendert_am
            FROM bestellungen
            WHERE nutzer_id = %s
            ORDER BY bestellt_am DESC
            """,
            (str(nutzer_id),),
        ).fetchall()

        ergebnis = []
        for bestellung in bestellungen:
            positionen = conn.execute(
                """
                SELECT produkt_variante_id, produktname, artikelnummer,
                       groesse, farbe, menge, einzelpreis
                FROM bestellung_artikel
                WHERE bestellung_id = %s
                ORDER BY produktname
                """,
                (bestellung["id"],),
            ).fetchall()
            ergebnis.append(
                {
                    **dict(bestellung),
                    "gesamtpreis": float(bestellung["gesamtpreis"]),
                    "positionen": [
                        {
                            **dict(position),
                            "einzelpreis": float(position["einzelpreis"]),
                        }
                        for position in positionen
                    ],
                }
            )

    return ergebnis
