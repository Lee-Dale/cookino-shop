import sqlite3
import hashlib
import os
from datetime import datetime

DB_NAME = "konto_shop.db"


# ── Verbindung ───────────────────────────────────────────────────────────────

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


# ── Tabellen erstellen ───────────────────────────────────────────────────────

def create_auth_tables():
    with get_connection() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS rollen (
                id    INTEGER PRIMARY KEY AUTOINCREMENT,
                name  TEXT NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS nutzer (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                vorname      TEXT NOT NULL,
                nachname     TEXT NOT NULL,
                email        TEXT NOT NULL UNIQUE,
                passwort     TEXT NOT NULL,
                salt         TEXT NOT NULL,
                rollen_id    INTEGER NOT NULL REFERENCES rollen(id) DEFAULT 4,
                aktiv        INTEGER DEFAULT 1,
                erstellt_am  TEXT DEFAULT (datetime('now')),
                geaendert_am TEXT DEFAULT (datetime('now'))
            );
        """)

        # Standardrollen einfügen
        conn.executemany(
            "INSERT OR IGNORE INTO rollen (name) VALUES (?)",
            [("admin",), ("leiter",), ("kunde",), ("gast",)]
        )
    print("OK Auth-Tabellen erstellt.")


# ── Passwort Hashing ─────────────────────────────────────────────────────────

def hash_passwort(passwort: str, salt: str = None):
    """Passwort mit SHA-256 + Salt hashen"""
    if salt is None:
        salt = os.urandom(32).hex()  # zufälliger Salt
    gehashed = hashlib.sha256((passwort + salt).encode()).hexdigest()
    return gehashed, salt


def passwort_pruefen(passwort: str, gespeicherter_hash: str, salt: str):
    """Eingegebenes Passwort gegen gespeicherten Hash prüfen"""
    gehashed, _ = hash_passwort(passwort, salt)
    return gehashed == gespeicherter_hash


# ── Registrierung ────────────────────────────────────────────────────────────

def registrieren(vorname: str, nachname: str, email: str, passwort: str, rollen_id: int = 4):
    """
    Neuen Nutzer registrieren.
    Standardrolle: 4 = Gast
    """
    # Passwort validieren
    if len(passwort) < 8:
        print("FEHLER Passwort muss mindestens 8 Zeichen haben.")
        return None

    passwort_hash, salt = hash_passwort(passwort)

    try:
        with get_connection() as conn:
            conn.execute(
                """INSERT INTO nutzer (vorname, nachname, email, passwort, salt, rollen_id)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (vorname, nachname, email.lower(), passwort_hash, salt, rollen_id)
            )
            nutzer_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
        print(f"OK Konto erstellt für {vorname} {nachname} (ID: {nutzer_id})")
        return nutzer_id
    except sqlite3.IntegrityError:
        print(f"FEHLER E-Mail '{email}' ist bereits registriert.")
        return None


# ── Login ────────────────────────────────────────────────────────────────────

def login(email: str, passwort: str):
    """
    Nutzer einloggen.
    Gibt Nutzerdaten zurück wenn erfolgreich, sonst None.
    """
    with get_connection() as conn:
        nutzer = conn.execute(
            """SELECT n.*, r.name AS rolle
               FROM nutzer n
               JOIN rollen r ON n.rollen_id = r.id
               WHERE n.email = ? AND n.aktiv = 1""",
            (email.lower(),)
        ).fetchone()

    if not nutzer:
        print("FEHLER E-Mail nicht gefunden oder Konto deaktiviert.")
        return None

    if not passwort_pruefen(passwort, nutzer["passwort"], nutzer["salt"]):
        print("FEHLER Falsches Passwort.")
        return None

    print(f"OK Willkommen, {nutzer['vorname']}! (Rolle: {nutzer['rolle']})")
    return dict(nutzer)


# ── Konto ändern ─────────────────────────────────────────────────────────────

def konto_aendern(nutzer_id: int, vorname: str = None, nachname: str = None,
                  email: str = None, neues_passwort: str = None):
    """Nutzerdaten aktualisieren — nur übergebene Felder werden geändert"""
    with get_connection() as conn:
        nutzer = conn.execute(
            "SELECT * FROM nutzer WHERE id = ? AND aktiv = 1", (nutzer_id,)
        ).fetchone()

        if not nutzer:
            print("FEHLER Nutzer nicht gefunden.")
            return False

        felder = {}
        if vorname:
            felder["vorname"] = vorname
        if nachname:
            felder["nachname"] = nachname
        if email:
            felder["email"] = email.lower()
        if neues_passwort:
            if len(neues_passwort) < 8:
                print("FEHLER Neues Passwort muss mindestens 8 Zeichen haben.")
                return False
            pw_hash, salt = hash_passwort(neues_passwort)
            felder["passwort"] = pw_hash
            felder["salt"] = salt

        if not felder:
            print("ACHTUNG  Keine Änderungen übergeben.")
            return False

        felder["geaendert_am"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        set_clause = ", ".join(f"{k} = ?" for k in felder)
        werte = list(felder.values()) + [nutzer_id]

        conn.execute(f"UPDATE nutzer SET {set_clause} WHERE id = ?", werte)

    print(f"OK Konto (ID: {nutzer_id}) erfolgreich aktualisiert.")
    return True


# ── Konto löschen ────────────────────────────────────────────────────────────

def konto_loeschen(nutzer_id: int, passwort: str):
    """Konto deaktivieren (Soft Delete) — Daten bleiben erhalten"""
    with get_connection() as conn:
        nutzer = conn.execute(
            "SELECT * FROM nutzer WHERE id = ? AND aktiv = 1", (nutzer_id,)
        ).fetchone()

        if not nutzer:
            print("FEHLER Nutzer nicht gefunden.")
            return False

        if not passwort_pruefen(passwort, nutzer["passwort"], nutzer["salt"]):
            print("FEHLER Falsches Passwort — Konto nicht gelöscht.")
            return False

        conn.execute(
            "UPDATE nutzer SET aktiv = 0, geaendert_am = ? WHERE id = ?",
            (datetime.now().strftime("%Y-%m-%d %H:%M:%S"), nutzer_id)
        )

    print(f"OK Konto (ID: {nutzer_id}) wurde deaktiviert.")
    return True


# ── Rollen verwalten (nur Admin) ─────────────────────────────────────────────

def rolle_aendern(admin_id: int, nutzer_id: int, neue_rollen_id: int):
    """Nur Admin darf Rollen ändern"""
    with get_connection() as conn:
        admin = conn.execute(
            """SELECT n.*, r.name AS rolle FROM nutzer n
               JOIN rollen r ON n.rollen_id = r.id
               WHERE n.id = ? AND n.aktiv = 1""",
            (admin_id,)
        ).fetchone()

        if not admin or admin["rolle"] != "admin":
            print("FEHLER Keine Berechtigung — nur Admins dürfen Rollen ändern.")
            return False

        conn.execute(
            "UPDATE nutzer SET rollen_id = ?, geaendert_am = ? WHERE id = ?",
            (neue_rollen_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), nutzer_id)
        )

    print(f"OK Rolle von Nutzer {nutzer_id} auf Rollen-ID {neue_rollen_id} geändert.")
    return True


