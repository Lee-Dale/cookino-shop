# Cookie Crew Shop 🍪

Ein einfaches Shop-System mit SQLite-Datenbank, Nutzerverwaltung, Rollensystem und Warenkorb.

---

## Projektstruktur

```
cookie-crew-shop/
│
├── haupt_main.py       # Hauptprogramm & Menüführung
├── konto_shop.py      # Login, Registrierung, Rollen, Konto
├── shop_main.py       # Kollektionen & Artikel
├── warenkorb.py       # Warenkorb & Bestellungen
├── cokinoshop.db      # SQLite Shop-Datenbank
├── konto_shop.db      # SQLite Konto-Datenbank
└── README.md
```

---

## Starten

```bash
python haupt_main.py
```

Die Datenbanken werden beim ersten Start automatisch erstellt und mit Beispieldaten befüllt.

---

## Kollektionen

| Kollektion         | Beschreibung                    |
|--------------------|---------------------------------|
| Wuschel Witznase   | Flauschige Charaktere mit Witz  |
| Cookino            | Süße Back- & Keks-Figuren       |
| Moniki Kicherkrähe | Freche Krähen-Charaktere        |

---

## Rollensystem

| Rolle   | Beschreibung                                         |
|---------|------------------------------------------------------|
| admin   | Vollzugriff — Nutzer verwalten, Artikel löschen      |
| leiter  | Artikel & Lagerbestand ändern, Bestellstatus setzen  |
| kunde   | Warenkorb nutzen, bestellen                          |
| gast    | Shop ansehen, Warenkorb befüllen — kein Kauf         |

### Rechteübersicht

| Aktion                    | Gast | Kunde | Leiter | Admin |
|---------------------------|------|-------|--------|-------|
| Shop ansehen              | Ja   | Ja    | Ja     | Ja    |
| Warenkorb befüllen        | Ja   | Ja    | Ja     | Ja    |
| Bestellen                 | Nein | Ja    | Ja     | Ja    |
| Lagerbestand ändern       | Nein | Nein  | Ja     | Ja    |
| Bestellstatus ändern      | Nein | Nein  | Ja     | Ja    |
| Artikel deaktivieren      | Nein | Nein  | Nein   | Ja    |
| Nutzer verwalten          | Nein | Nein  | Nein   | Ja    |
| Rollen vergeben           | Nein | Nein  | Nein   | Ja    |

---

## Datenbankstruktur

### Rollen
| Feld | Typ     | Beschreibung            |
|------|---------|-------------------------|
| id   | INTEGER | Primärschlüssel         |
| name | TEXT    | admin/leiter/kunde/gast |

### Nutzer
| Feld        | Typ     | Beschreibung                |
|-------------|---------|-----------------------------|
| id          | INTEGER | Primärschlüssel             |
| vorname     | TEXT    |                             |
| nachname    | TEXT    |                             |
| email       | TEXT    | eindeutig                   |
| passwort    | TEXT    | SHA-256 gehasht             |
| salt        | TEXT    | zufälliger Salt             |
| rollen_id   | INTEGER | Fremdschlüssel → rollen     |
| aktiv       | INTEGER | 1 = aktiv, 0 = deaktiviert  |

### Kollektionen
| Feld         | Typ     | Beschreibung    |
|--------------|---------|-----------------|
| id           | INTEGER | Primärschlüssel |
| name         | TEXT    | eindeutig       |
| beschreibung | TEXT    |                 |

### Artikel
| Feld          | Typ     | Beschreibung            |
|---------------|---------|-------------------------|
| id            | INTEGER | Primärschlüssel         |
| kollektion_id | INTEGER | Fremdschlüssel          |
| name          | TEXT    |                         |
| preis         | REAL    |                         |
| lagerbestand  | INTEGER |                         |
| bild_url      | TEXT    | Link zum S3-Bild        |
| aktiv         | INTEGER | 1 = aktiv, 0 = gelöscht |

### Warenkorb
| Feld       | Typ     | Beschreibung              |
|------------|---------|---------------------------|
| id         | INTEGER | Primärschlüssel           |
| nutzer_id  | INTEGER | Fremdschlüssel → nutzer   |
| artikel_id | INTEGER | Fremdschlüssel → artikel  |
| menge      | INTEGER |                           |

### Bestellungen
| Feld         | Typ     | Beschreibung                            |
|--------------|---------|-----------------------------------------|
| id           | INTEGER | Primärschlüssel                         |
| nutzer_id    | INTEGER | Fremdschlüssel → nutzer                 |
| gesamt_preis | REAL    |                                         |
| status       | TEXT    | offen/versendet/abgeschlossen/storniert |

---

## Sicherheit

- Passwörter werden mit **SHA-256 + zufälligem Salt** gehasht
- Konto löschen = **Soft Delete** (Daten bleiben erhalten)
- Rollenprüfung bei allen sensiblen Aktionen

---

## Team

- **Chris** — Admin
- **Lee** — Admin
- **Bendix** — Leiter
- **Ramona** — Gast

---

*Cookie Crew Shop © 2026 — Happy Hacking & Licht und Frieden* ✌️
