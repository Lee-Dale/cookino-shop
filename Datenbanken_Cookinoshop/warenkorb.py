import sqlite3
from datetime import datetime

DB_NAME  = "konto_shop.db"
SHOP_DB  = "cookinoshop.db"


# ── Verbindung ───────────────────────────────────────────────────────────────

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def get_shop_connection():
    conn = sqlite3.connect(SHOP_DB)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


# ── Tabellen erstellen ───────────────────────────────────────────────────────

def create_warenkorb_tables():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS warenkorb (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                nutzer_id       INTEGER NOT NULL REFERENCES nutzer(id) ON DELETE CASCADE,
                artikel_id      INTEGER NOT NULL,
                menge           INTEGER NOT NULL DEFAULT 1,
                hinzugefuegt_am TEXT DEFAULT (datetime('now')),
                UNIQUE (nutzer_id, artikel_id)
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS bestellungen (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                nutzer_id    INTEGER NOT NULL REFERENCES nutzer(id),
                gesamt_preis REAL NOT NULL,
                status       TEXT DEFAULT 'offen',
                bestellt_am  TEXT DEFAULT (datetime('now'))
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS bestellung_artikel (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                bestellung_id INTEGER NOT NULL REFERENCES bestellungen(id) ON DELETE CASCADE,
                artikel_id    INTEGER NOT NULL,
                menge         INTEGER NOT NULL,
                einzelpreis   REAL NOT NULL
            )
        """)
    print("OK Warenkorb-Tabellen erstellt.")


# ── Berechtigung prüfen (intern) ─────────────────────────────────────────────

def _nutzer_existiert(conn, nutzer_id: int):
    row = conn.execute(
        "SELECT id FROM nutzer WHERE id = ? AND aktiv = 1", (nutzer_id,)
    ).fetchone()
    return row is not None


def _artikel_verfuegbar(artikel_id: int, menge: int):
    with get_shop_connection() as shop:
        row = shop.execute(
            "SELECT lagerbestand FROM artikel WHERE id = ? AND aktiv = 1", (artikel_id,)
        ).fetchone()
    if not row:
        return False
    return row["lagerbestand"] >= menge


# ── Warenkorb Funktionen ─────────────────────────────────────────────────────

def artikel_hinzufuegen(nutzer_id: int, artikel_id: int, menge: int = 1):
    """
    Artikel in den Warenkorb legen.
    Gäste dürfen Artikel hinzufügen — aber beim Kaufen müssen sie sich anmelden.
    """
    with get_connection() as conn:

        if not _nutzer_existiert(conn, nutzer_id):
            print("FEHLER Nutzer nicht gefunden.")
            return False

        if not _artikel_verfuegbar(artikel_id, menge):
            print("FEHLER Artikel nicht verfügbar oder nicht genug auf Lager.")
            return False

        # Wenn Artikel schon im Warenkorb → Menge erhöhen
        vorhanden = conn.execute(
            "SELECT id, menge FROM warenkorb WHERE nutzer_id = ? AND artikel_id = ?",
            (nutzer_id, artikel_id)
        ).fetchone()

        if vorhanden:
            conn.execute(
                "UPDATE warenkorb SET menge = menge + ? WHERE nutzer_id = ? AND artikel_id = ?",
                (menge, nutzer_id, artikel_id)
            )
            print(f"OK Menge aktualisiert (jetzt {vorhanden['menge'] + menge}x).")
        else:
            conn.execute(
                "INSERT INTO warenkorb (nutzer_id, artikel_id, menge) VALUES (?, ?, ?)",
                (nutzer_id, artikel_id, menge)
            )
            print("OK Artikel zum Warenkorb hinzugefügt.")
    return True


def warenkorb_anzeigen(nutzer_id: int):
    """Warenkorb eines Nutzers anzeigen"""
    with get_connection() as conn:
        eintraege = conn.execute(
            "SELECT id, artikel_id, menge, hinzugefuegt_am FROM warenkorb WHERE nutzer_id = ? ORDER BY hinzugefuegt_am",
            (nutzer_id,)
        ).fetchall()

    if not eintraege:
        print(" Warenkorb ist leer.")
        return []

    print(f"\n{'Artikel':<30} {'Preis':>8} {'Menge':>6} {'Summe':>10}")
    print("-" * 58)
    gesamt = 0
    ergebnis = []

    with get_shop_connection() as shop:
        for e in eintraege:
            artikel = shop.execute(
                "SELECT name, preis FROM artikel WHERE id = ?", (e["artikel_id"],)
            ).fetchone()
            if not artikel:
                continue
            zwischensumme = artikel["preis"] * e["menge"]
            print(f"{artikel['name']:<30} {artikel['preis']:>8.2f} {e['menge']:>6} {zwischensumme:>10.2f}")
            gesamt += zwischensumme
            ergebnis.append({
                "artikel_id":    e["artikel_id"],
                "name":          artikel["name"],
                "preis":         artikel["preis"],
                "menge":         e["menge"],
                "zwischensumme": zwischensumme
            })

    print("-" * 58)
    print(f"{'Gesamt:':<46} {gesamt:>10.2f} €")
    return ergebnis


def menge_aendern(nutzer_id: int, artikel_id: int, neue_menge: int):
    """Menge eines Artikels im Warenkorb ändern"""
    if neue_menge <= 0:
        return artikel_entfernen(nutzer_id, artikel_id)

    if not _artikel_verfuegbar(artikel_id, neue_menge):
        print("FEHLER Nicht genug auf Lager.")
        return False

    with get_connection() as conn:
        conn.execute(
            "UPDATE warenkorb SET menge = ? WHERE nutzer_id = ? AND artikel_id = ?",
            (neue_menge, nutzer_id, artikel_id)
        )
    print(f"OK Menge auf {neue_menge} geändert.")
    return True


def artikel_entfernen(nutzer_id: int, artikel_id: int):
    """Artikel aus dem Warenkorb entfernen"""
    with get_connection() as conn:
        conn.execute(
            "DELETE FROM warenkorb WHERE nutzer_id = ? AND artikel_id = ?",
            (nutzer_id, artikel_id)
        )
    print("OK Artikel aus dem Warenkorb entfernt.")
    return True


def warenkorb_leeren(nutzer_id: int):
    """Kompletten Warenkorb leeren"""
    with get_connection() as conn:
        conn.execute("DELETE FROM warenkorb WHERE nutzer_id = ?", (nutzer_id,))
    print("OK Warenkorb geleert.")


# ── Bestellung abschließen ───────────────────────────────────────────────────

def bestellung_abschliessen(nutzer_id: int):
    """
    Warenkorb in eine Bestellung umwandeln.
    Gäste müssen sich erst anmelden/registrieren.
    Lagerbestand wird reduziert, Warenkorb wird geleert.
    """
    with get_connection() as conn:

        # Gäste dürfen nicht kaufen
        rolle = conn.execute(
            """SELECT r.name AS rolle FROM nutzer n
               JOIN rollen r ON n.rollen_id = r.id
               WHERE n.id = ? AND n.aktiv = 1""",
            (nutzer_id,)
        ).fetchone()

        if not rolle:
            print("FEHLER Nutzer nicht gefunden.")
            return None

        if rolle["rolle"] == "gast":
            print("ACHTUNG  Bitte erst anmelden oder registrieren um zu kaufen!")
            return None

        warenkorb = conn.execute(
            "SELECT artikel_id, menge FROM warenkorb WHERE nutzer_id = ?",
            (nutzer_id,)
        ).fetchall()

        if not warenkorb:
            print("FEHLER Warenkorb ist leer — keine Bestellung möglich.")
            return None

        # Artikel-Daten aus Shop-DB holen + Lager prüfen
        eintraege = []
        with get_shop_connection() as shop:
            for w in warenkorb:
                artikel = shop.execute(
                    "SELECT id, name, preis, lagerbestand FROM artikel WHERE id = ? AND aktiv = 1",
                    (w["artikel_id"],)
                ).fetchone()
                if not artikel:
                    print(f"FEHLER Artikel ID {w['artikel_id']} nicht gefunden.")
                    return None
                if artikel["lagerbestand"] < w["menge"]:
                    print(f"FEHLER '{artikel['name']}' nicht mehr ausreichend auf Lager.")
                    return None
                eintraege.append({
                    "artikel_id": artikel["id"],
                    "name":       artikel["name"],
                    "preis":      artikel["preis"],
                    "menge":      w["menge"]
                })

        gesamt = sum(e["preis"] * e["menge"] for e in eintraege)

        # Bestellung anlegen
        conn.execute(
            "INSERT INTO bestellungen (nutzer_id, gesamt_preis) VALUES (?, ?)",
            (nutzer_id, gesamt)
        )
        bestellung_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]

        # Bestellpositionen speichern
        for e in eintraege:
            conn.execute(
                """INSERT INTO bestellung_artikel (bestellung_id, artikel_id, menge, einzelpreis)
                   VALUES (?, ?, ?, ?)""",
                (bestellung_id, e["artikel_id"], e["menge"], e["preis"])
            )

        # Warenkorb leeren
        conn.execute("DELETE FROM warenkorb WHERE nutzer_id = ?", (nutzer_id,))

    # Lagerbestand in Shop-DB reduzieren
    with get_shop_connection() as shop:
        for e in eintraege:
            shop.execute(
                "UPDATE artikel SET lagerbestand = lagerbestand - ? WHERE id = ?",
                (e["menge"], e["artikel_id"])
            )

    print(f"\n Happy Hacking! Vielen Dank für deinen Einkauf!")
    print(f"   Bestellung #{bestellung_id} | Gesamt: {gesamt:.2f} €")
    return bestellung_id


def bestellungen_anzeigen(nutzer_id: int):
    """Bestellhistorie eines Nutzers anzeigen"""
    with get_connection() as conn:
        bestellungen = conn.execute(
            """SELECT b.id, b.gesamt_preis, b.status, b.bestellt_am
               FROM bestellungen b
               WHERE b.nutzer_id = ?
               ORDER BY b.bestellt_am DESC""",
            (nutzer_id,)
        ).fetchall()

    if not bestellungen:
        print(" Keine Bestellungen vorhanden.")
        return []

    print(f"\n{'#':<5} {'Datum':<22} {'Status':<15} {'Gesamt':>10}")
    print("-" * 55)
    for b in bestellungen:
        print(f"{b['id']:<5} {b['bestellt_am']:<22} {b['status']:<15} {b['gesamt_preis']:>10.2f} €")

    return [dict(b) for b in bestellungen]


# ── Hauptprogramm ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    create_warenkorb_tables()

    # Testnutzer IDs (müssen in konto_shop.db vorhanden sein)
    # Chris = Admin (id 1), Bendix = Leiter (id 3)
    chris_id  = 1
    bendix_id = 3

    print("\n=== Warenkorb: Chris ===")
    artikel_hinzufuegen(chris_id, artikel_id=1, menge=2)
    artikel_hinzufuegen(chris_id, artikel_id=2, menge=1)
    warenkorb_anzeigen(chris_id)

    print("\n=== Menge ändern ===")
    menge_aendern(chris_id, artikel_id=1, neue_menge=3)
    warenkorb_anzeigen(chris_id)

    print("\n=== Bestellung abschließen ===")
    bestellung_abschliessen(chris_id)

    print("\n=== Bestellhistorie ===")
    bestellungen_anzeigen(chris_id)

    print("\n=== Gast versucht Warenkorb zu nutzen ===")
    artikel_hinzufuegen(4, artikel_id=1, menge=1)  