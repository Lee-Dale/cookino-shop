import sqlite3
from datetime import datetime   

DB_NAME = "cookinoshop.db"


# ── Verbindung und Tabellen ──────────────────────────────────────────────────

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def create_tables():
    with get_connection() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS kollektionen (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                name         TEXT NOT NULL UNIQUE,
                beschreibung TEXT
            );
 
            CREATE TABLE IF NOT EXISTS artikel (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                kollektion_id  INTEGER NOT NULL REFERENCES kollektionen(id),
                name           TEXT NOT NULL,
                beschreibung   TEXT,
                preis          REAL NOT NULL,
                lagerbestand   INTEGER DEFAULT 0,
                bild_url       TEXT,
                aktiv          INTEGER DEFAULT 1
            );
 
            CREATE TABLE IF NOT EXISTS bestellungen (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                artikel_id   INTEGER NOT NULL REFERENCES artikel(id),
                menge        INTEGER NOT NULL DEFAULT 1,
                bestellt_am  TEXT DEFAULT (datetime('now')),
                status       TEXT DEFAULT 'offen'
            );

            -- HIER IST DIE WICHTIGE ÄNDERUNG FÜR DIE SYNCHRONISATION
            CREATE TABLE IF NOT EXISTS user (
                id      INTEGER PRIMARY KEY,  -- WICHTIG: KEIN AUTOINCREMENT!
                vorname TEXT NOT NULL,
                email   TEXT NOT NULL,
                username TEXT NOT NULL,            
                aktiv   INTEGER DEFAULT 1
            );
        """)
    print("OK: Shop-Tabellen erstellt.")


# ── Daten einfügen ───────────────────────────────────────────────────────────

def insert_beispieldaten():
    kollektionen = [
        ("Wuschel Witznase",    "Flauschige Charaktere mit Witz"),
        ("Cookino",             "Süße Back- & Keks-Figuren"),
        ("Moniki Kicherkrähe",  "Freche Krähen-Charaktere"),
    ]
 
    artikel_pro_kollektion = {
        "Wuschel Witznase": [
            ("Wuschel Groß",        "Große Plüschfigur",          12.99, 50),
            ("Wuschel Klein",       "Mini-Version für unterwegs",  6.99, 100),
            ("Wuschel Clip",        "Anhänger mit roter Nase",     3.49,  80),
            ("Wuschel Duo-Set",     "Zwei Figuren im Set",        19.99,  30),
            ("Wuschel Tasse",       "Keramiktasse mit Motiv",      9.99,  60),
        ],
        "Cookino": [
            ("Cookino Figur",       "Keksförmige Hauptfigur",      5.99,  70),
            ("Cookino Backset",     "Backzubehör mit Motiv",      14.99,  40),
            ("Cookino Mini-Set",    "3 Mini-Figuren",              9.49,  55),
            ("Cookino Schokoform",  "Schokoladenform Cookino",    11.99,  35),
            ("Cookino Sticker",     "Aufkleber-Set 10-tlg.",       4.99,  90),
        ],
        "Moniki Kicherkrähe": [
            ("Kicherkrähe Figur",   "Krähe mit Lachsound",        13.99,  45),
            ("Krähen-Anhänger",     "Kleine Krähe am Band",        4.99,  90),
            ("Kicherkrähe Set",     "Figur + 2 Miniaturen",       22.99,  20),
            ("Moniki Postkarte",    "Postkarte mit Krähen-Witz",   1.99, 200),
            ("Krähen-Tasse",        "Tasse mit Kicherkrähe",       9.99,  50),
        ],
    }
 
    with get_connection() as conn:
        for name, beschr in kollektionen:
            conn.execute(
                "INSERT OR IGNORE INTO kollektionen (name, beschreibung) VALUES (?, ?)",
                (name, beschr)
            )
 
        for koll_name, artikel_liste in artikel_pro_kollektion.items():
            row = conn.execute(
                "SELECT id FROM kollektionen WHERE name = ?", (koll_name,)
            ).fetchone()
            if not row:
                continue
            koll_id = row["id"]
            for a_name, beschr, preis, lager in artikel_liste:
                conn.execute(
                    """INSERT OR IGNORE INTO artikel
                       (kollektion_id, name, beschreibung, preis, lagerbestand)
                       VALUES (?, ?, ?, ?, ?)""",
                    (koll_id, a_name, beschr, preis, lager)
                )
    print("OK: Daten eingefügt.")


# ── Hilfsfunktionen ──────────────────────────────────────────────────────────

def alle_kollektionen():
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM kollektionen ORDER BY name").fetchall()
    return [dict(row) for row in rows]

def artikel_nach_kollektion(kollektion_name: str):
    with get_connection() as conn:
        rows = conn.execute(
            """SELECT a.* FROM artikel a
               JOIN kollektionen k ON a.kollektion_id = k.id
                WHERE k.name = ? AND a.aktiv = 1
                ORDER BY a.preis""",
            (kollektion_name,)
        ).fetchall()
    return [dict(row) for row in rows]

def bestellung_aufgeben(artikel_id: int, menge: int = 1):
    with get_connection() as conn:
        lager = conn.execute(
            "SELECT lagerbestand FROM artikel WHERE id = ?", (artikel_id,)
        ).fetchone()
        if not lager:
            return None
        conn.execute(
            "INSERT INTO bestellungen (artikel_id, menge) VALUES (?, ?)",
            (artikel_id, menge)
        )
        conn.execute(
            "UPDATE artikel SET lagerbestand = lagerbestand - ? WHERE id = ?",
            (menge, artikel_id)
        ) 
        b_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    print(f" Bestellung #{b_id} aufgegeben.") 
    return b_id

def shop_uebersicht():
    with get_connection() as conn:
        rows = conn.execute(
            """SELECT k.name AS kollektion,
                      COUNT(a.id)         AS artikel_anzahl,
                      MIN(a.preis)        AS preis_ab,
                      SUM(a.lagerbestand) AS gesamt_lager
               FROM kollektionen k
               LEFT JOIN artikel a ON a.kollektion_id = k.id AND a.aktiv = 1
               GROUP BY k.id
               ORDER BY k.name"""
        ).fetchall()
    print(f"\n{'Kollektion':<25} {'Artikel':>7} {'ab €':>8} {'Lager':>8}")
    print("-" * 52)
    for r in rows:
        print(
            f"{r['kollektion']:<25} {r['artikel_anzahl']:>7} "
            f"{r['preis_ab']:>8.2f} {r['gesamt_lager']:>8}"
        )


# ── Hauptprogramm ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    create_tables()
    insert_beispieldaten()
 
    print("\n=== Shop-Übersicht ===")
    shop_uebersicht()
 
    print("\n=== Artikel: Cookino ===")
    for a in artikel_nach_kollektion("Cookino"):
        print(f"  • {a['name']:<30} {a['preis']:.2f} € (Lager: {a['lagerbestand']})")
 
    print("\n=== Testbestellung ===")
    erster_artikel = artikel_nach_kollektion("Wuschel Witznase")[0]
    bestellung_aufgeben(erster_artikel["id"], menge=2)
    