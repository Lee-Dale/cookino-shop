import sqlite3
from konto_shop import ( 
    create_auth_tables, registrieren, login, logout, konto_aendern, konto_loeschen, rolle_aendern,
    alle_nutzer_anzeigen, hat_berechtigung
)
from warenkorb import (
    create_warenkorb_tables, artikel_hinzufuegen, warenkorb_anzeigen, artikel_entfernen, warenkorb_leeren, bestellung_abschliessen,
    bestellungen_anzeigen, menge_aendern 
)
from shop_main import (
    create_tables, insert_beispieldaten, alle_kollektionen, artikel_nach_kollektion, shop_uebersicht
)

KONTO_BD = 'konto_shop.db'

# Eingelogter Nutzer 
session = {"nutzer": None}

# Datenbanksetup
def setup():
    create_tables()
    insert_beispieldaten()
    create_auth_tables()
    create_warenkorb_tables()
    print("Datenbanken sind Bereit.")

# Verwaltungsfunktionen Admin und Leiter
def bestellstatus_aendern(nutzer_id: int, bestell_id: int, neuer_status: str):
    erlaubte_status = ["offen", "versendet", "abgeschlossen", "storniert"]

    if neuer_status not in erlaubte_status:
        print(f"FEHLER: Status muss einer von {erlaubte_status} sein.")
        return False
    
    if not hat_berechtigung(nutzer_id, "leiter"):
        print("Fehler: Du haste keine Berechttigung, wende dich an einen Admin oder Leiter.")
        return False
    
    with sqlite3.connect(KONTO_BD) as conn:
        conn.row_factory = sqlite3.Row
        bestellung = conn.execute(
            "SELECT * FROM bestellungen WHERE id = ?", (bestell_id,)
        ).fetchone()

        if not bestellung:
            print("FEHLER: Bestellung nicht gefunden.")
            return False
 
        conn.execute(
            "UPDATE bestellungen SET status = ? WHERE id = ?",
            (neuer_status, bestell_id)
        )

    print(f"OK: Bestellung #{bestell_id} ist jetzt '{neuer_status}'.")
    return True    
        
def artikel_lagerbestand_aendern(nutzer_id: int, artikel_id: int, neuer_bestand: int):
    if not hat_berechtigung(nutzer_id, "leiter"):
        print("FEHLER: Keine Berechtigung.")
        return False
 
    with sqlite3.connect("cokinoshop.db") as conn:
        conn.execute(
            "UPDATE artikel SET lagerbestand = ? WHERE id = ?",
            (neuer_bestand, artikel_id)
        )
 
    print(f"OK: Lagerbestand von Artikel #{artikel_id} auf {neuer_bestand} gesetzt.")
    return True  

def artikel_deaktivieren(nutzer_id: int, artikel_id: int):
    if not hat_berechtigung(nutzer_id, "admin"):
        print("FEHLER: Keine Berechtigung. Nur Admin darf Artikel deaktivieren.")
        return False
 
    with sqlite3.connect("cokinoshop.db") as conn:
        conn.execute(
            "UPDATE artikel SET aktiv = 0 WHERE id = ?", (artikel_id,)
        )
 
    print(f"OK: Artikel #{artikel_id} wurde deaktiviert.")
    return True       

# Menüs

def zeige_hauptmenue():
    print("\n" + "="*40)
    print(" COOKIE CREW SHOP")
    print("="*40)
    if session["nutzer"]:
        n = session["nutzer"]
        print(f" Eingeloggt: {n['vorname']} ({n['rolle']})")
    else:
        print(" Nicht eingeloggt (Gast)")
    print("-"*40)
    print("1 Shop durchstöbern")
    print("2 Warenkorb")
    if session["nutzer"]:
        print("3 Mein Konto")
        if hat_berechtigung(session["nutzer"]["id"], "leiter"):
            print("4 Verwaltung")
        print("0 logout")
    else:
        print("3  Login")
        print("4  Registrieren")
        print("0  Beenden")
    print("-" * 40)

