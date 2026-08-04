"""PostgreSQL-Nutzer-, Rollen- und Kontoverwaltung für den Cookino Shop.

Dieses Modul ersetzt die frühere SQLite-Datei ``konto_shop.db``. Passwörter
werden mit scrypt und einem individuellen Salt gespeichert. Der vollständige
Hash inklusive Salt liegt im PostgreSQL-Feld ``passwort_hash``.
"""

from __future__ import annotations

import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import UUID

import psycopg
from dotenv import load_dotenv
from psycopg import sql
from psycopg.errors import UniqueViolation
from psycopg.rows import dict_row


load_dotenv()

MAX_LOGIN_VERSUCHE = int(os.getenv("MAX_LOGIN_VERSUCHE", "3"))
LOGIN_SPERRE_SEKUNDEN = int(os.getenv("LOGIN_SPERRE_SEKUNDEN", "60"))
_login_versuche: dict[str, dict[str, Any]] = {}

ROLLEN_RANG = {"gast": 1, "kunde": 2, "leiter": 3, "admin": 4}


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


def create_auth_tables() -> None:
    """Alter Kompatibilitätsname; ``schema.sql`` übernimmt die Erstellung."""
    return None


def hash_passwort(passwort: str) -> str:
    """Erzeugt einen transportierbaren scrypt-Hash inklusive Salt."""
    if len(passwort) < 8:
        raise ValueError("Passwort muss mindestens 8 Zeichen haben.")

    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(
        passwort.encode("utf-8"),
        salt=salt,
        n=2**14,
        r=8,
        p=1,
        dklen=64,
    )
    return f"scrypt$16384$8$1${salt.hex()}${digest.hex()}"


def passwort_pruefen(passwort: str, gespeicherter_hash: str) -> bool:
    """Prüft ein Passwort gegen den gespeicherten scrypt-Hash."""
    try:
        algorithmus, n, r, p, salt_hex, digest_hex = gespeicherter_hash.split("$")
        if algorithmus != "scrypt":
            return False
        berechnet = hashlib.scrypt(
            passwort.encode("utf-8"),
            salt=bytes.fromhex(salt_hex),
            n=int(n),
            r=int(r),
            p=int(p),
            dklen=len(bytes.fromhex(digest_hex)),
        )
        return hmac.compare_digest(berechnet.hex(), digest_hex)
    except (TypeError, ValueError):
        return False


def _normale_email(email: str) -> str:
    return email.strip().lower()


def _rolle_id(conn: psycopg.Connection, rollen_name: str) -> int:
    row = conn.execute(
        "SELECT id FROM rollen WHERE name = %s",
        (rollen_name,),
    ).fetchone()
    if row is None:
        raise RuntimeError(f"Rolle '{rollen_name}' wurde nicht in PostgreSQL gefunden.")
    return row["id"]


def registrieren(
    vorname: str,
    nachname: str,
    email: str,
    passwort: str,
    rollen_id: int | None = None,
) -> UUID | None:
    """Registriert einen Nutzer. Standardrolle ist ``kunde``."""
    email = _normale_email(email)
    passwort_hash = hash_passwort(passwort)

    try:
        with get_connection() as conn:
            rollen_id = rollen_id or _rolle_id(conn, "kunde")
            row = conn.execute(
                """
                INSERT INTO nutzer
                    (rollen_id, vorname, nachname, email, passwort_hash)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    rollen_id,
                    vorname.strip(),
                    nachname.strip(),
                    email,
                    passwort_hash,
                ),
            ).fetchone()
            return row["id"]
    except UniqueViolation:
        return None


def _login_status(email: str) -> tuple[int, datetime | None]:
    eintrag = _login_versuche.get(email, {})
    gesperrt_bis = eintrag.get("gesperrt_bis")
    if gesperrt_bis and datetime.now(timezone.utc) >= gesperrt_bis:
        _login_versuche.pop(email, None)
        return 0, None
    return int(eintrag.get("versuche", 0)), gesperrt_bis


def _fehlversuch_speichern(email: str) -> None:
    versuche, _ = _login_status(email)
    versuche += 1
    gesperrt_bis = None
    if versuche >= MAX_LOGIN_VERSUCHE:
        gesperrt_bis = datetime.now(timezone.utc) + timedelta(
            seconds=LOGIN_SPERRE_SEKUNDEN
        )
    _login_versuche[email] = {
        "versuche": versuche,
        "gesperrt_bis": gesperrt_bis,
    }


def login(email: str, passwort: str) -> dict[str, Any] | None:
    """Prüft die Zugangsdaten und gibt sichere Nutzerdaten zurück."""
    email = _normale_email(email)
    versuche, gesperrt_bis = _login_status(email)
    if versuche >= MAX_LOGIN_VERSUCHE and gesperrt_bis:
        return None

    with get_connection() as conn:
        nutzer = conn.execute(
            """
            SELECT
                n.id,
                n.vorname,
                n.nachname,
                n.email,
                n.passwort_hash,
                n.aktiv,
                r.id AS rollen_id,
                r.name AS rolle
            FROM nutzer n
            JOIN rollen r ON r.id = n.rollen_id
            WHERE LOWER(n.email) = LOWER(%s)
              AND n.aktiv = TRUE
            """,
            (email,),
        ).fetchone()

    if nutzer is None or not passwort_pruefen(passwort, nutzer["passwort_hash"]):
        _fehlversuch_speichern(email)
        return None

    _login_versuche.pop(email, None)
    result = dict(nutzer)
    result.pop("passwort_hash", None)
    return result


def nutzer_nach_email(email: str) -> dict[str, Any] | None:
    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT n.id, n.vorname, n.nachname, n.email, n.aktiv,
                   r.id AS rollen_id, r.name AS rolle
            FROM nutzer n
            JOIN rollen r ON r.id = n.rollen_id
            WHERE LOWER(n.email) = LOWER(%s)
            """,
            (_normale_email(email),),
        ).fetchone()
    return dict(row) if row else None


