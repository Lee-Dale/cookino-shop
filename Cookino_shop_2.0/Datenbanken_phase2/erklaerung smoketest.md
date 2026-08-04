# Cookino Shop – gemeinsamer Datenbankstand

Dieser Ordner ist die gemeinsame Datenbasis für die drei Python-Module
`shop_main.py`, `konto_shop.py` und `warenkorb.py`.

## Klare Aufteilung

| PostgreSQL | MongoDB | S3 |
|---|---|---|
| Nutzer und Rollen | Produktbeschreibungen | Bilddateien |
| Kollektionen und Produkte | Tags, Material und Pflege | Keine Binärdaten in MongoDB |
| Größen, Varianten und Lager | Kollektionstexte | |
| Warenkörbe und Bestellungen | S3-Keys, Alt-Texte und Bildreihenfolge | |

Die UUID aus PostgreSQL ist der gemeinsame Schlüssel. Beispiel:
`produkte.id` entspricht `produkt_inhalte.produkt_id` und
`medien.produkt_id` in MongoDB.

## Seed-Daten

- PostgreSQL: 4 Rollen, 7 Größen, 3 Kollektionen, 9 Produkte und 21 Varianten
- MongoDB: 9 Produktinhalte, 3 Kollektion-Inhalte und 10 S3-Medienverweise

## Lokal starten

1. `.env.example` als `.env` kopieren.
2. Passwörter in `.env` ändern.
3. Beide Datenbanken starten:

```bash
docker compose up -d
docker compose ps
```

Es werden absichtlich keine Datenbankports am Host veröffentlicht. FastAPI
muss im selben Docker-Netzwerk `cookino_backend` laufen und verwendet dort die
Hosts `postgres` und `mongo`.

Die SQL- und JavaScript-Initialisierungen laufen nur beim ersten Anlegen der
Volumes. Falls bereits alte lokale Test-Volumes existieren und die neuen Seeds
komplett neu geladen werden sollen:

```bash
docker compose down -v
docker compose up -d
```

`down -v` löscht die lokalen Datenbank-Volumes. Nicht auf produktiven Daten
anwenden.

## Verbindung aus Python/FastAPI

Pakete installieren:

```bash
pip install -r requirements.txt
```

Live-Test nach dem Start:

```bash
python db_smoketest.py
```

`shop_main.py` liest bei einem Produkt zuerst Name, Preis, Varianten und Lager
aus PostgreSQL. Danach ergänzt es Beschreibung und S3-Medien aus MongoDB. Es
gibt daher keine doppelte Preis- oder Lagerhaltung.

## Übergabe an Lee / FastAPI

FastAPI muss keine eigenen SQL- oder Mongo-Abfragen enthalten. Es soll die
Funktionen aus den drei Modulen aufrufen:

- Katalog: `alle_kollektionen()`, `alle_produkte()`,
  `artikel_nach_kollektion()` und `produkt_nach_id()` aus `shop_main.py`
- Konto: `registrieren()`, `login()`, `konto_aendern()` und weitere Funktionen
  aus `konto_shop.py`
- Warenkorb: `artikel_hinzufuegen()`, `warenkorb_anzeigen()`,
  `menge_aendern()` und `bestellung_abschliessen()` aus `warenkorb.py`
- Health-Endpunkt: `datenbanken_pruefen()` aus `shop_main.py`

Wichtig für die API: Beim Warenkorb wird eine `produkt_variante_id` verwendet,
nicht nur eine allgemeine `produkt_id`. So sind Größe, Farbe und Lagerbestand
eindeutig.

Minimaler Health-Endpunkt:

```python
from fastapi import FastAPI, HTTPException

from shop_main import datenbanken_pruefen

app = FastAPI()


@app.get("/health")
def health():
    try:
        return {"status": "ok", "datenbanken": datenbanken_pruefen()}
    except Exception:
        raise HTTPException(status_code=503, detail="Datenbank nicht erreichbar")
```

L