def alle_nutzer_anzeigen(admin_id: int):
    """Nur Admin darf alle Nutzer sehen"""
    with get_connection() as conn:
        admin = conn.execute(
            """SELECT n.*, r.name AS rolle FROM nutzer n
               JOIN rollen r ON n.rollen_id = r.id
               WHERE n.id = ? AND n.aktiv = 1""",
            (admin_id,)
        ).fetchone()

        if not admin or admin["rolle"] != "admin":
            print("FEHLER Keine Berechtigung.")
            return []

        nutzer = conn.execute(
            """SELECT n.id, n.vorname, n.nachname, n.email, r.name AS rolle,
                      n.aktiv, n.erstellt_am
               FROM nutzer n
               JOIN rollen r ON n.rollen_id = r.id
               ORDER BY n.id"""
        ).fetchall()

    print(f"\n{'ID':<5} {'Name':<25} {'E-Mail':<30} {'Rolle':<10} {'Aktiv'}")
    print("-" * 75)
    for n in nutzer:
        print(
            f"{n['id']:<5} {n['vorname'] + ' ' + n['nachname']:<25} "
            f"{n['email']:<30} {n['rolle']:<10} {'OK' if n['aktiv'] else 'FEHLER'}"
        )
    return [dict(n) for n in nutzer]


# ── Berechtigungen prüfen ────────────────────────────────────────────────────

def hat_berechtigung(nutzer_id: int, mindest_rolle: str):
    """
    Prüft ob ein Nutzer mindestens die angegebene Rolle hat.
    Reihenfolge: admin > leiter > kunde > gast
    """
    rang = {"admin": 4, "leiter": 3, "kunde": 2, "gast": 1}

    with get_connection() as conn:
        nutzer = conn.execute(
            """SELECT r.name AS rolle FROM nutzer n
               JOIN rollen r ON n.rollen_id = r.id
               WHERE n.id = ? AND n.aktiv = 1""",
            (nutzer_id,)
        ).fetchone()

    if not nutzer:
        return False

    return rang.get(nutzer["rolle"], 0) >= rang.get(mindest_rolle, 0)


# ── Logout ───────────────────────────────────────────────────────────────────

def logout(nutzer_id: int):
    """Nutzer ausloggen"""
    with get_connection() as conn:
        nutzer = conn.execute(
            "SELECT vorname FROM nutzer WHERE id = ? AND aktiv = 1", (nutzer_id,)
        ).fetchone()

    if not nutzer:
        print("FEHLER Nutzer nicht gefunden.")
        return False

    print(f"\n  Bis bald, {nutzer['vorname']}!")
    print("   Licht und Frieden ✌️")
    return True


# ── Hauptprogramm ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    create_auth_tables()

    print("\n=== Registrierung ===")
    chris_id  = registrieren("Chris",  "Admin",  "chris@cookino.de",  "Admin1234!", rollen_id=1)
    lee_id    = registrieren("Lee",    "Admin",  "lee@cookino.de",    "Admin1234!", rollen_id=1)
    bendix_id = registrieren("Bendix", "Leiter", "bendix@cookino.de", "Leiter123!", rollen_id=2)
    ramona_id = registrieren("Ramona", "Gast",   "ramona@cookino.de", "Gast12345!", rollen_id=4)

    print("\n=== Login ===")
    nutzer = login("ramona@cookino.de", "Gast12345!")

    print("\n=== Konto ändern ===")
    konto_aendern(ramona_id, neues_passwort="NeuesPasswort1!")

    print("\n=== Berechtigungen prüfen ===")
    print(f"Ramona ist Gast:   {hat_berechtigung(ramona_id, 'gast')}")
    print(f"Ramona ist Leiter: {hat_berechtigung(ramona_id, 'leiter')}")
    print(f"Bendix ist Leiter: {hat_berechtigung(bendix_id, 'leiter')}")
    print(f"Chris ist Admin:   {hat_berechtigung(chris_id,  'admin')}")

    print("\n=== Alle Nutzer (Admin) ===")
    alle_nutzer_anzeigen(chris_id)

    print("\n=== Konto löschen ===")
    konto_loeschen(ramona_id, "NeuesPasswort1!")

    print("\n=== Logout ===")
    logout(chris_id)