def menue_shop():
    print("\n--- Shop ---")
    print("1 Shop Übersicht")
    print("2 Alle Kollektionen anzeigen")
    print("3 Artikel einer Kollektion anzeigen")
    print("0 Zurück")
    wahl = input("Wahl. ").strip()

    if wahl == "1":
        shop_uebersicht()
    elif wahl == "2":
        kollektionen = alle_kollektionen()
        print(f"\n{'ID':<5} {'Name':<25} {'Beschreibung'}")
        print("-" * 60)
        for k in kollektionen:
            print(f"{k['id']:<5} {k['name']:<25} {k['beschreibung']}")
    elif wahl == "3":
        name = input("Kollektionsname: ").strip()
        artikel = artikel_nach_kollektion(name)
        if artikel:
            print(f"\n{'ID':<5} {'Name':<30} {'Preis':>8} {'Lager':>6}")
            print("-" * 52)
            for a in artikel:
                print(f"{a['id']:<5} {a['name']:<30} {a['preis']:>8.2f} {a['lagerbestand']:>6}")
        else:
            print("Keine Artikel gefunden.")

def menue_warenkorb():
    if not session["nutzer"]:
        print("\nHinweis: Als Gast kannst du den Shop durchstoebern.")
        print("Zum Kaufen bitte einloggen oder registrieren.")
        return
    
    nutzer_id = session["nutzer"]["id"]
 
    print("\n--- WARENKORB ---")
    print("1  Warenkorb anzeigen")
    print("2  Artikel hinzufuegen")
    print("3  Menge aendern")
    print("4  Artikel entfernen")
    print("5  Warenkorb leeren")
    print("6  Bestellen (Checkout)")
    print("7  Bestellhistorie")
    print("0  Zurueck")
    wahl = input("Wahl: ").strip()

    if wahl == "1":
        warenkorb_anzeigen(nutzer_id)
    elif wahl == "2":
        try:
            artikel_id = int(input("Artikel ID: ").strip())
            menge = int(input("Menge: ").strip())
            artikel_hinzufuegen(nutzer_id, artikel_id, menge)
        except ValueError:
            print("FEHLER: Bitte gültige Zahlen eingeben.")
    elif wahl == "3":
        try:
            artikel_id = int(input("Artikel ID: ").strip())
            neue_menge = int(input("Neue Menge: ").strip())
            menge_aendern(nutzer_id, artikel_id, neue_menge)
        except ValueError:
            print("FEHLER: Bitte gültige Zahlen eingeben.")
    elif wahl == "4":
        try:
            artikel_id = int(input("Artikel ID: ").strip())
            artikel_entfernen(nutzer_id, artikel_id)
        except ValueError:
            print("FEHLER: Bitte eine gültige Zahl eingeben.")
    elif wahl == "5":
        warenkorb_leeren(nutzer_id)
    elif wahl == "6":
        bestellung_abschliessen(nutzer_id)
    elif wahl == "7":
        bestellungen_anzeigen(nutzer_id)  

def menue_konto():
    print("\n--- MEIN KONTO ---")
    print("1  Vorname/Nachname aendern")
    print("2  Passwort aendern")
    print("3  Konto loeschen")
    print("0  Zurueck")
    wahl = input("Wahl: ").strip()
    nutzer_id = session["nutzer"]["id"]
 
    if wahl == "1":
        vorname  = input("Neuer Vorname  (leer = unveraendert): ").strip() or None
        nachname = input("Neuer Nachname (leer = unveraendert): ").strip() or None
        konto_aendern(nutzer_id, vorname=vorname, nachname=nachname)
    elif wahl == "2":
        pw = input("Neues Passwort (min. 8 Zeichen): ").strip()
        konto_aendern(nutzer_id, neues_passwort=pw)
    elif wahl == "3":
        pw = input("Passwort zur Bestaetigung: ").strip()
        if konto_loeschen(nutzer_id, pw):
            session["nutzer"] = None
            print("Du wurdest ausgeloggt.")