def konto_aendern(
    nutzer_id: UUID | str,
    vorname: str | None = None,
    nachname: str | None = None,
    email: str | None = None,
    neues_passwort: str | None = None,
) -> bool:
    """Ändert ausschließlich übergebene Kontofelder."""
    felder: dict[str, Any] = {}
    if vorname:
        felder["vorname"] = vorname.strip()
    if nachname:
        felder["nachname"] = nachname.strip()
    if email:
        felder["email"] = _normale_email(email)
    if neues_passwort:
        felder["passwort_hash"] = hash_passwort(neues_passwort)
    if not felder:
        return False

    felder["geaendert_am"] = datetime.now(timezone.utc)
    set_clause = sql.SQL(", ").join(
        sql.SQL("{} = %s").format(sql.Identifier(name)) for name in felder
    )
    query = sql.SQL("UPDATE nutzer SET {} WHERE id = %s AND aktiv = TRUE").format(
        set_clause
    )

    try:
        with get_connection() as conn:
            cursor = conn.execute(query, [*felder.values(), str(nutzer_id)])
            return cursor.rowcount == 1
    except UniqueViolation:
        return False


def konto_loeschen(nutzer_id: UUID | str, passwort: str) -> bool:
    """Deaktiviert ein Konto nach erfolgreicher Passwortprüfung."""
    with get_connection() as conn:
        nutzer = conn.execute(
            """
            SELECT passwort_hash
            FROM nutzer
            WHERE id = %s AND aktiv = TRUE
            """,
            (str(nutzer_id),),
        ).fetchone()
        if nutzer is None or not passwort_pruefen(passwort, nutzer["passwort_hash"]):
            return False

        cursor = conn.execute(
            """
            UPDATE nutzer
            SET aktiv = FALSE, geaendert_am = CURRENT_TIMESTAMP
            WHERE id = %s
            """,
            (str(nutzer_id),),
        )
        return cursor.rowcount == 1


def rolle_aendern(
    admin_id: UUID | str,
    nutzer_id: UUID | str,
    neue_rollen_id: int,
) -> bool:
    if not hat_berechtigung(admin_id, "admin"):
        return False

    with get_connection() as conn:
        cursor = conn.execute(
            """
            UPDATE nutzer
            SET rollen_id = %s, geaendert_am = CURRENT_TIMESTAMP
            WHERE id = %s AND aktiv = TRUE
            """,
            (neue_rollen_id, str(nutzer_id)),
        )
        return cursor.rowcount == 1


def alle_nutzer_anzeigen(admin_id: UUID | str) -> list[dict[str, Any]]:
    if not hat_berechtigung(admin_id, "admin"):
        return []

    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT n.id, n.vorname, n.nachname, n.email,
                   r.id AS rollen_id, r.name AS rolle,
                   n.aktiv, n.erstellt_am, n.geaendert_am
            FROM nutzer n
            JOIN rollen r ON r.id = n.rollen_id
            ORDER BY n.erstellt_am
            """
        ).fetchall()
    return [dict(row) for row in rows]


def hat_berechtigung(nutzer_id: UUID | str, mindest_rolle: str) -> bool:
    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT r.name AS rolle
            FROM nutzer n
            JOIN rollen r ON r.id = n.rollen_id
            WHERE n.id = %s AND n.aktiv = TRUE
            """,
            (str(nutzer_id),),
        ).fetchone()

    if row is None:
        return False
    return ROLLEN_RANG.get(row["rolle"], 0) >= ROLLEN_RANG.get(mindest_rolle, 0)


def logout(nutzer_id: UUID | str) -> bool:
    """JWT ist zustandslos; Logout erfolgt im Frontend durch Löschen des Tokens."""
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id FROM nutzer WHERE id = %s AND aktiv = TRUE",
            (str(nutzer_id),),
        ).fetchone()
    return row is not None
