-- =========================================================
-- Cookino Shop – PostgreSQL Datenbankschema
-- =========================================================


-- =========================================================
-- Rollen
-- =========================================================

CREATE TABLE rollen (
    id            SMALLSERIAL PRIMARY KEY,
    name          VARCHAR(50) NOT NULL UNIQUE,
    beschreibung  TEXT
);


-- =========================================================
-- Nutzer
-- =========================================================

CREATE TABLE nutzer (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rollen_id      SMALLINT NOT NULL
                   REFERENCES rollen(id) ON DELETE RESTRICT,

    vorname        VARCHAR(100) NOT NULL,
    nachname       VARCHAR(100) NOT NULL,
    email          VARCHAR(255) NOT NULL,
    passwort_hash  TEXT NOT NULL,
    aktiv          BOOLEAN NOT NULL DEFAULT TRUE,

    erstellt_am    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Verhindert doppelte E-Mail-Adressen
CREATE UNIQUE INDEX uq_nutzer_email
ON nutzer (LOWER(email));


-- =========================================================
-- Kollektionen
-- =========================================================

CREATE TABLE kollektionen (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(150) NOT NULL UNIQUE,
    slug          VARCHAR(150) NOT NULL UNIQUE,
    aktiv         BOOLEAN NOT NULL DEFAULT TRUE,

    erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- Produkte
-- Beschreibungen und S3-Bildverweise liegen in MongoDB
-- =========================================================

CREATE TABLE produkte (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    kollektion_id   UUID
                     REFERENCES kollektionen(id) ON DELETE SET NULL,

    name             VARCHAR(200) NOT NULL,

    preis            NUMERIC(10, 2) NOT NULL
                     CHECK (preis >= 0),

    aktiv            BOOLEAN NOT NULL DEFAULT TRUE,

    erstellt_am      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_produkte_kollektion
ON produkte (kollektion_id);

CREATE INDEX idx_produkte_aktiv
ON produkte (aktiv);


-- =========================================================
-- Verfügbare Größen
-- =========================================================

CREATE TABLE groessen (
    id            SMALLSERIAL PRIMARY KEY,
    code          VARCHAR(20) NOT NULL UNIQUE,
    anzeigename   VARCHAR(50) NOT NULL,
    sortierung    SMALLINT NOT NULL
);


-- =========================================================
-- Produktvarianten
-- Jede Größe und Farbe besitzt eine eigene Artikelnummer
-- und einen eigenen Lagerbestand
-- =========================================================

CREATE TABLE produkt_varianten (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    produkt_id      UUID NOT NULL
                     REFERENCES produkte(id) ON DELETE RESTRICT,

    groesse_id      SMALLINT NOT NULL
                     REFERENCES groessen(id) ON DELETE RESTRICT,

    farbe           VARCHAR(50) NOT NULL DEFAULT 'Standard',

    artikelnummer   VARCHAR(50) NOT NULL UNIQUE,

    lagerbestand    INTEGER NOT NULL DEFAULT 0
                     CHECK (lagerbestand >= 0),

    aktiv            BOOLEAN NOT NULL DEFAULT TRUE,

    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (produkt_id, groesse_id, farbe)
);

CREATE INDEX idx_varianten_produkt
ON produkt_varianten (produkt_id);

CREATE INDEX idx_varianten_groesse
ON produkt_varianten (groesse_id);

CREATE INDEX idx_varianten_aktiv
ON produkt_varianten (aktiv);


-- =========================================================
-- Warenkörbe
-- =========================================================

CREATE TABLE warenkoerbe (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nutzer_id     UUID NOT NULL
                   REFERENCES nutzer(id) ON DELETE CASCADE,

    status        VARCHAR(20) NOT NULL DEFAULT 'aktiv'
                   CHECK (
                       status IN (
                           'aktiv',
                           'bestellt',
                           'abgebrochen'
                       )
                   ),

    erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Jeder Nutzer darf nur einen aktiven Warenkorb besitzen
CREATE UNIQUE INDEX uq_aktiver_warenkorb
ON warenkoerbe (nutzer_id)
WHERE status = 'aktiv';

CREATE INDEX idx_warenkoerbe_nutzer
ON warenkoerbe (nutzer_id);


-- =========================================================
-- Artikel innerhalb eines Warenkorbs
-- Es wird die konkrete Variante gespeichert
-- Beispiel: Cookino Hoodie, Größe L, Farbe Blau
-- =========================================================

CREATE TABLE warenkorb_artikel (
    warenkorb_id    UUID NOT NULL
                     REFERENCES warenkoerbe(id) ON DELETE CASCADE,

    variante_id     UUID NOT NULL
                     REFERENCES produkt_varianten(id) ON DELETE RESTRICT,

    menge           INTEGER NOT NULL
                     CHECK (menge > 0),

    hinzugefuegt_am TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (warenkorb_id, variante_id)
);

CREATE INDEX idx_warenkorb_artikel_variante
ON warenkorb_artikel (variante_id);


-- =========================================================
-- Bestellungen
-- =========================================================

CREATE TABLE bestellungen (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nutzer_id     UUID NOT NULL
                   REFERENCES nutzer(id) ON DELETE RESTRICT,

    status        VARCHAR(30) NOT NULL DEFAULT 'offen'
                   CHECK (
                       status IN (
                           'offen',
                           'bezahlt',
                           'in_bearbeitung',
                           'versendet',
                           'abgeschlossen',
                           'storniert'
                       )
                   ),

    gesamtpreis   NUMERIC(10, 2) NOT NULL
                   CHECK (gesamtpreis >= 0),

    bestellt_am   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bestellungen_nutzer
ON bestellungen (nutzer_id);

CREATE INDEX idx_bestellungen_status
ON bestellungen (status);


-- =========================================================
-- Artikel innerhalb einer Bestellung
-- Produktdaten werden als Momentaufnahme gespeichert
-- =========================================================

CREATE TABLE bestellung_artikel (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    bestellung_id   UUID NOT NULL
                     REFERENCES bestellungen(id) ON DELETE CASCADE,

    produkt_id      UUID
                     REFERENCES produkte(id) ON DELETE SET NULL,

    variante_id     UUID
                     REFERENCES produkt_varianten(id) ON DELETE SET NULL,

    produktname     VARCHAR(200) NOT NULL,
    artikelnummer   VARCHAR(50) NOT NULL,
    groesse         VARCHAR(50) NOT NULL,
    farbe           VARCHAR(50) NOT NULL,

    menge           INTEGER NOT NULL
                     CHECK (menge > 0),

    einzelpreis     NUMERIC(10, 2) NOT NULL
                     CHECK (einzelpreis >= 0)
);

CREATE INDEX idx_bestellung_artikel_bestellung
ON bestellung_artikel (bestellung_id);

CREATE INDEX idx_bestellung_artikel_produkt
ON bestellung_artikel (produkt_id);