def menue_verwaltung():
    print("\n--- VERWALTUNG ---")
    print("1  Bestellstatus aendern")
    print("2  Lagerbestand aendern")
    if hat_berechtigung(session["nutzer"]["id"], "admin"):
        print("3  Artikel deaktivieren")
        print("4  Alle Nutzer anzeigen")
        print("5  Rolle eines Nutzers aendern")
    print("0  Zurueck")
    wahl = input("Wahl: ").strip()
    nutzer_id = session["nutzer"]["id"]
 
    if wahl == "1":
        try:
            b_id   = int(input("Bestellungs-ID: "))
            status = input("Neuer Status (offen/versendet/abgeschlossen/storniert): ").strip()
            bestellstatus_aendern(nutzer_id, b_id, status)
        except ValueError:
            print("FEHLER: Bitte eine gueltige ID eingeben.")
    elif wahl == "2":
        try:
            a_id    = int(input("Artikel-ID: "))
            bestand = int(input("Neuer Lagerbestand: "))
            artikel_lagerbestand_aendern(nutzer_id, a_id, bestand)
        except ValueError:
            print("FEHLER: Bitte eine gueltige Zahl eingeben.")
    elif wahl == "3" and hat_berechtigung(nutzer_id, "admin"):
        try:
            a_id = int(input("Artikel-ID: "))
            artikel_deaktivieren(nutzer_id, a_id)
        except ValueError:
            print("FEHLER: Bitte eine gueltige ID eingeben.")
    elif wahl == "4" and hat_berechtigung(nutzer_id, "admin"):
        alle_nutzer_anzeigen(nutzer_id)
    elif wahl == "5" and hat_berechtigung(nutzer_id, "admin"):
        try:
            ziel_id   = int(input("Nutzer-ID: "))
            rollen_id = int(input("Neue Rollen-ID (1=admin 2=leiter 3=kunde 4=gast): "))
            rolle_aendern(nutzer_id, ziel_id, rollen_id)
        except ValueError:
            print("FEHLER: Bitte eine gueltige Zahl eingeben.")

def menue_login():
    print("\n--- LOGIN ---")
    email    = input("E-Mail: ").strip()
    passwort = input("Passwort: ").strip()
    nutzer   = login(email, passwort)
    if nutzer:
        session["nutzer"] = nutzer
 
 
def menue_registrieren():
    print("\n--- REGISTRIEREN ---")
    vorname  = input("Vorname: ").strip()
    nachname = input("Nachname: ").strip()
    email    = input("E-Mail: ").strip()
    passwort = input("Passwort (min. 8 Zeichen): ").strip()
    nutzer_id = registrieren(vorname, nachname, email, passwort, rollen_id=3)
    if nutzer_id:
        print("Konto erstellt! Bitte jetzt einloggen.")

# hauptschleife
def main():
    setup()
 
    while True:
        zeige_hauptmenue()
        wahl = input("Wahl: ").strip()
 
        if session["nutzer"]:
            if wahl == "1":
                menue_shop()
            elif wahl == "2":
                menue_warenkorb()
            elif wahl == "3":
                menue_konto()
            elif wahl == "4" and hat_berechtigung(session["nutzer"]["id"], "leiter"):
                menue_verwaltung()
            elif wahl == "0":
                logout(session["nutzer"]["id"])
                session["nutzer"] = None
        else:
            if wahl == "1":
                menue_shop()
            elif wahl == "2":
                menue_warenkorb()
            elif wahl == "3":
                menue_login()
            elif wahl == "4":
                menue_registrieren()
            elif wahl == "0":
                print("\nTschuess!")
                break
 
 
if __name__ == "__main__":
    main()       